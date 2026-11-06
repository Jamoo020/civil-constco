import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "../../../../src/lib/admin-security";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authorization = authorizeAdminRequest(request);
  if ("response" in authorization) return authorization.response;

  const response = NextResponse.json({
    authenticated: true,
    csrfToken: authorization.session.csrfToken,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
