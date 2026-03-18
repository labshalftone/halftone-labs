import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops/products?dropId=...
export async function GET(req: NextRequest) {
  const dropId = req.nextUrl.searchParams.get("dropId");
  if (!dropId) return NextResponse.json({ error: "dropId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("drop_products")
    .select("*, designs(id, name, product_name, color_name, thumbnail, front_design_url)")
    .eq("drop_id", dropId)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/drops/products — add a design to a drop
export async function POST(req: NextRequest) {
  const { dropId, designId, isFeatured, sortOrder } = await req.json();
  if (!dropId || !designId) return NextResponse.json({ error: "dropId and designId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db.from("drop_products").upsert(
    { drop_id: dropId, design_id: designId, is_featured: isFeatured ?? false, sort_order: sortOrder ?? 0 },
    { onConflict: "drop_id,design_id" }
  ).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, dropProduct: data });
}

// DELETE /api/drops/products?dropId=...&designId=...
export async function DELETE(req: NextRequest) {
  const dropId   = req.nextUrl.searchParams.get("dropId");
  const designId = req.nextUrl.searchParams.get("designId");
  if (!dropId || !designId) return NextResponse.json({ error: "dropId and designId required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("drop_products").delete().eq("drop_id", dropId).eq("design_id", designId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
