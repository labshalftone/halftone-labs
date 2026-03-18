import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ACADEMY_ARTICLES,
  ACADEMY_CATEGORIES,
  getArticle,
} from "@/content/academy";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ACADEMY_ARTICLES.filter((a) => a.status === "published").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — Halftone Academy`,
    description: article.excerpt,
  };
}

export default async function AcademyArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ACADEMY_ARTICLES.filter(
    (a) => a.status === "published" && (article.relatedSlugs ?? []).includes(a.slug)
  );

  const catLabel = ACADEMY_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-base text-zinc-900" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</span>
            <span className="mx-3 w-px h-4 bg-zinc-300 self-center" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-zinc-400 uppercase">Academy</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/academy" className="text-sm font-semibold text-zinc-900">Academy</Link>
            <Link href="/help" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Help</Link>
            <Link href="/account" className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors whitespace-nowrap">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/academy" className="hover:text-zinc-700 transition-colors">Academy</Link>
          <span>/</span>
          <span className="text-zinc-600">{catLabel}</span>
        </div>
      </div>

      {/* Article header */}
      <header className="max-w-3xl mx-auto px-6 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
            {catLabel}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full capitalize">
            {article.audience === "all" ? "Everyone" : article.audience}
          </span>
          <span className="text-[10px] text-zinc-400">{article.readingTime} min read</span>
        </div>

        <div className="text-5xl mb-4">{article.heroEmoji}</div>

        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-4" style={{ letterSpacing: "-0.04em" }}>
          {article.title}
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed">{article.excerpt}</p>

        <div className="flex items-center gap-2 mt-5 flex-wrap">
          {article.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="border-t border-zinc-100" />

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div
          className="prose prose-zinc prose-sm max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-900
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-zinc-600 prose-p:leading-relaxed
            prose-li:text-zinc-600 prose-li:leading-relaxed
            prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-900 prose-strong:font-bold
            prose-code:text-xs prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-700
            prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:text-xs
            prose-table:text-sm
            prose-th:text-zinc-700 prose-th:font-bold prose-th:bg-zinc-50 prose-th:text-xs
            prose-td:text-zinc-600 prose-td:text-xs
            prose-ol:text-zinc-600
            prose-ul:text-zinc-600"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </article>

      {/* CTA block */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-zinc-950 text-white rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-black text-lg" style={{ letterSpacing: "-0.02em" }}>Ready to put this into practice?</p>
            <p className="text-zinc-400 text-sm mt-1">{article.excerpt}</p>
          </div>
          <Link
            href={article.cta.href}
            className="flex-shrink-0 px-5 py-2.5 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors"
          >
            {article.cta.text} →
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-zinc-100 bg-zinc-50 py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-base font-black text-zinc-900 mb-5" style={{ letterSpacing: "-0.02em" }}>Related guides</h2>
            <div className="space-y-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/academy/${r.slug}`}
                  className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all"
                >
                  <span className="text-2xl flex-shrink-0">{r.heroEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-700 transition-colors">{r.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{r.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] text-zinc-400">{r.readingTime}m</span>
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 py-8 border-t border-zinc-100">
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Academy
        </Link>
      </div>
    </div>
  );
}
