"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

// Compress image to small JPEG thumbnail for DB storage
async function makeThumbnail(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, 120, 120);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve("");
    img.src = src;
  });
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ZONE_PCT = { x: 0.28, y: 0.22, w: 0.44, h: 0.44 };
const MAX_PRINT_W_IN = 19;
const MAX_PRINT_H_IN = 15.5;

const PRINT_TIERS = [
  { label: '5×5"',     sqin: 25,    price: 120 },
  { label: '6×10"',    sqin: 60,    price: 180 },
  { label: '8.5×11"',  sqin: 93.5,  price: 230 },
  { label: '12×12"',   sqin: 144,   price: 280 },
  { label: '14×16"',   sqin: 224,   price: 330 },
  { label: '19×15.5"', sqin: 294.5, price: 400 },
];

function getTier(sqin: number) {
  return PRINT_TIERS.find((t) => sqin <= t.sqin) ?? PRINT_TIERS[PRINT_TIERS.length - 1];
}

const PRODUCTS = [
  {
    id: "regular-tee",
    name: "Regular Tee",
    gsm: "180 GSM",
    fabric: "100% combed ring-spun cotton",
    fit: "Regular unisex fit, slightly tapered body",
    blankPrice: 400,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    moqBulk: 50,
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#111111" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Maroon", hex: "#6B2D2D" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹349" },
      { qty: "100–249 pcs", price: "₹299" },
      { qty: "250+ pcs", price: "₹249" },
    ],
    tag: "Bestseller",
  },
  {
    id: "oversized-tee-sj",
    name: "Oversized Tee",
    gsm: "220 GSM · Single Jersey",
    fabric: "100% combed cotton, single jersey knit",
    fit: "Drop-shoulder oversized fit",
    blankPrice: 500,
    sizes: ["S", "M", "L", "XL", "2XL"],
    moqBulk: 50,
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#111111" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹449" },
      { qty: "100–249 pcs", price: "₹399" },
      { qty: "250+ pcs", price: "₹349" },
    ],
    tag: "New",
  },
  {
    id: "oversized-tee-ft",
    name: "Oversized Tee",
    gsm: "240 GSM · French Terry",
    fabric: "100% combed cotton, french terry",
    fit: "Drop-shoulder oversized fit, looped back",
    blankPrice: 600,
    sizes: ["S", "M", "L", "XL", "2XL"],
    moqBulk: 50,
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Royal Blue", hex: "#2355C0" },
      { name: "Baby Pink", hex: "#F5C2C7" },
      { name: "Red", hex: "#C0392B" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹549" },
      { qty: "100–249 pcs", price: "₹499" },
      { qty: "250+ pcs", price: "₹449" },
    ],
    tag: null,
  },
  {
    id: "baby-tee",
    name: "Baby Tee",
    gsm: "180 GSM",
    fabric: "100% combed ring-spun cotton",
    fit: "Cropped fitted cut, women's silhouette",
    blankPrice: 380,
    sizes: ["XS", "S", "M", "L", "XL"],
    moqBulk: 50,
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#111111" },
      { name: "Baby Pink", hex: "#F5C2C7" },
      { name: "Lavender", hex: "#C9B8E8" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹329" },
      { qty: "100–249 pcs", price: "₹279" },
      { qty: "250+ pcs", price: "₹239" },
    ],
    tag: null,
  },
];

// ─── TEE SVG ──────────────────────────────────────────────────────────────────

function TeeMockup({ color, isOversized }: { color: string; isOversized?: boolean }) {
  const isDark = ["#111111","#1B2A4A","#2355C0","#C0392B","#6B2D2D"].includes(color);
  const body = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";
  return (
    <svg viewBox="0 0 200 230" className="w-full h-full" style={{ maxHeight: 480 }}>
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.08)" />
      <path d={body} fill={color} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"} strokeWidth="1.5" />
      <path d={collar} fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"} strokeWidth="1.5" />
      <rect x={200*ZONE_PCT.x} y={230*ZONE_PCT.y} width={200*ZONE_PCT.w} height={230*ZONE_PCT.h}
        fill="none" stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"} strokeWidth="0.8" strokeDasharray="3 3" rx="2" />
    </svg>
  );
}

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────

function DesignPlacer({
  designSrc, color, isOversized, onPriceChange,
}: {
  designSrc: string; color: string; isOversized: boolean;
  onPriceChange: (price: number, tier: string, dims: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState({ x: 100, y: 115, size: 60 });
  const dragging = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const toSVG = useCallback((cx: number, cy: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 200, y: (cy - r.top) / r.height * 230 };
  }, []);

  const updatePrice = useCallback((size: number) => {
    const fracW = size / (200 * ZONE_PCT.w);
    const fracH = size / (230 * ZONE_PCT.h);
    const sqin = fracW * MAX_PRINT_W_IN * fracH * MAX_PRINT_H_IN;
    const tier = getTier(sqin);
    onPriceChange(tier.price, tier.label, `${(fracW * MAX_PRINT_W_IN).toFixed(1)}"×${(fracH * MAX_PRINT_H_IN).toFixed(1)}"`);
  }, [onPriceChange]);

  useEffect(() => { updatePrice(pos.size); }, [pos.size, updatePrice]);

  const isDark = ["#111111","#1B2A4A","#2355C0","#C0392B","#6B2D2D"].includes(color);
  const body = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";

  return (
    <div className="flex flex-col gap-4">
      <svg ref={svgRef} viewBox="0 0 200 230" className="w-full cursor-move select-none" style={{ maxHeight: 400 }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const s = toSVG(e.clientX, e.clientY);
          setPos((p) => ({ ...p, x: Math.max(30, Math.min(170, s.x - dragOffset.current.dx)), y: Math.max(30, Math.min(200, s.y - dragOffset.current.dy)) }));
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}
      >
        <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.08)" />
        <path d={body} fill={color} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"} strokeWidth="1.5" />
        <path d={collar} fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"} strokeWidth="1.5" />
        <rect x={200*ZONE_PCT.x} y={230*ZONE_PCT.y} width={200*ZONE_PCT.w} height={230*ZONE_PCT.h}
          fill="none" stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"} strokeWidth="0.8" strokeDasharray="3 3" rx="2" />
        <image
          href={designSrc}
          x={pos.x - pos.size/2} y={pos.y - pos.size/2} width={pos.size} height={pos.size}
          style={{ cursor: "grab" }}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.target as SVGImageElement).setPointerCapture(e.pointerId);
            dragging.current = true;
            const s = toSVG(e.clientX, e.clientY);
            dragOffset.current = { dx: s.x - pos.x, dy: s.y - pos.y };
          }}
        />
        <text x="100" y="228" textAnchor="middle" fontSize="5" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}>drag to reposition</text>
      </svg>
      <div>
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span className="font-medium text-zinc-600">Design size</span>
          <span className="text-orange-500 font-semibold">{Math.round((pos.size / 120) * 100)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPos((p) => ({ ...p, size: Math.max(20, p.size - 8) }))}
            className="w-9 h-9 rounded-full border-2 border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0"
          >−</button>
          <input type="range" min={20} max={120} value={pos.size}
            onChange={(e) => setPos((p) => ({ ...p, size: Number(e.target.value) }))}
            className="flex-1 accent-orange-500 h-1.5" />
          <button
            onClick={() => setPos((p) => ({ ...p, size: Math.min(120, p.size + 8) }))}
            className="w-9 h-9 rounded-full border-2 border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0"
          >+</button>
        </div>
        <p className="text-xs text-zinc-400 mt-2 text-center">Drag design on tee to reposition</p>
      </div>
    </div>
  );
}

// ─── BULK QUOTE MODAL ─────────────────────────────────────────────────────────

function BulkQuoteModal({ product, onClose }: { product: typeof PRODUCTS[0]; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", qty: "50", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    await fetch("https://formspree.io/f/xlgplaja", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _subject: `Bulk Quote — ${product.name} — ${form.qty} pcs`, ...form }),
    }).catch(() => {});
    setSent(true); setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-2xl leading-none">&times;</button>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="text-xl font-semibold mb-2">Quote Requested</h3>
            <p className="text-zinc-500 text-sm">We'll email you within 24 hours.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm">Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-1">Bulk Quote</h3>
            <p className="text-zinc-500 text-sm mb-6">{product.name} · Screen print · MOQ 50</p>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Name</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Quantity</label>
                <select value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>50</option><option>100</option><option>250</option><option>500</option><option>1000+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Notes</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={3} className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" placeholder="Colors, design specs…" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-700 transition-colors">
                {sending ? "Sending…" : "Request Quote"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── CONFIGURATOR (2 steps: Style + Design → Add to Cart) ────────────────────

const STEPS = ["Style", "Design"];

function OnDemandConfigurator({ product, onClose }: { product: typeof PRODUCTS[0]; onClose: () => void }) {
  const { addItem, count } = useCart();
  const [step, setStep] = useState(0);

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]);

  const [designSrc, setDesignSrc] = useState("");
  const [printPrice, setPrintPrice] = useState(0);
  const [printTier, setPrintTier] = useState("");
  const [printDims, setPrintDims] = useState("");
  const [side, setSide] = useState<"front" | "back" | "both">("front");
  const [noDesign, setNoDesign] = useState(false);
  const [added, setAdded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isOversized = product.id.includes("oversized");
  const effectivePrintPrice = side === "both" ? printPrice * 2 : printPrice;
  const itemTotal = product.blankPrice + effectivePrintPrice;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDesignSrc(url);
    setNoDesign(false);
  };

  const handleSaveDesign = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const thumbnail = designSrc ? await makeThumbnail(designSrc) : "";
      await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id ?? null,
          customerEmail: session?.user?.email ?? null,
          productId: product.id,
          productName: product.name,
          gsm: product.gsm,
          colorName: color.name,
          colorHex: color.hex,
          size,
          printTier: printTier || null,
          printDims: printDims || null,
          blankPrice: product.blankPrice,
          printPrice,
          hasDesign: !!designSrc,
          thumbnail,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      gsm: product.gsm,
      color: color.name,
      colorHex: color.hex,
      size,
      qty: 1,
      side,
      blankPrice: product.blankPrice,
      printPrice: effectivePrintPrice,
      printTier: side === "both" ? `${printTier} × 2 sides` : printTier,
      printDims,
      hasDesign: !!designSrc,
      designDataUrl: designSrc,
    });
    setAdded(true);
  };

  if (added) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-sm w-full mx-4 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Added to cart!</h2>
          <p className="text-zinc-500 text-sm mb-6">{product.name} · {color.name} · {size}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
              + Add more
            </button>
            <Link href="/checkout" onClick={onClose}>
              <button className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors flex items-center gap-1.5">
                Checkout ({count}) →
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden" style={{ background: "#f8f7f5" }}>
      {/* Left panel — always-visible mockup */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[45%] bg-white border-r border-zinc-100 relative p-10">
        <button onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <div className="absolute top-6 right-6 text-right">
          <p className="text-xs text-zinc-400">{product.gsm}</p>
          <p className="text-sm font-semibold">{product.name}</p>
        </div>

        <div className="w-full max-w-xs">
          {step === 1 && designSrc ? (
            <DesignPlacer designSrc={designSrc} color={color.hex} isOversized={isOversized}
              onPriceChange={(p, t, d) => { setPrintPrice(p); setPrintTier(t); setPrintDims(d); }} />
          ) : (
            <TeeMockup color={color.hex} isOversized={isOversized} />
          )}
        </div>

        <div className="mt-6 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center gap-3">
          <span>{color.name} · {size}</span>
          <span className="w-px h-4 bg-white/20" />
          <span className="font-bold">₹{itemTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Right panel — steps */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-white">
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="font-semibold text-sm">{product.name}</span>
          <span className="font-bold text-sm">₹{itemTotal.toLocaleString("en-IN")}</span>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-0 px-6 lg:px-10 pt-6 pb-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${i === step ? "text-zinc-900" : i < step ? "text-orange-500 cursor-pointer" : "text-zinc-400 cursor-default"}`}>
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold ${i === step ? "bg-zinc-900 text-white" : i < step ? "bg-orange-500 text-white" : "bg-zinc-200 text-zinc-500"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`mx-2 h-px w-10 ${i < step ? "bg-orange-400" : "bg-zinc-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6">
          <AnimatePresence mode="wait">
            {/* Step 0 — Style */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Pick your style</h2>
                <p className="text-zinc-500 text-sm mb-8">{product.fabric}</p>

                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Colour — {color.name}</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button key={c.name} title={c.name} onClick={() => setColor(c)}
                        className="w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none"
                        style={{
                          background: c.hex,
                          border: color.name === c.name ? "3px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                          boxShadow: color.name === c.name ? "0 0 0 2px white, 0 0 0 4px #f15533" : "none",
                        }} />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${size === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:hidden w-44 mx-auto mb-8">
                  <TeeMockup color={color.hex} isOversized={isOversized} />
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 transition-colors">
                  Next — Add Your Design
                </button>
              </motion.div>
            )}

            {/* Step 1 — Design */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Your design</h2>
                <p className="text-zinc-500 text-sm mb-8">Upload a PNG — drag & resize it on the tee</p>

                {!designSrc ? (
                  <label className="block w-full border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors mb-6">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="font-semibold text-zinc-700 mb-1">Upload PNG file</p>
                    <p className="text-xs text-zinc-400">PNG with transparent background works best</p>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
                  </label>
                ) : (
                  <div className="mb-6">
                    <div className="lg:hidden mb-4">
                      <DesignPlacer designSrc={designSrc} color={color.hex} isOversized={isOversized}
                        onPriceChange={(p, t, d) => { setPrintPrice(p); setPrintTier(t); setPrintDims(d); }} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <div>
                        <p className="text-xs text-zinc-500">Print size</p>
                        <p className="font-semibold text-zinc-800">{printTier} ({printDims})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Print cost</p>
                        <p className="font-bold text-orange-600">+₹{printPrice}</p>
                      </div>
                    </div>
                    <button onClick={() => { setDesignSrc(""); setPrintPrice(0); setPrintTier(""); setPrintDims(""); }}
                      className="mt-3 text-xs text-zinc-400 underline hover:text-zinc-600">
                      Remove design
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 my-4">
                  <hr className="flex-1 border-zinc-200" /><span className="text-xs text-zinc-400">or</span><hr className="flex-1 border-zinc-200" />
                </div>

                <button onClick={() => { setNoDesign(true); setPrintPrice(0); setPrintTier(""); setPrintDims(""); setDesignSrc(""); }}
                  className={`w-full py-3 rounded-xl border-2 text-sm font-medium transition-all mb-8 ${noDesign && !designSrc ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                  Blank tee — no print
                </button>

                {/* Print side selector — visible once a design is uploaded OR noDesign selected */}
                {(designSrc || noDesign) && !noDesign && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Print side</p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { val: "front",  label: "Front only" },
                        { val: "back",   label: "Back only" },
                        { val: "both",   label: "Both sides" },
                      ] as const).map(({ val, label }) => (
                        <button key={val} onClick={() => setSide(val)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                            side === val
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                          }`}>
                          {label}
                          {val === "both" && <span className="block text-[9px] font-normal opacity-70 mt-0.5">2× print cost</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price + actions — pinned together */}
                <div className="bg-zinc-50 rounded-2xl p-4 mb-4 border border-zinc-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-400">Item total</p>
                    <p className="font-black text-lg">₹{itemTotal.toLocaleString("en-IN")}</p>
                    {effectivePrintPrice > 0 && (
                      <p className="text-xs text-orange-500">
                        {side === "both" ? `${printTier} × 2 sides` : `${printTier} print`} included
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">+ shipping at checkout</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-zinc-400">
                      🇮🇳 <span>Fulfilled from India</span>
                    </span>
                  </div>
                </div>

                {/* Save design — above CTA, always visible */}
                <button
                  disabled={saving}
                  onClick={handleSaveDesign}
                  className={`w-full mb-3 py-3 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    saved
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                  } disabled:opacity-50`}
                >
                  {saved ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Design saved to account!</>
                  ) : saving ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Saving…</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save design to account</>
                  )}
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-5 py-3 rounded-2xl border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                    Back
                  </button>
                  <button
                    disabled={!designSrc && !noDesign}
                    onClick={handleAddToCart}
                    className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Add to Cart — ₹{itemTotal.toLocaleString("en-IN")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onOrder, onBulkQuote }: {
  product: typeof PRODUCTS[0]; onOrder: () => void; onBulkQuote: () => void;
}) {
  const [hoverColor, setHoverColor] = useState(product.colors[0]);
  const isOversized = product.id.includes("oversized");
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all shadow-sm hover:shadow-md">
      <div className="relative bg-zinc-50 px-10 pt-8 pb-2" style={{ minHeight: 260 }}>
        {product.tag && (
          <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 text-white">{product.tag}</span>
        )}
        <div className="w-full max-w-[180px] mx-auto">
          <TeeMockup color={hoverColor.hex} isOversized={isOversized} />
        </div>
      </div>
      <div className="px-6 pb-6 pt-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-black text-zinc-900 text-lg leading-tight" style={{ letterSpacing: "-0.03em" }}>{product.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{product.gsm}</p>
          </div>
          <p className="text-lg font-black text-zinc-900 shrink-0">from ₹{product.blankPrice}</p>
        </div>
        <p className="text-xs text-zinc-500 mb-4">{product.fit}</p>
        <div className="flex gap-2 mb-5">
          {product.colors.map((c) => (
            <button key={c.name} title={c.name} onMouseEnter={() => setHoverColor(c)} onClick={() => setHoverColor(c)}
              className="w-5 h-5 rounded-full transition-transform hover:scale-125 focus:outline-none"
              style={{
                background: c.hex,
                border: hoverColor.name === c.name ? "2px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                boxShadow: hoverColor.name === c.name ? "0 0 0 1px white, 0 0 0 3px #f15533" : "none",
              }} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onOrder} className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Customise →
          </button>
          <button onClick={onBulkQuote} title="Bulk quote (MOQ 50)"
            className="px-4 py-3 rounded-xl border-2 border-zinc-200 text-zinc-600 text-sm font-medium hover:border-zinc-400 transition-colors">
            Bulk
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [activeProduct, setActiveProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [bulkProduct, setBulkProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const { count } = useCart();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f7f5]">
        {/* Hero */}
        <div className="pt-28 pb-16 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-4">
              Halftone Labs Studio
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 leading-tight mb-4" style={{ letterSpacing: "-0.04em" }}>
              Design. Print. Ship.
            </h1>
            <p className="text-zinc-500 text-lg max-w-md mx-auto mb-8">
              Custom printed tees, MOQ 1. DTG print on premium blanks — shipped in 5–7 days.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />MOQ 1</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />DTG / DTF</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />Ships worldwide</span>
            </div>

            {count > 0 && (
              <Link href="/checkout">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Checkout {count} item{count !== 1 ? "s" : ""} →
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <ProductCard product={p} onOrder={() => setActiveProduct(p)} onBulkQuote={() => setBulkProduct(p)} />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🖨️", title: "DTG Printing", desc: "Direct-to-garment. No minimums, full colour, photographic quality." },
              { icon: "📦", title: "5–7 Day Shipping", desc: "Domestic delivery via top couriers. International ships in 10–18 days." },
              { icon: "🎨", title: "Bulk Screen Print", desc: "Got a big run? MOQ 50 with screen print pricing that beats the market." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-zinc-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Questions? <a href="mailto:hello@halftonelabs.in" className="text-orange-500 font-medium hover:underline">hello@halftonelabs.in</a>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeProduct && <OnDemandConfigurator product={activeProduct} onClose={() => setActiveProduct(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {bulkProduct && <BulkQuoteModal product={bulkProduct} onClose={() => setBulkProduct(null)} />}
      </AnimatePresence>
    </>
  );
}
