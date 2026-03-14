import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If keys not set, return a mock order ID (dev/testing mode)
    if (!keyId || !keySecret) {
      return NextResponse.json({
        orderId: `order_test_${Date.now()}`,
        amount: 0,
      });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const body = await req.json();
    const { amount, notes } = body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // ₹ to paise
      currency: "INR",
      receipt: `hl_${Date.now()}`,
      notes,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
