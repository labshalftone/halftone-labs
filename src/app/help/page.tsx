"use client";

import { useState } from "react";
import Link from "next/link";
import { HELP_ARTICLES, HELP_CATEGORIES, searchHelp } from "@/content/help";

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const results = query.trim().length > 1 ? searchHelp(query) : [];
  const published = HELP_ARTICLES.filter((a) => a.status === "published");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-base text-zinc-900" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</span>
            <span className="hidden sm:block mx-3 w-px h-4 bg-zinc-300 self-center" />
            <span className="hidden sm:block text-[11px] font-bold tracking-[0.18em] text-zinc-400 uppercase">Help</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/academy" className="hidden sm:block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Academy</Link>
            <Link href="/help" className="hidden sm:block text-sm font-semibold text-zinc-900">Help</Link>
            <Link href="/account" className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors whitespace-nowrap">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero + search */}
      <section className="bg-zinc-50 border-b border-zinc-100 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3" style={{ letterSpacing: "-0.04em" }}>
            How can we help?
          </h1>
          <p className="text-zinc-500 text-base mb-8">
            Search our guides or browse by topic below.
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Search results */}
      {query.trim().length > 1 && (
        <section className="max-w-3xl mx-auto px-6 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
            {results.length > 0 ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : `No results for "${query}"`}
          </p>
          {results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-zinc-500 text-sm mb-2">Can&apos;t find what you&apos;re looking for?</p>
              <a href="mailto:support@halftone.co" className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                Contact support →
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((a) => (
                <Link
                  key={a.slug}
                  href={`/help/${a.slug}`}
                  className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-sm flex-shrink-0">
                    {HELP_CATEGORIES.find((c) => c.id === a.category)?.icon ?? "📄"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-700 transition-colors">{a.title}</h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{a.excerpt}</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories grid */}
      {query.trim().length <= 1 && (
        <>
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-lg font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.02em" }}>Browse by topic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HELP_CATEGORIES.map((cat) => {
                const articles = published.filter((a) => a.category === cat.id);
                return (
                  <div key={cat.id} className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-lg shadow-sm">
                        {cat.icon}
                      </div>
                      <h3 className="font-bold text-zinc-900 text-sm">{cat.label}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{cat.description}</p>
                    <div className="space-y-1.5">
                      {articles.slice(0, 3).map((a) => (
                        <Link
                          key={a.slug}
                          href={`/help/${a.slug}`}
                          className="block text-xs text-zinc-600 hover:text-violet-700 font-medium truncate transition-colors"
                        >
                          → {a.title}
                        </Link>
                      ))}
                      {articles.length === 0 && (
                        <p className="text-xs text-zinc-400 italic">Coming soon</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Popular articles */}
          <section className="border-t border-zinc-100 bg-zinc-50 py-12">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-lg font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.02em" }}>Most helpful articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {published.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/help/${a.slug}`}
                    className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-sm flex-shrink-0">
                      {HELP_CATEGORIES.find((c) => c.id === a.category)?.icon ?? "📄"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-violet-700 transition-colors truncate">{a.title}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">{HELP_CATEGORIES.find((c) => c.id === a.category)?.label}</p>
                    </div>
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="max-w-5xl mx-auto px-6 py-12">
            <div className="bg-zinc-950 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="font-black text-white text-lg" style={{ letterSpacing: "-0.02em" }}>Still need help?</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Can&apos;t find what you&apos;re looking for? Our team responds within a few hours.
                </p>
              </div>
              <a
                href="mailto:support@halftone.co"
                className="flex-shrink-0 px-5 py-2.5 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors"
              >
                Email support →
              </a>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
