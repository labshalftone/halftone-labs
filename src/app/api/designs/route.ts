import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

async function uploadDataUrl(db: ReturnType<typeof createAdminClient>, dataUrl: string, path: string): Promise<string | null> {
  try {
    const [header, base64] = dataUrl.split(",");
    if (!base64) return null;
    const buffer = Buffer.from(base64, "base64");
    const contentType = header.includes("jpeg") ? "image/jpeg" : "image/png";
    const { error } = await db.storage.from("store-assets").upload(path, buffer, { contentType, upsert: true });
    if (error) { console.error(`[designs] storage upload failed for ${path}:`, error.message); return null; }
    const { data } = db.storage.from("store-assets").getPublicUrl(path);
    return data.publicUrl;
  } catch (e) { console.error(`[designs] upload exception for ${path}:`, e); return null; }
}

// POST /api/designs — save a design
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId, customerEmail, name,
      productId, productName, gsm,
      colorName, colorHex, size,
      printTier, printDims, blankPrice, printPrice,
      hasDesign, thumbnail,
      frontDesignDataUrl, backDesignDataUrl,
    } = body;

    if (!userId && !customerEmail) {
      return NextResponse.json({ error: "userId or customerEmail required" }, { status: 400 });
    }

    const db = createAdminClient();

    // Insert design row first to get the ID
    const { data, error } = await db.from("designs").insert({
      user_id:        userId ?? null,
      customer_email: customerEmail?.toLowerCase().trim() ?? null,
      name:           name || `${productName} – ${colorName}`,
      product_id:     productId,
      product_name:   productName,
      gsm,
      color_name:     colorName,
      color_hex:      colorHex,
      size,
      print_tier:     printTier || null,
      print_dims:     printDims || null,
      blank_price:    blankPrice ?? 0,
      print_price:    printPrice ?? 0,
      has_design:     hasDesign ?? false,
      thumbnail:      thumbnail ?? null,
    }).select("id").single();

    if (error) throw error;

    const designId = data.id;

    // Upload raw design files to storage in parallel (non-blocking — don't fail save if uploads fail)
    const [frontUrl, backUrl] = await Promise.all([
      frontDesignDataUrl ? uploadDataUrl(db, frontDesignDataUrl, `designs/${designId}/front.png`) : null,
      backDesignDataUrl  ? uploadDataUrl(db, backDesignDataUrl,  `designs/${designId}/back.png`)  : null,
    ]);

    // Update row with design file URLs if we got them
    if (frontUrl || backUrl) {
      await db.from("designs").update({
        ...(frontUrl ? { front_design_url: frontUrl } : {}),
        ...(backUrl  ? { back_design_url:  backUrl  } : {}),
      }).eq("id", designId);
    }

    return NextResponse.json({ success: true, designId });
  } catch (err) {
    console.error("save-design error:", err);
    return NextResponse.json({ error: "Failed to save design" }, { status: 500 });
  }
}

// GET /api/designs?userId=...&email=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const email  = searchParams.get("email")?.toLowerCase().trim();

  if (!userId && !email) {
    return NextResponse.json({ error: "userId or email required" }, { status: 400 });
  }

  const db = createAdminClient();
  let query = db.from("designs").select("*").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  else if (email) query = query.eq("customer_email", email);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// DELETE /api/designs?id=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("designs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
