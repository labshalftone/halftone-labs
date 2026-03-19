"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus, Zap, Users, Building2, Rocket, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency, fmtPrice, type Currency } from "@/lib/currency-context";
import { supabase } from "@/lib/supabase";

// ─── Plan prices in INR (base currency) ────────────────────────────────────
const PRICES = {
  launch:   { monthly: 1999, annual: 1499  },
  scale:    { monthly: 5999, annual: 4999  },
  business: { monthly: 12999, annual: 9999 },
};

type BillingCycle = "monthly" | "annual";

// ─── Feature comparison data ────────────────────────────────────────────────
type FeatureVal = boolean | string;
interface Feature {
  label: string;
  free: FeatureVal;
  launch: FeatureVal;
  scale: FeatureVal;
  business: FeatureVal;
}
interface FeatureCategory { name: string; features: Feature[] }

const FEATURE_TABLE: FeatureCategory[] = [
  {
    name: "Drops & Designs",
    features: [
      { label: "Active drops",         free: "1",          launch: "5",           scale: "20",          business: "Unlimited"  },
      { label: "Design library",       free: "5 designs",  launch: "Unlimited",   scale: "Unlimited",   business: "Unlimited"  },
      { label: "Products per drop",    free: "1 type",     launch: "All types",   scale: "All types",   business: "All types"  },
      { label: "Team members",         free: false,        launch: false,         scale: "Up to 5",     business: "Unlimited"  },
      { label: "Bulk order discounts", free: false,        launch: false,         scale: false,         business: true         },
    ],
  },
  {
    name: "Branding & Storefront",
    features: [
      { label: "Storefront",                   free: "Halftone-branded", launch: "Custom branding", scale: "White-label",  business: "White-label"   },
      { label: "Custom domain",                free: false,              launch: true,              scale: true,          business: true            },
      { label: "Remove 'Powered by Halftone'", free: false,              launch: false,             scale: true,          business: true            },
      { label: "Storefronts",                  free: "1",                launch: "1",               scale: "3",           business: "Unlimited"     },
    ],
  },
  {
    name: "Integrations",
    features: [
      { label: "Shopify sync",      free: false, launch: true,  scale: true,  business: true  },
      { label: "All product types", free: false, launch: true,  scale: true,  business: true  },
      { label: "API access",        free: false, launch: false, scale: true,  business: true  },
      { label: "Webhook support",   free: false, launch: false, scale: true,  business: true  },
    ],
  },
  {
    name: "Analytics",
    features: [
      { label: "Sales analytics",     free: "7-day basic",  launch: "Full history", scale: "Full history",       business: "Real-time + advanced" },
      { label: "CSV export",          free: false,          launch: true,           scale: true,                 business: true                   },
      { label: "Customer insights",   free: false,          launch: false,          scale: true,                 business: true                   },
      { label: "Revenue forecasting", free: false,          launch: false,          scale: false,                business: true                   },
    ],
  },
  {
    name: "Support",
    features: [
      { label: "Support channel", free: "Community forum", launch: "Email",          scale: "Priority email",  business: "Dedicated manager" },
      { label: "Response time",   free: "Best effort",     launch: "< 48 hours",     scale: "< 24 hours",      business: "< 4 hours"         },
      { label: "Onboarding call", free: false,             launch: false,            scale: false,             business: true                },
      { label: "Early access",    free: false,             launch: false,            scale: true,              business: true                },
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
    a: "An active drop is a live, publicly-accessible drop page where fans can buy your merch. Drafts and archived drops don't count toward your limit.",
  },
  {
    q: "Do you charge a transaction fee on top of the plan price?",
    a: "No platform fee from us — you keep all the margin between your retail price and our production cost. Your payment gateway (Razorpay) charges their standard processing fee.",
  },
  {
    q: "What's included in white-labelling on Scale and Business?",
    a: "All 'Powered by Halftone' badges, email footers, and packing slip references are replaced with your own branding. Your customers and fans see only your name.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No contracts. Monthly plans can be cancelled any time. Annual plans are non-refundable after the first 14 days but you retain full access until the period ends.",
  },
  {
    q: "What is the Custom / Business plan for?",
    a: "Business is designed for agencies, labels, festivals, and collectives managing multiple storefronts and teams. Custom is available for volume pricing, dedicated infrastructure, or bespoke billing — contact us to discuss.",
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
  plan: "launch" | "scale" | "business";
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
      fetch("/api/subscribe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, userId: opts.userId, plan: opts.plan, billing: opts.billing }),
      }).then(() => window.location.href = "/account?tab=billing&plan=activated");
    },
  });
  rzp.open();
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { currency } = useCurrency();
  const [billing, setBilling]     = useState<BillingCycle>("monthly");
  const [loading, setLoading]     = useState<string | null>(null);
  const [userId, setUserId]       = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  const fmt = (inr: number) => fmtPrice(inr, currency);

  const annualTotal = (planInrMonthly: number) => {
    const inrYear = planInrMonthly * 12;
    return fmtPrice(inrYear, currency);
  };

  async function handleSubscribe(plan: "launch" | "scale" | "business") {
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

  const savePct = (plan: keyof typeof PRICES) =>
    billing === "annual"
      ? Math.round(((PRICES[plan].monthly - PRICES[plan].annual) / PRICES[plan].monthly) * 100)
      : 0;

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
              Launch your first drop free. Scale up when you&apos;re ready. No hidden fees, no per-sale cuts.
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
                Save up to 25%
              </span>
            </button>
          </motion.div>

        </section>

        {/* ── Plan cards ── */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">

            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="border border-zinc-200 rounded-2xl p-6 bg-white"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-zinc-500" />
                </div>
                <span className="font-semibold text-zinc-900">Free</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight">₹0</span>
                <span className="text-zinc-400 text-sm ml-1">/ mo</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 min-h-[2.5rem]">Always free. No credit card required.</p>
              <Link
                href="/signup"
                className="block w-full text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Get started free
              </Link>
              <ul className="mt-6 space-y-2.5">
                {[
                  "1 active drop",
                  "5 designs",
                  "Halftone-branded storefront",
                  "7-day analytics",
                  "Community support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-600">
                    <Check className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* LAUNCH — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative border-2 border-brand rounded-2xl p-6 bg-white shadow-[0_4px_40px_rgba(158,108,158,0.12)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand text-white text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-brand-8 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-brand" />
                </div>
                <span className="font-semibold text-zinc-900">Launch</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight">{fmt(PRICES.launch[billing])}</span>
                <span className="text-zinc-400 text-sm ml-1">/ mo</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 min-h-[2.5rem]">
                {billing === "annual"
                  ? `Billed ${annualTotal(PRICES.launch.annual)} / year · saves ${savePct("launch")}%`
                  : "Switch to annual and save 25%"}
              </p>
              <button
                onClick={() => handleSubscribe("launch")}
                disabled={loading === "launch"}
                className="block w-full text-center py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                {loading === "launch" ? "Loading…" : userId ? "Subscribe — Launch" : "Get started"}
              </button>
              <ul className="mt-6 space-y-2.5">
                {[
                  "5 active drops",
                  "Unlimited designs",
                  "Custom branding",
                  "Custom domain",
                  "All product types",
                  "Shopify integration",
                  "Full analytics + CSV",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* SCALE */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="border border-zinc-200 rounded-2xl p-6 bg-white"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600" />
                </div>
                <span className="font-semibold text-zinc-900">Scale</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight">{fmt(PRICES.scale[billing])}</span>
                <span className="text-zinc-400 text-sm ml-1">/ mo</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 min-h-[2.5rem]">
                {billing === "annual"
                  ? `Billed ${annualTotal(PRICES.scale.annual)} / year · saves ${savePct("scale")}%`
                  : "Switch to annual and save 17%"}
              </p>
              <button
                onClick={() => handleSubscribe("scale")}
                disabled={loading === "scale"}
                className="block w-full text-center py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                {loading === "scale" ? "Loading…" : userId ? "Subscribe — Scale" : "Get started"}
              </button>
              <ul className="mt-6 space-y-2.5">
                {[
                  "20 active drops",
                  "3 storefronts",
                  "Up to 5 team members",
                  "White-label",
                  "API access",
                  "Priority email · <24h",
                  "Early feature access",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* BUSINESS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white">Business</span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-white tracking-tight">{fmt(PRICES.business[billing])}</span>
                <span className="text-zinc-400 text-sm ml-1">/ mo</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 min-h-[2.5rem]">
                {billing === "annual"
                  ? `Billed ${annualTotal(PRICES.business.annual)} / year · saves ${savePct("business")}%`
                  : "Switch to annual and save 23%"}
              </p>
              <button
                onClick={() => handleSubscribe("business")}
                disabled={loading === "business"}
                className="block w-full text-center py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-60"
              >
                {loading === "business" ? "Loading…" : userId ? "Subscribe — Business" : "Get started"}
              </button>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Unlimited drops",
                  "Unlimited storefronts",
                  "Unlimited team members",
                  "Dedicated account manager",
                  "Bulk order discounts",
                  "Custom billing",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Custom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 border border-zinc-200 rounded-2xl p-6 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-900 mb-0.5">Need something custom?</p>
              <p className="text-xs text-zinc-500">Higher limits, dedicated infrastructure, or custom pricing — talk to us.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Contact sales
            </Link>
          </motion.div>
        </section>

        {/* ── Feature comparison ── */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-10 tracking-tight">
            Compare plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              {/* Column headers */}
              <thead>
                <tr>
                  <th className="text-left pb-4 pr-6 text-zinc-400 font-normal w-[32%]">Feature</th>
                  <th className="text-center pb-4 px-3 font-semibold text-zinc-900">Free</th>
                  <th className="text-center pb-4 px-3 font-semibold text-brand">Launch</th>
                  <th className="text-center pb-4 px-3 font-semibold text-violet-700">Scale</th>
                  <th className="text-center pb-4 px-3 font-semibold text-zinc-900">Business</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.flatMap((cat) => [
                  <tr key={`cat-${cat.name}`}>
                    <td
                      colSpan={5}
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
                      <td className="py-3 px-3 text-center"><FeatureCell val={feat.free} /></td>
                      <td className="py-3 px-3 text-center"><FeatureCell val={feat.launch} /></td>
                      <td className="py-3 px-3 text-center"><FeatureCell val={feat.scale} /></td>
                      <td className="py-3 px-3 text-center"><FeatureCell val={feat.business} /></td>
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
              Talk to us directly — we&apos;re happy to walk you through which plan makes sense for your setup.
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
