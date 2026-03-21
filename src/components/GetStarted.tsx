"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

export default function GetStarted() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { isIndia } = useCurrency();
  const c = copy(isIndia);

  const features = [
    {
      icon: "👕",
      title: "MOQ 1, no bulk required",
      desc: "Order a single sample unit to check fit, feel, and print quality before committing.",
    },
    {
      icon: "🖨️",
      title: "DTG & DTF printing",
      desc: "Photographic-quality print on premium 180–240 GSM combed cotton blanks.",
    },
    {
      icon: "📦",
      title: isIndia ? "Ships in 5–7 business days" : "Ships worldwide",
      desc: isIndia
        ? "Fast domestic delivery via Shiprocket. International orders ship in 10–18 days."
        : "Fast fulfilment reaching most global destinations in 5–18 business days.",
    },
    {
      icon: isIndia ? "🇮🇳" : "✨",
      title: c.madeInTitle,
      desc: c.madeInDesc,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-ds-dark py-32 px-6">
      {/* Background textures */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Purple bloom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="ds-label text-white/40 mb-6 block">Get started</span>
            <h2
              className="text-4xl md:text-5xl leading-[0.92] mb-6"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Order your product </span>
              <span className="h-bold-dark">sample today</span>
            </h2>
            <p className="text-white/50 leading-relaxed max-w-md text-sm mb-3">
              {c.getStartedBody}
            </p>
            {isIndia && (
              <p className="text-white/40 text-sm mb-10">
                Blank samples from{" "}
                <span className="text-brand-light font-semibold">₹499</span>
                {" · "}Printed samples from{" "}
                <span className="text-brand-light font-semibold">₹799</span>
              </p>
            )}
            {!isIndia && (
              <p className="text-white/40 text-sm mb-10">
                Order a sample to experience the quality first-hand before scaling your drop.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Link href="/studio" className="btn-brand">
                Open the Studio
                <ArrowRight size={15} />
              </Link>
              <a
                href="mailto:hello@halftonelabs.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.15] text-white/80 text-sm font-semibold hover:border-white/30 hover:text-white transition-all"
              >
                Talk to us
              </a>
            </div>
          </motion.div>

          {/* Right — feature list */}
          <div className="flex flex-col gap-3">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex gap-4 items-start bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.07] transition-colors"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-0.5" style={{ letterSpacing: "-0.01em" }}>
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
