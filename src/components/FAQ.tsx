"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HalftoneField, HalftoneCircle } from "./HalftoneBackground";

const faqs = [
  {
    q: "What services do you offer?",
    a: "We help artists, labels, and creators launch and scale merch brands. Our services cover design, sampling, production, fulfillment, e-commerce, and marketing.",
  },
  {
    q: "What is your Minimum Order Quantity (MOQ)?",
    a: "We accept orders starting from 50 units per style, with variations depending on fabric type and complexity.",
  },
  {
    q: "How long does it take to launch merch?",
    a: "Most drops go live within 3 to 4 weeks, depending on the complexity of designs and product range. Festival and event merch can be produced even faster.",
  },
  {
    q: "Do you work with independent artists or only big labels?",
    a: "Both. We have worked with global labels and indie artists just starting out. If you have a vision, we will help you bring it to life at any scale.",
  },
  {
    q: "Can I customize the packages you offer?",
    a: "Yes. Whether you need only design support or full-stack merch management, we build packages to fit your needs.",
  },
  {
    q: "How do I get started?",
    a: "Book a discovery call with us or send us an email at hello@halftonelabs.in. We will understand your vision and suggest the right plan.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm group-hover:text-halftone-purple transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-halftone-muted/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-halftone-muted leading-relaxed pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [30, -15]);

  return (
    <section className="relative py-32 bg-halftone-light overflow-hidden" ref={scrollRef}>
      <HalftoneField color="purple" side="right" density={10} />
      <HalftoneCircle size={300} position="bottom-left" color="purple" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10" ref={ref}>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="section-label mb-4 block"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl mb-4"
              style={{ letterSpacing: "-0.05em" }}
            >
              Got Questions?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-halftone-muted text-sm"
            >
              Straightforward insights into how we build, launch, and scale
              artist-led brands.
            </motion.p>

            {/* Dot cluster */}
            <div className="dot-cluster mt-8 hidden lg:grid">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            style={{ y: contentY }}
            className="lg:w-2/3 service-card !p-0 !px-6 corner-brackets"
          >
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
