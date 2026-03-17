"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: "regular-tee",   label: "Regular Tee",   blankPrice: 400 },
  { id: "oversized-tee", label: "Oversized Tee",  blankPrice: 500 },
  { id: "hoodie",        label: "Hoodie",          blankPrice: 900 },
] as const;

type ProductId = (typeof PRODUCTS)[number]["id"];

const TECHNIQUES = [
  { id: "DTG",  label: "DTG",  sub: "natural look" },
  { id: "DTF",  label: "DTF",  sub: "vibrant on any color" },
  { id: "None", label: "None", sub: "blank garment" },
] as const;

type TechniqueId = (typeof TECHNIQUES)[number]["id"];

const PRINT_SIZES = [
  { id: "none",   label: 'No print',       price: 0 },
  { id: "small",  label: 'Small 5×5"',     price: 120 },
  { id: "medium", label: 'Medium 8.5×11"', price: 230 },
  { id: "large",  label: 'Large 14×16"',   price: 330 },
  { id: "full",   label: 'Full 19×15.5"',  price: 400 },
] as const;

type PrintSizeId = (typeof PRINT_SIZES)[number]["id"];

const GST_RATE = 0.05;

function getLeadTime(qty: number): string {
  if (qty <= 10) return "5–7 business days";
  if (qty <= 50) return "7–10 days";
  if (qty <= 100) return "10–15 days";
  return "15–20 days";
}

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// ── Animated number ───────────────────────────────────────────────────────────

function AnimatedPrice({ value, className }: { value: string; className?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

// ── Pill button ───────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-150 flex flex-col items-start gap-0.5 ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
      }`}
    >
      <span>{children}</span>
      {sub && (
        <span className={`text-[0.65rem] font-normal leading-none ${active ? "text-zinc-300" : "text-zinc-400"}`}>
          {sub}
        </span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PriceCalculator() {
  const [product, setProduct]     = useState<ProductId>("regular-tee");
  const [technique, setTechnique] = useState<TechniqueId>("DTG");
  const [printSize, setPrintSize] = useState<PrintSizeId>("medium");
  const [qty, setQty]             = useState(10);

  const selectedProduct   = PRODUCTS.find((p) => p.id === product)!;
  const selectedPrintSize = PRINT_SIZES.find((s) => s.id === printSize)!;
  const printCost         = technique === "None" ? 0 : selectedPrintSize.price;
  const unitCost          = selectedProduct.blankPrice + printCost;
  const subtotal          = unitCost * qty;
  const gst               = subtotal * GST_RATE;
  const grandTotal        = subtotal + gst;
  const leadTime          = getLeadTime(qty);

  return (
    <section id="pricing" style={{ backgroundColor: "#f8f7f5" }} className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* ── Left copy ─────────────────────────────────────────────── */}
          <div className="lg:pt-6">
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-4 block">
              Pricing
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-zinc-900 leading-[0.92] mb-5"
              style={{ letterSpacing: "-0.055em" }}
            >
              Get a quote
              <br />
              instantly
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-8 max-w-sm text-[0.95rem]">
              Configure your product and get an instant price estimate. No
              back-and-forth emails.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm">
              <span>🇮🇳</span>
              <span>Fulfilled from India</span>
            </div>

            {/* Lead time callout */}
            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
              <span>
                Est. lead time for{" "}
                <span className="font-semibold text-zinc-900">{qty} unit{qty !== 1 ? "s" : ""}</span>
                : <span className="font-semibold text-zinc-900">{leadTime}</span>
              </span>
            </div>
          </div>

          {/* ── Right calculator card ──────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-lg shadow-zinc-200/60 border border-zinc-100 p-7 flex flex-col gap-6">

            {/* Product */}
            <div>
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-zinc-400 mb-2.5 block">
                Product
              </label>
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.map((p) => (
                  <Pill
                    key={p.id}
                    active={product === p.id}
                    onClick={() => setProduct(p.id)}
                    sub={`blank ${fmt(p.blankPrice)}`}
                  >
                    {p.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Technique */}
            <div>
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-zinc-400 mb-2.5 block">
                Print Technique
              </label>
              <div className="flex flex-wrap gap-2">
                {TECHNIQUES.map((t) => (
                  <Pill
                    key={t.id}
                    active={technique === t.id}
                    onClick={() => setTechnique(t.id)}
                    sub={t.sub}
                  >
                    {t.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Print size */}
            <div>
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-zinc-400 mb-2.5 block">
                Print Size
              </label>
              <div className="flex flex-wrap gap-2">
                {PRINT_SIZES.map((s) => (
                  <Pill
                    key={s.id}
                    active={printSize === s.id}
                    onClick={() => setPrintSize(s.id)}
                    sub={s.price > 0 ? `+${fmt(s.price)}` : undefined}
                  >
                    {s.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[0.7rem] font-mono uppercase tracking-widest text-zinc-400">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={qty}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                      setQty(v);
                    }}
                    className="w-16 text-right text-sm font-semibold border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:border-zinc-400 text-zinc-900"
                  />
                  <span className="text-xs text-zinc-400">units</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={500}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-[0.65rem] text-zinc-300 mt-1">
                <span>1</span>
                <span>500</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5 flex flex-col gap-2.5">
              {[
                { label: `Unit cost (×${qty})`,  value: fmt(unitCost) },
                { label: "Print",                 value: printCost > 0 ? fmt(printCost) : "included" },
                { label: "Subtotal",              value: fmt(subtotal) },
                { label: "Est. GST (5%)",         value: fmt(gst) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm text-zinc-500">
                  <span>{row.label}</span>
                  <AnimatedPrice value={row.value} className="font-medium text-zinc-700 tabular-nums" />
                </div>
              ))}

              <div className="border-t border-zinc-200 pt-3 mt-1 flex items-center justify-between">
                <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  Grand Total
                </span>
                <AnimatedPrice
                  value={fmt(grandTotal)}
                  className="text-xl font-black text-zinc-900 tabular-nums"
                />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <Link
                href="/studio"
                className="flex-1 bg-zinc-900 text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-zinc-700 transition-colors duration-150"
              >
                Start designing →
              </Link>
              <a
                href={`mailto:hello@halftonelabs.in?subject=Price%20enquiry&body=Hi%2C%20I%27d%20like%20a%20quote%20for%20${qty}%20x%20${selectedProduct.label}.`}
                className="flex-1 border border-zinc-200 text-zinc-700 text-sm font-semibold py-3 rounded-xl text-center hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-150"
              >
                Send to email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
