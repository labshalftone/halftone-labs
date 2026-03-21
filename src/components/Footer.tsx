"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Regular Tee", href: "/products/regular-tee" },
      { label: "Oversized Tee", href: "/products/oversized-tee-sj" },
      { label: "Baby Tee", href: "/products/baby-tee" },
      { label: "Hoodie", href: "/products/hoodie" },
      { label: "Waffle Tee", href: "/products/waffle-tee" },
      { label: "Bulk Orders", href: "/bulk-orders" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Studio", href: "/studio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Track Order", href: "/track" },
      { label: "Shipping Policy", href: "/shipping-policy" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Academy", href: "/academy" },
      { label: "Journal", href: "/journal" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Press & Media", href: "/press" },
      { label: "Quality Promise", href: "/quality" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Sitemap", href: "/sitemap-page" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/halftonelabs.in" },
  { label: "X / Twitter", href: "https://x.com/halftonelabs.in" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/101764839" },
];

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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-8 rounded-full blur-[120px] pointer-events-none" />

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
              <span className="w-1.5 h-1.5 rounded-full bg-brand-25" />
              halftone labs
            </span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-white/[0.04] relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-10">

          {/* Top row: brand + 4 link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">

            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <p
                className="text-white text-base mb-3"
                style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
              >
                Halftone Labs
              </p>
              <p className="text-xs text-white/30 leading-relaxed max-w-[220px]">
                India&apos;s independent merch studio for artists, creators, and brands.
              </p>
              <p className="text-xs text-white/20 mt-4">India &mdash; hello@halftonelabs.in</p>

              {/* Social */}
              <div className="flex flex-col gap-2 mt-6">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/35 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                  >
                    {s.label} <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </div>

            {/* 4 link columns */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading}>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 mb-4 font-mono">
                  {col.heading}
                </p>
                <div className="flex flex-col gap-2">
                  {col.links.map((link) => (
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
            ))}
          </div>

          {/* Copyright + legal */}
          <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-white/20">
              &copy; 2021&ndash;2025 Halftone Labs. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="/privacy" className="text-xs text-white/20 hover:text-white/50 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-xs text-white/20 hover:text-white/50 transition-colors">Terms of Service</a>
              <a href="/shipping-policy" className="text-xs text-white/20 hover:text-white/50 transition-colors">Shipping Policy</a>
              <a href="/return-policy" className="text-xs text-white/20 hover:text-white/50 transition-colors">Return Policy</a>
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
