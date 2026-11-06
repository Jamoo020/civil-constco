import { NextRequest, NextResponse } from "next/server";
import {
  authorizeAdminRequest,
  clearAdminSessionCookie,
  invalidateAdminSession,
} from "../../../../src/lib/admin-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authorization = authorizeAdminRequest(request, true);
  if ("response" in authorization) return authorization.response;

  try {
    invalidateAdminSession(authorization.session);
    const response = NextResponse.json({ success: true });
    response.headers.set("Cache-Control", "no-store");
    clearAdminSessionCookie(response);
    return response;
  } catch {
    console.error("Admin logout could not access security storage.");
    return NextResponse.json(
      { error: "Admin service is temporarily unavailable." },
      { status: 503 }
    );
  }
}
