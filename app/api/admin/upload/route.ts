import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

async function uploadToFilesystem(files: any[]) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const urls: string[] = [];

  for (const f of files) {
    // @ts-ignore
    const name = f.name || `upload-${Date.now()}`;
    // @ts-ignore
    const arrayBuffer = await f.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = `${Date.now()}-${name.replace(/[^a-z0-9._-]/gi, "-")}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);
    urls.push(`/uploads/${safeName}`);
  }

  return urls;
}

async function uploadToCloudinary(files: any[]) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // unsigned preset
  if (!cloudName || !uploadPreset) throw new Error("Cloudinary not configured");

  const urls: string[] = [];

  for (const f of files) {
    // @ts-ignore
    const name = f.name || `upload-${Date.now()}`;
    // @ts-ignore
    const arrayBuffer = await f.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const form = new FormData();
    form.append("file", blob, name);
    form.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload failed: ${text}`);
    }
    const data = await res.json();
    urls.push(data.secure_url || data.url);
  }

  return urls;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    // Prefer Cloudinary (unsigned preset) when configured, otherwise write to public/uploads
    let urls: string[] = [];
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
        urls = await uploadToCloudinary(files);
      } else {
        urls = await uploadToFilesystem(files);
      }
    } catch (err) {
      // if cloud upload fails, attempt filesystem fallback
      try {
        urls = await uploadToFilesystem(files);
      } catch (err2) {
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, urls });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
