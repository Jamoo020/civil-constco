import type { FileHandle } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  isUploadFilename,
  openStoredImage,
  UploadStorageConfigurationError,
} from "../../../src/lib/upload-storage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ filename: string }>;
};

function streamImage(fileHandle: FileHandle) {
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = Buffer.allocUnsafe(64 * 1024);
        const { bytesRead } = await fileHandle.read(chunk, 0, chunk.length, null);
        if (bytesRead === 0) {
          await fileHandle.close();
          controller.close();
          return;
        }
        controller.enqueue(chunk.subarray(0, bytesRead));
      } catch (error) {
        try {
          await fileHandle.close();
        } catch (closeError) {
          controller.error(new AggregateError([error, closeError]));
          return;
        }
        controller.error(error);
      }
    },
    async cancel() {
      await fileHandle.close();
    },
  });
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { filename } = await params;
  if (!isUploadFilename(filename)) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const image = await openStoredImage(filename);
    if (!image) {
      return new NextResponse(null, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const body = streamImage(image.fileHandle);
    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(image.size),
        "Content-Type": "image/webp",
        "Last-Modified": image.lastModified.toUTCString(),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof UploadStorageConfigurationError) {
      console.error("Persistent image storage is not configured correctly.");
      return NextResponse.json(
        { error: "Persistent image storage is unavailable." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("Stored image could not be read.");
    return NextResponse.json(
      { error: "Image is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
