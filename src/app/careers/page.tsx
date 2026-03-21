"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PERKS = [
  { emoji: "🎨", title: "Creative-first environment", body: "We work with artists every day. You will too." },
  { emoji: "📦", title: "Hands-on work", body: "See your work go from a file on a screen to a garment in someone&apos;s hands." },
  { emoji: "🇮🇳", title: "India-based & independent", body: "We&apos;re not a corporate. We move fast, try things, and actually listen." },
  { emoji: "📈", title: "Room to grow", body: "We&apos;re small now. Get in early and grow with us." },
];

export default function CareersPage() {
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
            <span className="ds-label text-white/30 block mb-6">Careers</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Build the future of </span>
              <span className="h-bold-dark">creator merch in India.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              We&apos;re a small, passionate team in India building the infrastructure for
              independent artists to sell merch they&apos;re proud of. If that excites you, keep
              reading.
            </p>
          </motion.div>
        </section>

        {/* Perks */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-10">Why Halftone Labs</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {PERKS.map((p) => (
                <div key={p.title} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
                  <span className="text-3xl block mb-4">{p.emoji}</span>
                  <h3 className="text-white text-sm font-semibold mb-2">{p.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: p.body }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-10">Open Roles</span>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-10 text-center">
            <p className="text-2xl mb-3" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
              No open roles right now
            </p>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              We&apos;re not actively hiring, but we&apos;re always interested in meeting talented
              people. If you&apos;re passionate about merch, design, or the creator economy, send
              us a note.
            </p>
            <a
              href="mailto:hello@halftonelabs.in?subject=Work with Halftone Labs"
              className="btn-brand inline-flex"
            >
              Say hello
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
