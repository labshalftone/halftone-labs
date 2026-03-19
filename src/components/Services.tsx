"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, ShoppingCart, Megaphone, Smartphone, Store } from "lucide-react";

const services = [
  {
    icon: Palette,
    num: "01",
    title: "Merchandise Design & Branding",
    desc: "Custom apparel design, artist branding & visual identity, product mockups & photoshoots.",
    tags: ["Custom Apparel", "Visual Identity", "Mockups"],
  },
  {
    icon: ShoppingCart,
    num: "02",
    title: "E-commerce & Fulfillment",
    desc: "Storefront setup, print-on-demand & bulk models, worldwide fulfillment & support.",
    tags: ["Storefront", "Print-on-Demand", "Fulfillment"],
  },
  {
    icon: Megaphone,
    num: "03",
    title: "Campaigns & Launch Marketing",
    desc: "UGC & lifestyle content, launch strategy, social ads & CRM, email campaigns.",
    tags: ["UGC Content", "Launch Strategy", "Social Ads"],
  },
  {
    icon: Smartphone,
    num: "04",
    title: "Web & Creative Design",
    desc: "Website maintenance, social media graphics, email design, pitch decks & presentations.",
    tags: ["Web Design", "Social Graphics", "Pitch Decks"],
  },
  {
    icon: Store,
    num: "05",
    title: "Tour Merch Booths",
    desc: "Booth setup & sales, on-ground staff & POS, payout & sales reports.",
    tags: ["Booth Setup", "On-Ground Staff", "Sales Reports"],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-28 bg-ds-light-gray overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="ds-label ds-label-brand mb-4 block"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl leading-[0.92]"
              style={{ letterSpacing: "-0.055em" }}
            >
              <span className="h-fade">Our </span>
              <span className="h-bold">Services</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-ds-body max-w-md text-sm leading-relaxed"
          >
            From design to delivery, we cover every touchpoint of the merch pipeline.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                className="ds-card group hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon + number row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand/[0.08] flex items-center justify-center">
                    <Icon size={18} className="text-brand" />
                  </div>
                  <span className="mono-tag">{svc.num}</span>
                </div>

                <h3
                  className="text-base text-ds-dark mb-3"
                  style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
                >
                  {svc.title}
                </h3>
                <p className="text-sm text-ds-body leading-relaxed mb-5">
                  {svc.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.68rem] px-2.5 py-1 border border-black/[0.07] rounded-full text-ds-body bg-white"
                      style={{ fontWeight: 500 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + services.length * 0.07 }}
            className="ds-card-purple flex flex-col justify-between"
          >
            <div>
              <span className="ds-label text-white/60 mb-4 block">Ready to start?</span>
              <h3
                className="text-2xl text-white mb-3"
                style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
              >
                Let&apos;s build your merch brand together.
              </h3>
            </div>
            <a
              href="mailto:hello@halftonelabs.in"
              className="inline-flex items-center gap-2 bg-white/[0.15] hover:bg-white/[0.25] transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full w-fit mt-6"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
