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
      <div className="min-h-screen bg-[#f8f7f5] pt-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
            Our Products
          </p>
          <h1
            className="text-5xl lg:text-6xl font-black text-stone-900 leading-[1.02] mb-5"
            style={{ letterSpacing: "-0.04em" }}
          >
            Blanks built for<br className="hidden sm:block" /> custom print.
          </h1>
          <p className="text-stone-500 text-[15px] leading-relaxed max-w-lg">
            Every piece is chosen for its printability, quality, and feel. Pick your blank,
            design in the studio — we handle the rest.
          </p>
        </div>

        {/* ── Product grid ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => {
              const firstColor = product.colors[0];
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="rounded-3xl overflow-hidden bg-white border border-stone-100 hover:border-stone-200 hover:shadow-xl transition-all duration-300">
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
                        <span className="absolute top-3 left-3 rounded-full bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest shadow-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2
                        className="font-black text-stone-900 text-[17px] leading-tight mb-1"
                        style={{ letterSpacing: "-0.03em" }}
                      >
                        {product.name}
                      </h2>
                      <p className="text-[11px] text-stone-400 mb-3">{product.gsm}</p>

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
                        <span className="text-[11px] text-stone-400 ml-1">
                          {product.colors.length} colour{product.colors.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-stone-900">From ₹{product.blankPrice}</p>
                          <p className="text-[11px] text-stone-400">blank · print from ₹120</p>
                        </div>
                        <span
                          className="text-xs font-black text-orange-500 group-hover:translate-x-1 transition-transform"
                        >
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
        <div className="border-t border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p
                className="text-xl font-black text-stone-900"
                style={{ letterSpacing: "-0.03em" }}
              >
                Ready to create?
              </p>
              <p className="text-sm text-stone-400 mt-1">
                Upload your artwork and see it on your tee in seconds.
              </p>
            </div>
            <Link
              href="/studio"
              className="rounded-2xl bg-stone-900 text-white font-black text-sm px-8 py-4 hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              Open Studio →
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
