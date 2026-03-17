import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderRef, razorpayPaymentId, razorpayOrderId,
      product, color, size, printTier, printDimensions,
      blankPrice, printPrice, shipping, total,
      customerName, customerEmail, customerPhone,
      address, city, pin, country, userId,
    } = body;

    const db = createAdminClient();

    // Save order
    const { data: order, error } = await db.from("orders").insert({
      ref: orderRef,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      product_name: product,
      color, size,
      print_tier: printTier ?? null,
      print_dimensions: printDimensions ?? null,
      blank_price: blankPrice,
      print_price: printPrice,
      shipping, total,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      address, city, pin,
      country: country ?? "IN",
      status: "Order Placed",
      user_id: userId ?? null,
    }).select("id").single();

    if (error) throw error;

    // Add first milestone
    await db.from("milestones").insert({
      order_id: order.id,
      title: "Order Placed",
      description: "Payment confirmed. Your order is in our queue.",
    });

    // Send notification email via Formspree
    try {
      await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID ?? "xlgplaja"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `New Order #${orderRef} — Halftone Labs`,
          orderRef, product, color, size,
          print: printTier ? `${printTier} (${printDimensions})` : "No print",
          total: `₹${total}`,
          customer: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: `${address}, ${city} – ${pin}`,
        }),
      });
    } catch {}

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("save-order error:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
