"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// ── Orders panel ──────────────────────────────────────────────────────────────

function OrdersPanel({ secret }: { secret: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [milestoneForm, setMilestoneForm] = useState({ title: "", description: "", status: "" });
  const [adding, setAdding] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-secret": secret } });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addMilestone = async () => {
    if (!selected || !milestoneForm.title) return;
    setAdding(true);
    await fetch("/api/admin/milestone", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ orderId: selected.id, orderRef: selected.ref, title: milestoneForm.title, description: milestoneForm.description, status: milestoneForm.status || undefined }),
    });
    setMilestoneForm({ title: "", description: "", status: "" });
    await fetchOrders();
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

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "orders" | "coupons";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    const saved = sessionStorage.getItem("hl_admin");
    if (saved) { setSecret(saved); setAuthed(true); }
  }, []);

  if (!authed) return <LoginScreen onAuth={(s) => { setSecret(s); setAuthed(true); }} />;

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
          <button onClick={() => { sessionStorage.removeItem("hl_admin"); setAuthed(false); }}
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
          {tab === "orders"  && <OrdersPanel  secret={secret} />}
          {tab === "coupons" && <CouponsPanel secret={secret} />}
        </div>
      </div>
    </div>
  );
}
