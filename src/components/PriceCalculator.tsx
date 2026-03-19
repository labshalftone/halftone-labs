"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/lib/currency-context";

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: "regular-tee",      label: "Regular Tee",         sub: "180 GSM · Combed cotton", blankPrice: 400 },
  { id: "oversized-tee-sj", label: "Oversized Tee (SJ)",  sub: "220 GSM · Single jersey", blankPrice: 500 },
  { id: "oversized-tee-ft", label: "Oversized Tee (FT)",  sub: "240 GSM · French terry",  blankPrice: 600 },
  { id: "baby-tee",         label: "Baby Tee",            sub: "180 GSM · Cropped fit",   blankPrice: 380 },
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

// GST only on INR checkout — for display purposes we show it on all currencies
function getLeadTime(qty: number): string {
  if (qty <= 10) return "5–7 business days";
  if (qty <= 50) return "7–10 days";
  if (qty <= 100) return "10–15 days";
  return "15–20 days";
}

// fmt is now provided by currency context — see component body

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
          ? "bg-ds-dark text-white border-zinc-900"
          : "bg-white text-ds-body border-black/[0.06] hover:border-zinc-400 hover:text-ds-dark"
      }`}
    >
      <span>{children}</span>
      {sub && (
        <span className={`text-[0.65rem] font-normal leading-none ${active ? "text-ds-muted" : "text-ds-muted"}`}>
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
  const { fmt, currency }         = useCurrency();

  const selectedProduct   = PRODUCTS.find((p) => p.id === product)!;
  const selectedPrintSize = PRINT_SIZES.find((s) => s.id === printSize)!;
  const printCost         = technique === "None" ? 0 : selectedPrintSize.price;
  const unitCost          = selectedProduct.blankPrice + printCost;
  const subtotal          = unitCost * qty;
  const gst               = currency === "INR" ? subtotal * GST_RATE : 0; // GST only for INR
  const grandTotal        = subtotal + gst;
  const leadTime          = getLeadTime(qty);

  return (
    <section id="pricing" style={{ backgroundColor: "#f8f7f5" }} className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* ── Left copy ─────────────────────────────────────────────── */}
          <div className="lg:pt-6">
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ds-muted mb-4 block">
              Pricing
            </span>
            <h2
              className="text-4xl md:text-5xl font-semibold text-ds-dark leading-[0.92] mb-5"
              style={{ letterSpacing: "-0.055em" }}
            >
              Get a quote
              <br />
              instantly
            </h2>
            <p className="text-ds-body leading-relaxed mb-8 max-w-sm text-[0.95rem]">
              Configure your product and get an instant price estimate. No
              back-and-forth emails.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-black/[0.06] rounded-full px-4 py-2 text-xs font-medium text-ds-body shadow-sm">
              <span>🇮🇳</span>
              <span>Fulfilled from India</span>
            </div>

            {/* Lead time callout */}
            <div className="mt-8 flex items-center gap-3 text-sm text-ds-body">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
              <span>
                Est. lead time for{" "}
                <span className="font-semibold text-ds-dark">{qty} unit{qty !== 1 ? "s" : ""}</span>
                : <span className="font-semibold text-ds-dark">{leadTime}</span>
              </span>
            </div>
          </div>

          {/* ── Right calculator card ──────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-lg shadow-zinc-200/60 border border-black/[0.06] p-7 flex flex-col gap-6">

            {/* Product */}
            <div>
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-ds-muted mb-2.5 block">
                Product
              </label>
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.map((p) => (
                  <Pill
                    key={p.id}
                    active={product === p.id}
                    onClick={() => setProduct(p.id)}
                    sub={`${p.sub} · ${fmt(p.blankPrice)}`}
                  >
                    {p.label}
                  </Pill>
                ))}

              </div>
            </div>

            {/* Technique */}
            <div>
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-ds-muted mb-2.5 block">
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
              <label className="text-[0.7rem] font-mono uppercase tracking-widest text-ds-muted mb-2.5 block">
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
                <label className="text-[0.7rem] font-mono uppercase tracking-widest text-ds-muted">
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
                    className="w-16 text-right text-sm font-semibold border border-black/[0.06] rounded-lg px-2 py-1 outline-none focus:border-zinc-400 text-ds-dark"
                  />
                  <span className="text-xs text-ds-muted">units</span>
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
              <div className="flex justify-between text-[0.65rem] text-ds-muted mt-1">
                <span>1</span>
                <span>500</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl bg-ds-light-gray border border-black/[0.06] p-5 flex flex-col gap-2.5">
              {[
                { label: `Unit cost (×${qty})`,                        value: fmt(unitCost) },
                { label: "Print",                                        value: printCost > 0 ? fmt(printCost) : "included" },
                { label: "Subtotal",                                     value: fmt(subtotal) },
                { label: currency === "INR" ? "Est. GST (5%)" : "Tax", value: currency === "INR" ? fmt(gst) : "at checkout" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm text-ds-body">
                  <span>{row.label}</span>
                  <AnimatedPrice value={row.value} className="font-medium text-ds-body tabular-nums" />
                </div>
              ))}

              <div className="border-t border-black/[0.06] pt-3 mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-ds-dark uppercase tracking-tight">
                  Grand Total
                </span>
                <AnimatedPrice
                  value={fmt(grandTotal)}
                  className="text-xl font-semibold text-ds-dark tabular-nums"
                />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <Link
                href="/studio"
                className="flex-1 bg-ds-dark text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-ds-dark2 transition-colors duration-150"
              >
                Start designing →
              </Link>
              <a
                href={`mailto:hello@halftonelabs.in?subject=Price%20enquiry&body=Hi%2C%20I%27d%20like%20a%20quote%20for%20${qty}%20x%20${selectedProduct.label}.`}
                className="flex-1 border border-black/[0.06] text-ds-body text-sm font-semibold py-3 rounded-xl text-center hover:border-zinc-400 hover:text-ds-dark transition-colors duration-150"
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
