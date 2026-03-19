"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Shield,
  Sparkles,
  Clock,
  Heart,
  Layers,
  Target,
  Lightbulb,
} from "lucide-react";
import { HalftoneField, HalftoneCircle } from "./HalftoneBackground";

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
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const rightY = useTransform(scrollYProgress, [0, 1], [60, -30]);

  return (
    <section className="relative py-32 bg-zinc-50 overflow-hidden" ref={scrollRef}>
      <HalftoneField color="purple" side="left" density={10} />
      <HalftoneCircle size={300} position="bottom-right" color="orange" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          <motion.div className="lg:w-1/2" style={{ y: leftY }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="section-label mb-4 block"
            >
              What We Bring
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl mb-6"
              style={{ letterSpacing: "-0.05em" }}
            >
              From merch to marketing, we help
              artists build brands that scale.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-halftone-muted leading-relaxed mb-8"
            >
              Long-term brand building, not just one-off drops. Simple, clear
              processes with full-service creative from concept to delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <a href="#contact" className="btn-primary">
                Get Started
              </a>
            </motion.div>

            {/* Dot cluster */}
            <div className="dot-cluster mt-10 hidden lg:grid">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </motion.div>

          <motion.div className="lg:w-1/2" style={{ y: rightY }}>
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.text}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    className="service-card !p-4 flex items-center gap-3 halftone-card-hover"
                  >
                    <div className="w-8 h-8 rounded-lg bg-halftone-purple/[0.08] flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-halftone-purple" />
                    </div>
                    <span className="text-sm">{b.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
