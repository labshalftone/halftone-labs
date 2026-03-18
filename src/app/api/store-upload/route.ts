import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

/*
  Supabase setup:
  1. Go to Storage → New bucket → name: "store-assets" → Public: true
  2. No additional policies needed (admin client bypasses RLS)
*/

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let buffer: Buffer;
    let fileName: string;
    let mimeType: string;

    if (contentType.includes("multipart/form-data")) {
      // Preferred: multipart form upload (no base64 overhead, no body size issues)
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      fileName = file.name;
      mimeType = file.type || "image/jpeg";
    } else {
      // Fallback: base64 JSON (small payloads like thumbnails only)
      const body = await req.json();
      const { fileName: fn, base64, contentType: ct } = body;
      if (!base64 || !fn) {
        return NextResponse.json({ error: "fileName and base64 required" }, { status: 400 });
      }
      const raw = (base64 as string).includes(",") ? (base64 as string).split(",")[1] : base64;
      buffer = Buffer.from(raw, "base64");
      fileName = fn;
      mimeType = ct ?? "image/jpeg";
    }

    const supabase = createAdminClient();
    const ext = fileName.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("store-assets")
      .upload(path, buffer, { contentType: mimeType, upsert: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from("store-assets")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("store-upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
