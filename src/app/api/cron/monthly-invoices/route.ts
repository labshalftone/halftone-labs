import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

const GST_RATE = parseFloat(process.env.INVOICE_GST_RATE ?? "0.05");
const HALFTONE_GST = process.env.HALFTONE_GST_NUMBER ?? "091DDPPS4109J1ZT";
const HALFTONE_COMPANY = process.env.HALFTONE_COMPANY_NAME ?? "WEAR ADHD";
const HALFTONE_ADDRESS = process.env.HALFTONE_ADDRESS ?? "NT-2/201, Eldeco Utopia, Sector 93A, Noida — 201304, UP";

function getPreviousMonthRange(): { start: string; end: string; monthStr: string } {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth(); // 1-indexed prev month
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const end = new Date(Date.UTC(year, month, 1)).toISOString();
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  return { start, end, monthStr };
}

async function generateInvoiceNumber(db: ReturnType<typeof createAdminClient>): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await db
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .gte("created_at", `${year}-01-01T00:00:00.000Z`);

  const seq = ((count ?? 0) + 1).toString().padStart(4, "0");
  return `HL-${year}-${seq}`;
}

async function sendInvoiceEmail(params: {
  customerEmail: string;
  customerName: string | null;
  invoiceNumber: string;
  month: string;
  total: number;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[monthly-invoices] RESEND_API_KEY not set — skipping email");
    return;
  }

  const { customerEmail, customerName, invoiceNumber, month, total } = params;
  const invoiceUrl = `https://halftonelabs.in/invoice/${encodeURIComponent(invoiceNumber)}`;
  const [year, mon] = month.split("-");
  const monthLabel = new Date(parseInt(year), parseInt(mon) - 1, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Monthly Invoice</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#111111;padding:24px 32px;"><p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111111;">Your invoice for ${monthLabel}</p>
        <p style="margin:0 0 24px;font-size:15px;color:#555555;">Hi ${customerName ?? "there"}, your GST tax invoice is ready for download.</p>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:24px;">
          <tr style="background:#f9f9f9;"><td style="padding:10px 12px;color:#666666;">Invoice Number</td><td style="padding:10px 12px;color:#111111;font-weight:700;text-align:right;">${invoiceNumber}</td></tr>
          <tr><td style="padding:10px 12px;color:#666666;">Period</td><td style="padding:10px 12px;color:#111111;font-weight:700;text-align:right;">${monthLabel}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:10px 12px;color:#666666;">Grand Total (incl. GST)</td><td style="padding:10px 12px;color:#f97316;font-weight:800;font-size:16px;text-align:right;">₹${total.toFixed(2)}</td></tr>
        </table>
        <p style="text-align:center;margin:0 0 8px;">
          <a href="${invoiceUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:6px;">View &amp; Download Invoice</a>
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#888888;text-align:center;">Questions? <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a></p>
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
      subject: `Your Halftone Labs invoice for ${monthLabel} — ${invoiceNumber}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[monthly-invoices] Resend error ${res.status}: ${text}`);
  }
}

export async function GET(req: NextRequest) {
  // Security: verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { start, end, monthStr } = getPreviousMonthRange();

  console.log(`[monthly-invoices] Processing orders for month: ${monthStr} (${start} → ${end})`);

  // Fetch all orders from previous month with a user or email
  const { data: orders, error: ordersError } = await db
    .from("orders")
    .select("id, ref, customer_name, customer_email, user_id, product_name, color, size, print_tier, blank_price, print_price, shipping, total, discount_amount, created_at")
    .gte("created_at", start)
    .lt("created_at", end)
    .or("user_id.not.is.null,customer_email.not.is.null");

  if (ordersError) {
    console.error("[monthly-invoices] Failed to fetch orders:", ordersError);
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    console.log("[monthly-invoices] No orders found for", monthStr);
    return NextResponse.json({ message: "No orders to invoice", month: monthStr });
  }

  // Group orders by user_id or customer_email
  const groups = new Map<string, typeof orders>();
  for (const order of orders) {
    const key = order.user_id ?? order.customer_email ?? "unknown";
    if (key === "unknown") continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(order);
  }

  const results: Array<{ key: string; invoiceNumber?: string; skipped?: boolean; error?: string }> = [];

  for (const [key, groupOrders] of groups) {
    try {
      // Check if monthly invoice already exists
      const { data: existing } = await db
        .from("invoices")
        .select("id, invoice_number")
        .eq("type", "monthly")
        .eq("month", monthStr)
        .or(
          groupOrders[0].user_id
            ? `user_id.eq.${groupOrders[0].user_id}`
            : `customer_email.eq.${groupOrders[0].customer_email}`
        )
        .maybeSingle();

      if (existing) {
        console.log(`[monthly-invoices] Invoice already exists for ${key}: ${existing.invoice_number}`);
        results.push({ key, invoiceNumber: existing.invoice_number, skipped: true });
        continue;
      }

      // Fetch user profile for GST info
      let gstNumber: string | null = null;
      let companyName: string | null = null;
      const firstOrder = groupOrders[0];

      if (firstOrder.user_id) {
        const { data: profile } = await db
          .from("user_profiles")
          .select("gst_number, company_name, name, address_line1, city, pin")
          .eq("user_id", firstOrder.user_id)
          .maybeSingle();
        if (profile) {
          gstNumber = profile.gst_number ?? null;
          companyName = profile.company_name ?? null;
        }
      }

      // Calculate totals
      const subtotal = groupOrders.reduce(
        (sum, o) => sum + (Number(o.blank_price ?? 0) + Number(o.print_price ?? 0)),
        0
      );
      const shippingTotal = groupOrders.reduce((sum, o) => sum + Number(o.shipping ?? 0), 0);
      const gstAmount = Math.round((subtotal + shippingTotal) * GST_RATE * 100) / 100;
      const grandTotal = groupOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

      // Build line items
      const items = groupOrders.map((o) => ({
        description: `${o.product_name ?? "T-Shirt"} — ${o.color ?? ""} / ${o.size ?? ""}${o.print_tier ? ` (${o.print_tier} print)` : ""}`,
        hsn: "610910",
        qty: 1,
        rate: Number(o.blank_price ?? 0) + Number(o.print_price ?? 0),
        cgst_rate: 2.5,
        sgst_rate: 2.5,
        cgst: Math.round((Number(o.blank_price ?? 0) + Number(o.print_price ?? 0)) * 0.025 * 100) / 100,
        sgst: Math.round((Number(o.blank_price ?? 0) + Number(o.print_price ?? 0)) * 0.025 * 100) / 100,
        amount: Number(o.total ?? 0),
        order_ref: o.ref,
        order_id: o.id,
      }));

      const invoiceNumber = await generateInvoiceNumber(db);
      const customerEmail = firstOrder.customer_email ?? "";
      const customerName = firstOrder.customer_name ?? null;

      const { data: invoice, error: insertError } = await db
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          type: "monthly",
          month: monthStr,
          user_id: firstOrder.user_id ?? null,
          customer_email: customerEmail,
          subtotal,
          gst_amount: gstAmount,
          total: grandTotal,
          status: "issued",
          gst_number: gstNumber,
          company_name: companyName ?? HALFTONE_COMPANY,
          customer_name: customerName,
          customer_address: null,
          items,
          issued_at: new Date().toISOString(),
        })
        .select("id, invoice_number")
        .single();

      if (insertError) throw insertError;

      console.log(`[monthly-invoices] Created invoice ${invoiceNumber} for ${key}`);

      // Send email (non-blocking)
      sendInvoiceEmail({
        customerEmail,
        customerName,
        invoiceNumber,
        month: monthStr,
        total: grandTotal,
      }).catch((e) => console.error("[monthly-invoices] email failed:", e));

      results.push({ key, invoiceNumber: invoice.invoice_number });
    } catch (err) {
      console.error(`[monthly-invoices] Error processing ${key}:`, err);
      results.push({ key, error: String(err) });
    }
  }

  return NextResponse.json({ month: monthStr, processed: results.length, results });
}
