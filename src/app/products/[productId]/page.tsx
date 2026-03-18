"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SizeGuide, { type ProductKey } from "@/components/SizeGuide";
import { PRODUCTS, PRINT_TIERS } from "@/lib/products";

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone-400 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-stone-500 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Spec row ─────────────────────────────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-stone-400 flex-shrink-0">{label}</span>
      <span className="text-stone-700 font-medium text-right">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const router = useRouter();

  const product = PRODUCTS.find((p) => p.id === productId);

  const [colorIdx, setColorIdx] = useState(0);
  const [photoSide, setPhotoSide] = useState<"front" | "back">("front");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-xl font-bold text-stone-700 mt-24">Product not found.</p>
        <Link href="/products" className="text-sm font-semibold text-orange-500 hover:underline">
          ← All Products
        </Link>
      </div>
    );
  }

  const color = product.colors[colorIdx];
  const imgSrc = photoSide === "front"
    ? color.mockupFront
    : (color.mockupBack ?? color.mockupFront);

  const bgTint = color.hex === "#FFFFFF" ? "#efefed" : "#e8e4df";
  const otherProducts = PRODUCTS.filter((p) => p.id !== productId);

  return (
    <>
      <Navbar />
      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultTab={product.sizeGuideKey as ProductKey}
        showBranding={false}
      />

      <div className="min-h-screen bg-[#f8f7f5] pt-16">

        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pt-6 flex items-center gap-2 text-xs text-stone-400">
          <Link href="/products" className="hover:text-stone-700 transition-colors font-medium">
            Products
          </Link>
          <span>/</span>
          <span className="text-stone-600">{product.name}</span>
          <span className="text-stone-300">—</span>
          <span className="text-stone-400">{product.gsm}</span>
        </div>

        {/* ── Two-column hero ───────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-16 items-start">

          {/* LEFT: Image gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            {/* Main image */}
            <motion.div
              key={`${colorIdx}-${photoSide}`}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full rounded-3xl overflow-hidden"
              style={{ background: bgTint }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={`${product.name} ${color.name} ${photoSide}`}
                className="w-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 rounded-full bg-orange-500 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow">
                  {product.tag}
                </span>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {(["front", "back"] as const).map((side) => {
                const thumb = side === "front" ? color.mockupFront : color.mockupBack;
                if (!thumb) return null;
                return (
                  <button
                    key={side}
                    onClick={() => setPhotoSide(side)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      photoSide === side
                        ? "border-stone-900 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                    style={{ background: bgTint }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt={side} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 text-center text-[9px] font-bold text-stone-500 capitalize bg-white/70 py-0.5">
                      {side}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: sticky info panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="lg:sticky lg:top-24 flex flex-col"
          >
            {/* Name + GSM */}
            <h1
              className="text-[2.75rem] font-black text-stone-900 leading-[1.05] mb-2"
              style={{ letterSpacing: "-0.04em" }}
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400 border border-stone-200 rounded px-2 py-0.5">
                {product.gsm}
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400 border border-stone-200 rounded px-2 py-0.5">
                {product.spec.split(",")[0]}
              </span>
            </div>

            {/* Price */}
            <p className="text-2xl font-black text-stone-900 mb-1">
              From ₹{product.blankPrice}
              <span className="text-sm font-normal text-stone-400 ml-2">
                · print from ₹{PRINT_TIERS[0].price}
              </span>
            </p>

            {/* Description */}
            <p className="text-stone-500 text-[14px] leading-relaxed mt-3 mb-6">
              {product.description}
            </p>

            <hr className="border-stone-200 mb-5" />

            {/* Color picker */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2.5">
                Colour —{" "}
                <span className="text-stone-700 normal-case font-semibold tracking-normal">{color.name}</span>
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => { setColorIdx(i); setPhotoSide("front"); }}
                    className="w-8 h-8 rounded-full transition-all duration-200"
                    style={{
                      background: c.hex,
                      outline: i === colorIdx ? "2.5px solid #f97316" : "2.5px solid transparent",
                      outlineOffset: "2px",
                      border: c.hex === "#FFFFFF" ? "1.5px solid #d1d5db" : "none",
                      transform: i === colorIdx ? "scale(1.18)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Available Sizes</p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/studio")}
              className="w-full rounded-2xl bg-stone-900 text-white font-black text-[15px] py-4 hover:bg-zinc-700 transition-colors mb-2.5"
            >
              Customise in Studio →
            </button>
            <p className="text-center text-xs text-stone-400 mb-6">
              Need lots?{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-orange-500 hover:text-orange-600 transition-colors font-semibold"
              >
                Get a bulk quote
              </a>
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mb-6">
              {[
                { icon: "📦", text: "Ships in 5–7 business days" },
                { icon: "🎨", text: "DTG printed · made to order" },
                { icon: "🇮🇳", text: "Crafted in India" },
                { icon: "↩️", text: "Returns within 7 days" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-stone-400">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <hr className="border-stone-200" />

            {/* Accordions */}
            <Accordion title="Fabric & Construction" defaultOpen>
              <div className="flex flex-col">
                <SpecRow label="Fabric" value={product.spec} />
                <SpecRow label="Weight" value={product.gsm} />
                <SpecRow label="Fit" value={product.fit} />
                <SpecRow label="Origin" value="Crafted in India" />
                <SpecRow label="Finishing" value="Pre-shrunk · anti-pilling" />
              </div>
            </Accordion>

            <Accordion title="Print Pricing">
              <div className="flex flex-col gap-1.5 mb-3">
                {PRINT_TIERS.map((t) => (
                  <div key={t.label} className="flex justify-between">
                    <span className="text-stone-400">{t.label}</span>
                    <span className="text-stone-700 font-semibold">₹{t.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-stone-400 text-xs">
                Per-side pricing. DTG standard. Prices include pre-treatment.
              </p>
            </Accordion>

            <Accordion title="Bulk Pricing">
              <div className="flex flex-col gap-1.5 mb-3">
                {product.bulkTiers.map((t) => (
                  <div key={t.qty} className="flex justify-between">
                    <span className="text-stone-400">{t.qty} units</span>
                    <span className="text-stone-700 font-semibold">₹{t.priceInr} / piece</span>
                  </div>
                ))}
              </div>
              <p className="text-stone-400 text-xs">
                MOQ 50 units · blank price only · print charged separately.{" "}
                <a href="mailto:hello@halftonelabs.in" className="text-orange-500 hover:text-orange-600">
                  Email us for a quote.
                </a>
              </p>
            </Accordion>

            <Accordion title="Shipping & Returns">
              <p className="mb-2">
                Standard delivery in 5–7 business days across India.
                Express shipping available on request.
              </p>
              <p className="mb-2 text-stone-400">
                International shipping available — contact us for a quote.
              </p>
              <p className="text-stone-400">
                Returns accepted within 7 days of delivery for manufacturing defects.
                Custom-printed items are non-refundable unless defective.
              </p>
            </Accordion>

          </motion.div>
        </div>

        {/* ── Print technique section ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-14 border-t border-stone-100">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Print methods</p>
          <h2
            className="text-2xl font-black text-stone-900 mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            We&apos;ve perfected DTG.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* DTG */}
            <div className="rounded-2xl bg-zinc-900 text-white px-7 py-7 flex flex-col gap-4 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white text-zinc-900 text-xs font-black px-3 py-1 uppercase tracking-wide">
                  DTG
                </span>
                <span className="text-sm font-semibold text-zinc-300">Direct to Garment</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Ink printed directly into the fabric — breathable, soft, vibrant. Feels like it was
                always part of the garment.
              </p>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                {[
                  "Soft, breathable hand-feel",
                  "Vibrant colour with photographic detail",
                  "Works on all garment colours",
                  "Improves with every wash",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* DTF */}
            <div className="rounded-2xl bg-white border border-stone-100 px-7 py-7 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-zinc-100 text-zinc-500 text-xs font-bold px-3 py-1 uppercase tracking-wide">
                  DTF
                </span>
                <span className="text-sm font-semibold text-stone-500">Direct to Film</span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Film-transfer option available on request. Slightly raised, textured finish — suited
                to bold graphics with thick outlines.
              </p>
              <ul className="text-xs text-stone-400 space-y-1.5">
                {[
                  "Raised, textured finish",
                  "Bold graphic prints",
                  "Available on request",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-zinc-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-[0.65rem] text-stone-300 pt-2 border-t border-stone-100">
                Not sure? Go DTG — you won&apos;t regret it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Also in the lineup ───────────────────────────────────────────── */}
        {otherProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-20 border-t border-stone-100 pt-14">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">
              Also in the lineup
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {otherProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-2xl overflow-hidden bg-white border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="aspect-[3/4] overflow-hidden"
                      style={{ background: p.colors[0].hex === "#FFFFFF" ? "#efefed" : "#e8e4df" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.colors[0].mockupFront}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5">
                      {p.tag && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                          {p.tag} ·{" "}
                        </span>
                      )}
                      <span className="text-xs font-black text-stone-900">{p.name}</span>
                      <p className="text-[11px] text-stone-400 mt-0.5">{p.gsm}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-bold text-stone-700">From ₹{p.blankPrice}</p>
                        <span className="text-[10px] font-bold text-orange-500 group-hover:translate-x-0.5 transition-transform">
                          View →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
