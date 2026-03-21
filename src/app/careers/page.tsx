"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PERKS = [
  { emoji: "🎨", title: "Creative-first environment", body: "We work with artists every day. You will too." },
  { emoji: "📦", title: "Hands-on work", body: "See your work go from a file on a screen to a garment in someone's hands." },
  { emoji: "🇮🇳", title: "India-based & independent", body: "We're not a corporate. We move fast, try things, and actually listen." },
  { emoji: "📈", title: "Room to grow", body: "We're small now. Get in early and grow with us." },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Careers</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">Build the future of </span>
                <span className="h-bold">creator merch in India.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                We&apos;re a small, passionate team building the infrastructure for independent
                artists to sell merch they&apos;re proud of. If that excites you, keep reading.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Why Halftone Labs</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-6">
                <span className="text-3xl block mb-4">{p.emoji}</span>
                <h3 className="text-ds-dark text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-ds-muted text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open roles */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">Open Roles</span>
            <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center">
              <p className="text-2xl text-ds-dark mb-3" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
                No open roles right now
              </p>
              <p className="text-ds-body text-sm max-w-md mx-auto mb-8 leading-relaxed">
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
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
