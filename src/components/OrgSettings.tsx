"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type OrgMember = {
  id: string;
  user_id: string;
  role: string;
  name: string | null;
  email: string | null;
  created_at: string;
};

type Org = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  owner_id: string;
  role: string;
};

type Props = {
  org: Org;
  userId: string;
  onUpdated: (org: Org) => void;
  onClose: () => void;
};

export default function OrgSettings({ org, userId, onUpdated, onClose }: Props) {
  const [name, setName]               = useState(org.name);
  const [description, setDescription] = useState(org.description ?? "");
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const [members, setMembers]     = useState<OrgMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState("contributor");
  const [inviting, setInviting]   = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteOk, setInviteOk]   = useState("");

  const [stores, setStores]       = useState<{ id: string; handle: string; artist_name: string }[]>([]);
  const [storeHandle, setStoreHandle] = useState("");
  const [addingStore, setAddingStore] = useState(false);
  const [storeError, setStoreError]   = useState("");

  useEffect(() => {
    fetch(`/api/organizations/${org.slug}/members?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d) ? d : []));
    fetch(`/api/organizations/${org.slug}/stores?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setStores(Array.isArray(d) ? d : []));
  }, [org.slug, userId]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/organizations/${org.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, description: description || null }),
    });
    if (res.ok) {
      const d = await res.json();
      onUpdated({ ...org, ...d });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  async function handleInvite() {
    if (!inviteEmail) return;
    setInviting(true); setInviteError(""); setInviteOk("");
    const res = await fetch(`/api/organizations/${org.slug}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, inviteEmail, role: inviteRole }),
    });
    const d = await res.json();
    if (!res.ok) { setInviteError(d.error ?? "Failed"); }
    else {
      setInviteOk(`${inviteEmail} added as ${inviteRole}`);
      setInviteEmail("");
      // Refresh members
      fetch(`/api/organizations/${org.slug}/members?userId=${userId}`)
        .then((r) => r.json()).then((d2) => setMembers(Array.isArray(d2) ? d2 : []));
    }
    setInviting(false);
  }

  async function handleRemoveMember(removeUserId: string) {
    await fetch(`/api/organizations/${org.slug}/members?userId=${userId}&removeUserId=${removeUserId}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.user_id !== removeUserId));
  }

  async function handleAddStore() {
    if (!storeHandle) return;
    setAddingStore(true); setStoreError("");
    const res = await fetch(`/api/organizations/${org.slug}/stores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, storeHandle }),
    });
    const d = await res.json();
    if (!res.ok) { setStoreError(d.error ?? "Failed"); }
    else {
      setStoreHandle("");
      fetch(`/api/organizations/${org.slug}/stores?userId=${userId}`)
        .then((r) => r.json()).then((d2) => setStores(Array.isArray(d2) ? d2 : []));
    }
    setAddingStore(false);
  }

  const isOwner = org.owner_id === userId;
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>
          {org.name} — Settings
        </h2>
      </div>

      {/* Org details */}
      {isOwner && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-zinc-800">Organization Info</h3>
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Gully Gang" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={description}
              onChange={(e) => setDescription(e.target.value)} placeholder="A short description of your label or brand" />
          </div>
          <div className="flex items-center gap-2 bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-200">
            <span className="text-xs text-zinc-400 font-mono">halftonelabs.in/org/</span>
            <span className="text-xs font-mono font-bold text-zinc-700">{org.slug}</span>
          </div>
          <button onClick={handleSave} disabled={saving}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"
            } disabled:opacity-50`}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save changes"}
          </button>
        </div>
      )}

      {/* Stores */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-800">
          Linked Stores <span className="text-zinc-400 font-normal ml-1">{stores.length}</span>
        </h3>
        {stores.length === 0 ? (
          <p className="text-sm text-zinc-400">No stores linked yet.</p>
        ) : (
          <div className="space-y-2">
            {stores.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-sm font-bold text-zinc-800">{s.artist_name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">/store/{s.handle}</p>
                </div>
                <a href={`/store/${s.handle}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-violet-600 hover:underline">View ↗</a>
              </div>
            ))}
          </div>
        )}
        {isOwner && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Add store by handle</label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1 font-mono`} value={storeHandle}
                onChange={(e) => setStoreHandle(e.target.value.toLowerCase())}
                placeholder="divine" />
              <button onClick={handleAddStore} disabled={addingStore || !storeHandle}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap">
                {addingStore ? "Adding…" : "Add store"}
              </button>
            </div>
            {storeError && <p className="text-xs text-red-500 font-semibold">{storeError}</p>}
          </div>
        )}
      </div>

      {/* Members */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-800">
          Members <span className="text-zinc-400 font-normal ml-1">{members.length}</span>
        </h3>
        {members.length === 0 ? (
          <p className="text-sm text-zinc-400">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                    {(m.name ?? m.email ?? "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">{m.name ?? m.email ?? "Unknown"}</p>
                    {m.name && m.email && <p className="text-[10px] text-zinc-400">{m.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.role === "owner" ? "bg-violet-100 text-violet-700" :
                    m.role === "manager" ? "bg-blue-100 text-blue-700" :
                    "bg-zinc-100 text-zinc-500"
                  }`}>
                    {m.role}
                  </span>
                  {isOwner && m.user_id !== userId && (
                    <button onClick={() => handleRemoveMember(m.user_id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors text-xs">
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isOwner && (
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Add member by email</label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} type="email" value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)} placeholder="artist@example.com" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors bg-white">
                <option value="contributor">Contributor</option>
                <option value="manager">Manager</option>
              </select>
              <button onClick={handleInvite} disabled={inviting || !inviteEmail}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap">
                {inviting ? "Adding…" : "Add"}
              </button>
            </div>
            {inviteError && <p className="text-xs text-red-500 font-semibold">{inviteError}</p>}
            {inviteOk    && <p className="text-xs text-green-600 font-semibold">✓ {inviteOk}</p>}
            <p className="text-[10px] text-zinc-400">The person must already have a Halftone Labs account.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
