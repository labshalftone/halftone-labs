"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SPECS = [
  { label: "Fabric", value: "100% combed cotton, 180–220 GSM" },
  { label: "Print method", value: "DTG (Direct-to-Garment)" },
  { label: "Sizes", value: "XS – 3XL" },
  { label: "Colours available", value: "12+ base colours" },
  { label: "Min. order", value: "1 piece (on-demand)" },
  { label: "Production time", value: "48–72 hours" },
];

const STYLES = [
  { name: "Regular Fit", desc: "Classic silhouette. True-to-size.", tag: "Most popular" },
  { name: "Oversized Fit", desc: "Dropped shoulders, boxy cut. +8–12 cm across chest.", tag: "Artist favourite" },
  { name: "Baby Tee", desc: "Cropped, fitted. XS–XL.", tag: "" },
  { name: "Polo", desc: "Collar tee. Great for brand drops.", tag: "" },
];

export default function TShirtsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        <section className="pt-36 pb-20 max-w-[1200px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="ds-label text-white/30 block mb-6">Products / T-Shirts</span>
            <h1 className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl" style={{ fontWeight: 700, letterSpacing: "-0.055em" }}>
              <span className="h-fade-dark">Custom </span>
              <span className="h-bold-dark">T-Shirts</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base mb-8">
              Our core product. Combed cotton, DTG-printed, checked by a human before it ships. Available in regular, oversized, baby tee, and polo fits.
            </p>
            <div className="flex gap-3">
              <a href="/studio" className="btn-brand"><ArrowUpRight size={15} /> Design in Studio</a>
              <a href="/size-guide" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:border-white/25 hover:text-white transition-all">Size Guide</a>
            </div>
          </motion.div>
        </section>

        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-14">
              <div>
                <span className="ds-label text-white/30 block mb-6">Styles</span>
                <div className="space-y-3">
                  {STYLES.map((s) => (
                    <div key={s.name} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white text-sm font-semibold mb-1">{s.name}</p>
                        <p className="text-white/40 text-xs">{s.desc}</p>
                      </div>
                      {s.tag && <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-white/[0.06] px-2 py-1 rounded-full shrink-0">{s.tag}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="ds-label text-white/30 block mb-6">Specs</span>
                <div className="space-y-3">
                  {SPECS.map((s) => (
                    <div key={s.label} className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                      <span className="text-xs text-white/30 font-mono uppercase tracking-widest">{s.label}</span>
                      <span className="text-sm text-white/60">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl mb-4" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>Ready to create?</h2>
            <p className="text-white/40 text-sm mb-8">Upload your artwork in the Studio and see it on a garment instantly.</p>
            <a href="/studio" className="btn-brand inline-flex"><ArrowUpRight size={15} /> Open Studio</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
