"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { HalftoneField, HalftoneCircle } from "./HalftoneBackground";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-white flex flex-col justify-center overflow-hidden"
    >
      {/* Subtle halftone dot fields */}
      <HalftoneField color="purple" side="right" density={18} />
      <HalftoneField color="orange" side="left" density={10} />
      <HalftoneCircle size={500} position="top-right" color="purple" />
      <HalftoneCircle size={260} position="bottom-left" color="orange" />

      {/* Faint grid texture */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0 opacity-50" />

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ opacity: opacityFade }}
          className="mono-tag mb-10 !text-zinc-400"
        >
          [ drop commerce platform ]
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: titleY, opacity: opacityFade }}
          className="mb-3"
        >
          <h1
            className="text-[clamp(3.2rem,10vw,8.5rem)] leading-[0.88] text-zinc-900"
            style={{ letterSpacing: "-0.055em" }}
          >
            drop your
            <br />
            <span className="gradient-text">merch.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: titleY, opacity: opacityFade }}
          className="mb-10"
        >
          <h2
            className="text-[clamp(1.6rem,4vw,3.8rem)] leading-[0.95] text-zinc-300"
            style={{ letterSpacing: "-0.05em" }}
          >
            keep your audience.
          </h2>
        </motion.div>

        {/* Halftone dot underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-2 w-48 mb-10 origin-left"
          style={{
            opacity: opacityFade,
            backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.25) 2px, transparent 2px)",
            backgroundSize: "8px 8px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ y: subtitleY, opacity: opacityFade }}
          className="max-w-md mb-12"
        >
          <p
            className="text-base md:text-lg leading-relaxed text-zinc-500"
            style={{ letterSpacing: "-0.02em" }}
          >
            Artists, labels, and festivals launch merch drops on Halftone. No upfront inventory. No production headaches.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ opacity: opacityFade }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/signup" className="btn-primary">
            Launch your first drop
          </Link>
        </motion.div>

      </div>

      {/* Dot cluster */}
      <div className="absolute bottom-16 right-16 dot-cluster hidden lg:grid z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="!bg-zinc-200 !opacity-100" />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full halftone-divider" />
    </section>
  );
}
