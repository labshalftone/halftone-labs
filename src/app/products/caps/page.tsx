"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SPECS = [
  { label: "Styles", value: "Structured 6-panel, Dad hat (5-panel unstructured)" },
  { label: "Fabric", value: "Cotton twill" },
  { label: "Closure", value: "Snapback or adjustable strap" },
  { label: "Print method", value: "Embroidery / DTF patch" },
  { label: "Min. order", value: "1 piece" },
  { label: "Production time", value: "3–5 business days" },
];

export default function CapsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        <section className="pt-36 pb-20 max-w-[1200px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="ds-label text-white/30 block mb-6">Products / Caps</span>
            <h1 className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl" style={{ fontWeight: 700, letterSpacing: "-0.055em" }}>
              <span className="h-fade-dark">Custom </span>
              <span className="h-bold-dark">Caps</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base mb-8">
              Structured 6-panel and dad hat styles. Embroidered or DTF-patched. A finishing touch for any merch drop.
            </p>
            <div className="flex gap-3">
              <a href="mailto:hello@halftonelabs.in?subject=Custom caps enquiry" className="btn-brand"><ArrowUpRight size={15} /> Get a quote</a>
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
            <p className="text-white/40 text-sm mb-6">Caps are available via custom quote. Email us with your design and quantity.</p>
            <a href="mailto:hello@halftonelabs.in?subject=Custom caps" className="btn-brand inline-flex"><ArrowUpRight size={15} /> Email us</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
