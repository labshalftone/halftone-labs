"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CLIENTS = [
  {
    category: "Music Labels",
    icon: "🎵",
    examples: ["Artist merch drops", "Label samplers", "Album release tees"],
  },
  {
    category: "Festivals & Events",
    icon: "🎪",
    examples: ["Staff uniforms", "VIP exclusive drops", "Sponsor activations"],
  },
  {
    category: "Artists & DJs",
    icon: "🎧",
    examples: ["Tour merch", "Limited editions", "Fan club exclusives"],
  },
  {
    category: "Brands & Collectives",
    icon: "🏷️",
    examples: ["Capsule collections", "Collab drops", "Brand uniforms"],
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "On-demand, no minimums",
    desc: "Drop a limited run of 1 or 10,000. No leftover stock, no dead inventory. Perfect for time-sensitive album or tour releases.",
  },
  {
    icon: "🎨",
    title: "Artwork you can trust",
    desc: "DTG and DTF printing preserves every detail of your artwork — full colour, photographic gradients, crisp type. Your vision, uncompromised.",
  },
  {
    icon: "📦",
    title: "White-label fulfillment",
    desc: "Ship direct to fans with your branding on the box. Custom neck labels available. Invisible supply chain.",
  },
  {
    icon: "🇮🇳",
    title: "India-first pricing",
    desc: "Premium quality at a fraction of Western prices. More margin on every drop. Ideal for independent artists and small labels.",
  },
  {
    icon: "⏱️",
    title: "5–7 day turnaround",
    desc: "Plan a release, go live in under a week. Fast enough for surprise drops, structured enough for tour cycles.",
  },
  {
    icon: "🔗",
    title: "API & bulk order tools",
    desc: "Running a merch store? Use our Halftone Studio to place and manage orders at scale with zero friction.",
  },
];

export default function Enterprise() {
  return (
    <section className="bg-white py-28 px-6 border-t border-zinc-100">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-4 block">
              For creators, labels &amp; events
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-zinc-900 leading-[0.92]"
              style={{ letterSpacing: "-0.055em" }}
            >
              The merch
              <br />
              infrastructure
              <br />
              <span className="text-orange-500">behind the drop</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p className="text-zinc-500 leading-relaxed text-[0.95rem] mb-6">
              From a bedroom artist&apos;s first tee drop to a 5,000-person festival
              uniform run — Halftone Labs handles production so you can focus on
              the music. No account managers. No minimum orders. No nonsense.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/studio">
                <button className="px-5 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
                  Start a drop →
                </button>
              </Link>
              <a
                href="mailto:hello@halftonelabs.in?subject=Enterprise%20enquiry"
                className="px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:border-zinc-400 hover:text-zinc-900 transition-colors"
              >
                Talk to the team
              </a>
            </div>
          </motion.div>
        </div>

        {/* Who it's for */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {CLIENTS.map((c, i) => (
            <motion.div
              key={c.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100"
            >
              <span className="text-2xl block mb-3">{c.icon}</span>
              <h3 className="font-black text-zinc-900 text-sm mb-2" style={{ letterSpacing: "-0.02em" }}>
                {c.category}
              </h3>
              <ul className="space-y-1">
                {c.examples.map((ex) => (
                  <li key={ex} className="text-[0.7rem] text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="mb-16">
          <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-8 text-center">
            Why labels choose Halftone
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-2xl p-6 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all"
              >
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3 className="font-black text-zinc-900 text-sm mb-1.5" style={{ letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Already trusted by
            </p>
            <p className="text-white font-black text-xl md:text-2xl leading-tight" style={{ letterSpacing: "-0.04em" }}>
              Sunburn Festival · Teletech
              <br />
              Time Music · Galactica
              <br />
              Kevin Abstract
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              ...and 60+ independent artists across the globe
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/studio">
              <button className="px-6 py-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors whitespace-nowrap">
                Start your drop →
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
