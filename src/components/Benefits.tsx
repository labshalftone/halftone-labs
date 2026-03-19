"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap, Shield, Sparkles, Clock, Heart, Layers, Target, Lightbulb,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Layers, text: "MOQ of 1", sub: "Order a single unit or ten thousand. No leftover stock, no dead inventory." },
  { icon: Clock, text: "5–7 day turnaround", sub: "Domestic orders ship in under a week. Fast enough for surprise drops." },
  { icon: Sparkles, text: "DTG & DTF printing", sub: "Photographic quality on any colour garment. Your artwork, uncompromised." },
  { icon: Shield, text: "India-first pricing", sub: "Premium quality at a fraction of Western rates. More margin per drop." },
  { icon: Heart, text: "60+ artist collabs", sub: "From bedroom producers to festival headliners. We've done it all." },
  { icon: Zap, text: "White-label fulfillment", sub: "Ships in your branded packaging. Invisible supply chain." },
  { icon: Target, text: "Custom neck labels", sub: "Your brand on the garment, not ours. Available from MOQ 50." },
  { icon: Lightbulb, text: "Full-service pipeline", sub: "Design, production, fulfillment, and marketing. One team, zero handoffs." },
];

export default function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">

          {/* Left — copy */}
          <div className="lg:w-5/12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="ds-label ds-label-brand mb-4 block"
            >
              What We Bring
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl mb-6 leading-[0.95]"
              style={{ letterSpacing: "-0.05em" }}
            >
              <span className="h-fade">From merch to marketing, </span>
              <span className="h-bold">we help artists build brands that scale.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-ds-body leading-relaxed mb-8 text-sm"
            >
              Long-term brand building, not just one-off drops. Simple, clear
              processes with full-service creative from concept to delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/signup" className="btn-brand">
                Get Started
              </Link>
              <a href="mailto:hello@halftonelabs.in" className="btn-outline-ds">
                Talk to us
              </a>
            </motion.div>

            {/* Dot cluster */}
            <div className="dot-cluster mt-10 hidden lg:grid">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>

          {/* Right — benefit grid */}
          <div className="lg:w-7/12">
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.text}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    className="ds-card !p-5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand/[0.08] flex items-center justify-center mb-3">
                      <Icon size={15} className="text-brand" />
                    </div>
                    <p className="text-sm text-ds-dark mb-1" style={{ fontWeight: 600, letterSpacing: "-0.015em" }}>
                      {b.text}
                    </p>
                    <p className="text-[0.72rem] text-ds-body leading-relaxed">
                      {b.sub}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
