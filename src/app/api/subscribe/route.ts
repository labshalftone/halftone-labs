import { NextRequest, NextResponse } from "next/server";

// Plan amounts in smallest currency unit (paise for INR, cents for USD/EUR)
// INR base — RATES in currency-context have 2× international markup baked in:
//   USD effective rate: 41.5 INR/USD  (market ~83, so 2×)
//   EUR effective rate: 45 INR/EUR    (market ~90, so 2×)
const PLAN_AMOUNTS_INR = {
  artist: { monthly: 149900, annual: 119900 * 12 },  // ₹1,499/mo | ₹999×12=₹11,988/yr
  label:  { monthly: 399900, annual: 249900 * 12 },  // ₹3,999/mo | ₹2,499×12=₹29,988/yr
} as const;

// International amounts — derived from 2× markup rates
// USD: INR ÷ 41.5 × 100 (cents)
// EUR: INR ÷ 45 × 100 (cents)
function toCents(inrPaise: number, currency: string): number {
  const inrAmount = inrPaise / 100;
  if (currency === "USD") return Math.round((inrAmount / 41.5) * 100);
  if (currency === "EUR") return Math.round((inrAmount / 45)   * 100);
  return inrPaise; // INR paise
}

type PlanKey = keyof typeof PLAN_AMOUNTS_INR;
type BillingKey = "monthly" | "annual";

export async function POST(req: NextRequest) {
  try {
    const { plan, billing, currency = "INR", userId } = await req.json() as {
      plan: PlanKey;
      billing: BillingKey;
      currency: string;
      userId: string;
    };

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Dev / test mode — no real keys
    if (!keyId || !keySecret) {
      return NextResponse.json({
        subscriptionId: `sub_test_${Date.now()}`,
        keyId: "rzp_test_placeholder",
      });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // ── Check for pre-created plan IDs in env vars (preferred for production) ──
    // e.g. RAZORPAY_PLAN_ARTIST_MONTHLY_INR=plan_XXXXXX
    const envKey     = `RAZORPAY_PLAN_${plan.toUpperCase()}_${billing.toUpperCase()}_${currency}`;
    const existingPlanId = process.env[envKey];

    let planId: string;

    if (existingPlanId) {
      planId = existingPlanId;
    } else {
      // Create plan on the fly (first time / dev setup)
      // For production: create plans once via Razorpay dashboard, set env vars above
      const inrPaise = PLAN_AMOUNTS_INR[plan][billing];
      const amount   = toCents(inrPaise, currency);
      const period   = billing === "annual" ? "yearly" : "monthly";

      const planName = `Halftone ${plan.charAt(0).toUpperCase() + plan.slice(1)} — ${billing.charAt(0).toUpperCase() + billing.slice(1)} (${currency})`;

      const rzPlan = await razorpay.plans.create({
        period,
        interval: 1,
        item: {
          name:     planName,
          amount,
          currency,
          description: `${planName} subscription`,
        },
        notes: { plan, billing, currency, createdFor: userId },
      });

      planId = rzPlan.id;
      // Log so the admin can copy this into env vars for future use
      console.log(`[subscribe] Created Razorpay plan — set env: ${envKey}=${planId}`);
    }

    // ── Create subscription ──
    // total_count: monthly → 120 (10 years), annual → 10
    const totalCount = billing === "annual" ? 10 : 120;

    const subscription = await razorpay.subscriptions.create({
      plan_id:         planId,
      customer_notify: 1,
      total_count:     totalCount,
      notes:           { userId, plan, billing, currency },
    });

    return NextResponse.json({ subscriptionId: subscription.id, keyId });
  } catch (err) {
    console.error("[subscribe] error:", err);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
