import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      userId,
      plan,
      billing,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

    // Verify HMAC signature
    const payload  = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Upsert subscription record
    // SQL to create this table:
    // CREATE TABLE subscriptions (
    //   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    //   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    //   plan text NOT NULL,          -- 'free' | 'artist' | 'label'
    //   billing text NOT NULL,       -- 'monthly' | 'annual'
    //   status text NOT NULL,        -- 'active' | 'cancelled' | 'expired'
    //   razorpay_subscription_id text UNIQUE,
    //   razorpay_payment_id text,
    //   current_period_end timestamptz,
    //   created_at timestamptz DEFAULT now(),
    //   updated_at timestamptz DEFAULT now()
    // );
    await supabaseAdmin.from("subscriptions").upsert({
      user_id:                  userId,
      plan,
      billing,
      status:                   "active",
      razorpay_subscription_id: razorpay_subscription_id,
      razorpay_payment_id:      razorpay_payment_id,
      updated_at:               new Date().toISOString(),
    }, { onConflict: "razorpay_subscription_id" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe/verify] error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
