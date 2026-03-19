"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, getTier } from "@/lib/products";

// ─── THUMBNAIL HELPERS ────────────────────────────────────────────────────────

async function makeCompositeThumbnail(
  mockupSrc: string,
  designSrc: string,
  pos: { x: number; y: number; size: number }
): Promise<string> {
  return new Promise((resolve) => {
    const mockup = new Image();
    mockup.crossOrigin = "anonymous";
    mockup.onload = () => {
      const W = 900;
      const H = Math.round(W * (mockup.naturalHeight / mockup.naturalWidth));
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(mockup, 0, 0, W, H);
      const safeExport = () => { try { return canvas.toDataURL("image/jpeg", 0.93); } catch { return ""; } };
      const design = new Image();
      design.crossOrigin = "anonymous";
      design.onload = () => {
        const cx = (pos.x    / 100) * W;
        const cy = (pos.y    / 100) * H;
        const dw = (pos.size / 100) * W;
        const dh = dw * (design.naturalHeight / design.naturalWidth);
        try { ctx.drawImage(design, cx - dw / 2, cy - dh / 2, dw, dh); } catch { /* tainted */ }
        resolve(safeExport());
      };
      design.onerror = () => resolve(safeExport());
      design.src = designSrc;
    };
    mockup.onerror = () => resolve("");
    mockup.src = mockupSrc;
  });
}

// ─── PHOTO PRINT ZONES ────────────────────────────────────────────────────────

const PHOTO_ZONE = {
  regular:   { left: 30,   top: 29.8, width: 36, height: 44 },
  oversized: { left: 28.3, top: 29.8, width: 40, height: 48 },
  baby:      { left: 28.3, top: 29.8, width: 40, height: 26 },
};
const MAX_PRINT_W_IN = 19;
const MAX_PRINT_H_IN = 15.5;

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────

function DesignPlacer({
  designSrc, mockupSrc, zoneKey, onPriceChange, onPositionChange,
}: {
  designSrc: string; mockupSrc: string; zoneKey: keyof typeof PHOTO_ZONE;
  onPriceChange: (price: number, tier: string, dims: string) => void;
  onPositionChange?: (pos: { x: number; y: number; size: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zone = PHOTO_ZONE[zoneKey];

  const minSize  = zone.width * 0.12;
  const maxSize  = zone.width * 0.90;
  const initSize = zone.width * 0.38;
  const initX    = zone.left + zone.width  / 2;
  const initY    = zone.top  + zone.height / 2;

  const [pos, setPos] = useState({ x: initX, y: initY, size: initSize });
  const dragging   = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const toPct = useCallback((cx: number, cy: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100 };
  }, []);

  const clamp = useCallback((x: number, y: number, size: number) => {
    const hx = size / 2;
    const hy = Math.min(size / 2, zone.height * 0.08);
    return {
      x: Math.max(zone.left + hx, Math.min(zone.left + zone.width  - hx, x)),
      y: Math.max(zone.top  + hy, Math.min(zone.top  + zone.height - hy, y)),
    };
  }, [zone]);

  const onPriceChangeRef   = useRef(onPriceChange);
  const onPositionChangeRef = useRef(onPositionChange);
  useEffect(() => { onPriceChangeRef.current   = onPriceChange; });
  useEffect(() => { onPositionChangeRef.current = onPositionChange; });
  useEffect(() => { onPositionChangeRef.current?.({ x: pos.x, y: pos.y, size: pos.size }); }, [pos]);

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

  const pct  = Math.round(((pos.size - minSize) / (maxSize - minSize)) * 100);
  const step = (maxSize - minSize) / 10;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative w-full select-none overflow-hidden rounded-xl bg-white"
        style={{ touchAction: "none" }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const p = toPct(e.clientX, e.clientY);
          setPos((prev) => ({ ...clamp(p.x - dragOffset.current.dx, p.y - dragOffset.current.dy, prev.size), size: prev.size }));
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mockupSrc} alt="product" className="w-full block pointer-events-none" draggable={false} />
        <div className="absolute pointer-events-none" style={{
          left: `${zone.left}%`, top: `${zone.top}%`,
          width: `${zone.width}%`, height: `${zone.height}%`,
          border: "2px dashed rgba(241,85,51,0.75)", borderRadius: 4,
          background: "rgba(241,85,51,0.04)",
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={designSrc} alt="design" draggable={false} className="absolute cursor-grab active:cursor-grabbing"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.size}%`, transform: "translate(-50%,-50%)", touchAction: "none", userSelect: "none" }}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.target as HTMLImageElement).setPointerCapture(e.pointerId);
            dragging.current = true;
            const p = toPct(e.clientX, e.clientY);
            dragOffset.current = { dx: p.x - pos.x, dy: p.y - pos.y };
          }} />
        <p className="absolute bottom-2 inset-x-0 text-center text-[9px] text-ds-muted pointer-events-none drop-shadow">
          drag to reposition · stays within print zone
        </p>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-ds-body">Design size</span>
          <span className="font-bold text-brand">{pct}% of print area</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPos((p) => { const s = Math.max(minSize, p.size - step); return { size: s, ...clamp(p.x, p.y, s) }; })}
            className="w-8 h-8 rounded-full border border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0">−</button>
          <input type="range" min={minSize} max={maxSize} step={0.5} value={pos.size}
            onChange={(e) => { const s = Number(e.target.value); setPos((p) => ({ size: s, ...clamp(p.x, p.y, s) })); }}
            className="flex-1 accent-orange-500 h-1.5" />
          <button onClick={() => setPos((p) => { const s = Math.min(maxSize, p.size + step); return { size: s, ...clamp(p.x, p.y, s) }; })}
            className="w-8 h-8 rounded-full border border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-900 transition-all font-bold text-lg leading-none flex-shrink-0">+</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN TAB ─────────────────────────────────────────────────────────────────

export default function DesignerTab({ userId }: { userId: string }) {
  // Step: 0=product, 1=design, 2=done
  const [step, setStep] = useState(0);

  // Product selection
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [color,   setColor]   = useState(PRODUCTS[0].colors[0]);
  const [size,    setSize]    = useState(PRODUCTS[0].sizes[2] ?? PRODUCTS[0].sizes[0]);

  // Design name
  const [designName, setDesignName] = useState("");

  // Design upload state
  const [activeTab,       setActiveTab]   = useState<"front" | "back">("front");
  const [frontDesignSrc,  setFrontDesignSrc]  = useState("");
  const [backDesignSrc,   setBackDesignSrc]   = useState("");
  const frontDesignDataUrl = useRef("");
  const backDesignDataUrl  = useRef("");

  // Print pricing
  const [frontPrintPrice, setFrontPrintPrice] = useState(0);
  const [backPrintPrice,  setBackPrintPrice]  = useState(0);
  const [frontPrintTier,  setFrontPrintTier]  = useState("");
  const [backPrintTier,   setBackPrintTier]   = useState("");
  const [frontPrintDims,  setFrontPrintDims]  = useState("");

  // Position for thumbnail
  const [frontPos, setFrontPos] = useState<{ x: number; y: number; size: number } | null>(null);
  const [backPos,  setBackPos]  = useState<{ x: number; y: number; size: number } | null>(null);

  // Upload state
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack,  setUploadingBack]  = useState(false);

  // Save state
  const [saving,    setSaving]    = useState(false);
  const [savedRef,  setSavedRef]  = useState("");
  const [saveError, setSaveError] = useState("");

  const isOversized = product.id.includes("oversized");
  const zoneKey: keyof typeof PHOTO_ZONE =
    product.id === "baby-tee" ? "baby" : isOversized ? "oversized" : "regular";

  const totalPrint = frontPrintPrice + backPrintPrice;
  const hasAnyDesign = !!frontDesignSrc || !!backDesignSrc;

  // Reset when product changes
  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p);
    setColor(p.colors[0]);
    setSize(p.sizes[2] ?? p.sizes[0]);
    setFrontDesignSrc("");
    setBackDesignSrc("");
    frontDesignDataUrl.current = "";
    backDesignDataUrl.current  = "";
    setFrontPrintPrice(0);
    setBackPrintPrice(0);
    setFrontPrintTier("");
    setBackPrintTier("");
    setFrontPrintDims("");
    setFrontPos(null);
    setBackPos(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (side === "front") setUploadingFront(true);
    else                  setUploadingBack(true);

    try {
      const previewUrl = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = (ev) => res(ev.target?.result as string ?? "");
        reader.readAsDataURL(file);
      });

      if (side === "front") { frontDesignDataUrl.current = previewUrl; setFrontDesignSrc(previewUrl); }
      else                  { backDesignDataUrl.current  = previewUrl; setBackDesignSrc(previewUrl);  }

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-design", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          if (side === "front") setFrontDesignSrc(url);
          else                  setBackDesignSrc(url);
        }
      }
    } catch {}

    if (side === "front") setUploadingFront(false);
    else                  setUploadingBack(false);
  };

  const handleSave = async () => {
    if (!hasAnyDesign) return;
    setSaving(true);
    setSaveError("");
    try {
      const fDataUrl = frontDesignDataUrl.current || frontDesignSrc;
      const bDataUrl = backDesignDataUrl.current  || backDesignSrc;

      const [thumbnail, backThumbnail] = await Promise.all([
        color.mockupFront && fDataUrl && frontPos
          ? makeCompositeThumbnail(color.mockupFront, fDataUrl, frontPos)
          : Promise.resolve(""),
        color.mockupBack && bDataUrl && backPos
          ? makeCompositeThumbnail(color.mockupBack, bDataUrl, backPos)
          : Promise.resolve(""),
      ]);

      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: designName.trim() || `${product.name} – ${color.name}`,
          productId: product.id, productName: product.name, gsm: product.gsm,
          colorName: color.name, colorHex: color.hex, size,
          printTier: [frontPrintTier, backPrintTier].filter(Boolean).join(" + ") || null,
          frontPrintTier: frontPrintTier || null,
          backPrintTier:  backPrintTier  || null,
          printDims: frontPrintDims || null,
          blankPrice: product.blankPrice,
          printPrice: totalPrint,
          frontPrintPrice, backPrintPrice,
          hasDesign: hasAnyDesign,
          thumbnail:     thumbnail     || null,
          backThumbnail: backThumbnail || null,
          frontDesignUrl: frontDesignSrc || null,
          backDesignUrl:  backDesignSrc  || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setSavedRef(json.sku ?? json.designId ?? "saved");
      setStep(2);
    } catch (e) {
      setSaveError((e as Error).message);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setStep(0);
    setDesignName("");
    setFrontDesignSrc("");
    setBackDesignSrc("");
    frontDesignDataUrl.current = "";
    backDesignDataUrl.current  = "";
    setFrontPrintPrice(0);
    setBackPrintPrice(0);
    setFrontPrintTier("");
    setBackPrintTier("");
    setFrontPrintDims("");
    setFrontPos(null);
    setBackPos(null);
    setSavedRef("");
    setSaveError("");
    setActiveTab("front");
  };

  const totalItem = product.blankPrice + totalPrint;

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ letterSpacing: "-0.04em" }}>Design saved!</h2>
        <p className="text-ds-body text-sm mb-1">
          {designName.trim() || `${product.name} – ${color.name}`}
        </p>
        <p className="text-xs font-mono text-ds-muted mb-8">{savedRef}</p>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="px-5 py-2.5 rounded-full border border-black/[0.06] text-sm font-semibold hover:bg-ds-light-gray transition-colors">
            + Create another
          </button>
          <a href="?tab=designs">
            <button className="px-5 py-2.5 rounded-full bg-ds-dark text-white text-sm font-semibold hover:bg-ds-dark2 transition-colors">
              View my designs →
            </button>
          </a>
        </div>
      </motion.div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ letterSpacing: "-0.04em" }}>Design Studio</h2>
        <p className="text-sm text-ds-muted mt-0.5">Create and save designs to your library. Name them — they become product titles on Shopify.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">

        {/* ── Left: product picker + design upload ── */}
        <div className="space-y-5">

          {/* Step 0: Product picker */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.04]">
              <p className="text-xs font-bold uppercase tracking-widest text-ds-muted">Product</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <button key={p.id} onClick={() => handleProductChange(p)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    product.id === p.id
                      ? "border-zinc-900 bg-ds-dark text-white"
                      : "border-black/[0.06] hover:border-zinc-300"
                  }`}>
                  <p className={`text-sm font-semibold ${product.id === p.id ? "text-white" : "text-ds-dark"}`}
                    style={{ letterSpacing: "-0.02em" }}>{p.name}</p>
                  <p className={`text-[10px] mt-0.5 ${product.id === p.id ? "text-zinc-400" : "text-ds-muted"}`}>{p.gsm}</p>
                </button>
              ))}
            </div>

            {/* Colour */}
            <div className="px-4 pb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-ds-muted mb-2.5">Colour — <span className="text-ds-body normal-case tracking-normal font-medium">{color.name}</span></p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button key={c.name} title={c.name} onClick={() => setColor(c)}
                    className="w-9 h-9 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      background: c.hex,
                      border: color.name === c.name ? "3px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                      boxShadow: color.name === c.name ? "0 0 0 2px white, 0 0 0 4px #f15533" : "none",
                    }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="px-4 pb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-ds-muted mb-2.5">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold border-2 transition-all ${
                      size === s
                        ? "border-zinc-900 bg-ds-dark text-white"
                        : "border-black/[0.06] text-ds-body hover:border-zinc-300"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: Design upload */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.04]">
              <p className="text-xs font-bold uppercase tracking-widest text-ds-muted">Design</p>
            </div>
            <div className="p-4">
              {/* Front / Back tabs */}
              <div className="flex gap-1 bg-black/[0.05] rounded-xl p-1 mb-4">
                {(["front", "back"] as const).map((tab) => {
                  const has = tab === "front" ? !!frontDesignSrc : !!backDesignSrc;
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                        activeTab === tab ? "bg-white text-ds-dark shadow-sm" : "text-ds-muted hover:text-ds-body"
                      }`}>
                      {tab} print
                      {has && <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "front" ? (
                  <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {!frontDesignSrc ? (
                      <label className="block w-full border-2 border-dashed border-black/[0.06] rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-black/[0.05] group-hover:bg-orange-100 transition-colors flex items-center justify-center mx-auto mb-2.5">
                          {uploadingFront
                            ? <svg className="w-5 h-5 text-brand animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            : <svg className="w-5 h-5 text-ds-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          }
                        </div>
                        <p className="font-semibold text-ds-body text-sm">{uploadingFront ? "Uploading…" : "Upload front design"}</p>
                        <p className="text-xs text-ds-muted mt-1">PNG · JPG · WebP</p>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploadingFront} onChange={(e) => onFileChange(e, "front")} />
                      </label>
                    ) : (
                      <div>
                        <DesignPlacer key={`f-${color.name}`} designSrc={frontDesignSrc}
                          mockupSrc={color.mockupFront ?? ""}
                          zoneKey={zoneKey}
                          onPositionChange={(p) => setFrontPos(p)}
                          onPriceChange={(p, t, d) => { setFrontPrintPrice(p); setFrontPrintTier(t); setFrontPrintDims(d); }} />
                        <div className="flex gap-3 mt-3">
                          <label className="text-xs text-brand font-semibold underline hover:text-brand-dark cursor-pointer">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "front")} />
                          </label>
                          <span className="text-zinc-200">·</span>
                          <button onClick={() => { setFrontDesignSrc(""); frontDesignDataUrl.current = ""; setFrontPrintPrice(0); setFrontPrintTier(""); setFrontPrintDims(""); }}
                            className="text-xs text-ds-muted font-semibold underline hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {!backDesignSrc ? (
                      <label className="block w-full border-2 border-dashed border-black/[0.06] rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-black/[0.05] group-hover:bg-orange-100 transition-colors flex items-center justify-center mx-auto mb-2.5">
                          {uploadingBack
                            ? <svg className="w-5 h-5 text-brand animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            : <svg className="w-5 h-5 text-ds-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          }
                        </div>
                        <p className="font-semibold text-ds-body text-sm">{uploadingBack ? "Uploading…" : "Upload back design"}</p>
                        <p className="text-xs text-ds-muted mt-1">PNG · JPG · WebP</p>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploadingBack} onChange={(e) => onFileChange(e, "back")} />
                      </label>
                    ) : (
                      <div>
                        <DesignPlacer key={`b-${color.name}`} designSrc={backDesignSrc}
                          mockupSrc={color.mockupBack ?? color.mockupFront ?? ""}
                          zoneKey={zoneKey}
                          onPositionChange={(p) => setBackPos(p)}
                          onPriceChange={(p, t, _d) => { setBackPrintPrice(p); setBackPrintTier(t); }} />
                        <div className="flex gap-3 mt-3">
                          <label className="text-xs text-brand font-semibold underline hover:text-brand-dark cursor-pointer">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "back")} />
                          </label>
                          <span className="text-zinc-200">·</span>
                          <button onClick={() => { setBackDesignSrc(""); backDesignDataUrl.current = ""; setBackPrintPrice(0); setBackPrintTier(""); }}
                            className="text-xs text-ds-muted font-semibold underline hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Right: live preview + save ── */}
        <div className="space-y-4">

          {/* Live mockup preview (big) */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.04] flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-ds-muted">Preview</p>
              {(frontDesignSrc || backDesignSrc) && (
                <div className="flex gap-1">
                  {(["front", "back"] as const).map((s) => {
                    const has = s === "front" ? !!frontDesignSrc : !!backDesignSrc;
                    return (
                      <button key={s} onClick={() => setActiveTab(s)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                          activeTab === s ? "bg-ds-dark text-white border-zinc-900" : "border-black/[0.06] text-ds-body hover:border-zinc-400"
                        }`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        {has && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTab === "front" ? (color.mockupFront ?? "") : (color.mockupBack ?? color.mockupFront ?? "")}
                alt={color.name}
                className="w-full object-contain rounded-lg"
              />
              {/* Colour + size pill */}
              <div className="mt-3 flex items-center gap-2 justify-center">
                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/[0.08]" style={{ background: color.hex }} />
                <span className="text-xs text-ds-body font-medium">{product.name} · {color.name} · {size}</span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-ds-light-gray rounded-2xl border border-black/[0.06] p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ds-muted">Blank garment</span>
              <span className="font-semibold text-ds-dark">₹{product.blankPrice}</span>
            </div>
            {frontPrintPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted">Front print ({frontPrintTier})</span>
                <span className="font-semibold text-brand-dark">+₹{frontPrintPrice}</span>
              </div>
            )}
            {backPrintPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted">Back print ({backPrintTier})</span>
                <span className="font-semibold text-brand-dark">+₹{backPrintPrice}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t border-black/[0.06]">
              <span className="font-semibold text-ds-dark uppercase text-xs tracking-tight">Item total</span>
              <span className="font-bold text-ds-dark">₹{totalItem}</span>
            </div>
            <p className="text-[10px] text-ds-muted">+ shipping &amp; GST · fulfilled from India</p>
          </div>

          {/* Design name input */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-ds-muted mb-2">
              Design name
              <span className="text-ds-muted normal-case tracking-normal font-normal ml-1">(shown as product title on Shopify)</span>
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder={`${product.name} – ${color.name}`}
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:border-zinc-400 placeholder:text-ds-muted/60 bg-white"
            />
          </div>

          {/* Error */}
          {saveError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              ⚠️ {saveError}
            </p>
          )}

          {/* Save CTA */}
          {!hasAnyDesign && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              Upload at least one design (front or back) to save.
            </p>
          )}

          <button
            disabled={saving || !hasAnyDesign}
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-ds-dark text-white font-bold text-sm hover:bg-ds-dark2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save design to library
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
