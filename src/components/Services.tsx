"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Palette, ShoppingCart, Megaphone, Smartphone, Store } from "lucide-react";
import { HalftoneField, HalftoneParallaxGrid, HalftoneCircle } from "./HalftoneBackground";

const services = [
  {
    icon: Palette,
    title: "Merchandise Design & Branding",
    desc: "Custom apparel design, artist branding & visual identity, product mockups & photoshoots.",
    tags: ["Custom Apparel", "Visual Identity", "Mockups"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Fulfillment",
    desc: "Storefront setup, print-on-demand & bulk models, worldwide fulfillment & support.",
    tags: ["Storefront", "Print-on-Demand", "Fulfillment"],
  },
  {
    icon: Megaphone,
    title: "Campaigns & Launch Marketing",
    desc: "UGC & lifestyle content, launch strategy, social ads & CRM, email campaigns.",
    tags: ["UGC Content", "Launch Strategy", "Social Ads"],
  },
  {
    icon: Smartphone,
    title: "Web & Creative Design",
    desc: "Website maintenance, social media graphics, email design, pitch decks & presentations.",
    tags: ["Web Design", "Social Graphics", "Pitch Decks"],
  },
  {
    icon: Store,
    title: "Tour Merch Booths",
    desc: "Booth setup & sales, on-ground staff & POS, payout & sales reports.",
    tags: ["Booth Setup", "On-Ground Staff", "Sales Reports"],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], [50, -25]);

  return (
    <section id="services" className="relative py-32 bg-zinc-950 text-white overflow-hidden" ref={scrollRef}>
      <HalftoneField color="orange" side="left" density={18} />
      <HalftoneField color="purple" side="right" density={14} />
      <HalftoneParallaxGrid variant="dark" />
      <HalftoneCircle size={350} position="center-right" color="orange" />

      {/* Section number watermark */}
      <div className="absolute top-12 left-12 z-0">
        <span className="section-number">02</span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        {/* Marquee ticker */}
        <div className="marquee-strip mb-16 -mx-6">
          <div className="animate-marquee inline-flex gap-16 items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/10 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-halftone-purple/40" />
                halftone labs
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="section-label !text-halftone-purple-light mb-4 block"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              Our Services
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-md text-sm leading-relaxed"
          >
            From design to delivery, we cover every touchpoint of the merch pipeline.
          </motion.p>
        </div>

        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                className="glass-card rounded-2xl p-7 group hover:border-halftone-purple/20 transition-colors halftone-card-hover corner-brackets"
              >
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-lg bg-halftone-purple/10 flex items-center justify-center mb-5">
                    <Icon size={18} className="text-halftone-purple-light" />
                  </div>
                  <span className="mono-tag mb-2 block">0{i + 1}</span>
                  <h3 className="text-base mb-3">{svc.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-5">
                    {svc.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span key={tag} className="pill text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
