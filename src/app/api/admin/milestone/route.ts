import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, orderRef, title, description, status } = await req.json();
  const db = createAdminClient();

  // Add milestone
  const { error: msError } = await db.from("milestones").insert({
    order_id: orderId,
    title,
    description: description ?? "",
  });
  if (msError) return NextResponse.json({ error: msError.message }, { status: 500 });

  // Update order status if provided
  if (status) {
    await db.from("orders").update({ status }).eq("id", orderId);
  }

  // Notify customer via Resend
  try {
    const { data: order } = await db.from("orders").select("customer_email, customer_name, ref").eq("id", orderId).single();
    if (order) {
      const key = process.env.RESEND_API_KEY;
      const ref = orderRef ?? order.ref;
      const trackUrl = `https://halftonelabs.in/track?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(order.customer_email)}`;
      if (key) {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <tr><td style="background:#111111;padding:20px 32px;"><p style="margin:0;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">HALFTONE LABS</p></td></tr>
  <tr><td style="padding:28px 32px 20px;">
    <p style="margin:0 0 4px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;">Order #${ref}</p>
    <p style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111111;line-height:1.2;">${title}</p>
    ${description ? `<p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">${description}</p>` : ""}
    <a href="${trackUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;">View full timeline →</a>
  </td></tr>
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;"/></td></tr>
  <tr><td style="padding:20px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaaaaa;">Questions? <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            from: "Halftone Labs <orders@halftonelabs.in>",
            to: [order.customer_email],
            subject: `Your order #${ref} — ${title}`,
            html,
          }),
        });
      }
    }
  } catch (e) { console.error("[milestone] email error:", e); }

  return NextResponse.json({ success: true });
}
