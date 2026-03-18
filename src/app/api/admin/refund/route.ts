// ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_id text;
// ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// ── Cancellation email ────────────────────────────────────────────────────────
async function sendCancellationEmail(p: {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  refundId: string | null;
  isFree: boolean;
  isWalletPayment?: boolean;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[refund] RESEND_API_KEY not set"); return; }

  const { orderRef, customerName, customerEmail, amount, refundId, isFree, isWalletPayment } = p;

  const refundSection = isFree
    ? `<tr><td style="padding:0 32px 24px;">
        <div style="background:#f9f9f9;border-radius:8px;padding:20px 24px;">
          <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">
            This was a free order — no charge was made, so no refund is necessary.
          </p>
        </div>
      </td></tr>`
    : isWalletPayment
      ? `<tr><td style="padding:0 32px 24px;">
          <div style="background:#f0fdf4;border-radius:8px;padding:20px 24px;border:1px solid #bbf7d0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
              <tr>
                <td style="color:#666666;padding:6px 0;border-bottom:1px solid #d1fae5;">Refund amount</td>
                <td style="color:#111111;font-weight:700;padding:6px 0;border-bottom:1px solid #d1fae5;text-align:right;">₹${Number(amount).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="color:#666666;padding:6px 0 0;">Refunded to</td>
                <td style="color:#16a34a;font-weight:700;padding:6px 0 0;text-align:right;">Halftone Wallet</td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-size:13px;color:#15803d;line-height:1.5;">
              Your refund has been credited instantly to your Halftone Wallet. You can use it for your next order.
            </p>
          </div>
        </td></tr>`
      : `<tr><td style="padding:0 32px 24px;">
        <div style="background:#f9f9f9;border-radius:8px;padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
            <tr>
              <td style="color:#666666;padding:6px 0;border-bottom:1px solid #eeeeee;">Refund amount</td>
              <td style="color:#111111;font-weight:700;padding:6px 0;border-bottom:1px solid #eeeeee;text-align:right;">₹${Number(amount).toLocaleString("en-IN")}</td>
            </tr>
            ${refundId ? `<tr>
              <td style="color:#666666;padding:6px 0;border-bottom:1px solid #eeeeee;">Refund ID</td>
              <td style="color:#111111;font-weight:600;font-size:12px;padding:6px 0;border-bottom:1px solid #eeeeee;text-align:right;font-family:monospace;">${refundId}</td>
            </tr>` : ""}
            <tr>
              <td style="color:#666666;padding:6px 0 0;">Timeline</td>
              <td style="color:#111111;font-weight:600;padding:6px 0 0;text-align:right;">5–7 business days</td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:13px;color:#888888;line-height:1.5;">
            The refund will be credited to your original payment method. Please allow 5–7 business days for the amount to reflect in your account.
          </p>
        </div>
      </td></tr>`;

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Order Cancelled</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <tr><td style="background:#111111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
  <tr><td style="background:#dc2626;padding:32px 32px 28px;">
    <p style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">Your order has been cancelled</p>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);">Hi ${customerName ?? "there"}, your order #${orderRef} has been cancelled.</p>
  </td></tr>
  <tr><td style="padding:28px 32px 8px;">
    <p style="margin:0;font-size:15px;color:#333333;line-height:1.7;">
      We're sorry to see this order cancelled. If you have any questions or would like to place a new order, please don't hesitate to reach out to us.
    </p>
  </td></tr>
  ${refundSection}
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
      subject: `Order #${orderRef} has been cancelled`,
      html,
    }),
  });
  if (!res.ok) console.error("[refund] cancellation email failed:", await res.text());
}

// ── POST /api/admin/refund ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, orderRef, razorpayPaymentId, amount, reason } = await req.json();
  if (!orderId || !orderRef) {
    return NextResponse.json({ error: "orderId and orderRef are required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Fetch order to get user_id (needed for wallet refund)
  const { data: orderRow } = await db
    .from("orders")
    .select("user_id")
    .eq("id", orderId)
    .maybeSingle();
  const userId = orderRow?.user_id ?? null;

  // ── Detect payment type ───────────────────────────────────────────────────
  const isWalletPayment =
    razorpayPaymentId?.startsWith("WALLET") ||
    // Fallback: check wallet_transactions for a debit matching this orderRef
    (!razorpayPaymentId && userId && (await db
      .from("wallet_transactions")
      .select("id")
      .eq("user_id", userId)
      .eq("reference_id", orderRef)
      .eq("type", "debit")
      .limit(1)
      .then(({ data }) => (data?.length ?? 0) > 0)));

  const isFree = !razorpayPaymentId && !isWalletPayment;
  let refundId: string | null = null;

  // ── Wallet refund ─────────────────────────────────────────────────────────
  if (isWalletPayment && userId) {
    // Credit back to wallet
    const { data: wallet } = await db
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    const newBalance = Number(wallet?.balance ?? 0) + Number(amount);
    await db.from("wallets").update({
      balance: newBalance,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);

    await db.from("wallet_transactions").insert({
      user_id:      userId,
      amount:       Number(amount),
      type:         "credit",
      description:  `Refund for cancelled order ${orderRef}`,
      reference_id: `REFUND-${orderRef}`,
    });

    refundId = `WALLET-REFUND-${orderRef}`;
  }

  // ── Razorpay refund (only for paid orders) ────────────────────────────────
  if (!isFree && !isWalletPayment) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 });
    }

    const amountInPaise = Math.round(amount * 100);
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const rzRes = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpayPaymentId}/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          speed: "normal",
          notes: { reason: reason ?? "Cancelled by admin" },
        }),
      }
    );

    if (!rzRes.ok) {
      const errText = await rzRes.text();
      console.error("[refund] Razorpay refund failed:", errText);
      return NextResponse.json({ error: `Razorpay refund failed: ${errText}` }, { status: 502 });
    }

    const rzData = await rzRes.json();
    refundId = rzData.id ?? null;
  }

  // ── Update order in DB ────────────────────────────────────────────────────
  const { error: updateErr } = await db
    .from("orders")
    .update({
      status: "Cancelled",
      refund_id: refundId,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // ── Insert milestone ──────────────────────────────────────────────────────
  const milestoneDesc = isFree
    ? "Order cancelled (free order — no refund needed)."
    : isWalletPayment
      ? `₹${Number(amount).toLocaleString("en-IN")} refunded to Halftone Wallet.`
      : `Refund of ₹${Number(amount).toLocaleString("en-IN")} initiated via Razorpay. Refund ID: ${refundId}`;

  await db.from("milestones").insert({
    order_id: orderId,
    title: "Order Cancelled",
    description: milestoneDesc,
  });

  // ── Send cancellation email ───────────────────────────────────────────────
  try {
    const { data: order } = await db
      .from("orders")
      .select("customer_email, customer_name")
      .eq("id", orderId)
      .single();

    if (order) {
      await sendCancellationEmail({
        orderRef,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        amount,
        refundId,
        isFree,
        isWalletPayment: !!isWalletPayment,
      });
    }
  } catch (e) {
    console.error("[refund] email error:", e);
  }

  return NextResponse.json({ success: true, refundId });
}
