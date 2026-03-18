// ALTER TABLE orders ADD COLUMN IF NOT EXISTS front_design_url text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS back_design_url text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS mockup_url text;

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

async function uploadDesign(db: ReturnType<typeof createAdminClient>, dataUrl: string, path: string): Promise<string | null> {
  try {
    const [header, base64] = dataUrl.split(",");
    if (!base64) { console.error(`[save-order] uploadDesign: no base64 data for ${path}`); return null; }
    const buffer = Buffer.from(base64, "base64");
    const contentType = header.includes("jpeg") ? "image/jpeg" : "image/png";
    const { error } = await db.storage.from("store-assets").upload(path, buffer, { contentType, upsert: true });
    if (error) { console.error(`[save-order] storage upload failed for ${path}:`, error.message); return null; }
    const { data } = db.storage.from("store-assets").getPublicUrl(path);
    return data.publicUrl;
  } catch (e) { console.error(`[save-order] uploadDesign exception for ${path}:`, e); return null; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderRef, razorpayPaymentId, razorpayOrderId,
      product, color, size, printTier, printDimensions,
      blankPrice, printPrice, shipping, total,
      couponCode, discountAmount,
      frontDesignUrl, backDesignUrl, mockupUrl,
      customerName, customerEmail, customerPhone,
      address, city, pin, country, userId,
    } = body;

    const db = createAdminClient();

    // Upload design files + placement mockup in parallel
    const [frontDesignStorageUrl, backDesignStorageUrl, mockupStorageUrl] = await Promise.all([
      frontDesignUrl ? uploadDesign(db, frontDesignUrl, `designs/${orderRef}/front.png`)    : null,
      backDesignUrl  ? uploadDesign(db, backDesignUrl,  `designs/${orderRef}/back.png`)     : null,
      mockupUrl      ? uploadDesign(db, mockupUrl,      `designs/${orderRef}/mockup.jpg`)   : null,
    ]);

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
      coupon_code: couponCode ?? null,
      discount_amount: discountAmount ?? 0,
      front_design_url: frontDesignStorageUrl,
      back_design_url: backDesignStorageUrl,
      mockup_url: mockupStorageUrl,
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

    // Fire order confirmation email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/email/order-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderRef, customerName, customerEmail,
        product, color, size,
        printTier: printTier ?? "No print",
        total, shipping,
        address, city, pin,
      }),
    }).catch(() => {}); // non-blocking

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
          front_design: frontDesignStorageUrl ?? "none",
          back_design: backDesignStorageUrl ?? "none",
        }),
      });
    } catch {}

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("save-order error:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
