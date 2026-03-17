import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const supabase = createAdminClient();

  const { data: store } = await supabase
    .from("artist_stores")
    .select("id")
    .eq("handle", handle)
    .single();

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("store_products")
    .select("*")
    .eq("store_id", store.id)
    .eq("active", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const supabase = createAdminClient();
  const body = await req.json();

  const { data: store } = await supabase
    .from("artist_stores")
    .select("id, user_id")
    .eq("handle", handle)
    .single();

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const {
    product_id, product_name, color_hex, color_name,
    sizes, retail_price_inr, cost_price_inr,
    design_front_url, design_back_url, print_technique,
    description, image_url,
  } = body;

  if (!product_id || !retail_price_inr || !cost_price_inr) {
    return NextResponse.json({ error: "product_id, retail_price_inr, cost_price_inr required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("store_products")
    .insert({
      store_id: store.id,
      product_id, product_name, color_hex, color_name,
      sizes: sizes ?? [],
      retail_price_inr, cost_price_inr,
      fulfillment_fee_inr: 50,
      design_front_url, design_back_url,
      print_technique: print_technique ?? "DTG",
      description: description ?? null,
      image_url: image_url ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  await params;
  const supabase = createAdminClient();
  const productId = req.nextUrl.searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json();
  const { retail_price_inr, description, image_url, sizes, design_front_url, design_back_url } = body;

  const updates: Record<string, unknown> = {};
  if (retail_price_inr !== undefined) updates.retail_price_inr = retail_price_inr;
  if (description       !== undefined) updates.description = description;
  if (image_url         !== undefined) updates.image_url = image_url;
  if (sizes             !== undefined) updates.sizes = sizes;
  if (design_front_url  !== undefined) updates.design_front_url = design_front_url;
  if (design_back_url   !== undefined) updates.design_back_url = design_back_url;

  const { data, error } = await supabase
    .from("store_products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  await params; // consume params
  const supabase = createAdminClient();
  const productId = req.nextUrl.searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("store_products")
    .delete()
    .eq("id", productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
