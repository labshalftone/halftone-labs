import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

/**
 * Cancels a Razorpay subscription at end of current billing period.
 * Access is preserved until the period ends — no immediate loss of features.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const db = createAdminClient();

    // Fetch active subscription
    const { data: sub, error: fetchErr } = await db
      .from("subscriptions")
      .select("id, razorpay_subscription_id, plan")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchErr || !sub) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Cancel in Razorpay (cancel_at_cycle_end: 1 = graceful, access until period end)
    if (keyId && keySecret && sub.razorpay_subscription_id) {
      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      // cancel_at_cycle_end: 1 = preserve access until billing period ends
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (razorpay.subscriptions as any).cancel(sub.razorpay_subscription_id, { cancel_at_cycle_end: 1 });
    }

    // Mark as cancelled in DB
    await db
      .from("subscriptions")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", sub.id);

    return NextResponse.json({ ok: true, plan: sub.plan });
  } catch (err) {
    console.error("[subscribe/cancel] error:", err);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
