"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, getTier } from "@/lib/products";

// ─── THUMBNAIL HELPER ─────────────────────────────────────────────────────────

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
      const safe = () => { try { return canvas.toDataURL("image/jpeg", 0.93); } catch { return ""; } };
      const design = new Image();
      design.crossOrigin = "anonymous";
      design.onload = () => {
        const cx = (pos.x / 100) * W, cy = (pos.y / 100) * H;
        const dw = (pos.size / 100) * W, dh = dw * (design.naturalHeight / design.naturalWidth);
        try { ctx.drawImage(design, cx - dw / 2, cy - dh / 2, dw, dh); } catch { /* tainted */ }
        resolve(safe());
      };
      design.onerror = () => resolve(safe());
      design.src = designSrc;
    };
    mockup.onerror = () => resolve("");
    mockup.src = mockupSrc;
  });
}

// ─── DEFAULT PRINT ZONES ──────────────────────────────────────────────────────

const DEFAULT_ZONES = {
  regular:   { left: 30,   top: 29.8, width: 36, height: 44 },
  oversized: { left: 28.3, top: 29.8, width: 40, height: 48 },
  baby:      { left: 28.3, top: 29.8, width: 40, height: 26 },
};
const MAX_PRINT_W_IN = 19;
const MAX_PRINT_H_IN = 15.5;

type PhotoZone = typeof DEFAULT_ZONES;

// ─── DESIGN PLACER ────────────────────────────────────────────────────────────

function DesignPlacer({
  designSrc, mockupSrc, zoneKey, photoZone, onPriceChange, onPositionChange,
}: {
  designSrc: string; mockupSrc: string; zoneKey: keyof PhotoZone; photoZone: PhotoZone;
  onPriceChange: (price: number, tier: string, dims: string) => void;
  onPositionChange?: (pos: { x: number; y: number; size: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zone = photoZone[zoneKey];

  const minSize  = zone.width * 0.12;
  const maxSize  = zone.width * 0.90;
  const initSize = zone.width * 0.38;

  const [pos, setPos] = useState({
    x: zone.left + zone.width  / 2,
    y: zone.top  + zone.height / 2,
    size: initSize,
  });

  const dragging   = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const toPct = useCallback((cx: number, cy: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100 };
  }, []);

  const clamp = useCallback((x: number, y: number, sz: number) => {
    const hx = sz / 2;
    const hy = Math.min(sz / 2, zone.height * 0.08);
    return {
      x: Math.max(zone.left + hx, Math.min(zone.left + zone.width  - hx, x)),
      y: Math.max(zone.top  + hy, Math.min(zone.top  + zone.height - hy, y)),
    };
  }, [zone]);

  const onPriceRef    = useRef(onPriceChange);
  const onPositionRef = useRef(onPositionChange);
  useEffect(() => { onPriceRef.current    = onPriceChange; });
  useEffect(() => { onPositionRef.current = onPositionChange; });

  useEffect(() => { onPositionRef.current?.({ x: pos.x, y: pos.y, size: pos.size }); }, [pos]);
  useEffect(() => {
    const fw = pos.size / zone.width, fh = pos.size / zone.height;
    const sqin = fw * MAX_PRINT_W_IN * fh * MAX_PRINT_H_IN;
    const tier = getTier(sqin);
    onPriceRef.current(tier.price, tier.label, `${(fw * MAX_PRINT_W_IN).toFixed(1)}"×${(fh * MAX_PRINT_H_IN).toFixed(1)}"`);
  }, [pos.size, zone.width, zone.height]); // eslint-disable-line

  // Reset position when zone changes (product/colour switch)
  useEffect(() => {
    setPos({ x: zone.left + zone.width / 2, y: zone.top + zone.height / 2, size: zone.width * 0.38 });
  }, [zone.left, zone.top, zone.width, zone.height]);

  const pct  = Math.round(((pos.size - minSize) / (maxSize - minSize)) * 100);
  const step = (maxSize - minSize) / 10;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 select-none overflow-hidden rounded-2xl bg-[#f8f8f8]"
        style={{ touchAction: "none", minHeight: 320 }}
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

        {/* Print zone outline */}
        <div className="absolute pointer-events-none" style={{
          left: `${zone.left}%`, top: `${zone.top}%`,
          width: `${zone.width}%`, height: `${zone.height}%`,
          border: "1.5px dashed rgba(241,85,51,0.65)",
          borderRadius: 4, background: "rgba(241,85,51,0.03)",
        }} />

        {/* Draggable design */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={designSrc} alt="design" draggable={false}
          className="absolute cursor-grab active:cursor-grabbing drop-shadow-md"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.size}%`, transform: "translate(-50%,-50%)", touchAction: "none", userSelect: "none" }}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.target as HTMLImageElement).setPointerCapture(e.pointerId);
            dragging.current = true;
            const p = toPct(e.clientX, e.clientY);
            dragOffset.current = { dx: p.x - pos.x, dy: p.y - pos.y };
          }} />

        <p className="absolute bottom-2 inset-x-0 text-center text-[9px] text-zinc-400 pointer-events-none">
          drag to reposition
        </p>
      </div>

      {/* Size slider */}
      <div className="px-1">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ds-muted font-medium">Design size</span>
          <span className="font-bold text-brand">{pct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPos((p) => { const s = Math.max(minSize, p.size - step); return { size: s, ...clamp(p.x, p.y, s) }; })}
            className="w-7 h-7 rounded-full border border-black/[0.08] flex items-center justify-center text-ds-muted hover:border-zinc-400 transition-all font-bold text-base leading-none flex-shrink-0">−</button>
          <input type="range" min={minSize} max={maxSize} step={0.5} value={pos.size}
            onChange={(e) => { const s = Number(e.target.value); setPos((p) => ({ size: s, ...clamp(p.x, p.y, s) })); }}
            className="flex-1 accent-orange-500 h-1" />
          <button onClick={() => setPos((p) => { const s = Math.min(maxSize, p.size + step); return { size: s, ...clamp(p.x, p.y, s) }; })}
            className="w-7 h-7 rounded-full border border-black/[0.08] flex items-center justify-center text-ds-muted hover:border-zinc-400 transition-all font-bold text-base leading-none flex-shrink-0">+</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN TAB ─────────────────────────────────────────────────────────────────

export default function DesignerTab({ userId }: { userId: string }) {
  // Studio settings (print zones)
  const [photoZone, setPhotoZone] = useState(DEFAULT_ZONES);
  useEffect(() => {
    fetch("/api/studio-settings")
      .then((r) => r.json())
      .then((d) => { if (d.print_zones) setPhotoZone(d.print_zones); })
      .catch(() => {});
  }, []);

  // Product / colour / size
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [color,   setColor]   = useState(PRODUCTS[0].colors[0]);
  const [size,    setSize]    = useState(PRODUCTS[0].sizes[2] ?? PRODUCTS[0].sizes[0]);

  // Design name
  const [designName, setDesignName] = useState("");

  // Active side tab + design state
  const [side,           setSide]           = useState<"front" | "back">("front");
  const [frontDesignSrc, setFrontDesignSrc] = useState("");
  const [backDesignSrc,  setBackDesignSrc]  = useState("");
  const frontDataUrl = useRef("");
  const backDataUrl  = useRef("");

  // Print pricing
  const [frontPrice, setFrontPrice] = useState(0);
  const [backPrice,  setBackPrice]  = useState(0);
  const [frontTier,  setFrontTier]  = useState("");
  const [backTier,   setBackTier]   = useState("");
  const [frontDims,  setFrontDims]  = useState("");

  // Position refs for thumbnail
  const [frontPos, setFrontPos] = useState<{ x: number; y: number; size: number } | null>(null);
  const [backPos,  setBackPos]  = useState<{ x: number; y: number; size: number } | null>(null);

  // Upload
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack,  setUploadingBack]  = useState(false);

  // Save
  const [saving,    setSaving]    = useState(false);
  const [savedSku,  setSavedSku]  = useState("");
  const [saveError, setSaveError] = useState("");

  const isOversized = product.id.includes("oversized");
  const zoneKey: keyof PhotoZone = product.id === "baby-tee" ? "baby" : isOversized ? "oversized" : "regular";
  const hasDesign  = !!frontDesignSrc || !!backDesignSrc;
  const activeSrc  = side === "front" ? frontDesignSrc : backDesignSrc;
  const activeMock = side === "front"
    ? (color.mockupFront ?? "")
    : (color.mockupBack ?? color.mockupFront ?? "");
  const totalPrint = frontPrice + backPrice;
  const totalItem  = product.blankPrice + totalPrint;

  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p); setColor(p.colors[0]);
    setSize(p.sizes[2] ?? p.sizes[0]);
    setFrontDesignSrc(""); setBackDesignSrc("");
    frontDataUrl.current = ""; backDataUrl.current = "";
    setFrontPrice(0); setBackPrice(0);
    setFrontTier(""); setBackTier(""); setFrontDims("");
    setFrontPos(null); setBackPos(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, s: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (s === "front") setUploadingFront(true); else setUploadingBack(true);
    try {
      const preview = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = (ev) => res(ev.target?.result as string ?? "");
        r.readAsDataURL(file);
      });
      if (s === "front") { frontDataUrl.current = preview; setFrontDesignSrc(preview); setSide("front"); }
      else               { backDataUrl.current  = preview; setBackDesignSrc(preview);  setSide("back"); }

      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload-design", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        if (url) { if (s === "front") setFrontDesignSrc(url); else setBackDesignSrc(url); }
      }
    } catch {}
    if (s === "front") setUploadingFront(false); else setUploadingBack(false);
  };

  const handleSave = async () => {
    if (!hasDesign) return;
    setSaving(true); setSaveError("");
    try {
      const fd = frontDataUrl.current || frontDesignSrc;
      const bd = backDataUrl.current  || backDesignSrc;
      const [thumb, backThumb] = await Promise.all([
        color.mockupFront && fd && frontPos ? makeCompositeThumbnail(color.mockupFront, fd, frontPos) : Promise.resolve(""),
        color.mockupBack  && bd && backPos  ? makeCompositeThumbnail(color.mockupBack,  bd, backPos)  : Promise.resolve(""),
      ]);
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: designName.trim() || `${product.name} – ${color.name}`,
          productId: product.id, productName: product.name, gsm: product.gsm,
          colorName: color.name, colorHex: color.hex, size,
          printTier: [frontTier, backTier].filter(Boolean).join(" + ") || null,
          frontPrintTier: frontTier || null, backPrintTier: backTier || null,
          printDims: frontDims || null,
          blankPrice: product.blankPrice, printPrice: totalPrint,
          frontPrintPrice: frontPrice, backPrintPrice: backPrice,
          hasDesign,
          thumbnail: thumb || null, backThumbnail: backThumb || null,
          frontDesignUrl: frontDesignSrc || null, backDesignUrl: backDesignSrc || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setSavedSku(json.sku ?? json.designId ?? "saved");
    } catch (e) { setSaveError((e as Error).message); }
    setSaving(false);
  };

  const handleReset = () => {
    setFrontDesignSrc(""); setBackDesignSrc("");
    frontDataUrl.current = ""; backDataUrl.current = "";
    setFrontPrice(0); setBackPrice(0);
    setFrontTier(""); setBackTier(""); setFrontDims("");
    setFrontPos(null); setBackPos(null);
    setDesignName(""); setSavedSku(""); setSaveError("");
    setSide("front");
  };

  // ── Success ──
  if (savedSku) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ letterSpacing: "-0.04em" }}>Design saved!</h2>
        <p className="text-sm text-ds-body mb-1">{designName.trim() || `${product.name} – ${color.name}`}</p>
        <p className="text-xs font-mono text-ds-muted mb-7">{savedSku}</p>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="px-5 py-2.5 rounded-full border border-black/[0.08] text-sm font-semibold hover:bg-ds-light-gray transition-colors">
            + New design
          </button>
          <a href="?tab=designs">
            <button className="px-5 py-2.5 rounded-full bg-ds-dark text-white text-sm font-semibold hover:bg-ds-dark2 transition-colors">
              View library →
            </button>
          </a>
        </div>
      </motion.div>
    );
  }

  // ── Main layout ──
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ letterSpacing: "-0.04em" }}>Design Studio</h2>
        <p className="text-sm text-ds-muted mt-0.5">Customise a product, position your artwork, and save it to your design library.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

        {/* ── LEFT: controls ── */}
        <div className="flex flex-col gap-4">

          {/* Product */}
          <div className="bg-white rounded-2xl border border-black/[0.06]">
            <div className="px-4 pt-4 pb-3 border-b border-black/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Product</p>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {PRODUCTS.map((p) => (
                <button key={p.id} onClick={() => handleProductChange(p)}
                  className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
                    product.id === p.id ? "border-zinc-900 bg-ds-dark" : "border-black/[0.06] hover:border-zinc-200"
                  }`}>
                  <p className={`text-[13px] font-semibold leading-tight ${product.id === p.id ? "text-white" : "text-ds-dark"}`}
                    style={{ letterSpacing: "-0.02em" }}>{p.name}</p>
                  <p className={`text-[10px] mt-0.5 ${product.id === p.id ? "text-zinc-400" : "text-ds-muted"}`}>{p.gsm}</p>
                </button>
              ))}
            </div>

            {/* Colour */}
            <div className="px-4 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-2">
                Colour <span className="text-ds-body normal-case tracking-normal font-medium">— {color.name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} title={c.name} onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none flex-shrink-0"
                    style={{
                      background: c.hex,
                      border: color.name === c.name ? "2.5px solid #f15533" : c.border ? "1.5px solid #d1d5db" : "none",
                      boxShadow: color.name === c.name ? "0 0 0 2px white, 0 0 0 3.5px #f15533" : "none",
                    }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="px-4 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-2">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`min-w-[40px] h-9 px-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      size === s ? "border-zinc-900 bg-ds-dark text-white" : "border-black/[0.06] text-ds-body hover:border-zinc-300"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Design upload */}
          <div className="bg-white rounded-2xl border border-black/[0.06]">
            <div className="px-4 pt-4 pb-3 border-b border-black/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Artwork</p>
            </div>

            {/* Front / Back switcher */}
            <div className="p-3">
              <div className="flex gap-1 bg-black/[0.04] rounded-xl p-1 mb-3">
                {(["front", "back"] as const).map((tab) => {
                  const has = tab === "front" ? !!frontDesignSrc : !!backDesignSrc;
                  return (
                    <button key={tab} onClick={() => setSide(tab)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                        side === tab ? "bg-white text-ds-dark shadow-sm" : "text-ds-muted hover:text-ds-body"
                      }`}>
                      {tab}
                      {has && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {side === "front" ? (
                  <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                    {!frontDesignSrc ? (
                      <label className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-black/[0.07] rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
                        <div className="w-9 h-9 rounded-xl bg-black/[0.04] group-hover:bg-orange-100 transition-colors flex items-center justify-center">
                          {uploadingFront
                            ? <svg className="w-4 h-4 text-brand animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            : <svg className="w-4 h-4 text-ds-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          }
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-ds-body">{uploadingFront ? "Uploading…" : "Upload front artwork"}</p>
                          <p className="text-xs text-ds-muted">PNG · JPG · WebP</p>
                        </div>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploadingFront} onChange={(e) => onFileChange(e, "front")} />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-ds-light-gray rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={frontDesignSrc} alt="front" className="w-12 h-12 rounded-lg object-contain bg-white border border-black/[0.06]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ds-dark truncate">Front artwork</p>
                          {frontTier && <p className="text-[10px] text-ds-muted mt-0.5">{frontTier} · {frontDims} · +₹{frontPrice}</p>}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <label className="text-[10px] text-brand font-semibold cursor-pointer hover:underline">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "front")} />
                          </label>
                          <button onClick={() => { setFrontDesignSrc(""); frontDataUrl.current = ""; setFrontPrice(0); setFrontTier(""); setFrontDims(""); }}
                            className="text-[10px] text-ds-muted font-semibold hover:text-red-500 transition-colors text-left">Remove</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                    {!backDesignSrc ? (
                      <label className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-black/[0.07] rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
                        <div className="w-9 h-9 rounded-xl bg-black/[0.04] group-hover:bg-orange-100 transition-colors flex items-center justify-center">
                          {uploadingBack
                            ? <svg className="w-4 h-4 text-brand animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            : <svg className="w-4 h-4 text-ds-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          }
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-ds-body">{uploadingBack ? "Uploading…" : "Upload back artwork"}</p>
                          <p className="text-xs text-ds-muted">PNG · JPG · WebP</p>
                        </div>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploadingBack} onChange={(e) => onFileChange(e, "back")} />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-ds-light-gray rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={backDesignSrc} alt="back" className="w-12 h-12 rounded-lg object-contain bg-white border border-black/[0.06]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ds-dark truncate">Back artwork</p>
                          {backTier && <p className="text-[10px] text-ds-muted mt-0.5">{backTier} · +₹{backPrice}</p>}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <label className="text-[10px] text-brand font-semibold cursor-pointer hover:underline">
                            Change
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFileChange(e, "back")} />
                          </label>
                          <button onClick={() => { setBackDesignSrc(""); backDataUrl.current = ""; setBackPrice(0); setBackTier(""); }}
                            className="text-[10px] text-ds-muted font-semibold hover:text-red-500 transition-colors text-left">Remove</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Design name */}
          <div className="bg-white rounded-2xl border border-black/[0.06] px-4 py-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-2">
              Design name
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder={`${product.name} – ${color.name}`}
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:border-zinc-400 placeholder:text-zinc-300 bg-white"
            />
            <p className="text-[10px] text-ds-muted mt-1.5">Used as the product title when pushed to Shopify</p>
          </div>

          {/* Pricing */}
          <div className="bg-ds-light-gray rounded-2xl border border-black/[0.06] px-4 py-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted">Blank garment</span>
                <span className="font-semibold text-ds-dark">₹{product.blankPrice}</span>
              </div>
              {frontPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-ds-muted">Front print <span className="text-[10px]">({frontTier})</span></span>
                  <span className="font-semibold text-brand-dark">+₹{frontPrice}</span>
                </div>
              )}
              {backPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-ds-muted">Back print <span className="text-[10px]">({backTier})</span></span>
                  <span className="font-semibold text-brand-dark">+₹{backPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 mt-0.5 border-t border-black/[0.06]">
                <span className="font-bold text-ds-dark text-xs uppercase tracking-tight">Item total</span>
                <span className="font-bold text-ds-dark">₹{totalItem}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {saveError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠️ {saveError}</p>
          )}
          {!hasDesign && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              Upload at least one design to save.
            </p>
          )}

          {/* Save */}
          <button disabled={saving || !hasDesign} onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-ds-dark text-white font-bold text-sm hover:bg-ds-dark2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {saving ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Saving…</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save design to library</>
            )}
          </button>
        </div>

        {/* ── RIGHT: live preview with DesignPlacer ── */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-black/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/[0.1]" style={{ background: color.hex }} />
              <span className="text-sm font-semibold text-ds-dark" style={{ letterSpacing: "-0.02em" }}>
                {product.name} · {color.name} · {size}
              </span>
            </div>
            {/* Side toggle */}
            <div className="flex gap-1">
              {(["front", "back"] as const).map((s) => {
                const has = s === "front" ? !!frontDesignSrc : !!backDesignSrc;
                return (
                  <button key={s} onClick={() => setSide(s)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      side === s ? "bg-ds-dark text-white border-zinc-900" : "border-black/[0.06] text-ds-body hover:border-zinc-300"
                    }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                    {has && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5">
            {activeSrc ? (
              <DesignPlacer
                key={`${side}-${color.name}`}
                designSrc={activeSrc}
                mockupSrc={activeMock}
                zoneKey={zoneKey}
                photoZone={photoZone}
                onPositionChange={(p) => { if (side === "front") setFrontPos(p); else setBackPos(p); }}
                onPriceChange={(p, t, d) => {
                  if (side === "front") { setFrontPrice(p); setFrontTier(t); setFrontDims(d); }
                  else                 { setBackPrice(p);  setBackTier(t);  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeMock} alt={color.name} className="w-full max-w-xs object-contain mx-auto" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-ds-body">No artwork yet</p>
                  <p className="text-xs text-ds-muted mt-1">Upload a {side} print from the panel on the left</p>
                </div>
              </div>
            )}
          </div>

          {/* Hint bar at bottom */}
          {activeSrc && (
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-ds-light-gray rounded-xl">
                <svg className="w-3.5 h-3.5 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-ds-muted">Drag your artwork to reposition · Use the slider to resize · Dashed line = print zone boundary</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
