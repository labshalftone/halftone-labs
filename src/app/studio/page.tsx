"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SHIPPING = 99;

// Printable zone as % of canvas (matches tee chest area in SVG)
const ZONE_PCT = { x: 0.28, y: 0.22, w: 0.44, h: 0.44 };

// Max real-world print dimensions at full scale
const MAX_PRINT_W_IN = 19;
const MAX_PRINT_H_IN = 15.5;

// Price tiers — snap based on area
const PRINT_TIERS = [
  { label: '5×5"',      sqin: 25,    price: 120 },
  { label: '6×10"',     sqin: 60,    price: 180 },
  { label: '8.5×11"',   sqin: 93.5,  price: 230 },
  { label: '12×12"',    sqin: 144,   price: 280 },
  { label: '14×16"',    sqin: 224,   price: 330 },
  { label: '19×15.5"',  sqin: 294.5, price: 400 },
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
    accentColor: "#9e6c9e",
    svgPath: "M40 55 L15 90 L55 98 L55 210 L145 210 L145 98 L185 90 L160 55 L125 38 Q100 28 75 38 Z",
    svgCollar: "M75 38 Q100 55 125 38",
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
    accentColor: "#f15533",
    svgPath: "M30 50 L10 90 L50 95 L50 210 L150 210 L150 95 L190 90 L170 50 L130 30 Q100 20 70 30 Z",
    svgCollar: "M70 30 Q100 50 130 30",
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
      { name: "Acid Wash", hex: "#3A3A3A" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹549" },
      { qty: "100–249 pcs", price: "₹499" },
      { qty: "250+ pcs", price: "₹449" },
    ],
    accentColor: "#f15533",
    svgPath: "M30 50 L10 90 L50 95 L50 210 L150 210 L150 95 L190 90 L170 50 L130 30 Q100 20 70 30 Z",
    svgCollar: "M70 30 Q100 50 130 30",
    tag: "Premium",
  },
  {
    id: "baby-tee",
    name: "Baby Tee",
    gsm: "180 GSM · Stretch",
    fabric: "90% combed cotton, 10% elastane",
    fit: "Cropped fitted silhouette with stretch comfort",
    blankPrice: 450,
    sizes: ["XS", "S", "M", "L", "XL"],
    moqBulk: 50,
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Baby Pink", hex: "#F5C2C7" },
    ],
    bulkTiers: [
      { qty: "50–99 pcs", price: "₹399" },
      { qty: "100–249 pcs", price: "₹349" },
      { qty: "250+ pcs", price: "₹299" },
    ],
    accentColor: "#9e6c9e",
    svgPath: "M45 65 L20 95 L58 102 L58 185 L142 185 L142 102 L180 95 L155 65 L125 50 Q100 40 75 50 Z",
    svgCollar: "M75 50 Q100 65 125 50",
    tag: "Stretch",
  },
];

type Product = (typeof PRODUCTS)[0];
type Tier = (typeof PRINT_TIERS)[0];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any; }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function generateRef() {
  return "HL" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────

function DesignPlacer({
  product,
  selectedColor,
  designPreview,
  onTierChange,
}: {
  product: Product;
  selectedColor: (typeof PRODUCTS)[0]["colors"][0];
  designPreview: string | null;
  onTierChange: (tier: Tier, wIn: number, hIn: number) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(300);
  const [ch, setCh] = useState(360);

  // Position of image center in canvas px
  const [pos, setPos] = useState({ x: 0, y: 0 });
  // Scale: 0.1–1.0 (1.0 = full zone width)
  const [imgScale, setImgScale] = useState(0.45);
  // Natural image dimensions
  const [nat, setNat] = useState({ w: 1, h: 1 });

  const isDragging = useRef(false);
  const lastPt = useRef({ x: 0, y: 0 });

  // Measure canvas
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => {
      setCw(el.clientWidth);
      setCh(el.clientHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Zone in px
  const zone = {
    x: cw * ZONE_PCT.x,
    y: ch * ZONE_PCT.y,
    w: cw * ZONE_PCT.w,
    h: ch * ZONE_PCT.h,
  };

  // Image dimensions in px
  const imgW = zone.w * imgScale;
  const imgH = nat.w > 0 ? imgW * (nat.h / nat.w) : imgW;

  // Initialise position when image loads / canvas changes
  useEffect(() => {
    setPos({ x: zone.x + zone.w / 2, y: zone.y + zone.h / 2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cw, ch]);

  // Clamped position
  const clampX = (x: number) => Math.max(zone.x + imgW / 2, Math.min(zone.x + zone.w - imgW / 2, x));
  const clampY = (y: number) => Math.max(zone.y + imgH / 2, Math.min(zone.y + zone.h - imgH / 2, y));

  // Print size calculation
  const printW = (imgW / zone.w) * MAX_PRINT_W_IN;
  const printH = (imgH / zone.h) * MAX_PRINT_H_IN;
  const area = printW * printH;
  const tier = getTier(area);

  // Notify parent whenever tier changes
  useEffect(() => {
    onTierChange(tier, printW, printH);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier.price, printW.toFixed(1), printH.toFixed(1)]);

  // Pointer events for drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastPt.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPt.current.x;
    const dy = e.clientY - lastPt.current.y;
    lastPt.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: clampX(p.x + dx), y: clampY(p.y + dy) }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.x, zone.y, zone.w, zone.h, imgW, imgH]);

  const onPointerUp = useCallback(() => { isDragging.current = false; }, []);

  const isOrange = product.accentColor === "#f15533";

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full rounded-2xl overflow-hidden select-none"
        style={{ paddingBottom: "120%", background: isOrange ? "#fef6f4" : "#f9f5f9" }}
      >
        <div className="absolute inset-0">
          {/* Halftone bg */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${product.accentColor}10 2px, transparent 2px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Tee SVG */}
          <svg
            viewBox="0 0 200 230"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.9 }}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={product.svgPath}
              fill={selectedColor.hex}
              stroke={product.accentColor}
              strokeOpacity={selectedColor.hex === "#FFFFFF" ? 0.25 : 0.15}
              strokeWidth="1"
            />
            <path
              d={product.svgCollar}
              fill="none"
              stroke={product.accentColor}
              strokeOpacity={0.4}
              strokeWidth="1.5"
            />
          </svg>

          {/* Printable zone border */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${ZONE_PCT.x * 100}%`,
              top: `${ZONE_PCT.y * 100}%`,
              width: `${ZONE_PCT.w * 100}%`,
              height: `${ZONE_PCT.h * 100}%`,
              border: `1.5px dashed ${product.accentColor}50`,
              borderRadius: 4,
            }}
          />

          {/* Zone label */}
          <div
            className="absolute pointer-events-none text-[0.55rem] font-bold uppercase tracking-widest"
            style={{
              left: `${ZONE_PCT.x * 100}%`,
              top: `calc(${ZONE_PCT.y * 100}% - 18px)`,
              color: product.accentColor,
              opacity: 0.6,
            }}
          >
            Print area
          </div>

          {/* Design image — draggable */}
          {designPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={designPreview}
              alt="Your design"
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                setNat({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: pos.x - imgW / 2,
                top: pos.y - imgH / 2,
                width: imgW,
                height: "auto",
                objectFit: "contain",
                touchAction: "none",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
              }}
            />
          )}

          {/* Placeholder when no image */}
          {!designPreview && (
            <div
              className="absolute flex flex-col items-center justify-center gap-2 rounded"
              style={{
                left: `${ZONE_PCT.x * 100}%`,
                top: `${ZONE_PCT.y * 100}%`,
                width: `${ZONE_PCT.w * 100}%`,
                height: `${ZONE_PCT.h * 100}%`,
                background: product.accentColor + "08",
              }}
            >
              <span className="text-2xl opacity-30">↑</span>
              <p className="text-[0.6rem] font-bold text-center opacity-40" style={{ color: product.accentColor }}>
                Upload to preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Size slider */}
      {designPreview && (
        <div className="flex items-center gap-3 px-1">
          <span className="text-[0.65rem] font-bold text-halftone-muted uppercase tracking-widest">Smaller</span>
          <input
            type="range"
            min={0.15}
            max={0.95}
            step={0.01}
            value={imgScale}
            onChange={(e) => {
              setImgScale(parseFloat(e.target.value));
              // Re-clamp position after scale change
              setPos((p) => ({ x: clampX(p.x), y: clampY(p.y) }));
            }}
            className="flex-1 accent-current"
            style={{ accentColor: product.accentColor }}
          />
          <span className="text-[0.65rem] font-bold text-halftone-muted uppercase tracking-widest">Larger</span>
        </div>
      )}

      {/* Live price card */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: product.accentColor + "0d", border: `1px solid ${product.accentColor}25` }}
      >
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted">
            {designPreview
              ? `~${printW.toFixed(1)}" × ${printH.toFixed(1)}" · DTG/DTF`
              : "DTG / DTF print"}
          </p>
          <p className="text-sm font-bold mt-0.5">
            {designPreview ? `Print size: ${tier.label}` : "Upload your design to see price"}
          </p>
        </div>
        {designPreview && (
          <div className="text-right">
            <p className="text-[0.6rem] font-bold text-halftone-muted">PRINT</p>
            <p className="text-xl" style={{ fontWeight: 900, color: product.accentColor }}>
              ₹{tier.price}
            </p>
          </div>
        )}
      </div>

      {designPreview && (
        <p className="text-[0.7rem] text-halftone-muted font-bold text-center">
          Drag to reposition · use slider to resize
        </p>
      )}
    </div>
  );
}

// ─── ON DEMAND CONFIGURATOR ───────────────────────────────────────────────────

function OnDemandConfigurator({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  // Steps: 1=colour+size, 2=design, 3=details, 4=review
  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [printTier, setPrintTier] = useState(PRINT_TIERS[2]);
  const [printW, setPrintW] = useState(0);
  const [printH, setPrintH] = useState(0);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<{ ref: string } | null>(null);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const subtotal = product.blankPrice + (designPreview ? printTier.price : 0);
  const shipping = subtotal >= 999 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const handleFile = (file: File) => {
    setDesignFile(file);
    setDesignPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleTierChange = useCallback((tier: Tier, w: number, h: number) => {
    setPrintTier(tier);
    setPrintW(w);
    setPrintH(h);
  }, []);

  const handlePay = async () => {
    setPaying(true);
    const orderRef = generateRef();
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay not loaded");

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          notes: {
            ref: orderRef,
            product: `${product.name} (${product.gsm})`,
            color: selectedColor.name,
            size: selectedSize,
            print: designPreview ? `${printW.toFixed(1)}" × ${printH.toFixed(1)}" → ${printTier.label}` : "No print",
            email: details.email,
          },
        }),
      });

      const { orderId } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Halftone Labs",
        description: `${product.name} · ${selectedColor.name} · ${selectedSize}`,
        order_id: orderId,
        prefill: { name: details.name, email: details.email, contact: details.phone },
        theme: { color: product.accentColor },
        handler: async () => {
          // Send order notification
          try {
            await fetch("https://formspree.io/f/FORM_ID", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _subject: `New Order #${orderRef} — Halftone Labs`,
                orderRef,
                product: `${product.name} (${product.gsm})`,
                color: selectedColor.name,
                size: selectedSize,
                print: designPreview ? `${printTier.label} (${printW.toFixed(1)}" × ${printH.toFixed(1)}")` : "None",
                total: `₹${total}`,
                ...details,
              }),
            });
          } catch {}
          setSuccess({ ref: orderRef });
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      new window.Razorpay(options).open();
    } catch {
      // Dev fallback — skip payment for testing
      setSuccess({ ref: orderRef });
      setPaying(false);
    }
  };

  const stepLabels = ["Colour & Size", "Your Design", "Delivery", "Review"];
  const isOrange = product.accentColor === "#f15533";

  const inp =
    "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-widest" style={{ color: product.accentColor }}>
                On Demand · {product.name} · {product.gsm}
              </p>
              {!success && (
                <h2 className="text-xl mt-0.5" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                  {stepLabels[step - 1]}
                </h2>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>
          {!success && (
            <div className="flex gap-1.5">
              {stepLabels.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full flex-1 transition-all duration-500"
                  style={{ background: i < step ? product.accentColor : "rgba(0,0,0,0.08)" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* SUCCESS */}
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl" style={{ background: product.accentColor + "15" }}>✓</div>
                <h3 className="text-2xl mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>Order Confirmed!</h3>
                <p className="text-halftone-muted text-sm font-bold mb-6">
                  Order <span className="text-halftone-dark font-bold">#{success.ref}</span> placed successfully.
                </p>
                <div className="rounded-2xl p-5 text-left mb-5" style={{ background: product.accentColor + "0d", border: `1px solid ${product.accentColor}20` }}>
                  <p className="text-sm font-bold mb-1.5" style={{ color: product.accentColor }}>⚡ Send your design file</p>
                  <p className="text-[0.8rem] text-halftone-muted font-bold leading-relaxed">
                    Email your design to{" "}
                    <a href="mailto:labshalftone@gmail.com" className="text-halftone-dark underline underline-offset-2">labshalftone@gmail.com</a>{" "}
                    with <strong>#{success.ref}</strong> as the subject.
                    We&apos;ll confirm and start production within 24 hours.
                  </p>
                </div>
                <div className="text-[0.73rem] text-halftone-muted font-bold space-y-0.5">
                  <p>{product.name} ({product.gsm}) · {selectedColor.name} · Size {selectedSize}</p>
                  {designPreview && <p>DTG/DTF · {printTier.label} print · ₹{printTier.price}</p>}
                  <p className="text-halftone-dark font-bold">Total paid: ₹{total}</p>
                </div>
                <button onClick={onClose} className="mt-6 px-7 py-3 rounded-xl text-white text-sm font-bold" style={{ background: product.accentColor, fontWeight: 900 }}>
                  Done
                </button>
              </motion.div>
            ) : step === 1 ? (

              /* ── STEP 1: Colour + Size ── */
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col gap-5">
                {/* Tee preview */}
                <div className="rounded-2xl h-40 flex items-center justify-center relative overflow-hidden" style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}>
                  <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${product.accentColor}10 2px, transparent 2px)`, backgroundSize: "20px 20px" }} />
                  <svg viewBox="0 0 200 230" className="w-32 h-32 relative z-10">
                    <path d={product.svgPath} fill={selectedColor.hex} stroke={product.accentColor} strokeOpacity={0.2} strokeWidth="1" />
                    <path d={product.svgCollar} fill="none" stroke={product.accentColor} strokeOpacity={0.4} strokeWidth="1.5" />
                  </svg>
                  <p className="absolute bottom-3 w-full text-center text-[0.65rem] font-bold tracking-widest uppercase" style={{ color: product.accentColor }}>
                    {selectedColor.name}
                  </p>
                </div>

                {/* Colours */}
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-2.5">Colour</p>
                  <div className="grid grid-cols-2 gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: selectedColor.name === c.name ? product.accentColor : "rgba(0,0,0,0.07)",
                          background: selectedColor.name === c.name ? product.accentColor + "08" : "white",
                        }}
                      >
                        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: c.hex, border: c.border ? "1.5px solid rgba(0,0,0,0.15)" : "none", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
                        <span className="text-sm font-bold">{c.name}</span>
                        {selectedColor.name === c.name && <span className="ml-auto text-xs" style={{ color: product.accentColor }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-2.5">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                        style={{
                          borderColor: selectedSize === s ? product.accentColor : "rgba(0,0,0,0.07)",
                          background: selectedSize === s ? product.accentColor + "10" : "white",
                          color: selectedSize === s ? product.accentColor : "#0f0f0f",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : step === 2 ? (

              /* ── STEP 2: Design Placer ── */
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col gap-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/svg+xml,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                {/* Upload button if no file */}
                {!designPreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed rounded-2xl h-52 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                    style={{ borderColor: product.accentColor + "40", background: product.accentColor + "05" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: product.accentColor + "15" }}>↑</div>
                    <div className="text-center">
                      <p className="font-bold text-sm">Drop your PNG here</p>
                      <p className="text-[0.73rem] text-halftone-muted font-bold mt-0.5">or click to browse · PNG, JPG, SVG, PDF</p>
                    </div>
                  </div>
                ) : (
                  /* Interactive placer when file exists */
                  <DesignPlacer
                    product={product}
                    selectedColor={selectedColor}
                    designPreview={designPreview}
                    onTierChange={handleTierChange}
                  />
                )}

                {/* Change / remove file */}
                {designPreview && (
                  <div className="flex gap-2">
                    <button onClick={() => fileRef.current?.click()} className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold hover:border-black/20 transition-all">
                      Change file
                    </button>
                    <button
                      onClick={() => { setDesignFile(null); setDesignPreview(null); }}
                      className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-halftone-muted hover:border-black/20 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="rounded-xl p-3.5" style={{ background: product.accentColor + "08", border: `1px solid ${product.accentColor}20` }}>
                  <p className="text-[0.72rem] font-bold leading-relaxed" style={{ color: product.accentColor }}>
                    ℹ You can also skip this and email your design to labshalftone@gmail.com after placing your order.
                  </p>
                </div>
              </motion.div>
            ) : step === 3 ? (

              /* ── STEP 3: Details ── */
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "name",  label: "Full Name",  ph: "Rohan Kapoor",   type: "text" },
                    { k: "phone", label: "Phone",       ph: "+91 98765 43210", type: "tel" },
                  ].map(({ k, label, ph, type }) => (
                    <div key={k}>
                      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">{label} *</label>
                      <input required type={type} placeholder={ph} className={inp} value={details[k as keyof typeof details]} onChange={(e) => setDetails({ ...details, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email *</label>
                  <input required type="email" placeholder="you@brand.com" className={inp} value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
                </div>

                <div>
                  <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Delivery Address *</label>
                  <textarea required rows={2} placeholder="Flat/House no., Street, Area" className={`${inp} resize-none`} value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "city", label: "City",     ph: "Mumbai" },
                    { k: "pin",  label: "PIN Code", ph: "400001" },
                  ].map(({ k, label, ph }) => (
                    <div key={k}>
                      <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">{label} *</label>
                      <input required type="text" placeholder={ph} className={inp} value={details[k as keyof typeof details]} onChange={(e) => setDetails({ ...details, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (

              /* ── STEP 4: Review + Pay ── */
              <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col gap-4">
                {/* Order summary */}
                <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
                  {/* Mini product preview */}
                  <div className="h-24 flex items-center justify-center relative" style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}>
                    <svg viewBox="0 0 200 230" className="w-16 h-16">
                      <path d={product.svgPath} fill={selectedColor.hex} stroke={product.accentColor} strokeOpacity={0.2} strokeWidth="1" />
                      <path d={product.svgCollar} fill="none" stroke={product.accentColor} strokeOpacity={0.4} strokeWidth="1.5" />
                    </svg>
                    {designPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={designPreview} alt="Design" className="absolute w-8 h-8 object-contain" style={{ opacity: 0.85, top: "50%", left: "50%", transform: "translate(-50%, -38%)" }} />
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-2.5">
                    {[
                      {
                        label: `${product.name} (${product.gsm})`,
                        sub: `${selectedColor.name} · Size ${selectedSize}`,
                        price: product.blankPrice,
                      },
                      ...(designPreview ? [{
                        label: `DTG/DTF Print · ${printTier.label}`,
                        sub: `~${printW.toFixed(1)}" × ${printH.toFixed(1)}"`,
                        price: printTier.price,
                      }] : []),
                      {
                        label: "Shipping",
                        sub: shipping === 0 ? "Free — order over ₹999" : "Standard delivery",
                        price: shipping,
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-[0.7rem] text-halftone-muted font-bold">{item.sub}</p>
                        </div>
                        <p className="text-sm font-bold ml-4 flex-shrink-0">{item.price === 0 ? "Free" : `₹${item.price}`}</p>
                      </div>
                    ))}
                    <div className="border-t border-black/[0.06] pt-2.5 flex items-center justify-between">
                      <p style={{ fontWeight: 900 }}>Total</p>
                      <p className="text-lg" style={{ fontWeight: 900, color: product.accentColor }}>₹{total}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-xl p-4 bg-halftone-light">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-1">Delivering to</p>
                  <p className="text-sm font-bold">{details.name}</p>
                  <p className="text-[0.75rem] text-halftone-muted font-bold">{details.address}, {details.city} – {details.pin}</p>
                  <p className="text-[0.75rem] text-halftone-muted font-bold">{details.email} · {details.phone}</p>
                </div>

                <p className="text-[0.7rem] text-halftone-muted font-bold text-center">
                  Secure payment via Razorpay · UPI, cards, netbanking
                </p>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: product.accentColor, fontWeight: 900 }}
                >
                  {paying ? "Processing…" : `Pay ₹${total} →`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!success && (
          <div className="px-6 py-4 border-t border-black/[0.05] flex gap-3 flex-shrink-0">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-5 py-3 rounded-xl border border-black/10 text-sm font-bold transition-all hover:border-black/20">
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => {
                  if (step === 1 && !selectedSize) return alert("Please select a size");
                  if (step === 3 && (!details.name || !details.email || !details.phone || !details.address || !details.city || !details.pin)) return alert("Please fill in all delivery details");
                  setStep(step + 1);
                }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ background: product.accentColor, fontWeight: 900 }}
              >
                {step === 2 && !designPreview ? "Skip, I'll email design →" : "Continue →"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── BULK QUOTE FORM ──────────────────────────────────────────────────────────

function BulkQuoteForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", quantity: "100", colors: "", deadline: "", notes: "", artwork: "yes" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formspree.io/f/FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: `${product.name} (${product.gsm})`, _subject: `Bulk Quote — ${product.name} — Halftone Labs` }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-black/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-widest" style={{ color: product.accentColor }}>Bulk · {product.name}</p>
            <h3 className="text-xl" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>Screen Print Quote</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l10 10M11 1L1 11" /></svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl" style={{ background: product.accentColor + "15" }}>✓</div>
            <h3 className="text-xl mb-2" style={{ fontWeight: 900 }}>Quote Request Sent!</h3>
            <p className="text-halftone-muted text-sm font-bold">We&apos;ll reply within 24 hours with pricing.</p>
            <button onClick={onClose} className="mt-5 px-6 py-3 rounded-xl text-white text-sm font-bold" style={{ background: product.accentColor }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="flex gap-2">
              {product.bulkTiers.map((t) => (
                <div key={t.qty} className="flex-1 rounded-xl p-3 text-center" style={{ background: product.accentColor + "0d", border: `1px solid ${product.accentColor}20` }}>
                  <p className="text-sm font-bold" style={{ color: product.accentColor, fontWeight: 900 }}>{t.price}</p>
                  <p className="text-[0.58rem] text-halftone-muted font-bold mt-0.5">{t.qty}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Name *</label><input required type="text" className={inp} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Phone</label><input type="tel" className={inp} placeholder="+91" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email *</label><input required type="email" className={inp} placeholder="you@brand.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Quantity *</label><input required type="number" min={50} className={inp} placeholder="Min 50" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
              <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Deadline</label><input type="date" className={inp} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            </div>
            <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Colours needed</label><input type="text" className={inp} placeholder="e.g. Black, White, Navy" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} /></div>
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-2">Artwork ready?</label>
              <div className="flex gap-2">
                {["yes", "no", "need-help"].map((v) => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, artwork: v })} className="flex-1 py-2.5 rounded-xl text-[0.73rem] font-bold border-2 transition-all" style={{ borderColor: form.artwork === v ? product.accentColor : "rgba(0,0,0,0.07)", background: form.artwork === v ? product.accentColor + "10" : "white", color: form.artwork === v ? product.accentColor : "#6b7280" }}>
                    {v === "yes" ? "Yes" : v === "no" ? "No" : "Need help"}
                  </button>
                ))}
              </div>
            </div>
            <div><label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Notes</label><textarea rows={3} className={`${inp} resize-none`} placeholder="Details about your project…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all" style={{ background: product.accentColor, fontWeight: 900 }}>
              {loading ? "Sending…" : "Send Quote Request →"}
            </button>
            <p className="text-center text-[0.7rem] text-halftone-muted font-bold pb-2">We reply within 24 hours</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, mode, onSelect }: { product: Product; mode: "on-demand" | "bulk"; onSelect: () => void }) {
  const isOrange = product.accentColor === "#f15533";
  const fromPrice = mode === "on-demand"
    ? `₹${product.blankPrice + PRINT_TIERS[0].price}`
    : product.bulkTiers[2].price + "/pc";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className="group relative bg-white border border-black/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300"
    >
      <div className="relative h-60 flex items-center justify-center overflow-hidden" style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}>
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${product.accentColor}12 2px, transparent 2px)`, backgroundSize: "20px 20px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)" }} />
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[0.58rem] font-bold tracking-widest uppercase" style={{ background: product.accentColor + "18", border: `1px solid ${product.accentColor}30`, color: product.accentColor }}>{product.tag}</div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[0.58rem] font-bold bg-black/05 text-black/40 tracking-widest uppercase">{mode === "on-demand" ? "MOQ 1" : `MOQ ${product.moqBulk}`}</div>
        <svg viewBox="0 0 200 230" className="w-36 h-36 transition-transform duration-500 group-hover:scale-105 relative z-10">
          <path d={product.svgPath} fill={product.accentColor} fillOpacity={isOrange ? 0.18 : 0.14} stroke={product.accentColor} strokeOpacity={0.4} strokeWidth="1.5" />
          <path d={product.svgCollar} fill="none" stroke={product.accentColor} strokeOpacity={0.5} strokeWidth="2" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg" style={{ background: product.accentColor }}>
            {mode === "on-demand" ? "Customise →" : "Get Quote →"}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-halftone-muted mb-0.5">{product.gsm}</p>
            <h3 className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{product.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-[0.58rem] text-halftone-muted font-bold">FROM</p>
            <p className="text-base font-bold" style={{ color: product.accentColor, fontWeight: 900 }}>{fromPrice}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          {product.colors.map((c) => (
            <div key={c.name} title={c.name} className="w-3 h-3 rounded-full" style={{ background: c.hex, border: c.border ? "1px solid rgba(0,0,0,0.15)" : "none", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
          ))}
          <span className="text-[0.58rem] text-halftone-muted font-bold ml-0.5">{product.colors.length} colours</span>
        </div>
        <p className="text-[0.7rem] text-halftone-muted font-bold">{mode === "on-demand" ? "DTG / DTF · Ships in 5–7 days" : "Screen Print · Min 50 pcs"}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [mode, setMode] = useState<"on-demand" | "bulk">("on-demand");
  const [configuratorProduct, setConfiguratorProduct] = useState<Product | null>(null);
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null);

  const handleSelect = (product: Product) => {
    if (mode === "on-demand") setConfiguratorProduct(product);
    else setBulkProduct(product);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base text-halftone-dark" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[0.78rem] text-halftone-muted hover:text-halftone-dark transition-colors font-bold">← Back</Link>
            <a href="mailto:labshalftone@gmail.com" className="px-4 py-2 bg-halftone-dark text-white rounded-full text-[0.78rem] font-bold hover:opacity-80 transition-opacity">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.12) 2px, transparent 2px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(to left, black 0%, transparent 65%)", WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 65%)" }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label mb-4 block"><span className="w-5 h-[1.5px] inline-block bg-halftone-purple" />Halftone Studio</span>
            <h1 className="text-[clamp(2.8rem,7vw,6rem)] leading-none mb-5" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
              Custom merch,<br /><span className="gradient-text">made in India.</span>
            </h1>
            <p className="text-halftone-muted text-base max-w-sm leading-relaxed font-bold">Order 1 piece or 1,000. Premium blanks, printed and shipped from our facility.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.04] border border-black/[0.06]">
            {(["on-demand", "bulk"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300" style={{ background: mode === m ? "#0f0f0f" : "transparent", color: mode === m ? "white" : "#6b7280" }}>
                {m === "on-demand" ? "⚡ On Demand — 1 pc min" : "📦 Bulk Quote — 50 pc min"}
              </button>
            ))}
          </motion.div>

          <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap gap-5">
            {mode === "on-demand"
              ? ["DTG / DTF printing", "Ships in 5–7 days", "Pay online via Razorpay"].map((t) => <p key={t} className="text-[0.75rem] font-bold text-halftone-muted">{t}</p>)
              : ["Screen printing", "14–21 day turnaround", "Custom quote via email"].map((t) => <p key={t} className="text-[0.75rem] font-bold text-halftone-muted">{t}</p>)
            }
          </motion.div>
        </div>
      </section>

      <div className="h-px mx-6" style={{ background: "linear-gradient(to right, transparent, rgba(158,108,158,0.15), transparent)" }} />

      {/* Products */}
      <section className="py-14 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{mode === "on-demand" ? "Choose a blank" : "Bulk catalogue"}</h2>
            <p className="text-[0.75rem] text-halftone-muted font-bold">{mode === "on-demand" ? "Price = blank + print" : "Screen print rates"}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <ProductCard product={product} mode={mode} onSelect={() => handleSelect(product)} />
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-5 border border-dashed border-black/10 rounded-2xl py-8 flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-bold text-halftone-muted">Hoodies · Sweatshirts · Caps · Totes — coming soon</p>
            <a href="mailto:labshalftone@gmail.com" className="text-[0.75rem] font-bold text-halftone-purple underline underline-offset-4">Request a blank →</a>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-6 bg-halftone-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.1) 2px, transparent 2px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)" }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {mode === "on-demand" ? (
              <motion.div key="od" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-purple mb-6">On Demand · How it works</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { n: "01", t: "Pick a blank", b: "Choose product, colour and size." },
                    { n: "02", t: "Place your design", b: "Upload your PNG — drag and resize on the tee. Price updates live." },
                    { n: "03", t: "Enter details", b: "Add your delivery address." },
                    { n: "04", t: "Pay & receive", b: "Razorpay checkout. Ships in 5–7 days." },
                  ].map((s) => (
                    <div key={s.n}>
                      <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-purple mb-1">{s.n}</p>
                      <h4 className="text-white text-base mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{s.t}</h4>
                      <p className="text-white/40 text-[0.75rem] font-bold leading-relaxed">{s.b}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="bulk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-orange mb-6">Bulk · How it works</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { n: "01", t: "Request a quote", b: "Tell us product, qty, colours and deadline." },
                    { n: "02", t: "We send pricing", b: "Itemised screen print quote within 24 hours." },
                    { n: "03", t: "Share artwork", b: "Print-ready files — we handle the rest." },
                    { n: "04", t: "Manufacture & ship", b: "Printed, QC'd and shipped to you." },
                  ].map((s) => (
                    <div key={s.n}>
                      <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-orange mb-1">{s.n}</p>
                      <h4 className="text-white text-base mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{s.t}</h4>
                      <p className="text-white/40 text-[0.75rem] font-bold leading-relaxed">{s.b}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-black/[0.05]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</p>
          <p className="text-[0.73rem] text-halftone-muted font-bold">Questions? <a href="mailto:labshalftone@gmail.com" className="text-halftone-dark underline underline-offset-2">labshalftone@gmail.com</a> · © 2025</p>
        </div>
      </footer>

      <AnimatePresence>
        {configuratorProduct && <OnDemandConfigurator product={configuratorProduct} onClose={() => setConfiguratorProduct(null)} />}
        {bulkProduct && <BulkQuoteForm product={bulkProduct} onClose={() => setBulkProduct(null)} />}
      </AnimatePresence>
    </div>
  );
}
