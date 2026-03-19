// SQL to create the table (run once in Supabase SQL editor):
// CREATE TABLE IF NOT EXISTS hl_customers (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id text NOT NULL,
//   name text NOT NULL,
//   email text,
//   phone text,
//   address1 text,
//   address2 text,
//   city text,
//   state text,
//   pin text,
//   country text DEFAULT 'IN',
//   notes text,
//   created_at timestamptz DEFAULT now()
// );
// CREATE INDEX IF NOT EXISTS hl_customers_user_id_idx ON hl_customers(user_id);

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("hl_customers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, name, email, phone, address1, address2, city, state, pin, country, notes } = body;
  if (!userId || !name) return NextResponse.json({ error: "userId and name required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("hl_customers")
    .insert({ user_id: userId, name, email: email || null, phone: phone || null, address1: address1 || null, address2: address2 || null, city: city || null, state: state || null, pin: pin || null, country: country || "IN", notes: notes || null })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, userId, ...fields } = body;
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("hl_customers")
    .update(fields)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("hl_customers").delete().eq("id", id).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
