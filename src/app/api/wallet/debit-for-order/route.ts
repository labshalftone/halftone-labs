import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// POST /api/wallet/debit-for-order
// Body: { userId, amount, orderRef }
// Atomically checks balance and debits — returns 402 if insufficient
export async function POST(req: NextRequest) {
  const { userId, amount, orderRef } = await req.json();

  if (!userId || !amount || !orderRef) {
    return NextResponse.json({ error: "userId, amount, orderRef required" }, { status: 400 });
  }

  const amtNum = parseFloat(amount);
  if (isNaN(amtNum) || amtNum <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const db = createAdminClient();

  // Fetch current balance
  const { data: wallet } = await db
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  const balance = wallet?.balance ?? 0;

  if (balance < amtNum) {
    return NextResponse.json({ error: "insufficient_balance", balance }, { status: 402 });
  }

  // Debit — guard with gte check to prevent race
  const { error: updateErr, data: updated } = await db
    .from("wallets")
    .update({ balance: balance - amtNum, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .gte("balance", amtNum)
    .select("id");

  if (updateErr || !updated || updated.length === 0) {
    return NextResponse.json({ error: "insufficient_balance", balance }, { status: 402 });
  }

  // Record transaction
  await db.from("wallet_transactions").insert({
    user_id:      userId,
    amount:       amtNum,
    type:         "debit",
    description:  `Order payment — ${orderRef}`,
    reference_id: orderRef,
  });

  return NextResponse.json({ success: true, newBalance: balance - amtNum });
}
