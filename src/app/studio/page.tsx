"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import SizeGuide from "@/components/SizeGuide";
import { useCurrency } from "@/lib/currency-context";
import { PRINT_TIERS, getTier, PRODUCTS } from "@/lib/products";

// ─── THUMBNAIL ────────────────────────────────────────────────────────────────

async function makeThumbnail(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 120, 120);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve("");
    img.src = src;
  });
}

// pos mirrors exactly what DesignPlacer renders:
//   x, y  = design centre as % of container (same coordinate space as zone)
//   size  = design width as % of container width (height derived from natural aspect ratio)
async function makeCompositeThumbnail(
  mockupSrc: string,
  designSrc: string,
  pos: { x: number; y: number; size: number }
): Promise<string> {
  return new Promise((resolve) => {
    const mockup = new Image();
    mockup.onload = () => {
      // Canvas matches the mockup's natural aspect ratio — no squishing
      const W = 900;
      const H = Math.round(W * (mockup.naturalHeight / mockup.naturalWidth));
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }

      // White bg so transparent PNGs don't export as black on JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(mockup, 0, 0, W, H);

      const design = new Image();
      design.onload = () => {
        // Replicate browser layout: centre at (pos.x%, pos.y%), width = pos.size%
        const cx = (pos.x    / 100) * W;
        const cy = (pos.y    / 100) * H;
        const dw = (pos.size / 100) * W;
        // Height preserves natural aspect ratio — same as the <img> tag behaviour
        const dh = dw * (design.naturalHeight / design.naturalWidth);
        ctx.drawImage(design, cx - dw / 2, cy - dh / 2, dw, dh);
        resolve(canvas.toDataURL("image/jpeg", 0.93));
      };
      design.onerror = () => resolve(canvas.toDataURL("image/jpeg", 0.93));
      design.src = designSrc;
    };
    mockup.onerror = () => resolve("");
    mockup.src = mockupSrc;
  });
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ZONE_PCT = { x: 0.28, y: 0.22, w: 0.44, h: 0.44 };
const MAX_PRINT_W_IN = 19;
const MAX_PRINT_H_IN = 15.5;

// Zone bounds in SVG coordinate space (viewBox 200×230)
const ZX1 = 200 * ZONE_PCT.x;               // 56
const ZY1 = 230 * ZONE_PCT.y;               // 50.6
const ZX2 = ZX1 + 200 * ZONE_PCT.w;         // 144
const ZY2 = ZY1 + 230 * ZONE_PCT.h;         // 151.8
const MAX_DESIGN_SIZE = Math.floor(Math.min(200 * ZONE_PCT.w, 230 * ZONE_PCT.h)); // 88

function clampInZone(x: number, y: number, size: number) {
  const half = size / 2;
  return {
    x: Math.max(ZX1 + half, Math.min(ZX2 - half, x)),
    y: Math.max(ZY1 + half, Math.min(ZY2 - half, y)),
  };
}

// PRINT_TIERS, getTier, and PRODUCTS are imported from @/lib/products above.

// ─── TEE SVG ──────────────────────────────────────────────────────────────────

function TeeMockup({ color, isOversized }: { color: string; isOversized?: boolean }) {
  const isDark = ["#111111","#1B2A4A","#2355C0","#C0392B","#6B2D2D"].includes(color);
  const body   = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";
  return (
    <svg viewBox="0 0 200 230" className="w-full h-full" style={{ maxHeight: 480 }}>
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.07)" />
      <path d={body} fill={color}
        stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)"} strokeWidth="1.5" />
      <path d={collar} fill="none"
        stroke={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)"} strokeWidth="1.5" />
      <rect x={200*ZONE_PCT.x} y={230*ZONE_PCT.y} width={200*ZONE_PCT.w} height={230*ZONE_PCT.h}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)"}
        strokeWidth="0.7" strokeDasharray="3 3" rx="2" />
    </svg>
  );
}

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────
// Print zone as % of the photo container — portrait orientation (taller than wide)
const PHOTO_ZONE = {
  regular:  { left: 30, top: 29.8, width: 36, height: 44 },
  oversized: { left: 28.3, top: 29.8, width: 40, height: 48 },
  baby:     { left: 28.3, top: 29.8, width: 40, height: 26 },
};

function DesignPlacer({
  designSrc, mockupSrc, zoneKey, onPriceChange, photoZone, onPositionChange,
}: {
  designSrc: string; mockupSrc: string; zoneKey: keyof typeof PHOTO_ZONE;
  onPriceChange: (price: number, tier: string, dims: string) => void;
  photoZone: typeof PHOTO_ZONE;
  onPositionChange?: (pos: { x: number; y: number; size: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onPriceChangeRef = useRef(onPriceChange);
  useEffect(() => { onPriceChangeRef.current = onPriceChange; });

  const zone = photoZone[zoneKey];

  const minSize = zone.width * 0.12;
  const maxSize = zone.width * 0.90;
  const initSize = zone.width * 0.38;
  const initX = zone.left + zone.width / 2;
  const initY = zone.top + zone.height / 2;

  const [pos, setPos] = useState({ x: initX, y: initY, size: initSize });
  const dragging   = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // Convert client pixel → % of container
  const toPct = useCallback((cx: number, cy: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100 };
  }, []);

  // Clamp design centre within the photo print zone
  const clamp = useCallback((x: number, y: number, size: number) => {
    const hx = size / 2;          // horizontal: keep design inside zone left/right
    const hy = Math.min(size / 2, zone.height * 0.08); // vertical: tiny margin so full zone is usable
    return {
      x: Math.max(zone.left + hx, Math.min(zone.left + zone.width  - hx, x)),
      y: Math.max(zone.top  + hy, Math.min(zone.top  + zone.height - hy, y)),
    };
  }, [zone]);

  // Report actual design position to parent so it can generate accurate thumbnails
  const onPositionChangeRef = useRef(onPositionChange);
  useEffect(() => { onPositionChangeRef.current = onPositionChange; });
  useEffect(() => {
    onPositionChangeRef.current?.({ x: pos.x, y: pos.y, size: pos.size });
  }, [pos]);

  // Price calculation — size relative to zone → square inches
  useEffect(() => {
    const fracW = pos.size / zone.width;
    const fracH = pos.size / zone.height;
    const sqin  = fracW * MAX_PRINT_W_IN * fracH * MAX_PRINT_H_IN;
    const tier  = getTier(sqin);
    onPriceChangeRef.current(
      tier.price, tier.label,
      `${(fracW * MAX_PRINT_W_IN).toFixed(1)}"×${(fracH * MAX_PRINT_H_IN).toFixed(1)}"`,
    );
  }, [pos.size, zone.width, zone.height]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct = Math.round(((pos.size - minSize) / (maxSize - minSize)) * 100);
  const step = (maxSize - minSize) / 10;

  return (
    <div className="flex flex-col gap-4">
      {/* Photo canvas */}
      <div
        ref={containerRef}
        className="relative w-full select-none overflow-hidden rounded-xl"
        style={{ background: "#ffffff", touchAction: "none" }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const p = toPct(e.clientX, e.clientY);
          setPos((prev) => ({
            ...clamp(p.x - dragOffset.current.dx, p.y - dragOffset.current.dy, prev.size),
            size: prev.size,
          }));
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}
      >
        {/* Real product photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mockupSrc} alt="product" className="w-full block pointer-events-none" draggable={false} />

        {/* Print-zone outline */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${zone.left}%`, top: `${zone.top}%`,
            width: `${zone.width}%`, height: `${zone.height}%`,
            border: "2px dashed rgba(241,85,51,0.75)",
            borderRadius: "4px",
            background: "rgba(241,85,51,0.04)",
          }}
        />

        {/* Draggable design */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={designSrc}
          alt="your design"
          draggable={false}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            left: `${pos.x}%`, top: `${pos.y}%`,
            width: `${pos.size}%`,
            transform: "translate(-50%, -50%)",
            touchAction: "none",
            userSelect: "none",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.target as HTMLImageElement).setPointerCapture(e.pointerId);
            dragging.current = true;
            const p = toPct(e.clientX, e.clientY);
            dragOffset.current = { dx: p.x - pos.x, dy: p.y - pos.y };
          }}
        />

        {/* Hint */}
        <p className="absolute bottom-2 inset-x-0 text-center text-[9px] text-zinc-300 pointer-events-none drop-shadow">
          drag to reposition · stays within print zone
        </p>
      </div>

      {/* Size slider */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="font-medium text-zinc-600">Design size</span>
          <span className="font-bold text-orange-500">{pct}% of print area</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPos((p) => { const s = Math.max(minSize, p.size - step); return { size: s, ...clamp(p.x, p.y, s) }; })}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0"
          >−</button>
            <input
              type="range" min={minSize} max={maxSize} step={0.5} value={pos.size}
              onChange={(e) => { const s = Number(e.target.value); setPos((p) => ({ size: s, ...clamp(p.x, p.y, s) })); }}
              className="flex-1 accent-orange-500 h-1.5"
            />
            <button
              onClick={() => setPos((p) => { const s = Math.min(maxSize, p.size + step); return { size: s, ...clamp(p.x, p.y, s) }; })}
              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0"
            >+</button>
          </div>
          <p className="text-[10px] text-zinc-300 text-center mt-1.5">Design stays within the dashed print zone</p>
        </div>
    </div>
  );
}

// ─── BULK QUOTE MODAL ─────────────────────────────────────────────────────────

function BulkQuoteModal({ product, onClose }: { product: typeof PRODUCTS[0]; onClose: () => void }) {
  const [form, setForm]     = useState({ name: "", email: "", qty: "50", message: "" });
  const [sent, setSent]     = useState(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-2xl leading-none">&times;</button>
        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black mb-2" style={{ letterSpacing: "-0.04em" }}>Quote requested</h3>
            <p className="text-zinc-500 text-sm">We'll email you within 24 hours.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-semibold">Done</button>
          </div>
        ) : (
          <>
            <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-1">Bulk Order</p>
            <h3 className="text-xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>{product.name}</h3>
            <p className="text-zinc-400 text-sm mb-6">MOQ 50 · Screen print / DTF pricing</p>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Name</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-[0.7rem] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Quantity</label>
                <select value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  <option>50</option><option>100</option><option>250</option><option>500</option><option>1000+</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.7rem] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={3} className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                  placeholder="Colors, design specs, deadline…" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
                {sending ? "Sending…" : "Request Quote →"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── PRINT TECHNIQUE INFO MODAL ───────────────────────────────────────────────

function PrintTechniqueInfoModal({ onClose }: { onClose: () => void }) {
  const techniques = [
    {
      id: "DTG",
      label: "Direct-to-Garment",
      sub: "Our signature technique — refined over thousands of prints",
      color: "#111111",
      accent: "text-zinc-600",
      checkColor: "bg-zinc-900",
      pros: [
        "Breathable & soft — ink becomes part of the fabric",
        "Vibrant full-colour reproduction & photographic gradients",
        "Natural hand-feel that gets better with every wash",
        "Works on all garment colours — light, mid-tone, and dark",
        "No MOQ — perfect for single pieces",
      ],
      cons: [],
    },
    {
      id: "DTF",
      label: "Direct-to-Film",
      sub: "A film-transfer option for specific design styles",
      color: "#71717a",
      accent: "text-zinc-400",
      checkColor: "bg-zinc-400",
      pros: [
        "Slightly raised, textured finish",
        "Suits bold, thick-outline graphic prints",
        "Available on request",
      ],
      cons: ["Less breathable than DTG", "Stiffer hand-feel — sits on top of the fabric", "Not our recommended default"],
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-zinc-900 text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">Halftone Labs</p>
            <h2 className="text-lg font-black" style={{ letterSpacing: "-0.03em" }}>Print Techniques</h2>
            <p className="text-xs text-zinc-400 mt-0.5">How we bring your design to life</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300 hover:text-white flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {techniques.map((t) => (
            <div key={t.id} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
              {/* Title row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: t.color }}
                >
                  <span className="text-white text-xs font-black">{t.id}</span>
                </div>
                <div>
                  <p className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.02em" }}>{t.label}</p>
                  <p className="text-[0.7rem] text-zinc-400">{t.sub}</p>
                </div>
              </div>

              {/* Pros */}
              <ul className="space-y-2 mb-3">
                {t.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-xs text-zinc-700">
                    <span className={`w-4 h-4 rounded-full ${t.checkColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {pro}
                  </li>
                ))}
              </ul>

              {/* Cons */}
              <ul className="space-y-1.5 pt-3 border-t border-zinc-200">
                {t.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="w-4 h-4 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Recommendation tip */}
          <div className="flex items-start gap-2.5 bg-zinc-900 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-xs text-white leading-relaxed">
              <strong className="text-orange-400">We recommend DTG for almost everything.</strong> It&apos;s breathable, looks incredible, and we&apos;ve perfected it over thousands of prints. Choose DTF only if you specifically want a raised, textured finish.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CONFIGURATOR ─────────────────────────────────────────────────────────────

const STEPS = ["Style", "Design"];

function OnDemandConfigurator({ product, onClose }: { product: typeof PRODUCTS[0]; onClose: () => void }) {
  const { addItem, count } = useCart();
  const { fmt } = useCurrency();
  const [step, setStep] = useState(0);

  const [photoZone, setPhotoZone] = useState(PHOTO_ZONE);
  useEffect(() => {
    fetch("/api/studio-settings")
      .then((r) => r.json())
      .then((data) => { if (data.print_zones) setPhotoZone(data.print_zones); })
      .catch(() => {});
  }, []);

  const [color,     setColor]     = useState(product.colors[0]);
  const [size,      setSize]      = useState(product.sizes[2] ?? product.sizes[0]);
  const [technique, setTechnique] = useState<"DTG" | "DTF">("DTG");
  const [techInfoOpen, setTechInfoOpen] = useState(false);

  const [activeTab,       setActiveTab]       = useState<"front" | "back">("front");
  const [previewSide,     setPreviewSide]     = useState<"front" | "back">("front");
  const [frontDesignSrc,  setFrontDesignSrc]  = useState("");
  const [backDesignSrc,   setBackDesignSrc]   = useState("");
  const [frontPrintPrice, setFrontPrintPrice] = useState(0);
  const [backPrintPrice,  setBackPrintPrice]  = useState(0);
  const [frontPrintTier,  setFrontPrintTier]  = useState("");
  const [backPrintTier,   setBackPrintTier]   = useState("");
  const [frontPrintDims,  setFrontPrintDims]  = useState("");
  const [noDesign,        setNoDesign]        = useState(false);
  // Track actual design position from each DesignPlacer for pixel-perfect thumbnails
  const [frontPos, setFrontPos] = useState<{ x: number; y: number; size: number } | null>(null);
  const [backPos,  setBackPos]  = useState<{ x: number; y: number; size: number } | null>(null);

  const [added,  setAdded]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const isOversized  = product.id.includes("oversized");
  const zoneKey: keyof typeof PHOTO_ZONE =
    product.id === "baby-tee" ? "baby" : isOversized ? "oversized" : "regular";
  const totalPrint   = frontPrintPrice + backPrintPrice;
  const itemTotal    = product.blankPrice + totalPrint;
  const hasAnyDesign = !!frontDesignSrc || !!backDesignSrc;
  const canAddToCart = hasAnyDesign || noDesign;

  const handleTabSwitch = (tab: "front" | "back") => { setActiveTab(tab); setPreviewSide(tab); };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use FileReader to get a data URL — blob URLs can't be sent to the server
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      if (side === "front") { setFrontDesignSrc(dataUrl); setNoDesign(false); }
      else                  { setBackDesignSrc(dataUrl);  setNoDesign(false); }
    };
    reader.readAsDataURL(file);
    setPreviewSide(side);
    e.target.value = "";
  };

  const handleSaveDesign = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Generate composite thumbnail using exact design position from DesignPlacer
      const thumbnail = color.mockupFront && frontDesignSrc && frontPos
        ? await makeCompositeThumbnail(color.mockupFront, frontDesignSrc, frontPos)
        : color.mockupFront && backDesignSrc && backPos
        ? await makeCompositeThumbnail(color.mockupBack ?? color.mockupFront, backDesignSrc, backPos)
        : frontDesignSrc || backDesignSrc
        ? await makeThumbnail(frontDesignSrc || backDesignSrc)
        : "";
      await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id ?? null,
          customerEmail: session?.user?.email ?? null,
          productId: product.id, productName: product.name, gsm: product.gsm,
          colorName: color.name, colorHex: color.hex, size,
          printTier: [frontPrintTier, backPrintTier].filter(Boolean).join(" + ") || null,
          printDims: frontPrintDims || null,
          blankPrice: product.blankPrice, printPrice: totalPrint,
          hasDesign: hasAnyDesign, thumbnail,
          frontDesignDataUrl: frontDesignSrc || null,
          backDesignDataUrl:  backDesignSrc  || null,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const handleAddToCart = async () => {
    const thumbnail = color.mockupFront && frontDesignSrc && frontPos
      ? await makeCompositeThumbnail(color.mockupFront, frontDesignSrc, frontPos)
      : color.mockupFront && backDesignSrc && backPos
      ? await makeCompositeThumbnail(color.mockupBack ?? color.mockupFront, backDesignSrc, backPos)
      : "";
    addItem({
      productId: product.id, productName: product.name, gsm: product.gsm,
      color: color.name, colorHex: color.hex, size, qty: 1,
      frontDesignUrl: frontDesignSrc, backDesignUrl: backDesignSrc,
      frontPrintPrice, backPrintPrice,
      frontPrintTier, backPrintTier,
      printDims: frontPrintDims,
      printTechnique: hasAnyDesign ? technique : "none",
      blankPrice: product.blankPrice,
      thumbnail,
      mockupFront: color.mockupFront ?? "",
    });
    // Record that checkout was initiated from Studio
    sessionStorage.setItem("checkout_origin", JSON.stringify({ type: "studio" }));
    setAdded(true);
  };

  if (added) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }}>
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
              <button className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Checkout ({count}) →
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeDesignSrc = previewSide === "front" ? frontDesignSrc : backDesignSrc;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-white">
      {/* ── Left: live mockup panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[44%] bg-white relative p-10 border-r border-zinc-100">
        <button onClick={onClose}
          className="absolute top-[72px] left-6 flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <div className="absolute top-[72px] right-6 text-right">
          <p className="text-[0.65rem] font-mono text-zinc-400">{product.gsm}</p>
          <p className="text-sm font-black" style={{ letterSpacing: "-0.03em" }}>{product.name}</p>
        </div>

        {/* Halftone dot bg — only show when no real photo (SVG fallback) */}
        {!color.mockupFront && (
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        )}

        <div className="w-full relative z-10">
          {step === 1 && activeDesignSrc ? (
            previewSide === "front" ? (
              <DesignPlacer key="fp" designSrc={frontDesignSrc} mockupSrc={color.mockupFront ?? ""} zoneKey={zoneKey}
                photoZone={photoZone}
                onPositionChange={(p) => setFrontPos(p)}
                onPriceChange={(p, t, d) => { setFrontPrintPrice(p); setFrontPrintTier(t); setFrontPrintDims(d); }} />
            ) : (
              <DesignPlacer key="bp" designSrc={backDesignSrc} mockupSrc={color.mockupBack ?? color.mockupFront ?? ""} zoneKey={zoneKey}
                photoZone={photoZone}
                onPositionChange={(p) => setBackPos(p)}
                onPriceChange={(p, t, _d) => { setBackPrintPrice(p); setBackPrintTier(t); }} />
            )
          ) : (
            color.mockupFront
              ? <img src={color.mockupFront} alt={color.name} className="w-full h-full object-contain" />
              : <TeeMockup color={color.hex} isOversized={isOversized} />
          )}
        </div>

        {step === 1 && (
          <div className="mt-5 flex gap-2 relative z-10">
            {(["front", "back"] as const).map((s) => (
              <button key={s} onClick={() => setPreviewSide(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  previewSide === s ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {((s === "front" && frontDesignSrc) || (s === "back" && backDesignSrc)) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-sm border border-zinc-100 relative z-10">
          <div className="w-4 h-4 rounded-full border border-zinc-200 flex-shrink-0"
            style={{ background: color.hex }} />
          <span className="text-sm text-zinc-700 font-medium">{color.name} · {size}</span>
          <span className="w-px h-4 bg-zinc-200" />
          <span className="font-black text-zinc-900 text-sm">{fmt(itemTotal)}</span>
        </div>
      </div>

      {/* ── Right: step content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="font-black text-sm" style={{ letterSpacing: "-0.03em" }}>{product.name}</span>
          <span className="font-black text-sm">{fmt(itemTotal)}</span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0 px-6 lg:px-10 pt-6 lg:pt-[72px] pb-4 border-b border-zinc-50">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${i === step ? "text-zinc-900" : i < step ? "text-orange-500 cursor-pointer" : "text-zinc-300 cursor-default"}`}>
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${i === step ? "bg-zinc-900 text-white" : i < step ? "bg-orange-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`mx-3 h-px w-10 ${i < step ? "bg-orange-300" : "bg-zinc-100"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <AnimatePresence mode="wait">

            {/* ── STEP 0: Style ── */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-1">Step 1</p>
                <h2 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Pick your style</h2>
                <p className="text-zinc-400 text-sm mb-8">{product.spec}</p>

                {/* Colour */}
                <div className="mb-8">
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-zinc-400 mb-3">Colour — <span className="text-zinc-700">{color.name}</span></p>
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

                {/* Size */}
                <div className="mb-8">
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-zinc-400 mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technique */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[0.7rem] font-bold uppercase tracking-widest text-zinc-400">Print Technique</p>
                    <button
                      onClick={() => setTechInfoOpen(true)}
                      className="flex items-center gap-1 text-[0.65rem] font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      What&apos;s the difference?
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(["DTG", "DTF"] as const).map((t) => (
                      <button key={t} onClick={() => setTechnique(t)}
                        className={`py-3.5 px-4 rounded-xl border-2 text-left transition-all ${technique === t ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                        <span className="block text-sm font-black" style={{ letterSpacing: "-0.02em" }}>{t}</span>
                        <span className={`block text-[10px] font-normal mt-0.5 ${technique === t ? "text-zinc-300" : "text-zinc-400"}`}>
                          {t === "DTG" ? "Our standard · breathable & vivid" : "Raised texture · on request"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile mockup */}
                <div className="lg:hidden w-44 mx-auto mb-8">
                  {color.mockupFront
                    ? <img src={color.mockupFront} alt={color.name} className="w-full object-contain" />
                    : <TeeMockup color={color.hex} isOversized={isOversized} />}
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
                  Next — Upload your design →
                </button>
              </motion.div>
            )}

            {/* ── STEP 1: Design ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-1">Step 2</p>
                <h2 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Add your design</h2>
                <p className="text-zinc-400 text-sm mb-6">Upload front and/or back. Leave a side blank to skip it.</p>

                {/* Front / Back tabs */}
                <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 mb-6">
                  {(["front", "back"] as const).map((tab) => {
                    const has = tab === "front" ? !!frontDesignSrc : !!backDesignSrc;
                    return (
                      <button key={tab} onClick={() => handleTabSwitch(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                          activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-700"
                        }`}>
                        {tab} print
                        {has && <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Front tab */}
                {activeTab === "front" && (
                  <div>
                    {!frontDesignSrc ? (
                      <label className="block w-full border-2 border-dashed border-zinc-200 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all mb-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-orange-100 transition-colors flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-zinc-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        </div>
                        <p className="font-bold text-zinc-700 mb-1 text-sm">Upload front design</p>
                        <p className="text-xs text-zinc-400">PNG with transparent bg · JPG · WebP</p>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                          onChange={(e) => onFileChange(e, "front")} />
                      </label>
                    ) : (
                      <div className="mb-4">
                        <div className="lg:hidden mb-4">
                          <DesignPlacer key="fpm" designSrc={frontDesignSrc} mockupSrc={color.mockupFront ?? ""} zoneKey={zoneKey}
                            photoZone={photoZone}
                            onPositionChange={(p) => setFrontPos(p)}
                            onPriceChange={(p, t, d) => { setFrontPrintPrice(p); setFrontPrintTier(t); setFrontPrintDims(d); }} />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl mb-3">
                          <div>
                            <p className="text-[0.65rem] text-zinc-500 font-medium">Front print</p>
                            <p className="font-bold text-zinc-800">{frontPrintTier} <span className="text-zinc-400 font-normal">({frontPrintDims})</span></p>
                          </div>
                          <p className="font-black text-orange-600">+{fmt(frontPrintPrice)}</p>
                        </div>
                        <div className="flex gap-3">
                          <label className="text-xs text-orange-500 font-semibold underline hover:text-orange-600 cursor-pointer">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "front")} />
                          </label>
                          <span className="text-zinc-200">·</span>
                          <button onClick={() => { setFrontDesignSrc(""); setFrontPrintPrice(0); setFrontPrintTier(""); setFrontPrintDims(""); }}
                            className="text-xs text-zinc-400 font-semibold underline hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    )}
                    {!frontDesignSrc && <p className="text-xs text-zinc-300 text-center">Leave blank to skip front</p>}
                  </div>
                )}

                {/* Back tab */}
                {activeTab === "back" && (
                  <div>
                    {!backDesignSrc ? (
                      <label className="block w-full border-2 border-dashed border-zinc-200 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all mb-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-orange-100 transition-colors flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-zinc-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        </div>
                        <p className="font-bold text-zinc-700 mb-1 text-sm">Upload back design</p>
                        <p className="text-xs text-zinc-400">PNG with transparent bg · JPG · WebP</p>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                          onChange={(e) => onFileChange(e, "back")} />
                      </label>
                    ) : (
                      <div className="mb-4">
                        <div className="lg:hidden mb-4">
                          <DesignPlacer key="bpm" designSrc={backDesignSrc} mockupSrc={color.mockupBack ?? color.mockupFront ?? ""} zoneKey={zoneKey}
                            photoZone={photoZone}
                            onPositionChange={(p) => setBackPos(p)}
                            onPriceChange={(p, t, _d) => { setBackPrintPrice(p); setBackPrintTier(t); }} />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl mb-3">
                          <div>
                            <p className="text-[0.65rem] text-zinc-500 font-medium">Back print</p>
                            <p className="font-bold text-zinc-800">{backPrintTier}</p>
                          </div>
                          <p className="font-black text-orange-600">+{fmt(backPrintPrice)}</p>
                        </div>
                        <div className="flex gap-3">
                          <label className="text-xs text-orange-500 font-semibold underline hover:text-orange-600 cursor-pointer">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "back")} />
                          </label>
                          <span className="text-zinc-200">·</span>
                          <button onClick={() => { setBackDesignSrc(""); setBackPrintPrice(0); setBackPrintTier(""); }}
                            className="text-xs text-zinc-400 font-semibold underline hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    )}
                    {!backDesignSrc && <p className="text-xs text-zinc-300 text-center">Leave blank to skip back</p>}
                  </div>
                )}

                {/* Blank option */}
                <div className="flex items-center gap-3 my-5">
                  <hr className="flex-1 border-zinc-100" /><span className="text-xs text-zinc-300 font-medium">or</span><hr className="flex-1 border-zinc-100" />
                </div>
                <button onClick={() => { setNoDesign(true); setFrontDesignSrc(""); setBackDesignSrc(""); setFrontPrintPrice(0); setBackPrintPrice(0); setFrontPrintTier(""); setBackPrintTier(""); setFrontPrintDims(""); }}
                  className={`w-full py-3 rounded-xl border-2 text-sm font-bold transition-all mb-6 ${noDesign ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                  Blank tee — no print
                </button>

                {!canAddToCart && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-4">
                    ⚠️ Upload at least one design, or choose blank.
                  </p>
                )}

                {/* Price breakdown */}
                <div className="bg-zinc-50 rounded-2xl p-4 mb-4 border border-zinc-100">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-zinc-400">Blank garment</span>
                    <span className="text-sm font-bold">{fmt(product.blankPrice)}</span>
                  </div>
                  {frontPrintPrice > 0 && (
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-zinc-400">Front print ({frontPrintTier})</span>
                      <span className="text-sm font-bold text-orange-600">+{fmt(frontPrintPrice)}</span>
                    </div>
                  )}
                  {backPrintPrice > 0 && (
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-zinc-400">Back print ({backPrintTier})</span>
                      <span className="text-sm font-bold text-orange-600">+{fmt(backPrintPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 mt-1 border-t border-zinc-200">
                    <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">Item total</span>
                    <span className="font-black text-zinc-900">{fmt(itemTotal)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1.5">+ shipping &amp; GST at checkout · 🇮🇳 Fulfilled from India</p>
                </div>

                {/* Save design */}
                <button disabled={saving} onClick={handleSaveDesign}
                  className={`w-full mb-3 py-3 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    saved ? "border-green-400 bg-green-50 text-green-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                  } disabled:opacity-50`}>
                  {saved ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>
                  ) : saving ? "Saving…" : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save design to account</>
                  )}
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)}
                    className="px-5 py-3.5 rounded-2xl border border-zinc-200 text-sm font-bold hover:bg-zinc-50 transition-colors">
                    ← Back
                  </button>
                  <button disabled={!canAddToCart} onClick={handleAddToCart}
                    className="flex-1 py-3.5 rounded-2xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Add to Cart — {fmt(itemTotal)}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Print technique info modal */}
      <AnimatePresence>
        {techInfoOpen && <PrintTechniqueInfoModal onClose={() => setTechInfoOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onOrder, onBulkQuote }: {
  product: typeof PRODUCTS[0];
  onOrder: () => void;
  onBulkQuote: () => void;
}) {
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const isOversized = product.id.includes("oversized");
  const { fmt } = useCurrency();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Mockup area */}
      <div className="relative overflow-hidden" style={{ background: "#f4f3f0" }}>
        {/* Halftone dot background */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "14px 14px" }} />

        {product.tag && (
          <span className="absolute top-4 left-4 z-10 text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-900 text-white">
            {product.tag}
          </span>
        )}

        {/* Color strip */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5">
          {product.colors.map((c) => (
            <button key={c.name} title={c.name}
              onMouseEnter={() => setActiveColor(c)}
              onClick={() => setActiveColor(c)}
              className="w-4 h-4 rounded-full transition-transform hover:scale-125 focus:outline-none"
              style={{
                background: c.hex,
                border: activeColor.name === c.name ? "2px solid #f15533" : c.border ? "1.5px solid #cbd5e1" : "1.5px solid transparent",
                boxShadow: activeColor.name === c.name ? "0 0 0 1px white, 0 0 0 3px #f15533" : "none",
              }} />
          ))}
        </div>

        <div className="aspect-square w-full overflow-hidden">
          {activeColor.mockupFront ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeColor.mockupFront}
              alt={`${product.name} in ${activeColor.name}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="px-10 pt-10 pb-4 h-full flex items-center">
              <div className="w-full max-w-[180px] mx-auto drop-shadow-sm">
                <TeeMockup color={activeColor.hex} isOversized={isOversized} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-black text-zinc-900 text-base leading-tight" style={{ letterSpacing: "-0.03em" }}>
              {product.name}
            </h3>
            <span className="font-black text-zinc-900 text-base flex-shrink-0">{fmt(product.blankPrice)}</span>
          </div>
          <p className="text-[0.7rem] font-mono text-zinc-400">{product.gsm}</p>
          <p className="text-xs text-zinc-500 mt-1">{product.fit}</p>
        </div>

        {/* Bulk tiers */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {product.bulkTiers.map((t) => (
            <span key={t.qty} className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-500">
              {t.qty} pcs → {fmt(t.priceInr)}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={onOrder}
            className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Customise →
          </button>
          <button onClick={onBulkQuote} title="Request bulk quote (MOQ 50)"
            className="px-4 py-3 rounded-xl border-2 border-zinc-100 text-zinc-500 text-sm font-bold hover:border-zinc-300 hover:text-zinc-700 transition-colors">
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
  const [bulkProduct,   setBulkProduct]   = useState<typeof PRODUCTS[0] | null>(null);
  const [sizeGuide,     setSizeGuide]     = useState(false);
  const [allProducts,   setAllProducts]   = useState<typeof PRODUCTS>(PRODUCTS);
  const { count } = useCart();

  // Merge static products with any active DB products from admin
  useEffect(() => {
    fetch("/api/studio-products")
      .then((r) => r.json())
      .then((dbProducts) => {
        if (!Array.isArray(dbProducts) || dbProducts.length === 0) return;
        // Map DB product shape → same shape as PRODUCTS
        const mapped = dbProducts.map((p: {
          id: string; name: string; gsm?: string; description?: string;
          blank_price: number; type: string; size_guide_key: string;
          colors: typeof PRODUCTS[0]["colors"]; active: boolean;
        }) => ({
          id: p.id,
          name: p.name,
          gsm: p.gsm ?? "",
          spec: "",
          fit: "",
          description: p.description ?? "",
          blankPrice: p.blank_price,
          sizes: p.type === "baby" ? ["XS","S","M","L","XL","2XL"] : ["XS","S","M","L","XL","2XL","3XL"],
          sizeGuideKey: p.size_guide_key as typeof PRODUCTS[0]["sizeGuideKey"],
          colors: p.colors ?? [],
          bulkTiers: [] as typeof PRODUCTS[0]["bulkTiers"],
          tag: null as string | null,
        }));
        setAllProducts([...PRODUCTS, ...mapped]);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />

      <div className="min-h-screen" style={{ background: "#f8f7f5" }}>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden border-b border-zinc-200/60">
          {/* Halftone dot bg */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-5">[ Halftone Labs Studio ]</p>
              <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black text-zinc-900 leading-[0.88] mb-6"
                style={{ letterSpacing: "-0.055em" }}>
                Design it.
                <br />
                <span style={{ WebkitTextStroke: "2px #111", color: "transparent" }}>We&nbsp;print it.</span>
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 mb-8">
                {[
                  { dot: "#22c55e", text: "MOQ 1 — no bulk required" },
                  { dot: "#f97316", text: "DTG & DTF printing" },
                  { dot: "#3b82f6", text: "Ships in 5–7 days" },
                  { dot: "#a855f7", text: "Fulfilled from India" },
                ].map(({ dot, text }) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                    {text}
                  </span>
                ))}
              </div>

              {count > 0 && (
                <Link href="/checkout">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Checkout {count} item{count !== 1 ? "s" : ""} →
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── Products ── */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-1">Blanks catalogue</p>
              <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Choose your blank</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setSizeGuide(true)} className="text-xs font-semibold text-orange-500 underline underline-offset-2 hover:text-orange-600 transition-colors hidden sm:block">
                Size Guide
              </button>
              <p className="text-xs text-zinc-400 hidden sm:block">All prices per unit · GST extra</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allProducts.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}>
                <ProductCard product={p}
                  onOrder={() => setActiveProduct(p)}
                  onBulkQuote={() => setBulkProduct(p)} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Print Technique ── */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="border-t border-zinc-200/60 pt-16">
            <div className="text-center mb-10">
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-2">Our Print Process</p>
              <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>
                We&apos;ve perfected DTG printing
              </h2>
              <p className="text-zinc-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                Direct-to-Garment is our signature technique — refined over thousands of prints. Breathable, vibrant, and designed to feel like it was always part of the fabric.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              <div className="bg-zinc-900 text-white rounded-2xl p-6 border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[0.6rem] font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded-full">Recommended</div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-900 text-xs font-black">DTG</span>
                  </div>
                  <div>
                    <p className="font-black text-white text-sm" style={{ letterSpacing: "-0.02em" }}>Direct-to-Garment</p>
                    <p className="text-[0.7rem] text-zinc-400">Ink printed directly into the fabric</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {["Breathable — feels like part of the garment","Vibrant full-colour reproduction & photographic detail","Soft, natural hand-feel that improves with washing","Works beautifully across all garment colours","No MOQ — single pieces welcome"].map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-xs text-zinc-300">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-500 text-xs font-black">DTF</span>
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.02em" }}>Direct-to-Film</p>
                    <p className="text-[0.7rem] text-zinc-400">Film transfer, heat-pressed onto fabric</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {["Slightly raised, textured finish","Suits bold graphics with thick outlines","Available on request for specific designs"].map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-xs text-zinc-500">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {pro}
                    </li>
                  ))}
                </ul>
                <p className="text-[0.65rem] text-zinc-400 mt-4 pt-3 border-t border-zinc-100">
                  Not sure? Default to DTG — you won&apos;t be disappointed.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-zinc-400">
                Questions? <a href="mailto:hello@halftonelabs.in" className="text-orange-500 font-semibold hover:underline">hello@halftonelabs.in</a>
              </p>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {activeProduct && <OnDemandConfigurator product={activeProduct} onClose={() => setActiveProduct(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {bulkProduct && <BulkQuoteModal product={bulkProduct} onClose={() => setBulkProduct(null)} />}
      </AnimatePresence>
      <SizeGuide open={sizeGuide} onClose={() => setSizeGuide(false)} />
    </>
  );
}
