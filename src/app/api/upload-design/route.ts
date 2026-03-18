import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// Accepts a raw file upload (multipart/form-data) and stores it in
// store-assets/temp-designs/{randomId}.{ext}.
// Returns { url } — a small Supabase public URL to replace the large data URL.

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type === "image/jpeg" ? "jpg"
              : file.type === "image/webp"  ? "webp"
              : "png";

    const id  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = `temp-designs/${id}.${ext}`;

    const db = createAdminClient();
    const { error } = await db.storage
      .from("store-assets")
      .upload(path, buffer, { contentType: file.type || "image/png", upsert: false });

    if (error) {
      console.error("[upload-design] storage error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = db.storage.from("store-assets").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[upload-design] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
