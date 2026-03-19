"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency, fmtPrice, type Currency } from "@/lib/currency-context";
import { supabase } from "@/lib/supabase";

// ─── Plan prices in INR ───────────────────────────────────────────────────────
const PRICES = {
  launch:   { monthly: 1999,  annual: 1499  },
  scale:    { monthly: 7499,  annual: 5999  },
  business: { monthly: 29999, annual: 24999 },
};

type BillingCycle = "monthly" | "annual";

// ─── Live brands ──────────────────────────────────────────────────────────────
const LIVE_BRANDS: { name: string; url: string; logo: string; dark?: boolean; bg?: string }[] = [
  { name: "All Day, High Decibels", url: "https://wearadhd.com",                           logo: "https://wearadhd.com/cdn/shop/files/adhd_black_c742ba11-3e89-469f-81bd-f9589f8d7d5a.png?v=1772652899&width=360" },
  { name: "Galactica",              url: "https://shop.cocorico.it/collections/galactica", logo: "https://shop.cocorico.it/cdn/shop/files/00_LOGO_COCCO_WHITE.svg?v=1747320780&width=80", dark: true },
  { name: "Clifford73",             url: "https://clifford73.com/shop",                    logo: "https://cdn.prod.website-files.com/682a7984b04cabb3d46beb60/6878013f152f071dd6369d4d_clifford73-opengraph.png" },
  { name: "Tidal Rave",             url: "https://tidalravefestival.com/",                 logo: "https://tidalravefestival.com/gh/wp-content/uploads/sites/2/2023/07/Tidal-Rave-NEW-LOGO-1.png" },
  { name: "Restricted",             url: "https://itsrestricted.com/collections/all",      logo: "https://itsrestricted.com/cdn/shop/files/IMG_2560.jpg?v=1713782038&width=300", dark: true, bg: "bg-black border-black" },
  { name: "Felicia Lu",             url: "https://felicialu.net/shop",                     logo: "https://images.squarespace-cdn.com/content/v1/5fef2b7278965c3d27c0c7ff/c8461e59-0fdb-4753-ab18-3b952754fc8c/favicon.ico?format=300w" },
  { name: "Illusion Hills",         url: "https://www.illusionhills.net/store",            logo: "https://static.wixstatic.com/media/3dce2a_24da16b85a3e453984e7bee0608b461f~mv2.png/v1/fill/w_180,h_180,lg_1,usm_0.66_1.00_0.01/3dce2a_24da16b85a3e453984e7bee0608b461f~mv2.png" },
  { name: "C2C Festival",           url: "https://clubtoclub.it/product/pin/",             logo: "https://clubtoclub.it/wp-content/themes/c2c/img/c2c-logo-white.svg", dark: true },
];

// ─── Comparison table ─────────────────────────────────────────────────────────
type FeatureVal = boolean | string;

const TABLE_ROWS: { label: string; free: FeatureVal; launch: FeatureVal; scale: FeatureVal; business: FeatureVal }[] = [
  { label: "Active drops",        free: "1",             launch: "5",           scale: "Unlimited",    business: "Unlimited"      },
  { label: "Storefronts",         free: "1",             launch: "1",           scale: "3",            business: "Unlimited"      },
  { label: "Team members",        free: false,           launch: false,         scale: "Up to 5",      business: "Unlimited"      },
  { label: "Product access",      free: "Basic",         launch: "Basic",       scale: "Premium",      business: "Premium"        },
  { label: "Neck labels",         free: false,           launch: false,         scale: true,           business: true             },
  { label: "Premium packaging",   free: false,           launch: false,         scale: true,           business: true             },
  { label: "Custom domain",       free: false,           launch: true,          scale: true,           business: true             },
  { label: "Branding",            free: "Halftone",      launch: "Custom",      scale: "Custom",       business: "White-label"    },
  { label: "Analytics",           free: "7-day",         launch: "Full",        scale: "Full",         business: "Advanced"       },
  { label: "Shopify integration", free: false,           launch: true,          scale: true,           business: true             },
  { label: "API access",          free: false,           launch: false,         scale: true,           business: true             },
  { label: "Fulfillment",         free: "Standard",      launch: "Standard",    scale: "Priority",     business: "Priority"       },
  { label: "Support",             free: "Community",     launch: "Email",       scale: "Priority",     business: "Dedicated mgr"  },
];

const FAQS = [
  {
    q: "What counts as an active drop?",
    a: "An active drop is a live, publicly-accessible drop page where customers can purchase. Drafts and archived drops do not count toward your limit.",
  },
  {
    q: "Is there a per-sale fee?",
    a: "No. Halftone does not charge any per-sale or revenue percentage. You keep the full margin between your retail price and production cost. Your payment processor (Razorpay) charges their standard processing fee.",
  },
  {
    q: "What is the difference between basic and premium products?",
    a: "Basic products include our core tee catalog (Regular Tee, Oversized Tee, Baby Tee). Premium products unlock specialty items including hoodies, waffle tees, and new product types as they launch — available on Scale and above.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of your current billing period.",
  },
  {
    q: "What does white-labelling include?",
    a: "On Business, all Halftone references are removed — storefront badges, email footers, packing slips. Your customers see only your brand.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No contracts. Monthly plans can be cancelled at any time. Annual plans are non-refundable after the first 14 days but retain full access until the period ends.",
  },
];

// ─── Razorpay checkout ────────────────────────────────────────────────────────
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
    theme:           { color: "#0f0f0f" },
    handler:         (response: Record<string, string>) => {
      fetch("/api/subscribe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, userId: opts.userId, plan: opts.plan, billing: opts.billing }),
      }).then(() => window.location.href = "/account/billing?plan=activated");
    },
  });
  rzp.open();
}

// ─── Cell renderer ────────────────────────────────────────────────────────────
function Cell({ val }: { val: FeatureVal }) {
  if (val === true)  return <Check className="w-4 h-4 text-zinc-800 mx-auto" strokeWidth={2.5} />;
  if (val === false) return <Minus className="w-3.5 h-3.5 text-zinc-200 mx-auto" />;
  return <span className="text-xs text-zinc-600 text-center leading-tight block">{val}</span>;
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-zinc-900 leading-snug">{q}</span>
        <span className="text-zinc-300 shrink-0 mt-0.5 text-lg leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-zinc-500 leading-relaxed -mt-1">{a}</p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const PLAN_INTENT_KEY = "ht_plan_intent";

export default function PricingPage() {
  const { currency } = useCurrency();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [userId,  setUserId]  = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const uid   = session?.user?.id ?? null;
      const email = session?.user?.email ?? null;
      setUserId(uid);
      setUserEmail(email);

      // Auto-trigger checkout if user just returned after login/signup
      if (uid && email) {
        const raw = localStorage.getItem(PLAN_INTENT_KEY);
        if (raw) {
          try {
            const { plan, billing: savedBilling } = JSON.parse(raw) as {
              plan: "launch" | "scale" | "business";
              billing: BillingCycle;
            };
            localStorage.removeItem(PLAN_INTENT_KEY);
            setBilling(savedBilling);
            // Small delay so state settles
            setTimeout(() => {
              openSubscriptionCheckout({ plan, billing: savedBilling, currency, userId: uid, userEmail: email })
                .catch(console.error);
            }, 300);
          } catch {
            localStorage.removeItem(PLAN_INTENT_KEY);
          }
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (inr: number) => fmtPrice(inr, currency);

  async function handleSubscribe(plan: "launch" | "scale" | "business") {
    if (!userId || !userEmail) {
      // Store intent so we can auto-trigger after login/signup
      localStorage.setItem(PLAN_INTENT_KEY, JSON.stringify({ plan, billing }));
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

  const annualSave = (plan: keyof typeof PRICES) =>
    Math.round(((PRICES[plan].monthly - PRICES[plan].annual) / PRICES[plan].monthly) * 100);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-28 pb-24">

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-zinc-400 mb-5">
              Pricing
            </p>
            <h1 className="text-[2.6rem] md:text-5xl font-bold text-zinc-950 tracking-[-0.04em] leading-[1.1] mb-5">
              Infrastructure for your<br />merch business
            </h1>
            <p className="text-zinc-500 text-base max-w-md mx-auto mb-5 leading-relaxed">
              Start free. Upgrade when your business demands it.
            </p>
            <p className="inline-block text-sm font-semibold text-zinc-900 border border-zinc-200 rounded-full px-4 py-1.5 bg-zinc-50">
              No per-sale fees. You keep your margin.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-10 inline-flex items-center gap-0.5 bg-zinc-100 rounded-full p-1"
          >
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                billing === "monthly" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "annual" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Annual
              <span className="text-[0.62rem] font-bold tracking-wider bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                SAVE UP TO 20%
              </span>
            </button>
          </motion.div>
        </section>

        {/* Plan cards */}
        <section className="max-w-6xl mx-auto px-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">Free</p>
                <p className="text-xs text-zinc-400 mb-4">Your first drop. No card required.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-zinc-950 tracking-tight">{fmt(0)}</span>
                  <span className="text-zinc-400 text-sm">/ mo</span>
                </div>
              </div>
              <Link
                href="/signup"
                className="block w-full text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors mt-1 mb-6"
              >
                Get started free
              </Link>
              <ul className="space-y-2.5 flex-1">
                {["1 active drop", "Unlimited designs", "Halftone-branded storefront", "7-day analytics"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-500">
                    <Check className="w-3.5 h-3.5 text-zinc-300 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* LAUNCH */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
              className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">Launch</p>
                <p className="text-xs text-zinc-400 mb-4">For solo creators ready to build their brand.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-zinc-950 tracking-tight">{fmt(PRICES.launch[billing])}</span>
                  <span className="text-zinc-400 text-sm">/ mo</span>
                </div>
                {billing === "annual" && (
                  <p className="text-[0.68rem] text-zinc-400 mt-1">Saves {annualSave("launch")}% vs monthly</p>
                )}
              </div>
              <button
                onClick={() => handleSubscribe("launch")}
                disabled={loading === "launch"}
                className="block w-full text-center py-2.5 rounded-xl border border-zinc-900 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors mt-1 mb-6 disabled:opacity-50"
              >
                {loading === "launch" ? "Loading..." : "Get started"}
              </button>
              <ul className="space-y-2.5 flex-1">
                {[
                  "5 active drops",
                  "Unlimited designs",
                  "Basic product catalog",
                  "Custom domain",
                  "Custom branding",
                  "Shopify integration",
                  "Full analytics + CSV",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-500">
                    <Check className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* SCALE — recommended */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="relative border-2 border-zinc-900 rounded-2xl p-6 bg-zinc-950 flex flex-col"
            >
              <div className="absolute -top-3 left-6">
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[0.6rem] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <div className="mb-4">
                <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3 mt-1">Scale</p>
                <p className="text-xs text-zinc-500 mb-4">The core plan for serious creators.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white tracking-tight">{fmt(PRICES.scale[billing])}</span>
                  <span className="text-zinc-500 text-sm">/ mo</span>
                </div>
                {billing === "annual" && (
                  <p className="text-[0.68rem] text-zinc-500 mt-1">Saves {annualSave("scale")}% vs monthly</p>
                )}
              </div>
              <button
                onClick={() => handleSubscribe("scale")}
                disabled={loading === "scale"}
                className="block w-full text-center py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors mt-1 mb-6 disabled:opacity-50"
              >
                {loading === "scale" ? "Loading..." : "Get started"}
              </button>
              <ul className="space-y-2.5 flex-1">
                {[
                  "Unlimited active drops",
                  "Premium product access",
                  "Neck labels unlocked",
                  "Premium packaging",
                  "Up to 5 team members",
                  "3 storefronts",
                  "API access",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* BUSINESS */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
              className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">Business</p>
                <p className="text-xs text-zinc-400 mb-4">For agencies, labels, and multi-brand operators.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-zinc-950 tracking-tight">{fmt(PRICES.business[billing])}</span>
                  <span className="text-zinc-400 text-sm">/ mo</span>
                </div>
                {billing === "annual" && (
                  <p className="text-[0.68rem] text-zinc-400 mt-1">Saves {annualSave("business")}% vs monthly</p>
                )}
              </div>
              <button
                onClick={() => handleSubscribe("business")}
                disabled={loading === "business"}
                className="block w-full text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors mt-1 mb-6 disabled:opacity-50"
              >
                {loading === "business" ? "Loading..." : "Get started"}
              </button>
              <ul className="space-y-2.5 flex-1">
                {[
                  "Unlimited storefronts",
                  "White-label — remove Halftone branding",
                  "Unlimited team members",
                  "Bulk order discounts",
                  "Dedicated account manager",
                  "Priority fulfillment",
                  "Advanced analytics",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-500">
                    <Check className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Enterprise card */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl bg-zinc-950 border border-zinc-800 p-8 md:p-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="lg:max-w-[520px]">
                <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-500 mb-3">Enterprise</p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-white tracking-tight">{fmt(150000)}</span>
                  <span className="text-zinc-500 text-sm">/ mo starting</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  For brands running serious volume. Custom manufacturing, hybrid inventory, next-day dispatch SLA, and a dedicated operations team.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
                >
                  Contact sales
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-[380px]">
                {[
                  "Custom product development",
                  "Hybrid inventory model",
                  "Next-day dispatch SLA",
                  "Amazon, Myntra, Etsy, Shopify",
                  "Dedicated operations team",
                  "Advanced inventory system",
                  "Custom workflows + integrations",
                  "Priority production + support",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span className="text-sm text-zinc-300 leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Live brands */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl bg-zinc-50 border border-zinc-100 px-8 pt-10 pb-12"
          >
            <div className="text-center mb-10">
              <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">Live on Halftone</p>
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight mb-2">Real drops. Real brands.</h2>
              <p className="text-sm text-zinc-400">Discover artists, labels, and brands launching drops right now.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LIVE_BRANDS.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center justify-center gap-3 rounded-xl px-5 py-6 border transition-all duration-200 ${
                    brand.bg
                      ? `${brand.bg} hover:opacity-90`
                      : brand.dark
                      ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                      : "bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-center w-full h-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <span className={`text-[0.68rem] font-medium transition-colors text-center leading-tight ${
                    brand.dark ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-700"
                  }`}>
                    {brand.name}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Comparison table */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="mb-10">
            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">Compare plans</p>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Everything side by side</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm border-t border-zinc-100">
              <thead>
                <tr>
                  <th className="text-left py-4 pr-6 text-zinc-400 font-normal text-xs w-[30%]"></th>
                  <th className="text-center py-4 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Free</th>
                  <th className="text-center py-4 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Launch</th>
                  <th className="text-center py-4 px-3 text-xs font-bold text-zinc-900 uppercase tracking-wider bg-zinc-50 rounded-t-lg">Scale</th>
                  <th className="text-center py-4 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Business</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr key={row.label} className={`border-t border-zinc-100 ${i % 2 === 1 ? "bg-zinc-50/40" : ""}`}>
                    <td className="py-3.5 pr-6 text-sm text-zinc-600 font-medium">{row.label}</td>
                    <td className="py-3.5 px-3 text-center"><Cell val={row.free} /></td>
                    <td className="py-3.5 px-3 text-center"><Cell val={row.launch} /></td>
                    <td className="py-3.5 px-3 text-center bg-zinc-50/60"><Cell val={row.scale} /></td>
                    <td className="py-3.5 px-3 text-center"><Cell val={row.business} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400 mt-4">Enterprise includes everything in Business, plus custom manufacturing, hybrid inventory, and a dedicated ops team.</p>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 mb-24">
          <div className="mb-8">
            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">FAQ</p>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Common questions</h2>
          </div>
          <div>
            {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-2xl mx-auto px-6">
          <div className="bg-zinc-950 rounded-2xl p-10 text-center">
            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-zinc-500 mb-4">Still deciding?</p>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
              Talk to us before you commit
            </h2>
            <p className="text-zinc-400 text-sm mb-7 leading-relaxed">
              We are happy to walk you through which plan fits your volume and workflow.
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
