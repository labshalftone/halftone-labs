/*
-- studio_settings table
create table studio_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

const checkSecret = (req: NextRequest) =>
  req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = createAdminClient();
  const { data, error } = await db.from("studio_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }
  return NextResponse.json(map);
}

export async function PATCH(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { key, value } = body as { key: string; value: unknown };
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  const db = createAdminClient();
  const { data, error } = await db
    .from("studio_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
