"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CASE_STUDIES = [
  {
    id: "kevin-abstract-blush",
    client: "Kevin Abstract",
    tag: "Artist · Global",
    project: "BLUSH — Album Merch Drop",
    year: "2024",
    colorBg: "#0f0f0f",
    colorAccent: "#f15533",
    colorText: "#ffffff",
    quote: "Halftone understood the aesthetic from day one. The merch doesn't just look good — it feels like an extension of the music.",
    intro: "Kevin Abstract — founding member of BROCKHAMPTON and acclaimed solo artist — came to Halftone Labs for the merch rollout of BLUSH, his introspective solo project exploring identity, intimacy, and creative freedom.",
    challenge: "BLUSH demanded merch that felt as considered as the music — not a standard logo tee, but a wearable extension of the project's visual world. Abstract wanted to move away from the typical artist-merch playbook: minimal branding, no heavy graphics, just something fans would reach for because it was genuinely worth wearing.",
    solution: "We produced a capsule of oversized tees and heavyweight crewnecks, printed with subtle artwork drawn directly from the album's visual palette. Muted tones, botanical motifs, deliberate negative space. DTG printing on 240 GSM French terry captured every gradient and detail exactly as intended.",
    result: "The drop sold through in under 48 hours. Fans highlighted the garment quality specifically — a rare thing in artist merch, where fit and fabric are often afterthoughts.",
    products: ["Oversized Tee (FT) 240 GSM", "Crewneck Sweatshirt", "DTG Printing"],
    stats: [
      { label: "Sell-through", value: "< 48hrs" },
      { label: "Units produced", value: "500+" },
      { label: "Print method", value: "DTG" },
    ],
  },
  {
    id: "restricted-teletech",
    client: "Restricted",
    tag: "DJ · Australia",
    project: "Teletech — Merch Drop",
    year: "2024",
    colorBg: "#1a0a2e",
    colorAccent: "#9b59b6",
    colorText: "#ffffff",
    quote: "What I liked most was how effortless they made the process. The team really understood the timelines. Shipping to Australia was seamless.",
    intro: "Restricted is one of Australia's most respected underground techno DJs — a fixture of the global circuit with a sound that consistently bridges industrial grit and dancefloor urgency. Teletech is his label and creative brand, and the merch needed to match the uncompromising aesthetic of the music.",
    challenge: "Getting high-quality merch from India to Australia on a tight timeline, with print quality that could hold up to the scrutiny of the electronic music community. The Teletech brand demanded precision — sharp graphics, heavy garments, and a dark colour palette that most print methods struggle with.",
    solution: "We produced a run of oversized tees and longsleeves using DTF printing on 240 GSM French terry blanks in True Black. DTF's adhesion to dark garments delivered the crisp, high-contrast graphics the Teletech identity required. International shipping via Shiprocket ensured the drop landed in time for his tour schedule.",
    result: "The drop became one of the most talked-about merch releases in Australia's underground dance community that year. The garment quality set a new standard for what techno merch could look and feel like.",
    products: ["Oversized Tee (FT) 240 GSM", "Longsleeve 240 GSM", "DTF Printing"],
    stats: [
      { label: "Shipped to", value: "Australia" },
      { label: "Lead time", value: "12 days" },
      { label: "Print method", value: "DTF" },
    ],
  },
  {
    id: "sunburn-wearadhd",
    client: "Sunburn Festival",
    tag: "Festival · India",
    project: "WearADHD × Sunburn 2025 — Festival Collab",
    year: "2025",
    colorBg: "#ff6b00",
    colorAccent: "#ffffff",
    colorText: "#ffffff",
    quote: "The drop went crazy. WearADHD completely understood the energy of Sunburn — the pieces felt like festival culture, not just merchandise.",
    intro: "Sunburn Festival is India's largest and most iconic electronic music festival — a three-day experience that draws 50,000+ attendees annually to Goa. For the 2025 edition, Sunburn partnered with WearADHD (All Day, High Decibels) — Halftone Labs' own music-inspired streetwear label — to create an exclusive festival merch collection.",
    challenge: "Producing a high-volume, high-quality merch drop in time for one of India's biggest cultural events. The collection needed to represent both the Sunburn brand and the WearADHD aesthetic — bold, music-rooted, wearable beyond the festival weekend. The logistical challenge: 5,000+ units across multiple styles, delivered to Goa for the event.",
    solution: "We designed a capsule featuring oversized tees, crewnecks, and tote bags — all screen printed with the collaboration's visual identity. The palette mixed Sunburn's signature orange energy with WearADHD's monochromatic streetwear codes. White-label packaging allowed both brands to coexist on the garment without one overpowering the other.",
    result: "The collection sold out across all three festival days. Several pieces were spotted on international artists performing at the event. The collaboration generated significant social media coverage and established the WearADHD × Sunburn partnership as a recurring annual drop.",
    products: ["Oversized Tee", "Crewneck", "Tote Bag", "Screen Print"],
    stats: [
      { label: "Units produced", value: "5,000+" },
      { label: "Sell-through", value: "3 days" },
      { label: "Attendees", value: "50,000+" },
    ],
  },
];

const ALL_CLIENTS = [
  "Sunburn Festival", "Kevin Abstract", "Galactica", "Restricted", "Teletech",
  "BLUSH", "Tidal Rave", "Katarsis", "Felicia Lu", "We Met At The Bar",
  "WearADHD", "Illusion Hills", "NovaRock", "RAUN", "DJ ADHD",
  "Lowlands", "C2C Festival", "Revive Records", "Vanisher", "Time Music",
];

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#f8f7f5" }}>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-200/60 pt-28 pb-20 px-6">
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-5">[ Case Studies ]</p>
              <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-zinc-900 leading-[0.9] mb-6" style={{ letterSpacing: "-0.05em" }}>
                The proof is<br />
                <span style={{ WebkitTextStroke: "2px #111", color: "transparent" }}>in the product.</span>
              </h1>
              <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
                Real drops. Real artists. Real results. Here's how we work — and what it looks like when it comes together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case study cards */}
        <section className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-10">
          {CASE_STUDIES.map((cs, i) => (
            <motion.article
              key={cs.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden border border-zinc-200 bg-white"
            >
              {/* Header band */}
              <div className="p-8 md:p-10 relative overflow-hidden" style={{ background: cs.colorBg }}>
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[0.6rem] font-mono uppercase tracking-widest" style={{ color: cs.colorAccent }}>{cs.tag}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-[0.6rem] font-mono uppercase tracking-widest text-white/30">{cs.year}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2" style={{ color: cs.colorText, letterSpacing: "-0.04em" }}>
                      {cs.client}
                    </h2>
                    <p className="font-medium" style={{ color: cs.colorAccent }}>{cs.project}</p>
                  </div>
                  {/* Stats */}
                  <div className="flex gap-6">
                    {cs.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-2xl font-black" style={{ color: cs.colorAccent, letterSpacing: "-0.04em" }}>{s.value}</p>
                        <p className="text-[0.6rem] uppercase tracking-widest text-white/40 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 md:p-10">
                {/* Quote */}
                <blockquote className="border-l-4 border-zinc-200 pl-5 mb-8">
                  <p className="text-zinc-600 italic leading-relaxed">"{cs.quote}"</p>
                  <cite className="text-xs text-zinc-400 not-italic mt-2 block">— {cs.client}</cite>
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">The Brief</p>
                    <p className="text-zinc-700 text-sm leading-relaxed">{cs.intro}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">The Challenge</p>
                    <p className="text-zinc-700 text-sm leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">What We Made</p>
                    <p className="text-zinc-700 text-sm leading-relaxed mb-4">{cs.solution}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.products.map((p) => (
                        <span key={p} className="text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="mt-8 pt-8 border-t border-zinc-100 bg-zinc-50 -mx-8 md:-mx-10 -mb-8 md:-mb-10 px-8 md:px-10 pb-8 md:pb-10 rounded-b-3xl">
                  <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">The Result</p>
                  <p className="text-zinc-800 font-medium leading-relaxed">{cs.result}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* All clients ticker */}
        <section className="border-t border-zinc-200 py-14 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 mb-8">
            <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400">60+ artists & events trust Halftone Labs</p>
          </div>
          <div className="relative">
            <div className="flex gap-0 overflow-hidden">
              <div className="flex gap-8 items-center animate-marquee whitespace-nowrap">
                {[...ALL_CLIENTS, ...ALL_CLIENTS].map((name, i) => (
                  <span key={i} className="text-sm font-black uppercase tracking-tight text-zinc-300 flex-shrink-0 flex items-center gap-8">
                    {name}
                    <span className="text-zinc-200">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 border-t border-zinc-200">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-zinc-900 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10">
                <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-4">Your drop next</p>
                <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.05em" }}>
                  Ready to make something real?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Whether it's your first tee or a 10,000-piece festival run — we've done it before, and we'd love to do it with you.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/studio" className="px-6 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors">
                    Open Studio →
                  </Link>
                  <a href="mailto:hello@halftonelabs.in" className="px-6 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors">
                    Discuss your project
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
