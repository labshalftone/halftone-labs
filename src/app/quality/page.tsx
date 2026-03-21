"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

const PILLARS = [
  { emoji: "🧵", title: "Blanks we actually believe in", body: "Every fabric we stock has been tested for shrinkage, colour retention, and washability. We use combed cotton as our standard — softer, stronger, and better for print adhesion." },
  { emoji: "🖨️", title: "Print methods that last", body: "We use DTG (Direct-to-Garment) as our primary method — breathable, vibrant, and produces zero plastic feel. DTF is available for specific design styles." },
  { emoji: "👁️", title: "Human file review, always", body: "Every file is checked by a human before it goes to print. We look at resolution, bleed, colour profile, and placement. If something looks off, we flag it before production starts." },
  { emoji: "📦", title: "Pre-dispatch check", body: "Every garment is inspected before it leaves our studio. We check print quality, colour accuracy, and placement. If it doesn't meet our standard, it doesn't ship." },
  { emoji: "🔄", title: "We make it right", body: "If you receive something that doesn't meet the quality you expected, we reprint it. No complicated returns process — we just fix it." },
  { emoji: "📐", title: "Consistent sizing", body: "We work with blanks that maintain consistent sizing across batches. Every spec is published in our size guide so you know exactly what you're getting." },
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
  const { isIndia } = useCurrency();
  const c = copy(isIndia);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Quality Promise</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">Every garment </span>
                <span className="h-bold">checked. Every time.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                {c.qualityHeroSub}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pillars */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Our standards</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-7">
                <span className="text-3xl block mb-4">{p.emoji}</span>
                <h3 className="text-ds-dark text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-ds-muted text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">Production checklist</span>
            <div className="max-w-lg">
              <p className="text-ds-body mb-8 leading-relaxed">
                Every order goes through the same checklist before it leaves our studio.
              </p>
              <ul className="space-y-3">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ds-body">
                    <CheckCircle2 size={15} className="text-brand mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl text-ds-dark mb-4" style={{ fontWeight: 700, letterSpacing: "-0.045em" }}>
              Not happy? We reprint it.
            </h2>
            <p className="text-ds-body max-w-md mx-auto mb-8 leading-relaxed">
              If your order arrives with a print defect, colour mismatch, or quality issue
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
