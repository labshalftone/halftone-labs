import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    heading: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Regular Tee", href: "/products/regular-tee" },
      { label: "Oversized Tee", href: "/products/oversized-tee-sj" },
      { label: "Baby Tee", href: "/products/baby-tee" },
      { label: "Hoodie", href: "/products/hoodie" },
      { label: "Waffle Tee", href: "/products/waffle-tee" },
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
      <main className="min-h-screen bg-white">
        <section className="max-w-6xl mx-auto px-6 pt-36 pb-24">
          <span className="ds-label ds-label-brand mb-6 block">Sitemap</span>
          <h1
            className="text-4xl md:text-5xl text-ds-dark leading-[0.92] mb-14"
            style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
          >
            All pages
          </h1>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {SECTIONS.map((s) => (
              <div key={s.heading}>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ds-muted mb-4 font-mono">
                  {s.heading}
                </p>
                <ul className="space-y-2">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-sm text-ds-body hover:text-ds-dark transition-colors">
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
