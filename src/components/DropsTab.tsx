"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Design = {
  id: string;
  name: string;
  product_name: string;
  color_name: string;
  thumbnail: string | null;
  sku: string | null;
};

type Drop = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "draft" | "live" | "scheduled" | "ended";
  launch_at: string | null;
  ended_at: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  design_count: number;
};

type DropProduct = {
  id: string;
  drop_id: string;
  design_id: string;
  created_at: string;
};

const STATUS_BADGE: Record<string, string> = {
  live:       "bg-green-100 text-green-700",
  scheduled:  "bg-blue-100 text-blue-700",
  draft:      "bg-zinc-100 text-zinc-600",
  ended:      "bg-zinc-100 text-zinc-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status] ?? "bg-zinc-100 text-zinc-500"} ${status === "ended" ? "line-through" : ""}`}>
      {status}
    </span>
  );
}

type EditForm = {
  title: string;
  description: string;
  status: string;
  launch_at: string;
};

type Props = {
  userId: string;
  designs: Design[];
};

export default function DropsTab({ userId, designs }: Props) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dropProducts, setDropProducts] = useState<Record<string, string[]>>({}); // dropId -> designIds
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ title: "", description: "", status: "draft", launch_at: "" });
  const [createForm, setCreateForm] = useState<EditForm>({ title: "", description: "", status: "draft", launch_at: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingDesign, setAddingDesign] = useState<Record<string, string>>({}); // dropId -> selected designId
  const [addingInProgress, setAddingInProgress] = useState<string | null>(null);

  const fetchDrops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/drops?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load drops");
      const data = await res.json();
      setDrops(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDrops(); }, [fetchDrops]);

  const handleExpand = (dropId: string) => {
    if (expandedId === dropId) {
      setExpandedId(null);
    } else {
      setExpandedId(dropId);
      // dropProducts state is populated client-side as designs are added during the session
    }
  };

  const handleCreate = async () => {
    if (!createForm.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: createForm.title.trim(),
          description: createForm.description.trim() || null,
          status: createForm.status,
          launch_at: createForm.status === "scheduled" && createForm.launch_at ? createForm.launch_at : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create drop");
      setCreateForm({ title: "", description: "", status: "draft", launch_at: "" });
      setShowCreateForm(false);
      await fetchDrops();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (drop: Drop) => {
    setEditingId(drop.id);
    setEditForm({
      title: drop.title,
      description: drop.description ?? "",
      status: drop.status,
      launch_at: drop.launch_at ? drop.launch_at.slice(0, 16) : "",
    });
  };

  const handleUpdate = async (dropId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/drops", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dropId,
          userId,
          title: editForm.title.trim(),
          description: editForm.description.trim() || null,
          status: editForm.status,
          launch_at: editForm.status === "scheduled" && editForm.launch_at ? editForm.launch_at : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update drop");
      setEditingId(null);
      await fetchDrops();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dropId: string) => {
    if (!confirm("Delete this drop? This cannot be undone.")) return;
    setDeletingId(dropId);
    try {
      const res = await fetch(`/api/drops?id=${dropId}&userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete drop");
      setDrops((prev) => prev.filter((d) => d.id !== dropId));
      if (expandedId === dropId) setExpandedId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddDesign = async (dropId: string) => {
    const designId = addingDesign[dropId];
    if (!designId) return;
    setAddingInProgress(dropId);
    try {
      const res = await fetch("/api/drops/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropId, designId, userId }),
      });
      if (!res.ok) throw new Error("Failed to add design");
      setDropProducts((prev) => ({
        ...prev,
        [dropId]: [...(prev[dropId] ?? []), designId],
      }));
      setAddingDesign((prev) => ({ ...prev, [dropId]: "" }));
      // Update design_count in drops list
      setDrops((prev) => prev.map((d) => d.id === dropId ? { ...d, design_count: d.design_count + 1 } : d));
    } catch (e) {
      console.error(e);
    } finally {
      setAddingInProgress(null);
    }
  };

  const handleRemoveDesign = async (dropId: string, designId: string) => {
    try {
      const res = await fetch(
        `/api/drops/products?dropId=${dropId}&designId=${designId}&userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove design");
      setDropProducts((prev) => ({
        ...prev,
        [dropId]: (prev[dropId] ?? []).filter((id) => id !== designId),
      }));
      setDrops((prev) => prev.map((d) => d.id === dropId ? { ...d, design_count: Math.max(0, d.design_count - 1) } : d));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Drops</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Group your designs into product collections</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Drop
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4"
          >
            <h3 className="text-sm font-semibold text-zinc-800">Create New Drop</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Title *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Summer Collection 2025"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                {createForm.status === "scheduled" && (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Launch Date</label>
                    <input
                      type="datetime-local"
                      value={createForm.launch_at}
                      onChange={(e) => setCreateForm((f) => ({ ...f, launch_at: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !createForm.title.trim()}
                className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Creating..." : "Create Drop"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && drops.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200"
        >
          <div className="text-4xl mb-3">📦</div>
          <p className="text-zinc-600 font-medium">No drops yet</p>
          <p className="text-zinc-400 text-sm mt-1">Create your first drop to group products into collections.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Create your first drop
          </button>
        </motion.div>
      )}

      {/* Drops list */}
      <div className="space-y-3">
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            layout
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
          >
            {/* Drop header row */}
            <div
              className="px-5 py-4 cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => handleExpand(drop.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {editingId === drop.id ? null : (
                      <>
                        <h3 className="text-sm font-semibold text-zinc-900">{drop.title}</h3>
                        <StatusBadge status={drop.status} />
                      </>
                    )}
                  </div>
                  {editingId !== drop.id && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                      <span>{drop.design_count} {drop.design_count === 1 ? "product" : "products"}</span>
                      {(drop.status === "scheduled" || drop.status === "live") && drop.launch_at && (
                        <span>· Launches {new Date(drop.launch_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => startEdit(drop)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(drop.id)}
                    disabled={deletingId === drop.id}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <svg
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${expandedId === drop.id ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Inline edit form */}
            <AnimatePresence>
              {editingId === drop.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-100 overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-3 bg-zinc-50">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Edit Drop</p>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-zinc-600 mb-1">Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                        >
                          <option value="draft">Draft</option>
                          <option value="live">Live</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="ended">Ended</option>
                        </select>
                      </div>
                      {editForm.status === "scheduled" && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-zinc-600 mb-1">Launch Date</label>
                          <input
                            type="datetime-local"
                            value={editForm.launch_at}
                            onChange={(e) => setEditForm((f) => ({ ...f, launch_at: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(drop.id)}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded: designs in this drop */}
            <AnimatePresence>
              {expandedId === drop.id && editingId !== drop.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-100 overflow-hidden"
                >
                  <div className="px-5 py-4 bg-zinc-50/50 space-y-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Products in this drop</p>

                    {/* Designs added this session */}
                    {(dropProducts[drop.id] ?? []).length === 0 && drop.design_count === 0 && (
                      <p className="text-xs text-zinc-400 italic">No designs added yet.</p>
                    )}

                    <div className="space-y-2">
                      {(dropProducts[drop.id] ?? []).map((designId) => {
                        const d = designs.find((x) => x.id === designId);
                        if (!d) return null;
                        return (
                          <div key={designId} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-zinc-100">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                              {d.thumbnail ? (
                                <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm">👕</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-zinc-800 truncate">{d.name}</p>
                              <p className="text-xs text-zinc-400 truncate">{d.product_name} · {d.color_name}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveDesign(drop.id, designId)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add design picker */}
                    <div className="flex gap-2">
                      <select
                        value={addingDesign[drop.id] ?? ""}
                        onChange={(e) => setAddingDesign((prev) => ({ ...prev, [drop.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                      >
                        <option value="">+ Add a design...</option>
                        {designs
                          .filter((d) => !(dropProducts[drop.id] ?? []).includes(d.id))
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.product_name})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => handleAddDesign(drop.id)}
                        disabled={!addingDesign[drop.id] || addingInProgress === drop.id}
                        className="px-3 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        {addingInProgress === drop.id ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
