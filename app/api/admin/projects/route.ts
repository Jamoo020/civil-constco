import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "../../../../src/lib/admin-security";
import {
  createProject,
  createProjectStore,
  deleteProject,
  updateProject,
} from "../../../../src/lib/project-data";
import { ProjectDataError } from "../../../../src/lib/project-validation";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 1024 * 1024;
const projectStore = createProjectStore();
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function readJsonBody(request: NextRequest): Promise<
  | { value: unknown }
  | { error: string; status: number }
> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) {
      return { error: "Invalid content length.", status: 400 };
    }
    if (Number(contentLength) > MAX_REQUEST_BYTES) {
      return { error: "Request is too large.", status: 413 };
    }
  }

  if (!request.body) {
    return { error: "Invalid request payload.", status: 400 };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return { error: "Request is too large.", status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { error: "Unable to read request payload.", status: 400 };
  }

  try {
    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)) };
  } catch {
    return { error: "Invalid JSON request payload.", status: 400 };
  }
}

function errorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ProjectDataError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } }
    );
  }

  console.error(fallbackMessage);
  return NextResponse.json(
    { error: fallbackMessage },
    { status: 500, headers: { "Cache-Control": "no-store" } }
  );
}

function isValidSlug(slug: string | null): slug is string {
  return Boolean(slug && slug.length <= 160 && slugPattern.test(slug));
}

export async function GET(request: NextRequest) {
  const authorization = authorizeAdminRequest(request);
  if ("response" in authorization) return authorization.response;

  try {
    const projects = await projectStore.read();
    return NextResponse.json(
      { projects },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error, "Unable to load projects.");
  }
}

export async function POST(request: NextRequest) {
  const authorization = authorizeAdminRequest(request, true);
  if ("response" in authorization) return authorization.response;

  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return NextResponse.json(
      { error: "Unsupported request format." },
      { status: 415 }
    );
  }

  const parsed = await readJsonBody(request);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  try {
    const project = await createProject(projectStore, parsed.value);
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return errorResponse(error, "Unable to save project.");
  }
}

export async function PUT(request: NextRequest) {
  const authorization = authorizeAdminRequest(request, true);
  if ("response" in authorization) return authorization.response;

  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return NextResponse.json(
      { error: "Unsupported request format." },
      { status: 415 }
    );
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? null;
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "A valid project slug is required for update." },
      { status: 400 }
    );
  }

  const parsed = await readJsonBody(request);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  try {
    const project = await updateProject(projectStore, slug, parsed.value);
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return errorResponse(error, "Unable to update project.");
  }
}

export async function DELETE(request: NextRequest) {
  const authorization = authorizeAdminRequest(request, true);
  if ("response" in authorization) return authorization.response;

  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? null;
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "A valid project slug is required for deletion." },
      { status: 400 }
    );
  }

  try {
    await deleteProject(projectStore, slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete project.");
  }
}
