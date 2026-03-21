"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ACTIONS = [
  { emoji: "🌿", title: "Organic & sustainable fabrics", body: "We stock and actively promote GOTS-certified organic cotton blanks. When you see the 'Organic' tag in Studio, the base fabric is certified pesticide-free and sustainably farmed." },
  { emoji: "🖨️", title: "Water-based inks", body: "Our DTG printing uses water-based inks — lower toxicity, better biodegradability, and softer on the garment. We avoid plastisol inks wherever possible." },
  { emoji: "📦", title: "Minimal packaging", body: "We ship in recyclable poly mailers and unbleached kraft paper. No foam, bubble wrap, or excessive void fill. Custom packaging uses uncoated or recycled materials." },
  { emoji: "🔁", title: "Print on demand by default", body: "Our model is built around on-demand production. We don't print and warehouse. Every item is made after it's ordered — near-zero unsold inventory waste." },
  { emoji: "🇮🇳", title: "Local production", body: "Everything is produced in India. Shorter supply chains mean fewer freight miles, lower carbon emissions, and faster delivery to you." },
  { emoji: "📏", title: "Made to last", body: "We obsess over wash durability. A garment that lasts 3 years is always more sustainable than one that fades in 10 washes." },
];

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Sustainability</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">Good merch shouldn&apos;t cost </span>
                <span className="h-bold">the planet.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                The fashion and merch industry has a waste problem. We&apos;re building a studio
                that takes that seriously — from the fabrics we stock to how we package and ship.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Actions */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">What we&apos;re doing</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ACTIONS.map((a) => (
              <div key={a.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-7">
                <span className="text-3xl block mb-4">{a.emoji}</span>
                <h3 className="text-ds-dark text-sm font-semibold mb-2">{a.title}</h3>
                <p className="text-ds-muted text-xs leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Honest section */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-6 block">Our honest take</span>
            <div className="max-w-2xl">
              <p className="text-ds-body leading-relaxed mb-4">
                We&apos;re not going to claim we&apos;re a zero-impact company — no merch studio is.
                But we believe in being honest about where we are and actively working to improve.
              </p>
              <p className="text-ds-body leading-relaxed mb-4">
                Our biggest lever right now is the on-demand model. By printing after orders
                are placed rather than stocking inventory, we eliminate the single largest
                source of waste in the merch industry: unsold product.
              </p>
              <p className="text-ds-body leading-relaxed">
                We&apos;re working on expanding our organic fabric range. If you have questions
                or suggestions, we&apos;d love to hear from you.
              </p>
              <div className="mt-8">
                <a href="mailto:hello@halftonelabs.in?subject=Sustainability question" className="btn-brand inline-flex">
                  Ask us anything
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
