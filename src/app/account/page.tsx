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
import ShopifyTab from "@/components/ShopifyTab";
import WalletTab from "@/components/WalletTab";
import CreateOrderTab from "@/components/CreateOrderTab";
import CustomersTab from "@/components/CustomersTab";
import DesignerTab from "@/components/DesignerTab";
import OverviewTab from "@/components/OverviewTab";
import OrgDashboard from "@/components/OrgDashboard";
import OrgSettings from "@/components/OrgSettings";
import DropsTab from "@/components/DropsTab";
import BillingTab from "@/components/BillingTab";
import { LockedFeatureCard } from "@/components/PlanGate";
import { useSubscription } from "@/lib/subscription-context";

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
  courier?: string | null; tracking_number?: string | null;
  milestones: { id: string; title: string; description: string; created_at: string }[];
};

type ActiveTab = "dashboard" | "orders" | "designs" | "drops" | "branding" | "stores" | "shopify" | "wallet" | "invoices" | "settings" | "create-order" | "customers" | "designer" | "affiliate";

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
  { id: "drops", label: "Drops", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
  { id: "shopify", label: "Shopify Orders", icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
    </svg>
  )},
  { id: "designer", label: "Design Studio", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )},
  { id: "create-order", label: "Create Order", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )},
  { id: "customers", label: "Customers", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: "wallet", label: "Wallet", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )},
  { id: "invoices", label: "Invoices", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { id: "settings", label: "Account Settings", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: "affiliate", label: "Affiliate", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
    { n: 3, title: "Connect your store",       desc: "Link your Shopify store to automate fulfilment at scale.",        done: false,                                      cta: "Connect Shopify →", href: "#shopify" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
          👋 Welcome, {user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "there"}
        </h2>
        <p className="text-ds-body text-sm mt-1">Here&apos;s a quick look at your Halftone Labs account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STEPS.map((step, i) => (
          <motion.div key={step.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border p-5 relative overflow-hidden ${step.done ? "border-green-200 bg-green-50" : "border-black/[0.06] bg-white"}`}>
            {step.done && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            <p className="text-xs font-bold text-ds-muted uppercase tracking-widest mb-2">Step {step.n}</p>
            <h3 className="font-semibold text-ds-dark text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-ds-body mb-4 leading-relaxed">{step.desc}</p>
            {step.href === "#shopify" ? (
              <button onClick={() => onTab("shopify")} className="text-xs font-bold text-brand hover:text-brand-dark transition-colors">{step.cta}</button>
            ) : step.href === "#" ? (
              <span className="text-xs font-semibold text-ds-muted">{step.cta}</span>
            ) : (
              <Link href={step.href} className="text-xs font-bold text-brand hover:text-brand-dark transition-colors">{step.cta}</Link>
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
          <div key={s.label} className="bg-white rounded-2xl border border-black/[0.06] px-5 py-4">
            <p className="text-3xl font-semibold text-ds-dark">{s.val}</p>
            <p className="text-xs text-ds-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {orders.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ds-dark">Recent orders</h3>
            <button onClick={() => onTab("orders")} className="text-xs font-bold text-brand hover:text-brand-dark">View all →</button>
          </div>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 3).map((o) => {
              const sc = STATUS_COLORS[o.status] ?? STATUS_COLORS["Order Placed"];
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-black/[0.06] flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center text-lg">👕</div>
                    <div>
                      <p className="font-semibold text-sm text-ds-dark">#{o.ref}</p>
                      <p className="text-xs text-ds-muted">{o.product_name} · {o.color} · {o.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{o.status}</span>
                    <p className="font-semibold text-sm">₹{o.total}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-black/[0.06] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-semibold text-ds-dark mb-2">No orders yet</h3>
          <p className="text-ds-body text-sm mb-6">Head to Studio to design and order your first custom tee.</p>
          <Link href="/studio" className="px-6 py-3 rounded-full bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors">
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
      neckLabel:       false,
    });
  };

  const statuses = ["All", "Order Placed", "In Production", "Shipped", "Delivered"];
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Orders</h2>
        <Link href="/studio" className="px-4 py-2 rounded-full bg-brand text-white text-xs font-bold hover:bg-orange-600 transition-colors">+ New Order</Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === s ? "bg-ds-dark text-white" : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-black/[0.06] rounded-2xl">
          <p className="text-ds-muted font-bold">No orders {filter !== "All" ? `with status "${filter}"` : "yet"}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => {
            const sc     = STATUS_COLORS[order.status] ?? STATUS_COLORS["Order Placed"];
            const isOpen = selected?.id === order.id;
            return (
              <motion.div key={order.id} layout className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
                <button className="w-full text-left px-5 py-4 hover:bg-ds-light-gray transition-colors" onClick={() => setSelected(isOpen ? null : order)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center text-lg">👕</div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-ds-dark">#{order.ref}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{order.status}</span>
                        </div>
                        <p className="text-xs text-ds-muted">{order.product_name} · {order.color} · Size {order.size}</p>
                        <p className="text-[10px] text-ds-muted mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-sm">₹{order.total.toLocaleString("en-IN")}</p>
                      <svg className={`w-4 h-4 text-ds-muted transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-black/[0.06]">
                      <div className="px-5 py-5 flex flex-col gap-5">
                        {/* Shipping / tracking card — shown when AWB is available */}
                        {order.courier && order.tracking_number && (
                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-0.5">Shipped via {order.courier}</p>
                                <p className="text-sm font-semibold text-blue-900 tracking-wider">{order.tracking_number}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(order.tracking_number!)}
                              className="text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0 mt-1"
                            >
                              Copy AWB
                            </button>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Timeline */}
                          <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-4">Order Timeline</p>
                            {(() => {
                              const PIPELINE = ["Order Placed", "Design Confirmed", "In Production", "Quality Check", "Shipped", "Delivered"];
                              const completedTitles = new Set(order.milestones.map((m) => m.title));
                              const lastCompletedIdx = PIPELINE.reduce((acc, title, idx) => completedTitles.has(title) ? idx : acc, -1);
                              return (
                                <div>
                                  {PIPELINE.map((step, idx) => {
                                    const milestone = order.milestones.find((m) => m.title === step);
                                    const isComplete = !!milestone;
                                    const isCurrent = !isComplete && idx === lastCompletedIdx + 1;
                                    const isFuture = !isComplete && !isCurrent;
                                    const isLast = idx === PIPELINE.length - 1;
                                    return (
                                      <div key={step} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                          <div className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${
                                            isComplete ? "bg-brand" : isCurrent ? "border-2 border-brand bg-white" : "bg-zinc-200"
                                          }`} />
                                          {!isLast && <div className={`w-px flex-1 my-1 ${isComplete ? "bg-brand-30" : "bg-zinc-100"}`} style={{ minHeight: 16 }} />}
                                        </div>
                                        <div className="pb-3">
                                          <p className={`text-sm font-semibold ${isComplete ? "text-ds-dark" : isCurrent ? "text-brand" : "text-zinc-300"}`}>{step}</p>
                                          {milestone?.description && <p className="text-xs text-ds-body">{String(milestone.description)}</p>}
                                          {milestone && (
                                            <p className="text-[10px] text-ds-muted mt-0.5">
                                              {new Date(milestone.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </p>
                                          )}
                                          {isCurrent && <p className="text-[10px] text-brand mt-0.5">In progress</p>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 sm:w-36">
                            <Link href="/studio"
                              className="text-center px-4 py-2.5 rounded-xl bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
                              + New order
                            </Link>
                            <button onClick={() => handleReorder(order)}
                              className="text-center px-4 py-2.5 rounded-xl border border-black/[0.06] text-ds-body text-xs font-bold hover:bg-ds-light-gray transition-colors">
                              Reorder ↻
                            </button>
                          </div>
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
  color_name: string; color_hex: string; size: string;
  print_tier: string | null;
  front_print_tier: string | null; back_print_tier: string | null;
  blank_price: number; print_price: number;
  front_print_price: number | null; back_print_price: number | null;
  has_design: boolean;
  thumbnail: string | null; back_thumbnail: string | null;
  front_design_url: string | null; back_design_url: string | null;
  created_at: string;
  sku: string | null;
  shopify_product_id: string | null;
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
    const hasBoth = !!(design.front_design_url && design.back_design_url);
    // Split print price evenly if we have per-side data, otherwise put all on front
    const fPrice = design.front_print_price != null
      ? design.front_print_price
      : hasBoth ? Math.round(design.print_price / 2) : design.print_price;
    const bPrice = design.back_print_price != null
      ? design.back_print_price
      : hasBoth ? design.print_price - fPrice : 0;
    // Split print tiers: use saved per-side tiers, or split the combined string
    const tierParts = (design.print_tier ?? "").split(" + ");
    const fTier = design.front_print_tier ?? tierParts[0] ?? "";
    const bTier = design.back_print_tier  ?? (hasBoth ? (tierParts[1] ?? tierParts[0] ?? "") : "");

    addItem({
      productId:        design.product_id || "custom",
      productName:      design.product_name,
      gsm:              design.gsm,
      color:            design.color_name,
      colorHex:         design.color_hex,
      size:             validSize,
      qty,
      frontDesignUrl:   design.has_design ? (design.front_design_url ?? design.thumbnail ?? "") : "",
      backDesignUrl:    design.has_design ? (design.back_design_url ?? "") : "",
      frontPrintPrice:  design.has_design ? fPrice : 0,
      backPrintPrice:   design.has_design ? bPrice : 0,
      frontPrintTier:   fTier,
      backPrintTier:    bTier,
      printDims:        "",
      printTechnique:   design.has_design ? "DTG" : "none",
      blankPrice:       design.blank_price,
      neckLabel:        false,
      thumbnail:        design.thumbnail     ?? "",
      backThumbnail:    design.back_thumbnail ?? "",
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
            <h3 className="font-semibold text-ds-dark text-lg" style={{ letterSpacing: "-0.03em" }}>Add to Cart</h3>
            <p className="text-sm text-ds-muted">{design.name} · {design.product_name} · {design.color_name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-zinc-200 transition-colors text-ds-body text-lg leading-none">&times;</button>
        </div>

        {/* Size picker — uses actual product sizes */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-2.5">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizeList.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${validSize === s ? "border-zinc-900 bg-ds-dark text-white" : "border-black/[0.06] text-ds-body hover:border-zinc-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-2.5">Quantity</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-full border-2 border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-400 transition-colors font-bold text-lg leading-none">−</button>
              <span className="text-xl font-semibold w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-full border-2 border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-400 transition-colors font-bold text-lg leading-none">+</button>
            </div>
            <p className="text-sm text-ds-body">₹{(unitPrice * qty).toLocaleString("en-IN")} total</p>
          </div>
        </div>

        {/* Print summary — read-only, no side picker */}
        {design.has_design && (
          <div className="flex items-center justify-between bg-brand-8 border border-orange-100 rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="text-ds-body text-xs">Print · {design.print_tier ?? "Custom"}</span>
            <span className="font-semibold text-brand-dark">+₹{design.print_price.toLocaleString("en-IN")}</span>
          </div>
        )}

        <button onClick={handleAdd}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${added ? "bg-green-500 text-white" : "bg-ds-dark text-white hover:bg-ds-dark2"}`}>
          {added ? "✓ Added to cart!" : `Add ${qty} × ${validSize} to cart — ₹${(unitPrice * qty).toLocaleString("en-IN")} →`}
        </button>
      </motion.div>
    </div>
  );
}

// ── Push to Shopify Modal ─────────────────────────────────────────────────────
function PushToShopifyModal({
  design, userId, onClose, onDone,
}: {
  design: Design; userId: string; onClose: () => void; onDone: (shopifyProductId: string) => void;
}) {
  const [price,      setPrice]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [done,       setDone]       = useState<string | null>(null); // shopifyUrl
  const [reauthShop, setReauthShop] = useState<string | null>(null); // triggers re-auth UI

  const isUpdate = !!design.shopify_product_id;

  const handlePush = async () => {
    const retail = parseFloat(price);
    if (!retail || retail <= 0) { setError("Enter a valid retail price"); return; }
    setLoading(true); setError(null); setReauthShop(null);
    try {
      const res = await fetch("/api/shopify/push-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, designId: design.id, retailPrice: retail }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "reauth_required" && json.shopDomain) {
          setReauthShop(json.shopDomain);
          return;
        }
        const errMsg = typeof json.error === "string"
          ? json.error
          : typeof json.error === "object" && json.error !== null
            ? Object.entries(json.error as Record<string, unknown>).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
            : "Push failed";
        throw new Error(errMsg);
      }
      setDone(json.shopifyUrl);
      onDone(json.shopifyProductId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 shadow-2xl z-10">

        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {/* Shopify bag icon */}
              <svg className="w-5 h-5 text-[#96bf48]" viewBox="0 0 109.5 124.5" fill="currentColor">
                <path d="M74.7 14.8s-1.4-.4-3.6-.8c-.2-1.2-.9-2.3-1.9-3.3-2.9-3-7.1-4.6-12.6-4.6-.1 0-1.2-5.6-4-5.6H28.2c-2.8 0-2.8 3.7-2.8 3.7L24 18.9c-4.5.7-8.7 2-10.4 2.4C7.5 22.8 7 23.2 6.3 29L.3 78.7C-.3 82.9 2.8 87 7.1 87h95.4c4.3 0 7.4-4.1 6.8-8.3L100.1 22C99.4 16.1 98.9 15.7 93 14.3c-2.1-.5-9.8-1.9-18.3 0zM68.6 16c-5.5 1.3-11.5 1.7-17.5 1.6L52 8.9c4.2.1 7.4 1.3 9.5 3.4.9 1 1.6 2.3 2 3.7h5.1zm-22.1.1L47.3 8.9c4.1 0 7.3 1.3 9.4 3.4.9 1 1.5 2.2 1.9 3.7-6 .1-12-.5-12.1-.9z"/>
              </svg>
              <h3 className="font-semibold text-ds-dark text-lg" style={{ letterSpacing: "-0.03em" }}>
                {isUpdate ? "Update Shopify Product" : "Push to Shopify"}
              </h3>
            </div>
            <p className="text-sm text-ds-muted">{design.name} · {design.product_name}</p>
            {design.sku && (
              <p className="text-xs font-mono text-ds-muted mt-0.5">SKU: {design.sku}</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-zinc-200 transition-colors text-ds-body text-lg leading-none">&times;</button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-ds-dark mb-1">
              {isUpdate ? "Product updated!" : "Product pushed!"}
            </p>
            <p className="text-sm text-ds-body mb-5">Your design is now live in your Shopify store.</p>
            <div className="flex gap-3">
              <a href={done} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 rounded-2xl bg-ds-dark text-white font-semibold text-sm text-center hover:bg-ds-dark2 transition-colors">
                View in Shopify →
              </a>
              <button onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-black/[0.06] text-ds-body font-bold text-sm hover:border-zinc-400 transition-colors">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* What gets pushed */}
            <div className="bg-ds-light-gray rounded-2xl p-4 mb-5 text-sm space-y-1.5">
              <p className="font-bold text-ds-body mb-2 text-xs uppercase tracking-wider">What will be pushed</p>
              <div className="flex items-center gap-2 text-ds-body">
                <span className="text-green-500">✓</span> Product listing with title &amp; description
              </div>
              <div className="flex items-center gap-2 text-ds-body">
                <span className="text-green-500">✓</span> Sizes XS → 3XL as variants
              </div>
              {(design.thumbnail || design.back_thumbnail) && (
                <div className="flex items-center gap-2 text-ds-body">
                  <span className="text-green-500">✓</span> Mockup image{design.back_thumbnail ? "s (front + back)" : ""}
                </div>
              )}
              <div className="flex items-center gap-2 text-ds-body">
                <span className="text-green-500">✓</span> SKU per variant: <span className="font-mono text-xs">{design.sku || "HLD-…"}-S/M/…</span>
              </div>
            </div>

            {/* Retail price input */}
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-widest text-ds-muted block mb-2">
                Retail Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ds-muted font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 699"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none font-semibold text-ds-dark text-lg transition-colors"
                />
              </div>
              {price && Number(price) > 0 && (
                <p className="text-xs text-ds-muted mt-1.5 ml-1">
                  Your cost: ₹{(design.blank_price + design.print_price).toLocaleString("en-IN")} ·
                  Margin: ₹{(Number(price) - design.blank_price - design.print_price).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {reauthShop && (
              <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
                <p className="font-bold text-amber-800 mb-1">Store needs updated access</p>
                <p className="text-amber-700 mb-3">Your store connection needs the &ldquo;write products&rdquo; permission. Click below — Shopify will ask you to approve it, then you&rsquo;re done.</p>
                <a
                  href={`/api/shopify/auth?shop=${reauthShop}&userId=${userId}`}
                  className="inline-block w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm text-center transition-colors"
                >
                  Re-authorize Store (5 sec) →
                </a>
              </div>
            )}

            {error && !reauthShop && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{error}</div>
            )}

            <button onClick={handlePush} disabled={loading || !!reauthShop}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all bg-[#96bf48] hover:bg-[#85ad3d] text-white disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Pushing…</>
              ) : (
                isUpdate ? "Update Product in Shopify →" : "Push to Shopify →"
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Designs Tab ────────────────────────────────────────────────────────────────
function downloadThumbnail(url: string, name: string, suffix = "mockup") {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${suffix}.jpg`;
  a.click();
}

function DesignsTab({ userId, email }: { userId: string | null; email: string | null }) {
  const [designs,     setDesigns]     = useState<Design[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [cartDesign,  setCartDesign]  = useState<Design | null>(null);
  const [pushDesign,  setPushDesign]  = useState<Design | null>(null);
  const [hasShopify,  setHasShopify]  = useState<boolean | null>(null);
  const [openMenuId,  setOpenMenuId]  = useState<string | null>(null);
  const [renamingId,  setRenamingId]  = useState<string | null>(null);
  const [renameVal,   setRenameVal]   = useState("");

  const startRename = (d: Design) => { setRenamingId(d.id); setRenameVal(d.name); setOpenMenuId(null); };

  const commitRename = async (id: string) => {
    const trimmed = renameVal.trim();
    if (!trimmed) { setRenamingId(null); return; }
    await fetch("/api/designs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId, name: trimmed }),
    });
    setDesigns((prev) => prev.map((d) => d.id === id ? { ...d, name: trimmed } : d));
    setRenamingId(null);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    else if (email) params.set("email", email);
    fetch(`/api/designs?${params}`)
      .then((r) => r.json())
      .then((d) => setDesigns(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [userId, email]);

  // Check if user has a connected Shopify store
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/shopify/connect?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setHasShopify(!!d.connection))
      .catch(() => setHasShopify(false));
  }, [userId]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/designs?id=${id}`, { method: "DELETE" });
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    setDeleting(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredDesigns = designs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.color_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Designs</h2>
        <Link href="/studio" className="px-4 py-2 rounded-full bg-brand text-white text-xs font-bold hover:bg-orange-600 transition-colors">+ New Design</Link>
      </div>
      {designs.length > 3 && (
        <div className="relative mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ds-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search designs…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/[0.06] text-sm text-ds-dark placeholder:text-ds-muted focus:outline-none focus:border-zinc-400 transition-colors bg-white max-w-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-body">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ds-muted py-8">
          <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          Loading designs…
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-black/[0.06] rounded-2xl p-14 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-semibold text-ds-dark mb-2">No saved designs yet</h3>
          <p className="text-ds-body text-sm mb-6 max-w-xs mx-auto">
            When you configure a product in Studio, hit <strong>&quot;Save design to account&quot;</strong> — it&apos;ll appear here.
          </p>
          <Link href="/studio" className="px-6 py-3 rounded-full bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors">
            Open Studio →
          </Link>
        </div>
      ) : filteredDesigns.length === 0 && searchQuery ? (
        <div className="bg-white border border-black/[0.06] rounded-2xl p-10 text-center">
          <p className="font-semibold text-ds-dark mb-1">No designs match &quot;{searchQuery}&quot;</p>
          <p className="text-sm text-ds-muted">Try a different name, product, or colour.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDesigns.map((d) => (
            <motion.div key={d.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden hover:border-black/[0.06] hover:shadow-sm transition-all">
              {/* Thumbnail */}
              <div className="h-40 flex items-center justify-center relative overflow-hidden group/thumb" style={{ background: d.thumbnail ? "#ffffff" : (d.color_hex || "#f4f4f5") }}>
                {d.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl opacity-40">👕</div>
                )}
                {d.has_design && (
                  <span className="absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-ds-body backdrop-blur-sm">
                    Custom print
                  </span>
                )}
                {/* Download overlay — appears on hover */}
                {(d.thumbnail || d.back_thumbnail) && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity backdrop-blur-[2px]"
                  >
                    {d.thumbnail && (
                      <button onClick={() => downloadThumbnail(d.thumbnail!, d.name, d.back_thumbnail ? "front-mockup" : "mockup")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-ds-dark text-[10px] font-bold transition-colors shadow">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        {d.back_thumbnail ? "Front mockup" : "Download mockup"}
                      </button>
                    )}
                    {d.back_thumbnail && (
                      <button onClick={() => downloadThumbnail(d.back_thumbnail!, d.name, "back-mockup")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-ds-dark text-[10px] font-bold transition-colors shadow">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Back mockup
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-4 py-4">
                {renamingId === d.id ? (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <input
                      autoFocus
                      value={renameVal}
                      onChange={(e) => setRenameVal(e.target.value)}
                      onBlur={() => commitRename(d.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") commitRename(d.id); if (e.key === "Escape") setRenamingId(null); }}
                      className="flex-1 min-w-0 text-sm font-semibold text-ds-dark bg-transparent border-b-2 border-zinc-900 outline-none px-0 py-0.5"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 group/name mb-0.5">
                    <p className="font-semibold text-sm text-ds-dark truncate flex-1">{d.name}</p>
                    <button onClick={() => startRename(d)} title="Rename"
                      className="opacity-0 group-hover/name:opacity-100 transition-opacity p-0.5 rounded text-ds-muted hover:text-ds-dark">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </div>
                )}
                <p className="text-xs text-ds-body mt-0.5">{d.product_name} · {d.color_name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/[0.05] text-ds-body">Size {d.size}</span>
                  {d.print_tier && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-8 text-brand">{d.print_tier}</span>}
                  {d.has_design && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">DTG Print</span>}
                  {d.shopify_product_id && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0f7e6] text-[#5a8a1a]">On Shopify</span>}
                </div>
                <p className="text-xs font-bold text-ds-dark mt-2">₹{(d.blank_price + d.print_price).toLocaleString("en-IN")} /unit</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {d.sku && <p className="text-[10px] font-mono text-ds-muted">{d.sku}</p>}
                  <p className="text-[10px] text-ds-muted">
                    Saved {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Push to Shopify — shown when store is connected */}
                {hasShopify && userId && (
                  <button
                    onClick={() => setPushDesign(d)}
                    className={`w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      d.shopify_product_id
                        ? "bg-[#f0f7e6] text-[#5a8a1a] hover:bg-[#e4f0d5]"
                        : "bg-[#f4fce8] text-[#5a8a1a] border border-[rgba(150,191,72,0.3)] hover:bg-[#ebf5d5]"
                    }`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 109.5 124.5" fill="currentColor">
                      <path d="M74.7 14.8s-1.4-.4-3.6-.8c-.2-1.2-.9-2.3-1.9-3.3-2.9-3-7.1-4.6-12.6-4.6-.1 0-1.2-5.6-4-5.6H28.2c-2.8 0-2.8 3.7-2.8 3.7L24 18.9c-4.5.7-8.7 2-10.4 2.4C7.5 22.8 7 23.2 6.3 29L.3 78.7C-.3 82.9 2.8 87 7.1 87h95.4c4.3 0 7.4-4.1 6.8-8.3L100.1 22C99.4 16.1 98.9 15.7 93 14.3c-2.1-.5-9.8-1.9-18.3 0zM68.6 16c-5.5 1.3-11.5 1.7-17.5 1.6L52 8.9c4.2.1 7.4 1.3 9.5 3.4.9 1 1.6 2.3 2 3.7h5.1zm-22.1.1L47.3 8.9c4.1 0 7.3 1.3 9.4 3.4.9 1 1.5 2.2 1.9 3.7-6 .1-12-.5-12.1-.9z"/>
                    </svg>
                    {d.shopify_product_id ? "Update on Shopify" : "Push to Shopify"}
                  </button>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setCartDesign(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  {/* Three-dot menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === d.id ? null : d.id)}
                      className="px-3 py-2 rounded-xl border border-black/[0.06] text-ds-muted hover:border-zinc-400 hover:text-ds-body transition-colors"
                      title="More options"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    {openMenuId === d.id && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white rounded-xl border border-black/[0.06] shadow-lg overflow-hidden z-20 py-1">
                        <button
                          onClick={() => startRename(d)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-ds-body hover:bg-ds-light-gray transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Rename design
                        </button>
                        {d.thumbnail && (
                          <button
                            onClick={() => { downloadThumbnail(d.thumbnail!, d.name, d.back_thumbnail ? "front-mockup" : "mockup"); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-ds-body hover:bg-ds-light-gray transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            {d.back_thumbnail ? "Front mockup" : "Download mockup"}
                          </button>
                        )}
                        {d.back_thumbnail && (
                          <button
                            onClick={() => { downloadThumbnail(d.back_thumbnail!, d.name, "back-mockup"); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-ds-body hover:bg-ds-light-gray transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            Back mockup
                          </button>
                        )}
                        <button
                          onClick={() => { handleDelete(d.id); setOpenMenuId(null); }}
                          disabled={deleting === d.id}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete design
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {cartDesign && <AddToCartModal design={cartDesign} onClose={() => setCartDesign(null)} />}
        {pushDesign && userId && (
          <PushToShopifyModal
            design={pushDesign}
            userId={userId}
            onClose={() => setPushDesign(null)}
            onDone={(shopifyProductId) => {
              setDesigns((prev) => prev.map((d) =>
                d.id === pushDesign.id ? { ...d, shopify_product_id: shopifyProductId } : d
              ));
              setTimeout(() => setPushDesign(null), 2000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Branding Tab ──────────────────────────────────────────────────────────────
function BrandingTab({ userId, email }: { userId: string | null; email: string | null }) {
  const { can }   = useSubscription();
  const canBrand  = can("customBranding");
  const canDomain = can("customDomain");
  const canWhiteLabel = can("removeHalftone");
  const canNeckLabels = can("neckLabels");
  const canPremiumPackaging = can("premiumPackaging");

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
      <div className="flex items-center gap-2 text-sm text-ds-muted py-8">
        <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
        Loading branding…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Branding</h2>
        <p className="text-ds-body text-sm mt-1">Custom labels, domain, and white-label options.</p>
      </div>

      <div className="space-y-4 max-w-2xl">

        {/* DTF Neck Labels — locked for free */}
        {!canNeckLabels ? (
          <LockedFeatureCard
            heading="Custom neck labels"
            body="Add your logo inside every garment. Upload a dark and light version of your label — applied as a DTF transfer during fulfilment."
            requiredPlan="launch"
            note="Available on Launch and above."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-brand-8 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-ds-dark">DTF Neck Labels</h3>
                <p className="text-xs text-ds-muted">Upload a dark version (for light garments) and a light version (for dark garments)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Dark label */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-2">Dark label <span className="text-ds-muted normal-case font-normal">(for light garments)</span></p>
                <div
                  onClick={() => darkRef.current?.click()}
                  className="relative border-2 border-dashed border-black/[0.06] rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-ds-light-gray transition-all overflow-hidden"
                  style={{ background: "#fafafa" }}>
                  {darkLabel ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={darkLabel} alt="Dark label" className="max-h-32 max-w-full object-contain p-3" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-ds-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-ds-muted font-medium">Click to upload PNG</p>
                      <p className="text-[10px] text-ds-muted mt-0.5">Transparent background recommended</p>
                    </>
                  )}
                  {darkLabel && (
                    <button onClick={(e) => { e.stopPropagation(); setDarkLabel(null); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow-sm border border-black/[0.06] flex items-center justify-center text-ds-muted hover:text-red-500 transition-colors text-sm leading-none">
                      ×
                    </button>
                  )}
                </div>
                <input ref={darkRef} type="file" accept="image/png,image/webp,image/jpeg" className="hidden" onChange={(e) => handleFile(e, "dark")} />
              </div>

              {/* Light label */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-2">Light label <span className="text-ds-muted normal-case font-normal">(for dark garments)</span></p>
                <div
                  onClick={() => lightRef.current?.click()}
                  className="relative border-2 border-dashed border-black/[0.06] rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 transition-all overflow-hidden"
                  style={{ background: "#1a1a1a" }}>
                  {lightLabel ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={lightLabel} alt="Light label" className="max-h-32 max-w-full object-contain p-3" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-ds-body mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-ds-body font-medium">Click to upload PNG</p>
                      <p className="text-[10px] text-ds-body mt-0.5">Transparent background recommended</p>
                    </>
                  )}
                  {lightLabel && (
                    <button onClick={(e) => { e.stopPropagation(); setLightLabel(null); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-ds-muted hover:text-red-400 transition-colors text-sm leading-none">
                      ×
                    </button>
                  )}
                </div>
                <input ref={lightRef} type="file" accept="image/png,image/webp,image/jpeg" className="hidden" onChange={(e) => handleFile(e, "light")} />
              </div>
            </div>

            <div className="bg-brand-8 border border-orange-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-orange-700 font-semibold">Neck label specs</p>
              <p className="text-xs text-brand-dark mt-0.5">Upload PNG files with transparent backgrounds. Recommended size: 600×600px or larger. Labels are printed on a 2×2 inch DTF transfer and applied inside the collar during fulfilment.</p>
            </div>

            <button onClick={handleSave} disabled={saving || (!darkLabel && !lightLabel)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-ds-dark text-white hover:bg-ds-dark2"} disabled:opacity-40 disabled:cursor-not-allowed`}>
              {saving ? "Saving…" : saved ? "Saved!" : "Save branding"}
            </button>
          </div>
        )}

        {/* Custom domain — locked for free */}
        {!canDomain ? (
          <LockedFeatureCard
            heading="Custom domain"
            body="Use your own domain for your storefront — yourbrand.com instead of halftonelabs.in/store/yourhandle."
            requiredPlan="launch"
            note="Available on Launch and above."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-ds-dark">Custom domain</h3>
                <p className="text-xs text-ds-muted">Connect your own domain to your storefront</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">Custom domain configuration is set up through your account manager. Contact us at <span className="font-medium text-ds-body">hello@halftonelabs.in</span> to get started.</p>
          </div>
        )}

        {/* White-label — locked for free/studio */}
        {!canWhiteLabel && (
          <LockedFeatureCard
            heading="Remove Halftone branding"
            body="Replace all Halftone references — storefront badges, email footers, packing slips — with your own identity. Your customers see only your brand."
            requiredPlan="scale"
            note="Available on Scale and above."
          />
        )}

        {/* Premium Packaging — locked for free/launch */}
        {!canPremiumPackaging ? (
          <LockedFeatureCard
            heading="Premium zipper packaging"
            body="Ship your merch in branded zipper poly mailers — premium unboxing experience with your logo on the packaging."
            requiredPlan="scale"
            note="Available on Scale and above."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8m-9 4v4m4-4v4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-ds-dark">Premium zipper packaging</h3>
                <p className="text-xs text-ds-muted">Branded zipper poly mailers for every shipment</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">Premium packaging is configured through your account manager. Contact us at <span className="font-medium text-ds-body">hello@halftonelabs.in</span> to enable branded packaging for your orders.</p>
          </div>
        )}

        {/* Coming soon */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6 opacity-60">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-1">Coming soon</p>
          <h3 className="font-semibold text-ds-dark mb-1">More branding options</h3>
          <p className="text-sm text-ds-body">Hang tags, poly mailer branding, and custom tissue paper.</p>
        </div>

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
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selected && (
              <button onClick={() => setSelected(null)} className="text-ds-muted hover:text-ds-body text-sm transition-colors">← Back</button>
            )}
            <h3 className="font-semibold text-ds-dark text-base" style={{ letterSpacing: "-0.03em" }}>
              {selected ? `Push to store · ${selected.product_name}` : "Choose a design"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center text-ds-body hover:bg-zinc-200 transition-colors">✕</button>
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
                <p className="font-bold text-ds-dark mb-1">No designs saved yet</p>
                <p className="text-ds-body text-sm mb-4">Go to Studio, configure a product and save your design — it&apos;ll appear here.</p>
                <a href="/studio" className="px-5 py-2.5 rounded-full bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors inline-block">
                  Open Studio →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {designs.map((d) => (
                  <button key={d.id} onClick={() => pickDesign(d)}
                    className="text-left rounded-2xl border-2 border-black/[0.06] hover:border-orange-300 hover:bg-brand-8 transition-all overflow-hidden group">
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
                      <p className="font-bold text-ds-dark text-xs group-hover:text-brand-dark transition-colors truncate">{d.product_name}</p>
                      <p className="text-[10px] text-ds-muted mt-0.5">{d.color_name} · {d.gsm}</p>
                      <p className="text-[10px] text-ds-body font-bold mt-0.5">Cost ₹{d.blank_price + (d.print_price ?? 0)}</p>
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
            <div className="md:w-64 flex-shrink-0 bg-ds-light-gray flex flex-col items-center justify-center p-6 gap-4">
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
                <p className="font-bold text-ds-dark text-sm">{selected.product_name}</p>
                <p className="text-xs text-ds-muted">{selected.color_name}</p>
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex-1 p-6 space-y-5">
              {/* Sizes */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-2">Sizes to offer</p>
                {catalog ? (
                  <div className="flex gap-1.5 flex-wrap">
                    {catalog.sizes.map((s) => (
                      <button key={s} onClick={() => toggleSize(s)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${sizes.includes(s) ? "bg-ds-dark text-white" : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ds-muted">Product type not found in catalog</p>
                )}
              </div>

              {/* Product photo */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Product photo <span className="text-ds-muted font-normal normal-case">(optional — overrides design thumbnail)</span></p>
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${imageFile ? "border-zinc-300 bg-ds-light-gray" : "border-black/[0.06] hover:border-orange-300 hover:bg-brand-8"}`}>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                    e.target.value = "";
                  }} />
                  <svg className="w-5 h-5 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <span className="text-xs text-ds-body">
                    {imageFile ? imageFile.name : "Upload a lifestyle or product photo"}
                  </span>
                </label>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Description</p>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell fans about this piece — the story, the collab, the vibe…"
                  rows={3} className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-bold text-ds-body uppercase tracking-widest mb-1">Retail price (₹)</p>
                <div className="flex items-center gap-2 mb-2 text-xs text-ds-muted">
                  <span>Cost ₹{totalCost} + ₹50 fulfillment</span>
                  <span className="text-zinc-200">·</span>
                  <span className={`font-semibold ${margin >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {margin >= 0 ? `You keep ₹${margin}/unit` : "Below minimum"}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-body font-bold text-sm">₹</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={totalCost + 50}
                    className="w-full pl-7 pr-4 py-3 rounded-xl border border-black/[0.06] text-sm font-bold outline-none focus:border-zinc-900 transition-colors" />
                </div>
              </div>

              {err && <p className="text-red-500 text-xs font-bold">{err}</p>}

              <button onClick={handleSubmit} disabled={saving}
                className="w-full py-4 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
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


type PayoutStats = {
  totalEarned: number;
  pendingPayout: number;
  nextPayoutDate: string | null;
  lastPayoutDate: string | null;
};

function PayoutBanner({ userId }: { userId: string | null }) {
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetch(`/api/stores/payout-stats?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const fmt = (n: number) =>
    `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) return (
    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 mb-6 animate-pulse">
      <div className="h-4 w-40 bg-emerald-100 rounded mb-3" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map((i) => <div key={i} className="h-12 bg-emerald-100 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border mb-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderColor: "#bbf7d0" }}
    >
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <p className="text-sm font-bold text-emerald-800">Your Earnings</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Payouts every 2 weeks
        </span>
      </div>

      <div className="grid grid-cols-3 gap-px bg-emerald-100 mx-5 mb-5 mt-3 rounded-xl overflow-hidden">
        <div className="bg-white px-4 py-3 rounded-l-xl">
          <p className="text-[10px] font-bold text-ds-muted uppercase tracking-wider mb-1">Total Earned</p>
          <p className="text-xl font-semibold text-ds-dark">{fmt(stats?.totalEarned ?? 0)}</p>
          <p className="text-[10px] text-ds-muted mt-0.5">all time</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Pending Payout</p>
          <p className="text-xl font-semibold text-amber-600">{fmt(stats?.pendingPayout ?? 0)}</p>
          <p className="text-[10px] text-ds-muted mt-0.5">will be transferred</p>
        </div>
        <div className="bg-white px-4 py-3 rounded-r-xl">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Next Payout</p>
          <p className="text-base font-semibold text-emerald-700">{fmtDate(stats?.nextPayoutDate ?? null)}</p>
          <p className="text-[10px] text-ds-muted mt-0.5">direct to bank</p>
        </div>
      </div>

      {(stats?.pendingPayout ?? 0) > 0 && (
        <div className="px-5 pb-4">
          <div className="bg-emerald-700 text-white rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-base">🎉</span>
            <p className="text-xs font-semibold leading-relaxed">
              <strong>{fmt(stats!.pendingPayout)}</strong> is on its way to your bank account on{" "}
              <strong>{fmtDate(stats!.nextPayoutDate)}</strong>. Your money is real and coming — no action needed.
            </p>
          </div>
        </div>
      )}

      {(stats?.pendingPayout ?? 0) === 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs text-emerald-700 bg-white/60 rounded-xl px-4 py-2.5 leading-relaxed">
            Earnings from delivered store orders are transferred to your registered bank account on the <strong>15th and last day</strong> of every month. Add your bank account in <strong>Account Settings</strong> to receive payouts.
          </p>
        </div>
      )}
    </motion.div>
  );
}

function StoresTab({ userId }: { userId: string | null }) {
  const { limit: subLimit } = useSubscription();
  const storefrontLimit = subLimit("storefronts");
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

  // No store yet — launch CTA (or locked gate)
  if (!store && !showCreate) return (
    <div>
      <h2 className="text-2xl font-semibold text-ds-dark mb-6" style={{ letterSpacing: "-0.04em" }}>My Store</h2>
      {storefrontLimit === 0 ? (
        <LockedFeatureCard
          heading="Storefront not available on this plan"
          body="Create a public merch store — add products with your own pricing and share a link with your fans. Upgrade to get your storefront."
          requiredPlan="launch"
        />
      ) : (
        <div className="bg-ds-dark rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="font-semibold text-white text-xl mb-2" style={{ letterSpacing: "-0.04em" }}>Launch your merch store</h3>
            <p className="text-ds-muted text-sm max-w-sm mx-auto mb-6">
              Create a public storefront, add your products with custom pricing, and share the link with your fans. We handle print, pack, and ship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              {["No inventory", "On-demand fulfillment", "You keep the margin"].map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-ds-muted text-xs font-semibold">
                  <span className="text-green-400">✓</span>{f}
                </div>
              ))}
            </div>
            <button onClick={() => setShowCreate(true)}
              className="px-8 py-3 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors">
              Create your store →
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Create store form
  if (showCreate) return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setShowCreate(false)} className="text-ds-muted hover:text-ds-body text-sm">← Back</button>
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Create Store</h2>
      </div>
      <div className="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Store handle *</label>
            <div className="flex items-center border border-black/[0.06] rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
              <span className="px-3 py-2.5 text-ds-muted text-sm border-r border-black/[0.06] bg-ds-light-gray font-mono">halftone.in/store/</span>
              <input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name" required pattern="[a-z0-9-]+"
                className="flex-1 px-3 py-2.5 text-sm font-mono outline-none" />
            </div>
            <p className="text-xs text-ds-muted mt-1">Lowercase letters, numbers, hyphens only</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Display name *</label>
            <input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Kevin Abstract" required
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Bio / description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell your fans what this store is about…" rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-ds-body uppercase tracking-widest mb-1.5">Instagram handle</label>
            <div className="flex items-center border border-black/[0.06] rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
              <span className="px-3 py-2.5 text-ds-muted text-sm border-r border-black/[0.06] bg-ds-light-gray">@</span>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value.replace("@", ""))} placeholder="yourhandle"
                className="flex-1 px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          {createErr && <p className="text-red-500 text-xs font-bold">{createErr}</p>}
          <button type="submit" disabled={creating}
            className="w-full py-3 rounded-xl bg-ds-dark text-white font-bold text-sm hover:bg-ds-dark2 disabled:opacity-40 transition-colors">
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

      {/* Payout clarity banner */}
      <PayoutBanner userId={userId} />

      {/* Store header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>{store!.artist_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-brand font-bold hover:underline font-mono">
              /store/{store!.handle} ↗
            </a>
            <button onClick={() => { navigator.clipboard.writeText(storeUrl); }}
              className="text-xs text-ds-muted hover:text-ds-body transition-colors">Copy link</button>
          </div>
        </div>
        <button onClick={startEdit}
          className="px-4 py-2 rounded-xl border border-black/[0.06] text-sm font-bold hover:bg-ds-light-gray transition-colors">
          Edit store
        </button>
      </div>

      {/* Edit store inline form */}
      {editingStore && (
        <form onSubmit={handleSaveStore} className="bg-ds-light-gray rounded-2xl p-5 mb-6 space-y-3">
          <h3 className="font-bold text-ds-dark text-sm">Edit store info</h3>
          <input value={editArtistName} onChange={(e) => setEditArtistName(e.target.value)} placeholder="Display name" required
            className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors" />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Bio / description" rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors resize-none" />
          <div className="flex items-center border border-black/[0.06] rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors bg-white">
            <span className="px-3 py-2.5 text-ds-muted text-sm border-r border-black/[0.06] bg-ds-light-gray">@</span>
            <input value={editInstagram} onChange={(e) => setEditInstagram(e.target.value.replace("@", ""))} placeholder="Instagram handle"
              className="flex-1 px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingStore(false)} className="px-4 py-2 rounded-xl border border-black/[0.06] text-sm font-bold hover:bg-ds-light-gray transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {/* Products section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ds-dark" style={{ letterSpacing: "-0.03em" }}>
          Products <span className="text-ds-muted font-normal text-sm ml-1">{products.length}</span>
        </h3>
        <button onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
          <span className="text-base leading-none">+</span> Push to store
        </button>
      </div>

      {products.length === 0 ? (
        <div className="border-2 border-dashed border-black/[0.06] rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👕</div>
          <p className="text-ds-body text-sm font-semibold mb-1">No products yet</p>
          <p className="text-ds-muted text-xs mb-4">Add your first product to start selling</p>
          <button onClick={() => setShowAddProduct(true)}
            className="px-5 py-2.5 rounded-full bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors">
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
              <div key={p.id} className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden hover:border-black/[0.06] transition-all group flex flex-col">
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
                      className="w-7 h-7 rounded-full bg-white/90 text-ds-body hover:text-ds-dark text-xs flex items-center justify-center shadow-sm transition-colors">
                      {isEditing ? "✕" : "✏️"}
                    </button>
                    <button onClick={() => removeProduct(p.id)}
                      className="w-7 h-7 rounded-full bg-white/90 text-ds-muted hover:text-red-500 hover:bg-white text-xs flex items-center justify-center shadow-sm transition-colors">
                      🗑
                    </button>
                  </div>
                </div>

                {/* Card body */}
                {isEditing ? (
                  <div className="p-4 space-y-3 flex-1">
                    <p className="text-xs font-bold text-ds-dark">{p.product_name} · {p.color_name}</p>

                    {/* Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-ds-muted uppercase tracking-widest mb-1">Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ds-muted text-xs">₹</span>
                        <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                          min={p.cost_price_inr + 50}
                          className="w-full pl-6 pr-3 py-2 rounded-lg border border-black/[0.06] text-xs font-bold outline-none focus:border-zinc-900 transition-colors" />
                      </div>
                      <p className="text-[10px] text-ds-muted mt-0.5">Min ₹{p.cost_price_inr + 50}</p>
                    </div>

                    {/* Sizes */}
                    {catalogEntry && (
                      <div>
                        <label className="block text-[10px] font-bold text-ds-muted uppercase tracking-widest mb-1">Sizes</label>
                        <div className="flex gap-1 flex-wrap">
                          {catalogEntry.sizes.map((s) => (
                            <button key={s} onClick={() => toggleEditSize(s)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${editSizes.includes(s) ? "bg-ds-dark text-white" : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-ds-muted uppercase tracking-widest mb-1">Description</label>
                      <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2}
                        placeholder="Short product description…"
                        className="w-full px-2.5 py-2 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-900 transition-colors resize-none" />
                    </div>

                    {/* Image upload */}
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-black/[0.06] hover:border-orange-300 cursor-pointer transition-colors">
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setEditImageFile(f); setEditImagePreview(URL.createObjectURL(f)); }
                        e.target.value = "";
                      }} />
                      <svg className="w-4 h-4 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                      <span className="text-[10px] text-ds-muted">
                        {editImageFile ? `${editImageFile.name}` : "Change product photo"}
                      </span>
                    </label>

                    <button onClick={() => saveEditProduct(p.id, p.cost_price_inr, catalogEntry?.sizes ?? p.sizes)} disabled={editSaving}
                      className="w-full py-2 rounded-xl bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors">
                      {editSaving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-ds-dark text-sm truncate">{p.product_name}</p>
                        <p className="text-xs text-ds-muted">{p.color_name} · {p.print_technique}</p>
                      </div>
                      <p className="font-semibold text-ds-dark text-sm whitespace-nowrap">₹{p.retail_price_inr}</p>
                    </div>
                    {p.description && p.description.trim().length >= 20 ? (
                      <p className="text-xs text-ds-body mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
                        <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <span className="text-[10px] font-semibold text-amber-700">
                          {!p.description || p.description.trim().length === 0 ? "No description — add one to improve conversions" : "Description too short — edit to improve conversions"}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-1 flex-wrap mt-2">
                      {p.sizes.map((s) => (
                        <span key={s} className="text-[10px] font-bold bg-black/[0.05] text-ds-body px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-black/[0.06] flex items-center justify-between mt-3">
                      <span className="text-xs text-ds-muted">Your margin</span>
                      <span className={`text-xs font-semibold ${margin > 0 ? "text-green-600" : "text-red-500"}`}>₹{margin} / unit</span>
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
        <div className="mt-8 bg-ds-dark rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">Your store is live 🎉</p>
            <p className="text-ds-muted text-xs mt-0.5 font-mono">{storeUrl}</p>
          </div>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-brand text-white text-sm font-bold hover:bg-brand-dark transition-colors whitespace-nowrap">
            View store ↗
          </a>
        </div>
      )}
    </div>
  );
}

// ── Invoices Tab ───────────────────────────────────────────────────────────────
type Invoice = {
  id: string;
  invoice_number: string;
  type: string;
  order_id: string | null;
  month: string | null;
  subtotal: number;
  gst_amount: number;
  total: number;
  status: string;
  issued_at: string;
  created_at: string;
};

function InvoicesTab({ userId, email }: { userId: string | null; email: string | null }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    else if (email) params.set("email", email);
    else { setLoading(false); return; }
    fetch(`/api/invoices?${params}`)
      .then((r) => r.json())
      .then((d) => setInvoices(Array.isArray(d) ? d : []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [userId, email]);

  const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const [yearFilter, setYearFilter] = useState<string>("All");
  const availableYears = ["All", ...Array.from(new Set(invoices.map((inv) => new Date(inv.issued_at).getFullYear().toString()))).sort((a, b) => Number(b) - Number(a))];
  const filteredInvoices = yearFilter === "All" ? invoices : invoices.filter((inv) => new Date(inv.issued_at).getFullYear().toString() === yearFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Invoices</h2>
        <p className="text-xs text-ds-muted">GST tax invoices auto-generated for every order</p>
      </div>
      {invoices.length > 0 && availableYears.length > 2 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {availableYears.map((yr) => (
            <button key={yr} onClick={() => setYearFilter(yr)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${yearFilter === yr ? "bg-ds-dark text-white" : "bg-black/[0.05] text-ds-body hover:bg-zinc-200"}`}>
              {yr}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ds-muted py-12 justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          Loading invoices…
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-ds-light-gray flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-bold text-ds-body mb-1">No invoices yet</p>
          <p className="text-sm text-ds-muted">Invoices are generated automatically for every order you place.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 bg-ds-light-gray border-b border-black/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Invoice #</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Date</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Type</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted text-right">Total</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="grid sm:grid-cols-5 grid-cols-2 gap-4 px-6 py-4 hover:bg-ds-light-gray transition-colors items-center">
                <div>
                  <p className="font-bold text-ds-dark text-sm">{inv.invoice_number}</p>
                  <p className="text-[10px] text-ds-muted mt-0.5">GST Invoice</p>
                </div>
                <div>
                  <p className="text-sm text-ds-body">
                    {new Date(inv.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inv.type === "monthly"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-brand-8 text-orange-700"
                  }`}>
                    {inv.type === "monthly" ? "Monthly" : "Per order"}
                  </span>
                </div>
                <div className="text-right">
                  {inv.total === 0 ? (
                    <>
                      <p className="font-semibold text-ds-muted">—</p>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-ds-muted bg-black/[0.05] px-1.5 py-0.5 rounded-full">
                        Test order
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-ds-dark">{fmt(inv.total)}</p>
                      <p className="text-[10px] text-ds-muted">incl. GST {fmt(inv.gst_amount)}</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <a
                    href={`/invoice/${encodeURIComponent(inv.invoice_number)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View / Print
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-violet-50 rounded-2xl border border-violet-100 p-5">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-bold text-violet-900 mb-1">About your invoices</p>
            <p className="text-xs text-violet-700 leading-relaxed">
              A GST tax invoice is automatically created for each order. Monthly consolidated invoices are emailed on the 1st of every month.
              Add your GSTIN in <strong>Account Settings</strong> to have it printed on all future invoices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Password Reset Row ─────────────────────────────────────────────────────────
function PasswordResetRow({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleReset = async () => {
    setSending(true);
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <p className="text-sm text-green-600 font-semibold">✓ Reset link sent to {email}</p>
    );
  }

  return (
    <button
      onClick={handleReset}
      disabled={sending || !email}
      className="text-sm font-semibold text-brand hover:underline disabled:opacity-40 transition-colors"
    >
      {sending ? "Sending…" : "Send password reset email →"}
    </button>
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
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  // Connected accounts
  type Identity = { id: string; provider: string };
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUserIdentities().then(({ data }) => {
      setIdentities((data?.identities ?? []) as Identity[]);
    });
  }, []);

  const handleLinkProvider = async (provider: "google" | "linkedin_oidc") => {
    setLinkingProvider(provider);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${origin}/auth/callback?redirect=/account?tab=settings` },
    });
    if (error) { alert(error.message); setLinkingProvider(null); }
  };

  const handleUnlinkProvider = async (identity: Identity) => {
    if (identities.length <= 1) {
      alert("You must keep at least one login method connected.");
      return;
    }
    setUnlinkingProvider(identity.provider);
    const { error } = await supabase.auth.unlinkIdentity(identity as Parameters<typeof supabase.auth.unlinkIdentity>[0]);
    if (error) { alert(error.message); }
    else { setIdentities((prev) => prev.filter((i) => i.id !== identity.id)); }
    setUnlinkingProvider(null);
  };

  // Bank account state
  const [bankAccount, setBankAccount] = useState({ accountHolderName: "", accountNumber: "", confirmAccountNumber: "", ifscCode: "", bankName: "", accountType: "savings" });
  const [bankMasked, setBankMasked]   = useState<string | null>(null);
  const [bankSaving, setBankSaving]   = useState(false);
  const [bankSaved, setBankSaved]     = useState(false);
  const [bankError, setBankError]     = useState("");
  const [loadingBank, setLoadingBank] = useState(true);

  useEffect(() => {
    if (!userId) { setLoadingBank(false); return; }
    fetch(`/api/profile/bank-account?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setBankMasked(d.account_number_masked ?? null);
          setBankAccount((prev) => ({
            ...prev,
            accountHolderName: d.account_holder_name ?? "",
            ifscCode:          d.ifsc_code          ?? "",
            bankName:          d.bank_name          ?? "",
            accountType:       d.account_type       ?? "savings",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBank(false));
  }, [userId]);

  const handleSaveBank = async () => {
    setBankError("");
    if (!bankAccount.accountNumber || !bankAccount.confirmAccountNumber) {
      setBankError("Please enter and confirm your account number."); return;
    }
    if (bankAccount.accountNumber !== bankAccount.confirmAccountNumber) {
      setBankError("Account numbers do not match."); return;
    }
    if (!bankAccount.ifscCode || !bankAccount.bankName || !bankAccount.accountHolderName) {
      setBankError("Please fill in all required fields."); return;
    }
    setBankSaving(true);
    try {
      const res = await fetch("/api/profile/bank-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...bankAccount }),
      });
      if (res.ok) {
        const masked = "•".repeat(Math.max(0, bankAccount.accountNumber.length - 4)) + bankAccount.accountNumber.slice(-4);
        setBankMasked(masked);
        setBankAccount((prev) => ({ ...prev, accountNumber: "", confirmAccountNumber: "" }));
        setBankSaved(true);
        setTimeout(() => setBankSaved(false), 3000);
      } else {
        const d = await res.json();
        setBankError(d.error ?? "Failed to save.");
      }
    } finally {
      setBankSaving(false);
    }
  };

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
          setGstNumber(d.gst_number ?? "");
          setCompanyName(d.company_name ?? "");
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
          gstNumber,
          companyName,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-black/[0.06] text-sm text-ds-dark placeholder:text-ds-muted focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ds-dark mb-6" style={{ letterSpacing: "-0.04em" }}>Account Settings</h2>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-black/[0.06] divide-y divide-zinc-100 max-w-lg mb-6">
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-1">Name</p>
          <p className="font-bold text-ds-dark">{user?.user_metadata?.name ?? "—"}</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-1">Email</p>
          <p className="font-bold text-ds-dark">{user?.email}</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-2">Password</p>
          <PasswordResetRow email={user?.email ?? ""} />
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ds-muted mb-3">Support</p>
          <a href="mailto:hello@halftonelabs.in" className="text-sm font-bold text-brand hover:underline">hello@halftonelabs.in</a>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-ds-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">Connected Accounts</h3>
            <p className="text-xs text-ds-muted">Link social accounts to sign in faster</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {(["google", "linkedin_oidc"] as const).map((provider) => {
            const connected = identities.find((i) => i.provider === provider);
            const label = provider === "google" ? "Google" : "LinkedIn";
            const icon = provider === "google" ? (
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><rect width="18" height="18" rx="3" fill="#0A66C2"/><path d="M4.5 7H6.5V13.5H4.5V7ZM5.5 4C4.95 4 4.5 4.45 4.5 5 4.5 5.55 4.95 6 5.5 6 6.05 6 6.5 5.55 6.5 5 6.5 4.45 6.05 4 5.5 4Z" fill="white"/><path d="M8 7H9.9V7.9C10.2 7.35 10.95 7 11.75 7 13.4 7 14 8.05 14 9.65V13.5H12V10.1C12 9.4 11.75 9 11.1 9 10.4 9 10 9.45 10 10.1V13.5H8V7Z" fill="white"/></svg>
            );
            return (
              <div key={provider} className="flex items-center justify-between p-3.5 rounded-xl border border-black/[0.06] bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <p className="text-sm font-semibold text-ds-dark">{label}</p>
                    <p className="text-xs text-ds-muted">{connected ? "Connected" : "Not connected"}</p>
                  </div>
                </div>
                {connected ? (
                  <button
                    onClick={() => handleUnlinkProvider(connected)}
                    disabled={!!unlinkingProvider || identities.length <= 1}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-40 transition-colors"
                  >
                    {unlinkingProvider === provider ? "Unlinking…" : "Unlink"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleLinkProvider(provider)}
                    disabled={!!linkingProvider}
                    className="text-xs font-semibold text-brand hover:text-brand-dark disabled:opacity-40 transition-colors"
                  >
                    {linkingProvider === provider ? "Connecting…" : "Connect"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {identities.length <= 1 && (
          <p className="text-xs text-ds-muted mt-3">Add another login method before unlinking this one.</p>
        )}
      </div>

      {/* Currency preference */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-8 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">Display Currency</h3>
            <p className="text-xs text-ds-muted">Prices shown site-wide and at checkout</p>
          </div>
        </div>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                currency === c
                  ? "border-zinc-900 bg-ds-dark text-white"
                  : "border-black/[0.06] text-ds-body hover:border-zinc-400 hover:text-ds-dark"
              }`}
            >
              <span>{CURRENCY_META[c].flag}</span>
              <span>{CURRENCY_META[c].label}</span>
            </button>
          ))}
        </div>
        {currency !== "INR" && (
          <p className="text-xs text-ds-muted mt-3">
            International prices include a 2× margin. GST is not applied at checkout for non-INR orders.
          </p>
        )}
      </div>

      {/* Referral Program */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">Referral Program</h3>
            <p className="text-xs text-ds-muted">Share your code — earn 5% store credit on every referral</p>
          </div>
        </div>
        <p className="text-sm text-ds-body mb-4 leading-relaxed">
          Share your link with other artists. They get <strong className="text-ds-dark">5% off</strong> their first order — you earn <strong className="text-ds-dark">5% store credit</strong> automatically.
        </p>
        {referralCode ? (
          <div className="flex gap-2">
            <div className="flex-1 bg-ds-light-gray border border-black/[0.06] rounded-xl px-4 py-2.5 font-mono text-sm text-ds-body truncate">
              halftonelabs.in/studio?ref={referralCode}
            </div>
            <button onClick={copyReferral}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${referralCopied ? "bg-green-500 text-white" : "bg-ds-dark text-white hover:bg-ds-dark2"}`}>
              {referralCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <div className="bg-ds-light-gray rounded-xl px-4 py-3 text-sm text-ds-muted">
            {userId ? "Generating your code…" : "Log in to get your referral code"}
          </div>
        )}
        <p className="text-xs text-ds-muted mt-3">Credits are applied automatically after the referred order ships.</p>
      </div>

      {/* GST / Billing Info */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">GST / Billing Details</h3>
            <p className="text-xs text-ds-muted">Added to all your GST tax invoices</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Company / Business name <span className="text-ds-muted normal-case">(optional)</span></label>
            <input className={inputCls} placeholder="e.g. Acme Designs Pvt. Ltd." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">GSTIN <span className="text-ds-muted normal-case">(optional — 15 char GST number)</span></label>
            <input className={inputCls} placeholder="e.g. 27XXXXX" value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} maxLength={15} />
          </div>
          <p className="text-xs text-ds-muted leading-relaxed">
            If you have a GST number, it will appear on your invoices. Invoices are auto-generated for every order and available in the <strong className="text-ds-body">Invoices</strong> tab.
          </p>
        </div>
      </div>

      {/* Bank Account for Payouts */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">Bank Account for Payouts</h3>
            <p className="text-xs text-ds-muted">Store sale earnings are transferred here every 2 weeks</p>
          </div>
        </div>

        {bankMasked && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-xs font-bold text-emerald-800">Bank account saved</p>
              <p className="text-xs text-emerald-600 font-mono mt-0.5">{bankAccount.bankName} · {bankMasked}</p>
            </div>
          </div>
        )}

        {loadingBank ? (
          <div className="flex items-center gap-2 text-sm text-ds-muted py-4">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            Loading bank details…
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Account Holder Name *</label>
              <input className={inputCls} placeholder="As per bank records" value={bankAccount.accountHolderName}
                onChange={(e) => setBankAccount({ ...bankAccount, accountHolderName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Account Number *</label>
                <input className={inputCls} type="password" placeholder="Enter account number" value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })} autoComplete="off" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Confirm Account No. *</label>
                <input className={inputCls} placeholder="Re-enter account number" value={bankAccount.confirmAccountNumber}
                  onChange={(e) => setBankAccount({ ...bankAccount, confirmAccountNumber: e.target.value })} autoComplete="off" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">IFSC Code *</label>
                <input className={inputCls} placeholder="e.g. HDFC0001234" value={bankAccount.ifscCode}
                  onChange={(e) => setBankAccount({ ...bankAccount, ifscCode: e.target.value.toUpperCase() })} maxLength={11} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Bank Name *</label>
                <input className={inputCls} placeholder="e.g. HDFC Bank" value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Account Type</label>
              <div className="flex gap-2">
                {["savings", "current"].map((t) => (
                  <button key={t} type="button"
                    onClick={() => setBankAccount({ ...bankAccount, accountType: t })}
                    className={`px-4 py-2 rounded-xl border text-sm font-bold capitalize transition-all ${
                      bankAccount.accountType === t
                        ? "border-zinc-900 bg-ds-dark text-white"
                        : "border-black/[0.06] text-ds-body hover:border-zinc-400"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {bankError && <p className="text-red-500 text-xs font-semibold">{bankError}</p>}
            <button onClick={handleSaveBank} disabled={bankSaving}
              className={`mt-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                bankSaved ? "bg-emerald-500 text-white" : "bg-ds-dark text-white hover:bg-ds-dark2"
              } disabled:opacity-50`}>
              {bankSaving ? "Saving…" : bankSaved ? "✓ Bank account saved!" : bankMasked ? "Update bank account" : "Save bank account"}
            </button>
            <p className="text-xs text-ds-muted leading-relaxed">
              Your bank details are stored securely and used only for transferring your store earnings. We never share this information.
            </p>
          </div>
        )}
      </div>

      {/* Default shipping address */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ds-dark">Default Shipping Address</h3>
            <p className="text-xs text-ds-muted">Pre-filled at checkout for faster ordering</p>
          </div>
        </div>

        {loadingAddr ? (
          <div className="flex items-center gap-2 text-sm text-ds-muted py-4">
            <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            Loading address…
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Full name</label>
                <input className={inputCls} placeholder="Your name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Phone</label>
                <input className={inputCls} placeholder="+91 98765 43210" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Address line 1</label>
              <input className={inputCls} placeholder="Flat / House no, Building" value={addr.address_line1} onChange={(e) => setAddr({ ...addr, address_line1: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Address line 2 <span className="text-ds-muted normal-case">(optional)</span></label>
              <input className={inputCls} placeholder="Street, Area, Landmark" value={addr.address_line2} onChange={(e) => setAddr({ ...addr, address_line2: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">City</label>
                <input className={inputCls} placeholder="Mumbai" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">State</label>
                <input className={inputCls} placeholder="Maharashtra" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">PIN</label>
                <input className={inputCls} placeholder="400001" value={addr.pin} onChange={(e) => setAddr({ ...addr, pin: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Country</label>
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
              className={`mt-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-ds-dark text-white hover:bg-ds-dark2"} disabled:opacity-50`}>
              {saving ? "Saving…" : saved ? "✓ Address saved!" : "Save default address"}
            </button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="max-w-lg mt-8 pt-8 border-t border-black/[0.06]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-3">Account actions</p>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

type UserOrg = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  role: string;
  owner_id: string;
  description: string | null;
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const { count } = useCart();
  const { plan } = useSubscription();
  const [user,        setUser]        = useState<{ id: string; email: string; user_metadata: { name?: string } } | null>(null);
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<ActiveTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);

  // Org context
  const [userOrgs,         setUserOrgs]         = useState<UserOrg[]>([]);
  const [activeOrg,        setActiveOrg]        = useState<UserOrg | null>(null);
  const [showOrgSwitcher,  setShowOrgSwitcher]  = useState(false);
  const [showOrgSettings,  setShowOrgSettings]  = useState(false);
  const [showCreateOrg,    setShowCreateOrg]    = useState(false);
  const [showUserMenu,     setShowUserMenu]     = useState(false);
  const [newOrgName,       setNewOrgName]       = useState("");
  const [newOrgSlug,       setNewOrgSlug]       = useState("");
  const [newOrgDesc,       setNewOrgDesc]       = useState("");
  const [creatingOrg,      setCreatingOrg]      = useState(false);
  const [createOrgError,   setCreateOrgError]   = useState("");

  // Handle redirect back from Shopify OAuth or tab param in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab    = params.get("tab") as ActiveTab | null;
    const shopify = params.get("shopify");
    if (tab && ["dashboard","orders","designs","drops","branding","stores","shopify","create-order","customers","designer","wallet","invoices","settings","billing"].includes(tab)) {
      setActiveTab(tab);
    }
    if (shopify === "connected" || shopify === "error") {
      setActiveTab("shopify");
    }
    // Clean URL without reloading
    if (tab || shopify) {
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
    }
  }, []);

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

  // Fetch orgs once user loads
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/organizations?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setUserOrgs(d); })
      .catch(() => {});
  }, [user?.id]);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setCreatingOrg(true); setCreateOrgError("");
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name: newOrgName, slug: newOrgSlug, description: newOrgDesc || null }),
    });
    const d = await res.json();
    if (!res.ok) { setCreateOrgError(d.error ?? "Failed"); setCreatingOrg(false); return; }
    setUserOrgs((prev) => [...prev, d]);
    setActiveOrg(d);
    setShowCreateOrg(false);
    setNewOrgName(""); setNewOrgSlug(""); setNewOrgDesc("");
    setCreatingOrg(false);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">

          {/* Wordmark */}
          <p className="text-ds-dark font-semibold text-base" style={{ letterSpacing: "-0.05em" }}>
            Halftone
          </p>

          {/* Typewriter container — fixed width so steps() maps cleanly */}
          <div className="overflow-hidden whitespace-nowrap" style={{ width: "34ch" }}>
            <p
              className="text-ds-dark font-semibold whitespace-nowrap border-r-2 border-ds-dark inline-block"
              style={{
                fontSize: "1rem",
                letterSpacing: "-0.025em",
                overflow: "hidden",
                width: 0,
                animation: "hlType 2s steps(34, end) 0.3s forwards, hlBlink 0.75s step-end 0.3s infinite",
              }}
            >
              Building your merch infrastructure
            </p>
          </div>
        </div>

        <style>{`
          @keyframes hlType {
            from { width: 0; }
            to   { width: 34ch; }
          }
          @keyframes hlBlink {
            0%, 100% { border-color: #111111; }
            50%       { border-color: transparent; }
          }
        `}</style>
      </div>
    );
  }

  const initials = (user?.user_metadata?.name ?? user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-ds-light-gray flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 w-64 bg-white border-r border-black/[0.06] flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        {/* Logo */}
        <div className="px-6 h-16 flex items-center border-b border-black/[0.06]">
          <Link href="/" className="text-base font-semibold text-ds-dark" style={{ letterSpacing: "-0.05em" }}>
            Halftone Labs
          </Link>
        </div>

        {/* Org / context switcher */}
        <div className="px-3 py-2 border-b border-black/[0.06] relative">
          <button
            onClick={() => setShowOrgSwitcher((v) => !v)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-ds-light-gray transition-colors"
          >
            {activeOrg ? (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                {activeOrg.name.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-lg bg-black/[0.05] flex items-center justify-center text-ds-muted flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <span className="flex-1 text-left text-xs font-bold text-ds-body truncate">
              {activeOrg ? activeOrg.name : "Personal"}
            </span>
            <svg className="w-3.5 h-3.5 text-ds-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>

          {/* Switcher dropdown */}
          <AnimatePresence>
            {showOrgSwitcher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-3 right-3 top-full mt-1 bg-white border border-black/[0.06] rounded-xl shadow-lg z-50 overflow-hidden"
              >
                {/* Personal */}
                <button
                  onClick={() => { setActiveOrg(null); setShowOrgSwitcher(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-ds-light-gray ${!activeOrg ? "bg-ds-light-gray text-ds-dark" : "text-ds-body"}`}
                >
                  <div className="w-5 h-5 rounded-md bg-zinc-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-ds-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Personal
                  {!activeOrg && <span className="ml-auto text-[10px] text-ds-muted">active</span>}
                </button>
                {/* Orgs */}
                {userOrgs.map((org) => (
                  <button key={org.id}
                    onClick={() => { setActiveOrg(org); setShowOrgSwitcher(false); setActiveTab("dashboard"); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-ds-light-gray ${activeOrg?.id === org.id ? "bg-ds-light-gray text-ds-dark" : "text-ds-body"}`}
                  >
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[9px] font-semibold">
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate text-left">{org.name}</span>
                    <span className="text-[10px] font-normal text-ds-muted capitalize">{org.role}</span>
                    {activeOrg?.id === org.id && <span className="text-[10px] text-ds-muted">active</span>}
                  </button>
                ))}
                {/* Create new org */}
                <div className="border-t border-black/[0.06]">
                  <button
                    onClick={() => { setShowCreateOrg(true); setShowOrgSwitcher(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center text-violet-500 text-xs font-semibold">+</div>
                    New organization
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-0">
          {([
            { label: "Overview", ids: ["dashboard"] },
            { label: "Create",   ids: ["designer", "designs", "drops", "branding"] },
            { label: "Sell",     ids: ["orders", "stores", "shopify", "create-order", "customers"] },
            { label: "Account",  ids: ["wallet", "invoices", "settings", "affiliate"] as ActiveTab[] },
          ] as { label: string; ids: ActiveTab[] }[]).map(({ label, ids }) => (
            <div key={label} className="mb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ds-muted px-3 pt-1 pb-2">{label}</p>
              <div className="flex flex-col gap-0.5">
                {NAV.filter((n) => ids.includes(n.id)).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                      activeTab === item.id ? "bg-ds-dark text-white" : "text-ds-body hover:bg-black/[0.05] hover:text-ds-dark"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-100 text-brand-dark uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Billing nav item */}
        <div className="px-3 pb-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ds-muted px-3 pt-1 pb-2">Plan</p>
          <Link
            href="/account/billing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-ds-body hover:bg-black/[0.05] hover:text-ds-dark transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Billing & Plan
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-t border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ds-dark truncate">{user?.user_metadata?.name ?? "Account"}</p>
              <p className="text-[10px] text-ds-muted truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-black/[0.06] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-black/[0.05] transition-colors">
              <svg className="w-5 h-5 text-ds-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-semibold text-ds-dark capitalize flex items-center gap-2">
              {activeTab === "dashboard" && activeOrg ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-[9px] font-semibold">
                    {activeOrg.name.slice(0, 2).toUpperCase()}
                  </span>
                  {activeOrg.name}
                </span>
              ) : (
                activeTab === "dashboard" ? "Dashboard" : activeTab === "create-order" ? "Create Order" : activeTab === "customers" ? "Customers" : activeTab === "designer" ? "Design Studio" : NAV.find((n) => n.id === activeTab)?.label
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {(plan === "free" || plan === "launch") && (
              <Link
                href="/account/billing"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] text-xs font-semibold text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Upgrade plan
              </Link>
            )}
            <Link href="/studio"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand text-white text-xs font-bold hover:bg-orange-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </Link>

            {/* Cart icon */}
            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-black/[0.05] transition-colors">
              <svg className="w-5 h-5 text-ds-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand text-white text-[10px] font-semibold flex items-center justify-center px-1 leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* User avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((o) => !o)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                title={user?.email}
              >
                {initials}
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden min-w-[200px]"
                    >
                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-ds-dark truncate">{user?.user_metadata?.name ?? "Account"}</p>
                        <p className="text-[10px] text-ds-muted truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { setShowUserMenu(false); setActiveTab("settings"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ds-dark hover:bg-zinc-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Account Settings
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); handleSignOut(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Create org modal */}
        <AnimatePresence>
          {showCreateOrg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
              onClick={(e) => { if (e.target === e.currentTarget) setShowCreateOrg(false); }}>
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-semibold text-ds-dark mb-1" style={{ letterSpacing: "-0.04em" }}>Create Organization</h3>
                <p className="text-xs text-ds-muted mb-5">For labels, agencies, festivals — manage multiple stores from one dashboard.</p>
                <form onSubmit={handleCreateOrg} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Organization name *</label>
                    <input className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors"
                      placeholder="Gully Gang" value={newOrgName} required
                      onChange={(e) => { setNewOrgName(e.target.value); setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")); }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">URL handle *</label>
                    <div className="flex items-center border border-black/[0.06] rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
                      <span className="px-3 py-2.5 text-ds-muted text-xs border-r border-black/[0.06] bg-ds-light-gray font-mono whitespace-nowrap">halftonelabs.in/org/</span>
                      <input className="flex-1 px-3 py-2.5 text-sm font-mono outline-none"
                        placeholder="gully-gang" value={newOrgSlug} required
                        onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ds-muted uppercase tracking-widest block mb-1">Description</label>
                    <textarea className="w-full px-3 py-2.5 rounded-xl border border-black/[0.06] text-sm outline-none focus:border-zinc-900 transition-colors resize-none"
                      rows={2} placeholder="India's premier hip-hop label" value={newOrgDesc}
                      onChange={(e) => setNewOrgDesc(e.target.value)} />
                  </div>
                  {createOrgError && <p className="text-xs text-red-500 font-semibold">{createOrgError}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setShowCreateOrg(false)}
                      className="flex-1 py-2.5 rounded-xl border border-black/[0.06] text-sm font-bold text-ds-body hover:bg-ds-light-gray transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={creatingOrg}
                      className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-40 transition-colors">
                      {creatingOrg ? "Creating…" : "Create org →"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + (activeOrg?.slug ?? "personal")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {activeTab === "dashboard" && !activeOrg && <OverviewTab userId={user?.id ?? ""} userName={user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? ""} onTopUp={() => setActiveTab("wallet")} onTabChange={(tab) => setActiveTab(tab as ActiveTab)} />}
              {activeTab === "dashboard" && activeOrg && !showOrgSettings && (
                <OrgDashboard orgSlug={activeOrg.slug} userId={user?.id ?? ""} onManage={() => setShowOrgSettings(true)} />
              )}
              {activeTab === "dashboard" && activeOrg && showOrgSettings && (
                <OrgSettings org={activeOrg} userId={user?.id ?? ""} onUpdated={(updated) => { setActiveOrg(updated); setUserOrgs((prev) => prev.map((o) => o.id === updated.id ? { ...o, ...updated } : o)); }} onClose={() => setShowOrgSettings(false)} />
              )}
              {activeTab === "orders"    && <OrdersTab orders={orders} user={user} />}
              {activeTab === "designs"   && <DesignsTab userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "drops"     && <DropsTab userId={user?.id ?? ""} />}
              {activeTab === "branding"  && <BrandingTab userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "stores"    && <StoresTab userId={user?.id ?? null} />}
              {activeTab === "shopify"       && <ShopifyTab userId={user?.id ?? ""} />}
              {activeTab === "designer"      && <DesignerTab userId={user?.id ?? ""} />}
              {activeTab === "create-order"  && <CreateOrderTab userId={user?.id ?? ""} userEmail={user?.email ?? ""} />}
              {activeTab === "customers"     && <CustomersTab userId={user?.id ?? ""} />}
              {activeTab === "wallet"        && <WalletTab userId={user?.id ?? ""} />}
              {activeTab === "invoices"  && <InvoicesTab userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "settings"  && <SettingsTab user={user} onSignOut={handleSignOut} userId={user?.id ?? null} email={user?.email ?? null} />}
              {activeTab === "affiliate" && <AffiliateTab userId={user?.id ?? ""} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

// ── Affiliate Tab ──────────────────────────────────────────────────────────────

type AffiliateRecord = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  code: string;
  status: "pending" | "approved" | "rejected" | "paused";
  total_clicks: number;
  total_signups: number;
  total_earned: number;
  pending_payout: number;
  paid_out: number;
  created_at: string;
};

type AffiliateReferral = {
  id: string;
  type: string;
  amount: number;
  commission: number;
  status: string;
  description: string | null;
  created_at: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.05] hover:bg-black/[0.09] text-xs font-semibold text-ds-body transition-colors flex-shrink-0"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function AffiliateTab({ userId }: { userId: string }) {
  const [affiliate, setAffiliate] = useState<AffiliateRecord | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoadingStats(true);
    fetch(`/api/affiliate/stats?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setAffiliate(d.affiliate ?? null);
        setReferrals(d.referrals ?? []);
        setStats({
          totalEarnings: d.totalEarnings ?? 0,
          pendingEarnings: d.pendingEarnings ?? 0,
          paidEarnings: d.paidEarnings ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, [userId]);

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    // In a real app, this would call a payout request API.
    // For now, show a simple alert.
    await new Promise((r) => setTimeout(r, 800));
    alert("Payout request sent! We'll process within 3–5 business days.");
    setRequestingPayout(false);
  };

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Not enrolled yet (shouldn't happen for new users, but handle gracefully) ──
  if (!affiliate) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-sm font-semibold text-ds-body mb-1">Setting up your affiliate account…</p>
          <p className="text-xs text-ds-muted">This usually happens automatically. Try refreshing.</p>
        </div>
      </div>
    );
  }

  // ── Approved dashboard ──
  const referralLink = `https://halftonelabs.in?ref=${affiliate.code}`;
  const minPayout = 500;
  const canRequestPayout = affiliate.pending_payout >= minPayout;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
            Affiliate Dashboard
          </h2>
          <p className="text-ds-body text-sm mt-1">Track your referrals and earnings in real-time.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
          Active
        </span>
      </div>

      {/* Referral link */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
        <p className="text-xs font-bold text-ds-muted uppercase tracking-widest mb-2">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm font-mono text-ds-dark bg-ds-light-gray rounded-xl px-4 py-2.5 truncate">
            {referralLink}
          </code>
          <CopyButton text={referralLink} />
        </div>
        <p className="text-xs text-ds-muted mt-2">
          Share this link anywhere. Anyone who signs up through it is attributed to you for 30 days.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Link Clicks", val: affiliate.total_clicks.toLocaleString("en-IN"), accent: "text-blue-600" },
          { label: "Signups", val: affiliate.total_signups.toLocaleString("en-IN"), accent: "text-violet-600" },
          { label: "Total Earned", val: `₹${stats.totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, accent: "text-emerald-600" },
          { label: "Pending Payout", val: `₹${stats.pendingEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, accent: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-black/[0.06] px-4 py-4">
            <p className={`text-2xl font-semibold ${s.accent}`} style={{ letterSpacing: "-0.04em" }}>{s.val}</p>
            <p className="text-xs text-ds-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Commission rates reminder */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
        <p className="text-xs font-bold text-ds-muted uppercase tracking-widest mb-3">Commission Rates</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-ds-light-gray rounded-xl p-3">
            <p className="font-bold text-ds-dark">5%</p>
            <p className="text-xs text-ds-muted mt-0.5">Per order value</p>
          </div>
          <div className="bg-ds-light-gray rounded-xl p-3">
            <p className="font-bold text-ds-dark">₹500–₹5,000</p>
            <p className="text-xs text-ds-muted mt-0.5">Per subscription</p>
          </div>
          <div className="bg-ds-light-gray rounded-xl p-3">
            <p className="font-bold text-ds-dark">10% × 12 mo</p>
            <p className="text-xs text-ds-muted mt-0.5">Recurring monthly</p>
          </div>
        </div>
      </div>

      {/* Recent referrals table */}
      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-black/[0.06]">
          <p className="text-xs font-bold text-ds-muted uppercase tracking-widest">Recent Referrals</p>
        </div>
        {referrals.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-ds-body">No referrals yet</p>
            <p className="text-xs text-ds-muted mt-1">Share your link to start earning.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ds-light-gray">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-ds-muted">Type</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-ds-muted">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-ds-muted">Commission</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-ds-muted">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-ds-muted">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-ds-light-gray transition-colors">
                    <td className="px-5 py-3 font-semibold text-ds-dark capitalize">{r.type}</td>
                    <td className="px-5 py-3 text-right text-ds-body">
                      ₹{Number(r.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">
                      +₹{Number(r.commission).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                        r.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ds-muted">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout button */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-black/[0.06] p-5">
        <div>
          <p className="font-semibold text-ds-dark text-sm">Request Payout</p>
          <p className="text-xs text-ds-muted mt-0.5">
            {canRequestPayout
              ? `₹${stats.pendingEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })} available`
              : `Minimum ₹${minPayout} required — you have ₹${stats.pendingEarnings.toFixed(2)}`}
          </p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={!canRequestPayout || requestingPayout}
          className="px-5 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors disabled:opacity-40"
        >
          {requestingPayout ? "Requesting…" : "Request Payout →"}
        </button>
      </div>
    </div>
  );
}
