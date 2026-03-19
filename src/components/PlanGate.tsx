"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { PLANS, type PlanKey, type PlanEntitlements } from "@/lib/plans";
import { useSubscription } from "@/lib/subscription-context";
import { type ReactNode } from "react";

// ── LockedFeatureCard ─────────────────────────────────────────────────────────
// Stand-alone locked state card. Use when a feature surface is completely
// replaced by its gate (e.g. entire section is unavailable on this plan).

interface LockedFeatureCardProps {
  /** e.g. "Custom domain" */
  heading: string;
  /** Direct, plain-English description — not a sales pitch */
  body: string;
  /** Plan required to unlock */
  requiredPlan: PlanKey;
  /** Optional extra detail row, e.g. price hint */
  note?: string;
}

export function LockedFeatureCard({ heading, body, requiredPlan, note }: LockedFeatureCardProps) {
  const plan = PLANS[requiredPlan];
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lock className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[0.65rem] font-bold tracking-[0.12em] uppercase text-brand mb-2">
            {plan.name} plan
          </span>
          <h3 className="font-semibold text-zinc-900 text-sm mb-1 leading-snug">{heading}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">{body}</p>
          {note && (
            <p className="text-xs text-zinc-400 mb-4">{note}</p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              See plans
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {plan.monthlyInr > 0 && (
              <span className="text-xs text-zinc-400">
                from ₹{plan.annualInr.toLocaleString("en-IN")}/mo billed annually
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PlanGate ──────────────────────────────────────────────────────────────────
// Wrapper component. Renders `children` when the user has access,
// or `fallback` (defaults to LockedFeatureCard) when they don't.

interface PlanGateProps {
  /** Feature key from PlanEntitlements (boolean features only) */
  feature: keyof PlanEntitlements;
  children: ReactNode;
  /** Override the locked state UI */
  fallback?: ReactNode;
  /** Props for the default LockedFeatureCard — required when fallback is not provided */
  lockedHeading?: string;
  lockedBody?: string;
  lockedPlan?: PlanKey;
  lockedNote?: string;
}

export default function PlanGate({
  feature,
  children,
  fallback,
  lockedHeading,
  lockedBody,
  lockedPlan,
  lockedNote,
}: PlanGateProps) {
  const { can } = useSubscription();

  if (can(feature)) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  // Auto-determine the required plan if not specified
  const requiredPlan: PlanKey = lockedPlan ?? "launch";

  return (
    <LockedFeatureCard
      heading={lockedHeading ?? "This feature is not available on your plan"}
      body={lockedBody ?? "Upgrade to unlock this feature."}
      requiredPlan={requiredPlan}
      note={lockedNote}
    />
  );
}

// ── UsageBar ──────────────────────────────────────────────────────────────────
// Compact inline usage indicator. Use inside feature headers to show
// current usage against plan limits.

interface UsageBarProps {
  used: number;
  limit: number;
  label: string;
}

export function UsageBar({ used, limit, label }: UsageBarProps) {
  const unlimited = limit === Infinity;
  const pct = unlimited ? 0 : limit === 0 ? 100 : Math.min((used / limit) * 100, 100);
  const atLimit   = !unlimited && pct >= 100;
  const nearLimit = !unlimited && pct >= 80;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold tabular-nums ${atLimit ? "text-red-500" : nearLimit ? "text-orange-500" : "text-ds-muted"}`}>
        {unlimited ? `${used}` : `${used} / ${limit}`}
      </span>
      {!unlimited && (
        <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${atLimit ? "bg-red-400" : nearLimit ? "bg-orange-400" : "bg-brand-30"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <span className="text-xs text-ds-muted">{label}</span>
    </div>
  );
}
