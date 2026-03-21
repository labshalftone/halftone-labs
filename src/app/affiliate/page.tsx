"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "How do I join the affiliate program?",
    a: "Create a Halftone Labs account, head to your dashboard, click the Affiliate tab, and fill out a short application. Approvals typically happen within 24 hours.",
  },
  {
    q: "How much can I earn?",
    a: "You earn 5% on every order your referrals place, ₹500–₹5,000 as a one-time bonus when they subscribe to a plan, and 10% of their monthly subscription fee for 12 months.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are processed once your pending balance reaches ₹500. Just hit 'Request Payout' in your affiliate dashboard and we'll transfer within 3–5 business days.",
  },
  {
    q: "Who should become an affiliate?",
    a: "Fashion designers, print-on-demand educators, Instagram creators, Shopify consultants, college communities — anyone with an audience that sells or creates merchandise.",
  },
  {
    q: "How does referral tracking work?",
    a: "You get a unique referral link (e.g. halftonelabs.in?ref=YOURCODE). Anyone who signs up using your link is attributed to you. Tracking is cookie-based and lasts 30 days.",
  },
  {
    q: "Can I promote Halftone Labs on social media?",
    a: "Absolutely. We encourage blog posts, YouTube reviews, Instagram reels, and honest comparisons. Just don't make misleading claims about pricing or results.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.07] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-ds-dark text-sm sm:text-base">{q}</span>
        <svg
          className={`w-5 h-5 text-ds-muted transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-ds-body pb-5 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="min-h-screen bg-ds-dark flex flex-col items-center justify-center text-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/70 tracking-wide">Affiliate Program · Now Open</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Earn with every
            <br />
            <span className="text-brand">referral</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 mb-10 leading-relaxed max-w-xl mx-auto">
            Share Halftone Labs with your audience and earn commissions on every order,
            subscription, and recurring monthly payment — for a full year.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="btn-brand inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-base"
            >
              Become an Affiliate
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center h-14 px-8 rounded-2xl border border-white/[0.15] text-white font-semibold text-base hover:bg-white/[0.05] transition-colors"
            >
              How it works
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
            {[
              { val: "₹5,000", label: "Max per signup" },
              { val: "12 mo", label: "Recurring payouts" },
              { val: "Real-time", label: "Earnings tracking" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl py-4 px-3">
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.04em" }}>{s.val}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Commission cards ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Commission Structure</p>
            <h2 className="text-4xl font-bold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
              Three ways to earn
            </h2>
            <p className="text-ds-body mt-3 text-base max-w-md mx-auto">
              Stack commissions across orders, subscriptions, and monthly recurring revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
                color: "bg-brand-8 text-brand",
                highlight: "5%",
                title: "Per order",
                desc: "Earn 5% of every order value placed by users you refer. No cap, no limit — the more they order, the more you earn.",
                tag: "On every order",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                color: "bg-emerald-50 text-emerald-600",
                highlight: "Up to ₹5,000",
                title: "Per subscription",
                desc: "Get a one-time bonus when your referrals subscribe: ₹500 for Launch, ₹1,500 for Scale, ₹5,000 for Business.",
                tag: "One-time bonus",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
                color: "bg-blue-50 text-blue-600",
                highlight: "10% × 12 mo",
                title: "Recurring monthly",
                desc: "Earn 10% of your referral's monthly subscription fee every month for 12 consecutive months.",
                tag: "Every month",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-black/[0.07] p-7 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-5`}>
                  {card.icon}
                </div>
                <p className="text-3xl font-bold text-ds-dark mb-1" style={{ letterSpacing: "-0.04em" }}>{card.highlight}</p>
                <p className="font-bold text-ds-dark mb-2">{card.title}</p>
                <p className="text-sm text-ds-body leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-black/[0.04] text-ds-body">
                  {card.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-ds-dark py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { val: "₹500+", label: "Average commission", sub: "Per active referral per month" },
            { val: "50%+", label: "Margins we share", sub: "Our margins are high so yours can be too" },
            { val: "Real-time", label: "Earnings tracking", sub: "Live dashboard with click & signup data" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-white" style={{ letterSpacing: "-0.04em" }}>{s.val}</p>
              <p className="font-semibold text-white/80 mt-1">{s.label}</p>
              <p className="text-xs text-white/40 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Process</p>
            <h2 className="text-4xl font-bold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>How it works</h2>
            <p className="text-ds-body mt-3 max-w-sm mx-auto">Three simple steps from application to payout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share your link",
                desc: "After approval, you get a unique referral link. Share it on your blog, social channels, YouTube, email list — wherever your audience lives.",
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
              },
              {
                step: "02",
                title: "They sign up & order",
                desc: "Your audience clicks the link, creates a Halftone Labs account, and starts placing orders or subscribes to a plan. Every action tracks back to you.",
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
              },
              {
                step: "03",
                title: "You earn commission",
                desc: "Watch your earnings grow in real-time. Request a payout anytime your balance exceeds ₹500 and we'll bank transfer within 3–5 business days.",
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-8 text-brand flex items-center justify-center mx-auto mb-5">
                  {step.icon}
                </div>
                <p className="text-xs font-bold text-brand tracking-widest mb-2">{step.step}</p>
                <h3 className="text-xl font-bold text-ds-dark mb-3" style={{ letterSpacing: "-0.03em" }}>{step.title}</h3>
                <p className="text-sm text-ds-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-ds-light-gray">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">FAQ</p>
            <h2 className="text-4xl font-bold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Common questions</h2>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.07] px-6">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 bg-ds-dark">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ letterSpacing: "-0.04em" }}>
              Start earning today
            </h2>
            <p className="text-white/60 mb-8 text-base leading-relaxed">
              Join creators already earning with Halftone Labs. Apply in minutes, get approved in hours.
            </p>
            <Link
              href="/signup"
              className="btn-brand inline-flex items-center justify-center gap-2 h-14 px-10 rounded-2xl text-base"
            >
              Become an Affiliate
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="text-white/30 text-xs mt-5">Free to join · No minimum sales · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
