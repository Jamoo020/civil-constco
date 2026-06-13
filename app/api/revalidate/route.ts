import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const SECRET = process.env.REVALIDATE_SECRET || "default-revalidate-secret";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (!secret || secret !== SECRET) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: "Missing path parameter." }, { status: 400 });
  }

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
