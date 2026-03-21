"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import { PLAN_ORDER, type PlanKey } from "@/lib/plans";

// ── Types ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  "Order Placed",
  "Design Confirmed",
  "In Production",
  "Quality Check",
  "Shipped",
  "Delivered",
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Order Placed":     { bg: "#f3e8ff", text: "#7c3aed" },
  "Design Confirmed": { bg: "#ede9fe", text: "#6d28d9" },
  "In Production":    { bg: "#fff7ed", text: "#c2410c" },
  "Quality Check":    { bg: "#fef3c7", text: "#b45309" },
  "Shipped":          { bg: "#dbeafe", text: "#1d4ed8" },
  "Delivered":        { bg: "#dcfce7", text: "#15803d" },
};

type Order = {
  id: string;
  ref: string;
  product_name: string;
  color: string;
  size: string;
  print_tier: string;
  print_dimensions: string;
  blank_price: number;
  print_price: number;
  shipping: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  pin: string;
  status: string;
  created_at: string;
  front_design_url: string | null;
  back_design_url: string | null;
  mockup_url: string | null;
  back_mockup_url: string | null;
  courier: string | null;
  tracking_number: string | null;
  neck_label: boolean;
  razorpay_payment_id: string | null;
  refund_id: string | null;
  milestones: { id: string; title: string; description: string; created_at: string }[];
  // Enriched by admin API
  is_shopify_order: boolean | null;
  merchant_name: string | null;
  merchant_email: string | null;
  shopify_domain: string | null;
  shopify_store_name: string | null;
};

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "#f3f4f6", text: "#374151" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${active ? "bg-black/[0.05] text-ds-dark" : "text-ds-body hover:text-ds-dark hover:bg-ds-light-gray"}`}>
      <span className={active ? "text-ds-dark" : "text-ds-muted"}>{icon}</span>
      {label}
    </button>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

function LoginScreen({ onAuth }: { onAuth: (secret: string) => void }) {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/orders", { headers: { "x-admin-secret": secret } });
      if (res.status === 401) { setError("Wrong password."); setLoading(false); return; }
      sessionStorage.setItem("hl_admin", secret);
      onAuth(secret);
    } catch { setError("Network error."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ds-darkest flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="mb-6">
          <div className="w-10 h-10 bg-ds-dark rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xs font-semibold">HL</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Halftone Labs Admin</h1>
          <p className="text-ds-body text-sm mt-1">Sign in to manage orders and coupons</p>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-ds-body block mb-1.5">Admin Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-black/[0.06] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={secret} onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-xl bg-ds-dark text-white font-bold text-sm hover:bg-ds-dark2 transition-colors disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Download helper (fetch → blob so cross-origin Supabase URLs download properly)
function DownloadButton({ url, filename }: { url: string; filename: string }) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = filename; a.click();
      URL.revokeObjectURL(blobUrl);
    } catch { alert("Download failed — try the View link instead."); }
    setLoading(false);
  };
  return (
    <button onClick={handleDownload} disabled={loading}
      className="flex-1 flex items-center justify-center gap-1 text-[0.65rem] font-semibold px-2 py-1.5 rounded-lg bg-ds-dark text-white hover:bg-ds-dark2 transition-colors disabled:opacity-50">
      {loading
        ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
      {loading ? "…" : "DL"}
    </button>
  );
}

// ── Orders panel ──────────────────────────────────────────────────────────────

function OrdersPanel({ secret, orders, loading, onRefresh }: { secret: string; orders: Order[]; loading: boolean; onRefresh: () => Promise<void> }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [milestoneForm, setMilestoneForm] = useState({ title: "", description: "", status: "" });
  const [adding, setAdding] = useState(false);
  const [trackingForm, setTrackingForm] = useState({ courier: "", awb: "" });
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  const [cancelForm, setCancelForm] = useState({ reason: "" });
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);

  const saveTracking = async () => {
    if (!selected || !trackingForm.courier || !trackingForm.awb) return;
    setSavingTracking(true);
    setTrackingSaved(false);
    const res = await fetch("/api/admin/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ orderId: selected.id, courier: trackingForm.courier, trackingNumber: trackingForm.awb }),
    });
    if (res.ok) {
      setTrackingSaved(true);
      setTrackingForm({ courier: "", awb: "" });
      await onRefresh();
      setTimeout(() => setTrackingSaved(false), 3000);
    }
    setSavingTracking(false);
  };

  const addMilestone = async () => {
    if (!selected || !milestoneForm.title) return;
    setAdding(true);
    await fetch("/api/admin/milestone", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ orderId: selected.id, orderRef: selected.ref, title: milestoneForm.title, description: milestoneForm.description, status: milestoneForm.status || undefined }),
    });
    setMilestoneForm({ title: "", description: "", status: "" });
    await onRefresh();
    setAdding(false);
  };

  const cancelOrder = async () => {
    if (!selected) return;
    if (!confirm(`Cancel order #${selected.ref} and issue refund? This cannot be undone.`)) return;
    setCancelling(true);
    setCancelDone(false);
    const res = await fetch("/api/admin/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({
        orderId: selected.id,
        orderRef: selected.ref,
        razorpayPaymentId: selected.razorpay_payment_id,
        amount: selected.total,
        reason: cancelForm.reason || "Cancelled by admin",
      }),
    });
    if (res.ok) {
      setCancelDone(true);
      setCancelForm({ reason: "" });
      await onRefresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Refund failed: ${data.error ?? "Unknown error"}`);
    }
    setCancelling(false);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !search || o.ref.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Order list */}
      <div className="w-80 flex-shrink-0 border-r border-black/[0.06] flex flex-col bg-white">
        <div className="p-4 border-b border-black/[0.06]">
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
            <input type="text" placeholder="Search…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-full text-[0.6rem] font-bold whitespace-nowrap transition-all ${filterStatus === s ? "bg-ds-dark text-white" : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {loading && <p className="text-center text-ds-muted text-sm py-12">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="text-center text-ds-muted text-sm py-12">No orders</p>}
          {filtered.map((order) => (
            <button key={order.id} onClick={() => setSelected(order)}
              className={`w-full text-left px-4 py-3.5 hover:bg-ds-light-gray transition-colors ${selected?.id === order.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-ds-dark">#{order.ref}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-ds-body font-semibold">{order.customer_name}</p>
              <p className="text-xs text-ds-muted mt-0.5">{order.product_name} · ₹{order.total.toLocaleString("en-IN")}</p>
              {order.is_shopify_order && order.shopify_domain && (
                <p className="text-[0.65rem] font-bold mt-0.5" style={{ color: "#96bf48" }}>
                  Shopify · {order.merchant_name ?? order.merchant_email ?? order.shopify_domain}
                </p>
              )}
              <p className="text-[0.65rem] text-ds-muted mt-0.5">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Order detail */}
      <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
        {!selected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-ds-muted">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="font-semibold text-sm">Select an order to view details</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ds-muted font-semibold mb-0.5">Order</p>
                  <h2 className="text-3xl font-semibold" style={{ letterSpacing: "-0.05em" }}>#{selected.ref}</h2>
                  <p className="text-xs text-ds-muted mt-0.5">{new Date(selected.created_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4">
                {selected.is_shopify_order && (
                  <div className="col-span-2 rounded-2xl p-5 border shadow-sm" style={{ background: "#f6faf0", borderColor: "rgba(150,191,72,0.3)" }}>
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest mb-3" style={{ color: "#96bf48" }}>Shopify Merchant</p>
                    <p className="font-bold text-ds-dark">{selected.merchant_name ?? "—"}</p>
                    {selected.merchant_email && (
                      <a href={`mailto:${selected.merchant_email}`} className="text-xs text-blue-600 hover:underline block">{selected.merchant_email}</a>
                    )}
                    {selected.shopify_domain && (
                      <a href={`https://${selected.shopify_domain}`} target="_blank" rel="noreferrer" className="text-xs block mt-1 hover:underline" style={{ color: "#96bf48" }}>
                        {selected.shopify_store_name ?? selected.shopify_domain} ↗
                      </a>
                    )}
                  </div>
                )}
                <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-3">Customer</p>
                  <p className="font-bold text-ds-dark">{selected.customer_name}</p>
                  <a href={`mailto:${selected.customer_email}`} className="text-xs text-blue-600 hover:underline font-medium">{selected.customer_email}</a>
                  <p className="text-xs text-ds-body mt-0.5">{selected.customer_phone}</p>
                  <p className="text-xs text-ds-body mt-2 leading-relaxed">{selected.address}, {selected.city} – {selected.pin}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-3">Product</p>
                  {[
                    { l: "Item", v: selected.product_name },
                    { l: "Colour", v: selected.color },
                    { l: "Size", v: selected.size },
                    { l: "Print", v: selected.print_tier ? `${selected.print_tier}` : "None" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex items-center justify-between py-0.5">
                      <span className="text-xs text-ds-muted font-medium">{l}</span>
                      <span className="text-xs font-semibold text-ds-dark">{v}</span>
                    </div>
                  ))}
                  {selected.neck_label && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-8 border border-orange-200">
                      <span className="text-xs">🏷️</span>
                      <span className="text-xs font-semibold text-orange-700">DTF Neck Label (+₹7/pc)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Payment Summary</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Blank", v: `₹${selected.blank_price.toLocaleString("en-IN")}` },
                    { l: "Print", v: `₹${selected.print_price.toLocaleString("en-IN")}` },
                    { l: "Shipping", v: selected.shipping === 0 ? "Free" : `₹${selected.shipping.toLocaleString("en-IN")}` },
                    { l: "Total", v: `₹${selected.total.toLocaleString("en-IN")}`, bold: true },
                  ].map(({ l, v, bold }) => (
                    <div key={l} className="bg-ds-light-gray rounded-xl p-3 text-center">
                      <p className="text-[0.58rem] font-bold uppercase tracking-widest text-ds-muted">{l}</p>
                      <p className={`text-sm mt-0.5 ${bold ? "font-semibold text-ds-dark" : "font-semibold text-ds-body"}`}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Shipping Info</p>

                {/* Show existing tracking if set */}
                {selected.courier && selected.tracking_number && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-widest text-blue-400 mb-0.5">Current tracking</p>
                      <p className="text-sm font-semibold text-blue-900">{selected.courier} · <span className="tracking-wider">{selected.tracking_number}</span></p>
                    </div>
                    <span className="text-[0.6rem] font-bold text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">Saved</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted block mb-1">Courier</label>
                      <select
                        value={trackingForm.courier}
                        onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
                      >
                        <option value="">Select courier…</option>
                        {["Delhivery","Blue Dart","DTDC","Xpressbees","Ecom Express","Shadow Fax","Ekart","Shiprocket","Other"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted block mb-1">AWB / Tracking No.</label>
                      <input
                        type="text"
                        placeholder="e.g. 1234567890"
                        value={trackingForm.awb}
                        onChange={(e) => setTrackingForm({ ...trackingForm, awb: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
                      />
                    </div>
                  </div>
                  <button
                    onClick={saveTracking}
                    disabled={savingTracking || !trackingForm.courier || !trackingForm.awb}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      trackingSaved
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                    }`}
                  >
                    {savingTracking ? "Saving…" : trackingSaved ? "✓ Saved & email sent!" : "Save tracking + mark Shipped + notify customer →"}
                  </button>
                </div>
              </div>

              {/* Cancel & Refund */}
              {selected.status !== "Cancelled" && selected.status !== "Delivered" && (
                <div className="bg-red-50/20 rounded-2xl p-5 border border-red-100 shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-red-400 mb-4">Cancel &amp; Refund</p>

                  {selected.refund_id ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-semibold text-green-700">Refunded</span>
                      <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded-full ml-1">{selected.refund_id}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(() => {
                        const pid = selected.razorpay_payment_id;
                        const isWallet = pid?.startsWith("WALLET");
                        const isRazorpay = pid && pid !== "FREE" && !isWallet;
                        return isWallet ? (
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Paid via Halftone Wallet — refund will go back instantly
                          </div>
                        ) : isRazorpay ? (
                          <div className="text-xs text-ds-body font-medium">
                            Payment ID: <span className="font-mono text-ds-body">{pid}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-ds-body italic">This was a free order. No refund needed.</div>
                        );
                      })()}
                      <div className="text-xs text-ds-body font-medium">
                        Refund amount: <span className="font-bold text-ds-dark">₹{selected.total.toLocaleString("en-IN")}</span>
                      </div>
                      <textarea
                        value={cancelForm.reason}
                        onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                        placeholder="Reason for cancellation…"
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none"
                      />
                      {cancelDone ? (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-700 py-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Cancelled &amp; refunded
                        </div>
                      ) : (
                        <button
                          onClick={cancelOrder}
                          disabled={cancelling}
                          className="w-full py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {cancelling ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Processing…</>
                          ) : selected.razorpay_payment_id?.startsWith("WALLET") ? (
                            "Cancel order + Refund to Wallet →"
                          ) : selected.razorpay_payment_id && selected.razorpay_payment_id !== "FREE" ? (
                            "Cancel order + Issue refund →"
                          ) : (
                            "Cancel order →"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Print Files — always shown */}
              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted">Print Files</p>
                  {(selected.front_design_url || selected.back_design_url) && (
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                      {[selected.front_design_url && "Front", selected.back_design_url && "Back"].filter(Boolean).join(" + ")} received
                    </span>
                  )}
                </div>
                {!(selected.front_design_url || selected.back_design_url || selected.mockup_url || selected.back_mockup_url) ? (
                  <div className="flex items-center gap-2 text-ds-muted text-xs py-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No design files received for this order.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Placement mockups — shown large so printer can see position clearly */}
                    {(selected.mockup_url || selected.back_mockup_url) && (
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted mb-2">Placement mockup</p>
                        <div className="flex gap-6 flex-wrap items-start">
                          {([
                            { url: selected.mockup_url,      label: "Front",  file: `${selected.ref}-mockup-front.jpg` },
                            { url: selected.back_mockup_url, label: "Back",   file: `${selected.ref}-mockup-back.jpg`  },
                          ] as const).map(({ url, label, file }) => url && (
                            <div key={label} className="flex flex-col gap-2">
                              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-body">{label}</p>
                              <div className="flex gap-3 items-start">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`${label} placement mockup`}
                                  className="w-44 h-auto rounded-xl border border-black/[0.06] bg-ds-light-gray object-contain" />
                                <div className="flex flex-col gap-1.5">
                                  <p className="text-xs text-ds-body leading-relaxed max-w-[140px]">
                                    {label} placement position and scale.
                                  </p>
                                  <a href={url} target="_blank" rel="noopener noreferrer"
                                    className="text-center text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg border border-black/[0.06] bg-white hover:border-zinc-400 transition-colors text-ds-body">
                                    View full ↗
                                  </a>
                                  <DownloadButton url={url} filename={file} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw design files */}
                    {(selected.front_design_url || selected.back_design_url) && (
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted mb-2">Raw design files (for print)</p>
                        <div className="flex gap-3 flex-wrap">
                          {([
                            { url: selected.front_design_url, label: "Front" },
                            { url: selected.back_design_url,  label: "Back"  },
                          ] as const).map(({ url, label }) => url && (
                            <div key={label} className="flex flex-col gap-2 p-3 rounded-xl border border-black/[0.06] bg-ds-light-gray">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`${label} design`}
                                className="w-28 h-28 object-contain rounded-lg bg-white border border-black/[0.06]" />
                              <p className="text-[0.65rem] font-bold text-ds-body text-center">{label} print</p>
                              <div className="flex gap-1.5">
                                <a href={url} target="_blank" rel="noopener noreferrer"
                                  className="flex-1 text-center text-[0.65rem] font-semibold px-2 py-1.5 rounded-lg border border-black/[0.06] bg-white hover:border-zinc-400 transition-colors text-ds-body">
                                  View ↗
                                </a>
                                <DownloadButton url={url} filename={`${selected.ref}-${label.toLowerCase()}-design.png`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Order Timeline</p>
                {selected.milestones.length === 0 && (
                  <p className="text-xs text-ds-muted font-medium mb-4">No updates yet.</p>
                )}
                {selected.milestones.map((m, i) => (
                  <div key={m.id} className="flex gap-3 mb-3 last:mb-0">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-ds-dark flex-shrink-0" />
                      {i < selected.milestones.length - 1 && <div className="w-px flex-1 my-1 bg-zinc-200" style={{ minHeight: 18 }} />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-semibold text-ds-dark">{m.title}</p>
                      {m.description && <p className="text-xs text-ds-body mt-0.5">{m.description}</p>}
                      <p className="text-[0.62rem] text-ds-muted mt-0.5">{new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}

                {/* Add update */}
                <div className="mt-5 pt-5 border-t border-black/[0.06]">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-ds-muted mb-3">Add Update</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {["Design Confirmed","Printing Started","Print Complete","Packed","Shipped","Out for Delivery","Delivered"].map((t) => (
                      <button key={t} onClick={() => setMilestoneForm({ ...milestoneForm, title: t })}
                        className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${milestoneForm.title === t ? "bg-ds-dark text-white border-zinc-900" : "bg-white text-ds-body border-black/[0.06] hover:border-zinc-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Or type a custom title…"
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
                      value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} />
                    <input type="text" placeholder="Details for customer (optional)"
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
                      value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} />
                    <select className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-ds-light-gray"
                      value={milestoneForm.status} onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}>
                      <option value="">Don&apos;t change order status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={addMilestone} disabled={adding || !milestoneForm.title}
                      className="w-full py-3 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors disabled:opacity-40">
                      {adding ? "Adding…" : "Add Update →"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Coupons panel ─────────────────────────────────────────────────────────────

const EMPTY_FORM = { code: "", description: "", discount_type: "percent" as "percent" | "fixed", discount_value: "", min_order: "", max_uses: "", expires_at: "" };

function CouponsPanel({ secret }: { secret: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/coupons", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    setCoupons(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createCoupon = async () => {
    if (!form.code || !form.discount_value) return;
    setSaving(true);
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({
        code: form.code,
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order: Number(form.min_order) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      }),
    });
    setForm(EMPTY_FORM);
    setShowCreate(false);
    await fetchCoupons();
    setSaving(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id, active }),
    });
    await fetchCoupons();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    setDeleting(id);
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE", headers: { "x-admin-secret": secret } });
    await fetchCoupons();
    setDeleting(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Coupon Codes</h2>
            <p className="text-xs text-ds-muted mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Create coupon
          </button>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ds-dark">New Coupon</h3>
                <button onClick={() => setShowCreate(false)} className="text-ds-muted hover:text-ds-body text-xl leading-none">&times;</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Code *</label>
                  <input type="text" placeholder="SUMMER20" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 uppercase tracking-wider" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Description</label>
                  <input type="text" placeholder="Summer sale" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Discount Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "fixed" })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Discount Value *</label>
                  <input type="number" placeholder={form.discount_type === "percent" ? "20" : "100"} value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Min Order (₹)</label>
                  <input type="number" placeholder="0" value={form.min_order}
                    onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Max Uses (blank = unlimited)</label>
                  <input type="number" placeholder="100" value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ds-body block mb-1.5">Expiry Date (optional)</label>
                  <input type="date" value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border border-black/[0.06] text-sm font-semibold text-ds-body hover:bg-ds-light-gray transition-colors">
                  Cancel
                </button>
                <button onClick={createCoupon} disabled={saving || !form.code || !form.discount_value}
                  className="flex-1 py-3 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors disabled:opacity-40">
                  {saving ? "Creating…" : "Create Coupon →"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coupon list */}
        {loading && <p className="text-center text-ds-muted text-sm py-12">Loading…</p>}
        {!loading && coupons.length === 0 && (
          <div className="text-center py-16 text-ds-muted">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>
            <p className="font-semibold text-sm">No coupons yet</p>
            <p className="text-xs mt-1">Create your first coupon code above</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {coupons.map((c) => (
            <div key={c.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${c.active ? "border-black/[0.06]" : "border-black/[0.06] opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-ds-dark tracking-wider text-lg" style={{ letterSpacing: "0.04em", fontFamily: "monospace" }}>{c.code}</span>
                    <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-black/[0.05] text-ds-body"}`}>
                      {c.active ? "ACTIVE" : "DISABLED"}
                    </span>
                    {c.expires_at && new Date(c.expires_at) < new Date() && (
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">EXPIRED</span>
                    )}
                  </div>
                  {c.description && <p className="text-xs text-ds-body mb-2">{c.description}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-ds-body">
                    <span className="font-semibold text-ds-dark">
                      {c.discount_type === "percent" ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                    </span>
                    {c.min_order > 0 && <span>Min ₹{c.min_order.toLocaleString("en-IN")}</span>}
                    <span>{c.uses_count} use{c.uses_count !== 1 ? "s" : ""}{c.max_uses ? ` / ${c.max_uses}` : ""}</span>
                    {c.expires_at && <span>Expires {new Date(c.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle */}
                  <button onClick={() => toggleActive(c.id, !c.active)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.active ? "bg-ds-dark" : "bg-zinc-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  {/* Delete */}
                  <button onClick={() => deleteCoupon(c.id)} disabled={deleting === c.id}
                    className="p-1.5 rounded-lg text-ds-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Studio panel ──────────────────────────────────────────────────────────────

type StudioProduct = {
  id: string;
  name: string;
  gsm: string | null;
  description: string | null;
  blank_price: number;
  type: "regular" | "oversized" | "baby";
  size_guide_key: string;
  colors: { name: string; hex: string; border: boolean; mockupFront: string; mockupBack: string }[];
  active: boolean;
  sort_order: number;
  created_at: string;
};

type PrintZone = { left: number; top: number; width: number; height: number };
type PrintZones = { regular: PrintZone; oversized: PrintZone; baby: PrintZone };

const DEFAULT_ZONES: PrintZones = {
  regular:   { left: 30,   top: 29.8, width: 36, height: 44 },
  oversized: { left: 28.3, top: 29.8, width: 40, height: 48 },
  baby:      { left: 28.3, top: 29.8, width: 40, height: 26 },
};

const EMPTY_PRODUCT_FORM = {
  name: "",
  gsm: "",
  description: "",
  blank_price: "",
  type: "regular" as "regular" | "oversized" | "baby",
  size_guide_key: "regular",
  active: true,
  colors: [] as { name: string; hex: string; border: boolean; mockupFront: string; mockupBack: string }[],
};

function ZoneEditor({
  label,
  zone,
  onChange,
  mockupSrc,
}: {
  label: string;
  zone: PrintZone;
  onChange: (z: PrintZone) => void;
  mockupSrc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
      <p className="font-bold text-ds-dark mb-4 text-sm">{label}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {(["left", "top", "width", "height"] as (keyof PrintZone)[]).map((field) => (
          <div key={field}>
            <label className="text-xs font-semibold text-ds-body block mb-1 capitalize">{field} %</label>
            <input
              type="number"
              step={0.1}
              value={zone[field]}
              onChange={(e) => onChange({ ...zone, [field]: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        ))}
      </div>
      {/* Visual preview — real product photo */}
      <div className="relative w-full overflow-hidden rounded-xl border border-black/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mockupSrc} alt={label} className="w-full block" draggable={false} />
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${zone.left}%`,
            top: `${zone.top}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
            border: "2px dashed rgba(241,85,51,0.85)",
            background: "rgba(241,85,51,0.06)",
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

function StudioPanel({ secret }: { secret: string }) {
  const [subTab, setSubTab] = useState<"products" | "zones">("products");

  // ── Products state ──
  const [products, setProducts] = useState<StudioProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ── Zones state ──
  const [zones, setZones] = useState<PrintZones>(DEFAULT_ZONES);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesSaving, setZonesSaving] = useState(false);
  const [zonesSaved, setZonesSaved] = useState(false);

  const fetchProducts = async () => {
    setProductsLoading(true);
    const res = await fetch("/api/admin/studio-products", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setProductsLoading(false);
  };

  const fetchZones = async () => {
    setZonesLoading(true);
    const res = await fetch("/api/admin/studio-settings", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    if (data.print_zones) setZones(data.print_zones as PrintZones);
    setZonesLoading(false);
  };

  useEffect(() => { fetchProducts(); fetchZones(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT_FORM);
    setShowForm(true);
  };

  const openEdit = (p: StudioProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      gsm: p.gsm ?? "",
      description: p.description ?? "",
      blank_price: String(p.blank_price),
      type: p.type,
      size_guide_key: p.size_guide_key,
      active: p.active,
      colors: p.colors ?? [],
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_PRODUCT_FORM); };

  const saveProduct = async () => {
    if (!form.name || !form.blank_price) return;
    setSaving(true);
    const body = {
      name: form.name,
      gsm: form.gsm || null,
      description: form.description || null,
      blank_price: Number(form.blank_price),
      type: form.type,
      size_guide_key: form.size_guide_key,
      active: form.active,
      colors: form.colors,
    };
    if (editingId) {
      await fetch("/api/admin/studio-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ id: editingId, ...body }),
      });
    } else {
      await fetch("/api/admin/studio-products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(body),
      });
    }
    closeForm();
    await fetchProducts();
    setSaving(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/studio-products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id, active }),
    });
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/admin/studio-products?id=${id}`, { method: "DELETE", headers: { "x-admin-secret": secret } });
    await fetchProducts();
    setDeleting(null);
  };

  const saveZones = async () => {
    setZonesSaving(true);
    await fetch("/api/admin/studio-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ key: "print_zones", value: zones }),
    });
    setZonesSaving(false);
    setZonesSaved(true);
    setTimeout(() => setZonesSaved(false), 2500);
  };

  const addColor = () =>
    setForm((f) => ({ ...f, colors: [...f.colors, { name: "", hex: "#ffffff", border: false, mockupFront: "", mockupBack: "" }] }));

  const removeColor = (i: number) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));

  const updateColor = (i: number, field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, colors: f.colors.map((c, idx) => idx === i ? { ...c, [field]: value } : c) }));

  const INPUT = "w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900";

  return (
    <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
      <div className="max-w-4xl mx-auto">
        {/* Sub-tab nav */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSubTab("products")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${subTab === "products" ? "bg-ds-dark text-white" : "bg-white border border-black/[0.06] text-ds-body hover:bg-ds-light-gray"}`}
          >
            Products
          </button>
          <button
            onClick={() => setSubTab("zones")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${subTab === "zones" ? "bg-ds-dark text-white" : "bg-white border border-black/[0.06] text-ds-body hover:bg-ds-light-gray"}`}
          >
            Print Zones
          </button>
        </div>

        {/* ── Products sub-section ── */}
        {subTab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Studio Products</h2>
                <p className="text-xs text-ds-muted mt-0.5">{PRODUCTS.length + products.length} product{(PRODUCTS.length + products.length) !== 1 ? "s" : ""} ({PRODUCTS.length} built-in)</p>
              </div>
              <button
                onClick={openCreate}
                className="px-4 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Product
              </button>
            </div>

            {/* Form slide-in */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-ds-dark">{editingId ? "Edit Product" : "New Product"}</h3>
                    <button onClick={closeForm} className="text-ds-muted hover:text-ds-body text-xl leading-none">&times;</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">Name *</label>
                      <input type="text" placeholder="Classic Tee" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">GSM</label>
                      <input type="text" placeholder="220 GSM" value={form.gsm} onChange={(e) => setForm({ ...form, gsm: e.target.value })} className={INPUT} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">Description</label>
                      <textarea rows={2} placeholder="Product description…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT + " resize-none"} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">Blank Price (₹) *</label>
                      <input type="number" placeholder="599" value={form.blank_price} onChange={(e) => setForm({ ...form, blank_price: e.target.value })} className={INPUT} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">Type</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "regular" | "oversized" | "baby" })} className={INPUT}>
                        <option value="regular">Regular</option>
                        <option value="oversized">Oversized</option>
                        <option value="baby">Baby</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ds-body block mb-1.5">Size Guide Key</label>
                      <select value={form.size_guide_key} onChange={(e) => setForm({ ...form, size_guide_key: e.target.value })} className={INPUT}>
                        <option value="regular">regular</option>
                        <option value="oversized-ft">oversized-ft</option>
                        <option value="oversized-sj">oversized-sj</option>
                        <option value="baby">baby</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-5">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, active: !form.active })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${form.active ? "bg-ds-dark" : "bg-zinc-300"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                      <label className="text-xs font-semibold text-ds-body">Active</label>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-ds-body">Colors</label>
                      <button
                        type="button"
                        onClick={addColor}
                        className="text-xs font-bold text-ds-dark hover:text-ds-body flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Add color
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {form.colors.map((c, i) => (
                        <div key={i} className="bg-ds-light-gray rounded-xl p-3 border border-black/[0.06]">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input type="text" placeholder="Name (e.g. White)" value={c.name} onChange={(e) => updateColor(i, "name", e.target.value)} className={INPUT} />
                            <div className="flex items-center gap-2">
                              <input type="color" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className="w-10 h-10 rounded-lg border border-black/[0.06] p-0.5 cursor-pointer" />
                              <input type="text" placeholder="#ffffff" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className={INPUT} />
                            </div>
                            <input type="text" placeholder="Mockup Front URL" value={c.mockupFront} onChange={(e) => updateColor(i, "mockupFront", e.target.value)} className={INPUT} />
                            <input type="text" placeholder="Mockup Back URL" value={c.mockupBack} onChange={(e) => updateColor(i, "mockupBack", e.target.value)} className={INPUT} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-ds-body font-medium cursor-pointer">
                              <input type="checkbox" checked={c.border} onChange={(e) => updateColor(i, "border", e.target.checked)} className="rounded" />
                              Show border
                            </label>
                            <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-400 hover:text-red-600 font-semibold">Remove</button>
                          </div>
                        </div>
                      ))}
                      {form.colors.length === 0 && (
                        <p className="text-xs text-ds-muted text-center py-3">No colors added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={closeForm} className="flex-1 py-3 rounded-xl border border-black/[0.06] text-sm font-semibold text-ds-body hover:bg-ds-light-gray transition-colors">
                      Cancel
                    </button>
                    <button onClick={saveProduct} disabled={saving || !form.name || !form.blank_price} className="flex-1 py-3 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors disabled:opacity-40">
                      {saving ? "Saving…" : editingId ? "Update Product →" : "Create Product →"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product list */}
            {productsLoading && <p className="text-center text-ds-muted text-sm py-12">Loading…</p>}
            {!productsLoading && (
              <div className="flex flex-col gap-3">
                {/* ── Built-in (hardcoded) products ── */}
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted px-1">Built-in products</p>
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-ds-dark text-base" style={{ letterSpacing: "-0.02em" }}>{p.name}</span>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">BUILT-IN</span>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-ds-body">
                          {p.gsm && <span className="font-mono">{p.gsm}</span>}
                          <span className="font-semibold text-ds-dark">₹{p.blankPrice.toLocaleString("en-IN")}</span>
                          <span className="capitalize">{p.id.includes("oversized") ? "oversized" : p.id.includes("baby") ? "baby" : "regular"}</span>
                          <span>{p.colors.length} color{p.colors.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <span className="text-[0.65rem] text-ds-muted font-medium self-center">Defined in code</span>
                    </div>
                  </div>
                ))}

                {/* ── DB products ── */}
                {products.length > 0 && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted px-1 mt-2">Custom products</p>
                )}
                {products.map((p) => (
                  <div key={p.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${p.active ? "border-black/[0.06]" : "border-black/[0.06] opacity-60"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-ds-dark text-base" style={{ letterSpacing: "-0.02em" }}>{p.name}</span>
                          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-black/[0.05] text-ds-body"}`}>
                            {p.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-ds-body">
                          {p.gsm && <span className="font-mono">{p.gsm}</span>}
                          <span className="font-semibold text-ds-dark">₹{p.blank_price.toLocaleString("en-IN")}</span>
                          <span className="capitalize">{p.type}</span>
                          {p.colors?.length > 0 && <span>{p.colors.length} color{p.colors.length !== 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleActive(p.id, !p.active)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.active ? "bg-ds-dark" : "bg-zinc-300"}`}>
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${p.active ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-ds-muted hover:text-ds-body hover:bg-black/[0.05] transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} className="p-1.5 rounded-lg text-ds-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <p className="text-xs text-ds-muted text-center py-4">No custom products yet — create one above</p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Print Zones sub-section ── */}
        {subTab === "zones" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Print Zone Calibration</h2>
                <p className="text-xs text-ds-muted mt-0.5">Adjust the print zone position and size for each garment type</p>
              </div>
              <button
                onClick={saveZones}
                disabled={zonesSaving}
                className="px-4 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors disabled:opacity-40"
              >
                {zonesSaving ? "Saving…" : zonesSaved ? "Saved ✓" : "Save Zones"}
              </button>
            </div>
            {zonesLoading ? (
              <p className="text-center text-ds-muted text-sm py-12">Loading…</p>
            ) : (
              <div className="flex flex-col gap-5">
                <ZoneEditor label="Regular Tee" zone={zones.regular} onChange={(z) => setZones({ ...zones, regular: z })} mockupSrc="/mockups/regular-tee/Mannequin_Image4.png" />
                <ZoneEditor label="Oversized Tee" zone={zones.oversized} onChange={(z) => setZones({ ...zones, oversized: z })} mockupSrc="/mockups/oversized-sj/Mannequin_Image1.png" />
                <ZoneEditor label="Baby Tee" zone={zones.baby} onChange={(z) => setZones({ ...zones, baby: z })} mockupSrc="/mockups/baby-tee/Mannequin_Image1.png" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Wallets panel ─────────────────────────────────────────────────────────────

type WalletRow = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  updated_at: string;
  email: string | null;
  name: string | null;
  company: string | null;
  transactions: {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    reference_id: string | null;
    created_at: string;
  }[];
};

function WalletsPanel({ secret }: { secret: string }) {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjAmount, setAdjAmount] = useState("");
  const [adjDesc, setAdjDesc] = useState("");
  const [adjType, setAdjType] = useState<"credit" | "debit">("credit");
  const [adjLoading, setAdjLoading] = useState(false);
  const [adjError, setAdjError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchWallets = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/wallet", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    setWallets(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchWallets(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdjust = async (userId: string) => {
    const amt = parseFloat(adjAmount);
    if (!amt || amt <= 0) { setAdjError("Enter a valid amount"); return; }
    setAdjLoading(true); setAdjError(null);
    const res = await fetch("/api/admin/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ userId, amount: amt, type: adjType, description: adjDesc || undefined }),
    });
    const json = await res.json();
    if (!res.ok) { setAdjError(json.error ?? "Failed"); }
    else {
      setAdjusting(null); setAdjAmount(""); setAdjDesc(""); setAdjType("credit");
      await fetchWallets();
    }
    setAdjLoading(false);
  };

  const totalCredit = wallets.reduce((s, w) => s + w.balance, 0);
  const usersWithBalance = wallets.filter((w) => w.balance > 0).length;

  const filtered = wallets.filter((w) => {
    const q = search.toLowerCase();
    return !q || (w.email ?? "").includes(q) || (w.name ?? "").toLowerCase().includes(q) || (w.company ?? "").toLowerCase().includes(q);
  });

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-black/[0.06] bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Wallets</h2>
            <p className="text-xs text-ds-muted mt-0.5">{wallets.length} wallet{wallets.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={fetchWallets}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/[0.06] bg-white text-sm font-semibold text-ds-body hover:bg-ds-light-gray transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Outstanding Credit", value: `₹${totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, accent: "text-emerald-600" },
            { label: "Users with Balance", value: String(usersWithBalance), accent: "text-blue-600" },
            { label: "Total Wallets", value: String(wallets.length), accent: "text-ds-dark" },
          ].map((s) => (
            <div key={s.label} className="bg-ds-light-gray rounded-2xl px-5 py-4">
              <p className="text-xs text-ds-muted font-semibold mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.accent}`} style={{ letterSpacing: "-0.04em" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:border-zinc-400 bg-white" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ds-muted text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-semibold text-sm text-ds-body">No wallets found</p>
            <p className="text-xs text-ds-muted mt-1">Wallets are created automatically when users top up.</p>
          </div>
        ) : (
          filtered.map((w) => (
            <div key={w.user_id} className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              {/* Row header */}
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-ds-light-gray transition-colors"
                onClick={() => setExpanded(expanded === w.user_id ? null : w.user_id)}>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/[0.05] flex-shrink-0">
                  <svg className="w-4 h-4 text-ds-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ds-dark truncate">{w.name ?? w.email ?? w.user_id}</p>
                  <p className="text-xs text-ds-muted truncate">{w.email ?? "—"}{w.company ? ` · ${w.company}` : ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-semibold ${w.balance > 0 ? "text-emerald-600" : "text-ds-muted"}`}
                    style={{ letterSpacing: "-0.03em" }}>
                    ₹{w.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-ds-muted">{w.transactions.length} txn{w.transactions.length !== 1 ? "s" : ""}</p>
                </div>
                <svg className={`w-4 h-4 text-ds-muted flex-shrink-0 transition-transform ${expanded === w.user_id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {expanded === w.user_id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="border-t border-black/[0.06] overflow-hidden">
                    <div className="px-5 py-4 space-y-4">

                      {/* Adjust balance buttons */}
                      {adjusting !== w.user_id ? (
                        <div className="flex gap-2">
                          <button onClick={() => { setAdjusting(w.user_id); setAdjType("credit"); setAdjError(null); }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add Credit
                          </button>
                          <button onClick={() => { setAdjusting(w.user_id); setAdjType("debit"); setAdjError(null); }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                            Deduct
                          </button>
                        </div>
                      ) : (
                        <div className="bg-ds-light-gray rounded-xl p-4 space-y-3">
                          <div className="flex gap-2">
                            <button onClick={() => setAdjType("credit")}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${adjType === "credit" ? "bg-emerald-500 text-white" : "bg-white border border-black/[0.06] text-ds-body"}`}>
                              + Credit
                            </button>
                            <button onClick={() => setAdjType("debit")}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${adjType === "debit" ? "bg-red-500 text-white" : "bg-white border border-black/[0.06] text-ds-body"}`}>
                              − Deduct
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-muted font-bold text-sm">₹</span>
                            <input type="number" min="1" placeholder="Amount" value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)}
                              className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-black/[0.06] text-sm font-bold focus:outline-none focus:border-zinc-400" />
                          </div>
                          <input placeholder="Note (optional)" value={adjDesc} onChange={(e) => setAdjDesc(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm focus:outline-none focus:border-zinc-400" />
                          {adjError && <p className="text-xs text-red-500">{adjError}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => handleAdjust(w.user_id)} disabled={adjLoading}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${adjType === "credit" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}>
                              {adjLoading ? "Saving…" : adjType === "credit" ? "Add Credit" : "Deduct"}
                            </button>
                            <button onClick={() => { setAdjusting(null); setAdjAmount(""); setAdjDesc(""); setAdjError(null); }}
                              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-black/[0.06] text-ds-body hover:bg-ds-light-gray">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Transaction history */}
                      <div>
                        <p className="text-xs font-bold text-ds-muted uppercase tracking-wider mb-2">Transaction History</p>
                        {w.transactions.length === 0 ? (
                          <p className="text-xs text-ds-muted py-2">No transactions yet.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {w.transactions.map((t) => (
                              <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-ds-light-gray text-sm">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.type === "credit" ? "bg-emerald-500" : "bg-red-400"}`} />
                                  <div className="min-w-0">
                                    <p className="text-ds-body font-medium text-xs truncate">{t.description ?? (t.type === "credit" ? "Credit" : "Debit")}</p>
                                    <p className="text-ds-muted text-[10px]">{fmtDate(t.created_at)}</p>
                                  </div>
                                </div>
                                <span className={`font-semibold text-sm flex-shrink-0 ml-3 ${t.type === "credit" ? "text-emerald-600" : "text-red-500"}`}>
                                  {t.type === "credit" ? "+" : "−"}₹{t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* User ID (for reference) */}
                      <p className="text-[10px] font-mono text-ds-muted break-all">uid: {w.user_id}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Users panel ───────────────────────────────────────────────────────────────

type UserProfile = {
  id: string;
  user_id: string | null;
  customer_email: string;
  name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  pin: string | null;
  country: string | null;
  gst_number: string | null;
  company_name: string | null;
  created_at: string;
  order_count: number;
  total_spend: number;
  neck_label_orders: number;
  last_order_at: string | null;
  order_statuses: string[];
  orders: {
    id: string;
    ref: string;
    customer_email: string;
    user_id: string | null;
    total: number;
    status: string;
    neck_label: boolean;
    created_at: string;
    product_name: string;
    mockup_url: string | null;
    front_design_url: string | null;
    back_design_url: string | null;
    customer_name: string | null;
  }[];
};

function UserAvatar({ name, email, size = 32 }: { name: string | null; email: string; size?: number }) {
  const initials = (name ?? email).slice(0, 2).toUpperCase();
  const colors = ["#f97316", "#8b5cf6", "#0ea5e9", "#10b981", "#f43f5e", "#6366f1"];
  const idx = (name ?? email).charCodeAt(0) % colors.length;
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 font-semibold text-white"
      style={{ width: size, height: size, background: colors[idx], fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function UserDetailView({ user, onBack, secret }: { user: UserProfile; onBack: () => void; secret: string }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const activeOrders = user.orders.filter((o) =>
    o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;

  return (
    <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-ds-body hover:text-ds-dark transition-colors self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          All Users
        </button>

        {/* User header */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <UserAvatar name={user.name} email={user.customer_email} size={56} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
                  {user.name ?? user.customer_email}
                </h2>
                {user.gst_number && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">GST</span>
                )}
                {user.neck_label_orders > 0 && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">🏷️ Neck Label</span>
                )}
              </div>
              <a href={`mailto:${user.customer_email}`} className="text-sm text-blue-600 hover:underline font-medium">{user.customer_email}</a>
              {user.phone && <p className="text-xs text-ds-body mt-0.5">{user.phone}</p>}
              {(user.city || user.state) && (
                <p className="text-xs text-ds-body mt-0.5">{[user.city, user.state].filter(Boolean).join(", ")}</p>
              )}
              {user.company_name && (
                <p className="text-xs text-ds-body font-semibold mt-0.5">{user.company_name}{user.gst_number ? ` · GST: ${user.gst_number}` : ""}</p>
              )}
              <p className="text-[0.65rem] text-ds-muted mt-1.5">
                Member since {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Orders", value: String(user.order_count), accent: "text-blue-600" },
            { label: "Total Spend", value: `₹${user.total_spend.toLocaleString("en-IN")}`, accent: "text-brand-dark" },
            { label: "Neck Label", value: String(user.neck_label_orders), accent: "text-brand" },
            { label: "Active", value: String(activeOrders), accent: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm text-center">
              <p className={`text-2xl font-semibold ${s.accent}`}>{s.value}</p>
              <p className="text-[0.62rem] text-ds-muted mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted">Order History</p>
          </div>
          {user.orders.length === 0 ? (
            <p className="text-sm text-ds-muted text-center py-8">No orders yet</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {user.orders.map((o) => {
                const expanded = expandedOrder === o.id;
                return (
                  <div key={o.id}>
                    <button
                      className="w-full text-left px-5 py-4 hover:bg-ds-light-gray transition-colors"
                      onClick={() => setExpandedOrder(expanded ? null : o.id)}
                    >
                      <div className="flex items-center gap-3">
                        {o.mockup_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={o.mockup_url} alt="mockup" className="w-10 h-10 rounded-lg object-contain bg-black/[0.05] border border-black/[0.06] flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-ds-dark">#{o.ref}</span>
                            <StatusBadge status={o.status} />
                            {o.neck_label && (
                              <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-brand-8 border border-orange-200 text-orange-700">🏷️</span>
                            )}
                          </div>
                          <p className="text-xs text-ds-body mt-0.5 truncate">{o.product_name}</p>
                          <p className="text-[0.62rem] text-ds-muted mt-0.5">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-ds-dark">₹{o.total.toLocaleString("en-IN")}</p>
                          <div className="flex gap-1 justify-end mt-1">
                            {o.front_design_url && <span className="w-2 h-2 rounded-full bg-green-400 inline-block" title="Front design" />}
                            {o.back_design_url && <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" title="Back design" />}
                          </div>
                          <svg className={`w-4 h-4 text-ds-muted ml-auto mt-1 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </button>

                    {expanded && (o.front_design_url || o.back_design_url || o.mockup_url) && (
                      <div className="px-5 pb-4 bg-ds-light-gray border-t border-black/[0.06]">
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted py-3">Design Files</p>
                        <div className="flex gap-3 flex-wrap">
                          {o.mockup_url && (
                            <div className="flex flex-col gap-1.5 items-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={o.mockup_url} alt="Mockup" className="w-24 h-24 object-contain rounded-xl border border-black/[0.06] bg-white" />
                              <p className="text-[0.6rem] text-ds-muted font-semibold">Mockup</p>
                              <div className="flex gap-1">
                                <a href={o.mockup_url} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] font-semibold text-ds-body hover:text-ds-dark px-2 py-1 rounded-lg border border-black/[0.06] bg-white">View ↗</a>
                                <DownloadButton url={o.mockup_url} filename={`${o.ref}-mockup.jpg`} />
                              </div>
                            </div>
                          )}
                          {o.front_design_url && (
                            <div className="flex flex-col gap-1.5 items-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={o.front_design_url} alt="Front" className="w-24 h-24 object-contain rounded-xl border border-black/[0.06] bg-white" />
                              <p className="text-[0.6rem] text-ds-muted font-semibold">Front</p>
                              <div className="flex gap-1">
                                <a href={o.front_design_url} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] font-semibold text-ds-body hover:text-ds-dark px-2 py-1 rounded-lg border border-black/[0.06] bg-white">View ↗</a>
                                <DownloadButton url={o.front_design_url} filename={`${o.ref}-front.png`} />
                              </div>
                            </div>
                          )}
                          {o.back_design_url && (
                            <div className="flex flex-col gap-1.5 items-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={o.back_design_url} alt="Back" className="w-24 h-24 object-contain rounded-xl border border-black/[0.06] bg-white" />
                              <p className="text-[0.6rem] text-ds-muted font-semibold">Back</p>
                              <div className="flex gap-1">
                                <a href={o.back_design_url} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] font-semibold text-ds-body hover:text-ds-dark px-2 py-1 rounded-lg border border-black/[0.06] bg-white">View ↗</a>
                                <DownloadButton url={o.back_design_url} filename={`${o.ref}-back.png`} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersPanel({ secret }: { secret: string }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (selectedUser) {
    return <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} secret={secret} />;
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q
      || (u.name ?? "").toLowerCase().includes(q)
      || u.customer_email.toLowerCase().includes(q)
      || (u.city ?? "").toLowerCase().includes(q)
      || (u.company_name ?? "").toLowerCase().includes(q);
  });

  const totalUsers = users.length;
  const totalOrders = users.reduce((s, u) => s + u.order_count, 0);
  const totalRevenue = users.reduce((s, u) => s + u.total_spend, 0);
  const usersWithNeckLabel = users.filter((u) => u.neck_label_orders > 0).length;

  // Top spenders threshold (top 20%)
  const topThreshold = users.length > 0 ? users[Math.floor(users.length * 0.2)]?.total_spend ?? 0 : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Users</h2>
            <p className="text-xs text-ds-muted mt-0.5">{totalUsers} registered user{totalUsers !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/[0.06] bg-white text-sm font-semibold text-ds-body hover:bg-ds-light-gray transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: String(totalUsers), accent: "text-blue-600" },
            { label: "Total Orders", value: String(totalOrders), accent: "text-ds-dark" },
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, accent: "text-brand-dark" },
            { label: "Neck Label Users", value: String(usersWithNeckLabel), accent: "text-brand" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm text-center">
              <p className={`text-xl font-semibold ${s.accent}`}>{s.value}</p>
              <p className="text-[0.62rem] text-ds-muted mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
          <input
            type="text"
            placeholder="Search by name, email, city, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/[0.06] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-ds-muted text-sm py-12">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ds-muted">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            <p className="font-semibold text-sm">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-3 border-b border-black/[0.06] bg-ds-light-gray">
              {["User", "City", "Orders", "Neck Label", "Spend", ""].map((h) => (
                <span key={h} className="text-[0.6rem] font-bold uppercase tracking-widest text-ds-muted">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-zinc-100">
              {filtered.map((u) => {
                const isTopSpender = u.total_spend >= topThreshold && u.total_spend > 0;
                return (
                  <div
                    key={u.id}
                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center px-5 py-3.5 hover:bg-ds-light-gray transition-colors ${isTopSpender ? "border-l-2 border-l-orange-400" : ""}`}
                  >
                    {/* Name / Email */}
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar name={u.name} email={u.customer_email} size={32} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ds-dark truncate">{u.name ?? u.customer_email}</p>
                        {u.name && <p className="text-xs text-ds-muted truncate">{u.customer_email}</p>}
                        {u.gst_number && (
                          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">GST</span>
                        )}
                      </div>
                    </div>
                    {/* City */}
                    <div>
                      <p className="text-xs text-ds-body font-medium">{u.city ?? "—"}</p>
                      {u.state && <p className="text-[0.6rem] text-ds-muted">{u.state}</p>}
                    </div>
                    {/* Orders */}
                    <p className="text-sm font-bold text-ds-dark">{u.order_count}</p>
                    {/* Neck label */}
                    <p className="text-sm font-semibold text-ds-body">
                      {u.neck_label_orders > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                          {u.neck_label_orders}
                        </span>
                      ) : "—"}
                    </p>
                    {/* Spend */}
                    <p className={`text-sm font-semibold ${isTopSpender ? "text-brand-dark" : "text-ds-dark"}`}>
                      ₹{u.total_spend.toLocaleString("en-IN")}
                    </p>
                    {/* Action */}
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1.5 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors whitespace-nowrap"
                    >
                      View →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analytics panel ───────────────────────────────────────────────────────────

function AnalyticsPanel({ orders }: { orders: Order[] }) {
  const totalRevenue   = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders    = orders.length;
  const avgOrderValue  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const delivered      = orders.filter((o) => o.status === "Delivered").length;

  // Orders by status
  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  // Recent 7 days revenue
  const now    = new Date();
  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    dayMap[key] = 0;
  }
  for (const o of orders) {
    const d   = new Date(o.created_at);
    const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (key in dayMap) dayMap[key] += o.total;
  }
  const dayEntries  = Object.entries(dayMap);
  const maxDayRev   = Math.max(1, ...dayEntries.map(([, v]) => v));

  // Top 5 products
  const productCounts: Record<string, number> = {};
  for (const o of orders) {
    productCounts[o.product_name] = (productCounts[o.product_name] ?? 0) + 1;
  }
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxProductCount = Math.max(1, ...topProducts.map(([, v]) => v));

  const STAT_CARDS = [
    { label: "Total Revenue",    value: `₹${totalRevenue.toLocaleString("en-IN")}`, accent: "text-brand-dark" },
    { label: "Total Orders",     value: String(totalOrders),                         accent: "text-blue-600" },
    { label: "Avg Order Value",  value: `₹${avgOrderValue.toLocaleString("en-IN")}`, accent: "text-brand" },
    { label: "Delivered",        value: String(delivered),                            accent: "text-green-600" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-ds-light-gray p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ letterSpacing: "-0.04em" }}>Analytics</h2>
          <p className="text-xs text-ds-muted mt-0.5">All-time overview · {totalOrders} order{totalOrders !== 1 ? "s" : ""}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
              <p className={`text-2xl font-semibold ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-ds-muted mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Orders by Status</p>
          <div className="flex flex-col gap-3">
            {STATUS_OPTIONS.map((status) => {
              const count = statusCounts[status] ?? 0;
              const pct   = Math.round((count / maxStatusCount) * 100);
              const c     = STATUS_COLORS[status] ?? { bg: "#f3f4f6", text: "#374151" };
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-ds-body w-36 flex-shrink-0">{status}</span>
                  <div className="flex-1 bg-black/[0.05] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: c.text }}
                    />
                  </div>
                  <span className="text-xs font-bold text-ds-body w-6 text-right flex-shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Last 7 days revenue */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Revenue — Last 7 Days</p>
          <div className="flex items-end gap-2 h-28">
            {dayEntries.map(([day, rev]) => {
              const pct = Math.round((rev / maxDayRev) * 100);
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[0.55rem] font-bold text-ds-body">{rev > 0 ? `₹${(rev / 1000).toFixed(1)}k` : ""}</span>
                  <div className="w-full bg-black/[0.05] rounded-md overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full bg-orange-400 rounded-md transition-all duration-500"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-[0.55rem] text-ds-muted font-medium text-center leading-tight">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted mb-4">Top Products</p>
          {topProducts.length === 0 ? (
            <p className="text-sm text-ds-muted">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map(([name, count]) => {
                const pct = Math.round((count / maxProductCount) * 100);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-ds-body w-40 flex-shrink-0 truncate">{name}</span>
                    <div className="flex-1 bg-black/[0.05] rounded-full h-2.5 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-ds-body w-6 text-right flex-shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "orders" | "coupons" | "analytics" | "studio" | "users" | "wallets" | "plan-gates" | "affiliates";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders]   = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = async (s?: string) => {
    const key = s ?? secret;
    if (!key) return;
    setOrdersLoading(true);
    try {
      const res  = await fetch("/api/admin/orders", { headers: { "x-admin-secret": key } });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setOrdersLoading(false);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("hl_admin");
    if (saved) { setSecret(saved); setAuthed(true); fetchOrders(saved); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!authed) return <LoginScreen onAuth={(s) => { setSecret(s); setAuthed(true); fetchOrders(s); }} />;

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "orders",
      label: "Orders",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
    {
      id: "users",
      label: "Users",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    },
    {
      id: "studio",
      label: "Studio",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      id: "wallets",
      label: "Wallets",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    },
    {
      id: "plan-gates",
      label: "Plan Gates",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    },
    {
      id: "affiliates",
      label: "Affiliates",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    },
  ];

  return (
    <div className="min-h-screen bg-ds-light-gray flex flex-col">
      {/* Top nav bar */}
      <header className="h-14 bg-white border-b border-black/[0.06] flex items-center px-5 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-ds-dark rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[0.6rem] font-semibold">HL</span>
          </div>
          <span className="font-semibold text-ds-dark text-sm" style={{ letterSpacing: "-0.03em" }}>Halftone Labs</span>
          <span className="text-ds-muted text-sm">/</span>
          <span className="text-sm text-ds-body font-semibold">Admin</span>
        </div>
        <div className="ml-auto">
          <button onClick={() => { sessionStorage.removeItem("hl_admin"); setAuthed(false); setOrders([]); }}
            className="text-xs font-semibold text-ds-muted hover:text-ds-body transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-white border-r border-black/[0.06] p-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <SidebarItem key={n.id} icon={n.icon} label={n.label} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
          <div className="mt-auto pt-4 border-t border-black/[0.06]">
            <p className="text-[0.6rem] font-semibold text-ds-muted px-3">ADMIN v1.0</p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {tab === "orders"    && <OrdersPanel    secret={secret} orders={orders} loading={ordersLoading} onRefresh={() => fetchOrders()} />}
          {tab === "coupons"   && <CouponsPanel   secret={secret} />}
          {tab === "analytics" && <AnalyticsPanel orders={orders} />}
          {tab === "studio"    && <StudioPanel    secret={secret} />}
          {tab === "users"     && <UsersPanel     secret={secret} />}
          {tab === "wallets"    && <WalletsPanel    secret={secret} />}
          {tab === "plan-gates" && <PlanGatesPanel  secret={secret} />}
          {tab === "affiliates" && <AffiliatesPanel secret={secret} />}
        </div>
      </div>
    </div>
  );
}

// ── Plan Gates Panel ───────────────────────────────────────────────────────────

type ProductGate = { product_id: string; required_plan: PlanKey | null };

function PlanGatesPanel({ secret }: { secret: string }) {
  const [gates, setGates] = useState<ProductGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/product-gates", { headers: { "x-admin-secret": secret } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setGates(d); })
      .finally(() => setLoading(false));
  }, [secret]);

  const updateGate = async (productId: string, plan: PlanKey | null) => {
    setSaving(productId);
    try {
      await fetch("/api/admin/product-gates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ product_id: productId, required_plan: plan }),
      });
      setGates((prev) => {
        const existing = prev.find((g) => g.product_id === productId);
        if (existing) return prev.map((g) => g.product_id === productId ? { ...g, required_plan: plan } : g);
        return [...prev, { product_id: productId, required_plan: plan }];
      });
      setSaved(productId);
      setTimeout(() => setSaved(null), 1800);
    } catch { /* ignore */ }
    setSaving(null);
  };

  const planOptions: { value: PlanKey | null; label: string }[] = [
    { value: null, label: "All plans (free)" },
    ...PLAN_ORDER.filter((p) => p !== "free").map((p) => ({ value: p as PlanKey, label: `${p.charAt(0).toUpperCase() + p.slice(1)}+` })),
  ];

  const getGateForProduct = (id: string): PlanKey | null =>
    gates.find((g) => g.product_id === id)?.required_plan ??
    (PRODUCTS.find((p) => p.id === id)?.planRequired ?? null);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.03em" }}>Product Plan Gates</h2>
          <p className="text-sm text-ds-muted mt-1">Control which plan is required to access each product. Overrides the code default — changes take effect immediately.</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          {PRODUCTS.map((p, i) => {
            const current = getGateForProduct(p.id);
            const isSaving = saving === p.id;
            const isSaved = saved === p.id;
            return (
              <div key={p.id} className={`flex items-center gap-4 px-5 py-4 ${i < PRODUCTS.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ds-dark">{p.name}</p>
                  <p className="text-xs text-ds-muted">{p.gsm} · {p.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={current ?? ""}
                    disabled={isSaving}
                    onChange={(e) => updateGate(p.id, (e.target.value || null) as PlanKey | null)}
                    className="text-xs font-semibold border border-black/[0.08] rounded-lg px-2.5 py-1.5 bg-white text-ds-body focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50"
                  >
                    {planOptions.map((o) => (
                      <option key={String(o.value)} value={o.value ?? ""}>{o.label}</option>
                    ))}
                  </select>
                  {isSaving && <div className="w-4 h-4 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />}
                  {isSaved && (
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-ds-muted mt-4">
          Changes saved here override the default <code className="font-mono bg-zinc-100 px-1 rounded">planRequired</code> in code. Stored in the <code className="font-mono bg-zinc-100 px-1 rounded">product_plan_gates</code> Supabase table.
        </p>
      </div>
    </div>
  );
}

// ── Affiliates Panel ───────────────────────────────────────────────────────────

type AdminAffiliate = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  code: string;
  status: string;
  total_clicks: number;
  total_signups: number;
  total_earned: number;
  pending_payout: number;
  paid_out: number;
  website: string | null;
  social_handle: string | null;
  reason: string | null;
  created_at: string;
};

type AffiliateFilter = "all" | "pending" | "approved" | "rejected";

function AffiliatesPanel({ secret }: { secret: string }) {
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AffiliateFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliates", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      setAffiliates(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchAffiliates(); }, [secret]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (affiliateId: string, action: "approve" | "reject" | "pause") => {
    setActionLoading(`${affiliateId}-${action}`);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ affiliateId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setAffiliates((prev) =>
          prev.map((a) => a.id === affiliateId ? { ...a, status: data.affiliate.status } : a)
        );
      }
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const filtered = affiliates.filter((a) =>
    filter === "all" ? true : a.status === filter
  );

  const totalAffiliates = affiliates.length;
  const activeCount = affiliates.filter((a) => a.status === "approved").length;
  const totalPaidOut = affiliates.reduce((s, a) => s + Number(a.paid_out ?? 0), 0);
  const totalPending = affiliates.reduce((s, a) => s + Number(a.pending_payout ?? 0), 0);

  const FILTERS: { id: AffiliateFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-black/[0.06] bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.03em" }}>Affiliates</h2>
            <p className="text-sm text-ds-muted mt-0.5">Manage affiliate applications and track performance.</p>
          </div>
          <button
            onClick={fetchAffiliates}
            className="flex items-center gap-1.5 text-xs font-semibold text-ds-body hover:text-ds-dark transition-colors px-3 py-2 rounded-lg hover:bg-ds-light-gray"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Affiliates", val: String(totalAffiliates), accent: "text-ds-dark" },
            { label: "Active", val: String(activeCount), accent: "text-emerald-600" },
            { label: "Total Paid Out", val: `₹${totalPaidOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, accent: "text-blue-600" },
            { label: "Pending Payout", val: `₹${totalPending.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, accent: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-ds-light-gray rounded-2xl px-4 py-3">
              <p className={`text-xl font-semibold ${s.accent}`} style={{ letterSpacing: "-0.04em" }}>{s.val}</p>
              <p className="text-xs text-ds-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f.id
                  ? "bg-ds-dark text-white"
                  : "text-ds-body hover:bg-ds-light-gray"
              }`}
            >
              {f.label}
              {f.id !== "all" && (
                <span className="ml-1.5 text-[0.6rem]">
                  ({affiliates.filter((a) => a.status === f.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-semibold text-sm text-ds-body">No affiliates found</p>
            <p className="text-xs text-ds-muted mt-1">
              {filter === "all" ? "No affiliate applications yet." : `No ${filter} affiliates.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ds-light-gray border-b border-black/[0.06] sticky top-0">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-ds-muted">Affiliate</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ds-muted">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ds-muted">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-ds-muted">Clicks</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-ds-muted">Signups</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-ds-muted">Earned</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ds-muted">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ds-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {filtered.map((aff) => {
                  const statusColors: Record<string, string> = {
                    approved: "bg-emerald-50 text-emerald-700",
                    pending:  "bg-amber-50 text-amber-700",
                    rejected: "bg-red-50 text-red-600",
                    paused:   "bg-zinc-100 text-zinc-600",
                  };
                  return (
                    <tr key={aff.id} className="hover:bg-ds-light-gray transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-ds-dark text-sm">{aff.name}</p>
                        <p className="text-xs text-ds-muted">{aff.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <code className="text-xs font-mono bg-black/[0.04] px-2 py-1 rounded-lg">{aff.code}</code>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[aff.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                          {aff.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-ds-dark">
                        {(aff.total_clicks ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-ds-dark">
                        {(aff.total_signups ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">
                        ₹{Number(aff.total_earned ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ds-muted">
                        {new Date(aff.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {aff.status !== "approved" && (
                            <button
                              onClick={() => handleAction(aff.id, "approve")}
                              disabled={actionLoading === `${aff.id}-approve`}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `${aff.id}-approve` ? "…" : "Approve"}
                            </button>
                          )}
                          {aff.status === "approved" && (
                            <button
                              onClick={() => handleAction(aff.id, "pause")}
                              disabled={actionLoading === `${aff.id}-pause`}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-white text-xs font-bold hover:bg-amber-500 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `${aff.id}-pause` ? "…" : "Pause"}
                            </button>
                          )}
                          {aff.status !== "rejected" && (
                            <button
                              onClick={() => handleAction(aff.id, "reject")}
                              disabled={actionLoading === `${aff.id}-reject`}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `${aff.id}-reject` ? "…" : "Reject"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
