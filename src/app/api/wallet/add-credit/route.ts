import { NextRequest, NextResponse } from "next/server";

// POST /api/wallet/add-credit
// Body: { userId, amount }
export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const amountNum = Number(amount);
    if (!amountNum || amountNum < 100 || amountNum > 100000) {
      return NextResponse.json(
        { error: "Amount must be between ₹100 and ₹1,00,000" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amountNum * 100), // paise
      currency: "INR",
      receipt: `wallet_${Date.now()}`,
      notes: {
        userId,
        type: "wallet_topup",
      },
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: amountNum,
      keyId,
    });
  } catch (err) {
    console.error("[wallet/add-credit] error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
