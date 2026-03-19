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
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <span
              className="text-base text-ds-dark"
              style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
            >
              Halftone Labs
            </span>
            <span className="hidden sm:block mx-3 w-px h-4 bg-black/10 self-center" />
            <span className="hidden sm:block text-[11px] font-bold tracking-[0.18em] text-ds-muted uppercase">
              Academy
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/academy" className="hidden sm:block text-sm font-semibold text-ds-dark">Academy</Link>
            <Link href="/help" className="hidden sm:block text-sm font-medium text-ds-body hover:text-ds-dark transition-colors">Help</Link>
            <Link
              href="/account"
              className="text-sm font-semibold bg-ds-dark text-white px-3 py-1.5 rounded-full hover:bg-ds-dark2 transition-colors whitespace-nowrap"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-black/[0.06] text-white overflow-hidden">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.rovoassembly.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F281507%2F600x338%2F7a44f9d1c8%2Fgarment-wash-gif.gif%2Fm%2F0x0%2F&w=1200&q=75"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-ds-darkest/75" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="ds-label text-white/30 mb-4 block">Halftone Academy</span>
            <h1
              className="text-4xl md:text-6xl leading-[1.02] mb-6"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-bold-dark">Learn how to build</span>
              <br />
              <span className="h-fade-dark">a merch operation</span>
              <br />
              <span className="h-fade-dark">that actually works.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              Strategic education for artists, managers, labels, and festivals. Not a manual. A curriculum built around how music commerce actually works.
            </p>
            <div className="flex items-center gap-3 mt-8 flex-wrap">
              <Link href="#audience" className="btn-brand">
                Find your path →
              </Link>
              <Link href="#guides" className="btn-outline-ds border-white/20 text-white/70 hover:border-white/40 hover:text-white">
                Browse all guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Audience selector */}
      <section id="audience" className="max-w-6xl mx-auto px-6 py-16">
        <span className="ds-label ds-label-brand mb-3 block">Who are you?</span>
        <h2
          className="text-2xl text-ds-dark mb-8"
          style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Start with what&apos;s most relevant to you
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACADEMY_AUDIENCE.map((a) => {
            const articles = published.filter((p) => p.audience === a.id || p.audience === "all");
            return (
              <Link
                key={a.id}
                href={`/academy?audience=${a.id}`}
                className="group block p-5 rounded-2xl border border-black/[0.06] hover:border-ds-dark hover:bg-ds-dark transition-all"
              >
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-ds-dark group-hover:text-white text-sm transition-colors">{a.label}</h3>
                <p className="text-xs text-ds-body group-hover:text-white/50 mt-1 leading-relaxed transition-colors">{a.desc}</p>
                <p className="text-[10px] font-bold text-ds-muted group-hover:text-white/30 mt-3 uppercase tracking-wide transition-colors">
                  {articles.length} guides →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured guides */}
      <section id="guides" className="border-t border-black/[0.06] bg-ds-light-gray py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="ds-label ds-label-brand mb-1 block">Featured</span>
              <h2
                className="text-2xl text-ds-dark"
                style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
              >
                Start here
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/academy/${article.slug}`}
                className="group block ds-card overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-brand to-brand-dark" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl">{article.heroEmoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted bg-black/[0.04] px-2 py-1 rounded-full">
                      {article.readingTime} min read
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
                      {ACADEMY_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-ds-dark text-base leading-snug group-hover:text-brand transition-colors"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-xs text-ds-body mt-2 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="text-[10px] font-semibold text-ds-muted capitalize bg-black/[0.04] px-2 py-0.5 rounded-full">
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
        <span className="ds-label ds-label-brand mb-1 block">Browse by topic</span>
        <h2
          className="text-2xl text-ds-dark mb-8"
          style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          All categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMY_CATEGORIES.map((cat) => {
            const count = published.filter((a) => a.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="flex items-start gap-4 p-4 rounded-2xl border border-black/[0.06] bg-white hover:border-brand/20 hover:bg-brand/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-xl flex-shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ds-dark text-sm">{cat.label}</h3>
                  <p className="text-xs text-ds-body mt-0.5 leading-snug">{cat.description}</p>
                  <p className="text-[10px] font-semibold text-ds-muted mt-2">
                    {count > 0 ? `${count} article${count !== 1 ? "s" : ""}` : "Coming soon"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All articles list */}
      <section className="border-t border-black/[0.06] bg-ds-light-gray py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-2xl text-ds-dark mb-8"
            style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            All guides
          </h2>
          <div className="space-y-3">
            {published.map((article) => (
              <Link
                key={article.slug}
                href={`/academy/${article.slug}`}
                className="group flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-black/[0.06] hover:border-brand/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-2xl flex-shrink-0">{article.heroEmoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ds-dark group-hover:text-brand transition-colors truncate">{article.title}</h3>
                    <p className="text-xs text-ds-body truncate mt-0.5">{article.excerpt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:block text-[10px] font-semibold text-ds-muted capitalize bg-black/[0.04] px-2 py-0.5 rounded-full">
                    {article.audience === "all" ? "All" : article.audience}
                  </span>
                  <span className="text-[10px] text-ds-muted">{article.readingTime}m</span>
                  <svg
                    className="w-4 h-4 text-ds-muted group-hover:text-brand transition-colors"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-ds-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10">
            <span className="ds-label text-white/30 mb-3 block">Ready to start?</span>
            <h2
              className="text-3xl md:text-4xl text-white mb-4"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              <span className="h-fade-dark">Put the knowledge </span>
              <span className="h-bold-dark">into practice.</span>
            </h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">
              Open your dashboard and build your first drop. Everything you just read is already built into the tools.
            </p>
            <Link href="/account?tab=drops" className="btn-brand">
              Open Drop Builder →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-ds-muted">© 2025 Halftone Labs</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-xs text-ds-muted hover:text-ds-dark transition-colors">Help Center</Link>
            <Link href="/account" className="text-xs text-ds-muted hover:text-ds-dark transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
