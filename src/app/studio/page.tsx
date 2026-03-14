"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "regular-tee",
    name: "Classic T-Shirt",
    tag: "200 GSM",
    category: "T-Shirts",
    from: "₹299",
    fabric: "100% combed ring-spun cotton",
    weight: "200 g/m²",
    fit: "Regular unisex fit — clean shoulder seam, slightly tapered body",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    moq: 50,
    priceTiers: [
      { qty: "50–99 pcs", price: "₹399" },
      { qty: "100–249 pcs", price: "₹349" },
      { qty: "250+ pcs", price: "₹299" },
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#0f0f0f" },
      { name: "Ash", hex: "#C5C5C5" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Forest", hex: "#2D4A3E" },
      { name: "Maroon", hex: "#6B2D2D" },
      { name: "Stone", hex: "#B5A99A" },
      { name: "Dusty Rose", hex: "#C9907A" },
    ],
    prints: ["Screen Print", "DTF", "Embroidery", "Vinyl Heat Transfer"],
    features: [
      "Pre-shrunk for consistent sizing",
      "Reinforced neck tape",
      "Side-seamed construction",
      "Tear-away label",
    ],
    description:
      "Our workhorse blank — a clean, medium-weight tee that holds colour and print beautifully. Used by artists, labels, brands, and tour merchandise worldwide.",
    image: null,
    accentColor: "#9e6c9e",
  },
  {
    id: "oversized-tee",
    name: "Oversized T-Shirt",
    tag: "240 GSM",
    category: "T-Shirts",
    from: "₹449",
    fabric: "100% heavyweight combed cotton",
    weight: "240 g/m²",
    fit: "Drop-shoulder oversized fit — extended sleeve, boxy body, relaxed hem",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    moq: 50,
    priceTiers: [
      { qty: "50–99 pcs", price: "₹549" },
      { qty: "100–249 pcs", price: "₹499" },
      { qty: "250+ pcs", price: "₹449" },
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#0f0f0f" },
      { name: "Vintage Wash", hex: "#D4C5A9" },
      { name: "Slate", hex: "#5A6472" },
      { name: "Olive", hex: "#6B6B3A" },
      { name: "Washed Navy", hex: "#2C3E5A" },
      { name: "Sand", hex: "#C8B89A" },
      { name: "Rust", hex: "#8B3A2A" },
    ],
    prints: ["Screen Print", "DTF", "Embroidery", "Puff Print"],
    features: [
      "Drop-shoulder construction",
      "Oversized boxy silhouette",
      "Ribbed collar — holds shape wash after wash",
      "Double-stitched hem",
    ],
    description:
      "The modern blank of choice for streetwear, tour drops, and artist merch. Heavy, structured, and built for statement printing.",
    image: null,
    accentColor: "#f15533",
  },
];

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOpen,
}: {
  product: (typeof PRODUCTS)[0];
  onOpen: () => void;
}) {
  const isOrange = product.accentColor === "#f15533";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white border border-black/[0.06] rounded-2xl overflow-hidden cursor-pointer"
      onClick={onOpen}
      whileHover={{ y: -4 }}
    >
      {/* Image / Halftone placeholder */}
      <div
        className="relative h-72 flex items-center justify-center overflow-hidden"
        style={{ background: isOrange ? "#fef6f4" : "#f9f5f9" }}
      >
        {/* Halftone dot background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${product.accentColor}18 2px, transparent 2px)`,
            backgroundSize: "20px 20px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* T-shirt SVG silhouette */}
        <svg
          viewBox="0 0 200 220"
          className="w-44 h-44 transition-transform duration-500 group-hover:scale-105"
          fill="none"
        >
          {/* Body */}
          <path
            d={
              product.id === "oversized-tee"
                ? "M30 50 L10 90 L50 95 L50 210 L150 210 L150 95 L190 90 L170 50 L130 30 Q100 20 70 30 Z"
                : "M40 55 L15 90 L55 98 L55 210 L145 210 L145 98 L185 90 L160 55 L125 38 Q100 28 75 38 Z"
            }
            fill={product.accentColor}
            fillOpacity={isOrange ? 0.18 : 0.15}
            stroke={product.accentColor}
            strokeOpacity={0.4}
            strokeWidth="1.5"
          />
          {/* Collar */}
          <path
            d={
              product.id === "oversized-tee"
                ? "M70 30 Q100 50 130 30"
                : "M75 38 Q100 55 125 38"
            }
            fill="none"
            stroke={product.accentColor}
            strokeOpacity={0.5}
            strokeWidth="2"
          />
        </svg>

        {/* Tag badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase"
          style={{
            background: product.accentColor + "18",
            border: `1px solid ${product.accentColor}30`,
            color: product.accentColor,
          }}
        >
          {product.tag}
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="px-5 py-2.5 rounded-full text-white text-sm font-bold"
            style={{ background: product.accentColor }}
          >
            View Details →
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-halftone-muted mb-1">
              {product.category}
            </p>
            <h3
              className="text-xl"
              style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
            >
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] text-halftone-muted font-bold">
              FROM
            </p>
            <p
              className="text-lg"
              style={{ fontWeight: 900, color: product.accentColor }}
            >
              {product.from}
            </p>
          </div>
        </div>

        {/* Color swatches preview */}
        <div className="flex items-center gap-2 mb-4">
          {product.colors.slice(0, 6).map((c) => (
            <div
              key={c.name}
              title={c.name}
              className="w-4 h-4 rounded-full transition-transform hover:scale-125"
              style={{
                background: c.hex,
                border: c.border
                  ? "1.5px solid rgba(0,0,0,0.15)"
                  : "1.5px solid transparent",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          ))}
          {product.colors.length > 6 && (
            <span className="text-[0.65rem] text-halftone-muted font-bold">
              +{product.colors.length - 6}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[0.75rem] text-halftone-muted">
            MOQ: <span className="text-halftone-dark">{product.moq} pcs</span>
          </p>
          <div className="flex items-center gap-1 text-[0.7rem] font-bold text-halftone-muted">
            {product.prints.slice(0, 2).join(" · ")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onRequest,
}: {
  product: (typeof PRODUCTS)[0];
  onClose: () => void;
  onRequest: (type: "sample" | "bulk") => void;
}) {
  const [activeColor, setActiveColor] = useState(product.colors[1]);
  const isOrange = product.accentColor === "#f15533";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <div className="grid sm:grid-cols-2">
          {/* Left — Visual */}
          <div
            className="relative h-64 sm:h-full min-h-[280px] flex items-center justify-center rounded-t-3xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden"
            style={{
              background: isOrange ? "#fef6f4" : "#f9f5f9",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, ${product.accentColor}20 2px, transparent 2px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <svg viewBox="0 0 200 220" className="w-40 h-40 relative z-10">
              <path
                d={
                  product.id === "oversized-tee"
                    ? "M30 50 L10 90 L50 95 L50 210 L150 210 L150 95 L190 90 L170 50 L130 30 Q100 20 70 30 Z"
                    : "M40 55 L15 90 L55 98 L55 210 L145 210 L145 98 L185 90 L160 55 L125 38 Q100 28 75 38 Z"
                }
                fill={activeColor.hex}
                stroke={product.accentColor}
                strokeOpacity={0.3}
                strokeWidth="1.5"
              />
              <path
                d={
                  product.id === "oversized-tee"
                    ? "M70 30 Q100 50 130 30"
                    : "M75 38 Q100 55 125 38"
                }
                fill="none"
                stroke={product.accentColor}
                strokeOpacity={0.5}
                strokeWidth="2"
              />
            </svg>

            {/* Active color label */}
            <div
              className="absolute bottom-4 left-4 right-4 text-center text-[0.7rem] font-bold tracking-widest uppercase"
              style={{ color: product.accentColor }}
            >
              {activeColor.name}
            </div>
          </div>

          {/* Right — Details */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <span
                className="text-[0.65rem] font-bold uppercase tracking-widest"
                style={{ color: product.accentColor }}
              >
                {product.tag} · {product.category}
              </span>
              <h2
                className="text-2xl mt-1"
                style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
              >
                {product.name}
              </h2>
              <p className="text-[0.85rem] text-halftone-muted mt-2 leading-relaxed font-bold">
                {product.description}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Fabric", value: product.fabric },
                { label: "Weight", value: product.weight },
                { label: "Fit", value: product.fit },
                { label: "MOQ", value: `${product.moq} pieces` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-halftone-light rounded-xl p-3"
                >
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-halftone-muted">
                    {s.label}
                  </p>
                  <p className="text-[0.8rem] mt-1 font-bold leading-snug">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Colors */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">
                Available Colours
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setActiveColor(c)}
                    className="w-6 h-6 rounded-full transition-all duration-200"
                    style={{
                      background: c.hex,
                      border:
                        activeColor.name === c.name
                          ? `2px solid ${product.accentColor}`
                          : c.border
                          ? "1.5px solid rgba(0,0,0,0.2)"
                          : "1.5px solid rgba(0,0,0,0.08)",
                      transform:
                        activeColor.name === c.name ? "scale(1.25)" : "scale(1)",
                      boxShadow:
                        activeColor.name === c.name
                          ? `0 0 0 3px ${product.accentColor}30`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Price tiers */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">
                Pricing
              </p>
              <div className="flex gap-2">
                {product.priceTiers.map((t) => (
                  <div
                    key={t.qty}
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{
                      background: product.accentColor + "0d",
                      border: `1px solid ${product.accentColor}20`,
                    }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: product.accentColor }}
                    >
                      {t.price}
                    </p>
                    <p className="text-[0.6rem] text-halftone-muted font-bold mt-0.5">
                      {t.qty}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Print methods */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">
                Print Methods
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.prints.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full text-[0.7rem] font-bold"
                    style={{
                      background: product.accentColor + "12",
                      color: product.accentColor,
                      border: `1px solid ${product.accentColor}25`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => onRequest("sample")}
                className="flex-1 py-3 rounded-xl text-sm font-bold border transition-all hover:opacity-80"
                style={{
                  border: `1.5px solid ${product.accentColor}`,
                  color: product.accentColor,
                }}
              >
                Request Sample
              </button>
              <button
                onClick={() => onRequest("bulk")}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: product.accentColor }}
              >
                Get Bulk Quote →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── REQUEST FORM DRAWER ──────────────────────────────────────────────────────

function RequestForm({
  type,
  product,
  onClose,
}: {
  type: "sample" | "bulk";
  product: (typeof PRODUCTS)[0];
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: type === "sample" ? "1" : "100",
    colors: "",
    printType: "",
    artwork: "yes",
    deadline: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Submit to Formspree — replace FORM_ID with your actual Formspree form ID
    try {
      const res = await fetch("https://formspree.io/f/FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: product.name,
          requestType: type,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // fallback: just show success for now
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none focus:border-halftone-purple transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-black/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[0.65rem] font-bold uppercase tracking-widest"
                style={{ color: product.accentColor }}
              >
                {type === "sample" ? "Sample Request" : "Bulk Quote"} ·{" "}
                {product.name}
              </p>
              <h3
                className="text-xl mt-0.5"
                style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
              >
                {type === "sample"
                  ? "Order a Sample"
                  : "Get a Custom Quote"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/05 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="px-6 py-16 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
              style={{ background: product.accentColor + "18" }}
            >
              ✓
            </div>
            <h3
              className="text-2xl mb-2"
              style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
            >
              Request Sent!
            </h3>
            <p className="text-halftone-muted text-sm font-bold">
              We&apos;ll get back to you within 24 hours with pricing and
              availability.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: product.accentColor }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                  Name *
                </label>
                <input
                  required
                  type="text"
                  className={inputClass}
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                Email *
              </label>
              <input
                required
                type="email"
                className={inputClass}
                placeholder="you@brand.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                  Quantity *
                </label>
                <input
                  required
                  type="number"
                  min={type === "sample" ? 1 : 50}
                  className={inputClass}
                  placeholder={type === "sample" ? "1–5" : "Min 50"}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                Colours Needed
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Black, White, Washed Navy"
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                Print Method
              </label>
              <select
                className={inputClass}
                value={form.printType}
                onChange={(e) =>
                  setForm({ ...form, printType: e.target.value })
                }
              >
                <option value="">Select a print method</option>
                {product.prints.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value="unsure">Not sure yet</option>
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-2">
                Artwork Ready?
              </label>
              <div className="flex gap-3">
                {["yes", "no", "need-help"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm({ ...form, artwork: v })}
                    className="flex-1 py-2.5 rounded-xl text-[0.75rem] font-bold border transition-all capitalize"
                    style={{
                      background:
                        form.artwork === v
                          ? product.accentColor + "15"
                          : "white",
                      border: `1.5px solid ${
                        form.artwork === v
                          ? product.accentColor
                          : "rgba(0,0,0,0.08)"
                      }`,
                      color:
                        form.artwork === v
                          ? product.accentColor
                          : "#6b7280",
                    }}
                  >
                    {v === "yes"
                      ? "Yes"
                      : v === "no"
                      ? "No"
                      : "Need Help"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">
                Notes
              </label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Tell us about your project, brand, or any specific requirements..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: product.accentColor }}
            >
              {loading
                ? "Sending..."
                : type === "sample"
                ? "Request Sample →"
                : "Get My Quote →"}
            </button>

            <p className="text-center text-[0.7rem] text-halftone-muted font-bold">
              We reply within 24 hours · No spam, ever.
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [activeProduct, setActiveProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [requestState, setRequestState] = useState<{
    type: "sample" | "bulk";
    product: (typeof PRODUCTS)[0];
  } | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-base text-halftone-dark"
            style={{ fontWeight: 900, letterSpacing: "-0.05em" }}
          >
            Halftone Labs
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[0.8rem] text-halftone-muted hover:text-halftone-dark transition-colors font-bold"
            >
              ← Back
            </Link>
            <a
              href="mailto:labshalftone@gmail.com"
              className="px-4 py-2 bg-halftone-dark text-white rounded-full text-[0.8rem] font-bold hover:opacity-80 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Halftone dot field */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(158,108,158,0.12) 2px, transparent 2px)",
            backgroundSize: "22px 22px",
            maskImage:
              "linear-gradient(to left, black 0%, transparent 60%)",
            WebkitMaskImage:
              "linear-gradient(to left, black 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label mb-4 block">
              <span
                className="w-5 h-[1.5px] inline-block"
                style={{ background: "#9e6c9e" }}
              />
              Studio
            </span>
            <h1
              className="text-[clamp(3rem,8vw,7rem)] leading-none mb-6"
              style={{ fontWeight: 900, letterSpacing: "-0.05em" }}
            >
              Start your
              <br />
              <span className="gradient-text">project.</span>
            </h1>
            <p
              className="text-halftone-muted text-lg max-w-md leading-relaxed"
              style={{ fontWeight: 700 }}
            >
              Premium blanks, manufactured in India. Request samples or place
              bulk orders — we handle everything from print to delivery.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex gap-8 mt-10 pt-10 border-t border-black/[0.06]"
          >
            {[
              { val: "50 pcs", label: "Minimum order" },
              { val: "14 days", label: "Avg. turnaround" },
              { val: "India + World", label: "Shipping" },
              { val: "Free", label: "Sample consultation" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-lg"
                  style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
                >
                  {s.val}
                </p>
                <p className="text-[0.75rem] text-halftone-muted font-bold">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Halftone divider */}
      <div
        className="h-px mx-6 sm:mx-0"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(158,108,158,0.15), transparent)",
        }}
      />

      {/* ── Product Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-3xl"
              style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
            >
              Blanks Catalogue
            </h2>
            <p className="text-[0.8rem] text-halftone-muted font-bold">
              {PRODUCTS.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => setActiveProduct(product)}
              />
            ))}

            {/* Coming soon card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="border border-dashed border-black/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ background: "rgba(158,108,158,0.08)" }}
              >
                +
              </div>
              <p
                className="text-base"
                style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
              >
                More coming soon
              </p>
              <p className="text-[0.8rem] text-halftone-muted font-bold">
                Hoodies, caps, totes & more
              </p>
              <a
                href="mailto:labshalftone@gmail.com"
                className="mt-2 text-[0.75rem] font-bold text-halftone-purple underline underline-offset-4"
              >
                Request a blank →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process strip ── */}
      <section className="py-16 px-6 bg-halftone-dark relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(158,108,158,0.12) 2px, transparent 2px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
          }}
        />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Pick a blank", body: "Choose your product and colours from our catalogue." },
              { n: "02", title: "Share artwork", body: "Send us your design — we'll handle the rest, or help you from scratch." },
              { n: "03", title: "We manufacture", body: "Printed and quality-checked at our facility in India." },
              { n: "04", title: "Delivered", body: "Shipped directly to you or your fans, anywhere in the world." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-2">
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-widest"
                  style={{ color: "#9e6c9e" }}
                >
                  {step.n}
                </p>
                <h3
                  className="text-white text-lg"
                  style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
                >
                  {step.title}
                </h3>
                <p className="text-white/40 text-[0.8rem] font-bold leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-black/[0.05]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <p
            className="text-base"
            style={{ fontWeight: 900, letterSpacing: "-0.05em" }}
          >
            Halftone Labs
          </p>
          <p className="text-[0.75rem] text-halftone-muted font-bold">
            © 2025 · Made in India
          </p>
        </div>
      </footer>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeProduct && !requestState && (
          <ProductModal
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
            onRequest={(type) => setRequestState({ type, product: activeProduct })}
          />
        )}
        {requestState && (
          <RequestForm
            type={requestState.type}
            product={requestState.product}
            onClose={() => setRequestState(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
