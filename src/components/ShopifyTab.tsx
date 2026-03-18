"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKU_CATALOG, type HLSku } from "@/lib/shopify-skus";
import { PRODUCTS } from "@/lib/products";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Connection {
  id: string;
  shop_domain: string;
  shop_name: string;
  is_active: boolean;
  created_at: string;
}

interface HLProduct {
  sku: string; productId: string; productName: string;
  colorName: string; colorHex: string; size: string;
  gsm: string; blankPrice: number;
}

interface EnrichedLineItem {
  id: number; title: string; quantity: number;
  sku: string | null; variant_title: string | null;
  price: string; hlProduct: HLProduct | null;
}

interface EnrichedOrder {
  id: number; name: string; email: string | null;
  created_at: string; financial_status: string;
  fulfillment_status: string | null;
  total_price: string; currency: string;
  line_items: EnrichedLineItem[];
  shipping_address: {
    name: string;
    company: string | null;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    country: string;
    country_name: string | null;
    phone: string | null;
  } | null;
  note: string | null;
  hlStatus: string | null;
  hlOrderRef: string | null;
  confirmedAt: string | null;
  allMatched: boolean;
  anyMatched: boolean;
}

interface SkuMapping {
  id: string; shopify_sku: string;
  hl_product_id: string; hl_product_name: string;
  hl_color_name: string; hl_color_hex: string;
  hl_size: string; hl_gsm: string; hl_blank_price: number;
}

// ── Sub-tab type ──────────────────────────────────────────────────────────────
type ShopifySubTab = "orders" | "skus";

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const map: Record<string, { bg: string; text: string }> = {
    confirmed:     { bg: "bg-green-50 border-green-200",   text: "text-green-700" },
    in_production: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
    fulfilled:     { bg: "bg-blue-50 border-blue-200",     text: "text-blue-700"   },
    cancelled:     { bg: "bg-red-50 border-red-200",       text: "text-red-600"    },
  };
  const s = map[status] ?? { bg: "bg-zinc-50 border-zinc-200", text: "text-zinc-600" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Connect form ──────────────────────────────────────────────────────────────
function ConnectForm({ userId }: { userId: string; onConnected: (c: Connection) => void }) {
  const [domain,  setDomain]  = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    const raw = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!raw) return;
    // Auto-append .myshopify.com if user just typed the subdomain
    const shop = raw.includes(".") ? raw : `${raw}.myshopify.com`;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
      setError("Enter a valid Shopify domain, e.g. your-store.myshopify.com");
      return;
    }
    setLoading(true);
    // Redirect to OAuth — Shopify handles the rest
    window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(shop)}&userId=${encodeURIComponent(userId)}`;
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#96bf48]/10 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-[#96bf48]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-black text-zinc-900 text-lg" style={{ letterSpacing: "-0.03em" }}>Connect your Shopify store</h3>
          <p className="text-sm text-zinc-400">Orders sync automatically. No API keys needed.</p>
        </div>
      </div>

      {/* How it works */}
      <div className="flex flex-col gap-3 mb-8">
        {[
          { n: "1", text: "Enter your Shopify store URL below" },
          { n: "2", text: "You'll be redirected to Shopify to approve access" },
          { n: "3", text: "Click Install — you're done. Orders appear instantly." },
        ].map((step) => (
          <div key={step.n} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{step.n}</div>
            <p className="text-sm text-zinc-600">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            value={domain}
            onChange={(e) => { setDomain(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="your-store.myshopify.com"
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={handleConnect}
          disabled={loading || !domain.trim()}
          className="px-5 py-3 rounded-xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 disabled:opacity-40 transition-colors whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          ) : "Connect →"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// ── SKU Mapper ────────────────────────────────────────────────────────────────
function SkuMapper({ userId }: { userId: string }) {
  const [mappings, setMappings]       = useState<SkuMapping[]>([]);
  const [loading, setLoading]         = useState(true);
  const [shopifySku, setShopifySku]   = useState("");
  const [selectedHlSku, setSelectedHlSku] = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/shopify/sku-mappings?userId=${userId}`);
    const data = await res.json();
    setMappings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchMappings(); }, [fetchMappings]);

  const handleAdd = async () => {
    if (!shopifySku.trim() || !selectedHlSku) return;
    const hlEntry = SKU_CATALOG.find((s) => s.sku === selectedHlSku);
    if (!hlEntry) return;
    setSaving(true); setError("");
    const res = await fetch("/api/shopify/sku-mappings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shopifySku: shopifySku.trim(),
        hlProductId:   hlEntry.productId,
        hlProductName: hlEntry.productName,
        hlColorName:   hlEntry.colorName,
        hlColorHex:    hlEntry.colorHex,
        hlSize:        hlEntry.size,
        hlGsm:         hlEntry.gsm,
        hlBlankPrice:  hlEntry.blankPrice,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
    setShopifySku(""); setSelectedHlSku("");
    fetchMappings();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/shopify/sku-mappings?id=${id}`, { method: "DELETE" });
    fetchMappings();
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-black text-zinc-900 text-base mb-1" style={{ letterSpacing: "-0.02em" }}>SKU Mapping</h3>
        <p className="text-sm text-zinc-500">
          Map your Shopify product variant SKUs to Halftone Labs products. Alternatively, just set your Shopify variant SKUs to our format directly (e.g. <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">HL-RT-WHT-M</code>).
        </p>
      </div>

      {/* SKU catalog reference */}
      <details className="mb-6 bg-zinc-50 border border-zinc-200 rounded-xl">
        <summary className="px-4 py-3 text-sm font-semibold text-zinc-700 cursor-pointer select-none">
          View full SKU catalog ({SKU_CATALOG.length} variants)
        </summary>
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-xs mt-2">
            <thead>
              <tr className="text-zinc-400 uppercase tracking-widest text-[10px]">
                <th className="text-left py-1.5 pr-4">SKU</th>
                <th className="text-left py-1.5 pr-4">Product</th>
                <th className="text-left py-1.5 pr-4">Color</th>
                <th className="text-left py-1.5">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SKU_CATALOG.map((s) => (
                <tr key={s.sku} className="font-mono">
                  <td className="py-1 pr-4 text-orange-600 font-semibold">{s.sku}</td>
                  <td className="py-1 pr-4 font-sans text-zinc-700">{s.productName} <span className="text-zinc-400">({s.gsm})</span></td>
                  <td className="py-1 pr-4 font-sans flex items-center gap-1.5 mt-0.5">
                    <span className="w-3 h-3 rounded-full border border-zinc-200 flex-shrink-0" style={{ background: s.colorHex }} />
                    {s.colorName}
                  </td>
                  <td className="py-1 font-sans text-zinc-700">{s.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Add mapping form */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Add Mapping</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={shopifySku} onChange={(e) => setShopifySku(e.target.value)}
            placeholder="Your Shopify SKU (e.g. MY-TEE-BLK-M)"
            className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
          />
          <select
            value={selectedHlSku} onChange={(e) => setSelectedHlSku(e.target.value)}
            className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Select HL product variant…</option>
            {PRODUCTS.map((product) => (
              <optgroup key={product.id} label={`${product.name} (${product.gsm})`}>
                {product.colors.flatMap((color) =>
                  product.sizes.map((size) => {
                    const entry = SKU_CATALOG.find(
                      (s) => s.productId === product.id && s.colorName === color.name && s.size === size
                    );
                    if (!entry) return null;
                    return (
                      <option key={entry.sku} value={entry.sku}>
                        {entry.sku} — {color.name} / {size}
                      </option>
                    );
                  }).filter(Boolean)
                )}
              </optgroup>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={saving || !shopifySku.trim() || !selectedHlSku}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap"
          >
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Existing mappings */}
      {loading ? (
        <p className="text-sm text-zinc-400">Loading mappings…</p>
      ) : mappings.length === 0 ? (
        <p className="text-sm text-zinc-400">No custom mappings yet. Add one above, or set your Shopify SKUs to our HL format directly.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {mappings.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 bg-white border border-zinc-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div>
                  <p className="font-mono text-xs text-zinc-700 font-semibold">{m.shopify_sku}</p>
                  <p className="text-[10px] text-zinc-400">Shopify SKU</p>
                </div>
                <svg className="w-4 h-4 text-zinc-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 border border-zinc-200" style={{ background: m.hl_color_hex }} />
                  <div>
                    <p className="text-xs text-zinc-700 font-semibold truncate">{m.hl_product_name} / {m.hl_color_name} / {m.hl_size}</p>
                    <p className="text-[10px] text-zinc-400">{m.hl_gsm} · ₹{m.hl_blank_price}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-zinc-300 hover:text-red-400 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Orders list ───────────────────────────────────────────────────────────────
type ShippingOption = { type: "surface" | "air"; label: string; rate: number; days: string };

function OrdersList({ userId, shopDomain }: { userId: string; shopDomain: string }) {
  const [orders, setOrders]         = useState<EnrichedOrder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [confirming, setConfirming] = useState<number | null>(null);
  const [confirmError, setConfirmError] = useState<Record<number, string>>({});
  const [expanded, setExpanded]     = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  // Per-order shipping: rates fetched + user selection
  const [shippingRates,    setShippingRates]    = useState<Record<number, ShippingOption[]>>({});
  const [shippingLoading,  setShippingLoading]  = useState<Record<number, boolean>>({});
  const [selectedShipping, setSelectedShipping] = useState<Record<number, ShippingOption | null>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetch(`/api/shopify/orders?userId=${userId}`);
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to load orders"); setLoading(false); return; }
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Fetch wallet balance for display
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wallet?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { if (d.balance !== undefined) setWalletBalance(Number(d.balance)); })
      .catch(() => {});
  }, [userId]);

  // Fetch Surface + Air shipping rates for a domestic order
  const fetchShippingRates = async (order: EnrichedOrder) => {
    const pin = order.shipping_address?.zip;
    const isDomestic = order.shipping_address?.country === "IN" || order.shipping_address?.country === "India";
    if (!pin || !isDomestic) return;
    if (shippingRates[order.id]) return; // already fetched

    setShippingLoading((p) => ({ ...p, [order.id]: true }));
    try {
      const qty = order.line_items.reduce((s, l) => s + (l.quantity ?? 1), 0);
      const weight = Math.max(0.5, Math.ceil((qty * 0.3 + 0.1) / 0.5) * 0.5);
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, country: "IN", weight, qty }),
      });
      const data = await res.json();
      const raw: { id: string; label: string; carrier: string; rate: number; days: string }[] = data.rates ?? [];
      // Map to surface/air
      const options: ShippingOption[] = [];
      const surface = raw.find((r) => r.id?.toLowerCase().includes("surface") || r.label?.toLowerCase().includes("surface"));
      const air     = raw.find((r) => r.id?.toLowerCase().includes("air")     || r.label?.toLowerCase().includes("air"));
      if (surface) options.push({ type: "surface", label: surface.label, rate: surface.rate, days: surface.days });
      if (air)     options.push({ type: "air",     label: air.label,     rate: air.rate,     days: air.days });
      // Fallback fixed rates if API returns nothing useful
      if (options.length === 0) {
        options.push({ type: "surface", label: "Surface Shipping", rate: 80,  days: "7–10 days" });
        options.push({ type: "air",     label: "Air Shipping",     rate: 120, days: "3–5 days"  });
      }
      setShippingRates((p) => ({ ...p, [order.id]: options }));
      // Default to surface
      setSelectedShipping((p) => ({ ...p, [order.id]: options[0] ?? null }));
    } catch {
      setShippingRates((p) => ({
        ...p,
        [order.id]: [
          { type: "surface", label: "Surface Shipping", rate: 80,  days: "7–10 days" },
          { type: "air",     label: "Air Shipping",     rate: 120, days: "3–5 days"  },
        ],
      }));
      setSelectedShipping((p) => ({ ...p, [order.id]: { type: "surface", label: "Surface Shipping", rate: 80, days: "7–10 days" } }));
    }
    setShippingLoading((p) => ({ ...p, [order.id]: false }));
  };

  const handleConfirmViaWallet = async (order: EnrichedOrder) => {
    setConfirming(order.id);
    setConfirmError((prev) => { const next = { ...prev }; delete next[order.id]; return next; });

    // Get first matched line item for product details
    const firstMatched = order.line_items.find((l) => l.hlProduct !== null);

    // Production cost = blank + print per item × qty (NOT the Shopify retail price)
    const productionCost = order.line_items.reduce((sum, l) => {
      const blank = l.hlProduct?.blankPrice ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const print = (l.hlProduct as any)?.printPrice ?? 0;
      return sum + (blank + print) * (l.quantity ?? 1);
    }, 0);
    const shippingCost = selectedShipping[order.id]?.rate ?? 0;
    const totalInr = Math.round(productionCost + shippingCost);

    const res = await fetch("/api/shopify/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shopifyOrderId:     order.id,
        shopifyOrderNumber: order.name,
        lineItems:          order.line_items,
        shippingAddress:    order.shipping_address,
        customerEmail:      order.email,
        customerName:       order.shipping_address?.name ?? null,
        useWallet:          true,
        totalInr,
        productName:        firstMatched?.hlProduct?.productName ?? order.line_items[0]?.title ?? null,
        colorName:          firstMatched?.hlProduct?.colorName ?? null,
        sizeName:           firstMatched?.hlProduct?.size ?? null,
        shippingAmount:     shippingCost,
        customerPhone:      order.shipping_address?.phone ?? null,
      }),
    });
    const data = await res.json();
    setConfirming(null);

    if (res.status === 402) {
      const balance = data.balance ?? 0;
      setConfirmError((prev) => ({
        ...prev,
        [order.id]: `Insufficient wallet balance (₹${Number(balance).toLocaleString("en-IN")}). Top up in the Wallet tab.`,
      }));
      return;
    }
    if (!res.ok) {
      setConfirmError((prev) => ({ ...prev, [order.id]: data.error ?? "Failed to confirm order" }));
      return;
    }
    // Success — refresh wallet balance too
    fetch(`/api/wallet?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { if (d.balance !== undefined) setWalletBalance(Number(d.balance)); })
      .catch(() => {});
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Fetching orders from {shopDomain}…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
        {error} — <button onClick={fetchOrders} className="underline">Retry</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No orders found in your Shopify store.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <p className="text-xs text-zinc-400">{orders.length} orders from {shopDomain}</p>
        <div className="flex items-center gap-3">
          {walletBalance !== null && (
            <span className="flex items-center gap-1 text-xs font-semibold bg-zinc-100 text-zinc-600 rounded-full px-3 py-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Wallet: ₹{Number(walletBalance).toLocaleString("en-IN")}
            </span>
          )}
          <button onClick={fetchOrders} className="text-xs text-orange-500 hover:text-orange-600 transition-colors">↻ Refresh</button>
        </div>
      </div>

      {orders.map((order) => {
        const isExpanded   = expanded === order.id;
        const isConfirming = confirming === order.id;
        const isConfirmed  = !!order.hlStatus;

        return (
          <motion.div key={order.id} layout className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            {/* Order header */}
            <button
              onClick={() => {
                const next = isExpanded ? null : order.id;
                setExpanded(next);
                if (next) fetchShippingRates(order);
              }}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-sm text-zinc-900">{order.name}</p>
                    {isConfirmed && <StatusBadge status={order.hlStatus} />}
                    {!isConfirmed && !order.anyMatched && (
                      <span className="text-[10px] bg-red-50 border border-red-200 text-red-500 rounded-full px-2 py-0.5 font-semibold">
                        SKU unmatched
                      </span>
                    )}
                    {!isConfirmed && order.anyMatched && !order.allMatched && (
                      <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 rounded-full px-2 py-0.5 font-semibold">
                        Partial match
                      </span>
                    )}
                    {!isConfirmed && order.allMatched && (
                      <span className="text-[10px] bg-green-50 border border-green-200 text-green-600 rounded-full px-2 py-0.5 font-semibold">
                        All matched
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {order.email ?? "No email"} · {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-sm">{order.currency} {Number(order.total_price).toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-400 capitalize">{order.financial_status}</p>
                </div>
                <svg className={`w-4 h-4 text-zinc-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded line items */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-zinc-100"
                >
                  <div className="px-5 py-4 flex flex-col gap-4">
                    {/* Line items */}
                    <div className="flex flex-col gap-3">
                      {order.line_items.map((line) => (
                        <div key={line.id} className="flex items-start gap-3">
                          {/* Match indicator */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${line.hlProduct ? "bg-green-100" : "bg-red-50"}`}>
                            {line.hlProduct ? (
                              <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-zinc-800">{line.title}</p>
                              {line.variant_title && (
                                <span className="text-xs text-zinc-400">{line.variant_title}</span>
                              )}
                              <span className="text-xs text-zinc-400">×{line.quantity}</span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">
                              SKU: {line.sku ?? <span className="text-red-400">None</span>}
                            </p>
                            {line.hlProduct ? (
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1 text-[10px] bg-green-50 border border-green-100 text-green-700 rounded-full px-2 py-0.5">
                                  <span className="w-2 h-2 rounded-full" style={{ background: line.hlProduct.colorHex }} />
                                  {line.hlProduct.productName} · {line.hlProduct.colorName} · {line.hlProduct.size}
                                </span>
                                <span className="text-[10px] text-zinc-400">{line.hlProduct.gsm}</span>
                              </div>
                            ) : (
                              <p className="text-[10px] text-red-500 mt-1">
                                No HL product match — add a SKU mapping below or update your Shopify variant SKU to our format (e.g. <span className="font-mono">HL-RT-WHT-M</span>)
                              </p>
                            )}
                          </div>
                          <p className="text-sm font-semibold flex-shrink-0">{order.currency} {(Number(line.price) * line.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address */}
                    {order.shipping_address && (
                      <div className="bg-zinc-50 rounded-xl px-4 py-3 text-xs text-zinc-600 space-y-0.5">
                        <p className="font-semibold text-zinc-700 mb-1.5">Ship to</p>
                        {order.shipping_address.company && <p className="font-medium">{order.shipping_address.company}</p>}
                        <p>{order.shipping_address.name}</p>
                        <p>{order.shipping_address.address1}</p>
                        {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                        <p>{order.shipping_address.city}{order.shipping_address.province ? `, ${order.shipping_address.province}` : ""} {order.shipping_address.zip}</p>
                        <p>{order.shipping_address.country_name ?? order.shipping_address.country}</p>
                        {order.shipping_address.phone && <p className="text-zinc-400">{order.shipping_address.phone}</p>}
                      </div>
                    )}

                    {/* Shipping method selector (domestic India only) */}
                    {!isConfirmed && order.anyMatched && (() => {
                      const isDomestic = order.shipping_address?.country === "IN" || order.shipping_address?.country === "India";
                      if (!isDomestic) return null;
                      const rates = shippingRates[order.id];
                      const isLoadingRates = shippingLoading[order.id];
                      const sel = selectedShipping[order.id];
                      return (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shipping Method</p>
                          {isLoadingRates ? (
                            <p className="text-xs text-zinc-400">Fetching rates…</p>
                          ) : rates ? (
                            <div className="flex gap-2">
                              {rates.map((opt) => (
                                <button key={opt.type} type="button"
                                  onClick={() => setSelectedShipping((p) => ({ ...p, [order.id]: opt }))}
                                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                                    sel?.type === opt.type
                                      ? "border-zinc-900 bg-zinc-900 text-white"
                                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                                  }`}>
                                  <p className="text-xs font-black capitalize">{opt.type === "surface" ? "🚛 Surface" : "✈️ Air"}</p>
                                  <p className={`text-[10px] mt-0.5 ${sel?.type === opt.type ? "text-zinc-300" : "text-zinc-400"}`}>{opt.days}</p>
                                  <p className={`text-sm font-black mt-1 ${sel?.type === opt.type ? "text-white" : "text-zinc-900"}`}>₹{opt.rate}</p>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}

                    {/* HL order ref if confirmed */}
                    {isConfirmed && order.hlOrderRef && (
                      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                        <p className="font-bold">Confirmed for production</p>
                        <p className="text-xs mt-0.5">HL Ref: <span className="font-mono">{order.hlOrderRef}</span> · {order.confirmedAt ? new Date(order.confirmedAt).toLocaleDateString("en-IN") : ""}</p>
                      </div>
                    )}

                    {/* Confirm via Wallet button */}
                    {!isConfirmed && (
                      <div className="flex flex-col gap-2">
                        {order.anyMatched && (() => {
                          const prodCost = order.line_items.reduce((s, l) => {
                            const b = l.hlProduct?.blankPrice ?? 0;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const p = (l.hlProduct as any)?.printPrice ?? 0;
                            return s + (b + p) * (l.quantity ?? 1);
                          }, 0);
                          const shpCost = selectedShipping[order.id]?.rate ?? 0;
                          const total = Math.round(prodCost + shpCost);
                          return prodCost > 0 ? (
                            <div className="text-xs text-zinc-400 text-center space-y-0.5">
                              <p>
                                Products: <span className="font-bold text-zinc-700">₹{Math.round(prodCost).toLocaleString("en-IN")}</span>
                                {shpCost > 0 && <> · Shipping: <span className="font-bold text-zinc-700">₹{shpCost.toLocaleString("en-IN")}</span></>}
                              </p>
                              <p>Total to deduct: <span className="font-black text-zinc-900">₹{total.toLocaleString("en-IN")}</span>
                                <span className="ml-1 text-zinc-300">(retail: {order.currency} {Number(order.total_price).toLocaleString()})</span>
                              </p>
                            </div>
                          ) : null;
                        })()}
                        {confirmError[order.id] && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
                            {confirmError[order.id]}
                          </div>
                        )}
                        <button
                          onClick={() => handleConfirmViaWallet(order)}
                          disabled={isConfirming || !order.anyMatched}
                          className="w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-black hover:bg-zinc-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                        >
                          {isConfirming ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Confirming…</>
                          ) : !order.anyMatched ? (
                            "Map SKUs to confirm"
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Pay Production Cost via Wallet →
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main ShopifyTab ────────────────────────────────────────────────────────────
export default function ShopifyTab({ userId }: { userId: string }) {
  const [connection, setConnection]   = useState<Connection | null>(null);
  const [loadingConn, setLoadingConn] = useState(true);
  const [subTab, setSubTab]           = useState<ShopifySubTab>("orders");
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch(`/api/shopify/connect?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { setConnection(d.connection ?? null); setLoadingConn(false); });
  }, [userId]);

  const handleDisconnect = async () => {
    if (!confirm("Disconnect your Shopify store?")) return;
    setDisconnecting(true);
    await fetch(`/api/shopify/connect?userId=${userId}`, { method: "DELETE" });
    setConnection(null);
    setDisconnecting(false);
  };

  if (loadingConn) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Loading…
      </div>
    );
  }

  if (!connection) {
    return <ConnectForm userId={userId} onConnected={setConnection} />;
  }

  return (
    <div>
      {/* Connected store header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#96bf48]/10 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-[#96bf48]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
            </svg>
          </div>
          <div>
            <p className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.02em" }}>
              {connection.shop_name ?? connection.shop_domain}
            </p>
            <p className="text-xs text-zinc-400">{connection.shop_domain}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Connected
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="text-xs text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          {disconnecting ? "Disconnecting…" : "Disconnect store"}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-100 rounded-xl p-1 w-fit">
        {(["orders", "skus"] as ShopifySubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === t ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            {t === "orders" ? "Shopify Orders" : "SKU Mapping"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {subTab === "orders"
            ? <OrdersList userId={userId} shopDomain={connection.shop_domain} />
            : <SkuMapper userId={userId} />
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
