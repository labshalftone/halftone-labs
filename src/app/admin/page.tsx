"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

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
  courier: string | null;
  tracking_number: string | null;
  milestones: { id: string; title: string; description: string; created_at: string }[];
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${active ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"}`}>
      <span className={active ? "text-zinc-900" : "text-zinc-400"}>{icon}</span>
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="mb-6">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xs font-black">HL</span>
          </div>
          <h1 className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>Halftone Labs Admin</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to manage orders and coupons</p>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Admin Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={secret} onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50">
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
      className="flex-1 flex items-center justify-center gap-1 text-[0.65rem] font-semibold px-2 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50">
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

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !search || o.ref.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Order list */}
      <div className="w-80 flex-shrink-0 border-r border-zinc-200 flex flex-col bg-white">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
            <input type="text" placeholder="Search…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-full text-[0.6rem] font-bold whitespace-nowrap transition-all ${filterStatus === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {loading && <p className="text-center text-zinc-400 text-sm py-12">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="text-center text-zinc-400 text-sm py-12">No orders</p>}
          {filtered.map((order) => (
            <button key={order.id} onClick={() => setSelected(order)}
              className={`w-full text-left px-4 py-3.5 hover:bg-zinc-50 transition-colors ${selected?.id === order.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black text-zinc-900">#{order.ref}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-zinc-500 font-semibold">{order.customer_name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{order.product_name} · ₹{order.total.toLocaleString("en-IN")}</p>
              <p className="text-[0.65rem] text-zinc-300 mt-0.5">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Order detail */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        {!selected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-zinc-400">
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
                  <p className="text-xs text-zinc-400 font-semibold mb-0.5">Order</p>
                  <h2 className="text-3xl font-black" style={{ letterSpacing: "-0.05em" }}>#{selected.ref}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{new Date(selected.created_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-3">Customer</p>
                  <p className="font-bold text-zinc-900">{selected.customer_name}</p>
                  <a href={`mailto:${selected.customer_email}`} className="text-xs text-blue-600 hover:underline font-medium">{selected.customer_email}</a>
                  <p className="text-xs text-zinc-500 mt-0.5">{selected.customer_phone}</p>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{selected.address}, {selected.city} – {selected.pin}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-3">Product</p>
                  {[
                    { l: "Item", v: selected.product_name },
                    { l: "Colour", v: selected.color },
                    { l: "Size", v: selected.size },
                    { l: "Print", v: selected.print_tier ? `${selected.print_tier}` : "None" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex items-center justify-between py-0.5">
                      <span className="text-xs text-zinc-400 font-medium">{l}</span>
                      <span className="text-xs font-semibold text-zinc-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Payment Summary</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Blank", v: `₹${selected.blank_price.toLocaleString("en-IN")}` },
                    { l: "Print", v: `₹${selected.print_price.toLocaleString("en-IN")}` },
                    { l: "Shipping", v: selected.shipping === 0 ? "Free" : `₹${selected.shipping.toLocaleString("en-IN")}` },
                    { l: "Total", v: `₹${selected.total.toLocaleString("en-IN")}`, bold: true },
                  ].map(({ l, v, bold }) => (
                    <div key={l} className="bg-zinc-50 rounded-xl p-3 text-center">
                      <p className="text-[0.58rem] font-bold uppercase tracking-widest text-zinc-400">{l}</p>
                      <p className={`text-sm mt-0.5 ${bold ? "font-black text-zinc-900" : "font-semibold text-zinc-700"}`}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Shipping Info</p>

                {/* Show existing tracking if set */}
                {selected.courier && selected.tracking_number && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-widest text-blue-400 mb-0.5">Current tracking</p>
                      <p className="text-sm font-black text-blue-900">{selected.courier} · <span className="tracking-wider">{selected.tracking_number}</span></p>
                    </div>
                    <span className="text-[0.6rem] font-bold text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">Saved</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Courier</label>
                      <select
                        value={trackingForm.courier}
                        onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
                      >
                        <option value="">Select courier…</option>
                        {["Delhivery","Blue Dart","DTDC","Xpressbees","Ecom Express","Shadow Fax","Ekart","Shiprocket","Other"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 block mb-1">AWB / Tracking No.</label>
                      <input
                        type="text"
                        placeholder="e.g. 1234567890"
                        value={trackingForm.awb}
                        onChange={(e) => setTrackingForm({ ...trackingForm, awb: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
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

              {/* Print Files — always shown */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400">Print Files</p>
                  {(selected.front_design_url || selected.back_design_url) && (
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                      {[selected.front_design_url && "Front", selected.back_design_url && "Back"].filter(Boolean).join(" + ")} received
                    </span>
                  )}
                </div>
                {!(selected.front_design_url || selected.back_design_url || selected.mockup_url) ? (
                  <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No design files received for this order.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Placement mockup — shown large so printer can see position clearly */}
                    {selected.mockup_url && (
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 mb-2">Placement mockup</p>
                        <div className="flex gap-3 items-start">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selected.mockup_url} alt="Placement mockup"
                            className="w-48 h-auto rounded-xl border border-zinc-200 bg-zinc-50 object-contain" />
                          <div className="flex flex-col gap-1.5">
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[160px]">
                              Shows the customer&apos;s design position and scale on the garment.
                            </p>
                            <a href={selected.mockup_url} target="_blank" rel="noopener noreferrer"
                              className="text-center text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400 transition-colors text-zinc-600">
                              View full ↗
                            </a>
                            <DownloadButton url={selected.mockup_url} filename={`${selected.ref}-mockup.jpg`} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Raw design files */}
                    {(selected.front_design_url || selected.back_design_url) && (
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 mb-2">Raw design files (for print)</p>
                        <div className="flex gap-3 flex-wrap">
                          {([
                            { url: selected.front_design_url, label: "Front" },
                            { url: selected.back_design_url,  label: "Back"  },
                          ] as const).map(({ url, label }) => url && (
                            <div key={label} className="flex flex-col gap-2 p-3 rounded-xl border border-zinc-100 bg-zinc-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`${label} design`}
                                className="w-28 h-28 object-contain rounded-lg bg-white border border-zinc-100" />
                              <p className="text-[0.65rem] font-bold text-zinc-500 text-center">{label} print</p>
                              <div className="flex gap-1.5">
                                <a href={url} target="_blank" rel="noopener noreferrer"
                                  className="flex-1 text-center text-[0.65rem] font-semibold px-2 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400 transition-colors text-zinc-600">
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
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Order Timeline</p>
                {selected.milestones.length === 0 && (
                  <p className="text-xs text-zinc-400 font-medium mb-4">No updates yet.</p>
                )}
                {selected.milestones.map((m, i) => (
                  <div key={m.id} className="flex gap-3 mb-3 last:mb-0">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 flex-shrink-0" />
                      {i < selected.milestones.length - 1 && <div className="w-px flex-1 my-1 bg-zinc-200" style={{ minHeight: 18 }} />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-semibold text-zinc-900">{m.title}</p>
                      {m.description && <p className="text-xs text-zinc-500 mt-0.5">{m.description}</p>}
                      <p className="text-[0.62rem] text-zinc-300 mt-0.5">{new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}

                {/* Add update */}
                <div className="mt-5 pt-5 border-t border-zinc-100">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-zinc-400 mb-3">Add Update</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {["Design Confirmed","Printing Started","Print Complete","Packed","Shipped","Out for Delivery","Delivered"].map((t) => (
                      <button key={t} onClick={() => setMilestoneForm({ ...milestoneForm, title: t })}
                        className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${milestoneForm.title === t ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Or type a custom title…"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
                      value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} />
                    <input type="text" placeholder="Details for customer (optional)"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
                      value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} />
                    <select className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
                      value={milestoneForm.status} onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}>
                      <option value="">Don&apos;t change order status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={addMilestone} disabled={adding || !milestoneForm.title}
                      className="w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-40">
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
    <div className="flex-1 overflow-y-auto bg-zinc-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>Coupon Codes</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Create coupon
          </button>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900">New Coupon</h3>
                <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-zinc-700 text-xl leading-none">&times;</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Code *</label>
                  <input type="text" placeholder="SUMMER20" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 uppercase tracking-wider" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Description</label>
                  <input type="text" placeholder="Summer sale" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Discount Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "fixed" })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Discount Value *</label>
                  <input type="number" placeholder={form.discount_type === "percent" ? "20" : "100"} value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Min Order (₹)</label>
                  <input type="number" placeholder="0" value={form.min_order}
                    onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Max Uses (blank = unlimited)</label>
                  <input type="number" placeholder="100" value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Expiry Date (optional)</label>
                  <input type="date" value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
                <button onClick={createCoupon} disabled={saving || !form.code || !form.discount_value}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-40">
                  {saving ? "Creating…" : "Create Coupon →"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coupon list */}
        {loading && <p className="text-center text-zinc-400 text-sm py-12">Loading…</p>}
        {!loading && coupons.length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>
            <p className="font-semibold text-sm">No coupons yet</p>
            <p className="text-xs mt-1">Create your first coupon code above</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {coupons.map((c) => (
            <div key={c.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${c.active ? "border-zinc-200" : "border-zinc-100 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-zinc-900 tracking-wider text-lg" style={{ letterSpacing: "0.04em", fontFamily: "monospace" }}>{c.code}</span>
                    <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {c.active ? "ACTIVE" : "DISABLED"}
                    </span>
                    {c.expires_at && new Date(c.expires_at) < new Date() && (
                      <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">EXPIRED</span>
                    )}
                  </div>
                  {c.description && <p className="text-xs text-zinc-500 mb-2">{c.description}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-800">
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
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.active ? "bg-zinc-900" : "bg-zinc-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  {/* Delete */}
                  <button onClick={() => deleteCoupon(c.id)} disabled={deleting === c.id}
                    className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
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
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
      <p className="font-bold text-zinc-900 mb-4 text-sm">{label}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {(["left", "top", "width", "height"] as (keyof PrintZone)[]).map((field) => (
          <div key={field}>
            <label className="text-xs font-semibold text-zinc-500 block mb-1 capitalize">{field} %</label>
            <input
              type="number"
              step={0.1}
              value={zone[field]}
              onChange={(e) => onChange({ ...zone, [field]: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        ))}
      </div>
      {/* Visual preview — real product photo */}
      <div className="relative w-full overflow-hidden rounded-xl border border-zinc-100">
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

  const INPUT = "w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900";

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Sub-tab nav */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSubTab("products")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${subTab === "products" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
          >
            Products
          </button>
          <button
            onClick={() => setSubTab("zones")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${subTab === "zones" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
          >
            Print Zones
          </button>
        </div>

        {/* ── Products sub-section ── */}
        {subTab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>Studio Products</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{PRODUCTS.length + products.length} product{(PRODUCTS.length + products.length) !== 1 ? "s" : ""} ({PRODUCTS.length} built-in)</p>
              </div>
              <button
                onClick={openCreate}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors flex items-center gap-2"
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
                  className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-zinc-900">{editingId ? "Edit Product" : "New Product"}</h3>
                    <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-700 text-xl leading-none">&times;</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Name *</label>
                      <input type="text" placeholder="Classic Tee" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">GSM</label>
                      <input type="text" placeholder="220 GSM" value={form.gsm} onChange={(e) => setForm({ ...form, gsm: e.target.value })} className={INPUT} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Description</label>
                      <textarea rows={2} placeholder="Product description…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT + " resize-none"} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Blank Price (₹) *</label>
                      <input type="number" placeholder="599" value={form.blank_price} onChange={(e) => setForm({ ...form, blank_price: e.target.value })} className={INPUT} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Type</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "regular" | "oversized" | "baby" })} className={INPUT}>
                        <option value="regular">Regular</option>
                        <option value="oversized">Oversized</option>
                        <option value="baby">Baby</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Size Guide Key</label>
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
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${form.active ? "bg-zinc-900" : "bg-zinc-300"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                      <label className="text-xs font-semibold text-zinc-500">Active</label>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-zinc-500">Colors</label>
                      <button
                        type="button"
                        onClick={addColor}
                        className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Add color
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {form.colors.map((c, i) => (
                        <div key={i} className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input type="text" placeholder="Name (e.g. White)" value={c.name} onChange={(e) => updateColor(i, "name", e.target.value)} className={INPUT} />
                            <div className="flex items-center gap-2">
                              <input type="color" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-200 p-0.5 cursor-pointer" />
                              <input type="text" placeholder="#ffffff" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className={INPUT} />
                            </div>
                            <input type="text" placeholder="Mockup Front URL" value={c.mockupFront} onChange={(e) => updateColor(i, "mockupFront", e.target.value)} className={INPUT} />
                            <input type="text" placeholder="Mockup Back URL" value={c.mockupBack} onChange={(e) => updateColor(i, "mockupBack", e.target.value)} className={INPUT} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-zinc-500 font-medium cursor-pointer">
                              <input type="checkbox" checked={c.border} onChange={(e) => updateColor(i, "border", e.target.checked)} className="rounded" />
                              Show border
                            </label>
                            <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-400 hover:text-red-600 font-semibold">Remove</button>
                          </div>
                        </div>
                      ))}
                      {form.colors.length === 0 && (
                        <p className="text-xs text-zinc-300 text-center py-3">No colors added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={closeForm} className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={saveProduct} disabled={saving || !form.name || !form.blank_price} className="flex-1 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-40">
                      {saving ? "Saving…" : editingId ? "Update Product →" : "Create Product →"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product list */}
            {productsLoading && <p className="text-center text-zinc-400 text-sm py-12">Loading…</p>}
            {!productsLoading && (
              <div className="flex flex-col gap-3">
                {/* ── Built-in (hardcoded) products ── */}
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 px-1">Built-in products</p>
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-zinc-900 text-base" style={{ letterSpacing: "-0.02em" }}>{p.name}</span>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">BUILT-IN</span>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                          {p.gsm && <span className="font-mono">{p.gsm}</span>}
                          <span className="font-semibold text-zinc-800">₹{p.blankPrice.toLocaleString("en-IN")}</span>
                          <span className="capitalize">{p.id.includes("oversized") ? "oversized" : p.id.includes("baby") ? "baby" : "regular"}</span>
                          <span>{p.colors.length} color{p.colors.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <span className="text-[0.65rem] text-zinc-400 font-medium self-center">Defined in code</span>
                    </div>
                  </div>
                ))}

                {/* ── DB products ── */}
                {products.length > 0 && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-400 px-1 mt-2">Custom products</p>
                )}
                {products.map((p) => (
                  <div key={p.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${p.active ? "border-zinc-200" : "border-zinc-100 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-zinc-900 text-base" style={{ letterSpacing: "-0.02em" }}>{p.name}</span>
                          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                            {p.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                          {p.gsm && <span className="font-mono">{p.gsm}</span>}
                          <span className="font-semibold text-zinc-800">₹{p.blank_price.toLocaleString("en-IN")}</span>
                          <span className="capitalize">{p.type}</span>
                          {p.colors?.length > 0 && <span>{p.colors.length} color{p.colors.length !== 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleActive(p.id, !p.active)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.active ? "bg-zinc-900" : "bg-zinc-300"}`}>
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${p.active ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <p className="text-xs text-zinc-400 text-center py-4">No custom products yet — create one above</p>
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
                <h2 className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>Print Zone Calibration</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Adjust the print zone position and size for each garment type</p>
              </div>
              <button
                onClick={saveZones}
                disabled={zonesSaving}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-40"
              >
                {zonesSaving ? "Saving…" : zonesSaved ? "Saved ✓" : "Save Zones"}
              </button>
            </div>
            {zonesLoading ? (
              <p className="text-center text-zinc-400 text-sm py-12">Loading…</p>
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
    { label: "Total Revenue",    value: `₹${totalRevenue.toLocaleString("en-IN")}`, accent: "text-orange-600" },
    { label: "Total Orders",     value: String(totalOrders),                         accent: "text-blue-600" },
    { label: "Avg Order Value",  value: `₹${avgOrderValue.toLocaleString("en-IN")}`, accent: "text-violet-600" },
    { label: "Delivered",        value: String(delivered),                            accent: "text-green-600" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>Analytics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">All-time overview · {totalOrders} order{totalOrders !== 1 ? "s" : ""}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
              <p className={`text-2xl font-black ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Orders by Status</p>
          <div className="flex flex-col gap-3">
            {STATUS_OPTIONS.map((status) => {
              const count = statusCounts[status] ?? 0;
              const pct   = Math.round((count / maxStatusCount) * 100);
              const c     = STATUS_COLORS[status] ?? { bg: "#f3f4f6", text: "#374151" };
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-600 w-36 flex-shrink-0">{status}</span>
                  <div className="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: c.text }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-700 w-6 text-right flex-shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Last 7 days revenue */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Revenue — Last 7 Days</p>
          <div className="flex items-end gap-2 h-28">
            {dayEntries.map(([day, rev]) => {
              const pct = Math.round((rev / maxDayRev) * 100);
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[0.55rem] font-bold text-zinc-500">{rev > 0 ? `₹${(rev / 1000).toFixed(1)}k` : ""}</span>
                  <div className="w-full bg-zinc-100 rounded-md overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full bg-orange-400 rounded-md transition-all duration-500"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-[0.55rem] text-zinc-400 font-medium text-center leading-tight">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-4">Top Products</p>
          {topProducts.length === 0 ? (
            <p className="text-sm text-zinc-400">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map(([name, count]) => {
                const pct = Math.round((count / maxProductCount) * 100);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-600 w-40 flex-shrink-0 truncate">{name}</span>
                    <div className="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-700 w-6 text-right flex-shrink-0">{count}</span>
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

type Tab = "orders" | "coupons" | "analytics" | "studio";

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
      id: "studio",
      label: "Studio",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top nav bar */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center px-5 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[0.6rem] font-black">HL</span>
          </div>
          <span className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.03em" }}>Halftone Labs</span>
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-sm text-zinc-500 font-semibold">Admin</span>
        </div>
        <div className="ml-auto">
          <button onClick={() => { sessionStorage.removeItem("hl_admin"); setAuthed(false); setOrders([]); }}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-white border-r border-zinc-200 p-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <SidebarItem key={n.id} icon={n.icon} label={n.label} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
          <div className="mt-auto pt-4 border-t border-zinc-100">
            <p className="text-[0.6rem] font-semibold text-zinc-300 px-3">ADMIN v1.0</p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {tab === "orders"    && <OrdersPanel    secret={secret} orders={orders} loading={ordersLoading} onRefresh={() => fetchOrders()} />}
          {tab === "coupons"   && <CouponsPanel   secret={secret} />}
          {tab === "analytics" && <AnalyticsPanel orders={orders} />}
          {tab === "studio"    && <StudioPanel    secret={secret} />}
        </div>
      </div>
    </div>
  );
}
