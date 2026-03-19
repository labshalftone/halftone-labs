"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import StoreNavbar from "@/components/StoreNavbar";
import SizeGuide, { type ProductKey } from "@/components/SizeGuide";
import type { Store, StoreProduct } from "../page";

const DARK_COLORS = ["#111111", "#1B2A4A", "#2355C0", "#C0392B", "#6B2D2D"];

function TeeMockup({
  color,
  designSrc,
  isOversized,
}: {
  color: string;
  designSrc?: string | null;
  isOversized?: boolean;
}) {
  const isDark = DARK_COLORS.includes(color);
  const body = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";

  return (
    <svg viewBox="0 0 200 230" className="w-full" style={{ maxHeight: 480 }}>
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.07)" />
      <path
        d={body}
        fill={color}
        stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)"}
        strokeWidth="1.5"
      />
      <path
        d={collar}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)"}
        strokeWidth="1.5"
      />
      {designSrc && (
        <image
          href={designSrc}
          x="62"
          y="57"
          width="76"
          height="88"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </svg>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string; productId: string }>;
}) {
  const { handle, productId } = use(params);
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<"photo" | "mockup">("photo");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const { addItem } = useCart();
  const { fmt } = useCurrency();

  useEffect(() => {
    fetch(`/api/stores/${handle}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: Store) => {
        setStore(data);
        const found = (data.store_products ?? []).find((p) => p.id === productId);
        if (!found) { setNotFound(true); return; }
        setProduct(found);
        setSelectedSize(found.sizes[Math.floor(found.sizes.length / 2)] ?? found.sizes[0] ?? "");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [handle, productId]);

  const handleAdd = () => {
    if (!product || !selectedSize) return;
    addItem({
      productId: product.product_id,
      productName: product.product_name,
      color: product.color_name,
      colorHex: product.color_hex,
      size: selectedSize,
      blankPrice: product.retail_price_inr,
      frontPrintPrice: 0,
      backPrintPrice: 0,
      frontPrintTier: "",
      backPrintTier: "",
      printTechnique: (product.print_technique as "DTG" | "DTF") ?? "DTG",
      printDims: "",
      frontDesignUrl: product.design_front_url ?? "",
      backDesignUrl: product.design_back_url ?? "",
      qty: 1,
      gsm: "",
      neckLabel: false,
    });
    // Record where checkout was initiated from so the checkout page can show the right back button
    sessionStorage.setItem(
      "checkout_origin",
      JSON.stringify({ type: "store", handle, name: store?.artist_name ?? "" })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
        <div className="w-6 h-6 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !store || !product) {
    return (
      <>
        <StoreNavbar storeName={store?.artist_name ?? "Store"} storeHandle={handle} variant="solid" />
        <div className="min-h-screen flex items-center justify-center p-6 pt-24" >
          <div className="text-center">
            <div className="text-5xl mb-4">👕</div>
            <h1 className="text-xl font-semibold text-ds-dark mb-2" style={{ letterSpacing: "-0.04em" }}>
              Product not found
            </h1>
            <Link href={`/store/${handle}`} className="text-sm font-bold text-brand hover:underline">
              ← Back to store
            </Link>
          </div>
        </div>
      </>
    );
  }

  const otherProducts = (store.store_products ?? []).filter((p) => p.id !== productId).slice(0, 4);
  const displayImage = product.image_url || product.design_front_url;
  const isOversized = product.product_id.includes("oversized");
  const hasPhoto = !!displayImage;

  // Determine default size guide tab from product_id
  const sizeGuideTab: ProductKey = product.product_id.includes("baby")
    ? "baby"
    : product.product_id.includes("french") || product.product_id.includes("-ft")
    ? "oversized-ft"
    : product.product_id.includes("oversized")
    ? "oversized-sj"
    : "regular";

  return (
    <div className="min-h-screen" >
      <StoreNavbar storeName={store.artist_name} storeHandle={handle} variant="solid" />

      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ds-muted mb-8">
          <Link href={`/store/${handle}`} className="hover:text-ds-body transition-colors font-semibold">
            {store.artist_name}
          </Link>
          <span>/</span>
          <span className="text-ds-body">{product.product_name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Product visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            {/* View toggle if we have both a photo and design */}
            {hasPhoto && product.design_front_url && product.image_url && (
              <div className="flex gap-2">
                {(["photo", "mockup"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      view === v
                        ? "bg-ds-dark text-white"
                        : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"
                    }`}
                  >
                    {v === "photo" ? "Product photo" : "Tee mockup"}
                  </button>
                ))}
              </div>
            )}

            <div className={`rounded-3xl overflow-hidden ${!hasPhoto || view === "mockup" ? "p-8" : ""}`}
              style={{ background: !hasPhoto || view === "mockup" ? product.color_hex + "18" : undefined }}>
              {hasPhoto && view === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage!}
                  alt={product.product_name}
                  className="w-full aspect-square object-cover rounded-3xl"
                />
              ) : (
                <TeeMockup
                  color={product.color_hex}
                  designSrc={product.design_front_url}
                  isOversized={isOversized}
                />
              )}
            </div>

            {/* Color swatch */}
            <div className="flex items-center gap-2 px-1">
              <span
                className="w-5 h-5 rounded-full border-2 border-white shadow"
                style={{ background: product.color_hex }}
              />
              <span className="text-sm text-ds-body">{product.color_name}</span>
            </div>
          </motion.div>

          {/* Right: Info + add to cart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-ds-muted mb-2">
              {product.print_technique} Print
            </p>
            <h1
              className="text-4xl font-semibold text-ds-dark mb-1 leading-tight"
              style={{ letterSpacing: "-0.04em" }}
            >
              {product.product_name}
            </h1>
            <p className="text-3xl font-semibold text-ds-dark mb-6">
              {fmt(product.retail_price_inr)}
            </p>

            {product.description && (
              <p className="text-ds-body text-sm leading-relaxed mb-8 border-l-2 border-black/[0.06] pl-4">
                {product.description}
              </p>
            )}

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest">Size</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ds-dark">{selectedSize}</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs font-semibold text-brand hover:text-brand-dark underline underline-offset-2 transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                      selectedSize === s
                        ? "bg-ds-dark text-white shadow-md"
                        : "bg-white text-ds-body border border-black/[0.06] hover:border-zinc-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`w-full py-4 rounded-2xl text-base font-semibold transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-ds-dark text-white hover:bg-ds-dark2 disabled:opacity-40"
              }`}
            >
              {added ? "✓ Added to cart" : `Add to Cart — ${fmt(product.retail_price_inr)}`}
            </button>

            {/* Shipping note */}
            <div className="mt-4 flex flex-col gap-2">
              {[
                { icon: "📦", text: "Ships in 5–7 business days" },
                { icon: "🎨", text: `${product.print_technique} printed, made to order` },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-ds-muted">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* More from this store */}
        {otherProducts.length > 0 && (
          <div className="mt-20">
            <h2
              className="font-semibold text-ds-dark text-lg mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              More from this store
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherProducts.map((p) => {
                const img = p.image_url || p.design_front_url;
                return (
                  <Link key={p.id} href={`/store/${handle}/${p.id}`}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:border-black/[0.06] hover:shadow-md transition-all"
                    >
                      <div
                        className="aspect-square flex items-center justify-center overflow-hidden"
                        style={{ background: p.color_hex + "22" }}
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg" style={{ background: p.color_hex }} />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-ds-dark text-xs truncate">{p.product_name}</p>
                        <p className="text-xs text-ds-body mt-0.5">{fmt(p.retail_price_inr)}</p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-black/[0.06] py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-ds-muted text-xs">
          <Link href="/track" className="hover:text-ds-body transition-colors">Track your order</Link>
          <span>·</span>
          <span>Shipped in 5–7 days</span>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultTab={sizeGuideTab}
        showBranding={false}
      />
    </div>
  );
}
