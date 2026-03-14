"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { HalftoneSpotlight, HalftoneField, HalftoneCircle } from "./HalftoneBackground";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-visible">
      {/* Interactive mouse-following halftone spotlight */}
      <HalftoneSpotlight />

      {/* Floating dot fields on both sides */}
      <HalftoneField color="purple" side="right" density={20} />
      <HalftoneField color="orange" side="left" density={12} />

      {/* Large pulsing halftone circle — top right */}
      <HalftoneCircle size={550} position="top-right" color="purple" />

      {/* Smaller orange circle — bottom left */}
      <HalftoneCircle size={300} position="bottom-left" color="orange" />

      {/* Halftone stripe band */}
      <div className="absolute top-0 left-0 w-full h-full halftone-stripe-animated pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ opacity: opacityFade }}
          className="mono-tag mb-8"
        >
          [ est. 2023 ]
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: titleY, opacity: opacityFade }}
          className="mb-10"
        >
          <h1
            className="text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] text-halftone-dark"
            style={{ letterSpacing: "-0.065em" }}
          >
            halftone
            <br />
            <span className="gradient-text">labs</span>
          </h1>
        </motion.div>

        {/* Halftone dot underline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-2 w-48 mb-12 origin-left"
          style={{
            opacity: opacityFade,
            backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.3) 2px, transparent 2px)",
            backgroundSize: "8px 8px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: subtitleY, opacity: opacityFade }}
          className="max-w-xl mb-14"
        >
          <p className="text-xl md:text-2xl leading-snug text-halftone-dark/90" style={{ letterSpacing: "-0.025em" }}>
            Merch Design, Production & Brand Building for Artists, Creators, and
            the Music Industry.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ opacity: opacityFade }}
        >
          <a href="#contact" className="btn-primary">
            Book an Intro Call
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 right-10 flex items-center gap-2 text-xs text-halftone-muted/50"
        >
          <span className="font-mono text-[0.65rem]">scroll</span>
          <ArrowDown size={12} className="animate-bounce" />
        </motion.div>
      </div>

      {/* Dot cluster accent — bottom right */}
      <div className="absolute bottom-16 right-16 dot-cluster hidden lg:grid z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full halftone-divider" />
    </section>
  );
}
