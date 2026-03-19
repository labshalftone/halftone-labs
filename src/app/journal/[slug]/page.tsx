"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { posts, getPostBySlug } from "@/lib/journal";

const CATEGORY_COLORS: Record<string, string> = {
  "Print Tech":   "bg-blue-50 text-blue-600 border-blue-100",
  "Artist Guide": "bg-brand-8 text-brand-dark border-orange-100",
  "Industry":     "bg-purple-50 text-purple-600 border-purple-100",
};

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h3 key={i} className="text-xl font-semibold text-ds-dark mt-10 mb-4" style={{ letterSpacing: "-0.03em" }}>{line.replace(/\*\*/g, "")}</h3>;
    }
    if (line.trim() === "") return <div key={i} className="h-3" />;
    // inline bold
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-ds-body leading-[1.8] text-[1.05rem] mb-1">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} className="text-ds-dark font-bold">{part.replace(/\*\*/g, "")}</strong>
            : part
        )}
      </p>
    );
  });
}

export default function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen" >

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06]/60 pt-28 pb-16 px-6">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link href="/journal" className="inline-flex items-center gap-1.5 text-xs text-ds-muted hover:text-ds-body mb-6 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Journal
              </Link>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? "bg-ds-light-gray text-ds-body border-black/[0.06]"}`}>
                  {post.category}
                </span>
                <span className="text-xs text-ds-muted">{post.date}</span>
                <span className="text-xs text-ds-muted">·</span>
                <span className="text-xs text-ds-muted">{post.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-ds-dark leading-[0.95] mb-6" style={{ letterSpacing: "-0.05em" }}>
                {post.title}
              </h1>
              <p className="text-ds-body text-lg leading-relaxed">{post.excerpt}</p>
            </motion.div>
          </div>
        </section>

        {/* Article body */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="prose-custom">
              {renderContent(post.content)}
            </div>
          </motion.div>

          {/* Author / origin strip */}
          <div className="mt-16 pt-8 border-t border-black/[0.06] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-ds-dark flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              HL
            </div>
            <div>
              <p className="font-bold text-ds-dark text-sm">Halftone Labs</p>
              <p className="text-xs text-ds-muted">India's leading merch studio for artists, labels, and festivals.</p>
            </div>
            <Link href="/studio" className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
              Try the Studio →
            </Link>
          </div>
        </section>

        {/* More posts */}
        {others.length > 0 && (
          <section className="border-t border-black/[0.06] px-6 py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-semibold text-ds-dark text-xl mb-8" style={{ letterSpacing: "-0.03em" }}>More from the journal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {others.map((p) => (
                  <Link key={p.slug} href={`/journal/${p.slug}`}
                    className="group bg-white rounded-2xl border border-black/[0.06] hover:border-zinc-300 hover:shadow-sm transition-all p-6 block">
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category] ?? "bg-ds-light-gray text-ds-body border-black/[0.06]"} mb-3 inline-block`}>
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-ds-dark text-base leading-tight group-hover:text-brand-dark transition-colors mb-2" style={{ letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <p className="text-ds-body text-xs">{p.readTime} · {p.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
