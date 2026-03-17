"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  "Order Placed",
  "Design Confirmed",
  "In Production",
  "Quality Check",
  "Shipped",
  "Delivered",
];

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":     "#9e6c9e",
  "Design Confirmed": "#9e6c9e",
  "In Production":    "#f15533",
  "Quality Check":    "#f15533",
  "Shipped":          "#2196F3",
  "Delivered":        "#4CAF50",
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

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: "", description: "", status: "" });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Check sessionStorage for saved secret
  useEffect(() => {
    const saved = sessionStorage.getItem("hl_admin");
    if (saved) { setSecret(saved); fetchOrders(saved); }
  }, []);

  const fetchOrders = async (s?: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-secret": s ?? secret } });
    if (res.status === 401) { setAuthError("Wrong password"); setLoading(false); return; }
    const data = await res.json();
    setOrders(data);
    setAuthed(true);
    sessionStorage.setItem("hl_admin", s ?? secret);
    setLoading(false);
  };

  const addMilestone = async () => {
    if (!selected || !milestoneForm.title) return;
    setAdding(true);
    await fetch("/api/admin/milestone", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({
        orderId: selected.id,
        orderRef: selected.ref,
        title: milestoneForm.title,
        description: milestoneForm.description,
        status: milestoneForm.status || undefined,
      }),
    });
    setMilestoneForm({ title: "", description: "", status: "" });
    await fetchOrders();
    // Refresh selected order
    const updated = orders.find((o) => o.id === selected.id);
    if (updated) setSelected(updated);
    setAdding(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.ref.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-halftone-dark flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 w-full max-w-sm">
          <div className="mb-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-halftone-purple mb-1">Halftone Labs</p>
            <h1 className="text-2xl" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Admin Dashboard</h1>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Admin Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold focus:outline-none focus:border-halftone-purple"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              />
            </div>
            {authError && <p className="text-sm font-bold text-red-500">{authError}</p>}
            <button
              onClick={() => fetchOrders()}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-halftone-dark text-white font-bold text-sm hover:opacity-80 transition-opacity"
            >
              {loading ? "Checking…" : "Enter →"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex flex-col">
      {/* Top bar */}
      <div className="bg-halftone-dark h-12 flex items-center px-6 gap-6 flex-shrink-0">
        <p className="text-white text-sm" style={{ fontWeight: 900, letterSpacing: "-0.04em" }}>Halftone Labs · Admin</p>
        <div className="flex gap-4 ml-auto">
          <span className="text-white/40 text-[0.75rem] font-bold">{orders.length} orders total</span>
          <button onClick={() => { sessionStorage.removeItem("hl_admin"); setAuthed(false); }} className="text-white/40 hover:text-white/70 text-[0.75rem] font-bold transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Orders list ── */}
        <div className="w-80 flex-shrink-0 bg-white border-r border-black/[0.05] flex flex-col">
          {/* Search + filter */}
          <div className="p-4 border-b border-black/[0.05] flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search orders, names, emails…"
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-[0.8rem] font-bold focus:outline-none focus:border-halftone-purple bg-halftone-light"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {["All", ...STATUS_OPTIONS].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className="px-2.5 py-1 rounded-full text-[0.6rem] font-bold whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: filterStatus === s ? "#0f0f0f" : "rgba(0,0,0,0.04)",
                    color: filterStatus === s ? "white" : "#6b7280",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="flex-1 overflow-y-auto">
            {filteredOrders.length === 0 && (
              <p className="text-center text-halftone-muted text-sm font-bold py-12">No orders found</p>
            )}
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="w-full text-left px-4 py-3.5 border-b border-black/[0.04] hover:bg-halftone-light transition-colors"
                style={{ background: selected?.id === order.id ? "#f9f5f9" : undefined }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ fontWeight: 900 }}>#{order.ref}</span>
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: (STATUS_COLORS[order.status] ?? "#9e6c9e") + "15", color: STATUS_COLORS[order.status] ?? "#9e6c9e" }}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[0.78rem] font-bold text-halftone-muted">{order.customer_name}</p>
                <p className="text-[0.7rem] font-bold text-halftone-muted mt-0.5">
                  {order.product_name} · ₹{order.total}
                </p>
                <p className="text-[0.62rem] font-bold text-halftone-muted/60 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Order detail ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-halftone-muted font-bold">
              ← Select an order to view details
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted">Order</p>
                    <h2 className="text-3xl" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>#{selected.ref}</h2>
                  </div>
                  <div className="px-4 py-2 rounded-full text-sm font-bold"
                    style={{ background: (STATUS_COLORS[selected.status] ?? "#9e6c9e") + "15", color: STATUS_COLORS[selected.status] ?? "#9e6c9e" }}>
                    {selected.status}
                  </div>
                </div>

                {/* Customer + product */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-black/[0.05]">
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">Customer</p>
                    <p className="text-sm font-bold">{selected.customer_name}</p>
                    <a href={`mailto:${selected.customer_email}`} className="text-[0.78rem] font-bold text-halftone-purple underline underline-offset-2">{selected.customer_email}</a>
                    <p className="text-[0.78rem] font-bold text-halftone-muted mt-0.5">{selected.customer_phone}</p>
                    <p className="text-[0.75rem] font-bold text-halftone-muted mt-2">{selected.address}, {selected.city} – {selected.pin}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-black/[0.05]">
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-2">Product</p>
                    {[
                      { l: "Item", v: selected.product_name },
                      { l: "Colour", v: selected.color },
                      { l: "Size", v: selected.size },
                      { l: "Print", v: selected.print_tier ? `${selected.print_tier} (${selected.print_dimensions})` : "None" },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex items-center justify-between py-0.5">
                        <span className="text-[0.7rem] text-halftone-muted font-bold">{l}</span>
                        <span className="text-[0.78rem] font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="bg-white rounded-2xl p-4 border border-black/[0.05]">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-3">Payment</p>
                  <div className="flex gap-4">
                    {[
                      { l: "Blank", v: `₹${selected.blank_price}` },
                      { l: "Print", v: `₹${selected.print_price}` },
                      { l: "Shipping", v: selected.shipping === 0 ? "Free" : `₹${selected.shipping}` },
                      { l: "Total", v: `₹${selected.total}`, bold: true },
                    ].map(({ l, v, bold }) => (
                      <div key={l} className="flex-1 bg-halftone-light rounded-xl p-3 text-center">
                        <p className="text-[0.58rem] font-bold uppercase tracking-widest text-halftone-muted">{l}</p>
                        <p className="text-sm mt-0.5" style={{ fontWeight: bold ? 900 : 700 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl p-5 border border-black/[0.05]">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-4">Timeline</p>
                  {selected.milestones.length === 0 && (
                    <p className="text-sm font-bold text-halftone-muted">No milestones yet.</p>
                  )}
                  {selected.milestones.map((m, i) => (
                    <div key={m.id} className="flex gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: "#9e6c9e" }} />
                        {i < selected.milestones.length - 1 && <div className="w-px flex-1 my-1" style={{ background: "rgba(158,108,158,0.2)", minHeight: 20 }} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{m.title}</p>
                        {m.description && <p className="text-[0.75rem] text-halftone-muted font-bold">{m.description}</p>}
                        <p className="text-[0.62rem] text-halftone-muted/60 font-bold mt-0.5">
                          {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add milestone form */}
                  <div className="mt-4 pt-4 border-t border-black/[0.05] flex flex-col gap-3">
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted">Add Update</p>

                    {/* Quick milestone buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {["Design Confirmed", "Printing Started", "Print Complete", "Packed", "Shipped", "Out for Delivery", "Delivered"].map((t) => (
                        <button key={t} onClick={() => setMilestoneForm({ ...milestoneForm, title: t })}
                          className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold border transition-all"
                          style={{
                            borderColor: milestoneForm.title === t ? "#9e6c9e" : "rgba(0,0,0,0.08)",
                            background: milestoneForm.title === t ? "#9e6c9e10" : "white",
                            color: milestoneForm.title === t ? "#9e6c9e" : "#6b7280",
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Or type a custom title…"
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-sm font-bold focus:outline-none focus:border-halftone-purple bg-halftone-light"
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Details for the customer (optional)"
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-sm font-bold focus:outline-none focus:border-halftone-purple bg-halftone-light"
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    />

                    {/* Status update */}
                    <select
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-sm font-bold focus:outline-none bg-halftone-light"
                      value={milestoneForm.status}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                    >
                      <option value="">Don&apos;t change order status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button
                      onClick={addMilestone}
                      disabled={adding || !milestoneForm.title}
                      className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: "#9e6c9e", fontWeight: 900 }}
                    >
                      {adding ? "Adding…" : "Add Update & Notify Customer →"}
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
