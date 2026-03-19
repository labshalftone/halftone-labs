"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SizeGuide, { type ProductKey } from "@/components/SizeGuide";
import { useCurrency } from "@/lib/currency-context";
import { PRODUCTS } from "@/lib/products";

// ─── SVG zone constants (mirror from studio page) ─────────────────────────────
const ZONE_PCT = { x: 0.28, y: 0.22, w: 0.44, h: 0.44 };

// ─── TEE MOCKUP ───────────────────────────────────────────────────────────────

function TeeMockup({ color, isOversized }: { color: string; isOversized?: boolean }) {
  const isDark = ["#111111", "#1B2A4A", "#2355C0", "#C0392B", "#6B2D2D"].includes(color);
  const body = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";
  return (
    <svg viewBox="0 0 200 230" className="w-full h-full" style={{ maxHeight: 420 }}>
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.07)" />
      <path
        d={body}
        fill={color}
        stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)"}
        strokeWidth="1.5"
      />
      <path
        d={collar}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)"}
        strokeWidth="1.5"
      />
      <rect
        x={200 * ZONE_PCT.x}
        y={230 * ZONE_PCT.y}
        width={200 * ZONE_PCT.w}
        height={230 * ZONE_PCT.h}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)"}
        strokeWidth="0.7"
        strokeDasharray="3 3"
        rx="2"
      />
    </svg>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const router = useRouter();
  const { fmt } = useCurrency();

  const product = PRODUCTS.find((p) => p.id === productId);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [photoSide, setPhotoSide] = useState<"front" | "back">("front");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <Navbar />
        <p className="text-2xl font-bold text-ds-body mt-24">Product not found.</p>
        <Link href="/studio" className="text-brand underline underline-offset-2">
          Back to Studio
        </Link>
      </div>
    );
  }

  const selectedColor = product.colors[selectedColorIdx];
  const isOversized = product.id.includes("oversized");

  return (
    <>
      <Navbar />
      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultTab={product.sizeGuideKey as ProductKey}
        showBranding={false}
      />

      <div className="min-h-screen bg-white pt-16">
        {/* ── Breadcrumb ── */}
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-0 flex items-center gap-2 text-sm text-ds-muted">
          <Link href="/studio" className="hover:text-ds-body transition-colors">
            Studio
          </Link>
          <span>/</span>
          <span className="text-ds-body font-medium">{product.name}</span>
        </div>

        {/* ── Two-column hero ── */}
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: mockup */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {/* Main image */}
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{ background: selectedColor.hex === "#FFFFFF" ? "#efefed" : "#f0ede8" }}
            >
              {selectedColor.mockupFront ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSide === "front" ? selectedColor.mockupFront : (selectedColor.mockupBack ?? selectedColor.mockupFront)}
                  alt={`${product.name} in ${selectedColor.name} — ${photoSide}`}
                  className="w-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="p-8">
                  <TeeMockup color={selectedColor.hex} isOversized={isOversized} />
                </div>
              )}
            </div>

            {/* Front / Back toggle */}
            {selectedColor.mockupBack && (
              <div className="flex gap-2">
                {(["front", "back"] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => setPhotoSide(side)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      photoSide === side
                        ? "bg-ds-dark text-white"
                        : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            )}

            {/* Color swatches mobile */}
            <div className="flex items-center gap-2 flex-wrap md:hidden">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => { setSelectedColorIdx(i); setPhotoSide("front"); }}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    background: c.hex,
                    border: i === selectedColorIdx ? "2.5px solid #f97316" : c.hex === "#FFFFFF" ? "1.5px solid #d1d5db" : "2.5px solid transparent",
                    transform: i === selectedColorIdx ? "scale(1.18)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="flex flex-col gap-5"
          >
            {/* Tag */}
            {product.tag && (
              <span className="inline-block self-start rounded-full bg-orange-100 text-brand-dark text-xs font-semibold px-3 py-1 tracking-wide uppercase">
                {product.tag}
              </span>
            )}

            {/* Name + GSM */}
            <div>
              <h1 className="text-4xl font-semibold text-ds-dark leading-tight">{product.name}</h1>
              <span className="inline-block mt-2 text-xs font-semibold tracking-widest uppercase text-ds-muted border border-black/[0.06] rounded px-2 py-0.5">
                {product.gsm}
              </span>
            </div>

            {/* Description */}
            <p className="text-ds-body leading-relaxed text-[15px]">{product.description}</p>

            {/* Price */}
            <p className="text-2xl font-bold text-ds-dark">
              From {fmt(product.blankPrice)}{" "}
              <span className="text-base font-normal text-ds-muted">+ print</span>
            </p>

            <hr className="border-black/[0.06]" />

            {/* Color picker */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ds-muted mb-2">
                Color — <span className="text-ds-body normal-case font-medium">{selectedColor.name}</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => { setSelectedColorIdx(i); setPhotoSide("front"); }}
                    className="w-8 h-8 rounded-full transition-transform"
                    style={{
                      background: c.hex,
                      border:
                        i === selectedColorIdx
                          ? "2.5px solid #f97316"
                          : c.hex === "#FFFFFF"
                          ? "1.5px solid #d1d5db"
                          : "2.5px solid transparent",
                      transform: i === selectedColorIdx ? "scale(1.18)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <hr className="border-black/[0.06]" />

            {/* Sizes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ds-muted mb-2">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-black/[0.06] px-3 py-1 text-xs font-semibold text-ds-body bg-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="mt-3 text-sm text-brand hover:text-brand-dark font-medium underline underline-offset-2 transition-colors"
              >
                Size Guide
              </button>
            </div>

            <hr className="border-black/[0.06]" />

            {/* CTA */}
            <button
              onClick={() => router.push("/studio")}
              className="w-full rounded-full bg-ds-dark text-white font-bold text-base py-4 hover:bg-ds-dark2 transition-colors"
            >
              Customise this tee →
            </button>

            <p className="text-center text-sm text-ds-muted">
              or{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                get a bulk quote
              </a>
            </p>
          </motion.div>
        </div>

        {/* ── Specs section ── */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ds-muted mb-6">
            Product specs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Fabric", value: product.spec },
              { label: "Weight", value: product.gsm },
              { label: "Fit", value: product.fit },
              { label: "Origin", value: "Crafted in India" },
              { label: "Print method", value: "DTG (recommended) · DTF available" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white border border-black/[0.06] px-5 py-4 flex flex-col gap-1"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ds-muted">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-ds-body">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bulk pricing section ── */}
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-black/[0.06]">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ds-muted mb-2">
            Bulk pricing
          </h2>
          <p className="text-sm text-ds-muted mb-6">
            MOQ 50 units. Email{" "}
            <a
              href="mailto:hello@halftonelabs.in"
              className="text-brand hover:text-brand-dark transition-colors"
            >
              hello@halftonelabs.in
            </a>{" "}
            for bulk quotes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {product.bulkTiers.map((tier) => (
              <div
                key={tier.qty}
                className="rounded-xl bg-white border border-black/[0.06] px-6 py-5 flex flex-col gap-1"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-ds-muted">
                  {tier.qty} units
                </p>
                <p className="text-2xl font-semibold text-ds-dark">₹{tier.priceInr}</p>
                <p className="text-xs text-ds-muted">blank per piece</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Print techniques section ── */}
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-black/[0.06] mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ds-muted mb-2">
            Print techniques
          </h2>
          <p className="text-sm text-ds-muted mb-6">We&apos;ve perfected DTG — it&apos;s our standard for a reason.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DTG card — recommended */}
            <div className="rounded-xl bg-ds-dark text-white px-6 py-6 flex flex-col gap-3 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-[0.6rem] font-semibold uppercase tracking-widest bg-brand text-white px-2 py-0.5 rounded-full">Recommended</span>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white text-ds-dark text-xs font-semibold px-3 py-1 uppercase tracking-wide">
                  DTG
                </span>
                <span className="text-sm font-semibold text-zinc-200">Direct to Garment</span>
              </div>
              <p className="text-sm text-ds-muted leading-relaxed">
                Ink printed directly into the fabric — breathable, soft, and vibrant. Our signature technique refined over thousands of prints. Feels like it was always part of the garment.
              </p>
              <ul className="text-xs text-ds-muted space-y-1">
                {["Breathable & soft hand-feel", "Vibrant colour, photographic detail", "Works across all garment colours", "Improves with every wash"].map(p => (
                  <li key={p} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* DTF card */}
            <div className="rounded-xl bg-white border border-black/[0.06] px-6 py-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-black/[0.05] text-ds-body text-xs font-bold px-3 py-1 uppercase tracking-wide">
                  DTF
                </span>
                <span className="text-sm font-semibold text-ds-body">Direct to Film</span>
              </div>
              <p className="text-sm text-ds-muted leading-relaxed">
                A film-transfer option available on request. Produces a slightly raised, textured finish — suited to bold graphics with thick outlines.
              </p>
              <ul className="text-xs text-ds-muted space-y-1">
                {["Slightly raised, textured finish", "Suits bold graphic prints", "Available on request"].map(p => (
                  <li key={p} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-[0.65rem] text-ds-muted pt-2 border-t border-black/[0.06]">
                Not sure? Go DTG — you won&apos;t regret it.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
