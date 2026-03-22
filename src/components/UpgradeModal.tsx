"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Zap } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/plans";
import PlanCheckoutModal, { type PaidPlan } from "@/components/PlanCheckoutModal";

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

const PAID_PLANS: PlanKey[] = ["launch", "scale", "business", "enterprise"];

export default function UpgradeModal({
  featureLabel,
  requiredPlan,
  heading,
  body,
  onClose,
}: UpgradeModalProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  const plan    = PLANS[requiredPlan];
  const canCheckout = (["launch", "scale", "business"] as PlanKey[]).includes(requiredPlan);

  const defaultHeading = `${featureLabel} is available on the ${plan.name} plan`;
  const defaultBody    = plan.description;

  // If showing checkout, render PlanCheckoutModal instead
  if (showCheckout && canCheckout) {
    return (
      <PlanCheckoutModal
        plan={requiredPlan as PaidPlan}
        onClose={() => { setShowCheckout(false); onClose(); }}
        onSuccess={onClose}
      />
    );
  }

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

        <p className="text-sm text-zinc-500 leading-relaxed mb-5">
          {body ?? defaultBody}
        </p>

        {/* Price hint */}
        {plan.monthlyInr > 0 && (
          <p className="text-xs text-zinc-400 mb-5">
            Starting at ₹{plan.annualInr.toLocaleString("en-IN")}/mo billed annually
            &nbsp;·&nbsp; ₹{plan.monthlyInr.toLocaleString("en-IN")}/mo monthly
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {canCheckout ? (
            <button
              onClick={() => setShowCheckout(true)}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Upgrade to {plan.name}
            </button>
          ) : (
            <Link
              href="/pricing"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Contact sales
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <div className="flex items-center justify-between">
            <Link
              href="/pricing"
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-2"
            >
              Compare all plans
            </Link>
            <button
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
