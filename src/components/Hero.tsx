"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { isIndia } = useCurrency();
  const c = copy(isIndia);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-white flex flex-col justify-center overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(158,108,158,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(158,108,158,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Purple blob — right side */}
      <motion.div
        style={{ scale: blobScale, opacity: opacityFade }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] max-w-[680px] aspect-square pointer-events-none z-0"
      >
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(184,138,184,0.15) 0%, rgba(158,108,158,0.10) 50%, transparent 100%)" }}
        />
        {/* Inner shape */}
        <div
          className="absolute inset-[15%] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, rgba(158,108,158,0.12) 0%, rgba(125,82,125,0.06) 100%)" }}
        />
        {/* Dot grid overlay */}
        <div
          className="absolute inset-[25%] rounded-full opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, #9E6C9E 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 pt-36 pb-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: copy ── */}
          <motion.div style={{ y: titleY, opacity: opacityFade }}>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-zinc-50 border border-black/[0.07] rounded-full px-3.5 py-1.5 mb-10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className="text-[0.72rem] text-ds-body"
                style={{ fontWeight: 600, letterSpacing: "0.02em" }}
              >
                {c.heroCommerceTag}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] mb-4"
              style={{ letterSpacing: "-0.055em" }}
            >
              <span className="h-fade">drop your </span>
              <span className="h-bold">merch.</span>
              <br />
              <span className="h-fade">keep your </span>
              <span className="h-bold">audience.</span>
            </motion.h1>

            {/* Divider dots */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1.5 w-32 mb-8 origin-left"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "8px 6px",
              }}
            />

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg leading-relaxed text-ds-body max-w-[380px] mb-10"
              style={{ letterSpacing: "-0.015em" }}
            >
              Artists, labels, and festivals launch merch drops on Halftone.
              No upfront inventory. No production headaches.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link href="/signup" className="btn-brand">
                Launch your first drop
                <ArrowRight size={15} />
              </Link>
              <Link href="/studio" className="btn-outline-ds">
                Open Studio
              </Link>
            </motion.div>

            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-[0.76rem] text-ds-muted"
              style={{ letterSpacing: "-0.01em" }}
            >
              Trusted by Sunburn Festival · Kevin Abstract · Galactica · 60+ artists
            </motion.p>
          </motion.div>

          {/* ── Right: abstract visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: opacityFade }}
            className="hidden lg:flex items-center justify-center"
          >
            {/* Card composition */}
            <div className="relative w-full max-w-[400px]">
              {/* Background card (depth shadow) */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 ds-card opacity-50 rounded-3xl" />

              {/* Main card */}
              <div className="ds-card relative z-10 flex flex-col gap-5 p-8">
                {/* Mini label */}
                <div className="ds-label">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live drop
                </div>

                {/* Big stat */}
                <div>
                  <p
                    className="text-[4.5rem] leading-none text-ds-dark mb-1.5"
                    style={{ fontWeight: 700, letterSpacing: "-0.06em" }}
                  >
                    100K+
                  </p>
                  <p className="text-ds-body text-sm">{c.heroStat1Label}</p>
                </div>

                {/* Mini bar chart — sell-through rates */}
                <div className="space-y-2.5">
                  {[
                    { label: "Drops sold out",     pct: 87 },
                    { label: "Avg sell-through",   pct: 73 },
                    { label: "Repeat creators",    pct: 64 },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[0.65rem] text-ds-muted font-medium">{bar.label}</span>
                        <span className="text-[0.65rem] text-ds-dark font-semibold">{bar.pct}%</span>
                      </div>
                      <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#9E6C9E] to-[#7D527D]"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-black/[0.06]" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { v: "60+", l: "Artists" },
                    { v: "5–7d", l: "Turnaround" },
                    { v: "MOQ 1", l: "No minimums" },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="text-xl font-bold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
                        {s.v}
                      </p>
                      <p className="text-[0.68rem] text-ds-muted mt-0.5" style={{ fontWeight: 500 }}>
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pill tags */}
                <div className="flex flex-wrap gap-2">
                  {["DTG Printing", "White-label", c.heroBadge].map((tag) => (
                    <span key={tag} className="pill-dark text-[0.68rem]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 ds-card-purple rounded-2xl p-4 shadow-lg z-20">
                <p className="text-[0.65rem] text-white/70 mb-1" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Revenue FY24</p>
                <p className="text-2xl text-white font-bold" style={{ letterSpacing: "-0.04em" }}>
                  {isIndia ? "₹25Cr+" : "$3M+"}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
    </section>
  );
}
