"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getFeaturedArticles, ACADEMY_CATEGORIES } from "@/content/academy";

const FEATURED_ARTICLES = getFeaturedArticles().slice(0, 4);

// ——— Reveal wrapper ————————————————————————————————————
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

// ——— 1. Hero ———————————————————————————————————————————
function Hero() {
  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden">
      {/* subtle purple tint */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(139,92,246,0.07),transparent)]" />

      <div className="max-w-[1200px] mx-auto px-6 pt-36 pb-24 md:pb-32">
        <div className="grid md:grid-cols-[1fr_auto] gap-16 items-end">

          {/* Left — copy */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-8"
            >
              Drop Commerce Platform — India
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8.5vw,7.5rem)] font-black leading-[0.9] mb-8"
              style={{ letterSpacing: "-0.05em" }}
            >
              Drop your merch.
              <br />
              <span className="text-zinc-500">Keep your audience.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-md mb-10"
              style={{ fontWeight: 500 }}
            >
              Artists, labels, and festivals launch merch drops on Halftone. No upfront inventory. No production headaches.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/studio"
                className="px-6 py-3 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors"
              >
                Launch your first drop
              </Link>
              <Link
                href="/store/adhd"
                className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full text-sm font-bold hover:border-zinc-500 hover:text-white transition-colors"
              >
                See a live drop
              </Link>
            </motion.div>
          </div>

          {/* Right — live drop card */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block flex-shrink-0"
          >
            <div className="w-[300px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              {/* Status */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
                  Live drop
                </span>
              </div>

              {/* Brand + product */}
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.18em] mb-1.5 font-bold">
                ADHD India
              </p>
              <h3 className="text-xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
                The Archive Crewneck
              </h3>

              {/* Countdown */}
              <div className="flex gap-5 mb-6">
                {[["02", "DAYS"], ["14", "HRS"], ["33", "MIN"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-3xl font-black text-white tabular-nums" style={{ letterSpacing: "-0.04em" }}>
                      {val}
                    </div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">Price</div>
                  <div className="text-lg font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                    ₹1,499
                  </div>
                </div>
                <button className="px-5 py-2 bg-white text-zinc-900 rounded-full text-xs font-bold hover:bg-zinc-100 transition-colors">
                  Add to cart
                </button>
              </div>

              {/* Waitlist bar */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Demand</span>
                  <span className="text-[10px] text-zinc-500 font-mono">47 on waitlist</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-violet-500 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-px bg-zinc-800" />
    </section>
  );
}

// ——— 2. How It Works —————————————————————————————————
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Design your merch",
      body: "Open Studio. Pick your products, upload your artwork, set your branding. Tees, hoodies, caps — whatever fits the moment.",
    },
    {
      num: "02",
      title: "Launch a drop",
      body: "Set a date. Add a countdown. Limit the run. Your drop page goes live when you decide — no inventory purchased upfront.",
    },
    {
      num: "03",
      title: "We handle the rest",
      body: "Production, quality checks, and direct shipping to every customer. You collect the payout.",
    },
  ];

  return (
    <section className="bg-white py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4">
            How it works
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-zinc-900 mb-16 md:mb-24"
            style={{ letterSpacing: "-0.04em" }}
          >
            Three steps from idea to sold.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 md:gap-10">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <p
                className="text-[clamp(4rem,7vw,5.5rem)] font-black text-zinc-100 leading-none mb-6 select-none"
                style={{ letterSpacing: "-0.05em" }}
              >
                {step.num}
              </p>
              <h3
                className="text-xl font-black text-zinc-900 mb-3"
                style={{ letterSpacing: "-0.025em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed" style={{ fontWeight: 500 }}>
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 3. Built For ————————————————————————————————————
function BuiltFor() {
  const entities = [
    {
      label: "Artists",
      body: "Your audience wants to wear your world. Give them a drop worth waiting for.",
      cta: "Open your store",
      href: "/studio",
    },
    {
      label: "Labels",
      body: "One dashboard, every artist. Drops, analytics, and payouts for your entire roster.",
      cta: "Label accounts",
      href: "/contact",
    },
    {
      label: "Festivals",
      body: "Pre-event hype, day-of exclusives, post-show keepsakes. All in one drop.",
      cta: "Festival drops",
      href: "/contact",
    },
  ];

  return (
    <section className="bg-zinc-50 border-t border-b border-zinc-100 py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4">
            Built for
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-zinc-900 mb-14"
            style={{ letterSpacing: "-0.04em" }}
          >
            Music. Culture. Commerce.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {entities.map((e, i) => (
            <Reveal key={e.label} delay={i * 0.08}>
              <div className="group bg-white border border-zinc-200 rounded-2xl p-7 hover:border-zinc-900 hover:shadow-sm transition-all h-full flex flex-col">
                <h3
                  className="text-2xl font-black text-zinc-900 mb-3"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {e.label}
                </h3>
                <p
                  className="text-sm text-zinc-500 leading-relaxed mb-6 flex-1"
                  style={{ fontWeight: 500 }}
                >
                  {e.body}
                </p>
                <Link
                  href={e.href}
                  className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors"
                >
                  {e.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 4. Drop Differentiators ————————————————————————
function DropFeatures() {
  const features = [
    {
      title: "Scheduled launches",
      desc: "Set a date. Let anticipation do the work.",
    },
    {
      title: "Countdown timers",
      desc: "Every drop feels like an event.",
    },
    {
      title: "Limited runs",
      desc: "Real scarcity. Not manufactured.",
    },
    {
      title: "Waitlists",
      desc: "Measure demand before the cart opens.",
    },
    {
      title: "No inventory risk",
      desc: "Produced when ordered. Never overstocked.",
    },
  ];

  return (
    <section className="bg-white py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left */}
          <Reveal>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4">
              Drop commerce
            </p>
            <h2
              className="text-3xl md:text-5xl font-black text-zinc-900 mb-6"
              style={{ letterSpacing: "-0.04em" }}
            >
              This is not a merch store.
              <br />
              <span className="text-zinc-400">This is a drop.</span>
            </h2>
            <p
              className="text-sm text-zinc-500 leading-relaxed max-w-xs"
              style={{ fontWeight: 500 }}
            >
              A drop is an event. It has a window, urgency, and a story. Halftone is built for drops — not generic storefronts.
            </p>
          </Reveal>

          {/* Right — feature list */}
          <div className="divide-y divide-zinc-100">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="py-5 flex items-start justify-between gap-6">
                  <h4 className="text-sm font-black text-zinc-900">{f.title}</h4>
                  <p
                    className="text-sm text-zinc-400 text-right"
                    style={{ fontWeight: 500 }}
                  >
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

// ——— 5. Academy Strip ————————————————————————————————
function AcademyStrip() {
  return (
    <section className="bg-zinc-950 text-white py-28 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <Reveal>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-4">
              Halftone Academy
            </p>
            <h2
              className="text-3xl md:text-5xl font-black"
              style={{ letterSpacing: "-0.04em" }}
            >
              Learn how to drop right.
            </h2>
          </Reveal>
          <Reveal>
            <Link
              href="/academy"
              className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
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
                className="group block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all h-full flex flex-col"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">
                  {ACADEMY_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category}
                </p>
                <h3
                  className="text-sm font-black text-white leading-snug group-hover:text-violet-300 transition-colors mb-3 flex-1"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {article.title}
                </h3>
                <p
                  className="text-xs text-zinc-600 mt-auto"
                  style={{ fontWeight: 500 }}
                >
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

// ——— 6. Trust / Social Proof ————————————————————————
function Trust() {
  const stats = [
    { value: "1,000+", label: "Orders shipped" },
    { value: "12+", label: "Drops launched" },
    { value: "India", label: "Based & built" },
  ];

  return (
    <section className="bg-white border-t border-zinc-100 py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <Reveal>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4">
              Trusted by
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-zinc-900 mb-8"
              style={{ letterSpacing: "-0.04em" }}
            >
              Real artists.
              <br />
              Real drops.
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="border border-zinc-200 rounded-xl px-4 py-2.5">
                <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                  ADHD India
                </p>
              </div>
              <p className="text-xs text-zinc-400" style={{ fontWeight: 500 }}>
                + more launching soon
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <p
                  className="text-3xl md:text-4xl font-black text-zinc-900 mb-1"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-400" style={{ fontWeight: 500 }}>
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— 7. Final CTA ————————————————————————————————————
function FinalCTA() {
  return (
    <section className="bg-zinc-950 text-white py-32 md:py-48">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <Reveal>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-6">
            Get started
          </p>
          <h2
            className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.9] mb-8 max-w-3xl mx-auto"
            style={{ letterSpacing: "-0.05em" }}
          >
            Your first drop
            <br />
            starts here.
          </h2>
          <p
            className="text-base text-zinc-500 max-w-sm mx-auto mb-10 leading-relaxed"
            style={{ fontWeight: 500 }}
          >
            Design merch your audience will actually buy. Set a drop date. Let us handle the rest.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/studio"
              className="px-8 py-3.5 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors"
            >
              Launch your first drop
            </Link>
            <Link
              href="/academy"
              className="px-8 py-3.5 border border-zinc-700 text-zinc-400 rounded-full text-sm font-bold hover:border-zinc-500 hover:text-white transition-colors"
            >
              Explore the Academy
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ——— Footer ——————————————————————————————————————————
function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <p
              className="text-base font-black text-white mb-3"
              style={{ letterSpacing: "-0.04em" }}
            >
              Halftone Labs
            </p>
            <p className="text-xs text-zinc-600" style={{ fontWeight: 500 }}>
              Drop commerce for artists, labels, and festivals.
            </p>
          </div>

          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-700 mb-4">
              Platform
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Studio", href: "/studio" },
                { label: "Academy", href: "/academy" },
                { label: "Help Center", href: "/help" },
                { label: "Dashboard", href: "/account" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-700 mb-4">
              Company
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Contact", href: "/contact" },
                { label: "Track order", href: "/track" },
                { label: "Instagram", href: "https://instagram.com/halftonelabs.in" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                  style={{ fontWeight: 500 }}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-700 mb-4">
              Contact
            </p>
            <a
              href="mailto:hello@halftonelabs.in"
              className="text-xs text-zinc-500 hover:text-white transition-colors"
              style={{ fontWeight: 500 }}
            >
              hello@halftonelabs.in
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-zinc-700" style={{ fontWeight: 500 }}>
            &copy; 2021&ndash;2025 Halftone Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors" style={{ fontWeight: 500 }}>
              Privacy
            </a>
            <a href="/terms" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors" style={{ fontWeight: 500 }}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ——— Page ————————————————————————————————————————————
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <BuiltFor />
      <DropFeatures />
      <AcademyStrip />
      <Trust />
      <FinalCTA />
      <Footer />
    </main>
  );
}
