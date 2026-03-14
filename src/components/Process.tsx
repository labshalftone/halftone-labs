"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HalftoneParallaxGrid, HalftoneCircle } from "./HalftoneBackground";

const steps = [
  {
    num: "01",
    title: "Brand Creation",
    subtitle: "From sound to style.",
    desc: "We collaborate closely to design merch that matches the sound and story. No templates — each collection is built from scratch.",
  },
  {
    num: "02",
    title: "D2C Setup",
    subtitle: "Plug-and-play merch infrastructure.",
    desc: "Whether you're on tour or in album rollout, your fans can shop anytime. We set up storefronts, fulfillment, and everything in between.",
  },
  {
    num: "03",
    title: "Growth & Scale",
    subtitle: "Drop culture meets data.",
    desc: "We move quickly and make sure your drop hits when it matters. From campaigns to analytics, we help you scale sustainably.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section id="process" className="relative py-32 bg-halftone-light overflow-hidden" ref={scrollRef}>
      <HalftoneParallaxGrid variant="light" />
      <HalftoneCircle size={350} position="top-left" color="purple" />

      {/* Dot cluster accent */}
      <div className="absolute bottom-20 right-20 dot-cluster hidden lg:grid z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-label mb-4 block"
        >
          How It Works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl mb-6"
          style={{ letterSpacing: "-0.05em" }}
        >
          3-Step System to Turn Artists
          <br className="hidden md:block" /> into Merch Powerhouses
        </motion.h2>

        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="relative"
            >
              <div className="service-card h-full relative group halftone-card-hover corner-brackets">
                <div className="relative z-10">
                  <span className="text-4xl text-halftone-purple/15">
                    {step.num}
                  </span>
                  <h3 className="text-lg mt-4 mb-1">{step.title}</h3>
                  <p className="text-sm text-halftone-purple mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-halftone-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-5 h-px bg-halftone-purple/25" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="halftone-divider mt-20" />
      </div>
    </section>
  );
}
