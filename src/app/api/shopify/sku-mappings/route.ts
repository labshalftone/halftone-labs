import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/shopify/sku-mappings?userId=...
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("sku_mappings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/shopify/sku-mappings  — upsert a mapping
export async function POST(req: NextRequest) {
  const {
    userId, shopifySku,
    hlProductId, hlProductName, hlColorName, hlColorHex, hlSize, hlGsm, hlBlankPrice,
  } = await req.json();

  if (!userId || !shopifySku || !hlProductId) {
    return NextResponse.json({ error: "userId, shopifySku, hlProductId required" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db.from("sku_mappings").upsert({
    user_id:          userId,
    shopify_sku:      shopifySku.trim(),
    hl_product_id:    hlProductId,
    hl_product_name:  hlProductName,
    hl_color_name:    hlColorName,
    hl_color_hex:     hlColorHex,
    hl_size:          hlSize,
    hl_gsm:           hlGsm,
    hl_blank_price:   hlBlankPrice ?? 0,
  }, { onConflict: "user_id,shopify_sku" }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, mapping: data });
}

// DELETE /api/shopify/sku-mappings?id=...
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("sku_mappings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
