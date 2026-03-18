import Link from "next/link";
import type { Metadata } from "next";
import {
  ACADEMY_ARTICLES,
  ACADEMY_CATEGORIES,
  ACADEMY_AUDIENCE,
  getFeaturedArticles,
} from "@/content/academy";

export const metadata: Metadata = {
  title: "Academy — Halftone",
  description:
    "Strategic education for artists, managers, labels, and festivals. Learn merch, launches, pricing, and growth from people who've done it.",
};

export default function AcademyPage() {
  const featured = getFeaturedArticles();
  const published = ACADEMY_ARTICLES.filter((a) => a.status === "published");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0">
            <span className="text-base text-zinc-900" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
              Halftone Labs
            </span>
            <span className="mx-3 w-px h-4 bg-zinc-300 self-center" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-zinc-400 uppercase">
              Academy
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/academy" className="text-sm font-semibold text-zinc-900">Academy</Link>
            <Link href="/help" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Help</Link>
            <Link href="/account" className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-zinc-100 text-white overflow-hidden">
        {/* Background GIF */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.rovoassembly.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F281507%2F600x338%2F7a44f9d1c8%2Fgarment-wash-gif.gif%2Fm%2F0x0%2F&w=1200&q=75"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Halftone Academy</p>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6" style={{ letterSpacing: "-0.04em" }}>
              Learn how to build<br />
              <span className="text-zinc-400">a merch operation</span><br />
              that actually works.
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Strategic education for artists, managers, labels, and festivals. Not a manual — a curriculum built around how music commerce actually works.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Link href="#audience" className="px-5 py-2.5 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors">
                Find your path →
              </Link>
              <Link href="#guides" className="px-5 py-2.5 border border-zinc-600 text-white rounded-full text-sm font-medium hover:border-zinc-400 transition-colors">
                Browse all guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Audience selector */}
      <section id="audience" className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Who are you?</p>
        <h2 className="text-2xl font-black text-zinc-900 mb-8" style={{ letterSpacing: "-0.03em" }}>
          Start with what's most relevant to you
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACADEMY_AUDIENCE.map((a) => {
            const articles = published.filter((p) => p.audience === a.id || p.audience === "all");
            return (
              <Link
                key={a.id}
                href={`/academy?audience=${a.id}`}
                className="group block p-5 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-950 transition-all"
              >
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="font-black text-zinc-900 group-hover:text-white text-sm transition-colors">{a.label}</h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 mt-1 leading-relaxed transition-colors">{a.desc}</p>
                <p className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-500 mt-3 uppercase tracking-wide transition-colors">
                  {articles.length} guides →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured guides */}
      <section id="guides" className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Featured</p>
              <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.03em" }}>Start here</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/academy/${article.slug}`}
                className="group block bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-lg transition-all"
              >
                {/* Hero bar */}
                <div className="h-2 bg-gradient-to-r from-zinc-900 to-zinc-700" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl">{article.heroEmoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
                      {article.readingTime} min read
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">
                      {ACADEMY_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category}
                    </span>
                  </div>
                  <h3 className="font-black text-zinc-900 text-base leading-snug group-hover:text-violet-700 transition-colors" style={{ letterSpacing: "-0.02em" }}>
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="text-[10px] font-semibold text-zinc-400 capitalize bg-zinc-100 px-2 py-0.5 rounded-full">
                      {article.audience === "all" ? "Everyone" : article.audience}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Browse by topic</p>
        <h2 className="text-2xl font-black text-zinc-900 mb-8" style={{ letterSpacing: "-0.03em" }}>All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMY_CATEGORIES.map((cat) => {
            const count = published.filter((a) => a.category === cat.id).length;
            return (
              <div key={cat.id} className="flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:bg-zinc-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-xl flex-shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">{cat.label}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{cat.description}</p>
                  <p className="text-[10px] font-semibold text-zinc-400 mt-2">{count > 0 ? `${count} article${count !== 1 ? "s" : ""}` : "Coming soon"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All articles list */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black text-zinc-900 mb-8" style={{ letterSpacing: "-0.03em" }}>All guides</h2>
          <div className="space-y-3">
            {published.map((article) => (
              <Link
                key={article.slug}
                href={`/academy/${article.slug}`}
                className="group flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-2xl flex-shrink-0">{article.heroEmoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-700 transition-colors truncate">{article.title}</h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{article.excerpt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:block text-[10px] font-semibold text-zinc-400 capitalize bg-zinc-100 px-2 py-0.5 rounded-full">
                    {article.audience === "all" ? "All" : article.audience}
                  </span>
                  <span className="text-[10px] text-zinc-400">{article.readingTime}m</span>
                  <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-zinc-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Ready to start?</p>
          <h2 className="text-3xl font-black mb-4" style={{ letterSpacing: "-0.04em" }}>
            Put the knowledge into practice.
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Open your dashboard and build your first drop. Everything you just read is already built into the tools.
          </p>
          <Link
            href="/account?tab=drops"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            Open Drop Builder →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-zinc-400">© 2025 Halftone Labs</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Help Center</Link>
            <Link href="/account" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
