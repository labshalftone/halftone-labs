"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import { useCurrency, CURRENCY_META, type Currency } from "@/lib/currency-context";
import { PRODUCTS } from "@/lib/products";

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
  print_tier: string; print_dimensions?: string; blank_price?: number; print_price?: number;
  total: number; status: string; created_at: string;
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
  { id: "stores", label: "Stores", icon: (
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
  const { addItem } = useCart();

  const handleReorder = (order: Order) => {
    addItem({
      productId:       "reorder",
      productName:     order.product_name,
      gsm:             "",
      color:           order.color,
      colorHex:        "#111111",
      size:            order.size,
      qty:             1,
      frontDesignUrl:  "",
      backDesignUrl:   "",
      frontPrintPrice: 0,
      backPrintPrice:  0,
      frontPrintTier:  order.print_tier ?? "",
      backPrintTier:   "",
      printDims:       order.print_dimensions ?? "",
      printTechnique:  "none",
      blankPrice:      order.blank_price ?? 0,
    });
  };

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
                          <button onClick={() => handleReorder(order)} className="text-center px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-50 transition-colors">
                            Reorder ↻
                          </button>
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

// ── Add-to-Cart Modal ─────────────────────────────────────────────────────────
function AddToCartModal({ design, onClose }: { design: Design; onClose: () => void }) {
  const { addItem } = useCart();
  const [qty,   setQty]   = useState(1);
  const [size,  setSize]  = useState(design.size || "M");
  const [added, setAdded] = useState(false);

  // Look up the product's actual sizes; fall back to a sensible default set
  const product   = PRODUCTS.find((p) => p.id === design.product_id);
  const sizeList  = product?.sizes ?? ["S", "M", "L", "XL", "2XL"];

  // Make sure the initially selected size is valid for this product
  const validSize = sizeList.includes(size) ? size : (sizeList.includes(design.size) ? design.size : sizeList[1] ?? sizeList[0]);

  const unitPrice = design.blank_price + design.print_price;

  const handleAdd = () => {
    addItem({
      productId:        design.product_id || "custom",
      productName:      design.product_name,
      gsm:              design.gsm,
      color:            design.color_name,
      colorHex:         design.color_hex,
      size:             validSize,
      qty,
      frontDesignUrl:   design.has_design ? (design.thumbnail ?? "") : "",
      backDesignUrl:    "",
      frontPrintPrice:  design.has_design ? design.print_price : 0,
      backPrintPrice:   0,
      frontPrintTier:   design.print_tier ?? "",
      backPrintTier:    "",
      printDims:        "",
      printTechnique:   design.has_design ? "DTG" : "none",
      blankPrice:       design.blank_price,
      thumbnail:        design.thumbnail ?? "",
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 shadow-2xl z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-black text-zinc-900 text-lg" style={{ letterSpacing: "-0.03em" }}>Add to Cart</h3>
            <p className="text-sm text-zinc-400">{design.name} · {design.product_name} · {design.color_name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500 text-lg leading-none">&times;</button>
        </div>

        {/* Size picker — uses actual product sizes */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizeList.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${validSize === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
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
            <p className="text-sm text-zinc-500">₹{(unitPrice * qty).toLocaleString("en-IN")} total</p>
          </div>
        </div>

        {/* Print summary — read-only, no side picker */}
        {design.has_design && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="text-zinc-500 text-xs">Print · {design.print_tier ?? "Custom"}</span>
            <span className="font-black text-orange-600">+₹{design.print_price.toLocaleString("en-IN")}</span>
          </div>
        )}

        <button onClick={handleAdd}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
          {added ? "✓ Added to cart!" : `Add ${qty} × ${validSize} to cart — ₹${(unitPrice * qty).toLocaleString("en-IN")} →`}
        </button>
      </motion.div>
    </div>
  );
}

// ── Designs Tab ────────────────────────────────────────────────────────────────
function downloadThumbnail(thumbnail: string, name: string) {
  // thumbnail is a data URL (jpeg) — convert to blob and trigger download
  const a = document.createElement("a");
  a.href = thumbnail;
  a.download = `${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-mockup.jpg`;
  a.click();
}

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
              <div className="h-40 flex items-center justify-center relative overflow-hidden group/thumb" style={{ background: d.thumbnail ? "#ffffff" : (d.color_hex || "#f4f4f5") }}>
                {d.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl opacity-40">👕</div>
                )}
                {d.has_design && (
                  <span className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/80 text-zinc-600 backdrop-blur-sm">
                    Custom print
                  </span>
                )}
                {/* Download overlay — appears on hover if thumbnail exists */}
                {d.thumbnail && (
                  <button
                    onClick={() => downloadThumbnail(d.thumbnail!, d.name)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity backdrop-blur-[2px]"
                    title="Download mockup"
                  >
                    <svg className="w-6 h-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span className="text-white text-[10px] font-bold drop-shadow">Download mockup</span>
                  </button>
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
                  {d.thumbnail && (
                    <button
                      onClick={() => downloadThumbnail(d.thumbnail!, d.name)}
                      className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
                      title="Download mockup">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  )}
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

const STORE_CATALOG = [
  {
    id: "regular-tee", name: "Regular Tee", gsm: "180 GSM",
    costPrice: 400,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: [
      { name: "White",  hex: "#FFFFFF" },
      { name: "Black",  hex: "#111111" },
      { name: "Navy",   hex: "#1B2A4A" },
      { name: "Maroon", hex: "#6B2D2D" },
    ],
  },
  {
    id: "oversized-tee-sj", name: "Oversized Tee (SJ)", gsm: "220 GSM",
    costPrice: 500,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#111111" },
    ],
  },
  {
    id: "oversized-tee-ft", name: "Oversized Tee (FT)", gsm: "240 GSM",
    costPrice: 600,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Black",      hex: "#111111" },
      { name: "White",      hex: "#FFFFFF" },
      { name: "Royal Blue", hex: "#2355C0" },
      { name: "Baby Pink",  hex: "#F5C2C7" },
      { name: "Red",        hex: "#C0392B" },
    ],
  },
  {
    id: "baby-tee", name: "Baby Tee", gsm: "180 GSM",
    costPrice: 380,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White",     hex: "#FFFFFF" },
      { name: "Black",     hex: "#111111" },
      { name: "Baby Pink", hex: "#F5C2C7" },
      { name: "Lavender",  hex: "#C9B8E8" },
    ],
  },
];

type ArtistStore = {
  id: string; handle: string; artist_name: string;
  description: string | null; instagram: string | null; active: boolean;
};
type StoreProductRow = {
  id: string; product_id: string; product_name: string;
  color_hex: string; color_name: string; sizes: string[];
  retail_price_inr: number; cost_price_inr: number;
  description: string | null; image_url: string | null;
  design_front_url: string | null; design_back_url: string | null;
  print_technique: string;
};

// ── Tee preview for store configurator ────────────────────────────────────────
function StoreTeePreview({
  color, isOversized, frontSrc, backSrc, view,
}: { color: string; isOversized?: boolean; frontSrc?: string; backSrc?: string; view: "front" | "back" }) {
  const isDark = ["#111111","#1B2A4A","#2355C0","#C0392B","#6B2D2D"].includes(color);
  const body = isOversized
    ? "M30 52 L8 95 L50 100 L50 215 L150 215 L150 100 L192 95 L170 52 L130 32 Q100 20 70 32 Z"
    : "M40 56 L15 92 L55 100 L55 215 L145 215 L145 100 L185 92 L160 56 L125 38 Q100 28 75 38 Z";
  const collar = isOversized ? "M70 32 Q100 52 130 32" : "M75 38 Q100 56 125 38";
  const src = view === "front" ? frontSrc : backSrc;
  return (
    <svg viewBox="0 0 200 230" className="w-full drop-shadow-xl" style={{ maxHeight: 340 }}>
      <ellipse cx="100" cy="222" rx="52" ry="5" fill="rgba(0,0,0,0.08)" />
      <path d={body} fill={color}
        stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)"} strokeWidth="1.5" />
      <path d={collar} fill="none"
        stroke={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)"} strokeWidth="1.5" />
      {src ? (
        <image href={src} x="62" y="57" width="76" height="88"
          preserveAspectRatio="xMidYMid meet" style={{ mixBlendMode: "multiply" }} />
      ) : (
        <rect x="56" y="51" width="88" height="101" fill="none"
          stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}
          strokeWidth="0.8" strokeDasharray="3 3" rx="2" />
      )}
      {!src && (
        <text x="100" y="105" textAnchor="middle" fontSize="7" fontFamily="monospace"
          fill={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}>
          upload design
        </text>
      )}
    </svg>
  );
}

// ── Upload helpers ─────────────────────────────────────────────────────────────

/** Upload a File using multipart/form-data — no base64 overhead, no body-size 413 */
async function uploadFileToStorage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/store-upload", { method: "POST", body: form });
  const text = await res.text();
  let data: { url?: string; error?: string } = {};
  try { data = JSON.parse(text); } catch { throw new Error(text || "Upload failed"); }
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.url!;
}

/** Upload a base64 data-URL (thumbnails ≤ 30 KB — safe as JSON) */
async function uploadDataUrlToStorage(dataUrl: string, fileName: string): Promise<string | null> {
  try {
    const res = await fetch("/api/store-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, base64: dataUrl, contentType: "image/jpeg" }),
    });
    const text = await res.text();
    let data: { url?: string } = {};
    try { data = JSON.parse(text); } catch { return null; }
    return res.ok ? (data.url ?? null) : null;
  } catch { return null; }
}

// Type for designs fetched from the API
type DesignRow = {
  id: string;
  product_id: string;
  product_name: string;
  gsm: string;
  color_name: string;
  color_hex: string;
  blank_price: number;
  print_price: number;
  has_design: boolean;
  thumbnail: string | null;
  created_at: string;
};

// ── Push design to store modal ─────────────────────────────────────────────────
function PushDesignModal({
  store, userId, onClose, onAdded,
}: { store: ArtistStore; userId: string | null; onClose: () => void; onAdded: (p: StoreProductRow) => void }) {
  const [designs, setDesigns] = useState<DesignRow[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [selected, setSelected] = useState<DesignRow | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!userId) { setLoadingDesigns(false); return; }
    fetch(`/api/designs?userId=${userId}`)
      .then((r) => r.json())
      .then((data: DesignRow[]) => {
        setDesigns(Array.isArray(data) ? data : []);
      })
      .catch(() => setDesigns([]))
      .finally(() => setLoadingDesigns(false));
  }, [userId]);

  function pickDesign(d: DesignRow) {
    setSelected(d);
    const catalog = STORE_CATALOG.find((c) => c.id === d.product_id);
    setSizes(catalog ? [...catalog.sizes] : []);
    const totalCost = d.blank_price + (d.print_price ?? 0);
    setPrice(String(totalCost + 200));
    setDescription("");
    setImageFile(null);
    setImagePreview("");
  }

  function toggleSize(s: string) {
    setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function handleSubmit() {
    if (!selected) return;
    const priceNum = parseInt(price, 10);
    const totalCost = selected.blank_price + (selected.print_price ?? 0);
    const minPrice = totalCost + 50;
    if (isNaN(priceNum) || priceNum < minPrice) { setErr(`Minimum price is ₹${minPrice}`); return; }
    if (sizes.length === 0) { setErr("Select at least one size"); return; }
    setSaving(true); setErr("");

    let finalImageUrl: string | null = null;

    // If user uploaded a custom product photo, upload it
    if (imageFile) {
      try { finalImageUrl = await uploadFileToStorage(imageFile); }
      catch (e) { setErr((e as Error).message ?? "Upload failed"); setSaving(false); return; }
    } else if (selected.thumbnail && selected.thumbnail.startsWith("data:")) {
      // Thumbnail is a small base64 JPEG — safe to upload via JSON
      finalImageUrl = await uploadDataUrlToStorage(selected.thumbnail, `thumb-${selected.id}.jpg`);
    }

    const prodRes = await fetch(`/api/stores/${store.handle}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selected.product_id,
        product_name: selected.product_name,
        color_hex: selected.color_hex,
        color_name: selected.color_name,
        sizes,
        retail_price_inr: priceNum,
        cost_price_inr: selected.blank_price + (selected.print_price ?? 0),
        description: description || null,
        design_front_url: finalImageUrl,
        image_url: finalImageUrl,
        print_technique: "DTG",
      }),
    });
    const prodText = await prodRes.text();
    let data: StoreProductRow & { error?: string };
    try { data = JSON.parse(prodText); } catch { setErr(prodText || "Failed"); setSaving(false); return; }
    if (!prodRes.ok) { setErr(data.error ?? "Failed"); setSaving(false); return; }
    onAdded(data);
    onClose();
  }

  const catalog = selected ? STORE_CATALOG.find((c) => c.id === selected.product_id) : null;
  const totalCost = selected ? selected.blank_price + (selected.print_price ?? 0) : 0;
  const priceNum = parseInt(price || "0", 10);
  const margin = isNaN(priceNum) ? 0 : priceNum - totalCost - 50;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full md:rounded-3xl md:max-w-3xl max-h-[96vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selected && (
              <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-700 text-sm transition-colors">← Back</button>
            )}
            <h3 className="font-black text-zinc-900 text-base" style={{ letterSpacing: "-0.03em" }}>
              {selected ? `Push to store · ${selected.product_name}` : "Choose a design"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors">✕</button>
        </div>

        {/* Design picker */}
        {!selected && (
          <div className="p-6">
            {loadingDesigns ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
              </div>
            ) : designs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🎨</div>
                <p className="font-bold text-zinc-900 mb-1">No designs saved yet</p>
                <p className="text-zinc-500 text-sm mb-4">Go to Studio, configure a product and save your design — it&apos;ll appear here.</p>
                <a href="/studio" className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors inline-block">
                  Open Studio →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {designs.map((d) => (
                  <button key={d.id} onClick={() => pickDesign(d)}
                    className="text-left rounded-2xl border-2 border-zinc-100 hover:border-orange-300 hover:bg-orange-50 transition-all overflow-hidden group">
                    <div className="aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{ background: d.color_hex + "22" }}>
                      {d.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.thumbnail} alt={d.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl" style={{ background: d.color_hex }} />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-zinc-900 text-xs group-hover:text-orange-600 transition-colors truncate">{d.product_name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{d.color_name} · {d.gsm}</p>
                      <p className="text-[10px] text-zinc-500 font-bold mt-0.5">Cost ₹{d.blank_price + (d.print_price ?? 0)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Configure phase */}
        {selected && (
          <div className="flex flex-col md:flex-row flex-1">
            {/* Left: preview */}
            <div className="md:w-64 flex-shrink-0 bg-zinc-50 flex flex-col items-center justify-center p-6 gap-4">
              <div className="w-full max-w-[200px]">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Product" className="w-full rounded-2xl aspect-square object-cover" />
                ) : selected.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.thumbnail} alt={selected.product_name} className="w-full rounded-2xl aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square rounded-2xl" style={{ background: selected.color_hex + "44" }} />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-zinc-900 text-sm">{selected.product_name}</p>
                <p className="text-xs text-zinc-400">{selected.color_name}</p>
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex-1 p-6 space-y-5">
              {/* Sizes */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Sizes to offer</p>
                {catalog ? (
                  <div className="flex gap-1.5 flex-wrap">
                    {catalog.sizes.map((s) => (
                      <button key={s} onClick={() => toggleSize(s)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${sizes.includes(s) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Product type not found in catalog</p>
                )}
              </div>

              {/* Product photo */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Product photo <span className="text-zinc-400 font-normal normal-case">(optional — overrides design thumbnail)</span></p>
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${imageFile ? "border-zinc-300 bg-zinc-50" : "border-zinc-200 hover:border-orange-300 hover:bg-orange-50"}`}>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                    e.target.value = "";
                  }} />
                  <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <span className="text-xs text-zinc-500">
                    {imageFile ? imageFile.name : "Upload a lifestyle or product photo"}
                  </span>
                </label>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description</p>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell fans about this piece — the story, the collab, the vibe…"
                  rows={3} className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Retail price (₹)</p>
                <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
                  <span>Cost ₹{totalCost} + ₹50 fulfillment</span>
                  <span className="text-zinc-200">·</span>
                  <span className={`font-black ${margin >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {margin >= 0 ? `You keep ₹${margin}/unit` : "Below minimum"}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">₹</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={totalCost + 50}
                    className="w-full pl-7 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-bold outline-none focus:border-zinc-900 transition-colors" />
                </div>
              </div>

              {err && <p className="text-red-500 text-xs font-bold">{err}</p>}

              <button onClick={handleSubmit} disabled={saving}
                className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {saving ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Publishing…</>
                ) : "Publish to store →"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}


function StoresTab({ userId }: { userId: string | null }) {
  const [store, setStore] = useState<ArtistStore | null>(null);
  const [products, setProducts] = useState<StoreProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingStore, setEditingStore] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Create form state
  const [handle, setHandle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");

  // Edit store state
  const [editArtistName, setEditArtistName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetch(`/api/stores?userId=${userId}`)
      .then((r) => r.json())
      .then((data: ArtistStore[]) => {
        if (data && data.length > 0) {
          setStore(data[0]);
          return fetch(`/api/stores/${data[0].handle}/products`);
        }
        return null;
      })
      .then((r) => r ? r.json() : [])
      .then((prods) => { if (Array.isArray(prods)) setProducts(prods); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setCreating(true); setCreateErr("");
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: handle.toLowerCase(), artist_name: artistName, description: description || null, instagram: instagram || null, user_id: userId }),
    });
    const data = await res.json();
    if (!res.ok) { setCreateErr(data.error ?? "Failed"); setCreating(false); return; }
    setStore(data);
    setShowCreate(false);
    setCreating(false);
  }

  async function handleSaveStore(e: React.FormEvent) {
    e.preventDefault();
    if (!store || !userId) return;
    setSaving(true);
    const res = await fetch(`/api/stores/${store.handle}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, artist_name: editArtistName, description: editDescription || null, instagram: editInstagram || null }),
    });
    const data = await res.json();
    if (res.ok) { setStore((s) => s ? { ...s, ...data } : s); setEditingStore(false); }
    setSaving(false);
  }

  async function removeProduct(id: string) {
    if (!store) return;
    await fetch(`/api/stores/${store.handle}/products?id=${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function startEditProduct(p: StoreProductRow) {
    setEditingProductId(p.id);
    setEditPrice(String(p.retail_price_inr));
    setEditDesc(p.description ?? "");
    setEditSizes([...p.sizes]);
    setEditImagePreview(p.image_url ?? p.design_front_url ?? "");
    setEditImageFile(null);
  }

  function toggleEditSize(s: string) {
    setEditSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function saveEditProduct(productId: string, costPrice: number, allSizes: string[]) {
    if (!store) return;
    setEditSaving(true);
    const priceNum = parseInt(editPrice, 10);
    const minPrice = costPrice + 50;
    if (isNaN(priceNum) || priceNum < minPrice) { setEditSaving(false); return; }

    let finalImageUrl: string | undefined;
    if (editImageFile) {
      try { finalImageUrl = await uploadFileToStorage(editImageFile); }
      catch { setEditSaving(false); return; }
    }

    const body: Record<string, unknown> = {
      retail_price_inr: priceNum,
      description: editDesc || null,
      sizes: editSizes,
    };
    if (finalImageUrl) body.image_url = finalImageUrl;

    const patchRes = await fetch(`/api/stores/${store.handle}/products?id=${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (patchRes.ok) {
      const patchText = await patchRes.text();
      try {
        const patchData = JSON.parse(patchText);
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, ...patchData } : p));
      } catch { /* ignore parse error, still close the edit form */ }
      setEditingProductId(null);
    }
    setEditSaving(false);
    void allSizes;
  }

  function startEdit() {
    if (!store) return;
    setEditArtistName(store.artist_name);
    setEditDescription(store.description ?? "");
    setEditInstagram(store.instagram ?? "");
    setEditingStore(true);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
    </div>
  );

  // No store yet — launch CTA
  if (!store && !showCreate) return (
    <div>
      <h2 className="text-2xl font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.04em" }}>My Store</h2>
      <div className="bg-zinc-900 rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="relative z-10">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="font-black text-white text-xl mb-2" style={{ letterSpacing: "-0.04em" }}>Launch your merch store</h3>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
            Create a public storefront, add your products with custom pricing, and share the link with your fans. We handle print, pack, and ship.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            {["No inventory", "On-demand fulfillment", "You keep the margin"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
                <span className="text-green-400">✓</span>{f}
              </div>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)}
            className="px-8 py-3 rounded-full bg-orange-500 text-white font-black text-sm hover:bg-orange-400 transition-colors">
            Create your store →
          </button>
        </div>
      </div>
    </div>
  );

  // Create store form
  if (showCreate) return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-zinc-700 text-sm">← Back</button>
        <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Create Store</h2>
      </div>
      <div className="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Store handle *</label>
            <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
              <span className="px-3 py-2.5 text-zinc-400 text-sm border-r border-zinc-200 bg-zinc-50 font-mono">halftone.in/store/</span>
              <input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name" required pattern="[a-z0-9-]+"
                className="flex-1 px-3 py-2.5 text-sm font-mono outline-none" />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Lowercase letters, numbers, hyphens only</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Display name *</label>
            <input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Kevin Abstract" required
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Bio / description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell your fans what this store is about…" rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Instagram handle</label>
            <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
              <span className="px-3 py-2.5 text-zinc-400 text-sm border-r border-zinc-200 bg-zinc-50">@</span>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value.replace("@", ""))} placeholder="yourhandle"
                className="flex-1 px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          {createErr && <p className="text-red-500 text-xs font-bold">{createErr}</p>}
          <button type="submit" disabled={creating}
            className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 disabled:opacity-40 transition-colors">
            {creating ? "Creating…" : "Launch store →"}
          </button>
        </form>
      </div>
    </div>
  );

  // Store dashboard
  const storeUrl = `${typeof window !== "undefined" ? window.location.origin : "https://halftonelabs.in"}/store/${store!.handle}`;

  return (
    <div>
      {showAddProduct && store && (
        <PushDesignModal store={store} userId={userId} onClose={() => setShowAddProduct(false)}
          onAdded={(p) => setProducts((prev) => [...prev, p])} />
      )}

      {/* Store header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>{store!.artist_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-orange-500 font-bold hover:underline font-mono">
              /store/{store!.handle} ↗
            </a>
            <button onClick={() => { navigator.clipboard.writeText(storeUrl); }}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Copy link</button>
          </div>
        </div>
        <button onClick={startEdit}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-sm font-bold hover:bg-zinc-50 transition-colors">
          Edit store
        </button>
      </div>

      {/* Edit store inline form */}
      {editingStore && (
        <form onSubmit={handleSaveStore} className="bg-zinc-50 rounded-2xl p-5 mb-6 space-y-3">
          <h3 className="font-bold text-zinc-900 text-sm">Edit store info</h3>
          <input value={editArtistName} onChange={(e) => setEditArtistName(e.target.value)} placeholder="Display name" required
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors" />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Bio / description" rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors bg-white">
            <span className="px-3 py-2.5 text-zinc-400 text-sm border-r border-zinc-200 bg-zinc-50">@</span>
            <input value={editInstagram} onChange={(e) => setEditInstagram(e.target.value.replace("@", ""))} placeholder="Instagram handle"
              className="flex-1 px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingStore(false)} className="px-4 py-2 rounded-xl border border-zinc-200 text-sm font-bold hover:bg-zinc-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {/* Products section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-zinc-900" style={{ letterSpacing: "-0.03em" }}>
          Products <span className="text-zinc-400 font-normal text-sm ml-1">{products.length}</span>
        </h3>
        <button onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-700 transition-colors">
          <span className="text-base leading-none">+</span> Push to store
        </button>
      </div>

      {products.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👕</div>
          <p className="text-zinc-500 text-sm font-semibold mb-1">No products yet</p>
          <p className="text-zinc-400 text-xs mb-4">Add your first product to start selling</p>
          <button onClick={() => setShowAddProduct(true)}
            className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
            Push your first design →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const margin = p.retail_price_inr - p.cost_price_inr - 50;
            const displayImage = p.image_url || p.design_front_url;
            const isEditing = editingProductId === p.id;
            const catalogEntry = STORE_CATALOG.find((c) => c.id === p.product_id);

            return (
              <div key={p.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 transition-all group flex flex-col">
                {/* Image */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden" style={{ background: p.color_hex + "22" }}>
                  <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                  {displayImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={isEditing && editImagePreview ? editImagePreview : displayImage}
                      alt={p.product_name} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl relative z-10" style={{ background: p.color_hex, opacity: 0.8 }}>👕</div>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => isEditing ? setEditingProductId(null) : startEditProduct(p)}
                      className="w-7 h-7 rounded-full bg-white/90 text-zinc-500 hover:text-zinc-900 text-xs flex items-center justify-center shadow-sm transition-colors">
                      {isEditing ? "✕" : "✏️"}
                    </button>
                    <button onClick={() => removeProduct(p.id)}
                      className="w-7 h-7 rounded-full bg-white/90 text-zinc-400 hover:text-red-500 hover:bg-white text-xs flex items-center justify-center shadow-sm transition-colors">
                      🗑
                    </button>
                  </div>
                </div>

                {/* Card body */}
                {isEditing ? (
                  <div className="p-4 space-y-3 flex-1">
                    <p className="text-xs font-bold text-zinc-900">{p.product_name} · {p.color_name}</p>

                    {/* Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">₹</span>
                        <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                          min={p.cost_price_inr + 50}
                          className="w-full pl-6 pr-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold outline-none focus:border-zinc-900 transition-colors" />
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Min ₹{p.cost_price_inr + 50}</p>
                    </div>

                    {/* Sizes */}
                    {catalogEntry && (
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Sizes</label>
                        <div className="flex gap-1 flex-wrap">
                          {catalogEntry.sizes.map((s) => (
                            <button key={s} onClick={() => toggleEditSize(s)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${editSizes.includes(s) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Description</label>
                      <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2}
                        placeholder="Short product description…"
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200 text-xs outline-none focus:border-zinc-900 transition-colors resize-none" />
                    </div>

                    {/* Image upload */}
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-zinc-200 hover:border-orange-300 cursor-pointer transition-colors">
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setEditImageFile(f); setEditImagePreview(URL.createObjectURL(f)); }
                        e.target.value = "";
                      }} />
                      <svg className="w-4 h-4 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                      <span className="text-[10px] text-zinc-400">
                        {editImageFile ? `${editImageFile.name}` : "Change product photo"}
                      </span>
                    </label>

                    <button onClick={() => saveEditProduct(p.id, p.cost_price_inr, catalogEntry?.sizes ?? p.sizes)} disabled={editSaving}
                      className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors">
                      {editSaving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-zinc-900 text-sm truncate">{p.product_name}</p>
                        <p className="text-xs text-zinc-400">{p.color_name} · {p.print_technique}</p>
                      </div>
                      <p className="font-black text-zinc-900 text-sm whitespace-nowrap">₹{p.retail_price_inr}</p>
                    </div>
                    {p.description && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                    )}
                    <div className="flex gap-1 flex-wrap mt-2">
                      {p.sizes.map((s) => (
                        <span key={s} className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between mt-3">
                      <span className="text-xs text-zinc-400">Your margin</span>
                      <span className={`text-xs font-black ${margin > 0 ? "text-green-600" : "text-red-500"}`}>₹{margin} / unit</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Store link card */}
      {products.length > 0 && (
        <div className="mt-8 bg-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">Your store is live 🎉</p>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono">{storeUrl}</p>
          </div>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors whitespace-nowrap">
            View store ↗
          </a>
        </div>
      )}
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
  const { currency, setCurrency } = useCurrency();
  const CURRENCIES: Currency[] = ["INR", "USD", "EUR"];
  const [addr, setAddr]       = useState({ name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pin: "", country: "IN" });
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/referrals?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { if (d.code) setReferralCode(d.code); })
      .catch(() => {});
  }, [userId]);

  const copyReferral = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(`https://halftonelabs.in/studio?ref=${referralCode}`);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

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

      {/* Currency preference */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-zinc-900">Display Currency</h3>
            <p className="text-xs text-zinc-400">Prices shown site-wide and at checkout</p>
          </div>
        </div>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                currency === c
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              <span>{CURRENCY_META[c].flag}</span>
              <span>{CURRENCY_META[c].label}</span>
            </button>
          ))}
        </div>
        {currency !== "INR" && (
          <p className="text-xs text-zinc-400 mt-3">
            International prices include a 2× margin. GST is not applied at checkout for non-INR orders.
          </p>
        )}
      </div>

      {/* Referral Program */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-zinc-900">Referral Program</h3>
            <p className="text-xs text-zinc-400">Share your code — earn 5% store credit on every referral</p>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
          Share your link with other artists. They get <strong className="text-zinc-800">5% off</strong> their first order — you earn <strong className="text-zinc-800">5% store credit</strong> automatically.
        </p>
        {referralCode ? (
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 font-mono text-sm text-zinc-700 truncate">
              halftonelabs.in/studio?ref={referralCode}
            </div>
            <button onClick={copyReferral}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${referralCopied ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
              {referralCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-400">
            {userId ? "Generating your code…" : "Log in to get your referral code"}
          </div>
        )}
        <p className="text-xs text-zinc-400 mt-3">Credits are applied automatically after the referred order ships.</p>
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
              {activeTab === "stores"    && <StoresTab userId={user?.id ?? null} />}
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
