/*
SQL to run in Supabase:

ALTER TABLE drops
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS store_id uuid,
  ADD COLUMN IF NOT EXISTS organization_id uuid,
  ADD COLUMN IF NOT EXISTS countdown_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS end_at timestamptz,
  ADD COLUMN IF NOT EXISTS archive_when_ended boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS waitlist_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS waitlist_cta text,
  ADD COLUMN IF NOT EXISTS whatsapp_optin boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS preorder_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cod_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS shipping_estimate text,
  ADD COLUMN IF NOT EXISTS limited_qty boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS inventory_amount int,
  ADD COLUMN IF NOT EXISTS featured_product_id uuid;

ALTER TABLE drop_products
  ADD COLUMN IF NOT EXISTS sort_order int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS quantity_limit int;

CREATE TABLE IF NOT EXISTS drop_waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id uuid NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  whatsapp_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(drop_id, email)
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops?userId=...&storeId=...&status=...
export async function GET(req: NextRequest) {
  const userId  = req.nextUrl.searchParams.get("userId");
  const storeId = req.nextUrl.searchParams.get("storeId");
  const status  = req.nextUrl.searchParams.get("status");

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  let query = db
    .from("drops")
    .select("*, drop_products(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (storeId) query = query.eq("store_id", storeId);
  if (status)  query = query.eq("status", status);

  const { data: drops, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const normalized = (drops ?? []).map((d: Record<string, unknown>) => {
    const dp = d.drop_products as { count: number }[] | null;
    const product_count = Array.isArray(dp) && dp.length > 0 ? Number(dp[0].count) : 0;
    const { drop_products: _r, ...rest } = d;
    return { ...rest, product_count };
  });

  return NextResponse.json(normalized);
}

// POST /api/drops — create a drop
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId, title, slug, description, status, storeId, organizationId,
    launchAt, endAt, coverImageUrl, countdownEnabled, archiveWhenEnded,
    waitlistEnabled, waitlistCta, whatsappOptin, preorderEnabled,
    codEnabled, shippingEstimate, limitedQty, inventoryAmount,
  } = body;

  if (!userId || !title) return NextResponse.json({ error: "userId and title required" }, { status: 400 });

  const db = createAdminClient();
  const cleanSlug = (slug ?? title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const { data, error } = await db.from("drops").insert({
    user_id:             userId,
    title,
    slug:                cleanSlug,
    description:         description ?? null,
    status:              status ?? "draft",
    store_id:            storeId ?? null,
    organization_id:     organizationId ?? null,
    launch_at:           launchAt ?? null,
    end_at:              endAt ?? null,
    cover_image_url:     coverImageUrl ?? null,
    countdown_enabled:   countdownEnabled ?? false,
    archive_when_ended:  archiveWhenEnded ?? false,
    waitlist_enabled:    waitlistEnabled ?? false,
    waitlist_cta:        waitlistCta ?? null,
    whatsapp_optin:      whatsappOptin ?? false,
    preorder_enabled:    preorderEnabled ?? false,
    cod_enabled:         codEnabled ?? false,
    shipping_estimate:   shippingEstimate ?? null,
    limited_qty:         limitedQty ?? false,
    inventory_amount:    inventoryAmount ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, drop: data });
}

// PATCH /api/drops — update a drop
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, userId, ...fields } = body;
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });

  // Map camelCase to snake_case
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const MAP: Record<string, string> = {
    title: "title", slug: "slug", description: "description", status: "status",
    storeId: "store_id", organizationId: "organization_id",
    launchAt: "launch_at", endAt: "end_at", coverImageUrl: "cover_image_url",
    countdownEnabled: "countdown_enabled", archiveWhenEnded: "archive_when_ended",
    waitlistEnabled: "waitlist_enabled", waitlistCta: "waitlist_cta",
    whatsappOptin: "whatsapp_optin", preorderEnabled: "preorder_enabled",
    codEnabled: "cod_enabled", shippingEstimate: "shipping_estimate",
    limitedQty: "limited_qty", inventoryAmount: "inventory_amount",
    endedAt: "ended_at",
  };
  for (const [k, v] of Object.entries(fields)) {
    if (MAP[k]) update[MAP[k]] = v;
  }

  const db = createAdminClient();
  const { data, error } = await db.from("drops").update(update).eq("id", id).eq("user_id", userId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, drop: data });
}

// DELETE /api/drops?id=...&userId=...
export async function DELETE(req: NextRequest) {
  const id     = req.nextUrl.searchParams.get("id");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("drops").delete().eq("id", id).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
