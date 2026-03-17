import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

/*
  SQL — run in Supabase SQL editor:

  create table artist_stores (
    id uuid primary key default gen_random_uuid(),
    handle text unique not null,
    artist_name text not null,
    description text,
    instagram text,
    user_id uuid references auth.users(id),
    active boolean default true,
    created_at timestamptz default now()
  );

  create table store_products (
    id uuid primary key default gen_random_uuid(),
    store_id uuid references artist_stores(id) on delete cascade,
    product_id text not null,
    product_name text not null,
    color_hex text not null,
    color_name text not null,
    sizes text[] not null,
    retail_price_inr integer not null,
    cost_price_inr integer not null,
    fulfillment_fee_inr integer not null default 50,
    design_front_url text,
    design_back_url text,
    print_technique text default 'DTG',
    active boolean default true,
    created_at timestamptz default now()
  );

  create table referrals (
    id uuid primary key default gen_random_uuid(),
    referrer_user_id uuid references auth.users(id),
    referral_code text unique not null,
    referred_user_id uuid references auth.users(id),
    order_id text,
    credit_amount_inr integer,
    credited boolean default false,
    created_at timestamptz default now()
  );
*/

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("artist_stores")
    .select("id, handle, artist_name, description, instagram, created_at")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { handle, artist_name, description, instagram, user_id } = body;

  if (!handle || !artist_name) {
    return NextResponse.json({ error: "handle and artist_name required" }, { status: 400 });
  }

  // Validate handle format
  if (!/^[a-z0-9-]+$/.test(handle)) {
    return NextResponse.json({ error: "Handle must be lowercase letters, numbers, and hyphens only" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("artist_stores")
    .insert({ handle, artist_name, description, instagram, user_id })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That handle is already taken" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
