"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Working with Halftone Labs has been a game-changer. They took my vision and turned it into merch that truly represents me.",
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

  return (
    <section className="relative py-28 bg-ds-light-gray overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>

        {/* Header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="ds-label ds-label-brand mb-4 block"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl leading-[0.92]"
            style={{ letterSpacing: "-0.055em" }}
          >
            <span className="h-fade">The proof is </span>
            <span className="h-bold">in their words</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="testimonial-card flex flex-col"
            >
              <Quote size={18} className="text-brand-30 mb-4" />
              <p className="text-sm leading-relaxed mb-6 text-ds-body flex-1">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-10 flex items-center justify-center text-xs text-brand font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm text-ds-dark" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                    {t.name}
                  </p>
                  <p className="text-[0.7rem] text-ds-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
