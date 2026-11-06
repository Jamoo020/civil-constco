import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "../../../src/lib/admin-security";

export const runtime = "nodejs";

const publicPagePaths = new Set([
  "/",
  "/projects",
  "/services",
  "/company",
  "/locations",
  "/contact",
  "/careers",
  "/blog",
]);

function isAllowedPath(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith("/") || value.includes("%")) {
    return false;
  }
  if (publicPagePaths.has(value)) return true;
  return /^\/(projects|services|locations|blog)\/[a-z0-9-]+$/.test(value);
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

  const body = await request.json().catch(() => null);
  const routePath =
    body && typeof body === "object" ? body.path : undefined;
  if (!isAllowedPath(routePath)) {
    return NextResponse.json(
      { error: "Path is not eligible for revalidation." },
      { status: 400 }
    );
  }

  revalidatePath(routePath);
  return NextResponse.json({ revalidated: true, path: routePath });
}
