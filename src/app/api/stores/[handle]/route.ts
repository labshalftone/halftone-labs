import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const supabase = createAdminClient();

  const { data: store, error } = await supabase
    .from("artist_stores")
    .select(`*, store_products(*)`)
    .eq("handle", handle)
    .eq("active", true)
    .single();

  if (error || !store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const supabase = createAdminClient();
  const body = await req.json();
  const { user_id, ...updates } = body;

  const { data: store } = await supabase
    .from("artist_stores")
    .select("id, user_id")
    .eq("handle", handle)
    .single();

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
  if (store.user_id !== user_id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { data, error } = await supabase
    .from("artist_stores")
    .update(updates)
    .eq("id", store.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
