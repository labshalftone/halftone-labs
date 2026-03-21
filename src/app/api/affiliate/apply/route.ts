/*
 * ── Affiliate Apply API ────────────────────────────────────────────────────────
 *
 * Run the following SQL in your Supabase SQL editor before using this API:
 *
 * -- Affiliates table
 * CREATE TABLE affiliates (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   name          TEXT NOT NULL,
 *   email         TEXT NOT NULL,
 *   website       TEXT,
 *   social_handle TEXT,
 *   reason        TEXT,
 *   code          TEXT NOT NULL UNIQUE,
 *   status        TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected | paused
 *   total_clicks  INTEGER NOT NULL DEFAULT 0,
 *   total_signups INTEGER NOT NULL DEFAULT 0,
 *   total_earned  NUMERIC(12,2) NOT NULL DEFAULT 0,
 *   pending_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
 *   paid_out      NUMERIC(12,2) NOT NULL DEFAULT 0,
 *   created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 *
 * -- Affiliate clicks table
 * CREATE TABLE affiliate_clicks (
 *   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
 *   code         TEXT NOT NULL,
 *   page         TEXT,
 *   ip           TEXT,
 *   created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 *
 * -- Affiliate referrals table
 * CREATE TABLE affiliate_referrals (
 *   id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
 *   referred_user_id UUID REFERENCES auth.users(id),
 *   type            TEXT NOT NULL, -- order | subscription | recurring
 *   amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
 *   commission      NUMERIC(12,2) NOT NULL DEFAULT 0,
 *   status          TEXT NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
 *   description     TEXT,
 *   created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 *
 * -- Enable RLS (service role key bypasses RLS, so these routes work fine)
 * ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return prefix + suffix;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, website, socialHandle, reason } = body as {
      userId: string;
      name: string;
      email: string;
      website?: string;
      socialHandle?: string;
      reason?: string;
    };

    if (!userId || !name || !email) {
      return NextResponse.json(
        { error: "userId, name and email are required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from("affiliates")
      .select("id, code, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Already applied", affiliate: existing },
        { status: 409 }
      );
    }

    // Generate a unique code (retry up to 5 times on collision)
    let code = generateCode(name);
    for (let i = 0; i < 5; i++) {
      const { data: collision } = await supabase
        .from("affiliates")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (!collision) break;
      code = generateCode(name);
    }

    const { data, error } = await supabase
      .from("affiliates")
      .insert({
        user_id: userId,
        name,
        email,
        website: website ?? null,
        social_handle: socialHandle ?? null,
        reason: reason ?? null,
        code,
        status: "pending",
      })
      .select("id, code, status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, code: data.code, affiliate: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
