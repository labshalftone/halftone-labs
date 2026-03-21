"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PILLARS = [
  {
    emoji: "🧵",
    title: "Blanks we actually believe in",
    body: "Every fabric we stock has been tested for shrinkage, colour retention, and washability. We use combed cotton as our standard — softer, stronger, and better for print adhesion.",
  },
  {
    emoji: "🖨️",
    title: "Print methods that last",
    body: "We use DTG (Direct-to-Garment) as our primary method — it&apos;s breathable, vibrant, and produces zero plastic feel. DTF is available for specific design styles that benefit from it.",
  },
  {
    emoji: "👁️",
    title: "Human file review, always",
    body: "Every file is checked by a human before it goes to print. We look at resolution, bleed, colour profile, and placement. If something looks off, we flag it before production starts.",
  },
  {
    emoji: "📦",
    title: "Pre-dispatch check",
    body: "Every garment is inspected before it leaves our studio. We check print quality, colour accuracy, and placement. If it doesn&apos;t meet our standard, it doesn&apos;t ship.",
  },
  {
    emoji: "🔄",
    title: "We make it right",
    body: "If you receive something that doesn&apos;t meet the quality you expected, we reprint it. No complicated returns process, no back-and-forth — we just fix it.",
  },
  {
    emoji: "📐",
    title: "Consistent sizing",
    body: "We work with blanks that maintain consistent sizing across batches. Every size spec is published in our size guide so you know exactly what you&apos;re getting.",
  },
];

const CHECKLIST = [
  "File resolution minimum 150 DPI at print size",
  "Colour profile verified (sRGB for DTG)",
  "Placement checked against mockup",
  "Garment inspected before printing",
  "Print checked for bleed and coverage",
  "Colour accuracy verified under light",
  "Final check before packaging",
];

export default function QualityPage() {
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
            <span className="ds-label text-white/30 block mb-6">Quality Promise</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Every garment </span>
              <span className="h-bold-dark">checked. Every time.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              We don&apos;t automate quality. Every file is reviewed by a human, every print is
              inspected before dispatch, and every order comes with our commitment to make it
              right if something isn&apos;t.
            </p>
          </motion.div>
        </section>

        {/* Pillars */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <span className="ds-label text-white/30 block mb-10">Our standards</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {PILLARS.map((p) => (
                <div key={p.title} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7">
                  <span className="text-3xl block mb-4">{p.emoji}</span>
                  <h3 className="text-white text-sm font-semibold mb-2">{p.title}</h3>
                  <p
                    className="text-white/40 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-10">Production checklist</span>
          <div className="max-w-lg">
            <p className="text-white/45 text-sm mb-8 leading-relaxed">
              Every order goes through the same checklist before it leaves our studio. No
              exceptions.
            </p>
            <ul className="space-y-3">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 size={15} className="text-white/30 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Guarantee */}
        <section className="border-t border-white/[0.05] bg-ds-light-gray">
          <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl mb-4" style={{ fontWeight: 700, letterSpacing: "-0.045em" }}>
              Not happy? We reprint it.
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              If your order arrives with a print defect, colour mismatch, or quality issue that
              we missed, we&apos;ll reprint it at no charge. Just send us a photo within 7 days.
            </p>
            <a href="mailto:hello@halftonelabs.in?subject=Quality issue" className="btn-brand inline-flex">
              Report an issue
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
