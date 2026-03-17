import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

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
    } = body;

    if (!userId && !customerEmail) {
      return NextResponse.json({ error: "userId or customerEmail required" }, { status: 400 });
    }

    const db = createAdminClient();
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
    return NextResponse.json({ success: true, designId: data.id });
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
