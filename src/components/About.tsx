"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "100K+", label: "Units Sold" },
  { value: "500+", label: "SKUs Launched" },
  { value: "₹25Cr+", label: "Revenue FY24" },
  { value: "60+", label: "Collaborations" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-28 bg-white overflow-hidden">
      {/* Accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand/30 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>

        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <span className="ds-label ds-label-brand mb-4 block">Who We Are</span>
            <h2
              className="text-3xl md:text-5xl leading-[0.92] mb-0"
              style={{ letterSpacing: "-0.055em" }}
            >
              <span className="h-fade">India&apos;s leading </span>
              <br />
              <span className="h-bold">merch studio.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg leading-relaxed text-ds-body max-w-xl lg:w-1/2 lg:pt-2"
            style={{ letterSpacing: "-0.015em" }}
          >
            India&apos;s leading independent merch and creative studio. We help artists,
            labels, and creators launch and scale merch brands. From design to
            delivery, we manage the entire pipeline — so you never have to.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="ds-card"
            >
              <p
                className="text-3xl md:text-4xl text-brand mb-2"
                style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-ds-body" style={{ fontWeight: 500 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ADHD brand callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 ds-card-purple relative overflow-hidden"
        >
          {/* Dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <span className="ds-label text-white/60 mb-3 block">Our Flagship Brand</span>
              <h3 className="text-2xl md:text-3xl text-white mb-3" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
                All Day, High Decibels
              </h3>
              <p className="text-white/70 leading-relaxed max-w-2xl text-sm">
                Our in-house music-inspired streetwear label. What started as an
                experiment is now a 100,000+ order brand with ₹25Cr+ in annual
                revenue, 40K followers, and a loyal fanbase across India.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              {[
                { v: "100K+", l: "Orders" },
                { v: "₹25Cr+", l: "Revenue" },
                { v: "40K+", l: "Followers" },
              ].map((s) => (
                <div key={s.l} className="text-center min-w-[80px]">
                  <p className="text-2xl text-white font-bold" style={{ letterSpacing: "-0.04em" }}>{s.v}</p>
                  <p className="text-[0.65rem] text-white/50 mt-0.5" style={{ fontWeight: 500 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
