import { NextRequest, NextResponse } from "next/server";
import {
  clearRateLimit,
  consumeRateLimit,
  createAdminSession,
  getClientRateLimitKey,
  isAdminConfigured,
  isAllowedAdminOrigin,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "../../../../src/lib/admin-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAllowedAdminOrigin(request)) {
    return NextResponse.json(
      { error: "Request could not be verified." },
      { status: 403 }
    );
  }

  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return NextResponse.json(
      { error: "Unsupported request format." },
      { status: 415 }
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 503 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 }
    );
  }

  const clientKey = getClientRateLimitKey(request);
  try {
    const clientLimit = consumeRateLimit(`login:client:${clientKey}`, 5, 15 * 60 * 1000);
    const globalLimit = consumeRateLimit("login:global", 50, 15 * 60 * 1000);
    if (!clientLimit.allowed || !globalLimit.allowed) {
      const retryAfter = Math.max(
        clientLimit.retryAfterSeconds,
        globalLimit.retryAfterSeconds
      );
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    const password =
      body && typeof body === "object" && typeof body.password === "string"
        ? body.password
        : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    clearRateLimit(`login:client:${clientKey}`);
    const session = createAdminSession();
    const response = NextResponse.json({
      success: true,
      csrfToken: session.csrfToken,
    });
    response.headers.set("Cache-Control", "no-store");
    setAdminSessionCookie(response, session.token);
    return response;
  } catch {
    console.error("Admin sign-in could not access security storage.");
    return NextResponse.json(
      { error: "Admin service is temporarily unavailable." },
      { status: 503 }
    );
  }
}
