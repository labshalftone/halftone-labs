import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "Products — Halftone Labs",
  description:
    "Premium cotton blanks built for custom DTG print. Regular, Oversized (Single Jersey & French Terry), Baby Tee. Design in the studio, we handle the rest.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <span className="ds-label ds-label-brand mb-4 block">Our Products</span>
          <h1
            className="text-5xl lg:text-6xl text-ds-dark leading-[1.02] mb-5"
            style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
          >
            <span className="h-fade">Blanks built for </span>
            <span className="h-bold">custom print.</span>
          </h1>
          <p className="text-ds-body text-[15px] leading-relaxed max-w-lg">
            Every piece is chosen for its printability, quality, and feel. Pick your blank,
            design in the studio — we handle the rest.
          </p>
        </div>

        {/* ── Product grid ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => {
              const firstColor = product.colors[0];
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.06] hover:border-brand-20 hover:shadow-xl transition-all duration-300">
                    {/* Product image */}
                    <div
                      className="aspect-[3/4] relative overflow-hidden"
                      style={{
                        background: firstColor.hex === "#FFFFFF" ? "#efefed" : "#e8e4df",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={firstColor.mockupFront}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.tag && (
                        <span className="absolute top-3 left-3 rounded-full bg-brand text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-widest shadow-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2
                        className="font-semibold text-ds-dark text-[17px] leading-tight mb-1"
                        style={{ letterSpacing: "-0.03em" }}
                      >
                        {product.name}
                      </h2>
                      <p className="text-[11px] text-ds-muted mb-3">{product.gsm}</p>

                      {/* Color dots */}
                      <div className="flex items-center gap-1.5 mb-4">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            title={c.name}
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{
                              background: c.hex,
                              border: c.hex === "#FFFFFF" ? "1.5px solid #d1d5db" : "none",
                            }}
                          />
                        ))}
                        <span className="text-[11px] text-ds-muted ml-1">
                          {product.colors.length} colour{product.colors.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ds-dark">From ₹{product.blankPrice}</p>
                          <p className="text-[11px] text-ds-muted">blank · print from ₹120</p>
                        </div>
                        <span className="text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom CTA strip ─────────────────────────────────────────────── */}
        <div className="border-t border-black/[0.06] bg-ds-dark">
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p
                className="text-xl text-white"
                style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
              >
                Ready to create?
              </p>
              <p className="text-sm text-white/50 mt-1">
                Upload your artwork and see it on your tee in seconds.
              </p>
            </div>
            <Link href="/studio" className="btn-brand whitespace-nowrap">
              Open Studio →
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
