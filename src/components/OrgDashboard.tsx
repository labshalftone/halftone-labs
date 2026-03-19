"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LearnLink from "@/components/LearnLink";

type StoreStats = {
  id: string;
  handle: string;
  artistName: string;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
};

type OrgDashboardData = {
  org: { id: string; slug: string; name: string; logo_url: string | null; description: string | null };
  totalRevenue: number;
  totalOrders: number;
  activeDrops: number;
  storeCount: number;
  memberCount: number;
  bestStore: string | null;
  stores: StoreStats[];
};

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function SkeletonBar({ w }: { w: string }) {
  return <div className={`h-3 bg-black/[0.05] rounded animate-pulse ${w}`} />;
}

type Props = {
  orgSlug: string;
  userId: string;
  onManage?: () => void;
};

export default function OrgDashboard({ orgSlug, userId, onManage }: Props) {
  const [data, setData] = useState<OrgDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizations/${orgSlug}/dashboard?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load org dashboard");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [orgSlug, userId]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const maxRevenue = Math.max(...(data?.stores ?? []).map((s) => s.totalRevenue), 1);

  return (
    <div className="space-y-6">
      {/* Org header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {data?.org.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.org.logo_url} alt={data.org.name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm">
              {data?.org.name?.slice(0, 2).toUpperCase() ?? "ORG"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>
              {loading ? <span className="inline-block w-36 h-5 bg-black/[0.05] rounded animate-pulse" /> : data?.org.name}
            </h1>
            <p className="text-xs text-ds-muted mt-0.5">Organization dashboard</p>
          </div>
        </div>
        {onManage && (
          <button onClick={onManage}
            className="px-4 py-2 rounded-xl border border-black/[0.06] text-sm font-semibold text-ds-body hover:bg-ds-light-gray transition-colors">
            Manage org
          </button>
        )}
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-ds-light-gray border border-black/[0.06] rounded-2xl p-5 animate-pulse">
                <SkeletonBar w="w-20 mb-3" /><SkeletonBar w="w-28 mb-2" /><SkeletonBar w="w-16" />
              </div>
            ))}
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
              <p className="text-xs font-medium text-violet-500 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-2xl font-semibold text-ds-dark leading-tight">{formatINR(data?.totalRevenue ?? 0)}</p>
              <p className="text-xs text-violet-400 mt-1">across all stores</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-ds-light-gray border border-black/[0.06] rounded-2xl p-5">
              <p className="text-xs font-medium text-ds-body uppercase tracking-wide mb-1">Total Orders</p>
              <p className="text-2xl font-semibold text-ds-dark leading-tight">{data?.totalOrders ?? 0}</p>
              <p className="text-xs text-ds-muted mt-1">all stores combined</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">Stores</p>
              <p className="text-2xl font-semibold text-ds-dark leading-tight">{data?.storeCount ?? 0}</p>
              <p className="text-xs text-blue-400 mt-1">{data?.memberCount ?? 0} members</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-xs font-medium text-amber-500 uppercase tracking-wide mb-1">Best Performer</p>
              <p className="text-base font-semibold text-ds-dark leading-tight line-clamp-2 mt-1">
                {data?.bestStore ? (
                  <span className="flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>{data.bestStore}</span>
                  </span>
                ) : (
                  <span className="text-ds-muted text-sm">No sales yet</span>
                )}
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Per-store breakdown */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-ds-dark">Revenue by Store / Artist</h2>
            <LearnLink href="/academy/how-labels-structure-merch" label="Labels guide" type="academy" size="xs" />
          </div>
          <button onClick={onManage}
            className="text-xs font-semibold text-brand hover:text-violet-800 transition-colors">
            Add store →
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-black/[0.05] rounded" />
                  <div className="h-3 w-16 bg-black/[0.05] rounded" />
                </div>
                <div className="h-2 bg-black/[0.05] rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : !data?.stores.length ? (
          <div className="px-5 py-12 text-center">
            <div className="text-4xl mb-3">🏪</div>
            <p className="text-ds-body text-sm font-semibold mb-1">No stores linked yet</p>
            <p className="text-ds-muted text-xs mb-4">Link artist stores to see combined revenue.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {data.stores
              .slice()
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((store, i) => {
                const barPct = maxRevenue > 0 ? (store.totalRevenue / maxRevenue) * 100 : 0;
                return (
                  <div key={store.id} className="px-5 py-4 hover:bg-ds-light-gray transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                          i === 0 ? "bg-violet-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-amber-500" : "bg-zinc-400"
                        }`}>
                          {store.artistName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <a href={`/store/${store.handle}`} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-bold text-ds-dark hover:text-brand transition-colors truncate block">
                            {store.artistName}
                          </a>
                          <p className="text-[10px] text-ds-muted font-mono">/store/{store.handle}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm font-semibold text-ds-dark">{formatINR(store.totalRevenue)}</p>
                        <p className="text-[10px] text-ds-muted">{store.totalOrders} orders</p>
                      </div>
                    </div>
                    {/* Revenue bar */}
                    <div className="h-1.5 bg-black/[0.05] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          i === 0 ? "bg-violet-400" : i === 1 ? "bg-blue-400" : i === 2 ? "bg-amber-400" : "bg-zinc-300"
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    {store.pendingOrders > 0 && (
                      <p className="text-[10px] text-amber-600 mt-1 font-medium">
                        {store.pendingOrders} order{store.pendingOrders > 1 ? "s" : ""} in production
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </motion.div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600 flex items-center gap-3">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchDashboard} className="ml-auto text-xs font-medium text-red-700 underline">Retry</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
