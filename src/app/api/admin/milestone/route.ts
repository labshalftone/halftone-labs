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

  // Notify customer via Formspree
  try {
    const { data: order } = await db.from("orders").select("customer_email, customer_name, ref").eq("id", orderId).single();
    if (order) {
      await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID ?? "xlgplaja"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Order Update #${orderRef ?? order.ref} — ${title}`,
          to: order.customer_email,
          name: order.customer_name,
          update: title,
          details: description,
          orderRef: orderRef ?? order.ref,
          trackUrl: `https://halftonelabs.in/track?ref=${orderRef ?? order.ref}`,
        }),
      });
    }
  } catch {}

  return NextResponse.json({ success: true });
}
