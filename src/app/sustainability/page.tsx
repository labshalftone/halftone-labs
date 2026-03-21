"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ACTIONS = [
  {
    emoji: "🌿",
    title: "Organic & sustainable fabrics",
    body: "We stock and actively promote GOTS-certified organic cotton blanks. When you see the 'Organic' tag in Studio, the base fabric is certified pesticide-free and sustainably farmed.",
  },
  {
    emoji: "🖨️",
    title: "Water-based inks",
    body: "Our DTG printing uses water-based inks — lower toxicity, better biodegradability, and softer on the garment. We avoid plastisol inks wherever possible.",
  },
  {
    emoji: "📦",
    title: "Minimal packaging",
    body: "We ship in recyclable poly mailers and unbleached kraft paper. We don&apos;t use foam, bubble wrap, or excessive void fill. Custom packaging uses uncoated or recycled materials.",
  },
  {
    emoji: "🔁",
    title: "Print on demand by default",
    body: "Our model is built around on-demand production. We don&apos;t print and warehouse. Every item is made after it&apos;s ordered — which means near-zero unsold inventory waste.",
  },
  {
    emoji: "🇮🇳",
    title: "Local production",
    body: "Everything is produced in India. Shorter supply chains mean fewer freight miles, lower carbon emissions, and faster delivery to you.",
  },
  {
    emoji: "📏",
    title: "Made to last",
    body: "We obsess over wash durability. A garment that lasts 3 years is always more sustainable than one that fades in 10 washes. Our print standards are set with longevity in mind.",
  },
];

export default function SustainabilityPage() {
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
            <span className="ds-label text-white/30 block mb-6">Sustainability</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Good merch shouldn&apos;t cost </span>
              <span className="h-bold-dark">the planet.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              The fashion and merch industry has a waste problem. We&apos;re building a studio that
              takes that seriously — from the fabrics we stock to how we package and ship.
            </p>
          </motion.div>
        </section>

        {/* Actions */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-10">What we&apos;re doing</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {ACTIONS.map((a) => (
                <div key={a.title} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7">
                  <span className="text-3xl block mb-4">{a.emoji}</span>
                  <h3 className="text-white text-sm font-semibold mb-2">{a.title}</h3>
                  <p
                    className="text-white/40 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: a.body }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Honest section */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-6">Our honest take</span>
          <div className="max-w-2xl">
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              We&apos;re not going to claim we&apos;re a zero-impact company — no merch studio is. But
              we believe in being honest about where we are and actively working to improve.
            </p>
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              Right now, our biggest lever is the on-demand model. By printing after orders
              are placed rather than stocking inventory, we eliminate the single largest source
              of waste in the merch industry: unsold product.
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              We&apos;re working on expanding our organic fabric range and formalising our
              packaging standards. If you have questions or suggestions, we&apos;d genuinely love
              to hear from you.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.05] bg-ds-light-gray">
          <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Questions about our materials or practices? We&apos;re happy to go into detail.
            </p>
            <a href="mailto:hello@halftonelabs.in?subject=Sustainability question" className="btn-brand inline-flex">
              Ask us anything
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
