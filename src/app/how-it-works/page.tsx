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
  },
  {
    n: "02",
    title: "Upload your artwork",
    body: "Drop your PNG (transparent background), JPG, or WebP file directly onto the garment mockup. You'll see exactly where it prints before you confirm anything. Drag to reposition, resize to fit. What you see is what gets printed.",
    tag: "~3 minutes",
  },
  {
    n: "03",
    title: "We validate & print",
    body: "Our team checks your file for resolution, bleed, and colour profile before production starts. DTG for a natural soft feel on lighter garments. DTF for vibrant, edge-to-edge colour on any base. We'll flag it if something needs adjusting.",
    tag: "Same day",
  },
  {
    n: "04",
    title: "Quality check",
    body: "Every single order goes through a manual quality inspection before it gets folded and packed. We're checking print registration, colour accuracy, and garment condition. Issues get caught here, not at your door.",
    tag: "Before dispatch",
  },
  {
    n: "05",
    title: "Shipped to your door",
    body: "Domestic orders via Shiprocket, delivered in 5–7 business days. International orders reach most destinations in 10–18 days. Track your order in real time from your Halftone account.",
    tag: "5–7 days domestic",
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
  { q: "What file format?", a: 'PNG with transparent background. Vector AI files for screen print or logo-heavy work.' },
  { q: "Can I see a sample first?", a: 'Yes. Blank samples from ₹499, printed samples from ₹799 — ordered directly in the Studio.' },
  { q: "Do you design artwork?", a: 'Yes. Email hello@halftonelabs.in with your brief. Design is scoped separately.' },
  { q: "Do you ship internationally?", a: 'Yes — to 50+ countries. 10–18 business days via Shiprocket international.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#f8f7f5" }}>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-200/60 pt-28 pb-20 px-6">
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-5">[ How it works ]</p>
              <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-zinc-900 leading-[0.9] mb-6"
                style={{ letterSpacing: "-0.05em" }}>
                From idea to doorstep<br />
                <span style={{ WebkitTextStroke: "2px #111", color: "transparent" }}>in 5 steps.</span>
              </h1>
              <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
                Whether you're dropping 1 tee or 10,000 festival uniforms — the process is the same. Simple, transparent, fast.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16 ${i < STEPS.length - 1 ? "border-b border-zinc-200" : ""}`}
              >
                {/* Number side — alternates */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-start gap-6">
                    <span className="text-[4rem] font-black text-zinc-100 leading-none select-none" style={{ letterSpacing: "-0.04em" }}>
                      {step.n}
                    </span>
                    <div className="pt-2">
                      <span className="text-[0.6rem] font-mono uppercase tracking-widest text-orange-500 mb-2 block">{step.tag}</span>
                      <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4" style={{ letterSpacing: "-0.04em" }}>
                        {step.title}
                      </h2>
                      <p className="text-zinc-500 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </div>

                {/* Visual side */}
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""} flex justify-center`}>
                  <div className="w-full max-w-sm aspect-square rounded-3xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.04]"
                      style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                    <div className="text-7xl select-none">
                      {["🎨", "📐", "🖨️", "✅", "📦"][i]}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Step {step.n}</span>
                      <span className="text-xs text-zinc-400">{step.tag}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Two modes */}
        <section className="px-6 py-20 border-t border-zinc-200">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-4">Two modes</p>
              <h2 className="text-4xl font-black text-zinc-900" style={{ letterSpacing: "-0.05em" }}>
                On-demand vs. Bulk
              </h2>
              <p className="text-zinc-500 mt-3 max-w-xl">
                Both use the same quality garments and the same team. The difference is scale, construction complexity, and turnaround.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MODES.map((mode, i) => (
                <motion.div
                  key={mode.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-3xl p-8 flex flex-col ${mode.dark ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-900"}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black" style={{ letterSpacing: "-0.03em" }}>{mode.label}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${mode.dark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                      {mode.moq}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${mode.dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    <span className="font-semibold">{mode.time}</span> turnaround
                  </p>
                  <p className={`text-xs mb-6 ${mode.dark ? "text-zinc-500" : "text-zinc-400"}`}>Best for: {mode.best}</p>
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {mode.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm">
                        <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${mode.dark ? "text-orange-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={mode.dark ? "text-zinc-300" : "text-zinc-600"}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={mode.href}
                    className={`text-center py-3 rounded-xl font-bold text-sm transition-colors ${mode.dark ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
                    {mode.cta} →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Q&A */}
        <section className="px-6 py-20 border-t border-zinc-200">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
              <h2 className="text-3xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Quick answers</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {QUICK_QA.map((item, i) => (
                <motion.div key={item.q}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-zinc-200 p-6">
                  <p className="font-black text-zinc-900 text-sm mb-2" style={{ letterSpacing: "-0.02em" }}>{item.q}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-zinc-900 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10">
                <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-4">Ready?</p>
                <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.05em" }}>
                  Start your drop today
                </h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Open the Studio and have your first order placed in under 10 minutes. Or email us if you're thinking bigger.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/studio" className="px-6 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors">
                    Open Studio →
                  </Link>
                  <a href="mailto:hello@halftonelabs.in" className="px-6 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors">
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
