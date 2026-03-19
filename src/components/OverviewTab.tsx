"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LearnLink from "@/components/LearnLink";

type DashboardData = {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  bestSeller: string | null;
  walletBalance: number;
  walletCurrency: string;
  shopifyConnected: boolean;
  weeklyRevenue: number[];
  recentOrders: {
    id: string;
    ref: string;
    product_name: string;
    color: string;
    size: string;
    total: number;
    status: string;
    created_at: string;
  }[];
};

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  "Order Placed":     { pill: "bg-brand-8 text-brand",       dot: "bg-brand" },
  "Design Confirmed": { pill: "bg-brand-8 text-brand",       dot: "bg-brand" },
  "In Production":    { pill: "bg-orange-100 text-orange-700",     dot: "bg-orange-500" },
  "Quality Check":    { pill: "bg-orange-100 text-orange-700",     dot: "bg-orange-500" },
  "Shipped":          { pill: "bg-blue-100 text-blue-700",         dot: "bg-blue-500" },
  "Delivered":        { pill: "bg-green-100 text-green-700",       dot: "bg-green-500" },
  "Cancelled":        { pill: "bg-black/[0.05] text-ds-muted",     dot: "bg-zinc-300" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number, currency: string) {
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  return `${symbol}${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = diff / 3600000;
  if (hours < 1) return "Just now";
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getDayLabel(daysAgo: number) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-5 animate-pulse">
      <div className="h-2.5 w-20 bg-black/[0.07] rounded-full mb-4" />
      <div className="h-8 w-28 bg-black/[0.07] rounded-full mb-2" />
      <div className="h-2.5 w-16 bg-black/[0.05] rounded-full" />
    </div>
  );
}

// ── Interactive sparkline ─────────────────────────────────────────────────────
function Sparkline({ data, currency }: { data: number[]; currency: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxVal = Math.max(...data, 1);
  const hasData = data.some((v) => v > 0);

  return (
    <div className="relative" ref={containerRef}>
      {/* Tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 bg-ds-dark text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10"
          >
            <p className="text-white/60 text-[9px] leading-tight">{getDayLabel(6 - hovered)}</p>
            <p className="leading-tight">{formatCurrency(data[hovered], currency)}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bars */}
      <div className="flex items-end gap-0.5 h-10 w-24">
        {data.map((val, i) => {
          const heightPct = maxVal > 0 ? Math.max((val / maxVal) * 100, hasData ? 4 : 20) : 20;
          const isHovered = hovered === i;
          const isToday = i === data.length - 1;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm cursor-pointer transition-all duration-150"
              style={{
                height: `${heightPct}%`,
                background: isHovered
                  ? "rgba(158,108,158,0.9)"
                  : isToday
                  ? "rgba(158,108,158,0.55)"
                  : "rgba(158,108,158,0.22)",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </div>
      <p className="text-[9px] text-ds-muted mt-1 text-right tracking-wide">last 7 days</p>
    </div>
  );
}

// ── Trend badge ───────────────────────────────────────────────────────────────
function TrendUp() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      Live
    </span>
  );
}

// ── Chevron ───────────────────────────────────────────────────────────────────
function Chevron() {
  return (
    <svg className="w-3.5 h-3.5 text-ds-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

type Props = {
  userId: string;
  userName: string;
  onTopUp?: () => void;
  onTabChange?: (tab: string) => void;
};

export default function OverviewTab({ userId, userName, onTopUp, onTabChange }: Props) {
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const currency      = data?.walletCurrency ?? "INR";
  const weeklyRevenue = data?.weeklyRevenue ?? Array(7).fill(0);
  const pendingCount  = data?.pendingOrders ?? 0;

  return (
    <div className="space-y-4">

      {/* ── Greeting row (compact) ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <h1 className="text-base font-bold text-ds-dark" style={{ letterSpacing: "-0.03em" }}>
          {getGreeting()}, {userName || "there"} 👋
        </h1>

        {/* Wallet chip */}
        {!loading && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onTopUp ?? (() => {})}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-black/[0.06] rounded-full hover:border-brand-30 hover:bg-brand-3 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">💰</div>
            <span className="text-xs font-bold text-ds-dark">{formatCurrency(data?.walletBalance ?? 0, currency)}</span>
            <span className="text-[10px] text-ds-muted">wallet</span>
            <span className="text-[10px] font-bold text-brand">Top up →</span>
          </motion.button>
        )}
      </motion.div>

      {/* ── Fulfillment alert ──────────────────────────────────────────── */}
      <AnimatePresence>
        {!loading && pendingCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            onClick={() => onTabChange?.("orders")}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-300 hover:bg-amber-100 transition-all text-left"
          >
            <span className="text-base flex-shrink-0">⏳</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-800">
                {pendingCount} order{pendingCount > 1 ? "s" : ""} awaiting fulfillment
              </p>
              <p className="text-[10px] text-amber-600">Review and action now</p>
            </div>
            <svg className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── KPI cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            {/* Total Revenue — clickable */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              onClick={() => onTabChange?.("orders")}
              className="group text-left bg-white border border-black/[0.06] rounded-2xl p-5 relative overflow-hidden hover:border-black/[0.12] hover:shadow-sm transition-all"
            >
              {/* Sparkline top-right */}
              <div className="absolute top-4 right-4">
                <Sparkline data={weeklyRevenue} currency={currency} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-ds-dark leading-tight pr-28" style={{ letterSpacing: "-0.04em" }}>
                {formatCurrency(data?.totalRevenue ?? 0, currency)}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[10px] text-ds-muted">all time · all orders</p>
                <Chevron />
              </div>
            </motion.button>

            {/* Total Orders — clickable */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              onClick={() => onTabChange?.("orders")}
              className="group text-left bg-white border border-black/[0.06] rounded-2xl p-5 hover:border-black/[0.12] hover:shadow-sm transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-ds-dark leading-tight" style={{ letterSpacing: "-0.04em" }}>
                {data?.totalOrders ?? 0}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[10px] text-ds-muted">click to filter by status</p>
                <Chevron />
              </div>
            </motion.button>

            {/* Today's Sales */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className={`rounded-2xl p-5 border transition-colors ${
                (data?.todayOrders ?? 0) > 0
                  ? "bg-brand-5 border-brand-20"
                  : "bg-white border-black/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Today&apos;s Sales</p>
                {(data?.todayOrders ?? 0) > 0 && <TrendUp />}
              </div>
              <p
                className={`text-2xl font-bold leading-tight ${(data?.todayOrders ?? 0) > 0 ? "text-brand" : "text-ds-muted"}`}
                style={{ letterSpacing: "-0.04em" }}
              >
                {data?.todayOrders ?? 0}
              </p>
              <p className={`text-[10px] mt-1.5 ${(data?.todayOrders ?? 0) > 0 ? "text-brand-60" : "text-ds-muted"}`}>
                {(data?.todayOrders ?? 0) > 0
                  ? `${formatCurrency(data?.todayRevenue ?? 0, currency)} revenue today`
                  : "No sales yet today — share your store"}
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* ── Best seller ───────────────────────────────────────────────── */}
      {!loading && data?.bestSeller && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3"
        >
          <span className="text-xl flex-shrink-0">🏆</span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Best Seller</p>
            <p className="text-sm font-semibold text-ds-dark truncate">{data.bestSeller}</p>
          </div>
          <button
            onClick={() => onTabChange?.("orders")}
            className="ml-auto flex-shrink-0 text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors whitespace-nowrap"
          >
            See orders →
          </button>
        </motion.div>
      )}

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap gap-2 items-center"
      >
        <Link
          href="/studio"
          className="btn-brand text-sm"
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Design
        </Link>
        <button
          onClick={() => onTabChange?.("shopify")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] text-ds-body text-xs font-semibold hover:border-black/20 hover:text-ds-dark transition-all"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.337 23.979l6.163-1.098-2.256-15.21a.345.345 0 00-.34-.29s-.243.005-.243.005-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098z"/>
          </svg>
          Shopify Orders
        </button>
        <button
          onClick={() => onTabChange?.("drops")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] text-ds-body text-xs font-semibold hover:border-black/20 hover:text-ds-dark transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          My Drops
        </button>
        <LearnLink
          href="/academy/how-to-launch-your-first-merch-drop"
          label="Launch guide"
          type="academy"
        />
      </motion.div>

      {/* ── Recent Orders ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden"
      >
        {/* Table header */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-ds-dark">Recent Orders</h2>
          <button
            onClick={() => onTabChange?.("orders")}
            className="text-xs font-bold text-brand hover:text-brand-dark transition-colors"
          >
            View all →
          </button>
        </div>

        {/* Column labels */}
        {!loading && (data?.recentOrders?.length ?? 0) > 0 && (
          <div className="px-5 py-2 border-b border-black/[0.04] bg-ds-light-gray grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted">Order / Product</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted hidden sm:block">Date</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted hidden sm:block">Status</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ds-muted text-right">Amount</span>
          </div>
        )}

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-black/[0.04] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !data?.recentOrders?.length ? (
          <div className="px-5 py-12 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <p className="text-sm font-semibold text-ds-dark mb-1">No orders yet</p>
            <p className="text-xs text-ds-muted mb-4">Head to Studio to design and place your first order.</p>
            <Link href="/studio" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
              Open Studio →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {data.recentOrders.map((order) => {
              const sc     = STATUS_STYLES[order.status] ?? STATUS_STYLES["Order Placed"];
              const isZero = order.total === 0;
              const isCancelled = order.status === "Cancelled";
              return (
                <button
                  key={order.id}
                  onClick={() => onTabChange?.("orders")}
                  className="w-full text-left px-5 py-3.5 grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center hover:bg-ds-light-gray transition-colors group"
                >
                  {/* Order + product */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ds-dark truncate">
                        {order.ref || order.id.slice(0, 8).toUpperCase()}
                      </p>
                      {/* Status pill on mobile only */}
                      <span className={`flex-shrink-0 sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-ds-muted truncate mt-0.5">
                      {order.product_name}{order.color ? ` · ${order.color}` : ""}
                    </p>
                  </div>

                  {/* Date column */}
                  <span className="hidden sm:block text-[11px] text-ds-muted whitespace-nowrap flex-shrink-0">
                    {formatDate(order.created_at)}
                  </span>

                  {/* Status pill — desktop */}
                  <span className={`hidden sm:inline-flex flex-shrink-0 items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {order.status}
                  </span>

                  {/* Amount + tags */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className={`text-sm font-semibold block ${isZero ? "text-ds-muted" : "text-ds-dark"}`}>
                        {isZero ? "—" : formatCurrency(order.total, currency)}
                      </span>
                      {isZero && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-ds-muted">
                          {isCancelled ? "Cancelled" : "Test order"}
                        </span>
                      )}
                    </div>
                    <Chevron />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Shopify status line ────────────────────────────────────────── */}
      <AnimatePresence>
        {!loading && data?.shopifyConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-black/[0.06] bg-white"
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#96bf48" }}>
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.337 23.979l6.163-1.098-2.256-15.21a.345.345 0 00-.34-.29s-.243.005-.243.005-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098z"/>
              </svg>
            </div>
            <p className="text-xs font-semibold text-ds-body">Shopify connected</p>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">✓ Active</span>
            <button
              onClick={() => onTabChange?.("shopify")}
              className="ml-auto text-[10px] font-bold text-ds-muted hover:text-ds-body transition-colors"
            >
              View orders →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600 flex items-center gap-3"
          >
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchDashboard} className="ml-auto text-xs font-medium text-red-700 underline">Retry</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
