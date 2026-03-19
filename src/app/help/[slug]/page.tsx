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
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-base text-ds-dark" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>Halftone Labs</span>
            <span className="hidden sm:block mx-3 w-px h-4 bg-zinc-300 self-center" />
            <span className="hidden sm:block text-[11px] font-bold tracking-[0.18em] text-ds-muted uppercase">Help</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/academy" className="hidden sm:block text-sm font-medium text-ds-body hover:text-ds-dark transition-colors">Academy</Link>
            <Link href="/help" className="hidden sm:block text-sm font-semibold text-ds-dark">Help</Link>
            <Link href="/account" className="text-sm font-semibold bg-ds-dark text-white px-3 py-1.5 rounded-full hover:bg-ds-dark2 transition-colors whitespace-nowrap">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-ds-muted pt-6">
          <Link href="/help" className="hover:text-ds-body transition-colors">Help Center</Link>
          <span>/</span>
          <Link href="/help" className="hover:text-ds-body transition-colors">{category?.label ?? article.category}</Link>
          <span>/</span>
          <span className="text-ds-body truncate">{article.title}</span>
        </div>

        {/* Header */}
        <header className="pt-8 pb-8 border-b border-black/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{category?.icon ?? "📄"}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-body">{category?.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-ds-dark leading-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
            {article.title}
          </h1>
          <p className="text-ds-body text-sm leading-relaxed">{article.excerpt}</p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold text-ds-body bg-black/[0.05] px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Body */}
        <article className="py-10">
          <div
            className="prose prose-zinc prose-sm max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ds-dark
              prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-sm prose-h3:mt-7 prose-h3:mb-2
              prose-p:text-ds-body prose-p:leading-relaxed prose-p:text-sm
              prose-li:text-ds-body prose-li:leading-relaxed prose-li:text-sm
              prose-a:text-brand prose-a:no-underline hover:prose-a:underline
              prose-strong:text-ds-dark prose-strong:font-semibold
              prose-code:text-xs prose-code:bg-black/[0.05] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-ds-body
              prose-pre:bg-ds-darkest prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:text-xs prose-pre:overflow-x-auto
              prose-ol:text-ds-body prose-ol:text-sm
              prose-ul:text-ds-body prose-ul:text-sm
              prose-table:text-xs
              prose-th:text-ds-body prose-th:font-semibold prose-th:bg-ds-light-gray
              prose-td:text-ds-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </article>

        {/* Still need help */}
        <div className="border border-black/[0.06] rounded-2xl p-5 bg-ds-light-gray mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ds-dark">Was this helpful?</p>
            <p className="text-xs text-ds-body mt-0.5">If you&apos;re still stuck, our team can help.</p>
          </div>
          <a
            href="mailto:support@halftone.co"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-ds-dark text-white rounded-xl text-xs font-semibold hover:bg-ds-dark2 transition-colors"
          >
            Contact support →
          </a>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="border-t border-black/[0.06] py-8">
            <h2 className="text-sm font-semibold text-ds-dark mb-4">Related articles</h2>
            <div className="space-y-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/help/${r.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-black/[0.06] hover:border-zinc-300 hover:bg-ds-light-gray transition-all"
                >
                  <span className="text-base flex-shrink-0">
                    {HELP_CATEGORIES.find((c) => c.id === r.category)?.icon ?? "📄"}
                  </span>
                  <span className="text-sm font-medium text-ds-body group-hover:text-brand transition-colors">{r.title}</span>
                  <svg className="w-4 h-4 text-ds-muted group-hover:text-violet-500 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className="inline-flex items-center gap-2 text-sm text-ds-body hover:text-ds-dark transition-colors font-medium"
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
