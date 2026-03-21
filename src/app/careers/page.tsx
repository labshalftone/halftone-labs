"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/lib/currency-context";
import { copy } from "@/lib/copy";

const OPEN_ROLES = [
  // India Team
  {
    team: "India Team",
    region: "Noida, India",
    flag: "🇮🇳",
    roles: [
      {
        title: "Head of Production",
        type: "Full-time",
        desc: "Own our print & fulfilment operations end-to-end. You'll manage vendor relationships, production SLAs, QC pipelines, and scale us from 10K to 100K garments/month.",
        tags: ["Operations", "Senior", "Noida"],
      },
      {
        title: "Senior Software Engineer — Platform",
        type: "Full-time",
        desc: "Build the core infrastructure behind Halftone Studio — order management, designer tooling, Shopify integrations, and our internal ops dashboards. TypeScript + Next.js.",
        tags: ["Engineering", "Senior", "Noida / Remote"],
      },
      {
        title: "Growth Marketing Manager",
        type: "Full-time",
        desc: "Own acquisition across paid, organic, and influencer channels for the Indian market. You'll build the funnel from zero — CAC, LTV, all the fun stuff.",
        tags: ["Marketing", "Mid-Senior", "Noida"],
      },
      {
        title: "Brand Partnerships Lead — India",
        type: "Full-time",
        desc: "Sign and onboard artists, labels, and festivals. You'll be the face of Halftone Labs to the Indian creator economy — building the network that fuels our next 10x.",
        tags: ["Sales", "Senior", "Noida / Remote"],
      },
      {
        title: "Graphic Designer — Merch & Brand",
        type: "Full-time",
        desc: "Design merch drops, brand assets, and print-ready artwork for our clients and our own label ADHD. You know how garment design differs from screen design.",
        tags: ["Design", "Mid", "Noida"],
      },
    ],
  },

  // NA Team
  {
    team: "North America Team",
    region: "Remote — US / Canada",
    flag: "🇺🇸",
    roles: [
      {
        title: "VP of Sales — North America",
        type: "Full-time",
        desc: "Build and lead our NA revenue motion. You'll own enterprise merch deals with record labels, festival groups, and artist management companies. First NA sales hire.",
        tags: ["Sales", "VP", "Remote USA/CA"],
      },
      {
        title: "Artist & Label Partnerships — NA",
        type: "Full-time",
        desc: "Sign emerging and established artists to Halftone's merch platform. You have existing relationships in music, streetwear, or creator economy spaces.",
        tags: ["Partnerships", "Mid-Senior", "Remote USA"],
      },
      {
        title: "Senior Account Executive",
        type: "Full-time",
        desc: "Close inbound and outbound merch deals with brands doing $1M+ in revenue. Own the full sales cycle — discovery to contract. Experience with SaaS or B2B services preferred.",
        tags: ["Sales", "Senior", "Remote USA"],
      },
      {
        title: "Content & Community Manager — NA",
        type: "Full-time",
        desc: "Grow our North American creator community across social, newsletter, and events. You understand the US music and streetwear landscape deeply.",
        tags: ["Marketing", "Mid", "Remote USA"],
      },
    ],
  },

  // Europe Team
  {
    team: "Europe Team",
    region: "Remote — UK / EU",
    flag: "🇪🇺",
    roles: [
      {
        title: "Country Manager — UK & Europe",
        type: "Full-time",
        desc: "Own our European expansion from the ground up. You'll set market strategy, build the local team, and sign our first 50 European label and festival clients.",
        tags: ["Leadership", "Director", "London / Remote EU"],
      },
      {
        title: "Partnership Manager — UK Music Industry",
        type: "Full-time",
        desc: "Tap into the UK's dense music ecosystem — labels, managers, venues, and festivals. Build pipeline and close accounts. You know who the Beggars Group is.",
        tags: ["Partnerships", "Mid-Senior", "London / Remote"],
      },
      {
        title: "Operations Lead — EU Fulfilment",
        type: "Full-time",
        desc: "Help build our European fulfilment network to serve EU customers with shorter shipping times and local customs compliance. Supply chain and 3PL experience required.",
        tags: ["Operations", "Senior", "Remote EU"],
      },
    ],
  },
];

const PERKS = [
  { emoji: "🚀", title: "Series A trajectory", body: "We're scaling to $100M ARR. Get equity, get in early, and grow with the rocket." },
  { emoji: "🌍", title: "Global team", body: "Work with people across India, North America, and Europe building something new in creator commerce." },
  { emoji: "🎨", title: "Creative-first culture", body: "We work with artists every day. The work is real, the clients are interesting, and the product ships." },
  { emoji: "📈", title: "Real ownership", body: "Small team, big scope. You won't spend 3 years owning a button. You'll own a function." },
  { emoji: "💰", title: "Competitive comp", body: "Market-rate salaries plus equity. We pay fairly and transparently across all regions." },
  { emoji: "🎧", title: "The perks are real", body: "Free merch. Early access to drops. And the kind of Spotify playlist that actually slaps." },
];

function RoleCard({ role }: { role: (typeof OPEN_ROLES)[0]["roles"][0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
      <button
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="text-ds-dark font-semibold text-sm mb-1.5" style={{ letterSpacing: "-0.015em" }}>
            {role.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {role.tags.map((t) => (
              <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-brand bg-brand-5 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          <span className="text-xs text-ds-muted flex items-center gap-1">
            <Clock size={11} /> {role.type}
          </span>
          {open ? <ChevronUp size={15} className="text-ds-muted" /> : <ChevronDown size={15} className="text-ds-muted" />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-black/[0.04] pt-4">
          <p className="text-ds-body text-sm leading-relaxed mb-4">{role.desc}</p>
          <a
            href={`mailto:hello@halftonelabs.in?subject=Application — ${encodeURIComponent(role.title)}`}
            className="btn-brand inline-flex text-sm"
          >
            Apply for this role <ArrowUpRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function CareersPage() {
  const { isIndia } = useCurrency();
  const c = copy(isIndia);

  const totalRoles = OPEN_ROLES.reduce((sum, t) => sum + t.roles.length, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Careers</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                {c.careersHeadline}
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed mb-6">
                {c.careersSubtitle}
              </p>
              <div className="flex items-center gap-4">
                <a href="#roles" className="btn-brand"><ArrowUpRight size={15} /> See {totalRoles} open roles</a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <span className="ds-label ds-label-brand mb-10 block">Why Halftone Labs</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-6">
                <span className="text-3xl block mb-4">{p.emoji}</span>
                <h3 className="text-ds-dark text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-ds-muted text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open roles */}
        <section id="roles" className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
              <span className="ds-label ds-label-brand block">Open Roles</span>
              <span className="text-xs text-ds-muted font-medium">{totalRoles} positions across 3 regions</span>
            </div>

            <div className="space-y-14">
              {OPEN_ROLES.map((team) => (
                <div key={team.team}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{team.flag}</span>
                    <div>
                      <p className="text-ds-dark font-semibold text-sm">{team.team}</p>
                      <p className="text-ds-muted text-xs flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {team.region}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {team.roles.map((role) => (
                      <RoleCard key={role.title} role={role} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* General application */}
            <div className="mt-14 bg-white border border-black/[0.06] rounded-2xl p-8 text-center">
              <p className="text-ds-dark font-semibold mb-2" style={{ letterSpacing: "-0.02em" }}>
                Don&apos;t see your role?
              </p>
              <p className="text-ds-body text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                We&apos;re moving fast. If you&apos;re exceptional at what you do and care about the creator economy, send us a note regardless.
              </p>
              <a
                href="mailto:hello@halftonelabs.in?subject=General Application — Halftone Labs"
                className="btn-brand inline-flex"
              >
                Send us a note <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
