import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// Simple confirmation email for wallet-paid Shopify orders
async function sendWalletConfirmationEmail(params: {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  colorName: string;
  sizeName: string;
  totalInr: number;
}) {
  const { orderRef, customerName, customerEmail, productName, colorName, sizeName, totalInr } = params;
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[shopify/confirm] RESEND_API_KEY not set — skipping email"); return; }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#111111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
      <tr><td style="background:#f97316;padding:32px 32px 28px;">
        <p style="margin:0 0 8px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">Your order is confirmed ✓</p>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);">Hey ${customerName ?? "there"}, your Shopify order has been confirmed. We'll get it ready and shipped in 5–7 days.</p>
      </td></tr>
      <tr><td style="padding:20px 32px 4px;">
        <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;">Order Reference</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#111111;letter-spacing:1px;">#${orderRef}</p>
      </td></tr>
      <tr><td style="padding:16px 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"/></td></tr>
      <tr><td style="padding:0 32px 24px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Order Details</p>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Product</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${productName ?? "—"}</td></tr>
          <tr><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Colour</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${colorName ?? "—"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Size</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${sizeName ?? "—"}</td></tr>
          <tr><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Payment</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">Halftone Wallet</td></tr>
          <tr><td style="color:#111111;font-weight:700;font-size:15px;padding:12px 12px;">Total</td><td style="color:#f97316;font-weight:800;font-size:16px;padding:12px 12px;text-align:right;">₹${totalInr}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 32px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#888888;">Questions? <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a></p>
        <p style="margin:16px 0 0;font-size:11px;color:#bbbbbb;">© ${new Date().getFullYear()} Halftone Labs. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "Halftone Labs <orders@halftonelabs.in>",
      to: [customerEmail],
      subject: `Your order ${orderRef} is confirmed`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

// POST /api/shopify/orders/confirm
// Body: { userId, shopifyOrderId, shopifyOrderNumber, lineItems, shippingAddress, customerEmail,
//         customerName, useWallet?, totalInr?, productName?, colorName?, sizeName?,
//         shippingAmount?, customerPhone? }
export async function POST(req: NextRequest) {
  const {
    userId, shopifyOrderId, shopifyOrderNumber,
    lineItems, shippingAddress, customerEmail, customerName,
    useWallet, totalInr, productName, colorName, sizeName,
    shippingAmount, customerPhone,
  } = await req.json();

  if (!userId || !shopifyOrderId) {
    return NextResponse.json({ error: "userId and shopifyOrderId required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Generate HL order reference for this Shopify order
  const hlOrderRef = `HLSFY-${shopifyOrderNumber?.replace("#", "") ?? Date.now()}`;

  // ── Wallet payment path ────────────────────────────────────────────────────
  if (useWallet) {
    const amountInr = Number(totalInr ?? 0);
    if (!amountInr || amountInr <= 0) {
      return NextResponse.json({ error: "totalInr required for wallet payment" }, { status: 400 });
    }

    // 1. Get wallet balance
    const { data: wallet } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    const currentBalance = Number(wallet?.balance ?? 0);
    if (!wallet || currentBalance < amountInr) {
      return NextResponse.json(
        { error: "insufficient_balance", balance: currentBalance },
        { status: 402 }
      );
    }

    // 2a. Debit wallet — only update if balance still sufficient (atomic check)
    const newBalance = currentBalance - amountInr;
    const { error: debitError, data: debitData } = await db
      .from("wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .gte("balance", amountInr)
      .select("id");

    if (debitError || !debitData || debitData.length === 0) {
      // Re-fetch balance to report accurate figure
      const { data: freshWallet } = await db
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
      return NextResponse.json(
        { error: "insufficient_balance", balance: Number(freshWallet?.balance ?? 0) },
        { status: 402 }
      );
    }

    // 2b. Insert debit transaction
    await db.from("wallet_transactions").insert({
      user_id: userId,
      amount: amountInr,
      type: "debit",
      description: `Shopify order ${shopifyOrderNumber ?? hlOrderRef}`,
      reference_id: hlOrderRef,
    });

    // 2c. Create order in orders table
    const { data: newOrder, error: orderError } = await db.from("orders").insert({
      ref: hlOrderRef,
      product_name: productName ?? null,
      color: colorName ?? null,
      size: sizeName ?? null,
      total: amountInr,
      shipping: shippingAmount ?? 0,
      blank_price: 0,
      print_price: 0,
      customer_name: customerName ?? null,
      customer_email: customerEmail ?? null,
      customer_phone: customerPhone ?? null,
      address: shippingAddress?.address1 ?? null,
      city: shippingAddress?.city ?? null,
      pin: shippingAddress?.zip ?? null,
      country: shippingAddress?.country_code ?? "IN",
      status: "Order Placed",
      user_id: userId,
      razorpay_payment_id: null,
      razorpay_order_id: null,
    }).select("id").single();

    if (orderError) {
      console.error("[shopify/confirm] order insert error:", orderError.message);
      // Don't fail the whole thing — still upsert shopify_orders below
    }

    // 2d. Insert milestone
    if (newOrder?.id) {
      await db.from("milestones").insert({
        order_id: newOrder.id,
        title: "Order Placed",
        description: "Paid via Halftone Wallet.",
      });
    }

    // 2e. Send confirmation email (non-blocking)
    if (customerEmail) {
      sendWalletConfirmationEmail({
        orderRef: hlOrderRef,
        customerName: customerName ?? "there",
        customerEmail,
        productName: productName ?? "Custom Tee",
        colorName: colorName ?? "",
        sizeName: sizeName ?? "",
        totalInr: amountInr,
      }).catch((e) => console.error("[shopify/confirm] email failed:", e));
    }
  }

  // 3. Upsert shopify_orders (always, wallet or not)
  const { error } = await db.from("shopify_orders").upsert({
    user_id:              userId,
    shopify_order_id:     String(shopifyOrderId),
    shopify_order_number: shopifyOrderNumber,
    customer_name:        customerName ?? null,
    customer_email:       customerEmail ?? null,
    line_items:           lineItems,
    shipping_address:     shippingAddress ?? null,
    status:               "confirmed",
    confirmed_at:         new Date().toISOString(),
    hl_order_ref:         hlOrderRef,
    updated_at:           new Date().toISOString(),
  }, { onConflict: "user_id,shopify_order_id" });

  if (error) {
    console.error("[shopify/confirm] DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, hlOrderRef });
}
