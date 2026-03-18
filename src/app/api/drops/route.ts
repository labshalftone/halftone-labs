/*
-- Run in Supabase SQL editor:
-- CREATE TABLE IF NOT EXISTS drops (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id uuid NOT NULL,
--   title text NOT NULL,
--   description text,
--   status text NOT NULL DEFAULT 'draft', -- draft | live | scheduled | ended
--   launch_at timestamptz,
--   ended_at timestamptz,
--   cover_image_url text,
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );
-- CREATE TABLE IF NOT EXISTS drop_products (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   drop_id uuid NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
--   design_id uuid NOT NULL,
--   created_at timestamptz DEFAULT now(),
--   UNIQUE(drop_id, design_id)
-- );
*/

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops?userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  const { data: drops, error } = await db
    .from("drops")
    .select("*, drop_products(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Normalize design_count from the nested count aggregate
  const normalized = (drops ?? []).map((d: Record<string, unknown>) => {
    const dp = d.drop_products as { count: number }[] | null;
    const design_count = Array.isArray(dp) && dp.length > 0 ? Number(dp[0].count) : 0;
    const { drop_products: _removed, ...rest } = d;
    return { ...rest, design_count };
  });

  return NextResponse.json(normalized);
}

// POST /api/drops — create a drop
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, description, status, launch_at } = body;
    if (!userId || !title) {
      return NextResponse.json({ error: "userId and title required" }, { status: 400 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("drops")
      .insert({
        user_id: userId,
        title,
        description: description ?? null,
        status: status ?? "draft",
        launch_at: launch_at ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, drop: data });
  } catch (err) {
    console.error("[drops/POST]", err);
    return NextResponse.json({ error: "Failed to create drop" }, { status: 500 });
  }
}

// PATCH /api/drops — update a drop
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, title, description, status, launch_at, ended_at } = body;
    if (!id || !userId) {
      return NextResponse.json({ error: "id and userId required" }, { status: 400 });
    }

    const db = createAdminClient();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (status !== undefined) update.status = status;
    if (launch_at !== undefined) update.launch_at = launch_at;
    if (ended_at !== undefined) update.ended_at = ended_at;

    const { data, error } = await db
      .from("drops")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, drop: data });
  } catch (err) {
    console.error("[drops/PATCH]", err);
    return NextResponse.json({ error: "Failed to update drop" }, { status: 500 });
  }
}

// DELETE /api/drops?id=...&userId=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  if (!id || !userId) {
    return NextResponse.json({ error: "id and userId required" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("drops")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
