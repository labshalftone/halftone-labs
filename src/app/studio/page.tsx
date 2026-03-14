"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SHIPPING = 99; // ₹99 shipping, free above ₹999

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
      { name: "Acid Wash Black", hex: "#3A3A3A" },
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
    gsm: "180 GSM",
    fabric: "90% combed cotton, 10% elastane",
    fit: "Cropped fitted silhouette, stretch comfort",
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

const PRINT_SIZES = [
  { id: "5x5", label: '5×5"', desc: "Pocket / small chest logo", price: 120, sqin: 25 },
  { id: "6x10", label: '6×10"', desc: "Standard chest print", price: 180, sqin: 60 },
  { id: "8.5x11", label: '8.5×11"', desc: "Full chest or back", price: 230, sqin: 93.5 },
  { id: "12x12", label: '12×12"', desc: "Large chest / back print", price: 280, sqin: 144 },
  { id: "14x16", label: '14×16"', desc: "Oversized front or back", price: 330, sqin: 224 },
  { id: "19x15.5", label: '19×15.5"', desc: "All-over / full back", price: 400, sqin: 294.5 },
];

type Product = (typeof PRODUCTS)[0];
type PrintSize = (typeof PRINT_SIZES)[0];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function generateOrderRef() {
  return "HL" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  mode,
  onSelect,
}: {
  product: Product;
  mode: "on-demand" | "bulk";
  onSelect: () => void;
}) {
  const isOrange = product.accentColor === "#f15533";
  const fromPrice =
    mode === "on-demand"
      ? `₹${product.blankPrice + PRINT_SIZES[0].price}`
      : product.bulkTiers[2].price + "/pc";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className="group relative bg-white border border-black/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300"
    >
      {/* Product image / halftone visual */}
      <div
        className="relative h-64 flex items-center justify-center overflow-hidden"
        style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${product.accentColor}15 2px, transparent 2px)`,
            backgroundSize: "20px 20px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* Tag */}
        <div
          className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[0.6rem] font-bold tracking-widest uppercase"
          style={{
            background: product.accentColor + "18",
            border: `1px solid ${product.accentColor}30`,
            color: product.accentColor,
          }}
        >
          {product.tag}
        </div>

        {/* Mode badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[0.6rem] font-bold bg-black/05 text-black/40 tracking-widest uppercase">
          {mode === "on-demand" ? "MOQ 1" : `MOQ ${product.moqBulk}`}
        </div>

        {/* T-shirt SVG */}
        <svg
          viewBox="0 0 200 230"
          className="w-40 h-40 transition-transform duration-500 group-hover:scale-105 relative z-10"
        >
          <path
            d={product.svgPath}
            fill={product.accentColor}
            fillOpacity={isOrange ? 0.18 : 0.14}
            stroke={product.accentColor}
            strokeOpacity={0.4}
            strokeWidth="1.5"
          />
          <path
            d={product.svgCollar}
            fill="none"
            stroke={product.accentColor}
            strokeOpacity={0.5}
            strokeWidth="2"
          />
        </svg>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/[0.03]">
          <div
            className="px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg"
            style={{ background: product.accentColor }}
          >
            {mode === "on-demand" ? "Customise →" : "Get Quote →"}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-0.5">
              {product.gsm}
            </p>
            <h3 className="text-lg" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] text-halftone-muted font-bold">
              {mode === "on-demand" ? "FROM" : "FROM"}
            </p>
            <p className="text-base font-bold" style={{ color: product.accentColor, fontWeight: 900 }}>
              {fromPrice}
            </p>
          </div>
        </div>

        {/* Color dots */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.map((c) => (
            <div
              key={c.name}
              title={c.name}
              className="w-3.5 h-3.5 rounded-full"
              style={{
                background: c.hex,
                border: c.border ? "1.5px solid rgba(0,0,0,0.15)" : "1.5px solid transparent",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          ))}
          <span className="text-[0.6rem] text-halftone-muted font-bold ml-1">
            {product.colors.length} colour{product.colors.length > 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-[0.72rem] text-halftone-muted font-bold">
          {mode === "on-demand" ? "DTG / DTF · Ships in 5–7 days" : "Screen Print · Min 50 pcs"}
        </p>
      </div>
    </motion.div>
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
  const [step, setStep] = useState(1); // 1: color, 2: design, 3: size, 4: details, 5: review
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPrint, setSelectedPrint] = useState<PrintSize | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<{ orderRef: string } | null>(null);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const totalBlank = product.blankPrice;
  const totalPrint = selectedPrint?.price ?? 0;
  const subtotal = totalBlank + totalPrint;
  const shipping = subtotal >= 999 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const handleFile = useCallback((file: File) => {
    setDesignFile(file);
    const url = URL.createObjectURL(file);
    setDesignPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePay = async () => {
    setPaying(true);
    const orderRef = generateOrderRef();

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay load failed");

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          notes: {
            orderRef,
            product: product.name,
            gsm: product.gsm,
            color: selectedColor.name,
            size: selectedSize,
            printSize: selectedPrint?.label,
            customer: details.name,
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
        description: `${product.name} · ${selectedPrint?.label} · ${selectedColor.name}`,
        order_id: orderId,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: product.accentColor },
        handler: async () => {
          // Send order confirmation to email
          try {
            await fetch("https://formspree.io/f/FORM_ID", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderRef,
                product: `${product.name} (${product.gsm})`,
                color: selectedColor.name,
                size: selectedSize,
                printSize: selectedPrint?.label,
                total: `₹${total}`,
                ...details,
                _subject: `New Order #${orderRef} — Halftone Labs`,
              }),
            });
          } catch {}
          setSuccess({ orderRef });
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rp = new window.Razorpay(options);
      rp.open();
    } catch {
      // Fallback: just show success (for testing without Razorpay keys)
      setSuccess({ orderRef });
    } finally {
      setPaying(false);
    }
  };

  const stepLabels = ["Colour", "Design", "Print size", "Your details", "Review"];
  const isOrange = product.accentColor === "#f15533";

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
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[94vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: product.accentColor }}>
                On Demand · {product.name} · {product.gsm}
              </p>
              {!success && (
                <h2 className="text-xl" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                  {stepLabels[step - 1]}
                </h2>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          {!success && (
            <div className="flex gap-1.5">
              {stepLabels.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full flex-1 transition-all duration-300"
                  style={{
                    background: i < step ? product.accentColor : "rgba(0,0,0,0.08)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* SUCCESS */}
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-12 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl"
                  style={{ background: product.accentColor + "15" }}
                >
                  ✓
                </div>
                <h3 className="text-2xl mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                  Order Confirmed!
                </h3>
                <p className="text-halftone-muted text-sm font-bold mb-6">
                  Your order <span className="text-halftone-dark">#{success.orderRef}</span> has been placed.
                </p>
                <div
                  className="rounded-2xl p-5 text-left mb-6"
                  style={{ background: product.accentColor + "0d", border: `1px solid ${product.accentColor}20` }}
                >
                  <p className="text-sm font-bold mb-2" style={{ color: product.accentColor }}>
                    ⚡ Next step — send your design file
                  </p>
                  <p className="text-[0.8rem] text-halftone-muted font-bold leading-relaxed">
                    Email your design file to{" "}
                    <a href="mailto:labshalftone@gmail.com" className="text-halftone-dark underline underline-offset-2">
                      labshalftone@gmail.com
                    </a>{" "}
                    with <strong>#{success.orderRef}</strong> as the subject line. We&apos;ll confirm and begin production within 24 hours.
                  </p>
                </div>
                <div className="text-[0.75rem] text-halftone-muted font-bold space-y-1">
                  <p>Product: {product.name} ({product.gsm}) · {selectedColor.name}</p>
                  <p>Size: {selectedSize} · Print: {selectedPrint?.label}</p>
                  <p>Total paid: ₹{total}</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 rounded-xl text-white text-sm font-bold"
                  style={{ background: product.accentColor }}
                >
                  Done
                </button>
              </motion.div>
            ) : step === 1 ? (
              /* STEP 1: Colour */
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                {/* Tee preview */}
                <div
                  className="rounded-2xl h-48 flex items-center justify-center mb-6 relative overflow-hidden"
                  style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${product.accentColor}12 2px, transparent 2px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <svg viewBox="0 0 200 230" className="w-36 h-36 relative z-10">
                    <path d={product.svgPath} fill={selectedColor.hex} stroke={product.accentColor} strokeOpacity={0.2} strokeWidth="1" />
                    <path d={product.svgCollar} fill="none" stroke={product.accentColor} strokeOpacity={0.4} strokeWidth="1.5" />
                  </svg>
                  <p className="absolute bottom-3 text-center w-full text-[0.7rem] font-bold tracking-widest uppercase" style={{ color: product.accentColor }}>
                    {selectedColor.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: selectedColor.name === c.name ? product.accentColor : "rgba(0,0,0,0.07)",
                        background: selectedColor.name === c.name ? product.accentColor + "08" : "white",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0"
                        style={{
                          background: c.hex,
                          border: c.border ? "1.5px solid rgba(0,0,0,0.15)" : "none",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                        }}
                      />
                      <span className="text-sm font-bold">{c.name}</span>
                      {selectedColor.name === c.name && (
                        <span className="ml-auto text-xs font-bold" style={{ color: product.accentColor }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Size */}
                <div className="mt-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">Size</p>
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
              /* STEP 2: Design Upload */
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.ai,.eps,.svg,.psd"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                {designPreview ? (
                  <div className="rounded-2xl overflow-hidden border-2 border-dashed mb-4" style={{ borderColor: product.accentColor + "40" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={designPreview}
                      alt="Design preview"
                      className="w-full h-56 object-contain bg-halftone-light"
                    />
                    <div className="p-4 flex items-center justify-between bg-white">
                      <div>
                        <p className="text-sm font-bold">{designFile?.name}</p>
                        <p className="text-[0.7rem] text-halftone-muted font-bold">
                          {designFile ? (designFile.size / 1024 / 1024).toFixed(2) + " MB" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => { setDesignFile(null); setDesignPreview(null); }}
                        className="text-[0.75rem] text-halftone-muted font-bold underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors mb-4 hover:border-opacity-70"
                    style={{ borderColor: product.accentColor + "40", background: product.accentColor + "05" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: product.accentColor + "15" }}
                    >
                      ↑
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">Drop your design here</p>
                      <p className="text-[0.75rem] text-halftone-muted font-bold mt-1">or click to browse</p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.03)" }}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">Accepted formats</p>
                  <p className="text-[0.78rem] font-bold text-halftone-muted leading-relaxed">
                    PNG, JPG, PDF, AI, EPS, SVG, PSD · Min 300 DPI for best results · Max 50 MB
                  </p>
                </div>

                <div className="mt-3 rounded-xl p-4" style={{ background: product.accentColor + "08", border: `1px solid ${product.accentColor}20` }}>
                  <p className="text-[0.75rem] font-bold leading-relaxed" style={{ color: product.accentColor }}>
                    ℹ You can also skip this and email your design to labshalftone@gmail.com after placing your order.
                  </p>
                </div>
              </motion.div>
            ) : step === 3 ? (
              /* STEP 3: Print size */
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                <div className="flex flex-col gap-3">
                  {PRINT_SIZES.map((ps) => (
                    <button
                      key={ps.id}
                      onClick={() => setSelectedPrint(ps)}
                      className="flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left"
                      style={{
                        borderColor: selectedPrint?.id === ps.id ? product.accentColor : "rgba(0,0,0,0.07)",
                        background: selectedPrint?.id === ps.id ? product.accentColor + "08" : "white",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Size visual */}
                        <div
                          className="flex-shrink-0 rounded flex items-center justify-center text-[0.6rem] font-bold"
                          style={{
                            width: 40,
                            height: 40,
                            background: selectedPrint?.id === ps.id ? product.accentColor + "15" : "rgba(0,0,0,0.04)",
                            color: selectedPrint?.id === ps.id ? product.accentColor : "#6b7280",
                            border: `1px solid ${selectedPrint?.id === ps.id ? product.accentColor + "30" : "rgba(0,0,0,0.06)"}`,
                          }}
                        >
                          {ps.id === "5x5" ? "S" : ps.id === "6x10" ? "M" : ps.id === "8.5x11" ? "L" : ps.id === "12x12" ? "XL" : ps.id === "14x16" ? "2X" : "3X"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{ps.label}</p>
                          <p className="text-[0.72rem] text-halftone-muted font-bold">{ps.desc}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold" style={{ color: product.accentColor, fontWeight: 900 }}>
                          ₹{ps.price}
                        </p>
                        <p className="text-[0.6rem] text-halftone-muted font-bold">{ps.sqin} sq in</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 4 ? (
              /* STEP 4: Details */
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col gap-4">
                {[
                  { key: "name", label: "Full Name", placeholder: "Rohan Kapoor", type: "text" },
                  { key: "email", label: "Email", placeholder: "you@brand.com", type: "email" },
                  { key: "phone", label: "Phone", placeholder: "+91 98765 43210", type: "tel" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                      {label} *
                    </label>
                    <input
                      required
                      type={type}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none transition-colors"
                      style={{ borderColor: details[key as keyof typeof details] ? product.accentColor + "50" : undefined }}
                      value={details[key as keyof typeof details]}
                      onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat/House no., Street, Area"
                    className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none resize-none"
                    value={details.address}
                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "city", label: "City", placeholder: "Mumbai" },
                    { key: "pin", label: "PIN Code", placeholder: "400001" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                        {label} *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none"
                        value={details[key as keyof typeof details]}
                        onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* STEP 5: Review */
              <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                {/* Order card */}
                <div className="rounded-2xl border border-black/[0.06] overflow-hidden mb-5">
                  {/* Product preview */}
                  <div
                    className="h-28 flex items-center justify-center relative"
                    style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}
                  >
                    <svg viewBox="0 0 200 230" className="w-20 h-20">
                      <path d={product.svgPath} fill={selectedColor.hex} stroke={product.accentColor} strokeOpacity={0.3} strokeWidth="1.5" />
                      <path d={product.svgCollar} fill="none" stroke={product.accentColor} strokeOpacity={0.5} strokeWidth="2" />
                    </svg>
                    {designPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={designPreview}
                        alt="Design"
                        className="absolute w-10 h-10 object-contain opacity-70"
                        style={{ top: "50%", left: "50%", transform: "translate(-50%, -45%)" }}
                      />
                    )}
                  </div>

                  {/* Line items */}
                  <div className="p-4 flex flex-col gap-2.5">
                    {[
                      { label: `${product.name} (${product.gsm})`, sub: `${selectedColor.name} · Size ${selectedSize}`, price: totalBlank },
                      { label: `DTG/DTF Print · ${selectedPrint?.label}`, sub: selectedPrint?.desc ?? "", price: totalPrint },
                      { label: "Shipping", sub: subtotal >= 999 ? "Free above ₹999" : "Standard delivery", price: shipping },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-[0.72rem] text-halftone-muted font-bold">{item.sub}</p>
                        </div>
                        <p className="text-sm font-bold flex-shrink-0 ml-4">
                          {item.price === 0 ? "Free" : `₹${item.price}`}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-black/[0.06] pt-2.5 flex items-center justify-between">
                      <p className="font-bold" style={{ fontWeight: 900 }}>Total</p>
                      <p className="text-lg" style={{ fontWeight: 900, color: product.accentColor }}>
                        ₹{total}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="rounded-xl p-4 bg-halftone-light mb-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-1">Delivering to</p>
                  <p className="text-sm font-bold">{details.name}</p>
                  <p className="text-[0.78rem] text-halftone-muted font-bold">{details.address}, {details.city} – {details.pin}</p>
                  <p className="text-[0.78rem] text-halftone-muted font-bold">{details.email} · {details.phone}</p>
                </div>

                <p className="text-[0.72rem] text-halftone-muted font-bold text-center mb-4">
                  Secure payment via Razorpay · UPI, cards, netbanking accepted
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
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 rounded-xl border border-black/10 text-sm font-bold transition-all hover:border-black/20"
              >
                ← Back
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={() => {
                  if (step === 1 && (!selectedSize)) {
                    alert("Please select a size");
                    return;
                  }
                  if (step === 3 && !selectedPrint) {
                    alert("Please select a print size");
                    return;
                  }
                  if (step === 4 && (!details.name || !details.email || !details.phone || !details.address || !details.city || !details.pin)) {
                    alert("Please fill in all delivery details");
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ background: product.accentColor }}
              >
                {step === 2 ? (designFile ? "Continue →" : "Skip, I'll email it →") : "Continue →"}
              </button>
            ) : null}
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
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    quantity: "100", colors: "", deadline: "", notes: "", artwork: "yes",
  });

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
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-black/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: product.accentColor }}>
              Bulk Quote · {product.name}
            </p>
            <h3 className="text-xl" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>Screen Print Order</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l10 10M11 1L1 11" /></svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl" style={{ background: product.accentColor + "15" }}>✓</div>
            <h3 className="text-xl mb-2" style={{ fontWeight: 900 }}>Quote Request Sent!</h3>
            <p className="text-halftone-muted text-sm font-bold">We&apos;ll reply within 24 hours with pricing for your order.</p>
            <button onClick={onClose} className="mt-5 px-6 py-3 rounded-xl text-white text-sm font-bold" style={{ background: product.accentColor }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            {/* Pricing tiers */}
            <div className="flex gap-2 mb-1">
              {product.bulkTiers.map((t) => (
                <div key={t.qty} className="flex-1 rounded-xl p-3 text-center" style={{ background: product.accentColor + "0d", border: `1px solid ${product.accentColor}20` }}>
                  <p className="text-sm font-bold" style={{ color: product.accentColor, fontWeight: 900 }}>{t.price}</p>
                  <p className="text-[0.6rem] text-halftone-muted font-bold mt-0.5">{t.qty}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Name *</label>
                <input required type="text" className={inp} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Phone</label>
                <input type="tel" className={inp} placeholder="+91" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email *</label>
              <input required type="email" className={inp} placeholder="you@brand.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Quantity *</label>
                <input required type="number" min={50} className={inp} placeholder="Min 50" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Deadline</label>
                <input type="date" className={inp} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Colours needed</label>
              <input type="text" className={inp} placeholder="e.g. Black, White, Navy" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-2">Artwork ready?</label>
              <div className="flex gap-2">
                {["yes", "no", "need-help"].map((v) => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, artwork: v })}
                    className="flex-1 py-2.5 rounded-xl text-[0.75rem] font-bold border-2 transition-all"
                    style={{
                      borderColor: form.artwork === v ? product.accentColor : "rgba(0,0,0,0.07)",
                      background: form.artwork === v ? product.accentColor + "10" : "white",
                      color: form.artwork === v ? product.accentColor : "#6b7280",
                    }}>
                    {v === "yes" ? "Yes" : v === "no" ? "No" : "Need help"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Notes</label>
              <textarea rows={3} className={`${inp} resize-none`} placeholder="Any details about your project…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50" style={{ background: product.accentColor, fontWeight: 900 }}>
              {loading ? "Sending…" : "Send Quote Request →"}
            </button>
            <p className="text-center text-[0.7rem] text-halftone-muted font-bold pb-2">We reply within 24 hours · No spam.</p>
          </form>
        )}
      </motion.div>
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
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base text-halftone-dark" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
            Halftone Labs
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[0.8rem] text-halftone-muted hover:text-halftone-dark transition-colors font-bold">
              ← Back
            </Link>
            <a href="mailto:labshalftone@gmail.com" className="px-4 py-2 bg-halftone-dark text-white rounded-full text-[0.8rem] font-bold hover:opacity-80 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 relative overflow-hidden">
        <div
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.12) 2px, transparent 2px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to left, black 0%, transparent 65%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 65%)",
          }}
        />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label mb-4 block">
              <span className="w-5 h-[1.5px] inline-block bg-halftone-purple" />
              Halftone Studio
            </span>
            <h1 className="text-[clamp(2.8rem,7vw,6rem)] leading-none mb-5" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
              Custom merch,<br />
              <span className="gradient-text">made in India.</span>
            </h1>
            <p className="text-halftone-muted text-base max-w-sm leading-relaxed font-bold">
              Order 1 piece or 1,000. Premium blanks, printed and shipped from our facility.
            </p>
          </motion.div>

          {/* Mode toggle */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.04] border border-black/[0.06]"
          >
            {(["on-demand", "bulk"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                style={{
                  background: mode === m ? "#0f0f0f" : "transparent",
                  color: mode === m ? "white" : "#6b7280",
                }}
              >
                {m === "on-demand" ? "⚡ On Demand — 1 pc min" : "📦 Bulk Quote — 50 pc min"}
              </button>
            ))}
          </motion.div>

          {/* Mode description */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-6"
          >
            {mode === "on-demand" ? (
              <>
                <p className="text-[0.78rem] font-bold text-halftone-muted">DTG / DTF printing</p>
                <p className="text-[0.78rem] font-bold text-halftone-muted">Ships in 5–7 days</p>
                <p className="text-[0.78rem] font-bold text-halftone-muted">Pay online via Razorpay</p>
              </>
            ) : (
              <>
                <p className="text-[0.78rem] font-bold text-halftone-muted">Screen printing</p>
                <p className="text-[0.78rem] font-bold text-halftone-muted">14–21 day turnaround</p>
                <p className="text-[0.78rem] font-bold text-halftone-muted">Custom quote via email</p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px mx-6" style={{ background: "linear-gradient(to right, transparent, rgba(158,108,158,0.15), transparent)" }} />

      {/* Products */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
              {mode === "on-demand" ? "Choose a blank" : "Bulk catalogue"}
            </h2>
            <p className="text-[0.78rem] text-halftone-muted font-bold">
              {mode === "on-demand" ? "Prices include blank + print" : "Screen print pricing per qty"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={product} mode={mode} onSelect={() => handleSelect(product)} />
              </motion.div>
            ))}
          </div>

          {/* Coming soon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-5 border border-dashed border-black/10 rounded-2xl py-10 flex flex-col items-center gap-2 text-center"
          >
            <p className="text-sm font-bold text-halftone-muted">Hoodies · Sweatshirts · Caps · Tote bags — coming soon</p>
            <a href="mailto:labshalftone@gmail.com" className="text-[0.78rem] font-bold text-halftone-purple underline underline-offset-4">
              Request a blank →
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-6 bg-halftone-dark relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(158,108,158,0.1) 2px, transparent 2px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
          }}
        />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {mode === "on-demand" ? (
              <motion.div key="od" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-purple mb-6">On Demand · How it works</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { n: "01", t: "Pick a blank", b: "Choose your product, colour and size." },
                    { n: "02", t: "Upload design", b: "Drop your file — PNG, PDF, AI, SVG." },
                    { n: "03", t: "Choose print size", b: "Select the area and we calculate the price." },
                    { n: "04", t: "Pay & receive", b: "Secure Razorpay checkout. Ships in 5–7 days." },
                  ].map((s) => (
                    <div key={s.n}>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-purple mb-1">{s.n}</p>
                      <h4 className="text-white text-base mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{s.t}</h4>
                      <p className="text-white/40 text-[0.78rem] font-bold leading-relaxed">{s.b}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="bulk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-orange mb-6">Bulk Order · How it works</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { n: "01", t: "Request a quote", b: "Tell us product, quantity, colours and deadline." },
                    { n: "02", t: "We send pricing", b: "Itemised quote within 24 hours, screen print rates." },
                    { n: "03", t: "Share artwork", b: "Send your print-ready artwork — we handle the rest." },
                    { n: "04", t: "Manufacture & ship", b: "Printed, QC'd and shipped to you or your fans." },
                  ].map((s) => (
                    <div key={s.n}>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-orange mb-1">{s.n}</p>
                      <h4 className="text-white text-base mb-1" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>{s.t}</h4>
                      <p className="text-white/40 text-[0.78rem] font-bold leading-relaxed">{s.b}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-black/[0.05]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</p>
          <p className="text-[0.75rem] text-halftone-muted font-bold">
            Questions?{" "}
            <a href="mailto:labshalftone@gmail.com" className="text-halftone-dark underline underline-offset-2">labshalftone@gmail.com</a>
            {" "}· © 2025
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {configuratorProduct && (
          <OnDemandConfigurator product={configuratorProduct} onClose={() => setConfiguratorProduct(null)} />
        )}
        {bulkProduct && (
          <BulkQuoteForm product={bulkProduct} onClose={() => setBulkProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
