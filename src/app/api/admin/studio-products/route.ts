/*
-- studio_products table
create table studio_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gsm text,
  description text,
  blank_price integer not null default 0,
  type text not null default 'regular',
  size_guide_key text not null default 'regular',
  colors jsonb not null default '[]',
  active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

const checkSecret = (req: NextRequest) =>
  req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = createAdminClient();
  const { data, error } = await db
    .from("studio_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, gsm, description, blank_price, type, size_guide_key, colors, active, sort_order } = body;
  const db = createAdminClient();
  const { data, error } = await db
    .from("studio_products")
    .insert({
      name,
      gsm: gsm || null,
      description: description || null,
      blank_price: Number(blank_price) || 0,
      type: type || "regular",
      size_guide_key: size_guide_key || "regular",
      colors: colors ?? [],
      active: active !== false,
      sort_order: Number(sort_order) || 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = createAdminClient();
  const { data, error } = await db
    .from("studio_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = createAdminClient();
  const { error } = await db.from("studio_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
