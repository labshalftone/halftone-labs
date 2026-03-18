import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET() {
  const db = createAdminClient();
  const { data, error } = await db.from("studio_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }
  return NextResponse.json(map);
}
