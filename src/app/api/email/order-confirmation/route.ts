import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderRef,
      customerName,
      customerEmail,
      product,
      color,
      size,
      printTier,
      total,
      shipping,
      address,
      city,
      pin,
    } = body;

    const trackUrl = `https://halftonelabs.in/track?ref=${encodeURIComponent(orderRef)}&email=${encodeURIComponent(customerEmail)}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Halftone Labs</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                HALFTONE LABS
              </p>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:#f97316;padding:32px 32px 28px;">
              <p style="margin:0 0 8px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                Your order is confirmed ✓
              </p>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);">
                Hey ${customerName ?? "there"}, thanks for your order. We'll get it ready and shipped in 5–7 days.
              </p>
            </td>
          </tr>

          <!-- Order ref badge -->
          <tr>
            <td style="padding:20px 32px 4px;">
              <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;">Order Reference</p>
              <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#111111;letter-spacing:1px;">#${orderRef}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:16px 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;" /></td></tr>

          <!-- Order details table -->
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Order Details</p>
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                <tr style="background:#f9f9f9;">
                  <td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Product</td>
                  <td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${product ?? "—"}</td>
                </tr>
                <tr>
                  <td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Color</td>
                  <td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${color ?? "—"}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Size</td>
                  <td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${size ?? "—"}</td>
                </tr>
                <tr>
                  <td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Print</td>
                  <td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">${printTier ?? "No print"}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="color:#666666;padding:10px 12px;border-bottom:1px solid #eeeeee;">Shipping</td>
                  <td style="color:#111111;font-weight:600;padding:10px 12px;border-bottom:1px solid #eeeeee;text-align:right;">₹${shipping ?? 0}</td>
                </tr>
                <tr>
                  <td style="color:#111111;font-weight:700;font-size:15px;padding:12px 12px;">Total</td>
                  <td style="color:#f97316;font-weight:800;font-size:16px;padding:12px 12px;text-align:right;">₹${total}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 32px 24px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;" /></td></tr>

          <!-- Shipping address -->
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.6px;">Shipping To</p>
              <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">
                ${customerName ?? ""}<br />
                ${address ?? ""}<br />
                ${city ?? ""}${pin ? ` — ${pin}` : ""}
              </p>
            </td>
          </tr>

          <!-- Track CTA -->
          <tr>
            <td style="padding:0 32px 36px;" align="center">
              <a href="${trackUrl}"
                 style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:6px;letter-spacing:0.3px;">
                Track Your Order
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eeeeee;margin:0;" /></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#888888;">
                Questions? Email us at
                <a href="mailto:hello@halftonelabs.in" style="color:#f97316;text-decoration:none;">hello@halftonelabs.in</a>
              </p>
              <p style="margin:0;font-size:13px;color:#888888;">
                Follow us on
                <a href="https://instagram.com/halftonelabs" style="color:#f97316;text-decoration:none;">@halftonelabs</a>
              </p>
              <p style="margin:16px 0 0;font-size:11px;color:#bbbbbb;">
                © ${new Date().getFullYear()} Halftone Labs. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Halftone Labs <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `Your order #${orderRef} is confirmed ✓`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error("Resend error:", resendRes.status, errorText);
      return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    }

    const data = await resendRes.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("order-confirmation email error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
