"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

// Printable zone as % of canvas (matches tee chest area)
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

const COUNTRY_LIST = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "AE", name: "UAE" },
  { code: "JP", name: "Japan" },
  { code: "NZ", name: "New Zealand" },
];

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
    accentColor: "#f15533",
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
    accentColor: "#9e6c9e",
    tag: "New",
  },
  {
    id: "oversized-tee-ft",
    name: "Oversized Tee",
    gsm: "240 GSM · French Terry",
    fabric: "100% combed cotton, french terry",
    fit: "Drop-shoulder oversized fit, looped back for warmth",
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
    accentColor: "#2355C0",
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
    accentColor: "#F5C2C7",
    tag: null,
  },
];

// ─── TEE SVG MOCKUP ───────────────────────────────────────────────────────────

function TeeMockup({
  color,
  colorName,
  designSrc,
  designPos,
  designSize,
  isOversized,
}: {
  color: string;
  colorName: string;
  designSrc?: string;
  designPos?: { x: number; y: number };
  designSize?: number;
  isOversized?: boolean;
}) {
  const isDark = ["#111111", "#1B2A4A", "#2355C0", "#C0392B", "#6B2D2D", "#3A3A3A"].includes(color);

  // Different silhouette for oversized
  const bodyPath = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collarPath = isOversized
    ? "M70 32 Q100 52 130 32"
    : "M75 38 Q100 56 125 38";

  return (
    <svg viewBox="0 0 200 230" className="w-full h-full" style={{ maxHeight: "480px" }}>
      {/* Shadow */}
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.08)" />
      {/* Body */}
      <path d={bodyPath} fill={color} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"} strokeWidth="1.5" />
      {/* Collar */}
      <path d={collarPath} fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"} strokeWidth="1.5" />
      {/* Print zone indicator (dashed) — only when no design */}
      {!designSrc && (
        <rect
          x={200 * ZONE_PCT.x}
          y={230 * ZONE_PCT.y}
          width={200 * ZONE_PCT.w}
          height={230 * ZONE_PCT.h}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          rx="2"
        />
      )}
      {/* Placed design image */}
      {designSrc && designPos && designSize != null && (
        <image
          href={designSrc}
          x={designPos.x - designSize / 2}
          y={designPos.y - designSize / 2}
          width={designSize}
          height={designSize}
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </svg>
  );
}

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────

interface PlacerState {
  x: number; // SVG coords (0–200)
  y: number; // SVG coords (0–230)
  size: number; // SVG units
}

function DesignPlacer({
  designSrc,
  color,
  colorName,
  isOversized,
  onPriceChange,
}: {
  designSrc: string;
  color: string;
  colorName: string;
  isOversized: boolean;
  onPriceChange: (price: number, tier: string, dims: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<PlacerState>({ x: 100, y: 115, size: 60 });
  const dragging = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // Convert DOM coords to SVG coords
  const toSVG = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const sx = (clientX - rect.left) / rect.width * 200;
    const sy = (clientY - rect.top) / rect.height * 230;
    return { x: sx, y: sy };
  }, []);

  const updatePrice = useCallback((size: number) => {
    const zoneW = 200 * ZONE_PCT.w;
    const zoneH = 230 * ZONE_PCT.h;
    const fracW = size / zoneW;
    const fracH = size / zoneH;
    const realW = fracW * MAX_PRINT_W_IN;
    const realH = fracH * MAX_PRINT_H_IN;
    const sqin = realW * realH;
    const tier = getTier(sqin);
    onPriceChange(tier.price, tier.label, `${realW.toFixed(1)}"×${realH.toFixed(1)}"`);
  }, [onPriceChange]);

  useEffect(() => { updatePrice(pos.size); }, [pos.size, updatePrice]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGImageElement>) => {
    e.preventDefault();
    (e.target as SVGImageElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    const svg = toSVG(e.clientX, e.clientY);
    dragOffset.current = { dx: svg.x - pos.x, dy: svg.y - pos.y };
  }, [pos, toSVG]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const svg = toSVG(e.clientX, e.clientY);
    const nx = Math.max(30, Math.min(170, svg.x - dragOffset.current.dx));
    const ny = Math.max(30, Math.min(200, svg.y - dragOffset.current.dy));
    setPos((p) => ({ ...p, x: nx, y: ny }));
  }, [toSVG]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const isDark = ["#111111", "#1B2A4A", "#2355C0", "#C0392B", "#6B2D2D", "#3A3A3A"].includes(color);
  const bodyPath = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collarPath = isOversized
    ? "M70 32 Q100 52 130 32"
    : "M75 38 Q100 56 125 38";

  return (
    <div className="flex flex-col gap-4">
      <svg
        ref={svgRef}
        viewBox="0 0 200 230"
        className="w-full cursor-move select-none"
        style={{ maxHeight: "400px" }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.08)" />
        <path d={bodyPath} fill={color} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"} strokeWidth="1.5" />
        <path d={collarPath} fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"} strokeWidth="1.5" />
        {/* Print zone */}
        <rect
          x={200 * ZONE_PCT.x} y={230 * ZONE_PCT.y}
          width={200 * ZONE_PCT.w} height={230 * ZONE_PCT.h}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
          strokeWidth="0.8" strokeDasharray="3 3" rx="2"
        />
        {/* Draggable design */}
        <image
          href={designSrc}
          x={pos.x - pos.size / 2}
          y={pos.y - pos.size / 2}
          width={pos.size}
          height={pos.size}
          style={{ cursor: "grab" }}
          onPointerDown={onPointerDown}
        />
        {/* Drag hint */}
        <text
          x="100" y="228"
          textAnchor="middle"
          fontSize="5"
          fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
        >
          drag to reposition
        </text>
      </svg>

      {/* Size slider */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Design size</span>
          <span>drag slider to resize</span>
        </div>
        <input
          type="range"
          min={20} max={120} value={pos.size}
          onChange={(e) => setPos((p) => ({ ...p, size: Number(e.target.value) }))}
          className="w-full accent-orange-500"
        />
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
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://formspree.io/f/xlgplaja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Bulk Quote Request — ${product.name} — ${form.qty} pcs`,
          product: product.name,
          ...form,
        }),
      });
      setSent(true);
    } catch {}
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-2xl leading-none">&times;</button>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="text-xl font-semibold mb-2">Quote Requested</h3>
            <p className="text-zinc-500 text-sm">We'll email you within 24 hours with pricing for your bulk order.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm">Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-1">Bulk Quote</h3>
            <p className="text-zinc-500 text-sm mb-6">{product.name} · Screen print · MOQ 50 pcs</p>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Your name</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Name" />
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
                <label className="block text-xs text-zinc-500 mb-1">Notes (colours, design specs, etc.)</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={3} className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" placeholder="Tell us about your project..." />
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

// ─── ORDER CONFIGURATOR (Assembly-style split panel) ──────────────────────────

const STEPS = ["Style", "Design", "Delivery", "Review"];

interface ShippingOption {
  name: string;
  price: number;
  days: string;
}

function OnDemandConfigurator({
  product,
  onClose,
}: {
  product: typeof PRODUCTS[0];
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  // Step 0 — Style
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]);

  // Step 1 — Design
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designSrc, setDesignSrc] = useState<string>("");
  const [printPrice, setPrintPrice] = useState(0);
  const [printTier, setPrintTier] = useState("");
  const [printDims, setPrintDims] = useState("");
  const [noDesign, setNoDesign] = useState(false);

  // Step 2 — Delivery
  const [country, setCountry] = useState("IN");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", pin: "", state: "",
    billingName: "", billingAddress: "", billingCity: "", billingPin: "",
    sameAsBilling: true,
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Step 3 — Pay
  const [paying, setPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ ref: string } | null>(null);
  const [payError, setPayError] = useState("");

  // Handle file upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignFile(file);
    const url = URL.createObjectURL(file);
    setDesignSrc(url);
    setNoDesign(false);
  };

  // Fetch shipping rates when entering step 2
  const fetchShipping = useCallback(async () => {
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, pin: form.pin || "201304" }),
      });
      const data = await res.json();
      if (data.rates?.length) {
        setShippingOptions(data.rates);
        setSelectedShipping(data.rates[0]);
      }
    } catch {}
    setLoadingShipping(false);
  }, [country, form.pin]);

  useEffect(() => {
    if (step === 2) fetchShipping();
  }, [step, country]);

  const baseTotal = product.blankPrice + printPrice + (selectedShipping?.price ?? 0);

  // Razorpay payment
  const handlePay = async () => {
    setPaying(true);
    setPayError("");
    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: baseTotal }),
      });
      const { orderId, key } = await orderRes.json();

      // 2. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const options = {
          key,
          amount: baseTotal * 100,
          currency: "INR",
          order_id: orderId,
          name: "Halftone Labs",
          description: `${product.name} — ${color.name}`,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#f15533" },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string }) => {
            // 3. Save order
            const ref = `HL${Date.now().toString(36).toUpperCase()}`;
            try {
              await fetch("/api/save-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderRef: ref,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  product: `${product.name} (${product.gsm})`,
                  color: color.name,
                  size,
                  printTier: printTier || null,
                  printDimensions: printDims || null,
                  blankPrice: product.blankPrice,
                  printPrice,
                  shipping: selectedShipping?.price ?? 0,
                  total: baseTotal,
                  customerName: form.name,
                  customerEmail: form.email,
                  customerPhone: form.phone,
                  address: form.address + ", " + form.city + " " + form.pin + (form.state ? ", " + form.state : ""),
                  city: form.city,
                  pin: form.pin,
                  country,
                }),
              });
              setOrderSuccess({ ref });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        };
        // @ts-ignore
        const rz = new window.Razorpay(options);
        rz.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "Payment cancelled") setPayError(msg);
    }
    setPaying(false);
  };

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  const isOversized = product.id.includes("oversized");

  // ── Success screen ──
  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl max-w-md w-full mx-4 p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-zinc-500 mb-1">Order reference:</p>
          <p className="text-xl font-mono font-semibold text-orange-500 mb-4">{orderSuccess.ref}</p>
          <p className="text-zinc-500 text-sm mb-6">
            We've sent a confirmation to <strong>{form.email}</strong>. Track your order anytime at{" "}
            <Link href="/track" className="text-orange-500 underline">/track</Link>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/track" className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors">
              Track Order
            </Link>
            <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
              Back to Studio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden" style={{ background: "#f8f7f5" }}>
      {/* Left — Mockup panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[45%] bg-white border-r border-zinc-100 relative p-10">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Product info */}
        <div className="absolute top-6 right-6 text-right">
          <p className="text-xs text-zinc-400">{product.gsm}</p>
          <p className="text-sm font-semibold text-zinc-800">{product.name}</p>
        </div>

        {/* Tee mockup */}
        <div className="w-full max-w-xs">
          {step === 1 && designSrc ? (
            <DesignPlacer
              designSrc={designSrc}
              color={color.hex}
              colorName={color.name}
              isOversized={isOversized}
              onPriceChange={(price, tier, dims) => {
                setPrintPrice(price);
                setPrintTier(tier);
                setPrintDims(dims);
              }}
            />
          ) : (
            <TeeMockup
              color={color.hex}
              colorName={color.name}
              isOversized={isOversized}
            />
          )}
        </div>

        {/* Live pricing pill */}
        <div className="mt-6 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center gap-3">
          <span>{product.name} · {color.name} · {size}</span>
          <span className="w-px h-4 bg-white/20" />
          <span className="font-bold">₹{baseTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Right — Config panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-white">
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="font-semibold text-sm">{product.name}</span>
          <span className="font-bold text-sm">₹{baseTotal.toLocaleString("en-IN")}</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 px-6 lg:px-10 pt-6 pb-4 bg-white lg:bg-transparent">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${i === step ? "text-zinc-900" : i < step ? "text-orange-500 cursor-pointer" : "text-zinc-400 cursor-default"}`}
              >
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold transition-colors ${i === step ? "bg-zinc-900 text-white" : i < step ? "bg-orange-500 text-white" : "bg-zinc-200 text-zinc-500"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`mx-2 h-px w-6 lg:w-10 transition-colors ${i < step ? "bg-orange-400" : "bg-zinc-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Style ── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-1">Pick your style</h2>
                <p className="text-zinc-500 text-sm mb-8">{product.fabric}</p>

                {/* Colour */}
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Colour — {color.name}</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        title={c.name}
                        onClick={() => setColor(c)}
                        className="w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none"
                        style={{
                          background: c.hex,
                          border: color.name === c.name ? "3px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                          boxShadow: color.name === c.name ? "0 0 0 2px white, 0 0 0 4px #f15533" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${size === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">Unisex sizing · <a href="#" className="underline">Size guide</a></p>
                </div>

                {/* Mobile tee preview */}
                <div className="lg:hidden w-48 mx-auto mb-8">
                  <TeeMockup color={color.hex} colorName={color.name} isOversized={isOversized} />
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 transition-colors"
                >
                  Next — Add Your Design
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Design ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-1">Your design</h2>
                <p className="text-zinc-500 text-sm mb-8">Upload a PNG — drag and resize it on the tee</p>

                {!designSrc ? (
                  <label className="block w-full border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors mb-6">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="font-semibold text-zinc-700 mb-1">Upload PNG file</p>
                    <p className="text-xs text-zinc-400">PNG with transparent background works best</p>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
                  </label>
                ) : (
                  <div className="mb-6">
                    {/* Mobile placer */}
                    <div className="lg:hidden">
                      <DesignPlacer
                        designSrc={designSrc}
                        color={color.hex}
                        colorName={color.name}
                        isOversized={isOversized}
                        onPriceChange={(price, tier, dims) => {
                          setPrintPrice(price);
                          setPrintTier(tier);
                          setPrintDims(dims);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4 p-4 bg-orange-50 rounded-xl">
                      <div>
                        <p className="text-xs text-zinc-500">Print size</p>
                        <p className="font-semibold text-zinc-800">{printTier} ({printDims})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Print cost</p>
                        <p className="font-bold text-orange-600">+₹{printPrice}</p>
                      </div>
                    </div>
                    <button onClick={() => { setDesignSrc(""); setDesignFile(null); setPrintPrice(0); }}
                      className="mt-3 text-xs text-zinc-400 underline hover:text-zinc-600">
                      Remove design
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 my-4">
                  <hr className="flex-1 border-zinc-200" />
                  <span className="text-xs text-zinc-400">or</span>
                  <hr className="flex-1 border-zinc-200" />
                </div>

                <button
                  onClick={() => { setNoDesign(true); setPrintPrice(0); setPrintTier(""); setPrintDims(""); }}
                  className={`w-full py-3 rounded-xl border-2 text-sm font-medium transition-all mb-8 ${noDesign ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}
                >
                  Blank tee — no print
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-5 py-3 rounded-2xl border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                    Back
                  </button>
                  <button
                    disabled={!designSrc && !noDesign}
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                  >
                    Next — Delivery
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Delivery ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-1">Delivery details</h2>
                <p className="text-zinc-500 text-sm mb-8">Where should we ship your order?</p>

                <div className="flex flex-col gap-4">
                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-widest">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      {COUNTRY_LIST.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-widest">Full name</label>
                    <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Your full name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-widest">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-widest">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-widest">Shipping address</p>
                    <div className="flex flex-col gap-3">
                      <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Street address, apartment, suite…" />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="City" />
                        <input value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder={country === "IN" ? "PIN code" : "Postal code"} />
                      </div>
                      {country === "IN" && (
                        <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="State" />
                      )}
                    </div>
                  </div>

                  {/* Billing address toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div
                        onClick={() => setForm((f) => ({ ...f, sameAsBilling: !f.sameAsBilling }))}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.sameAsBilling ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"}`}
                      >
                        {form.sameAsBilling && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-sm text-zinc-700">Billing address same as shipping</span>
                    </label>

                    {!form.sameAsBilling && (
                      <div className="mt-4 flex flex-col gap-3">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Billing address</p>
                        <input value={form.billingName} onChange={(e) => setForm((f) => ({ ...f, billingName: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="Name on billing" />
                        <input value={form.billingAddress} onChange={(e) => setForm((f) => ({ ...f, billingAddress: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="Billing address" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={form.billingCity} onChange={(e) => setForm((f) => ({ ...f, billingCity: e.target.value }))}
                            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="City" />
                          <input value={form.billingPin} onChange={(e) => setForm((f) => ({ ...f, billingPin: e.target.value }))}
                            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="PIN / Postal code" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping options */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-widest">Shipping method</p>
                    {loadingShipping ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-400 py-4">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Calculating rates…
                      </div>
                    ) : shippingOptions.length === 0 ? (
                      <div className="text-sm text-zinc-400 py-2">
                        Enter address above to see shipping options.{" "}
                        <button onClick={fetchShipping} className="text-orange-500 underline">Refresh</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {shippingOptions.map((opt) => (
                          <button
                            key={opt.name}
                            onClick={() => setSelectedShipping(opt)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${selectedShipping?.name === opt.name ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"}`}
                          >
                            <div className="text-left">
                              <p className="font-medium text-zinc-800">{opt.name}</p>
                              <p className="text-xs text-zinc-400">{opt.days}</p>
                            </div>
                            <p className="font-semibold">₹{opt.price}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                    Back
                  </button>
                  <button
                    disabled={!form.name || !form.email || !form.address || !form.city || !selectedShipping}
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                  >
                    Next — Review & Pay
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Review & Pay ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-1">Review your order</h2>
                <p className="text-zinc-500 text-sm mb-8">Check the details before paying.</p>

                {/* Order summary */}
                <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100 mb-6 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-zinc-800">{product.name}</p>
                      <p className="text-xs text-zinc-400">{product.gsm} · {color.name} · Size {size}</p>
                    </div>
                    <p className="font-semibold">₹{product.blankPrice}</p>
                  </div>
                  {printPrice > 0 && (
                    <div className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-medium text-zinc-800">DTG Print</p>
                        <p className="text-xs text-zinc-400">{printTier} ({printDims})</p>
                      </div>
                      <p className="font-semibold">₹{printPrice}</p>
                    </div>
                  )}
                  {noDesign && (
                    <div className="flex items-center justify-between px-5 py-4">
                      <p className="text-zinc-500 text-sm">Blank tee — no print</p>
                      <p className="text-zinc-400">₹0</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-medium text-zinc-800">Shipping</p>
                      <p className="text-xs text-zinc-400">{selectedShipping?.name} · {selectedShipping?.days}</p>
                    </div>
                    <p className="font-semibold">₹{selectedShipping?.price ?? 0}</p>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4 bg-zinc-50">
                    <p className="font-bold text-zinc-900">Total</p>
                    <p className="font-bold text-xl text-zinc-900">₹{baseTotal.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="bg-white rounded-2xl border border-zinc-100 px-5 py-4 mb-8">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Delivering to</p>
                  <p className="font-medium text-zinc-800">{form.name}</p>
                  <p className="text-sm text-zinc-500">{form.email} · {form.phone}</p>
                  <p className="text-sm text-zinc-500 mt-1">{form.address}, {form.city} {form.pin}</p>
                  <p className="text-sm text-zinc-500">{COUNTRY_LIST.find((c) => c.code === country)?.name}</p>
                </div>

                {payError && (
                  <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                    {payError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="flex-1 py-4 rounded-2xl font-bold text-base bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Processing…
                      </>
                    ) : (
                      <>Pay ₹{baseTotal.toLocaleString("en-IN")} →</>
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 text-center mt-4">
                  Secured by Razorpay · Questions? <a href="mailto:hello@halftonelabs.in" className="underline">hello@halftonelabs.in</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOrder,
  onBulkQuote,
}: {
  product: typeof PRODUCTS[0];
  onOrder: () => void;
  onBulkQuote: () => void;
}) {
  const [hoverColor, setHoverColor] = useState(product.colors[0]);
  const isOversized = product.id.includes("oversized");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all shadow-sm hover:shadow-md"
    >
      {/* Tee mockup area */}
      <div className="relative bg-zinc-50 px-10 pt-8 pb-2" style={{ minHeight: 260 }}>
        {product.tag && (
          <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 text-white">
            {product.tag}
          </span>
        )}
        <div className="w-full max-w-[180px] mx-auto">
          <TeeMockup color={hoverColor.hex} colorName={hoverColor.name} isOversized={isOversized} />
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-6 pt-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-bold text-zinc-900 text-lg leading-tight">{product.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{product.gsm}</p>
          </div>
          <p className="text-lg font-bold text-zinc-900 shrink-0">from ₹{product.blankPrice}</p>
        </div>
        <p className="text-xs text-zinc-500 mb-4">{product.fit}</p>

        {/* Colour swatches */}
        <div className="flex gap-2 mb-5">
          {product.colors.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onMouseEnter={() => setHoverColor(c)}
              onClick={() => setHoverColor(c)}
              className="w-5 h-5 rounded-full transition-transform hover:scale-125 focus:outline-none"
              style={{
                background: c.hex,
                border: hoverColor.name === c.name ? "2px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                boxShadow: hoverColor.name === c.name ? "0 0 0 1px white, 0 0 0 3px #f15533" : "none",
              }}
            />
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          <button
            onClick={onOrder}
            className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Customise → Order
          </button>
          <button
            onClick={onBulkQuote}
            className="px-4 py-3 rounded-xl border-2 border-zinc-200 text-zinc-600 text-sm font-medium hover:border-zinc-400 transition-colors"
            title="Get bulk quote (MOQ 50)"
          >
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

  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5]">
        {/* Hero */}
        <div className="pt-28 pb-16 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">
              Halftone Labs Studio
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 leading-tight mb-4">
              Design. Print. Ship.
            </h1>
            <p className="text-zinc-500 text-lg max-w-md mx-auto mb-8">
              Custom printed tees starting at MOQ 1. DTG print on premium blanks — shipped in 5–7 days.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />MOQ 1 on demand</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />DTG / DTF print</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />Ships worldwide</span>
            </div>
          </motion.div>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard
                  product={p}
                  onOrder={() => setActiveProduct(p)}
                  onBulkQuote={() => setBulkProduct(p)}
                />
              </motion.div>
            ))}
          </div>

          {/* Info strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🖨️", title: "DTG Printing", desc: "Direct-to-garment print. No minimums, full colour, photographic quality." },
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

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Questions? Reach us at{" "}
              <a href="mailto:hello@halftonelabs.in" className="text-orange-500 font-medium hover:underline">
                hello@halftonelabs.in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Configurator overlay */}
      <AnimatePresence>
        {activeProduct && (
          <OnDemandConfigurator
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Bulk quote modal */}
      <AnimatePresence>
        {bulkProduct && (
          <BulkQuoteModal product={bulkProduct} onClose={() => setBulkProduct(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
