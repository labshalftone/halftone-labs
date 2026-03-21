"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    heading: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Custom T-Shirts", href: "/products/t-shirts" },
      { label: "Custom Hoodies", href: "/products/hoodies" },
      { label: "Custom Caps", href: "/products/caps" },
      { label: "Custom Tote Bags", href: "/products/tote-bags" },
      { label: "Custom Phone Cases", href: "/products/phone-cases" },
      { label: "Custom Posters", href: "/products/posters" },
      { label: "Custom Stickers", href: "/products/stickers" },
      { label: "Bulk Orders", href: "/bulk-orders" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Studio", href: "/studio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Track Order", href: "/track" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Academy", href: "/academy" },
      { label: "Journal", href: "/journal" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Press & Media", href: "/press" },
      { label: "Quality Promise", href: "/quality" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Dashboard", href: "/account" },
      { label: "Onboarding", href: "/onboarding" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return Policy", href: "/return-policy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        <section className="pt-36 pb-24 max-w-[1200px] mx-auto px-6">
          <span className="ds-label text-white/30 block mb-6">Sitemap</span>
          <h1
            className="text-4xl md:text-5xl leading-[0.92] mb-14"
            style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
          >
            All pages
          </h1>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {SECTIONS.map((s) => (
              <div key={s.heading}>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/20 mb-4 font-mono">
                  {s.heading}
                </p>
                <ul className="space-y-2">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="text-sm text-white/45 hover:text-white transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
