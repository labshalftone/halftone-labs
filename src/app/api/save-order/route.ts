// ALTER TABLE orders ADD COLUMN IF NOT EXISTS front_design_url text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS back_design_url text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS mockup_url text;

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";


// ── Order confirmation email ───────────────────────────────────────────────────
async function sendConfirmationEmail(params: {
  orderRef: string; customerName: string; customerEmail: string;
  product: string; color: string; size: string; printTier: string;
  total: number; shipping: number; address: string; city: string; pin: string;
}) {
  const { orderRef, customerName, customerEmail, product, color, size, printTier, total, shipping, address, city, pin } = params;
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[save-order] RESEND_API_KEY not set — skipping confirmation email"); return; }

  const trackUrl = `https://halftonelabs.in/track?ref=${encodeURIComponent(orderRef)}&email=${encodeURIComponent(customerEmail)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#111111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
      <tr><td style="background:#f97316;padding:32px 32px 28px;">
        <p style="margin:0 0 8px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">Your order is confirmed ✓</p>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);">Hey ${customerName ?? "there"}, thanks for your order. We'll get it ready and shipped in 5–7 days.</p>
      </td></tr>
      <tr><td style="padding:20px 32px 4px;">
        <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;">Order Reference</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#111111;letter-spacing:1px;">#${orderRef}</p>
      </td></tr>
      <tr><td style="padding:16px 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"/></td></tr>
      <tr><td style="padding:0 32px 24px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Order Details</p>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Product</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${product ?? "—"}</td></tr>
          <tr><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Colour</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${color ?? "—"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Size</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${size ?? "—"}</td></tr>
          <tr><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Print</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${printTier ?? "No print"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Shipping</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">₹${shipping ?? 0}</td></tr>
          <tr><td style="color:#111111;font-weight:700;font-size:15px;padding:12px 12px;">Total</td><td style="color:#f97316;font-weight:800;font-size:16px;padding:12px 12px;text-align:right;">₹${total}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 32px 24px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"/></td></tr>
      <tr><td style="padding:0 32px 28px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Shipping To</p>
        <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">${customerName ?? ""}<br/>${address ?? ""}<br/>${city ?? ""}${pin ? ` — ${pin}` : ""}</p>
      </td></tr>
      <tr><td style="padding:0 32px 36px;" align="center">
        <a href="${trackUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:6px;letter-spacing:0.3px;">Track Your Order</a>
      </td></tr>
      <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"/></td></tr>
      <tr><td style="padding:24px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;color:#888888;">Questions? <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a></p>
        <p style="margin:0;font-size:13px;color:#888888;">Follow us <a href="https://instagram.com/halftonelabs" style="color:#f97316;text-decoration:none;">@halftonelabs</a></p>
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
      subject: `Your order #${orderRef} is confirmed ✓`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

async function uploadDesign(db: ReturnType<typeof createAdminClient>, urlOrDataUrl: string, path: string): Promise<string | null> {
  try {
    let buffer: Buffer;
    let contentType: string;

    if (urlOrDataUrl.startsWith("data:")) {
      // data URL — decode base64
      const [header, base64] = urlOrDataUrl.split(",");
      if (!base64) { console.error(`[save-order] uploadDesign: no base64 data for ${path}`); return null; }
      buffer = Buffer.from(base64, "base64");
      contentType = header.includes("jpeg") ? "image/jpeg" : "image/png";
    } else {
      // Regular URL (e.g. Supabase storage URL) — fetch it
      const res = await fetch(urlOrDataUrl);
      if (!res.ok) { console.error(`[save-order] uploadDesign: fetch failed for ${path}: ${res.status}`); return null; }
      const arrayBuf = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
      contentType = res.headers.get("content-type") ?? "image/png";
    }

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
      neckLabel,
      frontDesignUrl, backDesignUrl, mockupUrl,
      customerName, customerEmail, customerPhone,
      address, city, pin, country, userId,
    } = body;

    const db = createAdminClient();

    // Debug: log what we received
    console.log(`[save-order] ${orderRef} — frontDesignUrl: ${frontDesignUrl ? `${frontDesignUrl.slice(0, 30)}… (${frontDesignUrl.length} chars)` : "null"}`);
    console.log(`[save-order] ${orderRef} — backDesignUrl: ${backDesignUrl ? `${backDesignUrl.slice(0, 30)}… (${backDesignUrl.length} chars)` : "null"}`);
    console.log(`[save-order] ${orderRef} — mockupUrl: ${mockupUrl ? `${mockupUrl.slice(0, 30)}… (${mockupUrl.length} chars)` : "null"}`);

    // Upload design files + placement mockup in parallel
    const [frontDesignStorageUrl, backDesignStorageUrl, mockupStorageUrl] = await Promise.all([
      frontDesignUrl ? uploadDesign(db, frontDesignUrl, `designs/${orderRef}/front.png`)    : null,
      backDesignUrl  ? uploadDesign(db, backDesignUrl,  `designs/${orderRef}/back.png`)     : null,
      mockupUrl      ? uploadDesign(db, mockupUrl,      `designs/${orderRef}/mockup.jpg`)   : null,
    ]);

    console.log(`[save-order] ${orderRef} — uploads: front=${frontDesignStorageUrl ? "OK" : "null"}, back=${backDesignStorageUrl ? "OK" : "null"}, mockup=${mockupStorageUrl ? "OK" : "null"}`);

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
      neck_label: neckLabel ?? false,
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

    // Auto-create GST invoice for this order (non-blocking)
    (async () => {
      try {
        const GST_RATE = parseFloat(process.env.INVOICE_GST_RATE ?? "0.05");
        const year = new Date().getFullYear();

        // Fetch user profile for GST info
        let gstNumber: string | null = null;
        let gstCompanyName: string | null = null;
        if (userId) {
          const { data: profile } = await db
            .from("user_profiles")
            .select("gst_number, company_name")
            .eq("user_id", userId)
            .maybeSingle();
          if (profile) {
            gstNumber = profile.gst_number ?? null;
            gstCompanyName = profile.company_name ?? null;
          }
        }

        // Generate invoice number: count invoices this year + 1
        const { count: invCount } = await db
          .from("invoices")
          .select("id", { count: "exact", head: true })
          .gte("created_at", `${year}-01-01T00:00:00.000Z`);
        const seq = (((invCount ?? 0) + 1)).toString().padStart(4, "0");
        const invoiceNumber = `HL-${year}-${seq}`;

        const itemSubtotal = Number(blankPrice ?? 0) + Number(printPrice ?? 0);
        const cgst = Math.round(itemSubtotal * 0.025 * 100) / 100;
        const sgst = Math.round(itemSubtotal * 0.025 * 100) / 100;
        const invoiceSubtotal = itemSubtotal;
        const gstAmount = Math.round((itemSubtotal + Number(shipping ?? 0)) * GST_RATE * 100) / 100;

        const items = [
          {
            description: `${product ?? "T-Shirt"} — ${color ?? ""} / ${size ?? ""}${printTier ? ` with ${printTier} print` : ""}`,
            hsn: "610910",
            qty: 1,
            rate: itemSubtotal,
            cgst_rate: 2.5,
            sgst_rate: 2.5,
            cgst,
            sgst,
            amount: itemSubtotal + cgst + sgst,
            order_ref: orderRef,
          },
        ];

        if (Number(shipping ?? 0) > 0) {
          const shippingAmt = Number(shipping);
          const sCgst = Math.round(shippingAmt * 0.025 * 100) / 100;
          const sSgst = Math.round(shippingAmt * 0.025 * 100) / 100;
          items.push({
            description: "Shipping & Handling",
            hsn: "996812",
            qty: 1,
            rate: shippingAmt,
            cgst_rate: 2.5,
            sgst_rate: 2.5,
            cgst: sCgst,
            sgst: sSgst,
            amount: shippingAmt + sCgst + sSgst,
            order_ref: orderRef,
          });
        }

        await db.from("invoices").insert({
          invoice_number: invoiceNumber,
          type: "order",
          order_id: order.id,
          user_id: userId ?? null,
          customer_email: customerEmail?.toLowerCase().trim() ?? null,
          subtotal: invoiceSubtotal,
          gst_amount: gstAmount,
          total: Number(total ?? 0),
          status: "issued",
          gst_number: gstNumber,
          company_name: gstCompanyName,
          customer_name: customerName ?? null,
          customer_address: `${address ?? ""}, ${city ?? ""} - ${pin ?? ""}`,
          items,
          issued_at: new Date().toISOString(),
        });

        console.log(`[save-order] Invoice ${invoiceNumber} created for order ${orderRef}`);
      } catch (e) {
        console.error("[save-order] invoice creation failed:", e);
      }
    })().catch((e) => console.error("[save-order] invoice block failed:", e));

    // Fire order confirmation email directly via Resend (non-blocking)
    sendConfirmationEmail({
      orderRef, customerName, customerEmail,
      product, color, size,
      printTier: printTier ?? "No print",
      total, shipping, address, city, pin,
    }).catch((e) => console.error("[save-order] confirmation email failed:", e));

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
