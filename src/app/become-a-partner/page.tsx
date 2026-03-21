"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

const PARTNER_TYPES = [
  {
    icon: "🎤",
    title: "Artist & Creator",
    desc: "You make music, content, or art. We handle your merch end-to-end — design consultation, production, fulfilment. You focus on your work.",
    cta: "Apply as an artist",
  },
  {
    icon: "🏢",
    title: "Agency & Management",
    desc: "You manage artists or brands. We become your merch production partner — white-label friendly, bulk-capable, and reliable.",
    cta: "Apply as an agency",
  },
  {
    icon: "🎪",
    title: "Event & Festival",
    desc: "Running a festival, conference, or live event? We handle uniform and merch production at scale with tight turnarounds.",
    cta: "Apply as an event",
  },
];

const STEPS = [
  { n: "01", title: "Apply below", body: "Tell us about your brand or business and what you're looking for. Takes 2 minutes." },
  { n: "02", title: "We review & reach out", body: "Our team reviews every application and responds within 3–5 business days." },
  { n: "03", title: "Sample run", body: "We do a small sample order so you can see our quality first-hand before committing to anything." },
  { n: "04", title: "Partner onboarding", body: "Get set up with a dedicated account manager, production calendar, and partner pricing." },
];

const BENEFITS = [
  "Partner pricing on all orders",
  "Dedicated account manager",
  "Priority production queue",
  "Custom packaging options",
  "Pre-season capacity blocks",
  "Co-marketing opportunities",
];

const FAQS = [
  { q: "Is there a minimum order volume to become a partner?", a: "We look for partners who are ordering or planning to order 200+ pieces per month consistently, or running 3+ drops per year. That said, we evaluate each application individually — reach out even if you're not sure you qualify." },
  { q: "Is this a white-label service?", a: "Yes. We can ship orders without Halftone Labs branding — your packaging, your tags, your brand. This is standard for agency and management partners." },
  { q: "How long does the onboarding process take?", a: "Typically 1–2 weeks from application to first production run. This includes the review, sample order, and account setup." },
  { q: "Do you work with international partners?", a: "We're based in India and primarily serve the Indian market. International partners are welcome, but fulfilment is currently optimised for domestic shipping." },
];

export default function BecomeAPartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const { isIndia } = useCurrency();
  const c = copy(isIndia);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Become a Partner</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                {c.partnerHeadline}
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                {c.partnerSubtitle}
              </p>
              <div className="flex gap-3 mt-8">
                <a href="#apply" className="btn-brand"><ArrowUpRight size={15} /> Apply now</a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partner types */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Who we partner with</span>
          <div className="grid md:grid-cols-3 gap-5">
            {PARTNER_TYPES.map((p) => (
              <div key={p.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-7">
                <span className="text-3xl block mb-4">{p.icon}</span>
                <h3 className="text-ds-dark font-semibold mb-2">{p.title}</h3>
                <p className="text-ds-body text-sm leading-relaxed mb-5">{p.desc}</p>
                <a href="#apply" className="text-brand text-sm font-semibold hover:underline inline-flex items-center gap-1">
                  {p.cta} <ArrowUpRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">Partner benefits</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BENEFITS.map((b) => (
                <div key={b} className="bg-white border border-black/[0.06] rounded-xl px-5 py-4 flex items-center gap-3">
                  <CheckCircle2 size={15} className="text-brand shrink-0" />
                  <span className="text-sm text-ds-body">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">How it works</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-6">
                  <p className="text-4xl font-mono text-black/[0.06] mb-4 font-bold">{s.n}</p>
                  <h3 className="text-ds-dark text-sm font-semibold mb-2">{s.title}</h3>
                  <p className="text-ds-muted text-xs leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-3xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">FAQ</span>
            <div className="space-y-5">
              {FAQS.map((f) => (
                <div key={f.q} className="bg-white border border-black/[0.06] rounded-2xl p-6">
                  <p className="text-ds-dark text-sm font-semibold mb-2">{f.q}</p>
                  <p className="text-ds-body text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="border-t border-black/[0.06]">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-5 block">Apply</span>
            <h2 className="text-3xl text-ds-dark mb-2" style={{ fontWeight: 700, letterSpacing: "-0.045em" }}>
              Tell us about you
            </h2>
            <p className="text-ds-body text-sm mb-10">We review every application and respond within 5 business days.</p>

            {submitted ? (
              <div className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-10 text-center">
                <CheckCircle2 size={40} className="text-brand mx-auto mb-4" />
                <h3 className="text-xl text-ds-dark font-bold mb-2">Application received</h3>
                <p className="text-ds-body text-sm">We&apos;ll review it and be in touch within 5 business days.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">Name</label>
                    <input type="text" required className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs text-ds-muted block mb-2 font-medium">Email</label>
                    <input type="email" required className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Brand / Company / Artist name</label>
                  <input type="text" required className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand" placeholder="Your brand name" />
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Partner type</label>
                  <select className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark focus:outline-none focus:border-brand">
                    <option value="">Select type</option>
                    <option>Artist / Creator</option>
                    <option>Label / Management agency</option>
                    <option>Creative agency</option>
                    <option>Event / Festival organiser</option>
                    <option>Brand / Business</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Website or Instagram</label>
                  <input type="text" className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand" placeholder="https://" />
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Expected order volume</label>
                  <select className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark focus:outline-none focus:border-brand">
                    <option value="">Select range</option>
                    <option>200–500 pieces/month</option>
                    <option>500–1,000 pieces/month</option>
                    <option>1,000+ pieces/month</option>
                    <option>Seasonal / drops-based</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ds-muted block mb-2 font-medium">Tell us more</label>
                  <textarea rows={3} className="w-full bg-ds-off-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm text-ds-dark placeholder-ds-muted focus:outline-none focus:border-brand resize-none" placeholder="What are you working on? What do you need from a merch partner?" />
                </div>
                <button type="submit" className="btn-brand w-full justify-center">
                  Submit application
                </button>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
