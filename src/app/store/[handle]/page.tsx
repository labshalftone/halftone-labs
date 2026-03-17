"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";

interface StoreProduct {
  id: string;
  product_id: string;
  product_name: string;
  color_hex: string;
  color_name: string;
  sizes: string[];
  retail_price_inr: number;
  design_front_url: string | null;
  design_back_url: string | null;
  print_technique: string;
}

interface Store {
  id: string;
  handle: string;
  artist_name: string;
  description: string | null;
  instagram: string | null;
  store_products: StoreProduct[];
}

function ProductCard({ product, storeHandle }: { product: StoreProduct; storeHandle: string }) {
  const { addItem } = useCart();
  const { fmt } = useCurrency();
  const [selectedSize, setSelectedSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)] ?? product.sizes[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition-all"
    >
      {/* Product visual */}
      <div className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ background: product.color_hex + "22" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        {product.design_front_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.design_front_url} alt={product.product_name} className="w-32 h-32 object-contain relative z-10 drop-shadow-md" />
        ) : (
          <div className="w-28 h-28 rounded-xl relative z-10 flex items-center justify-center text-4xl"
            style={{ background: product.color_hex, opacity: 0.8 }}>
            👕
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.02em" }}>{product.product_name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{product.color_name}</p>
          </div>
          <span className="font-black text-zinc-900 text-sm">{fmt(product.retail_price_inr)}</span>
        </div>

        {/* Size selector */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {product.sizes.map((s) => (
            <button key={s} onClick={() => setSelectedSize(s)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${selectedSize === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
              {s}
            </button>
          ))}
        </div>

        <button onClick={handleAdd}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
          {added ? "✓ Added to cart" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

export default function StorePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/stores/${handle}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setStore)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8f7f5" }}>
        <div className="w-6 h-6 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f8f7f5" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">👕</div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2" style={{ letterSpacing: "-0.04em" }}>Store not found</h1>
          <p className="text-zinc-500 text-sm mb-6">This store doesn't exist or hasn't launched yet.</p>
          <Link href="/studio" className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Create your own store →
          </Link>
        </div>
      </div>
    );
  }

  const products = store.store_products ?? [];

  return (
    <div className="min-h-screen" style={{ background: "#f8f7f5" }}>
      {/* Store hero */}
      <div className="bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500 mb-4">Official Merch Store</p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-4" style={{ letterSpacing: "-0.055em" }}>
              {store.artist_name}
            </h1>
            {store.description && (
              <p className="text-zinc-400 text-lg max-w-xl leading-relaxed mb-6">{store.description}</p>
            )}
            {store.instagram && (
              <a href={`https://instagram.com/${store.instagram.replace("@", "")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @{store.instagram.replace("@", "")}
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-zinc-500">No products yet — check back soon.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black text-zinc-900 text-xl" style={{ letterSpacing: "-0.03em" }}>
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <ProductCard product={p} storeHandle={handle} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Halftone branding */}
      <div className="border-t border-zinc-200 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-zinc-400 text-xs">
          <span>Fulfilled by</span>
          <Link href="/" className="font-black text-zinc-500 hover:text-zinc-900 transition-colors">Halftone Labs</Link>
          <span>·</span>
          <Link href="/studio" className="hover:text-zinc-600 transition-colors">Create your own store →</Link>
        </div>
      </div>
    </div>
  );
}
