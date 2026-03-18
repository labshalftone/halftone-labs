import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

// GET /api/admin/wallet — list all wallets with user info + last 10 transactions each
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminClient();

  // Wallets
  const { data: wallets, error: wErr } = await db
    .from("wallets")
    .select("id, user_id, balance, currency, updated_at, created_at")
    .order("balance", { ascending: false });

  if (wErr) return NextResponse.json({ error: wErr.message }, { status: 500 });

  // User profiles (to get name + email)
  const { data: profiles } = await db
    .from("user_profiles")
    .select("user_id, customer_email, name, company_name");

  const profileMap: Record<string, { email: string | null; name: string | null; company: string | null }> = {};
  for (const p of profiles ?? []) {
    if (p.user_id) profileMap[p.user_id] = { email: p.customer_email, name: p.name, company: p.company_name };
  }

  // All transactions (sorted newest first)
  const { data: txns } = await db
    .from("wallet_transactions")
    .select("id, user_id, amount, type, description, reference_id, created_at")
    .order("created_at", { ascending: false });

  const txnsByUser: Record<string, typeof txns> = {};
  for (const t of txns ?? []) {
    if (!txnsByUser[t.user_id]) txnsByUser[t.user_id] = [];
    txnsByUser[t.user_id]!.push(t);
  }

  const result = (wallets ?? []).map((w) => ({
    ...w,
    email:   profileMap[w.user_id]?.email   ?? null,
    name:    profileMap[w.user_id]?.name    ?? null,
    company: profileMap[w.user_id]?.company ?? null,
    transactions: (txnsByUser[w.user_id] ?? []).slice(0, 20),
  }));

  return NextResponse.json(result);
}

// POST /api/admin/wallet — credit or debit a user's wallet
// Body: { userId, amount, type: 'credit' | 'debit', description }
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, amount, type, description } = await req.json();

  if (!userId || !amount || !type || !["credit", "debit"].includes(type)) {
    return NextResponse.json({ error: "userId, amount, and type (credit|debit) required" }, { status: 400 });
  }

  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  const db = createAdminClient();

  // Ensure wallet row exists
  await db.from("wallets").upsert(
    { user_id: userId, balance: 0, currency: "INR" },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  if (type === "credit") {
    // Add to balance
    const { data: wallet, error: fetchErr } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (fetchErr || !wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const { error: updateErr } = await db
      .from("wallets")
      .update({ balance: wallet.balance + amt, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
  } else {
    // Debit — check balance first
    const { data: wallet, error: fetchErr } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (fetchErr || !wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    if (wallet.balance < amt) {
      return NextResponse.json({ error: `Insufficient balance (₹${wallet.balance.toFixed(2)})` }, { status: 402 });
    }

    const { error: updateErr } = await db
      .from("wallets")
      .update({ balance: wallet.balance - amt, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Insert transaction record
  const { error: txnErr } = await db.from("wallet_transactions").insert({
    user_id:      userId,
    amount:       amt,
    type,
    description:  description ?? (type === "credit" ? "Admin credit" : "Admin debit"),
    reference_id: `admin-${Date.now()}`,
  });

  if (txnErr) return NextResponse.json({ error: txnErr.message }, { status: 500 });

  // Return updated balance
  const { data: updated } = await db.from("wallets").select("balance").eq("user_id", userId).single();
  return NextResponse.json({ success: true, newBalance: updated?.balance ?? 0 });
}
