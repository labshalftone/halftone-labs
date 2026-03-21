"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BRAND_FACTS = [
  { label: "Founded", value: "2021" },
  { label: "Headquarters", value: "India" },
  { label: "Garments printed", value: "10,000+" },
  { label: "Artists & brands served", value: "500+" },
  { label: "Focus", value: "Independent artists & creator brands" },
  { label: "Print methods", value: "DTG, DTF, screen printing" },
];

export default function PressPage() {
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
            <span className="ds-label text-white/30 block mb-6">Press & Media</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">For journalists </span>
              <span className="h-bold-dark">& media teams.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              Writing about the creator economy, independent music, or Indian fashion? We&apos;d
              love to be part of the story. Find our brand assets, key facts, and press contact
              below.
            </p>
          </motion.div>
        </section>

        {/* Brand facts */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-10">Company Facts</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BRAND_FACTS.map((f) => (
                <div key={f.label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                  <p className="text-xs text-white/30 font-mono uppercase tracking-widest mb-2">{f.label}</p>
                  <p className="text-white text-sm font-semibold">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand assets */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-10">Brand Assets</span>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Logo Pack", desc: "SVG + PNG in light, dark, and transparent variants.", icon: "🖼️" },
              { title: "Brand Guidelines", desc: "Colours, typography, tone of voice, and usage rules.", icon: "📖" },
              { title: "Product Photos", desc: "High-res photography of our garments and studio.", icon: "📸" },
              { title: "Founder Bio & Photo", desc: "Short bio and approved photography for editorial use.", icon: "👤" },
            ].map((a) => (
              <div key={a.title} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 flex items-start gap-4">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold mb-1">{a.title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{a.desc}</p>
                </div>
                <a
                  href="mailto:hello@halftonelabs.in?subject=Press assets request"
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/25">
            Assets are available on request. Email us and we&apos;ll send a download link within 24 hours.
          </p>
        </section>

        {/* Press contact */}
        <section className="border-t border-white/[0.05] bg-ds-light-gray">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-6">Press Contact</span>
            <h2 className="text-2xl mb-4" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
              Get in touch
            </h2>
            <p className="text-white/40 text-sm mb-8 max-w-lg leading-relaxed">
              For interviews, quotes, product samples, or partnership enquiries, reach us
              directly. We respond to press enquiries within 48 hours.
            </p>
            <a
              href="mailto:hello@halftonelabs.in?subject=Press enquiry"
              className="btn-brand inline-flex"
            >
              <ArrowUpRight size={15} /> hello@halftonelabs.in
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
