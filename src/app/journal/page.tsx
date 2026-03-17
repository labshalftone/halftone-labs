"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { posts } from "@/lib/journal";

const CATEGORY_COLORS: Record<string, string> = {
  "Print Tech":    "bg-blue-50 text-blue-600 border-blue-100",
  "Artist Guide":  "bg-orange-50 text-orange-600 border-orange-100",
  "Industry":      "bg-purple-50 text-purple-600 border-purple-100",
};

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#f8f7f5" }}>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-200/60 pt-28 pb-16 px-6">
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-5">[ Journal ]</p>
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 leading-[0.9] mb-5" style={{ letterSpacing: "-0.055em" }}>
                Inside the world<br />of artist merch.
              </h1>
              <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
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
                <Link href={`/journal/${post.slug}`} className="group block bg-white rounded-3xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 overflow-hidden h-full">
                  {/* Card header — coloured band */}
                  <div className="h-2 w-full" style={{ background: i === 0 ? "#2563eb" : i === 1 ? "#f15533" : "#7c3aed" }} />
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? "bg-zinc-50 text-zinc-500 border-zinc-100"}`}>
                        {post.category}
                      </span>
                    </div>
                    <h2 className="font-black text-zinc-900 text-lg leading-tight mb-3 group-hover:text-orange-600 transition-colors" style={{ letterSpacing: "-0.03em" }}>
                      {post.title}
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
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
              className="bg-zinc-900 rounded-3xl border border-zinc-800 p-7 flex flex-col justify-between min-h-[280px] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <div className="relative z-10">
                <span className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500 mb-4 block">More coming</span>
                <h3 className="font-black text-white text-lg leading-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
                  How Sunburn Festival made 5,000 uniforms in 10 days
                </h3>
                <p className="text-zinc-500 text-sm">Coming soon — behind the scenes of India's biggest festival merch drop.</p>
              </div>
              <div className="relative z-10 mt-6">
                <a href="mailto:hello@halftonelabs.in?subject=Journal notify" className="text-xs text-orange-400 font-bold hover:text-orange-300 transition-colors">
                  Notify me when published →
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="border-t border-zinc-200 px-6 py-16">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-black text-zinc-900 text-xl mb-1" style={{ letterSpacing: "-0.03em" }}>Ready to start your own drop?</h3>
              <p className="text-zinc-500 text-sm">Open the Studio and place your first order in under 10 minutes.</p>
            </div>
            <Link href="/studio" className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
              Open Studio →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
