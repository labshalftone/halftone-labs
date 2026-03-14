"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HalftoneField, HalftoneParallaxGrid, HalftoneCircle } from "./HalftoneBackground";

const stats = [
  { value: "100K+", label: "Units Sold" },
  { value: "500+", label: "SKUs Launched" },
  { value: "25Cr+", label: "Revenue FY24" },
  { value: "20+", label: "Collaborations" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [50, -25]);
  const statsY = useTransform(scrollYProgress, [0, 1], [30, -15]);

  return (
    <section id="about" className="relative py-32 bg-halftone-navy text-white overflow-hidden" ref={scrollRef}>
      <HalftoneField color="purple" side="right" density={20} />
      <HalftoneField color="orange" side="left" density={10} />
      <HalftoneParallaxGrid variant="dark" />
      <HalftoneCircle size={400} position="bottom-right" color="purple" />

      {/* Section number watermark */}
      <div className="absolute top-12 right-12 z-0">
        <span className="section-number">01</span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          style={{ y: headingY }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 mb-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label !text-halftone-purple-light">Who We Are</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl leading-relaxed text-white/60 max-w-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            India&apos;s leading independent merch and creative studio. We help artists,
            labels, and creators launch and scale merch brands — from design to
            delivery, we manage the entire pipeline.
          </motion.p>
        </motion.div>

        <motion.div style={{ y: statsY }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 corner-brackets"
            >
              <p className="text-3xl md:text-4xl text-halftone-purple-light mb-2" style={{ letterSpacing: "-0.04em" }}>
                {stat.value}
              </p>
              <p className="text-xs text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
