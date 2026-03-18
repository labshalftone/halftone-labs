/*
-- Run in Supabase SQL editor:
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  balance numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'INR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL,
  description text,
  reference_id text,
  created_at timestamptz DEFAULT now()
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/wallet?userId=...
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Upsert wallet row (creates if not exists)
  const { error: upsertError } = await db.from("wallets").upsert(
    { user_id: userId, balance: 0, currency: "INR" },
    { onConflict: "user_id", ignoreDuplicates: true }
  );
  if (upsertError) {
    console.error("[wallet] upsert error:", upsertError.message);
  }

  // Fetch wallet
  const { data: wallet, error: walletError } = await db
    .from("wallets")
    .select("balance, currency")
    .eq("user_id", userId)
    .single();

  if (walletError || !wallet) {
    return NextResponse.json({ error: "Failed to load wallet" }, { status: 500 });
  }

  // Fetch recent transactions
  const { data: transactions } = await db
    .from("wallet_transactions")
    .select("id, amount, type, description, reference_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    balance: wallet.balance,
    currency: wallet.currency,
    transactions: transactions ?? [],
  });
}
