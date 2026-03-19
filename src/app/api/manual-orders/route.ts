import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// Sends order confirmation to the MERCHANT only — never to the end customer.
async function sendMerchantConfirmation(params: {
  orderRef: string;
  merchantEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  colorName: string;
  sizeName: string;
  printTier: string;
  total: number;
  shippingAmount: number;
  address: string;
  city: string;
  pin: string;
  country: string;
  note: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const { orderRef, merchantEmail, customerName, customerEmail, customerPhone,
    productName, colorName, sizeName, printTier, total, shippingAmount,
    address, city, pin, country, note } = params;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Manual Order Created</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <tr><td style="background:#111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#fff;letter-spacing:-.5px;">HALFTONE LABS</p></td></tr>
      <tr><td style="background:#f97316;padding:28px 32px;">
        <p style="margin:0 0 6px;font-size:24px;font-weight:800;color:#fff;">Manual order created ✓</p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,.9);">Order <strong>#${orderRef}</strong> has been placed from your dashboard and is queued for fulfilment.</p>
      </td></tr>
      <tr><td style="padding:20px 32px 8px;">
        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.8px;">Order Reference</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#111;letter-spacing:1px;">#${orderRef}</p>
      </td></tr>
      <tr><td style="padding:8px 32px;"><hr style="border:none;border-top:1px solid #eee;"/></td></tr>
      <tr><td style="padding:0 32px 20px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:.6px;">Product</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr style="background:#f9f9f9;"><td style="color:#666;padding:8px 12px;border-bottom:1px solid #eee;">Product</td><td style="color:#111;font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${productName}</td></tr>
          <tr><td style="color:#666;padding:8px 12px;border-bottom:1px solid #eee;">Colour</td><td style="color:#111;font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${colorName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="color:#666;padding:8px 12px;border-bottom:1px solid #eee;">Size</td><td style="color:#111;font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${sizeName}</td></tr>
          <tr><td style="color:#666;padding:8px 12px;border-bottom:1px solid #eee;">Print</td><td style="color:#111;font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${printTier || "No print"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="color:#666;padding:8px 12px;border-bottom:1px solid #eee;">Shipping</td><td style="color:#111;font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${shippingAmount}</td></tr>
          <tr><td style="color:#111;font-weight:700;font-size:15px;padding:10px 12px;">Total</td><td style="color:#f97316;font-weight:800;font-size:16px;padding:10px 12px;text-align:right;">₹${total}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 32px 20px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:.6px;">Ship To</p>
        <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">${customerName}<br/>${customerEmail ? `${customerEmail}<br/>` : ""}${customerPhone ? `${customerPhone}<br/>` : ""}${address}${city ? `, ${city}` : ""}${pin ? ` — ${pin}` : ""}${country && country !== "IN" ? `, ${country}` : ""}</p>
        ${note ? `<p style="margin:8px 0 0;font-size:13px;color:#666;font-style:italic;">Note: ${note}</p>` : ""}
      </td></tr>
      <tr><td style="padding:0 32px 28px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#888;">This order was placed manually from the Halftone Labs dashboard. The customer has <strong>not</strong> been notified.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "Halftone Labs <orders@halftonelabs.in>",
      to: [merchantEmail],
      subject: `Manual order #${orderRef} confirmed ✓`,
      html,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      merchantEmail,
      designId,
      productName, colorName, sizeName,
      blankPrice, printPrice,
      frontDesignUrl, backDesignUrl, thumbnail,
      printTier, printTechnique,
      shippingOption, shippingAmount,
      customerName, customerEmail, customerPhone,
      address1, address2, city, state, pin, country,
      note,
      saveCustomer,
    } = body;

    if (!userId || !productName || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = createAdminClient();

    // Build order ref
    const orderRef = `HLM-${Date.now().toString(36).toUpperCase()}`;

    const shipping  = Number(shippingAmount ?? 0);
    const blankAmt  = Number(blankPrice ?? 0);
    const printAmt  = Number(printPrice ?? 0);
    const subtotal  = blankAmt + printAmt;
    const GST_RATE  = 0.05;
    const gst       = Math.round(subtotal * GST_RATE);
    const total     = subtotal + shipping + gst;

    // Check wallet balance
    const { data: wallet } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    const balance = wallet?.balance ?? 0;
    if (balance < total) {
      return NextResponse.json({ error: `Insufficient wallet balance. Need ₹${total}, have ₹${balance}.` }, { status: 400 });
    }

    // Debit wallet atomically
    const { error: debitError } = await db
      .from("wallets")
      .update({ balance: balance - total })
      .eq("user_id", userId)
      .gte("balance", total);

    if (debitError) {
      return NextResponse.json({ error: "Wallet debit failed: " + debitError.message }, { status: 500 });
    }

    // Record wallet transaction
    await db.from("wallet_transactions").insert({
      user_id: userId,
      amount: -total,
      type: "debit",
      description: `Manual order ${orderRef} — ${productName} ${sizeName}`,
    });

    // Save order
    const { data: order, error: orderError } = await db.from("orders").insert({
      ref: orderRef,
      product_name: productName,
      color: colorName,
      size: sizeName,
      print_tier: printTier ?? null,
      blank_price: blankAmt,
      print_price: printAmt,
      shipping,
      total,
      front_design_url: frontDesignUrl ?? null,
      back_design_url: backDesignUrl ?? null,
      mockup_url: thumbnail ?? null,
      customer_name: customerName,
      customer_email: customerEmail ?? null,
      customer_phone: customerPhone ?? null,
      address: [address1, address2].filter(Boolean).join(", "),
      city: city ?? null,
      pin: pin ?? null,
      country: country ?? "IN",
      status: "Order Placed",
      user_id: userId,
    }).select("id").single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Milestone
    await db.from("milestones").insert({
      order_id: order.id,
      title: "Order Placed",
      description: "Manual order placed from dashboard. Queued for fulfilment.",
    });

    // Optionally save customer to CRM
    if (saveCustomer && customerName) {
      try {
        await db.from("hl_customers").upsert({
          user_id: userId,
          name: customerName,
          email: customerEmail ?? null,
          phone: customerPhone ?? null,
          address1: address1 ?? null,
          address2: address2 ?? null,
          city: city ?? null,
          state: state ?? null,
          pin: pin ?? null,
          country: country ?? "IN",
        }, { onConflict: "user_id,email", ignoreDuplicates: false });
      } catch {
        // Non-fatal — table may not exist yet
      }
    }

    // Merchant email (non-blocking)
    if (merchantEmail) {
      sendMerchantConfirmation({
        orderRef,
        merchantEmail,
        customerName,
        customerEmail: customerEmail ?? "",
        customerPhone: customerPhone ?? "",
        productName,
        colorName,
        sizeName,
        printTier: printTier ?? "",
        total,
        shippingAmount: shipping,
        address: [address1, address2].filter(Boolean).join(", "),
        city: city ?? "",
        pin: pin ?? "",
        country: country ?? "IN",
        note: note ?? "",
      }).catch((e) => console.error("[manual-orders] email failed:", e));
    }

    return NextResponse.json({ success: true, orderRef, orderId: order.id, total });
  } catch (err) {
    console.error("[manual-orders] error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
