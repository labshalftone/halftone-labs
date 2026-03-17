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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
