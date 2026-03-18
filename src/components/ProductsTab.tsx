"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Design = {
  id: string;
  user_id: string | null;
  name: string;
  product_id?: string;
  product_name: string;
  gsm?: string | null;
  color_name: string;
  color_hex?: string | null;
  size?: string | null;
  print_tier?: string | null;
  blank_price: number;
  print_price: number;
  has_design?: boolean;
  thumbnail: string | null;
  back_thumbnail?: string | null;
  sku: string | null;
  shopify_product_id?: string | null;
  created_at?: string;
};

type Props = {
  userId: string;
  designs: Design[];
  onRefresh: () => void;
};

type EditModal = {
  open: boolean;
  design: Design | null;
  name: string;
  blankPrice: string;
  printPrice: string;
};

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":     "bg-purple-100 text-purple-700",
  "In Production":    "bg-orange-100 text-orange-700",
  "Shipped":          "bg-blue-100 text-blue-700",
  "Delivered":        "bg-green-100 text-green-700",
};

export default function ProductsTab({ userId, designs, onRefresh }: Props) {
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<EditModal>({ open: false, design: null, name: "", blankPrice: "", printPrice: "" });
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = designs.filter((d) =>
    !search.trim() || d.name.toLowerCase().includes(search.toLowerCase()) || d.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (design: Design) => {
    setEditModal({
      open: true,
      design,
      name: design.name,
      blankPrice: String(design.blank_price ?? ""),
      printPrice: String(design.print_price ?? ""),
    });
  };

  const handleSaveEdit = useCallback(async () => {
    if (!editModal.design) return;
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch("/api/designs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModal.design.id,
          userId,
          name: editModal.name.trim(),
          blankPrice: parseFloat(editModal.blankPrice) || 0,
          printPrice: parseFloat(editModal.printPrice) || 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to update design");
      setEditModal({ open: false, design: null, name: "", blankPrice: "", printPrice: "" });
      onRefresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }, [editModal, userId, onRefresh]);

  const handleDuplicate = async (design: Design) => {
    setDuplicating(design.id);
    setActionError(null);
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: `Copy of ${design.name}`,
          productId: design.product_id,
          productName: design.product_name,
          gsm: design.gsm,
          colorName: design.color_name,
          colorHex: design.color_hex,
          size: design.size,
          printTier: design.print_tier,
          blankPrice: design.blank_price,
          printPrice: design.print_price,
          hasDesign: design.has_design ?? false,
          thumbnail: design.thumbnail,
          backThumbnail: design.back_thumbnail,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate design");
      onRefresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setDuplicating(null);
    }
  };

  const handleDelete = async (design: Design) => {
    if (!confirm(`Delete "${design.name}"? This cannot be undone.`)) return;
    setDeleting(design.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/designs?id=${design.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete design");
      onRefresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-900">Products</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
            {designs.length}
          </span>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <span>⚠️</span>
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {designs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200"
        >
          <div className="text-4xl mb-3">👕</div>
          <p className="text-zinc-600 font-medium">No products yet</p>
          <p className="text-zinc-400 text-sm mt-1">Head to Studio to create your first design.</p>
          <a
            href="/studio"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Open Studio
          </a>
        </motion.div>
      )}

      {/* Search empty state */}
      {designs.length > 0 && filtered.length === 0 && (
        <div className="text-center py-10 text-zinc-400 text-sm">
          No products match &ldquo;{search}&rdquo;
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-zinc-50 flex items-center justify-center overflow-hidden relative">
              {design.thumbnail ? (
                <img
                  src={design.thumbnail}
                  alt={design.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">👕</span>
              )}
              {design.shopify_product_id && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 border border-zinc-200 shadow-sm" style={{ color: "#5a7a1a" }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.337 23.979l6.163-1.098-2.256-15.21a.345.345 0 00-.34-.29s-.243.005-.243.005-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"/>
                  </svg>
                  On Shopify
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 leading-tight line-clamp-2">{design.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-xs">
                    {design.color_name}
                  </span>
                  <span className="text-xs text-zinc-400">{design.product_name}</span>
                </div>
              </div>

              {design.sku && (
                <p className="font-mono text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100 truncate">
                  {design.sku}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Blank: <span className="font-medium text-zinc-700">₹{Number(design.blank_price ?? 0).toFixed(2)}</span></span>
                <span className="text-zinc-300">·</span>
                <span>Print: <span className="font-medium text-zinc-700">₹{Number(design.print_price ?? 0).toFixed(2)}</span></span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-auto pt-2">
                <button
                  onClick={() => openEdit(design)}
                  className="flex-1 px-2 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(design)}
                  disabled={duplicating === design.id}
                  className="flex-1 px-2 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  {duplicating === design.id ? "..." : "Duplicate"}
                </button>
                <button
                  onClick={() => handleDelete(design)}
                  disabled={deleting === design.id}
                  className="px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 border border-zinc-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === design.id ? "..." : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit pricing modal */}
      <AnimatePresence>
        {editModal.open && editModal.design && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditModal((m) => ({ ...m, open: false })); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-900">Edit Design</h3>
                <button
                  onClick={() => setEditModal((m) => ({ ...m, open: false }))}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={editModal.name}
                    onChange={(e) => setEditModal((m) => ({ ...m, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Blank Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editModal.blankPrice}
                      onChange={(e) => setEditModal((m) => ({ ...m, blankPrice: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Print Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editModal.printPrice}
                      onChange={(e) => setEditModal((m) => ({ ...m, printPrice: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Total price</span>
                  <span className="text-sm font-bold text-zinc-800">
                    ₹{(parseFloat(editModal.blankPrice || "0") + parseFloat(editModal.printPrice || "0")).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditModal((m) => ({ ...m, open: false }))}
                  className="flex-1 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editModal.name.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
