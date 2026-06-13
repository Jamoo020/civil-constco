import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const message = body?.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Your inquiry has been received. We will respond shortly." });
}
