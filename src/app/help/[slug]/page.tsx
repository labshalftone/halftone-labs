import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HELP_ARTICLES, HELP_CATEGORIES, getHelpArticle } from "@/content/help";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return HELP_ARTICLES.filter((a) => a.status === "published").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — Halftone Help`,
    description: article.excerpt,
  };
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) notFound();

  const related = HELP_ARTICLES.filter(
    (a) => a.status === "published" && (article.relatedSlugs ?? []).includes(a.slug)
  );

  const category = HELP_CATEGORIES.find((c) => c.id === article.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-base text-zinc-900" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</span>
            <span className="mx-3 w-px h-4 bg-zinc-300 self-center" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-zinc-400 uppercase">Help</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/academy" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Academy</Link>
            <Link href="/help" className="text-sm font-semibold text-zinc-900">Help</Link>
            <Link href="/account" className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 pt-6">
          <Link href="/help" className="hover:text-zinc-700 transition-colors">Help Center</Link>
          <span>/</span>
          <Link href="/help" className="hover:text-zinc-700 transition-colors">{category?.label ?? article.category}</Link>
          <span>/</span>
          <span className="text-zinc-600 truncate">{article.title}</span>
        </div>

        {/* Header */}
        <header className="pt-8 pb-8 border-b border-zinc-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{category?.icon ?? "📄"}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{category?.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
            {article.title}
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">{article.excerpt}</p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Body */}
        <article className="py-10">
          <div
            className="prose prose-zinc prose-sm max-w-none
              prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-900
              prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-sm prose-h3:mt-7 prose-h3:mb-2
              prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-sm
              prose-li:text-zinc-600 prose-li:leading-relaxed prose-li:text-sm
              prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-800 prose-strong:font-semibold
              prose-code:text-xs prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-700
              prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:text-xs prose-pre:overflow-x-auto
              prose-ol:text-zinc-600 prose-ol:text-sm
              prose-ul:text-zinc-600 prose-ul:text-sm
              prose-table:text-xs
              prose-th:text-zinc-700 prose-th:font-semibold prose-th:bg-zinc-50
              prose-td:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </article>

        {/* Still need help */}
        <div className="border border-zinc-100 rounded-2xl p-5 bg-zinc-50 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-zinc-800">Was this helpful?</p>
            <p className="text-xs text-zinc-500 mt-0.5">If you&apos;re still stuck, our team can help.</p>
          </div>
          <a
            href="mailto:support@halftone.co"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-700 transition-colors"
          >
            Contact support →
          </a>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="border-t border-zinc-100 py-8">
            <h2 className="text-sm font-black text-zinc-900 mb-4">Related articles</h2>
            <div className="space-y-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/help/${r.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                >
                  <span className="text-base flex-shrink-0">
                    {HELP_CATEGORIES.find((c) => c.id === r.category)?.icon ?? "📄"}
                  </span>
                  <span className="text-sm font-medium text-zinc-700 group-hover:text-violet-700 transition-colors">{r.title}</span>
                  <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-500 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="pb-12">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
