import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { createHmac } from "crypto";

// POST /api/wallet/verify-payment
// Body: { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount }
export async function POST(req: NextRequest) {
  try {
    const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount } = await req.json();

    if (!userId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
    }

    // Verify HMAC signature
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const amountNum = Number(amount);
    const db = createAdminClient();

    // Idempotency: check if this payment was already processed
    const { data: existing } = await db
      .from("wallet_transactions")
      .select("id")
      .eq("reference_id", razorpayPaymentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      // Already processed — fetch current balance and return success
      const { data: wallet } = await db
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();
      return NextResponse.json({ success: true, newBalance: wallet?.balance ?? 0 });
    }

    // Upsert wallet to ensure it exists
    await db.from("wallets").upsert(
      { user_id: userId, balance: 0, currency: "INR" },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

    // Fetch current balance
    const { data: currentWallet } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    const newBalance = Number(currentWallet?.balance ?? 0) + amountNum;

    // Credit wallet balance
    await db
      .from("wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    // Insert wallet transaction
    await db.from("wallet_transactions").insert({
      user_id: userId,
      amount: amountNum,
      type: "credit",
      description: "Wallet top-up",
      reference_id: razorpayPaymentId,
    });

    return NextResponse.json({ success: true, newBalance });
  } catch (err) {
    console.error("[wallet/verify-payment] error:", err);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
