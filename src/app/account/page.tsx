"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Order Placed":     { bg: "#f3f0ff", text: "#7c3aed", dot: "#7c3aed" },
  "Design Confirmed": { bg: "#f3f0ff", text: "#7c3aed", dot: "#7c3aed" },
  "In Production":    { bg: "#fff7ed", text: "#ea580c", dot: "#ea580c" },
  "Quality Check":    { bg: "#fff7ed", text: "#ea580c", dot: "#ea580c" },
  "Shipped":          { bg: "#eff6ff", text: "#2563eb", dot: "#2563eb" },
  "Delivered":        { bg: "#f0fdf4", text: "#16a34a", dot: "#16a34a" },
};

type Order = {
  id: string; ref: string; product_name: string; color: string; size: string;
  print_tier: string; total: number; status: string; created_at: string;
  milestones: { id: string; title: string; description: string; created_at: string }[];
};

type ActiveTab = "dashboard" | "orders" | "designs" | "branding" | "stores" | "settings";

const NAV: { id: ActiveTab; label: string; badge?: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { id: "orders", label: "Orders", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )},
  { id: "designs", label: "Designs", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )},
  { id: "branding", label: "Branding", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )},
  { id: "stores", label: "Stores", badge: "Soon", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )},
  { id: "settings", label: "Account Settings", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
];

// ── Dashboard Overview ────────────────────────────────────────────────────────
function DashboardTab({ orders, user, onTab }: {
  orders: Order[];
  user: { id: string; email: string; user_metadata: { name?: string } } | null;
  onTab: (t: ActiveTab) => void;
}) {
  const active    = orders.filter((o) => !["Delivered"].includes(o.status));
  const delivered = orders.filter((o) => o.status === "Delivered");

  const STEPS = [
    { n: 1, title: "Place your first order",  desc: "Choose a product, upload your design, and customise it in Studio.", done: orders.length > 0,                       cta: "Go to Studio →",   href: "/studio" },
    { n: 2, title: "Track your order",         desc: "Follow real-time milestones from print to doorstep.",             done: active.length > 0 || delivered.length > 0, cta: "Track order →",    href: "/track" },
    { n: 3, title: "Connect your store",       desc: "Link your Shopify store to automate fulfilment at scale.",        done: false,                                      cta: "Coming soon",      href: "#" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>
          👋 Welcome, {user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "there"}
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Here&apos;s a quick look at your Halftone Labs account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STEPS.map((step, i) => (
          <motion.div key={step.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border p-5 relative overflow-hidden ${step.done ? "border-green-200 bg-green-50" : "border-zinc-200 bg-white"}`}>
            {step.done && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Step {step.n}</p>
            <h3 className="font-black text-zinc-900 text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{step.desc}</p>
            {step.href === "#" ? (
              <span className="text-xs font-semibold text-zinc-400">{step.cta}</span>
            ) : (
              <Link href={step.href} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">{step.cta}</Link>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total orders", val: orders.length },
          { label: "Active",       val: active.length },
          { label: "Delivered",    val: delivered.length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 px-5 py-4">
            <p className="text-3xl font-black text-zinc-900">{s.val}</p>
            <p className="text-xs text-zinc-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {orders.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-zinc-900">Recent orders</h3>
            <button onClick={() => onTab("orders")} className="text-xs font-bold text-orange-500 hover:text-orange-600">View all →</button>
          </div>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 3).map((o) => {
              const sc = STATUS_COLORS[o.status] ?? STATUS_COLORS["Order Placed"];
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-zinc-100 flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">👕</div>
                    <div>
                      <p className="font-black text-sm text-zinc-900">#{o.ref}</p>
                      <p className="text-xs text-zinc-400">{o.product_name} · {o.color} · {o.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{o.status}</span>
                    <p className="font-black text-sm">₹{o.total}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-black text-zinc-900 mb-2">No orders yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Head to Studio to design and order your first custom tee.</p>
          <Link href="/studio" className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Open Studio →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orders, user }: { orders: Order[]; user: { id: string; email: string; user_metadata: { name?: string } } | null }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter]     = useState("All");

  const statuses = ["All", "Order Placed", "In Production", "Shipped", "Delivered"];
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Orders</h2>
        <Link href="/studio" className="px-4 py-2 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">+ New Order</Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 rounded-2xl">
          <p className="text-zinc-400 font-bold">No orders {filter !== "All" ? `with status "${filter}"` : "yet"}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => {
            const sc     = STATUS_COLORS[order.status] ?? STATUS_COLORS["Order Placed"];
            const isOpen = selected?.id === order.id;
            return (
              <motion.div key={order.id} layout className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <button className="w-full text-left px-5 py-4 hover:bg-zinc-50 transition-colors" onClick={() => setSelected(isOpen ? null : order)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">👕</div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-black text-sm text-zinc-900">#{order.ref}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{order.status}</span>
                        </div>
                        <p className="text-xs text-zinc-400">{order.product_name} · {order.color} · Size {order.size}</p>
                        <p className="text-[10px] text-zinc-300 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-sm">₹{order.total.toLocaleString("en-IN")}</p>
                      <svg className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-zinc-100">
                      <div className="px-5 py-5 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Order Timeline</p>
                          {order.milestones.length === 0 ? (
                            <p className="text-xs text-zinc-400">No updates yet.</p>
                          ) : (
                            order.milestones.map((m, i) => (
                              <div key={m.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: sc.dot }} />
                                  {i < order.milestones.length - 1 && <div className="w-px flex-1 my-1 bg-zinc-200" style={{ minHeight: 16 }} />}
                                </div>
                                <div className="pb-3">
                                  <p className="text-sm font-bold text-zinc-800">{m.title}</p>
                                  {!!m.description && <p className="text-xs text-zinc-500">{String(m.description)}</p>}
                                  <p className="text-[10px] text-zinc-400 mt-0.5">
                                    {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:w-40">
                          <Link href={`/track?ref=${order.ref}&email=${user?.email ?? ""}`}
                            className="text-center px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-700 transition-colors">
                            Full tracking →
                          </Link>
                          <Link href="/studio"
                            className="text-center px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                            Order again
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Design type ───────────────────────────────────────────────────────────────
type Design = {
  id: string; name: string; product_id: string; product_name: string; gsm: string;
  color_name: string; color_hex: string; size: string; print_tier: string | null;
  blank_price: number; print_price: number; has_design: boolean; thumbnail: string | null; created_at: string;
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// ── Add-to-Cart Modal ─────────────────────────────────────────────────────────
function AddToCartModal({ design, onClose }: { design: Design; onClose: () => void }) {
  const { addItem } = useCart();
  const [qty,  setQty]  = useState(1);
  const [size, setSize] = useState(design.size || "M");
  const [side, setSide] = useState<"front" | "back" | "both">("front");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId:    design.product_id || "custom",
      productName:  design.product_name,
      gsm:          design.gsm,
      color:        design.color_name,
      colorHex:     design.color_hex,
      size,
      qty,
      side,
      blankPrice:   design.blank_price,
      printPrice:   effectivePrint,
      printTier:    design.print_tier ?? "",
      printDims:    "",
      hasDesign:    design.has_design,
      designDataUrl: design.thumbnail ?? "",
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 900);
  };

  const effectivePrint = side === "both" ? design.print_price * 2 : design.print_price;
  const unitPrice = design.blank_price + effectivePrint;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 shadow-2xl z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-black text-zinc-900 text-lg" style={{ letterSpacing: "-0.03em" }}>Add to Cart</h3>
            <p className="text-sm text-zinc-400">{design.name} · {design.product_name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500 text-lg leading-none">&times;</button>
        </div>

        {/* Size picker */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">Size</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Print side */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">Print side</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: "front", label: "Front only" },
              { val: "back",  label: "Back only" },
              { val: "both",  label: "Both sides" },
            ] as const).map(({ val, label }) => (
              <button key={val} onClick={() => setSide(val)}
                className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${side === val ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {label}
                {val === "both" && <span className="block text-[9px] font-normal opacity-70">2× print</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">Quantity</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-full border-2 border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-zinc-400 transition-colors font-bold text-lg leading-none">−</button>
              <span className="text-xl font-black w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-full border-2 border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-zinc-400 transition-colors font-bold text-lg leading-none">+</button>
            </div>
            <p className="text-sm text-zinc-500">
              ₹{(unitPrice * qty).toLocaleString("en-IN")} total
            </p>
          </div>
        </div>

        <button onClick={handleAdd}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
          {added ? "✓ Added to cart!" : `Add ${qty} × ${size} to cart →`}
        </button>
      </motion.div>
    </div>
  );
}

// ── Designs Tab ────────────────────────────────────────────────────────────────
function DesignsTab({ userId, email }: { userId: string | null; email: string | null }) {
  const [designs,    setDesigns]    = useState<Design[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [cartDesign, setCartDesign] = useState<Design | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    else if (email) params.set("email", email);
    fetch(`/api/designs?${params}`)
      .then((r) => r.json())
      .then((d) => setDesigns(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [userId, email]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/designs?id=${id}`, { method: "DELETE" });
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Designs</h2>
        <Link href="/studio" className="px-4 py-2 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">+ New Design</Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
          <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          Loading designs…
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-14 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-black text-zinc-900 mb-2">No saved designs yet</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
            When you configure a product in Studio, hit <strong>&quot;Save design to account&quot;</strong> — it&apos;ll appear here.
          </p>
          <Link href="/studio" className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Open Studio →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((d) => (
            <motion.div key={d.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 hover:shadow-sm transition-all">
              {/* Thumbnail */}
              <div className="h-36 flex items-center justify-center relative" style={{ background: d.color_hex || "#f4f4f5" }}>
                {d.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbnail} alt={d.name} className="w-24 h-24 object-contain drop-shadow-md" />
                ) : (
                  <div className="text-4xl opacity-40">👕</div>
                )}
                {d.has_design && (
                  <span className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/80 text-zinc-600 backdrop-blur-sm">
                    Custom print
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="px-4 py-4">
                <p className="font-black text-sm text-zinc-900 truncate">{d.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{d.product_name} · {d.color_name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">Size {d.size}</span>
                  {d.print_tier && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500">{d.print_tier}</span>}
                  {d.has_design && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">DTG Print</span>}
                </div>
                <p className="text-xs font-bold text-zinc-900 mt-2">₹{(d.blank_price + d.print_price).toLocaleString("en-IN")} /unit</p>
                <p className="text-[10px] text-zinc-300 mt-0.5">
                  Saved {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setCartDesign(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-700 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button onClick={() => handleDelete(d.id)} disabled={deleting === d.id}
                    className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete design">
                    {deleting === d.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {cartDesign && <AddToCartModal design={cartDesign} onClose={() => setCartDesign(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Branding Tab ──────────────────────────────────────────────────────────────
function BrandingTab({ userId, email }: { userId: string | null; email: string | null }) {
  const [darkLabel,  setDarkLabel]  = useState<string | null>(null);
  const [lightLabel, setLightLabel] = useState<string | null>(null);
  const [saving, setSaving]  = useState(false);
  const [saved,  setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  const darkRef  = useRef<HTMLInputElement>(null);
  const lightRef = useRef<HTMLInputElement>(null);

  // Load existing branding
  useEffect(() => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    else if (email) params.set("email", email);
    else { setLoading(false); return; }
    fetch(`/api/branding?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          if (d.dark_label)  setDarkLabel(d.dark_label);
          if (d.light_label) setLightLabel(d.light_label);
        }
      })
      .finally(() => setLoading(false));
  }, [userId, email]);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, which: "dark" | "light") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await readFile(file);
    if (which === "dark") setDarkLabel(b64);
    else setLightLabel(b64);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customerEmail: email,
          darkLabelBase64:  darkLabel,
          lightLabelBase64: lightLabel,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
        <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
        Loading branding…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Branding</h2>
        <p className="text-zinc-500 text-sm mt-1">Upload your custom neck labels. These will be printed inside your garments via DTF label transfer.</p>
      </div>

      {/* DTF Neck Labels section */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-zinc-900">DTF Neck Labels</h3>
            <p className="text-xs text-zinc-400">Upload a dark version (for light garments) and a light version (for dark garments)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Dark label */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Dark label <span className="text-zinc-300 normal-case font-normal">(for light garments)</span></p>
            <div
              onClick={() => darkRef.current?.click()}
              className="relative border-2 border-dashed border-zinc-200 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all overflow-hidden"
              style={{ background: "#fafafa" }}>
              {darkLabel ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={darkLabel} alt="Dark label" className="max-h-32 max-w-full object-contain p-3" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-zinc-400 font-medium">Click to upload PNG</p>
                  <p className="text-[10px] text-zinc-300 mt-0.5">Transparent background recommended</p>
                </>
              )}
              {darkLabel && (
                <button onClick={(e) => { e.stopPropagation(); setDarkLabel(null); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors text-sm leading-none">
                  ×
                </button>
              )}
            </div>
            <input ref={darkRef} type="file" accept="image/png,image/webp,image/jpeg" className="hidden" onChange={(e) => handleFile(e, "dark")} />
          </div>

          {/* Light label */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Light label <span className="text-zinc-300 normal-case font-normal">(for dark garments)</span></p>
            <div
              onClick={() => lightRef.current?.click()}
              className="relative border-2 border-dashed border-zinc-200 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 transition-all overflow-hidden"
              style={{ background: "#1a1a1a" }}>
              {lightLabel ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lightLabel} alt="Light label" className="max-h-32 max-w-full object-contain p-3" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-zinc-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-zinc-500 font-medium">Click to upload PNG</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Transparent background recommended</p>
                </>
              )}
              {lightLabel && (
                <button onClick={(e) => { e.stopPropagation(); setLightLabel(null); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors text-sm leading-none">
                  ×
                </button>
              )}
            </div>
            <input ref={lightRef} type="file" accept="image/png,image/webp,image/jpeg" className="hidden" onChange={(e) => handleFile(e, "light")} />
          </div>
        </div>

        {/* Info note */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-orange-700 font-semibold">💡 Neck label specs</p>
          <p className="text-xs text-orange-600 mt-0.5">Upload PNG files with transparent backgrounds. Recommended size: 600×600px or larger. Labels are printed on a 2×2 inch DTF transfer and applied inside the collar during fulfilment.</p>
        </div>

        <button onClick={handleSave} disabled={saving || (!darkLabel && !lightLabel)}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"} disabled:opacity-40 disabled:cursor-not-allowed`}>
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save branding"}
        </button>
      </div>

      {/* Coming soon: more branding options */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 max-w-2xl opacity-60">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Coming soon</p>
        <h3 className="font-black text-zinc-900 mb-1">More branding options</h3>
        <p className="text-sm text-zinc-500">Hang tags, poly mailer branding, and custom tissue paper coming later this year.</p>
      </div>
    </div>
  );
}

// ── Stores Tab ─────────────────────────────────────────────────────────────────
function StoresTab() {
  return (
    <div>
      <h2 className="text-2xl font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.04em" }}>Stores</h2>
      <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-14 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <h3 className="font-black text-zinc-900 mb-2">Shopify integration coming soon</h3>
        <p className="text-zinc-500 text-sm mb-4 max-w-sm mx-auto">
          Connect your Shopify store and we&apos;ll automatically fulfil orders placed there — print, pack, and ship directly to your customers.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          In development · Get notified
        </div>
        <div className="mt-4">
          <a href="mailto:hello@halftonelabs.in?subject=Shopify Integration Waitlist" className="text-sm font-bold text-orange-500 hover:underline">
            Join the waitlist →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ───────────────────────────────────────────────────────────────
function SettingsTab({
  user, onSignOut, userId, email,
}: {
  user: { id: string; email: string; user_metadata: { name?: string } } | null;
  onSignOut: () => void;
  userId: string | null;
  email: string | null;
}) {
  const [addr, setAddr]       = useState({ name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pin: "", country: "IN" });
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    else if (email) params.set("email", email);
    else { setLoadingAddr(false); return; }
    fetch(`/api/profile?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setAddr({
            name:         d.name          ?? "",
            phone:        d.phone         ?? "",
            address_line1: d.address_line1 ?? "",
            address_line2: d.address_line2 ?? "",
            city:         d.city          ?? "",
            state:        d.state         ?? "",
            pin:          d.pin           ?? "",
            country:      d.country       ?? "IN",
          });
        }
      })
      .finally(() => setLoadingAddr(false));
  }, [userId, email]);

  const handleSaveAddr = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customerEmail: email,
          name:         addr.name,
          phone:        addr.phone,
          addressLine1: addr.address_line1,
          addressLine2: addr.address_line2,
          city:         addr.city,
          state:        addr.state,
          pin:          addr.pin,
          country:      addr.country,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <div>
      <h2 className="text-2xl font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.04em" }}>Account Settings</h2>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100 max-w-lg mb-6">
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Name</p>
          <p className="font-bold text-zinc-900">{user?.user_metadata?.name ?? "—"}</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Email</p>
          <p className="font-bold text-zinc-900">{user?.email}</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Password</p>
          <p className="text-sm text-zinc-500">To reset your password, sign out and use &quot;Forgot password&quot; on the login page.</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Support</p>
          <a href="mailto:hello@halftonelabs.in" className="text-sm font-bold text-orange-500 hover:underline">hello@halftonelabs.in</a>
        </div>
        <div className="px-6 py-5">
          <button onClick={onSignOut} className="px-5 py-2.5 rounded-full border-2 border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Default shipping address */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-zinc-900">Default Shipping Address</h3>
            <p className="text-xs text-zinc-400">Pre-filled at checkout for faster ordering</p>
          </div>
        </div>

        {loadingAddr ? (
          <div className="flex items-center gap-2 text-sm text-zinc-400 py-4">
            <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            Loading address…
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Full name</label>
                <input className={inputCls} placeholder="Your name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Phone</label>
                <input className={inputCls} placeholder="+91 98765 43210" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Address line 1</label>
              <input className={inputCls} placeholder="Flat / House no, Building" value={addr.address_line1} onChange={(e) => setAddr({ ...addr, address_line1: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Address line 2 <span className="text-zinc-300 normal-case">(optional)</span></label>
              <input className={inputCls} placeholder="Street, Area, Landmark" value={addr.address_line2} onChange={(e) => setAddr({ ...addr, address_line2: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">City</label>
                <input className={inputCls} placeholder="Mumbai" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">State</label>
                <input className={inputCls} placeholder="Maharashtra" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">PIN</label>
                <input className={inputCls} placeholder="400001" value={addr.pin} onChange={(e) => setAddr({ ...addr, pin: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Country</label>
              <select className={inputCls} value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })}>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
              </select>
            </div>
            <button onClick={handleSaveAddr} disabled={saving}
              className={`mt-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"} disabled:opacity-50`}>
              {saving ? "Saving…" : saved ? "✓ Address saved!" : "Save default address"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const { count } = useCart();
  const [user,        setUser]        = useState<{ id: string; email: string; user_metadata: { name?: string } } | null>(null);
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<ActiveTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user as typeof user);
      const res = await fetch(`/api/account/orders?email=${encodeURIComponent(session.user.email ?? "")}&userId=${session.user.id}`);
      if (res.ok) setOrders(await res.json());
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Loading your account…</p>
        </div>
      </div>
    );
  }

  const initials = (user?.user_metadata?.name ?? user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 w-64 bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="px-6 h-16 flex items-center border-b border-zinc-100">
          <Link href="/" className="text-base font-black text-zinc-900" style={{ letterSpacing: "-0.05em" }}>
            Halftone Labs
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === item.id ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="px-4 py-4 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">{user?.user_metadata?.name ?? "Account"}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-zinc-100 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-black text-zinc-900 capitalize">
              {activeTab === "dashboard" ? "Dashboard" : NAV.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/studio"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </Link>

            {/* Cart icon */}
            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors">
              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center px-1 leading-none">
                  {count}
                </span>
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-black">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {activeTab === "dashboard" && <DashboardTab orders={orders} user={user} onTab={setActiveTab} />}
              {activeTab === "orders"    && <OrdersTab orders={orders} user={user} />}
              {activeTab === "designs"   && <DesignsTab userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "branding"  && <BrandingTab userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "stores"    && <StoresTab />}
              {activeTab === "settings"  && <SettingsTab user={user} onSignOut={handleSignOut} userId={user?.id ?? null} email={user?.email ?? null} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
