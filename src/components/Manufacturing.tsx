"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { HalftoneCircle, HalftoneField } from "./HalftoneBackground";

const tabs = [
  {
    id: "products",
    label: "Custom Products",
    items: [
      "Cut & Sew", "T-Shirt", "Hoodie", "Longsleeve", "Tanktop",
      "Zip-Hoodie", "Blazers", "Crewneck", "Sweatpants", "Shorts",
      "Scarfs", "Tapestries", "Socks", "Caps", "Beanies", "Tote Bags",
    ],
  },
  {
    id: "fabrics",
    label: "Types of Fabric",
    items: [
      "Jersey", "Fleece", "French Terry", "Rib", "Waffle Knit",
      "Cotton Canvas", "Cotton Twill", "Denim", "Interlock", "Mesh",
    ],
  },
  {
    id: "dyes",
    label: "Dyes / Washes",
    items: [
      "Fabric Dye", "Garment Dye", "Acid Wash", "Stone Wash",
      "Mineral Dye", "Sand Wash", "Crush Wash", "Enzyme Wash",
    ],
  },
  {
    id: "custom",
    label: "Customizations",
    items: [
      "Digital Printing (DTG, DTF)", "Screen Print Water Based",
      "Screen Print Plastisol", "Rubber Print", "Sublimation",
      "All-over Digital Print", "Flock Print", "Embossing", "Embroidery",
      "3D Embroidery", "Distressing", "Sun Fade", "Potassium Spray",
      "Pigment Spray",
    ],
  },
];

export default function Manufacturing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("products");
  const activeData = tabs.find((t) => t.id === activeTab)!;
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [30, -15]);

  return (
    <section className="relative py-32 bg-white overflow-hidden" ref={scrollRef}>
      <HalftoneCircle size={400} position="top-right" color="purple" />
      <HalftoneField color="purple" side="right" density={12} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="section-label mb-4 block"
            >
              Our Capabilities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              Apparel Manufacturing
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-halftone-muted max-w-md text-sm leading-relaxed"
          >
            We handle almost any type of custom garment at sustainable production minimums.
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-halftone-dark text-white"
                  : "bg-halftone-light text-halftone-muted hover:text-halftone-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ y: contentY }}
        >
          <div className="service-card !p-8 corner-brackets">
            <div className="flex flex-wrap gap-2.5">
              {activeData.items.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="pill-dark"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="halftone-divider mt-20" />
      </div>
    </section>
  );
}
