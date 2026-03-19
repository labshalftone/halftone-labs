"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";
import { HalftoneField, HalftoneCircle, HalftoneParallaxGrid } from "./HalftoneBackground";

const testimonials = [
  {
    quote:
      "Working with Halftone Labs has been a game-changer for me in India. They took my vision and turned it into merch that truly represents me.",
    name: "DJ ADHD",
    role: "Producer and DJ",
    initials: "DA",
  },
  {
    quote:
      "Halftone Labs understood my aesthetic from day one. The merch they created doesn't just look good. It feels like an extension of the music.",
    name: "Kevin Abstract",
    role: "Artist and Creative Director",
    initials: "KA",
  },
  {
    quote:
      "What I liked most was how effortless they made the process. The Halftone team really understood the timelines for the tour. Shipping to Australia was seamless.",
    name: "Restricted",
    role: "Australian DJ, CEO Revive Records",
    initials: "RE",
  },
  {
    quote:
      "Halftone Labs brought our merch vision to life. The quality of design and production was outstanding. They understood the brand instantly.",
    name: "Artist Collective",
    role: "Independent Label",
    initials: "AC",
  },
];

export default function Testimonial() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section
      className="relative py-32 bg-zinc-950 text-white overflow-hidden"
      ref={scrollRef}
    >
      <HalftoneField color="purple" side="right" density={20} />
      <HalftoneField color="orange" side="left" density={12} />
      <HalftoneParallaxGrid variant="dark" />
      <HalftoneCircle size={400} position="top-left" color="purple" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <motion.div style={{ y: headingY }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-label !text-halftone-purple-light mb-4 block"
          >
            Testimonials
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl mb-16"
            style={{ letterSpacing: "-0.05em" }}
          >
            The proof is in their words
          </motion.h2>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className="glass-card rounded-2xl p-7 relative corner-brackets halftone-card-hover"
            >
              <div className="relative z-10">
                <Quote size={20} className="text-halftone-purple/30 mb-4" />
                <p className="text-sm leading-relaxed mb-6 text-white/70">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-halftone-purple/20 flex items-center justify-center text-xs text-halftone-purple-light">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm">{t.name}</p>
                    <p className="text-[0.7rem] text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Flagship brand — ADHD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="glass-card rounded-2xl p-10 md:p-14 relative overflow-hidden"
        >
          {/* Halftone texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.5) 2px, transparent 2px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">
            <span className="section-label !text-halftone-orange-light mb-6 block">
              Our Flagship
            </span>
            <h3 className="text-2xl md:text-3xl mb-4" style={{ letterSpacing: "-0.05em" }}>
              All Day, High Decibels
            </h3>
            <p className="text-white/50 leading-relaxed max-w-2xl mb-8">
              Our in-house music-inspired streetwear label. What started as an
              experiment is now a 100,000+ order brand with 25Cr+ in annual
              revenue, 40K followers, and a loyal fanbase across India.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { v: "100K+", l: "Orders" },
                { v: "25Cr+", l: "Revenue" },
                { v: "40K+", l: "Followers" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="stat-card !bg-halftone-purple/[0.08] !border-halftone-purple/15 !p-4 !rounded-xl text-center min-w-[100px]"
                >
                  <p className="text-xl text-halftone-purple-light">
                    {s.v}
                  </p>
                  <p className="text-[0.65rem] text-white/40 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
