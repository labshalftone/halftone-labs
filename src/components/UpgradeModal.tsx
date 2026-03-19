"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/plans";

export interface UpgradeModalProps {
  /** Short label for the feature being blocked, e.g. "custom domain" */
  featureLabel: string;
  /** The minimum plan that unlocks this feature */
  requiredPlan: PlanKey;
  /** Override the default heading */
  heading?: string;
  /** Override the default body copy */
  body?: string;
  onClose: () => void;
}

/**
 * Contextual upgrade modal — appears in-product when a user hits a feature gate.
 *
 * Design principles:
 * - State the fact, not a sales pitch
 * - Show exactly what plan is needed and why
 * - One clear CTA, one easy dismiss
 * - Never manipulative, never spammy
 */
export default function UpgradeModal({
  featureLabel,
  requiredPlan,
  heading,
  body,
  onClose,
}: UpgradeModalProps) {
  const plan = PLANS[requiredPlan];

  const defaultHeading = requiredPlan === "studio"
    ? `${featureLabel} is available on the Studio plan`
    : `${featureLabel} is available on the Organization plan`;

  const defaultBody = plan.description;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Plan badge */}
        <span className="inline-block text-[0.68rem] font-bold tracking-[0.12em] uppercase text-brand mb-4">
          {plan.name} plan
        </span>

        <h2 className="text-[1.1rem] font-bold text-zinc-900 tracking-tight leading-snug mb-2">
          {heading ?? defaultHeading}
        </h2>

        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
          {body ?? defaultBody}
        </p>

        {/* Price hint */}
        {plan.monthlyInr > 0 && (
          <p className="text-xs text-zinc-400 mb-5">
            Starting at ₹{plan.annualInr.toLocaleString("en-IN")}/mo billed annually
            &nbsp;·&nbsp; ₹{plan.monthlyInr.toLocaleString("en-IN")}/mo monthly
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            See plans
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Not now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
