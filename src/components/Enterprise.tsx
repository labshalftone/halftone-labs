"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

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

export default function Enterprise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isIndia } = useCurrency();
  const c = copy(isIndia);

  const FEATURES = [
    {
      icon: "⚡",
      title: "On-demand, no minimums",
      desc: "Drop a limited run of 1 or 10,000. No leftover stock, no dead inventory. Perfect for time-sensitive album or tour releases.",
    },
    {
      icon: "🎨",
      title: "Artwork you can trust",
      desc: "DTG and DTF printing preserves every detail of your artwork: full colour, photographic gradients, crisp type. Your vision, uncompromised.",
    },
    {
      icon: "📦",
      title: "White-label fulfillment",
      desc: "Ship direct to fans with your branding on the box. Custom neck labels available. Invisible supply chain.",
    },
    {
      icon: isIndia ? "🇮🇳" : "💰",
      title: c.enterprisePricingTitle,
      desc: c.enterprisePricingDesc,
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

  return (
    <section className="bg-ds-light-gray py-28 px-6 border-t border-black/[0.05]">
      <div className="max-w-[1200px] mx-auto" ref={ref}>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <span className="ds-label ds-label-brand mb-4 block">
              For creators, labels &amp; events
            </span>
            <h2
              className="text-4xl md:text-5xl leading-[0.92]"
              style={{ letterSpacing: "-0.055em" }}
            >
              <span className="h-fade">The merch infrastructure </span>
              <span className="h-bold">behind the drop</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p className="text-ds-body leading-relaxed text-sm mb-6">
              From a bedroom artist&apos;s first tee drop to a 5,000-person festival
              uniform run. Halftone Labs handles production so you can focus on
              the music. No account managers. No minimum orders. No nonsense.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/studio" className="btn-brand">
                Start a drop
              </Link>
              <a
                href="mailto:hello@halftonelabs.in?subject=Enterprise%20enquiry"
                className="btn-outline-ds"
              >
                Talk to the team
              </a>
            </div>
          </motion.div>
        </div>

        {/* Who it's for */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {CLIENTS.map((cl, i) => (
            <motion.div
              key={cl.category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="ds-card"
            >
              <span className="text-2xl block mb-3">{cl.icon}</span>
              <h3
                className="text-ds-dark text-sm mb-2"
                style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {cl.category}
              </h3>
              <ul className="space-y-1">
                {cl.examples.map((ex) => (
                  <li key={ex} className="text-[0.7rem] text-ds-body flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="mb-10">
          <p className="ds-label justify-center mb-8 block text-center">Why labels choose Halftone</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="ds-card hover:shadow-md transition-shadow"
              >
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3
                  className="text-ds-dark text-sm mb-1.5"
                  style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
                >
                  {f.title}
                </h3>
                <p className="text-xs text-ds-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="ds-card-dark rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <span className="ds-label text-white/40 mb-3 block">Already trusted by</span>
            <p
              className="text-white text-xl md:text-2xl leading-tight"
              style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
            >
              Sunburn Festival · Teletech
              <br />
              Time Music · Galactica
              <br />
              Kevin Abstract
            </p>
            <p className="text-white/40 text-sm mt-2">
              ...and 60+ independent artists across the globe
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/studio" className="btn-brand">
              Start your drop
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
