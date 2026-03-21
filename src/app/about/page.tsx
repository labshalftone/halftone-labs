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

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-20 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">About Us</span>
              <h1
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-ds-dark leading-[0.9] mb-6"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">We make merch that </span>
                <span className="h-bold">artists are proud to sell.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-xl leading-relaxed">
                Halftone Labs is India&apos;s independent merch and creative studio — built for
                musicians, creators, and brands who care about quality as much as they care
                about their art.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="ds-label ds-label-brand mb-5 block">Our Story</span>
              <h2
                className="text-3xl md:text-4xl text-ds-dark mb-6 leading-tight"
                style={{ fontWeight: 700, letterSpacing: "-0.045em" }}
              >
                Started out of frustration. Built with intention.
              </h2>
              <p className="text-ds-body leading-relaxed mb-4">
                We&apos;ve been on both sides of the table — as artists ordering merch, and as
                the people printing it. We know what goes wrong: files that aren&apos;t
                checked, blanks that shrink after one wash, colours that fade.
              </p>
              <p className="text-ds-body leading-relaxed mb-4">
                So we built a studio that operates differently. Every file is reviewed by a
                human before it touches a garment. Every blank we stock has been tested.
                Every print is checked before it ships.
              </p>
              <p className="text-ds-body leading-relaxed">
                We&apos;re based in India, shipping pan-India, and we&apos;re proud to work with
                some of the country&apos;s most exciting independent artists, labels, and creator
                brands.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-6"
                >
                  <p
                    className="text-3xl text-ds-dark mb-1"
                    style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-sm text-ds-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-black/[0.06] bg-ds-off-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span className="ds-label ds-label-brand mb-10 block">What we stand for</span>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Quality over volume",
                  body: "We'd rather print 100 garments that last 3 years than 1,000 that fall apart. We're selective about the blanks we stock and the processes we use.",
                },
                {
                  title: "Transparent pricing",
                  body: "No hidden setup fees, no surprise charges. Our pricing page shows exactly what you pay for each product, quantity tier, and print method.",
                },
                {
                  title: "Creative partnership",
                  body: "We're not just a printer. We consult on design, colour, fabric weight, and packaging to make sure your merch tells your story right.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="bg-white border border-black/[0.06] rounded-2xl p-7"
                >
                  <h3
                    className="text-lg text-ds-dark mb-3"
                    style={{ fontWeight: 600, letterSpacing: "-0.03em" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-sm text-ds-body leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2
              className="text-3xl text-ds-dark mb-4"
              style={{ fontWeight: 700, letterSpacing: "-0.045em" }}
            >
              Ready to make something?
            </h2>
            <p className="text-ds-body mb-8 max-w-sm mx-auto">
              Start in the Studio, or reach out and tell us what you&apos;re working on.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="/studio" className="btn-brand">Open Studio</a>
              <a href="mailto:hello@halftonelabs.in" className="btn-outline-ds">Get in touch</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
