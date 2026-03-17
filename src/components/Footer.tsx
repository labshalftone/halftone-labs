"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { LogoLight } from "./Logo";
import { HalftoneField, HalftoneParallaxGrid, HalftoneCircle } from "./HalftoneBackground";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const ctaY = useTransform(scrollYProgress, [0, 1], [50, -20]);

  return (
    <footer
      id="contact"
      className="relative bg-halftone-navy text-white overflow-hidden"
      ref={scrollRef}
    >
      <HalftoneField color="purple" side="right" density={15} />
      <HalftoneParallaxGrid variant="dark" />
      <HalftoneCircle size={400} position="bottom-right" color="purple" />

      {/* CTA Section */}
      <div className="py-32 relative" ref={ref}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-halftone-purple/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ y: ctaY }}
          >
            <span className="section-label !text-halftone-orange-light block mb-6">Contact</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-8 max-w-2xl" style={{ letterSpacing: "-0.05em" }}>
              Your music deserves better merch.{" "}
              <span className="text-halftone-purple-light">
                Let&apos;s make it real.
              </span>
            </h2>
            <p className="text-white/45 max-w-lg mb-10 leading-relaxed text-sm">
              For artists, creators, and brands. From the first idea to the
              final product, we handle the hard parts.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@halftonelabs.in"
                className="btn-primary !bg-halftone-purple hover:!bg-halftone-purple-dark"
              >
                <ArrowUpRight size={16} />
                Let&apos;s Collaborate
              </a>
              <a href="mailto:hello@halftonelabs.in" className="btn-outline">
                hello@halftonelabs.in
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="marquee-strip">
        <div className="animate-marquee inline-flex gap-16 items-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/[0.08] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-halftone-purple/25" />
              halftone labs
            </span>
          ))}
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <LogoLight className="h-12 w-auto mb-4" />
              <p className="text-xs text-white/30">India&apos;s leading independent merch and creative studio.</p>
            </div>

            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25 mb-4 font-mono">
                Location
              </p>
              <p className="text-sm text-white/55">India</p>
              <p className="text-sm text-white/55">hello@halftonelabs.in</p>
            </div>

            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25 mb-4 font-mono">
                Sitemap
              </p>
              <div className="flex flex-col gap-2">
                <a href="#about" className="text-sm text-white/40 hover:text-white transition-colors">About</a>
                <a href="#services" className="text-sm text-white/40 hover:text-white transition-colors">Services</a>
                <a href="#process" className="text-sm text-white/40 hover:text-white transition-colors">Process</a>
                <a href="/studio" className="text-sm text-white/40 hover:text-white transition-colors">Studio</a>
                <a href="#pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</a>
                <a href="/track" className="text-sm text-white/40 hover:text-white transition-colors">Track Order</a>
                <a href="#contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25 mb-4 font-mono">
                Follow Us
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com/halftonelabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/halftonelabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  X / Twitter
                </a>
                <a
                  href="https://www.linkedin.com/company/101764839"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Copyright + legal */}
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-white/25">
              &copy; 2021&ndash;2025 Halftone Labs. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-xs text-white/25 hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-xs text-white/25 hover:text-white/60 transition-colors">
                Terms
              </a>
            </div>
          </div>

          {/* Brand watermark */}
          <div className="mt-10 -mb-4 overflow-hidden">
            <p className="text-[clamp(3rem,12vw,10rem)] leading-none text-white/[0.03]" style={{ letterSpacing: "-0.065em" }}>
              halftone labs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
