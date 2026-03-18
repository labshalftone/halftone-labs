"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LearnLink from "@/components/LearnLink";

type DashboardData = {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  todayRevenue: number;
  bestSeller: string | null;
  walletBalance: number;
  walletCurrency: string;
  shopifyConnected: boolean;
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

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":     "bg-purple-100 text-purple-700",
  "Design Confirmed": "bg-purple-100 text-purple-700",
  "In Production":    "bg-orange-100 text-orange-700",
  "Quality Check":    "bg-orange-100 text-orange-700",
  "Shipped":          "bg-blue-100 text-blue-700",
  "Delivered":        "bg-green-100 text-green-700",
  "Cancelled":        "bg-zinc-100 text-zinc-500",
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

function SkeletonCard() {
  return (
    <div className="bg-zinc-100 rounded-2xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-zinc-200 rounded mb-3" />
      <div className="h-8 w-32 bg-zinc-200 rounded mb-1" />
      <div className="h-3 w-16 bg-zinc-200 rounded" />
    </div>
  );
}

type Props = {
  userId: string;
  userName: string;
  onTopUp?: () => void;
};

export default function OverviewTab({ userId, userName, onTopUp }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const currency = data?.walletCurrency ?? "INR";

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-0.5"
      >
        <h1 className="text-2xl font-bold text-zinc-900">
          {getGreeting()}, {userName || "there"} 👋
        </h1>
        <p className="text-sm text-zinc-500">{today}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-zinc-900 leading-tight">
                {formatCurrency(data?.totalRevenue ?? 0, currency)}
              </p>
              <p className="text-xs text-zinc-400 mt-1">all time</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-zinc-900 leading-tight">
                {data?.totalOrders ?? 0}
              </p>
              <p className="text-xs text-zinc-400 mt-1">all time</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Today&apos;s Sales</p>
              <p className="text-2xl font-bold text-zinc-900 leading-tight">
                {data?.todayOrders ?? 0}
              </p>
              <p className="text-xs text-blue-500 mt-1">{formatCurrency(data?.todayRevenue ?? 0, currency)} revenue</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">Best Seller</p>
              <p className="text-base font-bold text-zinc-900 leading-tight line-clamp-2 mt-1">
                {data?.bestSeller ? (
                  <span className="flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>{data.bestSeller}</span>
                  </span>
                ) : (
                  <span className="text-zinc-400 text-sm">No orders yet</span>
                )}
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Wallet banner */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg">
                💰
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Wallet</p>
                <p className="text-lg font-bold text-zinc-900">
                  {formatCurrency(data?.walletBalance ?? 0, currency)} available
                </p>
              </div>
            </div>
            <button
              onClick={onTopUp ?? (() => {})}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              Top up <span>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2 items-center"
      >
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Design
        </Link>
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-sm font-medium hover:bg-zinc-200 transition-colors border border-zinc-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Open Studio
        </Link>
        <button
          onClick={() => {
            const el = document.querySelector('[data-tab="shopify"]') as HTMLElement | null;
            el?.click();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-sm font-medium hover:bg-zinc-200 transition-colors border border-zinc-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.337 23.979l6.163-1.098-2.256-15.21a.345.345 0 00-.34-.29s-.243.005-.243.005-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
          </svg>
          View Shopify Orders
        </button>
        <LearnLink
          href="/academy/how-to-launch-your-first-merch-drop"
          label="Launch guide"
          type="academy"
        />
      </motion.div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">Recent Orders</h2>
          <span className="text-xs text-zinc-400">Last 5</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !data?.recentOrders?.length ? (
          <div className="px-5 py-10 text-center">
            <p className="text-zinc-400 text-sm">No orders yet</p>
            <p className="text-zinc-300 text-xs mt-1">Orders will appear here once placed.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-800 truncate">
                    {order.ref || order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{order.product_name}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-zinc-100 text-zinc-500"}`}>
                  {order.status}
                </span>
                <p className="shrink-0 text-sm font-semibold text-zinc-800">
                  {formatCurrency(order.total, currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Shopify connected banner */}
      <AnimatePresence>
        {!loading && data?.shopifyConnected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl px-5 py-4 border"
            style={{ backgroundColor: "#f4f9e8", borderColor: "#d4e6a0" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#96bf48" }}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.337 23.979l6.163-1.098-2.256-15.21a.345.345 0 00-.34-.29s-.243.005-.243.005-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "#5a7a1a" }}>
              Shopify connected ✓
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600 flex items-center gap-3"
          >
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchDashboard} className="ml-auto text-xs font-medium text-red-700 underline">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
