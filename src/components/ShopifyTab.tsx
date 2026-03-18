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
  shipping_address: { name: string; address1: string; city: string; province: string; country: string; zip: string } | null;
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
function ConnectForm({ userId, onConnected }: { userId: string; onConnected: (c: Connection) => void }) {
  const [domain, setDomain]   = useState("");
  const [token, setToken]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleConnect = async () => {
    if (!domain.trim() || !token.trim()) return;
    setLoading(true); setError("");
    const res = await fetch("/api/shopify/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, shopDomain: domain.trim(), accessToken: token.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Connection failed"); return; }
    // Re-fetch connection
    const r2 = await fetch(`/api/shopify/connect?userId=${userId}`);
    const d2 = await r2.json();
    if (d2.connection) onConnected(d2.connection);
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#96bf48]/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-[#96bf48]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-black text-zinc-900 text-base" style={{ letterSpacing: "-0.02em" }}>Connect Shopify Store</h3>
          <p className="text-xs text-zinc-400">Import orders automatically for print fulfillment</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800 leading-relaxed">
        <strong>Setup:</strong> In your Shopify admin, go to <strong>Settings → Apps and sales channels → Develop apps</strong>, create a custom app, and grant <code className="bg-amber-100 px-1 rounded">read_orders</code> access. Copy the Admin API access token below.
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Shop Domain</label>
          <input
            value={domain} onChange={(e) => setDomain(e.target.value)}
            placeholder="your-store.myshopify.com"
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Admin API Access Token</label>
          <input
            value={token} onChange={(e) => setToken(e.target.value)}
            type="password"
            placeholder="shpat_••••••••••••••••••••••••••••••••"
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleConnect}
          disabled={loading || !domain.trim() || !token.trim()}
          className="px-6 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Connecting…" : "Connect Store"}
        </button>
      </div>
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
function OrdersList({ userId, shopDomain }: { userId: string; shopDomain: string }) {
  const [orders, setOrders]     = useState<EnrichedOrder[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [confirming, setConfirming] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetch(`/api/shopify/orders?userId=${userId}`);
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to load orders"); setLoading(false); return; }
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleConfirm = async (order: EnrichedOrder) => {
    setConfirming(order.id);
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
      }),
    });
    const data = await res.json();
    setConfirming(null);
    if (res.ok) fetchOrders();
    else alert(data.error ?? "Failed to confirm order");
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
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-zinc-400">{orders.length} orders from {shopDomain}</p>
        <button onClick={fetchOrders} className="text-xs text-orange-500 hover:text-orange-600 transition-colors">↻ Refresh</button>
      </div>

      {orders.map((order) => {
        const isExpanded   = expanded === order.id;
        const isConfirming = confirming === order.id;
        const isConfirmed  = !!order.hlStatus;

        return (
          <motion.div key={order.id} layout className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            {/* Order header */}
            <button
              onClick={() => setExpanded(isExpanded ? null : order.id)}
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
                      <div className="bg-zinc-50 rounded-xl px-4 py-3 text-xs text-zinc-600">
                        <p className="font-semibold text-zinc-700 mb-1">Ship to</p>
                        <p>{order.shipping_address.name}</p>
                        <p>{order.shipping_address.address1}, {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.zip}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    )}

                    {/* HL order ref if confirmed */}
                    {isConfirmed && order.hlOrderRef && (
                      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                        <p className="font-bold">Confirmed for production</p>
                        <p className="text-xs mt-0.5">HL Ref: <span className="font-mono">{order.hlOrderRef}</span> · {order.confirmedAt ? new Date(order.confirmedAt).toLocaleDateString("en-IN") : ""}</p>
                      </div>
                    )}

                    {/* Confirm button */}
                    {!isConfirmed && (
                      <button
                        onClick={() => handleConfirm(order)}
                        disabled={isConfirming || !order.anyMatched}
                        className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                      >
                        {isConfirming ? (
                          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Confirming…</>
                        ) : !order.anyMatched ? (
                          "Map SKUs to confirm"
                        ) : (
                          "Confirm for Production →"
                        )}
                      </button>
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
