"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BRAND_FACTS = [
  { label: "Founded", value: "2021" },
  { label: "Headquarters", value: "India" },
  { label: "Garments printed", value: "10,000+" },
  { label: "Artists & brands served", value: "500+" },
  { label: "Focus", value: "Independent artists & creator brands" },
  { label: "Print methods", value: "DTG, DTF" },
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Press & Media</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">For journalists </span>
                <span className="h-bold">& media teams.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                Writing about the creator economy, independent music, or Indian fashion?
                Find our brand assets, key facts, and press contact below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Brand facts */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Company Facts</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BRAND_FACTS.map((f) => (
              <div key={f.label} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-5">
                <p className="text-xs text-ds-muted font-mono uppercase tracking-widest mb-2">{f.label}</p>
                <p className="text-ds-dark text-sm font-semibold">{f.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brand assets */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">Brand Assets</span>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { title: "Logo Pack", desc: "SVG + PNG in light, dark, and transparent variants.", icon: "🖼️" },
                { title: "Brand Guidelines", desc: "Colours, typography, tone of voice, and usage rules.", icon: "📖" },
                { title: "Product Photos", desc: "High-res photography of our garments and studio.", icon: "📸" },
                { title: "Founder Bio & Photo", desc: "Short bio and approved photography for editorial use.", icon: "👤" },
              ].map((a) => (
                <div key={a.title} className="bg-white border border-black/[0.06] rounded-2xl p-6 flex items-start gap-4">
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-ds-dark text-sm font-semibold mb-1">{a.title}</p>
                    <p className="text-ds-muted text-xs leading-relaxed">{a.desc}</p>
                  </div>
                  <a
                    href="mailto:hello@halftonelabs.in?subject=Press assets request"
                    className="text-ds-muted hover:text-ds-dark transition-colors"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ds-muted">
              Assets are available on request. Email us and we&apos;ll send a download link within 24 hours.
            </p>
          </div>
        </section>

        {/* Press contact */}
        <section className="border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-6 block">Press Contact</span>
            <h2 className="text-2xl text-ds-dark mb-4" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
              Get in touch
            </h2>
            <p className="text-ds-body text-sm mb-8 max-w-lg leading-relaxed">
              For interviews, quotes, product samples, or partnership enquiries. We respond
              to press enquiries within 48 hours.
            </p>
            <a href="mailto:hello@halftonelabs.in?subject=Press enquiry" className="btn-brand inline-flex">
              <ArrowUpRight size={15} /> hello@halftonelabs.in
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
