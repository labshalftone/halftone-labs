"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { posts } from "@/lib/journal";

const ACCENT_COLORS = ["bg-brand", "bg-ds-dark", "bg-ds-dark2"];

const CATEGORY_STYLES: Record<string, string> = {
  "Print Tech":   "bg-blue-50 text-blue-600 border-blue-100",
  "Artist Guide": "bg-brand-8 text-brand border-brand-15",
  "Industry":     "bg-purple-50 text-purple-600 border-purple-100",
};

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-16 px-6">
          <div className="halftone-divider" />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Journal</span>
              <h1
                className="text-5xl md:text-7xl text-ds-dark leading-[0.9] mb-5"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                <span className="h-fade">Inside the world </span>
                <br />
                <span className="h-bold">of artist merch.</span>
              </h1>
              <p className="text-ds-body text-lg max-w-lg leading-relaxed">
                Print tech, drop strategy, and the thinking behind some of the most interesting merch we've made.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts grid */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/journal/${post.slug}`}
                  className="group block ds-card hover:shadow-lg transition-all duration-200 overflow-hidden h-full"
                >
                  {/* Accent band */}
                  <div className={`h-1.5 w-full ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`} />
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          CATEGORY_STYLES[post.category] ?? "bg-ds-light-gray text-ds-muted border-black/[0.06]"
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h2
                      className="font-semibold text-ds-dark text-lg leading-tight mb-3 group-hover:text-brand transition-colors"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-ds-body text-sm leading-relaxed flex-1 mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-ds-muted">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Coming soon card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-ds-dark rounded-3xl border border-white/[0.06] p-7 flex flex-col justify-between min-h-[280px] relative overflow-hidden"
            >
              <div className="halftone-divider opacity-30" />
              <div className="relative z-10">
                <span className="ds-label text-white/30 mb-4 block">More coming</span>
                <h3
                  className="font-semibold text-white text-lg leading-tight mb-3"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  How Sunburn Festival made 5,000 uniforms in 10 days
                </h3>
                <p className="text-white/40 text-sm">Coming soon — behind the scenes of India's biggest festival merch drop.</p>
              </div>
              <div className="relative z-10 mt-6">
                <a
                  href="mailto:hello@halftonelabs.in?subject=Journal notify"
                  className="text-xs text-brand-light font-semibold hover:text-white transition-colors"
                >
                  Notify me when published →
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="border-t border-black/[0.06] bg-ds-dark px-6 py-14">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="font-semibold text-white text-xl mb-1"
                style={{ letterSpacing: "-0.03em" }}
              >
                Ready to start your own drop?
              </h3>
              <p className="text-white/50 text-sm">Open the Studio and place your first order in under 10 minutes.</p>
            </div>
            <Link href="/studio" className="btn-brand flex-shrink-0">
              Open Studio →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
