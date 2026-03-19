"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer id="contact" className="relative bg-ds-dark text-white overflow-hidden">
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Bloom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/[0.08] rounded-full blur-[120px] pointer-events-none" />

      {/* CTA Section */}
      <div className="py-28 relative z-10" ref={ref}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="ds-label text-white/30 block mb-6">Contact</span>
            <h2
              className="text-3xl md:text-5xl leading-[0.92] mb-8 max-w-2xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Your music deserves </span>
              <span className="h-bold-dark">better merch.</span>
              <br />
              <span className="h-bold-dark">Let&apos;s make it real.</span>
            </h2>
            <p className="text-white/40 max-w-lg mb-10 leading-relaxed text-sm">
              For artists, creators, and brands. From the first idea to the
              final product, we handle the hard parts.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:hello@halftonelabs.in" className="btn-brand">
                <ArrowUpRight size={15} />
                Let&apos;s Collaborate
              </a>
              <a
                href="mailto:hello@halftonelabs.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:border-white/25 hover:text-white transition-all"
              >
                hello@halftonelabs.in
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="border-t border-b border-white/[0.05] py-3 overflow-hidden">
        <div className="animate-marquee inline-flex gap-16 items-center whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/[0.08] flex items-center gap-3 flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand/25" />
              halftone labs
            </span>
          ))}
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/[0.04] relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <p
                className="text-white text-base mb-3"
                style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
              >
                Halftone Labs
              </p>
              <p className="text-xs text-white/30 leading-relaxed">
                India&apos;s leading independent merch and creative studio.
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 mb-4 font-mono">
                Location
              </p>
              <p className="text-sm text-white/45">India</p>
              <p className="text-sm text-white/45">hello@halftonelabs.in</p>
            </div>

            {/* Sitemap */}
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 mb-4 font-mono">
                Sitemap
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "About", href: "#about" },
                  { label: "Services", href: "#services" },
                  { label: "Process", href: "#process" },
                  { label: "Studio", href: "/studio" },
                  { label: "Track Order", href: "/track" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/35 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Follow */}
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 mb-4 font-mono">
                Follow Us
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com/halftonelabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/35 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                >
                  Instagram <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://x.com/halftonelabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/35 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                >
                  X / Twitter <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://www.linkedin.com/company/101764839"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/35 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                >
                  LinkedIn <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-white/20">
              &copy; 2021&ndash;2025 Halftone Labs. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-xs text-white/20 hover:text-white/50 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-xs text-white/20 hover:text-white/50 transition-colors">
                Terms
              </a>
            </div>
          </div>

          {/* Large watermark */}
          <div className="mt-10 -mb-4 overflow-hidden select-none pointer-events-none">
            <p
              className="text-[clamp(3rem,12vw,10rem)] leading-none text-white/[0.025]"
              style={{ letterSpacing: "-0.065em", fontWeight: 800 }}
            >
              halftone labs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
