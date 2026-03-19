"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Brand Creation",
    subtitle: "From sound to style.",
    desc: "We collaborate closely to design merch that matches the sound and story. No templates. Each collection is built from scratch.",
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

  return (
    <section id="process" className="relative py-28 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>

        {/* Header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="ds-label ds-label-brand mb-4 block"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl leading-[0.92] max-w-2xl"
            style={{ letterSpacing: "-0.055em" }}
          >
            <span className="h-fade">3-step system to turn </span>
            <br className="hidden md:block" />
            <span className="h-bold">artists into merch powerhouses</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
              className="ds-card relative"
            >
              {/* Large number */}
              <span
                className="text-[5rem] leading-none font-bold block mb-4 -ml-1"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(158,108,158,0.12)",
                  letterSpacing: "-0.06em",
                }}
              >
                {step.num}
              </span>

              <h3
                className="text-lg text-ds-dark mb-1.5"
                style={{ fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-brand mb-3" style={{ fontWeight: 500 }}>
                {step.subtitle}
              </p>
              <p className="text-sm text-ds-body leading-relaxed">
                {step.desc}
              </p>

              {/* Connector (non-last) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-5 h-px bg-brand/20 z-10" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="ds-divider mt-20" />
      </div>
    </section>
  );
}
