"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
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
    discount: "5–8% discount",
    perks: ["Priority queue", "Free pre-production sample", "Up to 2 placements"],
    highlight: true,
  },
  {
    qty: "500+",
    label: "Brand",
    discount: "10–18% discount",
    perks: ["Dedicated account manager", "Custom packaging options", "Flexible payment terms"],
  },
];

const STEPS = [
  { n: "01", title: "Tell us your requirements", body: "Fill in the form below with your product, quantity, design details, and timeline. We respond within 24 hours." },
  { n: "02", title: "Receive a custom quote", body: "We&apos;ll send you a detailed quote with per-unit pricing, total cost, and estimated delivery dates." },
  { n: "03", title: "Approve & pay", body: "Confirm your order with a 50% advance. We start production immediately." },
  { n: "04", title: "Production & delivery", body: "We keep you updated throughout. Final balance on dispatch. Pan-India delivery." },
];

export default function BulkOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        {/* Hero */}
        <section className="pt-36 pb-20 max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ds-label text-white/30 block mb-6">Bulk Orders</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">More units, </span>
              <span className="h-bold-dark">better pricing.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              Ordering 50+ pieces? We have tiered pricing with dedicated production slots,
              priority support, and packaging options for drops, tours, and brand launches.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#quote" className="btn-brand">
                <ArrowUpRight size={15} /> Get a quote
              </a>
            </div>
          </motion.div>
        </section>

        {/* Tiers */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-10">Volume pricing</span>
            <div className="grid md:grid-cols-3 gap-5">
              {TIERS.map((t) => (
                <div
                  key={t.qty}
                  className={`rounded-2xl p-7 border ${
                    t.highlight
                      ? "bg-brand-8 border-brand-25"
                      : "bg-white/[0.04] border-white/[0.07]"
                  }`}
                >
                  <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
                    {t.label}
                  </p>
                  <p className="text-3xl text-white mb-1" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
                    {t.qty}
                  </p>
                  <p className="text-sm text-white/50 mb-5">units</p>
                  <p className="text-base text-white font-semibold mb-5">{t.discount}</p>
                  <ul className="space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-white/50">
                        <CheckCircle2 size={14} className="text-white/30 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-10">How bulk orders work</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <p className="text-4xl font-mono text-white/[0.08] mb-4 font-bold">{s.n}</p>
                <h3 className="text-white text-sm font-semibold mb-2">{s.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
              </div>
            ))}
          </div>
        </section>

        {/* Quote form */}
        <section id="quote" className="border-t border-white/[0.05] bg-ds-light-gray">
          <div className="max-w-[700px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-6">Get a quote</span>
            <h2 className="text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: "-0.045em" }}>
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
                  <label className="text-xs text-white/40 block mb-2">Your name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                    placeholder="Artist / Brand name"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-white/40 block mb-2">Product type</label>
                  <select
                    name="product"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="" className="bg-[#111]">Select product</option>
                    <option value="t-shirts" className="bg-[#111]">T-Shirts</option>
                    <option value="hoodies" className="bg-[#111]">Hoodies</option>
                    <option value="caps" className="bg-[#111]">Caps</option>
                    <option value="tote-bags" className="bg-[#111]">Tote Bags</option>
                    <option value="phone-cases" className="bg-[#111]">Phone Cases</option>
                    <option value="posters" className="bg-[#111]">Posters</option>
                    <option value="stickers" className="bg-[#111]">Stickers</option>
                    <option value="mixed" className="bg-[#111]">Mixed / Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="50"
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-2">Tell us more</label>
                <textarea
                  name="details"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
                  placeholder="Design details, colours, sizes breakdown, deadline, packaging requirements..."
                />
              </div>
              <button type="submit" className="btn-brand w-full justify-center">
                Send enquiry
              </button>
              <p className="text-xs text-white/25 text-center">
                We respond within 24 hours. You can also email us directly at hello@halftonelabs.in
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
