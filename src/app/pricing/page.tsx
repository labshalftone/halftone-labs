"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus, Zap, Users, Building2, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency, fmtPrice, type Currency } from "@/lib/currency-context";
import { supabase } from "@/lib/supabase";

// ─── Plan prices in INR (base currency) ────────────────────────────────────
// RATES in currency-context already have 2× international markup baked in:
//   USD: 1 USD = 41.5 INR effective  (market ≈83, so 2× margin)
//   EUR: 1 EUR = 45 INR effective    (market ≈90, so 2× margin)
const PRICES = {
  artist: { monthly: 1499, annual: 999 },   // annual = per-month price, billed ₹11,988/yr
  label:  { monthly: 3999, annual: 2499 },  // annual = per-month price, billed ₹29,988/yr
};

// Razorpay plan IDs — set these env vars after creating plans in Razorpay dashboard
// NEXT_PUBLIC_RZP_PLAN_ARTIST_MONTHLY_INR, NEXT_PUBLIC_RZP_PLAN_ARTIST_ANNUAL_INR, etc.

type BillingCycle = "monthly" | "annual";

// ─── Feature comparison data ────────────────────────────────────────────────
type FeatureVal = boolean | string;
interface Feature {
  label: string;
  free: FeatureVal;
  artist: FeatureVal;
  label_: FeatureVal;
}
interface FeatureCategory { name: string; features: Feature[] }

const FEATURE_TABLE: FeatureCategory[] = [
  {
    name: "Drops & Designs",
    features: [
      { label: "Active drops",           free: "1",          artist: "10",          label_: "Unlimited"    },
      { label: "Design library",         free: "10 designs", artist: "Unlimited",   label_: "Unlimited"    },
      { label: "Products per drop",      free: "1",          artist: "Unlimited",   label_: "Unlimited"    },
      { label: "Artist sub-accounts",    free: false,        artist: false,         label_: "Up to 10"     },
      { label: "Bulk order discounts",   free: false,        artist: false,         label_: true           },
    ],
  },
  {
    name: "Branding & Storefront",
    features: [
      { label: "Storefront",                     free: "Halftone-branded", artist: "Custom branding", label_: "White-label"        },
      { label: "Custom domain",                  free: false,              artist: true,              label_: true                 },
      { label: "Remove 'Powered by Halftone'",   free: false,              artist: false,             label_: true                 },
      { label: "Stores",                         free: "1",                artist: "1",               label_: "3"                  },
    ],
  },
  {
    name: "Integrations",
    features: [
      { label: "Shopify sync",    free: false, artist: true,  label_: true  },
      { label: "All product types", free: false, artist: true, label_: true },
      { label: "API access",      free: false, artist: false, label_: true  },
      { label: "Webhook support", free: false, artist: false, label_: true  },
    ],
  },
  {
    name: "Analytics",
    features: [
      { label: "Sales analytics",      free: "30-day basic",   artist: "Full history",       label_: "Real-time + advanced"  },
      { label: "CSV export",           free: false,            artist: true,                 label_: true                    },
      { label: "Customer insights",    free: false,            artist: false,                label_: true                    },
      { label: "Revenue forecasting",  free: false,            artist: false,                label_: true                    },
    ],
  },
  {
    name: "Support",
    features: [
      { label: "Support channel",  free: "Community forum",  artist: "Priority email",  label_: "Dedicated manager"  },
      { label: "Response time",    free: "Best effort",      artist: "< 24 hours",      label_: "< 4 hours"          },
      { label: "Onboarding call",  free: false,              artist: false,             label_: true                 },
      { label: "Early access",     free: false,              artist: false,             label_: true                 },
    ],
  },
];

const FAQS = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. Upgrade or downgrade whenever you like. When you upgrade, the new plan kicks in immediately and we prorate the difference. Downgrading takes effect at the end of your current billing period.",
  },
  {
    q: "What counts as an 'active drop'?",
    a: "An active drop is a live, publicly-accessible storefront page where fans can buy your merch. Drafts and archived drops don't count toward your limit.",
  },
  {
    q: "Do you charge a transaction fee on top of the plan price?",
    a: "No platform fee from us — you keep all the margin between your retail price and our production cost. Your payment gateway (Razorpay) charges their standard processing fee.",
  },
  {
    q: "What's included in white-labelling on the Label plan?",
    a: "All 'Powered by Halftone' badges, email footers, and packing slip references are replaced with your own branding. Your fans see only your name.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No contracts. Monthly plans can be cancelled any time. Annual plans are non-refundable after the first 14 days but you retain full access until the period ends.",
  },
];

function FeatureCell({ val }: { val: FeatureVal }) {
  if (val === true)  return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (val === false) return <Minus className="w-4 h-4 text-zinc-300 mx-auto" />;
  return <span className="text-xs text-zinc-600 text-center leading-tight">{val}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium text-zinc-900 leading-snug">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
      </div>
      {open && <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{a}</p>}
    </button>
  );
}

// ─── Razorpay checkout helper ────────────────────────────────────────────────
declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void } }
}

async function openSubscriptionCheckout(opts: {
  plan: "artist" | "label";
  billing: BillingCycle;
  currency: Currency;
  userId: string;
  userEmail: string;
}) {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(script);
  });

  const planLabel = `${opts.plan.charAt(0).toUpperCase() + opts.plan.slice(1)} — ${opts.billing === "annual" ? "Annual" : "Monthly"}`;
  const rzp = new window.Razorpay({
    key:             data.keyId,
    subscription_id: data.subscriptionId,
    name:            "Halftone Labs",
    description:     planLabel,
    image:           "/logo.png",
    prefill:         { email: opts.userEmail },
    theme:           { color: "#9E6C9E" },
    handler:         (response: Record<string, string>) => {
      // Verify on the server
      fetch("/api/subscribe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, userId: opts.userId, plan: opts.plan, billing: opts.billing }),
      }).then(() => window.location.href = "/account?tab=dashboard&plan=activated");
    },
  });
  rzp.open();
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { currency } = useCurrency();
  const [billing, setBilling]   = useState<BillingCycle>("monthly");
  const [loading, setLoading]   = useState<string | null>(null);
  const [userId, setUserId]     = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  const fmt = (inr: number) => fmtPrice(inr, currency);

  // Annual yearly total (for "billed as" label)
  const annualTotal = (planInrMonthly: number) => {
    const inrYear = planInrMonthly * 12;
    return fmtPrice(inrYear, currency);
  };

  async function handleSubscribe(plan: "artist" | "label") {
    if (!userId || !userEmail) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    setLoading(plan);
    try {
      await openSubscriptionCheckout({ plan, billing, currency, userId, userEmail });
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  const artistPrice = fmt(PRICES.artist[billing]);
  const labelPrice  = fmt(PRICES.label[billing]);
  const artistSave  = billing === "annual" ? Math.round(((PRICES.artist.monthly - PRICES.artist.annual) / PRICES.artist.monthly) * 100) : 0;
  const labelSave   = billing === "annual" ? Math.round(((PRICES.label.monthly  - PRICES.label.annual)  / PRICES.label.monthly)  * 100) : 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-28 pb-24">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-brand mb-4">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Launch your first drop free. Scale up when you're ready. No hidden fees, no per-sale cuts.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 inline-flex items-center gap-1 bg-zinc-100 rounded-full p-1"
          >
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-white shadow-sm text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "annual"
                  ? "bg-white shadow-sm text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Annual
              <span className="bg-emerald-100 text-emerald-700 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full">
                Save up to 37%
              </span>
            </button>
          </motion.div>

          <p className="mt-3 text-xs text-zinc-400">
            Prices shown in {currency} · 2× international margin applied for USD &amp; EUR
          </p>
        </section>

        {/* ── Plan cards ── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="border border-zinc-200 rounded-2xl p-7 bg-white"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-zinc-500" />
                </div>
                <span className="font-semibold text-zinc-900">Free</span>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-bold text-zinc-900 tracking-tight">₹0</span>
                <span className="text-zinc-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 min-h-[2rem]">Always free. No credit card required.</p>
              <Link
                href="/signup"
                className="block w-full text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Get started free
              </Link>
              <ul className="mt-7 space-y-3">
                {[
                  "1 active drop",
                  "10 designs",
                  "Halftone-branded storefront",
                  "30-day basic analytics",
                  "Community support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-600">
                    <Check className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ARTIST — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative border-2 border-brand rounded-2xl p-7 bg-white shadow-[0_4px_40px_rgba(158,108,158,0.12)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand text-white text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-brand-8 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-brand" />
                </div>
                <span className="font-semibold text-zinc-900">Artist</span>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-bold text-zinc-900 tracking-tight">{artistPrice}</span>
                <span className="text-zinc-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 min-h-[2rem]">
                {billing === "annual"
                  ? `Billed ${annualTotal(PRICES.artist.annual)} / year · saves ${artistSave}%`
                  : "Switch to annual and save 33%"}
              </p>
              <button
                onClick={() => handleSubscribe("artist")}
                disabled={loading === "artist"}
                className="block w-full text-center py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                {loading === "artist" ? "Loading…" : userId ? "Subscribe — Artist" : "Get started"}
              </button>
              <ul className="mt-7 space-y-3">
                {[
                  "10 active drops",
                  "Unlimited designs",
                  "Custom branding (your logo)",
                  "Full analytics + CSV export",
                  "All product types",
                  "Shopify integration",
                  "Custom domain",
                  "Priority email · < 24h",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* LABEL */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="border border-zinc-200 rounded-2xl p-7 bg-zinc-950"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white">Label</span>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-bold text-white tracking-tight">{labelPrice}</span>
                <span className="text-zinc-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 min-h-[2rem]">
                {billing === "annual"
                  ? `Billed ${annualTotal(PRICES.label.annual)} / year · saves ${labelSave}%`
                  : "Switch to annual and save 37%"}
              </p>
              <button
                onClick={() => handleSubscribe("label")}
                disabled={loading === "label"}
                className="block w-full text-center py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-60"
              >
                {loading === "label" ? "Loading…" : userId ? "Subscribe — Label" : "Get started"}
              </button>
              <ul className="mt-7 space-y-3">
                {[
                  "Unlimited drops",
                  "Unlimited designs",
                  "White-label (remove Halftone)",
                  "Up to 10 artist sub-accounts",
                  "Real-time advanced analytics",
                  "All integrations + API",
                  "3 storefronts",
                  "Dedicated account manager",
                  "Bulk order discounts",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ── Feature comparison ── */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-10 tracking-tight">
            Compare plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              {/* Column headers */}
              <thead>
                <tr>
                  <th className="text-left pb-4 pr-6 text-zinc-400 font-normal w-[40%]">Feature</th>
                  <th className="text-center pb-4 px-4 font-semibold text-zinc-900">Free</th>
                  <th className="text-center pb-4 px-4 font-semibold text-brand">Artist</th>
                  <th className="text-center pb-4 px-4 font-semibold text-zinc-900">Label</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.flatMap((cat) => [
                  <tr key={`cat-${cat.name}`}>
                    <td
                      colSpan={4}
                      className="pt-6 pb-2 text-[0.7rem] font-bold tracking-widest uppercase text-zinc-400"
                    >
                      {cat.name}
                    </td>
                  </tr>,
                  ...cat.features.map((feat, i) => (
                    <tr
                      key={feat.label}
                      className={`border-t border-zinc-100 ${i % 2 === 0 ? "" : "bg-zinc-50/50"}`}
                    >
                      <td className="py-3 pr-6 text-zinc-600">{feat.label}</td>
                      <td className="py-3 px-4 text-center"><FeatureCell val={feat.free} /></td>
                      <td className="py-3 px-4 text-center"><FeatureCell val={feat.artist} /></td>
                      <td className="py-3 px-4 text-center"><FeatureCell val={feat.label_} /></td>
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-8 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-zinc-950 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              Still have questions?
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Talk to us directly — we're happy to walk you through which plan makes sense for your setup.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Contact sales
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
