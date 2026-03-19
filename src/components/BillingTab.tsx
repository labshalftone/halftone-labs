"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { useSubscription } from "@/lib/subscription-context";
import { PLANS, UNLIMITED, type PlanKey } from "@/lib/plans";
import type { BillingUsage } from "@/app/api/billing/usage/route";

interface BillingTabProps {
  userId: string;
}

// ─── Usage meter ──────────────────────────────────────────────────────────────
function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const unlimited = limit === UNLIMITED;
  const pct = unlimited ? 0 : limit === 0 ? 100 : Math.min((used / limit) * 100, 100);
  const nearLimit = !unlimited && pct >= 80;
  const atLimit   = !unlimited && pct >= 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-zinc-600">{label}</span>
        <span className={`text-xs font-semibold ${atLimit ? "text-red-500" : nearLimit ? "text-orange-500" : "text-zinc-500"}`}>
          {unlimited ? `${used} / Unlimited` : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        {!unlimited && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              atLimit ? "bg-red-400" : nearLimit ? "bg-orange-400" : "bg-brand"
            }`}
            style={{ width: `${pct}%` }}
          />
        )}
        {unlimited && (
          <div className="h-full w-full rounded-full bg-brand-8" />
        )}
      </div>
    </div>
  );
}

// ─── Plan badge ───────────────────────────────────────────────────────────────
function PlanBadge({ plan, status }: { plan: PlanKey; status: string }) {
  const colors: Record<PlanKey, string> = {
    free:       "bg-zinc-100 text-zinc-600",
    launch:     "bg-brand-8 text-brand",
    scale:      "bg-violet-100 text-violet-700",
    business:   "bg-zinc-900 text-white",
    enterprise: "bg-zinc-950 text-zinc-300",
  };
  return (
    <span className={`inline-block text-[0.68rem] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-lg ${colors[plan]}`}>
      {PLANS[plan].name}
      {status === "cancelled" && (
        <span className="ml-1.5 text-[0.6rem] normal-case font-normal opacity-70">· cancels at period end</span>
      )}
    </span>
  );
}

// ─── Cancel confirmation ──────────────────────────────────────────────────────
function CancelConfirm({
  plan,
  onConfirm,
  onAbort,
  loading,
}: {
  plan: PlanKey;
  onConfirm: () => void;
  onAbort: () => void;
  loading: boolean;
}) {
  return (
    <div className="mt-4 p-4 border border-red-100 bg-red-50 rounded-xl">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-zinc-900 mb-1">Cancel {PLANS[plan].name} plan?</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Your plan stays active until the end of the current billing period.
            After that, your account moves to Free — drops above the free limit will be archived, not deleted.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Cancelling…" : "Yes, cancel plan"}
        </button>
        <button
          onClick={onAbort}
          className="px-4 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-white transition-colors"
        >
          Keep plan
        </button>
      </div>
    </div>
  );
}

// ─── Next plan upgrade card ───────────────────────────────────────────────────
function UpgradeCard({
  from,
  to,
  billing,
}: {
  from: PlanKey;
  to: PlanKey;
  billing: "monthly" | "annual";
}) {
  const plan = PLANS[to];
  const price = billing === "annual" ? plan.annualInr : plan.monthlyInr;

  const highlights: Partial<Record<PlanKey, string[]>> = {
    free: [],
    launch: [
      "5 active drops",
      "Unlimited designs",
      "Custom branding + custom domain",
      "Shopify integration",
      "Full analytics + CSV export",
    ],
    scale: [
      "Unlimited active drops",
      "Premium product access (hoodies, waffle tees)",
      "Neck labels + premium packaging unlocked",
      "Up to 5 team members",
      "API access + priority support",
    ],
    business: [
      "Unlimited storefronts",
      "White-label — remove Halftone branding",
      "Unlimited team members",
      "Dedicated account manager",
      "Bulk order discounts",
    ],
    enterprise: [],
  };

  const isDark = to === "business" || to === "enterprise";

  return (
    <div className={`rounded-xl border p-5 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${isDark ? "text-zinc-400" : "text-brand"}`}>
            {plan.name}
          </p>
          <p className={`text-sm font-medium leading-snug ${isDark ? "text-white" : "text-zinc-900"}`}>
            {plan.tagline}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
            ₹{price.toLocaleString("en-IN")}
          </p>
          <p className={`text-[0.7rem] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            / month{billing === "annual" ? " · billed annually" : ""}
          </p>
        </div>
      </div>

      <ul className="space-y-2 mb-5">
        {(highlights[to] ?? []).map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs">
            <Check className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-emerald-400" : "text-brand"}`} />
            <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/pricing?plan=${to}`}
        className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isDark
            ? "bg-white text-zinc-900 hover:bg-zinc-100"
            : "bg-zinc-900 text-white hover:bg-zinc-800"
        }`}
      >
        Upgrade to {plan.name}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BillingTab({ userId }: BillingTabProps) {
  const { plan, status, billing, razorpaySubscriptionId, refresh } = useSubscription();
  const [usage,          setUsage]          = useState<BillingUsage | null>(null);
  const [usageLoading,   setUsageLoading]   = useState(true);
  const [showCancel,     setShowCancel]     = useState(false);
  const [cancelLoading,  setCancelLoading]  = useState(false);
  const [cancelDone,     setCancelDone]     = useState(false);

  const billingCycle = billing ?? "monthly";

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/billing/usage?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setUsage(d))
      .catch(console.error)
      .finally(() => setUsageLoading(false));
  }, [userId]);

  async function handleCancel() {
    setCancelLoading(true);
    try {
      await fetch("/api/subscribe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setCancelDone(true);
      setShowCancel(false);
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setCancelLoading(false);
    }
  }

  // Determine upgrade path
  const nextPlan: PlanKey | null =
    plan === "free"   ? "launch"   :
    plan === "launch" ? "scale"    :
    plan === "scale"  ? "business" :
    null;
  // Note: business users see a contact sales card instead of UpgradeCard

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── Current plan ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-zinc-200 rounded-xl p-5 bg-white"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-400 mb-2">Current plan</p>
            <PlanBadge plan={plan} status={status} />
            <p className="mt-2 text-sm text-zinc-600">{PLANS[plan].tagline}</p>
          </div>

          {plan !== "free" && (
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-900 tracking-tight">
                ₹{(billingCycle === "annual" ? PLANS[plan].annualInr : PLANS[plan].monthlyInr).toLocaleString("en-IN")}
              </p>
              <p className="text-[0.7rem] text-zinc-400">
                / month · billed {billingCycle === "annual" ? "annually" : "monthly"}
              </p>
            </div>
          )}

          {plan === "free" && (
            <span className="text-xl font-bold text-zinc-900">₹0</span>
          )}
        </div>

        {/* Billing info */}
        {plan !== "free" && (
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
            <div>
              <p className="text-[0.7rem] text-zinc-400 mb-0.5">Billing cycle</p>
              <p className="text-sm font-medium text-zinc-700 capitalize">{billingCycle}</p>
            </div>
            {billingCycle === "monthly" && plan !== "enterprise" && (
              <div className="text-xs text-zinc-400">
                Switch to annual to save{" "}
                <span className="text-emerald-600 font-semibold">
                  {plan === "launch" ? "25%" : plan === "scale" ? "20%" : "17%"}
                </span>
                {" — "}
                <Link href="/pricing" className="underline hover:text-zinc-600">change plan</Link>
              </div>
            )}
          </div>
        )}

        {/* Cancel prompt */}
        {plan !== "free" && status === "active" && !cancelDone && (
          <div className="pt-4 border-t border-zinc-100 mt-4">
            {!showCancel ? (
              <button
                onClick={() => setShowCancel(true)}
                className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
              >
                Cancel plan
              </button>
            ) : (
              <CancelConfirm
                plan={plan}
                onConfirm={handleCancel}
                onAbort={() => setShowCancel(false)}
                loading={cancelLoading}
              />
            )}
          </div>
        )}

        {cancelDone && (
          <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-xs text-zinc-600">
              Your plan has been cancelled and will remain active until the end of the billing period.
              After that, your account moves to Free.
            </p>
          </div>
        )}

        {status === "cancelled" && !cancelDone && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-xs text-orange-700">
              Your plan is scheduled for cancellation. You retain full access until the end of the billing period.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Usage meters ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="border border-zinc-200 rounded-xl p-5 bg-white"
      >
        <p className="text-xs font-semibold text-zinc-400 tracking-widest uppercase mb-4">
          Usage
        </p>

        {usageLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-zinc-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <UsageMeter
              label="Active drops"
              used={usage?.usage.activeDrops ?? 0}
              limit={usage?.limits.activeDrops ?? PLANS[plan].entitlements.activeDrops}
            />
            <UsageMeter
              label="Storefronts"
              used={usage?.usage.storefronts ?? 0}
              limit={usage?.limits.storefronts ?? PLANS[plan].entitlements.storefronts}
            />
            <UsageMeter
              label="Team members"
              used={usage?.usage.teamMembers ?? 0}
              limit={usage?.limits.teamMembers ?? PLANS[plan].entitlements.teamMembers}
            />
            <UsageMeter
              label="Designs"
              used={usage?.usage.designs ?? 0}
              limit={usage?.limits.designs ?? PLANS[plan].entitlements.designs}
            />
          </div>
        )}

        {/* Feature summary */}
        <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2">
          {[
            { label: "Custom branding",   value: PLANS[plan].entitlements.customBranding   },
            { label: "Custom domain",      value: PLANS[plan].entitlements.customDomain      },
            { label: "Shopify sync",       value: PLANS[plan].entitlements.shopifySync       },
            { label: "CSV export",         value: PLANS[plan].entitlements.csvExport         },
            { label: "API access",         value: PLANS[plan].entitlements.apiAccess         },
            { label: "White-label",        value: PLANS[plan].entitlements.removeHalftone    },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${value ? "bg-emerald-400" : "bg-zinc-200"}`} />
              <span className={value ? "text-zinc-700" : "text-zinc-400"}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Upgrade card ── */}
      {nextPlan && status !== "cancelled" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-semibold text-zinc-400 tracking-widest uppercase mb-3">
            Next plan
          </p>
          <UpgradeCard from={plan} to={nextPlan} billing={billingCycle} />
          {nextPlan === "launch" && (
            <p className="mt-2 text-center">
              <Link href="/pricing" className="text-xs text-zinc-400 hover:text-zinc-600 underline">
                Or compare Scale and Business — see all plans
              </Link>
            </p>
          )}
        </motion.div>
      )}

      {/* On Business — contact for custom */}
      {plan === "business" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-zinc-200 rounded-xl p-5 bg-zinc-50 text-center"
        >
          <p className="text-sm font-medium text-zinc-700 mb-1">Need something custom?</p>
          <p className="text-xs text-zinc-500 mb-3">
            Higher team limits, dedicated infrastructure, or custom billing — talk to us.
          </p>
          <Link
            href="/contact"
            className="inline-block px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Contact sales
          </Link>
        </motion.div>
      )}

      {/* Compare plans link */}
      <p className="text-center">
        <Link href="/pricing" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors underline">
          Compare all plans
        </Link>
      </p>
    </div>
  );
}
