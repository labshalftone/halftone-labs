"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VALUE_PROPS = [
  {
    emoji: "📦",
    title: "Volume pricing",
    body: "Orders of 200+ unlock tiered discounts up to 18% off standard rates. The more you order, the better your margin.",
  },
  {
    emoji: "🎨",
    title: "Custom packaging",
    body: "Custom poly mailers, hang tags, tissue wrap, and inserts. We handle end-to-end packaging so your drop feels premium.",
  },
  {
    emoji: "👤",
    title: "Dedicated account manager",
    body: "A single point of contact for all your orders, reorders, quality queries, and logistics. No tickets, no bots.",
  },
  {
    emoji: "🔄",
    title: "Ongoing drops support",
    body: "Planning multiple drops per year? We'll set up a production calendar and block capacity for you in advance.",
  },
];

const TESTIMONIALS = [
  { quote: "They turned our album release merch around in 4 days. Unreal quality.", name: "Independent artist, Mumbai" },
  { quote: "The bulk pricing made our festival uniform order actually profitable.", name: "Event production company, Delhi" },
  { quote: "First merch studio that actually reviewed our files before printing. Saved us from a disaster.", name: "Creator brand, Bangalore" },
];

export default function TalkToSalesPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Talk to Sales</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">Serious about merch? </span>
                <span className="h-bold">Let&apos;s talk.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                For artists, labels, brands, and agencies ordering at scale. Tell us about
                your business and we&apos;ll put together a custom plan.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-20">

            {/* Left: value props */}
            <div>
              <span className="ds-label ds-label-brand mb-8 block">What you get</span>
              <div className="space-y-6">
                {VALUE_PROPS.map((v) => (
                  <div key={v.title} className="flex gap-4">
                    <span className="text-2xl shrink-0">{v.emoji}</span>
                    <div>
                      <p className="text-ds-dark text-sm font-semibold mb-1">{v.title}</p>
                      <p className="text-ds-body text-sm leading-relaxed">{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="mt-14">
                <span className="ds-label ds-label-brand mb-6 block">What clients say</span>
                <div className="space-y-4">
                  {TESTIMONIALS.map((t) => (
                    <div key={t.name} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-5">
                      <p className="text-ds-dark text-sm leading-relaxed mb-3">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <p className="text-ds-muted text-xs">{t.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {submitted ? (
                <div className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-10 text-center">
                  <CheckCircle2 size={40} className="text-brand mx-auto mb-4" />
                  <h3 className="text-xl text-ds-dark font-bold mb-2">We&apos;ll be in touch</h3>
                  <p className="text-ds-body text-sm">We respond to sales enquiries within 24 hours on weekdays.</p>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-ds-muted block mb-2 font-medium">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ds-muted block mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">Company / Brand / Artist name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand"
                      placeholder="Your brand or artist name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">Expected monthly order volume</label>
                    <select className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark focus:outline-none focus:border-brand">
                      <option value="">Select range</option>
                      <option>50–200 pieces/month</option>
                      <option>200–500 pieces/month</option>
                      <option>500–1,000 pieces/month</option>
                      <option>1,000+ pieces/month</option>
                      <option>Seasonal / irregular drops</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">What do you need?</label>
                    <div className="space-y-2">
                      {["Bulk pricing", "Custom packaging", "Dedicated account manager", "Multiple drops per year", "Just exploring"].map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="accent-brand rounded" />
                          <span className="text-sm text-ds-body">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">Anything else?</label>
                    <textarea
                      rows={3}
                      className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand resize-none"
                      placeholder="Tell us about your next drop, tour dates, or specific requirements..."
                    />
                  </div>
                  <button type="submit" className="btn-brand w-full justify-center">
                    Send enquiry
                  </button>
                  <p className="text-xs text-ds-muted text-center">
                    We respond within 24 hours. Or email hello@halftonelabs.in directly.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
