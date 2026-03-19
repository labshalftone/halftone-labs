"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HalftoneField, HalftoneCircle } from "./HalftoneBackground";

const faqs = [
  {
    q: "What is your minimum order quantity?",
    a: "Depends on what you need. For on-demand Studio orders (printed and shipped one at a time), the MOQ is 1. No bulk commitment, no dead stock. For custom bulk drops (cut-and-sew, screen print, woven labels, embroidery), the MOQ is 50 units per style. Two modes, built for different stages of your journey.",
  },
  {
    q: "How long does production take?",
    a: "On-demand Studio orders ship within 5–7 business days domestically. Custom bulk drops (the kind with bespoke construction, specialty printing, or full packaging) take 3–4 weeks depending on complexity and volume. We'll give you a clear timeline upfront, not a vague estimate.",
  },
  {
    q: "What print technique do you use?",
    a: "DTG (Direct-to-Garment) is our signature technique. Ink is printed directly into the fabric for a breathable, soft feel that looks incredible and only gets better with wear. We've refined it over thousands of prints and recommend it for virtually every design. DTF (Direct-to-Film) is also available on request; it creates a slightly raised, textured finish suited to specific bold graphic styles. For most designs, DTG is simply the better experience.",
  },
  {
    q: "Can I order a sample before committing to bulk?",
    a: "Yes, and we actively encourage it. Blank samples start from ₹499. Printed samples (your actual artwork on the garment) start from ₹799. Order through the Studio, check the fit and print quality in your hands, then scale up. No guesswork, no surprises.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Domestic orders ship via Shiprocket and arrive in 5–7 business days. International orders ship in 10–18 business days depending on the destination. Duties and taxes are the buyer's responsibility for international shipments.",
  },
  {
    q: "What if I'm not happy with the quality?",
    a: "We stand behind everything that leaves our facility. If there's a print defect, a sizing issue, or anything that doesn't meet the spec you approved, we'll reprint or refund. No runaround. Reach us at hello@halftonelabs.in with photos and your order number.",
  },
  {
    q: "Can you design the artwork for me?",
    a: "Yes. Our in-house design team has worked on everything from minimalist logos to full tour merch collections. If you have a rough idea, a mood board, or just a vibe, we'll turn it into print-ready artwork. Design services are scoped separately; reach out to discuss.",
  },
  {
    q: "Do you offer custom neck labels or packaging?",
    a: "Yes, for bulk orders. Custom woven or printed neck labels are available from MOQ 50 units. Branded poly bags, hang tags, tissue paper, and box packaging can be added to any bulk order. White-label fulfillment means your customer sees your brand, not ours.",
  },
  {
    q: "What file format should I use for my artwork?",
    a: "For the best results, send us a PNG or PDF with a transparent background, at least 300 DPI at print size. Vector files (AI or EPS) are ideal for logos and text-heavy designs. If your file isn't print-ready, our team can clean it up. Just flag it when you submit.",
  },
  {
    q: "How does pricing work?",
    a: "On-demand Studio orders are priced transparently at checkout. You see the total before you confirm. For custom bulk quotes, pricing depends on garment type, print method, quantity, and finishing. Send us your brief and we'll turn around a detailed quote within 24 hours.",
  },
  {
    q: "Do you work with independent artists or only big labels?",
    a: "Both, and we treat them the same. We've worked with global labels and bedroom producers, festival headliners and debut acts. The only thing that matters is that you're serious about your merch. Scale doesn't.",
  },
  {
    q: "How do I get started?",
    a: "Two ways. If you want on-demand merch right now, head to the Studio, upload your artwork, and place an order. It takes about five minutes. If you're thinking about a custom bulk drop, a full merch strategy, or something more involved, email us at hello@halftonelabs.in or book a discovery call. We'll take it from there.",
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
    <section className="relative py-32 bg-zinc-50 overflow-hidden" ref={scrollRef}>
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
