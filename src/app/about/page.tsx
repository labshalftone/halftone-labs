"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STATS = [
  { value: "10,000+", label: "Garments printed" },
  { value: "500+", label: "Artists & brands served" },
  { value: "4+", label: "Years in operation" },
  { value: "48h", label: "Avg. production time" },
];

const TEAM = [
  {
    name: "Founders",
    description:
      "Halftone Labs was started by a small team of designers and music lovers who were tired of bad merch — low quality blanks, dull prints, and no creative support. We built the studio we wished existed.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        {/* Hero */}
        <section className="pt-36 pb-20 max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ds-label text-white/30 block mb-6">About Us</span>
            <h1
              className="text-4xl md:text-6xl leading-[0.92] mb-8 max-w-3xl"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">We make merch that </span>
              <span className="h-bold-dark">artists are proud to sell.</span>
            </h1>
            <p className="text-white/45 max-w-xl leading-relaxed text-base">
              Halftone Labs is India&apos;s independent merch and creative studio — built for
              musicians, creators, and brands who care about quality as much as they care
              about their art.
            </p>
          </motion.div>
        </section>

        {/* Story */}
        <section className="bg-ds-light-gray border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <span className="ds-label text-white/30 block mb-4">Our Story</span>
                <h2
                  className="text-3xl md:text-4xl mb-6 leading-tight"
                  style={{ fontWeight: 700, letterSpacing: "-0.045em" }}
                >
                  Started out of frustration. Built with intention.
                </h2>
                <p className="text-white/45 leading-relaxed text-sm mb-4">
                  We&apos;ve been on both sides of the table — as artists ordering merch, and as
                  the people printing it. We know what goes wrong: files that aren&apos;t
                  checked, blanks that shrink after one wash, colours that fade.
                </p>
                <p className="text-white/45 leading-relaxed text-sm mb-4">
                  So we built a studio that operates differently. Every file is reviewed by a
                  human before it touches a garment. Every blank we stock has been tested.
                  Every print is checked before it ships.
                </p>
                <p className="text-white/45 leading-relaxed text-sm">
                  We&apos;re based in India, shipping pan-India, and we&apos;re proud to work with
                  some of the country&apos;s most exciting independent artists, labels, and creator
                  brands.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6"
                  >
                    <p
                      className="text-3xl text-white mb-1"
                      style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <span className="ds-label text-white/30 block mb-10">What we stand for</span>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality over volume",
                body: "We&apos;d rather print 100 garments that last 3 years than 1,000 that fall apart. We&apos;re selective about the blanks we stock and the processes we use.",
              },
              {
                title: "Transparent pricing",
                body: "No hidden setup fees, no surprise charges. Our pricing page shows exactly what you pay for each product, quantity tier, and print method.",
              },
              {
                title: "Creative partnership",
                body: "We&apos;re not just a printer. We consult on design, colour, fabric weight, and packaging to make sure your merch tells your story right.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7"
              >
                <h3
                  className="text-lg text-white mb-3"
                  style={{ fontWeight: 600, letterSpacing: "-0.03em" }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-sm text-white/40 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: v.body }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.05] bg-ds-light-gray">
          <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h2
              className="text-3xl md:text-4xl mb-6"
              style={{ fontWeight: 700, letterSpacing: "-0.045em" }}
            >
              Ready to make something?
            </h2>
            <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
              Start in the Studio, or reach out and tell us what you&apos;re working on.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="/studio" className="btn-brand">Open Studio</a>
              <a
                href="mailto:hello@halftonelabs.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:border-white/25 hover:text-white transition-all"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
