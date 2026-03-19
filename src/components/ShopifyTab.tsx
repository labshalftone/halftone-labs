"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKU_CATALOG } from "@/lib/shopify-skus";
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
  colorName: string; colorHex: string | null; size: string;
  gsm: string | null; blankPrice: number; printPrice?: number;
}

interface EnrichedLineItem {
  id: number; title: string; quantity: number;
  sku: string | null; variant_title: string | null;
  price: string; hlProduct: HLProduct | null;
}

interface ShippingAddress {
  name: string; company: string | null; address1: string;
  address2: string | null; city: string; province: string;
  zip: string; country: string; country_name: string | null;
  phone: string | null;
}

interface EnrichedOrder {
  id: number; name: string; email: string | null;
  created_at: string; financial_status: string;
  fulfillment_status: string | null;
  total_price: string; currency: string;
  line_items: EnrichedLineItem[];
  shipping_address: ShippingAddress | null;
  note: string | null;
  hlStatus: string | null; hlOrderRef: string | null;
  confirmedAt: string | null; allMatched: boolean; anyMatched: boolean;
}

interface SkuMapping {
  id: string; shopify_sku: string;
  hl_product_id: string; hl_product_name: string;
  hl_color_name: string; hl_color_hex: string;
  hl_size: string; hl_gsm: string; hl_blank_price: number;
}

type ShopifySubTab = "orders" | "skus";
type FilterTab = "pending" | "confirmed" | "all";

type ShippingOption = { type: "surface" | "air"; label: string; rate: number; days: string };

type AddressDraft = {
  name: string; address1: string; address2: string;
  city: string; province: string; zip: string;
  country: string; phone: string; note: string;
};

function initDraft(order: EnrichedOrder): AddressDraft {
  const a = order.shipping_address;
  return {
    name: a?.name ?? "", address1: a?.address1 ?? "", address2: a?.address2 ?? "",
    city: a?.city ?? "", province: a?.province ?? "", zip: a?.zip ?? "",
    country: a?.country ?? "IN", phone: a?.phone ?? "", note: order.note ?? "",
  };
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const map: Record<string, { bg: string; text: string }> = {
    confirmed:     { bg: "bg-green-50 border-green-200",   text: "text-green-700"  },
    in_production: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
    fulfilled:     { bg: "bg-blue-50 border-blue-200",     text: "text-blue-700"   },
    cancelled:     { bg: "bg-red-50 border-red-200",       text: "text-red-600"    },
  };
  const s = map[status] ?? { bg: "bg-ds-light-gray border-black/[0.06]", text: "text-ds-body" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.bg} ${s.text}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Address display ────────────────────────────────────────────────────────────
function AddressDisplay({ address, note, isEdited }: { address: AddressDraft | ShippingAddress | null; note?: string | null; isEdited?: boolean }) {
  if (!address) return <p className="text-xs text-ds-muted">No shipping address</p>;
  const a = address as AddressDraft & ShippingAddress;
  return (
    <div className={`text-xs space-y-0.5 ${isEdited ? "text-brand" : "text-ds-body"}`}>
      {isEdited && <p className="text-[10px] font-bold text-brand mb-1">✏ Edited — will be used at confirmation</p>}
      <p className="font-semibold">{a.name}</p>
      <p>{a.address1}{a.address2 ? `, ${a.address2}` : ""}</p>
      <p>{a.city}{a.province ? `, ${a.province}` : ""} {a.zip}</p>
      <p>{(a as ShippingAddress).country_name ?? a.country}</p>
      {a.phone && <p className="text-ds-muted">{a.phone}</p>}
      {note && <p className="text-ds-muted mt-1 italic">&ldquo;{note}&rdquo;</p>}
    </div>
  );
}

// ── Address edit form ─────────────────────────────────────────────────────────
function AddressEditForm({
  draft, onChange, onClose,
}: { draft: AddressDraft; onChange: (d: AddressDraft) => void; onClose: () => void }) {
  const [local, setLocal] = useState<AddressDraft>(draft);
  const set = (k: keyof AddressDraft, v: string) => setLocal((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-ds-dark uppercase tracking-widest">Edit order details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Name</label>
          <input value={local.name} onChange={e => set("name", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Phone</label>
          <input value={local.phone} onChange={e => set("phone", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Address line 1</label>
          <input value={local.address1} onChange={e => set("address1", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Address line 2</label>
          <input value={local.address2} onChange={e => set("address2", e.target.value)}
            placeholder="Apartment, floor, etc."
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">City</label>
          <input value={local.city} onChange={e => set("city", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">State</label>
          <input value={local.province} onChange={e => set("province", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">PIN / ZIP</label>
          <input value={local.zip} onChange={e => set("zip", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Country code</label>
          <input value={local.country} onChange={e => set("country", e.target.value.toUpperCase())} maxLength={2}
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs font-mono outline-none focus:border-zinc-400" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block">Production note</label>
        <textarea value={local.note} onChange={e => set("note", e.target.value)} rows={2}
          placeholder="Special instructions for production…"
          className="w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400 resize-none" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => { onChange(local); onClose(); }}
          className="flex-1 py-2 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors"
        >
          Save edits
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-black/[0.06] text-xs text-ds-body hover:bg-black/[0.03] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Connect form ──────────────────────────────────────────────────────────────
function ConnectForm({ userId }: { userId: string; onConnected: (c: Connection) => void }) {
  const [domain, setDomain] = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    const raw = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!raw) return;
    const shop = raw.includes(".") ? raw : `${raw}.myshopify.com`;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
      setError("Enter a valid Shopify domain, e.g. your-store.myshopify.com"); return;
    }
    setLoading(true);
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
          <h3 className="font-semibold text-ds-dark text-lg" style={{ letterSpacing: "-0.03em" }}>Connect your Shopify store</h3>
          <p className="text-sm text-ds-muted">Orders sync automatically. No API keys needed.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {[
          { n: "1", text: "Enter your Shopify store URL below" },
          { n: "2", text: "You'll be redirected to Shopify to approve access" },
          { n: "3", text: "Click Install. You're done. Orders appear instantly." },
        ].map((step) => (
          <div key={step.n} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-ds-dark text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{step.n}</div>
            <p className="text-sm text-ds-body">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={domain} onChange={e => { setDomain(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleConnect()}
          placeholder="your-store.myshopify.com"
          className="flex-1 border border-black/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button onClick={handleConnect} disabled={loading || !domain.trim()}
          className="px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-40 transition-colors whitespace-nowrap flex items-center gap-2">
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          ) : "Connect →"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// ── SKU Mapper ─────────────────────────────────────────────────────────────────
function SkuMapper({ userId }: { userId: string }) {
  const [mappings, setMappings]           = useState<SkuMapping[]>([]);
  const [loading, setLoading]             = useState(true);
  const [shopifySku, setShopifySku]       = useState("");
  const [selectedHlSku, setSelectedHlSku] = useState("");
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState("");

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
        userId, shopifySku: shopifySku.trim(),
        hlProductId: hlEntry.productId, hlProductName: hlEntry.productName,
        hlColorName: hlEntry.colorName, hlColorHex: hlEntry.colorHex,
        hlSize: hlEntry.size, hlGsm: hlEntry.gsm, hlBlankPrice: hlEntry.blankPrice,
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
        <h3 className="font-semibold text-ds-dark text-base mb-1" style={{ letterSpacing: "-0.02em" }}>SKU Mapping</h3>
        <p className="text-sm text-ds-body">
          Map your Shopify product variant SKUs to Halftone Labs products. Or set your Shopify variant SKUs to our format directly (e.g. <code className="bg-black/[0.05] px-1.5 py-0.5 rounded text-xs font-mono">HL-RT-WHT-M</code>).
        </p>
      </div>
      <details className="mb-6 bg-ds-light-gray border border-black/[0.06] rounded-xl">
        <summary className="px-4 py-3 text-sm font-semibold text-ds-body cursor-pointer select-none">
          View full SKU catalog ({SKU_CATALOG.length} variants)
        </summary>
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-xs mt-2">
            <thead>
              <tr className="text-ds-muted uppercase tracking-widest text-[10px]">
                <th className="text-left py-1.5 pr-4">SKU</th>
                <th className="text-left py-1.5 pr-4">Product</th>
                <th className="text-left py-1.5 pr-4">Color</th>
                <th className="text-left py-1.5">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SKU_CATALOG.map((s) => (
                <tr key={s.sku} className="font-mono">
                  <td className="py-1 pr-4 text-brand-dark font-semibold">{s.sku}</td>
                  <td className="py-1 pr-4 font-sans text-ds-body">{s.productName} <span className="text-ds-muted">({s.gsm})</span></td>
                  <td className="py-1 pr-4 font-sans flex items-center gap-1.5 mt-0.5">
                    <span className="w-3 h-3 rounded-full border border-black/[0.06] flex-shrink-0" style={{ background: s.colorHex }} />
                    {s.colorName}
                  </td>
                  <td className="py-1 font-sans text-ds-body">{s.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <div className="bg-white border border-black/[0.06] rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-ds-muted uppercase tracking-widest mb-3">Add Mapping</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={shopifySku} onChange={e => setShopifySku(e.target.value)}
            placeholder="Your Shopify SKU (e.g. MY-TEE-BLK-M)"
            className="flex-1 border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono" />
          <select value={selectedHlSku} onChange={e => setSelectedHlSku(e.target.value)}
            className="flex-1 border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">Select HL product variant…</option>
            {PRODUCTS.map((product) => (
              <optgroup key={product.id} label={`${product.name} (${product.gsm})`}>
                {product.colors.flatMap((color) =>
                  product.sizes.map((size) => {
                    const entry = SKU_CATALOG.find(s => s.productId === product.id && s.colorName === color.name && s.size === size);
                    if (!entry) return null;
                    return <option key={entry.sku} value={entry.sku}>{entry.sku} — {color.name} / {size}</option>;
                  }).filter(Boolean)
                )}
              </optgroup>
            ))}
          </select>
          <button onClick={handleAdd} disabled={saving || !shopifySku.trim() || !selectedHlSku}
            className="px-5 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors whitespace-nowrap">
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
      {loading ? (
        <p className="text-sm text-ds-muted">Loading mappings…</p>
      ) : mappings.length === 0 ? (
        <p className="text-sm text-ds-muted">No custom mappings yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {mappings.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 bg-white border border-black/[0.06] rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <p className="font-mono text-xs text-ds-body font-semibold">{m.shopify_sku}</p>
                <svg className="w-4 h-4 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 border border-black/[0.06]" style={{ background: m.hl_color_hex }} />
                  <p className="text-xs text-ds-body font-semibold truncate">{m.hl_product_name} / {m.hl_color_name} / {m.hl_size}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-ds-muted hover:text-red-400 transition-colors flex-shrink-0">
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

// ── Orders list (bulk-confirmation focused) ───────────────────────────────────
function OrdersList({ userId, shopDomain }: { userId: string; shopDomain: string }) {
  const [orders, setOrders]               = useState<EnrichedOrder[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [filter, setFilter]               = useState<FilterTab>("pending");
  const [selected, setSelected]           = useState<Set<number>>(new Set());
  const [expanded, setExpanded]           = useState<Set<number>>(new Set());
  const [editingId, setEditingId]         = useState<number | null>(null);
  const [editDrafts, setEditDrafts]       = useState<Record<number, AddressDraft>>({});
  const [confirming, setConfirming]       = useState<Set<number>>(new Set());
  const [confirmErrors, setConfirmErrors] = useState<Record<number, string>>({});
  const [bulkConfirming, setBulkConfirming] = useState(false);
  const [bulkProgress, setBulkProgress]   = useState({ done: 0, total: 0 });
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletCurrency, setWalletCurrency] = useState("INR");
  const [inrToWalletRate, setInrToWalletRate] = useState(1);
  const [shippingRates, setShippingRates]   = useState<Record<number, ShippingOption[]>>({});
  const [shippingLoading, setShippingLoading] = useState<Record<number, boolean>>({});
  const [selectedShipping, setSelectedShipping] = useState<Record<number, ShippingOption>>({});

  const SYMBOLS: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ", SGD: "S$", AUD: "A$", CAD: "C$" };
  const fmtWallet = (inr: number) => {
    if (walletCurrency === "INR") return `₹${Math.round(inr).toLocaleString("en-IN")}`;
    const c = Math.round(inr * inrToWalletRate * 100) / 100;
    return `${SYMBOLS[walletCurrency] ?? walletCurrency}${c.toFixed(2)}`;
  };

  const isDomestic = (o: EnrichedOrder) => o.shipping_address?.country === "IN" || o.shipping_address?.country === "India";

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetch(`/api/shopify/orders?userId=${userId}`);
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to load orders"); setLoading(false); return; }
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Fetch wallet balance
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wallet?userId=${userId}`).then(r => r.json()).then(async (d) => {
      if (d.balance !== undefined) setWalletBalance(Number(d.balance));
      const cur = d.currency ?? "INR";
      setWalletCurrency(cur);
      if (cur !== "INR") {
        try {
          const rr = await fetch(`https://api.frankfurter.app/latest?from=INR&to=${cur}`);
          if (rr.ok) {
            const rd = await rr.json();
            const rate = Number(rd.rates?.[cur] ?? 0);
            if (rate > 0) setInrToWalletRate(rate);
          }
        } catch { /* ignore */ }
      }
    }).catch(() => {});
  }, [userId]);

  // Auto-fetch shipping rates for all pending domestic orders
  useEffect(() => {
    const pending = orders.filter(o => !o.hlStatus && isDomestic(o) && o.anyMatched);
    pending.forEach(o => {
      if (shippingRates[o.id] || shippingLoading[o.id]) return;
      fetchShippingForOrder(o);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const fetchShippingForOrder = async (order: EnrichedOrder) => {
    const pin = order.shipping_address?.zip;
    if (!pin) return;
    setShippingLoading(p => ({ ...p, [order.id]: true }));
    try {
      const qty = order.line_items.reduce((s, l) => s + (l.quantity ?? 1), 0);
      const weight = Math.max(0.5, Math.ceil((qty * 0.3 + 0.1) / 0.5) * 0.5);
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, country: "IN", weight, qty }),
      });
      const data = await res.json();
      const raw: { id: string; label: string; rate: number; days: string }[] = data.rates ?? [];
      const options: ShippingOption[] = [];
      const surface = raw.find(r => r.id?.toLowerCase().includes("surface") || r.label?.toLowerCase().includes("surface"));
      const air     = raw.find(r => r.id?.toLowerCase().includes("air")     || r.label?.toLowerCase().includes("air"));
      if (surface) options.push({ type: "surface", label: surface.label, rate: surface.rate, days: surface.days });
      if (air)     options.push({ type: "air",     label: air.label,     rate: air.rate,     days: air.days });
      if (options.length === 0) {
        options.push({ type: "surface", label: "Surface", rate: 80,  days: "7–10 days" });
        options.push({ type: "air",     label: "Air",     rate: 120, days: "3–5 days"  });
      }
      setShippingRates(p => ({ ...p, [order.id]: options }));
      setSelectedShipping(p => ({ ...p, [order.id]: options[0] }));
    } catch {
      const fallback: ShippingOption[] = [
        { type: "surface", label: "Surface", rate: 80,  days: "7–10 days" },
        { type: "air",     label: "Air",     rate: 120, days: "3–5 days"  },
      ];
      setShippingRates(p => ({ ...p, [order.id]: fallback }));
      setSelectedShipping(p => ({ ...p, [order.id]: fallback[0] }));
    }
    setShippingLoading(p => ({ ...p, [order.id]: false }));
  };

  const orderCost = (o: EnrichedOrder) => {
    const prod = o.line_items.reduce((s, l) => {
      const b = l.hlProduct?.blankPrice ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = (l.hlProduct as any)?.printPrice ?? 0;
      return s + (b + p) * (l.quantity ?? 1);
    }, 0);
    const shp = selectedShipping[o.id]?.rate ?? 0;
    return { prod, shp, total: Math.round(prod + shp) };
  };

  // Confirm a single order, returns true on success
  const confirmOrder = async (order: EnrichedOrder): Promise<boolean> => {
    setConfirming(prev => new Set([...prev, order.id]));
    setConfirmErrors(prev => { const n = { ...prev }; delete n[order.id]; return n; });

    const draft = editDrafts[order.id];
    const effectiveAddress = draft
      ? { ...order.shipping_address, name: draft.name, address1: draft.address1, address2: draft.address2, city: draft.city, province: draft.province, zip: draft.zip, country: draft.country, phone: draft.phone }
      : order.shipping_address;

    const firstMatched = order.line_items.find(l => l.hlProduct !== null);
    const { total, shp } = orderCost(order);

    const res = await fetch("/api/shopify/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shopifyOrderId: order.id,
        shopifyOrderNumber: order.name,
        lineItems: order.line_items,
        shippingAddress: effectiveAddress,
        customerEmail: order.email,
        customerName: effectiveAddress?.name ?? null,
        useWallet: true,
        totalInr: total,
        productName: firstMatched?.hlProduct?.productName ?? order.line_items[0]?.title ?? null,
        colorName: firstMatched?.hlProduct?.colorName ?? null,
        sizeName: firstMatched?.hlProduct?.size ?? null,
        shippingAmount: shp,
        customerPhone: effectiveAddress?.phone ?? null,
        designId: firstMatched?.hlProduct?.productId ?? null,
        note: draft?.note ?? order.note ?? null,
        walletCurrency,
      }),
    });
    const data = await res.json();
    setConfirming(prev => { const n = new Set(prev); n.delete(order.id); return n; });

    if (res.status === 402) {
      setConfirmErrors(prev => ({
        ...prev,
        [order.id]: `Insufficient balance (${fmtWallet(data.balance ?? 0)}). Top up in the Wallet tab.`,
      }));
      return false;
    }
    if (!res.ok) {
      setConfirmErrors(prev => ({ ...prev, [order.id]: data.error ?? "Failed to confirm" }));
      return false;
    }
    return true;
  };

  const handleBulkConfirm = async () => {
    const toConfirm = orders.filter(o => selected.has(o.id) && !o.hlStatus && o.anyMatched);
    if (!toConfirm.length) return;
    setBulkProgress({ done: 0, total: toConfirm.length });
    setBulkConfirming(true);
    for (const order of toConfirm) {
      await confirmOrder(order);
      setBulkProgress(p => ({ ...p, done: p.done + 1 }));
    }
    setBulkConfirming(false);
    setSelected(new Set());
    // Refresh wallet + orders
    fetch(`/api/wallet?userId=${userId}`).then(r => r.json()).then(d => {
      if (d.balance !== undefined) setWalletBalance(Number(d.balance));
    }).catch(() => {});
    fetchOrders();
  };

  const toggleExpanded = (id: number) =>
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const startEdit = (order: EnrichedOrder) => {
    if (!editDrafts[order.id]) {
      setEditDrafts(p => ({ ...p, [order.id]: initDraft(order) }));
    }
    setEditingId(id => id === order.id ? null : order.id);
    if (!expanded.has(order.id)) setExpanded(p => new Set([...p, order.id]));
  };

  // Derived
  const pending   = orders.filter(o => !o.hlStatus);
  const confirmed = orders.filter(o => !!o.hlStatus);
  const displayed = filter === "pending" ? pending : filter === "confirmed" ? confirmed : orders;
  const readyPending = pending.filter(o => o.anyMatched);

  const totalSelectedCost = orders
    .filter(o => selected.has(o.id) && o.anyMatched)
    .reduce((sum, o) => sum + orderCost(o).total, 0);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ds-muted py-8">
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
    return <p className="text-sm text-ds-muted py-4">No orders found in your Shopify store.</p>;
  }

  return (
    <div className="space-y-3">

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Filter tabs */}
        <div className="flex gap-0.5 bg-black/[0.05] rounded-xl p-1">
          {([
            { id: "pending",   label: `Pending · ${pending.length}`   },
            { id: "confirmed", label: `Confirmed · ${confirmed.length}` },
            { id: "all",       label: `All · ${orders.length}`        },
          ] as { id: FilterTab; label: string }[]).map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tab.id ? "bg-white shadow-sm text-ds-dark" : "text-ds-body hover:text-ds-dark"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wallet + refresh */}
        <div className="flex items-center gap-3">
          {walletBalance !== null && (
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-black/[0.05] text-ds-body rounded-full px-3 py-1">
              💰 {fmtWallet(walletBalance)}
            </span>
          )}
          <button onClick={fetchOrders} className="text-xs text-brand hover:text-brand-dark transition-colors">↻ Refresh</button>
        </div>
      </div>

      {/* ── Bulk action bar ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {filter === "pending" && readyPending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-ds-light-gray rounded-xl border border-black/[0.06] flex-wrap"
          >
            {/* Select all */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.size > 0 && selected.size === readyPending.length}
                ref={el => { if (el) el.indeterminate = selected.size > 0 && selected.size < readyPending.length; }}
                onChange={e => {
                  if (e.target.checked) setSelected(new Set(readyPending.map(o => o.id)));
                  else setSelected(new Set());
                }}
                className="rounded"
              />
              <span className="text-xs font-semibold text-ds-body">
                {selected.size === 0 ? `Select all (${readyPending.length} ready)` : `${selected.size} selected`}
              </span>
            </label>

            {selected.size > 0 && (
              <>
                <span className="text-xs text-ds-muted">·</span>
                <span className="text-xs text-ds-body">
                  Total: <span className="font-bold text-ds-dark">{fmtWallet(totalSelectedCost)}</span>
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => setSelected(new Set())} className="text-xs text-ds-muted hover:text-ds-body transition-colors">
                    Clear
                  </button>
                  <button
                    onClick={handleBulkConfirm}
                    disabled={bulkConfirming}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 disabled:opacity-50 transition-colors"
                  >
                    {bulkConfirming ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {bulkProgress.done}/{bulkProgress.total} confirmed…
                      </>
                    ) : (
                      `Confirm ${selected.size} order${selected.size !== 1 ? "s" : ""} →`
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order cards ───────────────────────────────────────────────────── */}
      {displayed.length === 0 && (
        <p className="text-sm text-ds-muted py-4 text-center">No {filter === "all" ? "" : filter} orders.</p>
      )}

      <div className="space-y-2">
        {displayed.map((order) => {
          const isPending       = !order.hlStatus;
          const isSelected      = selected.has(order.id);
          const isConfirmingThis = confirming.has(order.id);
          const isEditing       = editingId === order.id;
          const isExpanded      = expanded.has(order.id);
          const draft           = editDrafts[order.id];
          const domestic        = isDomestic(order);
          const rates           = shippingRates[order.id];
          const loadingRates    = shippingLoading[order.id];
          const { prod, shp, total } = orderCost(order);

          return (
            <motion.div
              key={order.id}
              layout
              className={`bg-white rounded-2xl border overflow-hidden transition-colors ${
                isSelected ? "border-brand-40 ring-1 ring-brand-20" : "border-black/[0.06]"
              }`}
            >
              {/* Main row */}
              <div className="px-4 py-3.5 flex items-start gap-3">

                {/* Checkbox for pending+matched, spacer otherwise */}
                <div className="flex-shrink-0 mt-0.5 w-4">
                  {isPending && order.anyMatched && (
                    <input type="checkbox" checked={isSelected}
                      onChange={e => {
                        const n = new Set(selected);
                        if (e.target.checked) n.add(order.id); else n.delete(order.id);
                        setSelected(n);
                      }}
                      className="rounded w-4 h-4 cursor-pointer" />
                  )}
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0 space-y-1.5">

                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-ds-dark">{order.name}</span>
                      {order.hlStatus ? (
                        <StatusBadge status={order.hlStatus} />
                      ) : (
                        <span className={`text-[10px] rounded-full px-2 py-0.5 font-bold border ${
                          !order.anyMatched
                            ? "bg-red-50 border-red-200 text-red-500"
                            : order.allMatched
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "bg-amber-50 border-amber-200 text-amber-600"
                        }`}>
                          {!order.anyMatched ? "SKU unmatched" : order.allMatched ? "✓ All matched" : "Partial match"}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-ds-muted flex-shrink-0">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Customer */}
                  <p className="text-xs text-ds-muted">
                    {order.email ?? "No email"} · {order.currency} {Number(order.total_price).toLocaleString()} paid
                  </p>

                  {/* Line items summary */}
                  <div className="flex flex-wrap gap-1">
                    {order.line_items.map(l => (
                      <span key={l.id} className={`inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 border ${
                        l.hlProduct
                          ? "bg-green-50 border-green-100 text-green-700"
                          : "bg-red-50 border-red-100 text-red-500"
                      }`}>
                        {l.hlProduct ? (
                          <>{l.hlProduct.productName} · {l.hlProduct.colorName} · {l.hlProduct.size} ×{l.quantity}</>
                        ) : (
                          <>{l.title} ×{l.quantity} <span className="font-mono opacity-60">({l.sku ?? "no SKU"})</span></>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Shipping selector (pending + domestic + matched) */}
                  {isPending && order.anyMatched && domestic && (
                    <div>
                      {loadingRates ? (
                        <p className="text-[10px] text-ds-muted animate-pulse">Loading shipping rates…</p>
                      ) : rates?.length ? (
                        <div className="flex gap-1.5">
                          {rates.map(opt => {
                            const sel = selectedShipping[order.id];
                            const active = sel?.type === opt.type;
                            return (
                              <button key={opt.type}
                                onClick={() => setSelectedShipping(p => ({ ...p, [order.id]: opt }))}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                                  active
                                    ? "bg-ds-dark text-white border-ds-dark"
                                    : "bg-white border-black/[0.06] text-ds-body hover:border-zinc-300"
                                }`}>
                                <span>{opt.type === "surface" ? "🚛" : "✈️"}</span>
                                <span>₹{opt.rate}</span>
                                <span className={`font-normal ${active ? "text-white/60" : "text-ds-muted"}`}>{opt.days}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Cost breakdown */}
                  {isPending && order.anyMatched && prod > 0 && (
                    <p className="text-[10px] text-ds-muted">
                      Prod: <span className="font-semibold text-ds-body">{fmtWallet(prod)}</span>
                      {shp > 0 && <> + Ship: <span className="font-semibold text-ds-body">{fmtWallet(shp)}</span></>}
                      {" · "}Total: <span className="font-bold text-ds-dark">{fmtWallet(total)}</span>
                    </p>
                  )}

                  {/* HL ref for confirmed */}
                  {!isPending && order.hlOrderRef && (
                    <p className="text-[10px] text-ds-muted font-mono">
                      {order.hlOrderRef}
                      {order.confirmedAt && ` · ${new Date(order.confirmedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    </p>
                  )}

                  {/* Confirm error */}
                  {confirmErrors[order.id] && (
                    <p className="text-[10px] text-red-500 font-semibold">{confirmErrors[order.id]}</p>
                  )}
                </div>

                {/* Right action column */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {/* Confirm button (pending only) */}
                  {isPending && order.anyMatched && (
                    <button
                      onClick={() => confirmOrder(order).then(ok => { if (ok) { fetchOrders(); fetch(`/api/wallet?userId=${userId}`).then(r => r.json()).then(d => { if (d.balance !== undefined) setWalletBalance(Number(d.balance)); }); } })}
                      disabled={isConfirmingThis || bulkConfirming}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                      {isConfirmingThis ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Confirming…
                        </>
                      ) : prod > 0 ? (
                        `Pay ${fmtWallet(total)} →`
                      ) : (
                        "Confirm →"
                      )}
                    </button>
                  )}
                  {/* Expand + Edit buttons */}
                  <div className="flex items-center gap-0.5">
                    {/* Edit (pending only) */}
                    {isPending && (
                      <button onClick={() => startEdit(order)} title="Edit shipping details"
                        className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-brand-10 text-brand" : "text-ds-muted hover:text-ds-body hover:bg-black/[0.05]"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    {/* Expand address */}
                    <button onClick={() => toggleExpanded(order.id)} title="View address"
                      className="p-1.5 rounded-lg text-ds-muted hover:text-ds-body hover:bg-black/[0.05] transition-colors">
                      <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded || isEditing ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {/* Draft badge */}
                  {draft && isPending && (
                    <span className="text-[9px] font-bold text-brand bg-brand-8 px-1.5 py-0.5 rounded-full">Edited</span>
                  )}
                </div>
              </div>

              {/* Expanded panel: address / edit form */}
              <AnimatePresence initial={false}>
                {(isExpanded || isEditing) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-black/[0.06] px-5 py-4">
                      {isEditing ? (
                        <AddressEditForm
                          draft={draft ?? initDraft(order)}
                          onChange={d => setEditDrafts(p => ({ ...p, [order.id]: d }))}
                          onClose={() => setEditingId(null)}
                        />
                      ) : (
                        <AddressDisplay
                          address={(draft ?? order.shipping_address) as AddressDraft | ShippingAddress | null}
                          note={draft?.note ?? order.note}
                          isEdited={!!draft}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ShopifyTab ────────────────────────────────────────────────────────────
export default function ShopifyTab({ userId }: { userId: string }) {
  const [connection, setConnection]       = useState<Connection | null>(null);
  const [loadingConn, setLoadingConn]     = useState(true);
  const [subTab, setSubTab]               = useState<ShopifySubTab>("orders");
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch(`/api/shopify/connect?userId=${userId}`)
      .then(r => r.json())
      .then(d => { setConnection(d.connection ?? null); setLoadingConn(false); });
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
      <div className="flex items-center gap-2 text-sm text-ds-muted py-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
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
            <p className="font-semibold text-ds-dark text-sm" style={{ letterSpacing: "-0.02em" }}>
              {connection.shop_name ?? connection.shop_domain}
            </p>
            <p className="text-xs text-ds-muted">{connection.shop_domain}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Connected
          </span>
        </div>
        <button onClick={handleDisconnect} disabled={disconnecting}
          className="text-xs text-ds-muted hover:text-red-500 transition-colors disabled:opacity-40">
          {disconnecting ? "Disconnecting…" : "Disconnect store"}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-black/[0.05] rounded-xl p-1 w-fit">
        {(["orders", "skus"] as ShopifySubTab[]).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === t ? "bg-white shadow-sm text-ds-dark" : "text-ds-body hover:text-ds-dark"}`}>
            {t === "orders" ? "Orders" : "SKU Mapping"}
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
