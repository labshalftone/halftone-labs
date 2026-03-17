import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

/*
  Supabase setup:
  1. Go to Storage → New bucket → name: "store-assets" → Public: true
  2. No additional policies needed (admin client bypasses RLS)
*/

export async function POST(req: NextRequest) {
  try {
    const { fileName, base64, contentType } = await req.json();
    if (!base64 || !fileName) {
      return NextResponse.json({ error: "fileName and base64 required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Strip data URL prefix if present
    const raw = base64.includes(",") ? base64.split(",")[1] : base64;
    const buffer = Buffer.from(raw, "base64");

    // Unique path to avoid collisions
    const ext = fileName.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("store-assets")
      .upload(path, buffer, { contentType: contentType ?? "image/png", upsert: false });

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
