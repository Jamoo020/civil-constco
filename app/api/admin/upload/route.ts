import { randomUUID } from "crypto";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import {
  authorizeAdminRequest,
  consumeRateLimit,
} from "../../../../src/lib/admin-security";
import {
  saveProcessedImage,
  UploadStorageConfigurationError,
} from "../../../../src/lib/upload-storage";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type NormalizedImage = {
  buffer: Buffer;
};

async function normalizeImage(file: File): Promise<NormalizedImage> {
  if (!ALLOWED_MIME_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) {
    throw new Error("Unsupported or oversized image.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const image = sharp(input, {
    failOn: "error",
    limitInputPixels: MAX_INPUT_PIXELS,
    animated: false,
  });
  const metadata = await image.metadata();
  const expectedFormat = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
  }[file.type];

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width * metadata.height > MAX_INPUT_PIXELS ||
    metadata.format !== expectedFormat ||
    (metadata.pages || 1) > 1
  ) {
    throw new Error("Unsupported image content.");
  }

  const buffer = await image
    .rotate()
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  return { buffer };
}

async function uploadToFilesystem(images: NormalizedImage[]) {
  const urls: string[] = [];
  for (const image of images) {
    const storedImage = await saveProcessedImage(image.buffer);
    urls.push(storedImage.url);
  }
  return urls;
}

async function uploadToCloudinary(images: NormalizedImage[]) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured.");
  }

  const urls: string[] = [];
  for (const image of images) {
    const form = new FormData();
    const imageBytes = Uint8Array.from(image.buffer);
    form.append(
      "file",
      new Blob([imageBytes], { type: "image/webp" }),
      `${randomUUID()}.webp`
    );
    form.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(20_000),
      }
    );
    if (!response.ok) {
      console.error(`Cloudinary upload failed with status ${response.status}.`);
      throw new Error("Image storage failed.");
    }

    const result = (await response.json()) as { secure_url?: unknown };
    if (
      typeof result.secure_url !== "string" ||
      new URL(result.secure_url).protocol !== "https:"
    ) {
      throw new Error("Image storage returned an invalid URL.");
    }
    urls.push(result.secure_url);
  }
  return urls;
}

export async function POST(request: NextRequest) {
  const authorization = authorizeAdminRequest(request, true);
  if ("response" in authorization) return authorization.response;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return NextResponse.json(
      { error: "Unsupported request format." },
      { status: 415 }
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = Number(contentLengthHeader);
  if (!contentLengthHeader || !Number.isSafeInteger(contentLength)) {
    return NextResponse.json(
      { error: "A valid content length is required." },
      { status: 411 }
    );
  }
  if (contentLength > MAX_TOTAL_BYTES + 1024 * 1024) {
    return NextResponse.json(
      { error: "Upload is too large." },
      { status: 413 }
    );
  }

  try {
    const uploadLimit = consumeRateLimit(
      `upload:${authorization.session.tokenHash}`,
      20,
      60 * 60 * 1000
    );
    if (!uploadLimit.allowed) {
      return NextResponse.json(
        { error: "Upload limit reached. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(uploadLimit.retryAfterSeconds) },
        }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid upload request." },
        { status: 400 }
      );
    }

    const entries = formData.getAll("file");
    if (
      entries.length === 0 ||
      entries.length > MAX_FILES ||
      entries.some((entry) => typeof entry === "string")
    ) {
      return NextResponse.json(
        { error: `Upload between 1 and ${MAX_FILES} image files.` },
        { status: 400 }
      );
    }

    const files = entries.filter(
      (entry): entry is File => typeof entry !== "string"
    );
    if (files.length !== entries.length) {
      return NextResponse.json(
        { error: "Upload image files only." },
        { status: 400 }
      );
    }
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (
      totalBytes > MAX_TOTAL_BYTES ||
      files.some((file) => file.size > MAX_FILE_BYTES)
    ) {
      return NextResponse.json(
        { error: "Upload is too large." },
        { status: 413 }
      );
    }

    const images: NormalizedImage[] = [];
    try {
      for (const file of files) images.push(await normalizeImage(file));
    } catch {
      return NextResponse.json(
        { error: "Only valid JPEG, PNG, or WebP images within the size limits are allowed." },
        { status: 400 }
      );
    }

    const urls =
      process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET
        ? await uploadToCloudinary(images)
        : await uploadToFilesystem(images);

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    if (error instanceof UploadStorageConfigurationError) {
      console.error("Persistent image storage is not configured correctly.");
      return NextResponse.json(
        { error: "Persistent image storage is unavailable." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("Admin image upload failed.");
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
