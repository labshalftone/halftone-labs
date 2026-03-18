"use client";

import Link from "next/link";

type Props = {
  href: string;       // /academy/slug or /help/slug
  label: string;      // short CTA text
  type?: "academy" | "help";
  size?: "sm" | "xs";
  className?: string;
};

/**
 * Contextual education nudge — drop this anywhere in the product
 * to surface an Academy guide or Help article inline.
 */
export default function LearnLink({ href, label, type = "academy", size = "sm", className = "" }: Props) {
  const isAcademy = type === "academy";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
        size === "xs" ? "text-[10px] px-2 py-0.5 rounded-full" : "text-xs px-2.5 py-1 rounded-full"
      } ${
        isAcademy
          ? "bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
      } ${className}`}
    >
      {isAcademy ? (
        <svg className={size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ) : (
        <svg className={size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {label}
    </Link>
  );
}
