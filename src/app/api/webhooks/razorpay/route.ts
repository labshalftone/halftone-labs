import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  // Always return 200 so Razorpay stops retrying
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Razorpay webhook: invalid signature");
      return NextResponse.json({ status: "invalid_signature" }, { status: 200 });
    }

    const event = JSON.parse(rawBody);

    const db = createAdminClient();

    // ── Subscription lifecycle events ──────────────────────────────────────
    if (event.event === "subscription.activated") {
      const sub = event?.payload?.subscription?.entity ?? {};
      const { id: subId, plan_id, notes = {} } = sub;
      await db.from("subscriptions").upsert({
        razorpay_subscription_id: subId,
        razorpay_plan_id:         plan_id,
        user_id:                  notes.userId ?? null,
        plan:                     notes.plan ?? "unknown",
        billing:                  notes.billing ?? "monthly",
        status:                   "active",
        updated_at:               new Date().toISOString(),
      }, { onConflict: "razorpay_subscription_id" });
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    if (event.event === "subscription.charged") {
      const sub = event?.payload?.subscription?.entity ?? {};
      const pmt = event?.payload?.payment?.entity ?? {};
      await db.from("subscriptions").update({
        status:              "active",
        razorpay_payment_id: pmt.id ?? null,
        updated_at:          new Date().toISOString(),
      }).eq("razorpay_subscription_id", sub.id);
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    if (event.event === "subscription.cancelled" || event.event === "subscription.completed") {
      const sub = event?.payload?.subscription?.entity ?? {};
      await db.from("subscriptions").update({
        status:     event.event === "subscription.cancelled" ? "cancelled" : "expired",
        updated_at: new Date().toISOString(),
      }).eq("razorpay_subscription_id", sub.id);
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    if (event.event !== "payment.captured") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const entity = event?.payload?.payment?.entity ?? {};
    const {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount,
      email,
      contact,
      notes = {},
    } = entity;

    // Idempotency check — skip if order already saved
    const { data: existing } = await db
      .from("orders")
      .select("id")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ status: "duplicate" }, { status: 200 });
    }

    const ref = `HL${Date.now().toString(36).toUpperCase()}`;

    const { data: order, error } = await db
      .from("orders")
      .insert({
        ref,
        razorpay_order_id,
        razorpay_payment_id,
        total: amount / 100,
        customer_email: email ?? null,
        customer_phone: contact ?? null,
        status: "Order Placed",
        customer_name: notes.customerName ?? null,
        address: notes.address ?? null,
        city: notes.city ?? null,
        pin: notes.pin ?? null,
        country: notes.country ?? "IN",
        product_name: notes.product ?? null,
        user_id: notes.userId ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;

    // Insert first milestone
    await db.from("milestones").insert({
      order_id: order.id,
      title: "Order Placed",
      description: "Payment confirmed via webhook.",
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    // Still return 200 to prevent Razorpay from retrying indefinitely
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
