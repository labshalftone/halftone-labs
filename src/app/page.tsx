"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Manufacturing from "@/components/Manufacturing";
import Benefits from "@/components/Benefits";
import Enterprise from "@/components/Enterprise";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import { getFeaturedArticles, ACADEMY_CATEGORIES } from "@/content/academy";

const FEATURED_ARTICLES = getFeaturedArticles().slice(0, 4);

// ── Scroll reveal wrapper ─────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Drop Differentiators ──────────────────────────────────
function DropFeatures() {
  const features = [
    { title: "Scheduled launches",   desc: "Set a date. Let anticipation do the work." },
    { title: "Countdown timers",     desc: "Every drop feels like an event." },
    { title: "Limited runs",         desc: "Real scarcity. Not manufactured." },
    { title: "Waitlists",            desc: "Measure demand before the cart opens." },
    { title: "No inventory risk",    desc: "Produced when ordered. Never overstocked." },
  ];

  return (
    <section className="bg-white py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          <Reveal>
            <span className="ds-label ds-label-brand mb-4 block">
              Drop commerce
            </span>
            <h2
              className="text-3xl md:text-5xl leading-[0.92] mb-6"
              style={{ letterSpacing: "-0.055em" }}
            >
              <span className="h-bold">This is not a merch store.</span>
              <br />
              <span className="h-fade">This is a drop.</span>
            </h2>
            <p className="text-sm text-ds-body leading-relaxed max-w-xs">
              A drop is an event. It has a window, urgency, and a story. Halftone is built for drops, not generic storefronts.
            </p>
          </Reveal>

          <div className="divide-y divide-black/[0.06]">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="py-5 flex items-start justify-between gap-6">
                  <h4
                    className="text-sm text-ds-dark"
                    style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    {f.title}
                  </h4>
                  <p className="text-sm text-ds-muted text-right">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Academy Strip ─────────────────────────────────────────
function AcademyStrip() {
  return (
    <section className="bg-ds-dark text-white py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <Reveal>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/30 mb-4">
              Halftone Academy
            </p>
            <h2
              className="text-3xl md:text-5xl text-white leading-[0.92]"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              Learn how to drop right.
            </h2>
          </Reveal>
          <Reveal>
            <Link
              href="/academy"
              className="text-sm font-semibold text-white/40 hover:text-white transition-colors"
            >
              All guides →
            </Link>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_ARTICLES.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.07}>
              <Link
                href={`/academy/${article.slug}`}
                className="group flex flex-col bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all h-full"
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest text-brand-light mb-3"
                >
                  {ACADEMY_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category}
                </p>
                <h3
                  className="text-sm font-semibold text-white leading-snug group-hover:text-brand-light transition-colors mb-3 flex-1"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {article.title}
                </h3>
                <p className="text-[10px] text-white/30 mt-auto">
                  {article.readingTime} min read
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Runs With Your Stack ──────────────────────────────────
function RunsWithStack() {
  const integrations = [
    {
      label: "Shopify compatible",
      abbr: "SH",
      desc: "Connect your existing Shopify storefront. Orders flow in automatically.",
    },
    {
      label: "Order sync",
      abbr: "SY",
      desc: "Real-time order data across your store, our facility, and your team.",
    },
    {
      label: "Fulfillment handled",
      abbr: "FF",
      desc: "We pick, pack, and ship. You never touch the inventory.",
    },
  ];

  return (
    <section className="bg-ds-dark text-white py-20 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">

          <Reveal>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/30 mb-4">
              Integrations
            </p>
            <h2
              className="text-2xl md:text-3xl text-white leading-tight mb-4"
              style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
            >
              Runs with
              <br />
              your stack.
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Plug into what you already use. Zero migration. Zero ops overhead.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4">
            {integrations.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.07}>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 h-full hover:bg-white/[0.07] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-4">
                    <span className="text-white/50 text-xs font-semibold mono-tag">
                      {item.abbr}
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold text-white mb-1.5"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Page assembly ─────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <DropFeatures />
      <Process />
      <Manufacturing />
      <Benefits />
      <Enterprise />
      <RunsWithStack />
      <AcademyStrip />
      <Testimonial />
      <FAQ />
      <GetStarted />
      <Footer />
    </main>
  );
}
