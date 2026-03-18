// ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// ── Courier → tracking URL templates ─────────────────────────────────────────
export const COURIER_LIST = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "Xpressbees",
  "Ecom Express",
  "Shadow Fax",
  "Ekart",
  "Shiprocket",
  "Other",
] as const;

const TRACKING_URLS: Partial<Record<string, string>> = {
  "Delhivery":    "https://www.delhivery.com/track?param={AWB}",
  "Blue Dart":    "https://www.bluedart.com/tracking?SEARCH=S&STRING={AWB}",
  "DTDC":         "https://www.dtdc.in/trace/tracking.asp?txtsNo={AWB}",
  "Ecom Express": "https://ecomexpress.in/tracking?awb_field={AWB}",
  "Shadow Fax":   "https://track.shadowfax.in/?awb={AWB}",
  "Ekart":        "https://ekartlogistics.com/shipmenttrack/{AWB}",
};

export function getCourierTrackingUrl(courier: string, awb: string): string {
  const tpl = TRACKING_URLS[courier];
  if (!tpl) return "";
  return tpl.replace("{AWB}", encodeURIComponent(awb));
}

// ── Shipped email ─────────────────────────────────────────────────────────────
async function sendShippedEmail(p: {
  orderRef: string; customerName: string; customerEmail: string;
  courier: string; trackingNumber: string; courierTrackingUrl: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[tracking] RESEND_API_KEY not set"); return; }

  const { orderRef, customerName, customerEmail, courier, trackingNumber, courierTrackingUrl } = p;
  const trackUrl = `https://halftonelabs.in/track?ref=${encodeURIComponent(orderRef)}&email=${encodeURIComponent(customerEmail)}`;

  const courierBtn = courierTrackingUrl
    ? `<tr><td style="padding:0 32px 12px;" align="center"><a href="${courierTrackingUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;">Track on ${courier} →</a></td></tr>`
    : "";

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Order Shipped</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <tr><td style="background:#111111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
  <tr><td style="background:#2563eb;padding:32px 32px 28px;">
    <p style="margin:0 0 8px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">Your order is on its way! 🚚</p>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);">Hey ${customerName ?? "there"}, great news — your order #${orderRef} has been shipped and is heading your way.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 16px;">
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Shipping Details</p>
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
      <tr style="background:#f9f9f9;"><td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Courier</td><td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${courier}</td></tr>
      <tr><td style="color:#666666;padding:10px 12px;">AWB / Tracking No.</td><td style="color:#111111;font-weight:700;font-size:15px;padding:10px 12px;text-align:right;letter-spacing:1px;">${trackingNumber}</td></tr>
    </table>
  </td></tr>
  ${courierBtn}
  <tr><td style="padding:0 32px 28px;" align="center">
    <a href="${trackUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;">View Order Status</a>
  </td></tr>
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;"/></td></tr>
  <tr><td style="padding:20px 32px;text-align:center;">
    <p style="margin:0 0 6px;font-size:13px;color:#888888;">Questions? <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a></p>
    <p style="margin:16px 0 0;font-size:11px;color:#bbbbbb;">© ${new Date().getFullYear()} Halftone Labs. All rights reserved.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "Halftone Labs <orders@halftonelabs.in>",
      to: [customerEmail],
      subject: `Your order #${orderRef} has been shipped 🚚`,
      html,
    }),
  });
  if (!res.ok) console.error("[tracking] shipped email failed:", await res.text());
}

// ── POST /api/admin/tracking ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, courier, trackingNumber } = await req.json();
  if (!orderId || !courier || !trackingNumber) {
    return NextResponse.json({ error: "orderId, courier and trackingNumber are required" }, { status: 400 });
  }

  const db = createAdminClient();
  const courierTrackingUrl = getCourierTrackingUrl(courier, trackingNumber);

  // 1. Update order
  const { error: updateErr } = await db
    .from("orders")
    .update({ courier, tracking_number: trackingNumber, status: "Shipped" })
    .eq("id", orderId);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // 2. Add milestone
  const milestoneDesc = [
    `${courier} · AWB: ${trackingNumber}`,
    courierTrackingUrl ? `Track: ${courierTrackingUrl}` : "",
  ].filter(Boolean).join(" · ");

  await db.from("milestones").insert({ order_id: orderId, title: "Shipped", description: milestoneDesc });

  // 3. Send email
  try {
    const { data: order } = await db
      .from("orders")
      .select("customer_email, customer_name, ref")
      .eq("id", orderId)
      .single();
    if (order) {
      await sendShippedEmail({
        orderRef: order.ref, customerName: order.customer_name, customerEmail: order.customer_email,
        courier, trackingNumber, courierTrackingUrl,
      });
    }
  } catch (e) { console.error("[tracking] email error:", e); }

  return NextResponse.json({ success: true });
}
