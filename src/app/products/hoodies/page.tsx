"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SPECS = [
  { label: "Fabric", value: "80% cotton / 20% polyester fleece, 320–380 GSM" },
  { label: "Print method", value: "DTG / DTF on request" },
  { label: "Sizes", value: "S – 3XL" },
  { label: "Colours available", value: "8 base colours" },
  { label: "Min. order", value: "1 piece (on-demand)" },
  { label: "Production time", value: "48–72 hours" },
];

export default function HoodiesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        <section className="pt-36 pb-20 max-w-[1200px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="ds-label text-white/30 block mb-6">Products / Hoodies</span>
            <h1 className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl" style={{ fontWeight: 700, letterSpacing: "-0.055em" }}>
              <span className="h-fade-dark">Custom </span>
              <span className="h-bold-dark">Hoodies</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base mb-8">
              Heavy cotton-poly fleece. Kangaroo pocket, ribbed cuffs, and adjustable drawstrings. The merch staple that sells.
            </p>
            <div className="flex gap-3">
              <a href="/studio" className="btn-brand"><ArrowUpRight size={15} /> Design in Studio</a>
              <a href="/size-guide" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:border-white/25 hover:text-white transition-all">Size Guide</a>
            </div>
          </motion.div>
        </section>

        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-6">Specs</span>
            <div className="max-w-md space-y-3">
              {SPECS.map((s) => (
                <div key={s.label} className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                  <span className="text-xs text-white/30 font-mono uppercase tracking-widest">{s.label}</span>
                  <span className="text-sm text-white/60 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl mb-4" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>Ready to create?</h2>
            <p className="text-white/40 text-sm mb-8">Upload your artwork in the Studio and see it on a hoodie instantly.</p>
            <a href="/studio" className="btn-brand inline-flex"><ArrowUpRight size={15} /> Open Studio</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
