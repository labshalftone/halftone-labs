"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TIERS = [
  {
    qty: "50–199",
    label: "Starter",
    discount: "Standard pricing",
    perks: ["File review included", "Courier tracking", "1 design placement"],
  },
  {
    qty: "200–499",
    label: "Creator",
    discount: "5–8% off",
    perks: ["Priority queue", "Free pre-production sample", "Up to 2 placements"],
    highlight: true,
  },
  {
    qty: "500+",
    label: "Brand",
    discount: "10–18% off",
    perks: ["Dedicated account manager", "Custom packaging options", "Flexible payment terms"],
  },
];

const STEPS = [
  { n: "01", title: "Tell us your requirements", body: "Fill in the form below with your product, quantity, design details, and timeline. We respond within 24 hours." },
  { n: "02", title: "Receive a custom quote", body: "We'll send you a detailed quote with per-unit pricing, total cost, and estimated delivery dates." },
  { n: "03", title: "Approve & pay", body: "Confirm your order with a 50% advance. We start production immediately." },
  { n: "04", title: "Production & delivery", body: "We keep you updated throughout. Final balance on dispatch. Pan-India delivery." },
];

export default function BulkOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Bulk Orders</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">More units, </span>
                <span className="h-bold">better pricing.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                Ordering 50+ pieces? We have tiered pricing with dedicated production slots,
                priority support, and packaging options for drops, tours, and brand launches.
              </p>
              <div className="flex gap-3 mt-8">
                <a href="#quote" className="btn-brand"><ArrowUpRight size={15} /> Get a quote</a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tiers */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Volume pricing</span>
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div
                key={t.qty}
                className={`rounded-2xl p-7 border ${
                  t.highlight
                    ? "bg-brand-5 border-brand-20"
                    : "bg-ds-off-white border-black/[0.06]"
                }`}
              >
                <p className="text-xs text-ds-muted font-mono uppercase tracking-widest mb-3">{t.label}</p>
                <p className="text-3xl text-ds-dark mb-1" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>{t.qty}</p>
                <p className="text-sm text-ds-muted mb-5">units</p>
                <p className="text-base text-ds-dark font-semibold mb-5">{t.discount}</p>
                <ul className="space-y-2">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ds-body">
                      <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">How bulk orders work</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-white border border-black/[0.06] rounded-2xl p-6">
                  <p className="text-4xl font-mono text-black/[0.06] mb-4 font-bold">{s.n}</p>
                  <h3 className="text-ds-dark text-sm font-semibold mb-2">{s.title}</h3>
                  <p className="text-ds-muted text-xs leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote form */}
        <section id="quote" className="border-t border-black/[0.06]">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-5 block">Get a quote</span>
            <h2
              className="text-3xl text-ds-dark mb-10"
              style={{ fontWeight: 700, letterSpacing: "-0.045em" }}
            >
              Tell us about your order
            </h2>
            <form
              action="mailto:hello@halftonelabs.in"
              method="get"
              encType="text/plain"
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Your name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                    placeholder="Artist / Brand name"
                  />
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Product type</label>
                  <select
                    name="product"
                    className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark focus:outline-none focus:border-brand"
                  >
                    <option value="">Select product</option>
                    <option value="regular-tee">Regular Tee</option>
                    <option value="oversized-tee">Oversized Tee</option>
                    <option value="baby-tee">Baby Tee</option>
                    <option value="hoodie">Hoodie</option>
                    <option value="waffle-tee">Waffle Tee</option>
                    <option value="mixed">Mixed / Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="50"
                    required
                    className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-ds-muted block mb-2 font-medium">Tell us more</label>
                <textarea
                  name="details"
                  rows={4}
                  className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand resize-none"
                  placeholder="Design details, colours, sizes breakdown, deadline, packaging..."
                />
              </div>
              <button type="submit" className="btn-brand w-full justify-center">
                Send enquiry
              </button>
              <p className="text-xs text-ds-muted text-center">
                We respond within 24 hours. You can also email us at hello@halftonelabs.in
              </p>
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
