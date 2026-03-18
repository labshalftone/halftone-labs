"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropBuilder, { type DropDraft } from "./DropBuilder";

type Design = {
  id: string;
  name: string;
  product_name: string;
  color_name: string;
  thumbnail: string | null;
  sku: string | null;
};

type Store = {
  id: string;
  handle: string;
  artist_name: string;
};

type Drop = {
  id: string;
  user_id: string;
  title: string;
  slug: string | null;
  description: string | null;
  status: "draft" | "live" | "scheduled" | "ended";
  launch_at: string | null;
  ended_at: string | null;
  cover_image_url: string | null;
  countdown_enabled: boolean;
  waitlist_enabled: boolean;
  waitlist_count?: number;
  store_id: string | null;
  created_at: string;
  updated_at: string;
  design_count?: number;
};

const STATUS_STRIPE: Record<string, string> = {
  live:       "bg-green-500",
  scheduled:  "bg-blue-500",
  draft:      "bg-zinc-300",
  ended:      "bg-zinc-200",
};

const STATUS_LABEL: Record<string, string> = {
  live:       "bg-green-100 text-green-700",
  scheduled:  "bg-blue-100 text-blue-700",
  draft:      "bg-zinc-100 text-zinc-500",
  ended:      "bg-zinc-100 text-zinc-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_LABEL[status] ?? "bg-zinc-100 text-zinc-500"}`}>
      {status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

type Props = {
  userId: string;
};

export default function DropsTab({ userId }: Props) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "builder">("list");
  const [editingDrop, setEditingDrop] = useState<Drop | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDrops = useCallback(async () => {
    setLoading(true);
    try {
      const [dropsRes, storesRes, designsRes] = await Promise.all([
        fetch(`/api/drops?userId=${encodeURIComponent(userId)}`),
        fetch(`/api/stores?userId=${encodeURIComponent(userId)}`),
        fetch(`/api/designs?userId=${encodeURIComponent(userId)}`),
      ]);
      if (dropsRes.ok) setDrops(await dropsRes.json());
      if (storesRes.ok) setStores(await storesRes.json());
      if (designsRes.ok) setDesigns(await designsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDrops(); }, [fetchDrops]);

  const handleDelete = async (dropId: string) => {
    if (!confirm("Delete this drop? This cannot be undone.")) return;
    setDeletingId(dropId);
    try {
      const res = await fetch(`/api/drops?id=${dropId}&userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete drop");
      setDrops((prev) => prev.filter((d) => d.id !== dropId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (drop: Drop) => {
    const nextStatus = drop.status === "live" ? "ended" : drop.status === "scheduled" ? "live" : drop.status === "draft" ? "live" : "draft";
    try {
      const res = await fetch("/api/drops", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: drop.id, userId, status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setDrops((prev) => prev.map((d) => d.id === drop.id ? { ...d, status: nextStatus as Drop["status"] } : d));
    } catch (e) {
      console.error(e);
    }
  };

  const openBuilder = (drop?: Drop) => {
    setEditingDrop(drop ?? null);
    setMode("builder");
  };

  const closeBuilder = () => {
    setEditingDrop(null);
    setMode("list");
    fetchDrops();
  };

  // Convert a saved drop (API shape) into a partial DropDraft for the builder
  const dropToInitialDraft = (drop: Drop): Partial<DropDraft> => ({
    id: drop.id,
    title: drop.title,
    slug: drop.slug ?? "",
    description: drop.description ?? "",
    coverImageUrl: drop.cover_image_url ?? "",
    storeId: drop.store_id ?? "",
    status: (drop.status === "ended" ? "draft" : drop.status) as "draft" | "scheduled" | "live",
    launchAt: drop.launch_at ? drop.launch_at.slice(0, 16) : "",
    countdownEnabled: drop.countdown_enabled,
    waitlistEnabled: drop.waitlist_enabled,
  });

  // Summary stats
  const liveCount      = drops.filter((d) => d.status === "live").length;
  const scheduledCount = drops.filter((d) => d.status === "scheduled").length;
  const totalCount     = drops.length;

  // Default store handle for drop links
  const defaultStore = stores[0];

  if (mode === "builder") {
    return (
      <DropBuilder
        userId={userId}
        stores={stores}
        designs={designs}
        initialDraft={editingDrop ? dropToInitialDraft(editingDrop) : undefined}
        onSaved={() => closeBuilder()}
        onClose={closeBuilder}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>Drops</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Limited releases, collections & campaigns</p>
        </div>
        <button
          onClick={() => openBuilder()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Drop
        </button>
      </div>

      {/* Summary pills */}
      {!loading && totalCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full">{totalCount} total</span>
          {liveCount > 0 && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {liveCount} live
            </span>
          )}
          {scheduledCount > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {scheduledCount} scheduled
            </span>
          )}
        </motion.div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && drops.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6 bg-gradient-to-b from-zinc-50 to-white rounded-2xl border border-dashed border-zinc-200"
        >
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-zinc-800 font-black text-lg" style={{ letterSpacing: "-0.03em" }}>Launch your first drop</p>
          <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
            Create a limited release, festival merch, or exclusive collection — with countdown, waitlist, and share tools built in.
          </p>
          <button
            onClick={() => openBuilder()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Build a drop
          </button>
        </motion.div>
      )}

      {/* Drops list */}
      <div className="space-y-3">
        <AnimatePresence>
          {drops.map((drop, i) => {
            const store = stores.find((s) => s.id === drop.store_id) ?? defaultStore;
            const dropUrl = store && drop.slug ? `/store/${store.handle}/drop/${drop.slug}` : null;

            return (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 transition-colors group"
              >
                <div className="flex">
                  {/* Status stripe */}
                  <div className={`w-1 flex-shrink-0 ${STATUS_STRIPE[drop.status] ?? "bg-zinc-200"}`} />

                  {/* Cover thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 self-center ml-3 mr-0 my-3 rounded-xl overflow-hidden bg-zinc-100">
                    {drop.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={drop.cover_image_url} alt={drop.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-zinc-900 truncate">{drop.title}</h3>
                          <StatusBadge status={drop.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {drop.design_count !== undefined && (
                            <span className="text-xs text-zinc-400">{drop.design_count} product{drop.design_count !== 1 ? "s" : ""}</span>
                          )}
                          {drop.launch_at && (drop.status === "scheduled" || drop.status === "live") && (
                            <span className="text-xs text-zinc-400">
                              · {drop.status === "scheduled" ? "Launches" : "Launched"} {new Date(drop.launch_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          )}
                          {drop.countdown_enabled && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                              ⏱ Countdown
                            </span>
                          )}
                          {drop.waitlist_enabled && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                              📋 Waitlist {drop.waitlist_count ? `· ${drop.waitlist_count}` : ""}
                            </span>
                          )}
                          {store && (
                            <span className="text-[10px] text-zinc-400 font-mono">/store/{store.handle}</span>
                          )}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Open link */}
                        {dropUrl && (
                          <a
                            href={dropUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                            title="Open drop page"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}

                        {/* Toggle live/end */}
                        {drop.status !== "ended" && (
                          <button
                            onClick={() => handleToggleStatus(drop)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              drop.status === "live"
                                ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                                : "text-green-500 hover:text-green-700 hover:bg-green-50"
                            }`}
                            title={drop.status === "live" ? "End drop" : "Go live"}
                          >
                            {drop.status === "live" ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => openBuilder(drop)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                          title="Edit drop"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(drop.id)}
                          disabled={deletingId === drop.id}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete drop"
                        >
                          {deletingId === drop.id ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
