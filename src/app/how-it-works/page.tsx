"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  {
    n: "01",
    title: "Choose your product",
    body: "Browse the Studio catalog — Regular Tee, Oversized, Baby Tee, and more dropping regularly. Pick your base garment, colour, and GSM weight. Every blank is combed cotton, cut and fulfilled from India.",
    tag: "~2 minutes",
    emoji: "🎨",
  },
  {
    n: "02",
    title: "Upload your artwork",
    body: "Drop your PNG (transparent background), JPG, or WebP file directly onto the garment mockup. You'll see exactly where it prints before you confirm anything. Drag to reposition, resize to fit. What you see is what gets printed.",
    tag: "~3 minutes",
    emoji: "📐",
  },
  {
    n: "03",
    title: "We validate & print",
    body: "Our team checks your file for resolution, bleed, and colour profile before production starts. We use DTG as our standard — it's breathable, vibrant, and we've perfected it over thousands of prints. DTF is available on request for specific design styles.",
    tag: "Same day",
    emoji: "🖨️",
  },
  {
    n: "04",
    title: "Quality check",
    body: "Every single order goes through a manual quality inspection before it gets folded and packed. We're checking print registration, colour accuracy, and garment condition. Issues get caught here, not at your door.",
    tag: "Before dispatch",
    emoji: "✅",
  },
  {
    n: "05",
    title: "Shipped to your door",
    body: "Domestic orders via Shiprocket, delivered in 5–7 business days. International orders reach most destinations in 10–18 days. Track your order in real time from your Halftone account.",
    tag: "5–7 days domestic",
    emoji: "📦",
  },
];

const MODES = [
  {
    label: "On-demand",
    moq: "MOQ 1",
    time: "5–7 business days",
    best: "Samples, limited drops, surprise releases",
    points: [
      "Order as little as 1 piece",
      "No inventory, no dead stock",
      "Design in the Studio, ships same week",
      "DTG & DTF printing",
      "Perfect for testing new designs",
    ],
    cta: "Open Studio",
    href: "/studio",
    dark: true,
  },
  {
    label: "Custom bulk",
    moq: "MOQ 50",
    time: "3–4 weeks",
    best: "Tour merch, festival drops, label releases",
    points: [
      "Custom cut-and-sew construction",
      "Screen print, embroidery, specialty washes",
      "Custom woven neck labels",
      "Branded packaging & poly bags",
      "Full design service available",
    ],
    cta: "Get a quote",
    href: "mailto:hello@halftonelabs.in",
    dark: false,
  },
];

const QUICK_QA = [
  { q: "What file format?", a: "PNG with transparent background. Vector AI files for screen print or logo-heavy work." },
  { q: "Can I see a sample first?", a: "Yes. Blank samples from ₹499, printed samples from ₹799 — ordered directly in the Studio." },
  { q: "Do you design artwork?", a: "Yes. Email hello@halftonelabs.in with your brief. Design is scoped separately." },
  { q: "Do you ship internationally?", a: "Yes — to 50+ countries. 10–18 business days via Shiprocket international." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">How it works</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">From idea to </span>
                <span className="h-bold">doorstep</span>
                <br />
                <span className="h-bold">in 5 steps.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                Whether you're dropping 1 tee or 10,000 festival uniforms — the process is the same. Simple, transparent, fast.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.4 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12 ${i < STEPS.length - 1 ? "border-b border-black/[0.06]" : ""}`}
              >
                {/* Text side — alternates */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-start gap-6">
                    <span
                      className="text-[5rem] font-bold leading-none select-none"
                      style={{ color: "transparent", WebkitTextStroke: "2px rgba(0,0,0,0.06)", letterSpacing: "-0.04em" }}
                    >
                      {step.n}
                    </span>
                    <div className="pt-2">
                      <span className="ds-label ds-label-brand mb-2 block">{step.tag}</span>
                      <h2
                        className="text-2xl md:text-3xl text-ds-dark mb-4"
                        style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
                      >
                        {step.title}
                      </h2>
                      <p className="text-ds-body leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </div>

                {/* Visual side */}
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""} flex justify-center`}>
                  <div className="w-full max-w-sm aspect-square ds-card flex items-center justify-center overflow-hidden relative">
                    <div className="halftone-divider" />
                    <div className="text-7xl select-none relative z-10">
                      {step.emoji}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 bg-ds-dark rounded-xl px-4 py-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Step {step.n}</span>
                      <span className="text-xs text-white/40">{step.tag}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Two modes */}
        <section className="px-6 py-14 bg-ds-light-gray border-t border-black/[0.06]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} className="mb-12">
              <span className="ds-label ds-label-brand mb-4 block">Two modes</span>
              <h2
                className="text-4xl text-ds-dark"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">On-demand </span>
                <span className="h-bold">vs. Bulk</span>
              </h2>
              <p className="text-ds-body mt-3 max-w-xl">
                Both use the same quality garments and the same team. The difference is scale, construction complexity, and turnaround.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MODES.map((mode, i) => (
                <motion.div
                  key={mode.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`rounded-3xl p-8 flex flex-col ${mode.dark ? "bg-ds-dark text-white" : "ds-card"}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-xl font-semibold"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      {mode.label}
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${mode.dark ? "bg-white/10 text-white/70" : "bg-black/[0.05] text-ds-body"}`}>
                      {mode.moq}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${mode.dark ? "text-white/50" : "text-ds-body"}`}>
                    <span className={`font-semibold ${mode.dark ? "text-white" : "text-ds-dark"}`}>{mode.time}</span> turnaround
                  </p>
                  <p className={`text-xs mb-6 ${mode.dark ? "text-white/30" : "text-ds-muted"}`}>Best for: {mode.best}</p>
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {mode.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm">
                        <svg
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${mode.dark ? "text-brand-light" : "text-brand"}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={mode.dark ? "text-white/70" : "text-ds-body"}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={mode.href}
                    className={mode.dark ? "btn-brand w-full justify-center py-3" : "btn-outline-ds w-full justify-center py-3"}
                  >
                    {mode.cta} →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Q&A */}
        <section className="px-6 py-14 bg-white border-t border-black/[0.06]">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} className="mb-10">
              <h2
                className="text-3xl text-ds-dark"
                style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
              >
                Quick answers
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {QUICK_QA.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="ds-card p-6"
                >
                  <p
                    className="font-semibold text-ds-dark text-sm mb-2"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {item.q}
                  </p>
                  <p className="text-ds-body text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-ds-dark">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              className="text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10">
                <span className="ds-label text-white/30 mb-5 block">Ready?</span>
                <h2
                  className="text-4xl md:text-5xl text-white mb-4"
                  style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
                >
                  <span className="h-fade-dark">Start your </span>
                  <span className="h-bold-dark">drop today.</span>
                </h2>
                <p className="text-white/50 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                  Open the Studio and have your first order placed in under 10 minutes. Or email us if you're thinking bigger.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/studio" className="btn-brand">
                    Open Studio →
                  </Link>
                  <a href="mailto:hello@halftonelabs.in" className="btn-outline-ds border-white/20 text-white/70 hover:border-white/50 hover:text-white">
                    Book a call
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
