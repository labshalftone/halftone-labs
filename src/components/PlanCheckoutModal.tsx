"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/plans";
import { useCurrency, fmtPrice } from "@/lib/currency-context";
import { useSubscription } from "@/lib/subscription-context";
import { supabase } from "@/lib/supabase";
import { openSubscriptionCheckout } from "@/lib/checkout";

export type PaidPlan = "launch" | "scale" | "business";

const PLAN_BULLETS: Record<PaidPlan, string[]> = {
  launch: [
    "5 active drops",
    "Custom branding + custom domain",
    "Shopify integration",
    "Full analytics history + CSV export",
  ],
  scale: [
    "Unlimited active drops",
    "Premium products (hoodies, waffle tees)",
    "Neck labels + premium packaging",
    "Up to 5 team members · API access",
  ],
  business: [
    "Unlimited storefronts",
    "White-label — remove all Halftone branding",
    "Unlimited team members",
    "Dedicated account manager · Bulk discounts",
  ],
};

const ANNUAL_SAVINGS: Record<PaidPlan, number> = {
  launch:   25,
  scale:    20,
  business: 17,
};

interface Props {
  plan:       PaidPlan;
  onClose:    () => void;
  onSuccess?: () => void;
}

export default function PlanCheckoutModal({ plan, onClose, onSuccess }: Props) {
  const { currency } = useCurrency();
  const { refresh } = useSubscription();

  const [billing,   setBilling]   = useState<"monthly" | "annual">("annual");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [userId,    setUserId]    = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const planData = PLANS[plan];
  const price    = billing === "annual" ? planData.annualInr : planData.monthlyInr;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id   ?? null);
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  async function handleSubscribe() {
    if (!userId || !userEmail) {
      window.location.href = `/login?redirect=/pricing?plan=${plan}`;
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await openSubscriptionCheckout({
        plan,
        billing,
        currency,
        userId,
        userEmail,
        onSuccess: async () => {
          await refresh();
          setSuccess(true);
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 2800);
        },
        onDismiss: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          /* ── Success state ────────────────────────────────────────────── */
          <div className="p-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5"
            >
              <Check className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
            </motion.div>
            <h2
              className="text-xl font-bold text-zinc-900 mb-2"
              style={{ letterSpacing: "-0.04em" }}
            >
              You&apos;re on {planData.name} 🎉
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your account has been upgraded. All {planData.name} features are unlocked immediately.
            </p>
          </div>
        ) : (
          /* ── Checkout state ───────────────────────────────────────────── */
          <>
            {/* Header */}
            <div className="p-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-brand mb-2 block">
                {planData.name} plan
              </span>
              <h2
                className="text-[1.15rem] font-bold text-zinc-900 leading-snug mb-1"
                style={{ letterSpacing: "-0.04em" }}
              >
                {planData.tagline}
              </h2>
              <p className="text-sm text-zinc-500">{planData.description}</p>
            </div>

            {/* Billing toggle */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    billing === "monthly"
                      ? "bg-white shadow-sm text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    billing === "annual"
                      ? "bg-white shadow-sm text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  Annual
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                    SAVE {ANNUAL_SAVINGS[plan]}%
                  </span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="px-6 pb-4">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-3xl font-bold text-zinc-900"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {fmtPrice(price, currency)}
                </span>
                <span className="text-sm text-zinc-400">/ month</span>
              </div>
              {billing === "annual" && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  Billed as {fmtPrice(price * 12, currency)} / year
                </p>
              )}
            </div>

            {/* Feature bullets */}
            <div className="px-6 pb-5">
              <ul className="space-y-2.5">
                {PLAN_BULLETS[plan].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              {error && (
                <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
              )}
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Opening checkout…
                  </>
                ) : (
                  `Subscribe to ${planData.name}`
                )}
              </button>
              <p className="text-center text-xs text-zinc-400 mt-3">
                No contracts · Cancel anytime · Secured by Razorpay
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
