"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DropDraft = {
  id?: string;
  // Step 1
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  storeId: string;
  // Step 2
  designIds: string[];
  featuredDesignId: string;
  // Step 3
  limitedQty: boolean;
  inventoryAmount: string;
  preorderEnabled: boolean;
  codEnabled: boolean;
  shippingEstimate: string;
  // Step 4
  status: "draft" | "scheduled" | "live";
  launchAt: string;
  countdownEnabled: boolean;
  endAt: string;
  archiveWhenEnded: boolean;
  // Step 5
  waitlistEnabled: boolean;
  whatsappOptin: boolean;
  waitlistCta: string;
};

type Design = {
  id: string;
  name: string;
  product_name: string;
  color_name: string;
  thumbnail: string | null;
};

type Store = {
  id: string;
  handle: string;
  artist_name: string;
};

type Props = {
  userId: string;
  designs: Design[];
  stores: Store[];
  initialDraft?: Partial<DropDraft>;
  onSaved: (drop: DropDraft & { id: string }) => void;
  onClose: () => void;
};

const STEPS = [
  { id: 1, label: "Basics",   icon: "✦" },
  { id: 2, label: "Products", icon: "👕" },
  { id: 3, label: "Commerce", icon: "💳" },
  { id: 4, label: "Launch",   icon: "🚀" },
  { id: 5, label: "Audience", icon: "📣" },
  { id: 6, label: "Publish",  icon: "✅" },
];

const BLANK: DropDraft = {
  title: "", slug: "", description: "", coverImageUrl: "", storeId: "",
  designIds: [], featuredDesignId: "",
  limitedQty: false, inventoryAmount: "", preorderEnabled: false, codEnabled: false, shippingEstimate: "5–7 business days",
  status: "draft", launchAt: "", countdownEnabled: false, endAt: "", archiveWhenEnded: false,
  waitlistEnabled: false, whatsappOptin: false, waitlistCta: "Notify me when this drops",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── Toggle pill ───────────────────────────────────────────────────────────────
function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle} className="flex items-center justify-between w-full group">
      <span className="text-sm text-zinc-700 font-medium">{label}</span>
      <div className={`relative w-10 h-6 rounded-full transition-colors ${on ? "bg-zinc-900" : "bg-zinc-200"}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-1"}`} />
      </div>
    </button>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-900 transition-colors placeholder:text-zinc-300";
const labelCls = "text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5";

// ── Step 1: Basics ────────────────────────────────────────────────────────────
function StepBasics({ draft, onChange, stores }: { draft: DropDraft; onChange: (p: Partial<DropDraft>) => void; stores: Store[] }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Drop name *</label>
        <input className={inputCls} placeholder="The Dark Wave Drop" value={draft.title}
          onChange={(e) => onChange({ title: e.target.value, slug: slugify(e.target.value) })} />
      </div>
      <div>
        <label className={labelCls}>URL slug *</label>
        <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors">
          <span className="px-3 py-2.5 text-zinc-400 text-xs border-r border-zinc-200 bg-zinc-50 whitespace-nowrap">drop/</span>
          <input className="flex-1 px-3 py-2.5 text-sm font-mono outline-none" placeholder="the-dark-wave-drop"
            value={draft.slug} onChange={(e) => onChange({ slug: slugify(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={3}
          placeholder="Tell people what this drop is about. Make it feel like an event."
          value={draft.description} onChange={(e) => onChange({ description: e.target.value })} />
      </div>
      {stores.length > 0 && (
        <div>
          <label className={labelCls}>Store / Entity *</label>
          <select className={inputCls} value={draft.storeId}
            onChange={(e) => onChange({ storeId: e.target.value })}>
            <option value="">Select a store…</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.artist_name} · /{s.handle}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className={labelCls}>Cover image URL</label>
        <input className={inputCls} placeholder="https://…" value={draft.coverImageUrl}
          onChange={(e) => onChange({ coverImageUrl: e.target.value })} />
        {draft.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.coverImageUrl} alt="Cover" className="mt-2 w-full h-32 object-cover rounded-xl" />
        )}
      </div>
    </div>
  );
}

// ── Step 2: Products ──────────────────────────────────────────────────────────
function StepProducts({ draft, onChange, designs }: { draft: DropDraft; onChange: (p: Partial<DropDraft>) => void; designs: Design[] }) {
  const toggle = (id: string) => {
    const next = draft.designIds.includes(id)
      ? draft.designIds.filter((x) => x !== id)
      : [...draft.designIds, id];
    onChange({ designIds: next, featuredDesignId: next.length === 0 ? "" : draft.featuredDesignId || next[0] });
  };
  const setFeatured = (id: string) => onChange({ featuredDesignId: id });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">Select products to include in this drop. Tap the ⭐ to set the featured product shown first.</p>
      {designs.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center">
          <p className="text-zinc-400 text-sm font-semibold">No designs saved yet</p>
          <p className="text-zinc-300 text-xs mt-1">Create designs in Studio first, then come back here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {designs.map((d) => {
            const selected  = draft.designIds.includes(d.id);
            const featured  = draft.featuredDesignId === d.id;
            return (
              <div key={d.id}
                onClick={() => toggle(d.id)}
                className={`relative rounded-2xl border-2 cursor-pointer overflow-hidden transition-all ${
                  selected ? "border-zinc-900 bg-zinc-50" : "border-zinc-100 bg-white hover:border-zinc-300"
                }`}>
                {/* Thumbnail */}
                <div className="aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden">
                  {d.thumbnail
                    ? <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                    : <span className="text-3xl">👕</span>
                  }
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-zinc-900 truncate">{d.name || d.product_name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{d.color_name}</p>
                </div>
                {/* Checkmark */}
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {/* Featured star */}
                {selected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFeatured(d.id); }}
                    className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      featured ? "bg-amber-400 text-white" : "bg-white/80 text-zinc-400 hover:text-amber-400"
                    }`}>
                    ★
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {draft.designIds.length > 0 && (
        <p className="text-xs text-zinc-500 font-medium">
          {draft.designIds.length} product{draft.designIds.length > 1 ? "s" : ""} selected
          {draft.featuredDesignId && " · ★ featured set"}
        </p>
      )}
    </div>
  );
}

// ── Step 3: Commerce ──────────────────────────────────────────────────────────
function StepCommerce({ draft, onChange }: { draft: DropDraft; onChange: (p: Partial<DropDraft>) => void }) {
  return (
    <div className="space-y-5">
      <a href="/academy/preorders-vs-limited-drops" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-3 py-2 rounded-xl hover:bg-violet-100 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Academy: Pre-orders vs limited drops — which should you use? →
      </a>
      <div className="space-y-4 bg-zinc-50 rounded-2xl p-4">
        <Toggle on={draft.limitedQty} onToggle={() => onChange({ limitedQty: !draft.limitedQty })} label="Limited quantity" />
        {draft.limitedQty && (
          <div>
            <label className={labelCls}>Total units available</label>
            <input className={inputCls} type="number" min="1" placeholder="e.g. 100"
              value={draft.inventoryAmount} onChange={(e) => onChange({ inventoryAmount: e.target.value })} />
          </div>
        )}
      </div>
      <div className="space-y-4 bg-zinc-50 rounded-2xl p-4">
        <Toggle on={draft.preorderEnabled} onToggle={() => onChange({ preorderEnabled: !draft.preorderEnabled })} label="Pre-order enabled" />
        <Toggle on={draft.codEnabled} onToggle={() => onChange({ codEnabled: !draft.codEnabled })} label="Cash on delivery (COD)" />
      </div>
      <div>
        <label className={labelCls}>Shipping estimate copy</label>
        <input className={inputCls} placeholder="5–7 business days" value={draft.shippingEstimate}
          onChange={(e) => onChange({ shippingEstimate: e.target.value })} />
        <p className="text-[10px] text-zinc-400 mt-1">Shown on the drop page. E.g. "Ships in 7–10 days"</p>
      </div>
    </div>
  );
}

// ── Step 4: Launch ────────────────────────────────────────────────────────────
function StepLaunch({ draft, onChange }: { draft: DropDraft; onChange: (p: Partial<DropDraft>) => void }) {
  return (
    <div className="space-y-5">
      {/* Status */}
      <div>
        <label className={labelCls}>Drop status</label>
        <div className="grid grid-cols-3 gap-2">
          {(["draft", "scheduled", "live"] as const).map((s) => (
            <button key={s} onClick={() => onChange({ status: s })}
              className={`py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                draft.status === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
              }`}>
              {s === "draft" ? "🖊 Draft" : s === "scheduled" ? "⏰ Scheduled" : "⚡ Live"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-2">
          {draft.status === "draft" && "Only visible to you. Safe to edit."}
          {draft.status === "scheduled" && "Shows countdown + notify me form until launch time."}
          {draft.status === "live" && "Publicly visible and open for orders immediately."}
        </p>
      </div>

      {/* Launch datetime */}
      {draft.status === "scheduled" && (
        <div>
          <label className={labelCls}>Launch date & time *</label>
          <input className={inputCls} type="datetime-local" value={draft.launchAt}
            onChange={(e) => onChange({ launchAt: e.target.value })} />
        </div>
      )}

      {/* Countdown */}
      {(draft.status === "scheduled" || draft.status === "live") && (
        <div className="bg-zinc-50 rounded-2xl p-4">
          <Toggle on={draft.countdownEnabled} onToggle={() => onChange({ countdownEnabled: !draft.countdownEnabled })} label="Show countdown timer on drop page" />
        </div>
      )}

      {/* End date */}
      <div>
        <label className={labelCls}>End date / expiry <span className="text-zinc-300 normal-case">(optional)</span></label>
        <input className={inputCls} type="datetime-local" value={draft.endAt}
          onChange={(e) => onChange({ endAt: e.target.value })} />
        <p className="text-[10px] text-zinc-400 mt-1">Drop will automatically end at this time.</p>
      </div>

      {draft.endAt && (
        <div className="bg-zinc-50 rounded-2xl p-4">
          <Toggle on={draft.archiveWhenEnded} onToggle={() => onChange({ archiveWhenEnded: !draft.archiveWhenEnded })} label="Archive drop when ended" />
        </div>
      )}
    </div>
  );
}

// ── Step 5: Audience ──────────────────────────────────────────────────────────
function StepAudience({ draft, onChange }: { draft: DropDraft; onChange: (p: Partial<DropDraft>) => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-zinc-50 rounded-2xl p-4 space-y-4">
        <Toggle on={draft.waitlistEnabled} onToggle={() => onChange({ waitlistEnabled: !draft.waitlistEnabled })} label="Enable notify me / waitlist" />
        {draft.waitlistEnabled && (
          <>
            <Toggle on={draft.whatsappOptin} onToggle={() => onChange({ whatsappOptin: !draft.whatsappOptin })} label="Collect WhatsApp number (optional)" />
            <div>
              <label className={labelCls}>CTA button copy</label>
              <input className={inputCls} placeholder="Notify me when this drops" value={draft.waitlistCta}
                onChange={(e) => onChange({ waitlistCta: e.target.value })} />
            </div>
          </>
        )}
      </div>
      {!draft.waitlistEnabled && (
        <div className="border border-zinc-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-zinc-400 font-medium">Enable waitlist to collect interest before your drop goes live.</p>
          <p className="text-xs text-zinc-300 mt-1">Works best with Scheduled drops — build hype before launch day.</p>
          <a href="/academy/waitlists-to-measure-demand" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-500 hover:text-violet-700 mt-2 transition-colors">
            How to use waitlists to measure demand →
          </a>
        </div>
      )}
    </div>
  );
}

// ── Step 6: Review + Publish ──────────────────────────────────────────────────
function StepReview({ draft, stores, designs, saving, onPublish, onSaveDraft }: {
  draft: DropDraft; stores: Store[]; designs: Design[];
  saving: boolean; onPublish: () => void; onSaveDraft: () => void;
}) {
  const store = stores.find((s) => s.id === draft.storeId);
  const selectedDesigns = designs.filter((d) => draft.designIds.includes(d.id));
  const statusColor = { draft: "bg-zinc-100 text-zinc-600", scheduled: "bg-blue-100 text-blue-700", live: "bg-green-100 text-green-700" };

  return (
    <div className="space-y-4">
      {/* Cover */}
      {draft.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={draft.coverImageUrl} alt="Cover" className="w-full h-36 object-cover rounded-2xl" />
      )}

      <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-zinc-900" style={{ letterSpacing: "-0.03em" }}>{draft.title || "Untitled Drop"}</h3>
            {store && <p className="text-xs text-zinc-400 mt-0.5">/{store.handle}</p>}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColor[draft.status]}`}>{draft.status}</span>
        </div>
        {draft.description && <p className="text-xs text-zinc-500 leading-relaxed">{draft.description}</p>}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Products",  value: draft.designIds.length },
          { label: "Limited",   value: draft.limitedQty ? draft.inventoryAmount || "Yes" : "No" },
          { label: "Waitlist",  value: draft.waitlistEnabled ? "On" : "Off" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-50 rounded-xl py-3">
            <p className="text-lg font-black text-zinc-900">{s.value}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {draft.launchAt && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <span>⏰</span>
          <p className="text-xs font-semibold text-blue-800">
            Launches {new Date(draft.launchAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            {draft.countdownEnabled && " · countdown enabled"}
          </p>
        </div>
      )}

      {selectedDesigns.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {selectedDesigns.map((d) => (
            <div key={d.id} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${draft.featuredDesignId === d.id ? "border-amber-400" : "border-zinc-100"}`}>
              {d.thumbnail
                ? <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                : <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-xl">👕</div>
              }
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button onClick={onSaveDraft} disabled={saving}
          className="flex-1 py-3 rounded-2xl border-2 border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors">
          Save as draft
        </button>
        <button onClick={onPublish} disabled={saving || !draft.title}
          className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
          {saving ? (
            <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving…</>
          ) : draft.status === "live" ? "⚡ Publish live" : draft.status === "scheduled" ? "⏰ Schedule drop" : "Save draft"}
        </button>
      </div>
    </div>
  );
}

// ── Share sheet (post-publish) ─────────────────────────────────────────────────
function ShareSheet({ drop, storeHandle, onClose }: { drop: DropDraft & { id: string }; storeHandle: string; onClose: () => void }) {
  const dropUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/store/${storeHandle}/drop/${drop.slug}`;
  const [copied, setCopied] = useState("");

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const waText = encodeURIComponent(`🔥 New drop just landed: ${drop.title}\n\n${drop.description ? drop.description + "\n\n" : ""}Shop now 👉 ${dropUrl}`);
  const announceText = `🚨 NEW DROP: ${drop.title.toUpperCase()}\n\n${drop.description ?? ""}\n\nLink in bio 👇\n${dropUrl}`;
  const countdownText = `⏰ DROPPING SOON\n\n${drop.title}\n\n${drop.launchAt ? `Goes live: ${new Date(drop.launchAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}` : ""}\n\nGet notified 👉 ${dropUrl}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-4">
      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
        <span className="text-2xl">🎉</span>
        <div>
          <p className="text-sm font-black text-zinc-900">
            {drop.status === "live" ? "Drop is live!" : drop.status === "scheduled" ? "Drop scheduled!" : "Draft saved!"}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono truncate">{dropUrl}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Quick share</p>
        <button onClick={() => copy(dropUrl, "link")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${copied === "link" ? "border-green-300 bg-green-50" : "border-zinc-200 hover:border-zinc-300"}`}>
          <span className="text-lg">🔗</span>
          <span className="text-sm font-semibold text-zinc-700 flex-1 text-left">Copy drop link</span>
          {copied === "link" && <span className="text-xs text-green-600 font-bold">✓ Copied</span>}
        </button>
        <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 hover:border-green-200 hover:bg-green-50 transition-all">
          <span className="text-lg">💬</span>
          <span className="text-sm font-semibold text-zinc-700 flex-1 text-left">Share on WhatsApp</span>
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <button onClick={() => copy(announceText, "announce")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${copied === "announce" ? "border-green-300 bg-green-50" : "border-zinc-200 hover:border-zinc-300"}`}>
          <span className="text-lg">📢</span>
          <span className="text-sm font-semibold text-zinc-700 flex-1 text-left">Copy launch caption</span>
          {copied === "announce" && <span className="text-xs text-green-600 font-bold">✓ Copied</span>}
        </button>
        {drop.launchAt && (
          <button onClick={() => copy(countdownText, "countdown")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${copied === "countdown" ? "border-green-300 bg-green-50" : "border-zinc-200 hover:border-zinc-300"}`}>
            <span className="text-lg">⏳</span>
            <span className="text-sm font-semibold text-zinc-700 flex-1 text-left">Copy countdown announcement</span>
            {copied === "countdown" && <span className="text-xs text-green-600 font-bold">✓ Copied</span>}
          </button>
        )}
      </div>
      <button onClick={onClose}
        className="w-full py-3 rounded-2xl border-2 border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
        Done
      </button>
    </motion.div>
  );
}

// ── Main DropBuilder ───────────────────────────────────────────────────────────
export default function DropBuilder({ userId, designs, stores, initialDraft, onSaved, onClose }: Props) {
  const [step,     setStep]     = useState(1);
  const [draft,    setDraft]    = useState<DropDraft>({ ...BLANK, ...initialDraft });
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [published, setPublished] = useState<(DropDraft & { id: string }) | null>(null);

  const patch = useCallback((p: Partial<DropDraft>) => setDraft((d) => ({ ...d, ...p })), []);

  const canAdvance = () => {
    if (step === 1) return draft.title.trim().length > 0;
    if (step === 2) return true; // products optional
    return true;
  };

  async function saveDrop(overrideStatus?: string) {
    setSaving(true); setError("");
    try {
      const body = {
        userId,
        title:              draft.title,
        slug:               draft.slug || slugify(draft.title),
        description:        draft.description || null,
        status:             overrideStatus ?? draft.status,
        storeId:            draft.storeId || null,
        launchAt:           draft.launchAt || null,
        endAt:              draft.endAt || null,
        coverImageUrl:      draft.coverImageUrl || null,
        countdownEnabled:   draft.countdownEnabled,
        archiveWhenEnded:   draft.archiveWhenEnded,
        waitlistEnabled:    draft.waitlistEnabled,
        waitlistCta:        draft.waitlistCta || null,
        whatsappOptin:      draft.whatsappOptin,
        preorderEnabled:    draft.preorderEnabled,
        codEnabled:         draft.codEnabled,
        shippingEstimate:   draft.shippingEstimate || null,
        limitedQty:         draft.limitedQty,
        inventoryAmount:    draft.inventoryAmount ? parseInt(draft.inventoryAmount) : null,
      };

      let dropId = draft.id;

      if (dropId) {
        const res = await fetch("/api/drops", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: dropId, ...body }) });
        if (!res.ok) throw new Error((await res.json()).error ?? "Update failed");
      } else {
        const res = await fetch("/api/drops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json()).error ?? "Create failed");
        const d = await res.json();
        dropId = d.drop.id;
        patch({ id: dropId });
      }

      // Sync drop_products
      if (dropId && draft.designIds.length > 0) {
        await Promise.all(draft.designIds.map((designId, i) =>
          fetch("/api/drops/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dropId,
              designId,
              isFeatured: designId === draft.featuredDesignId,
              sortOrder: i,
            }),
          })
        ));
      }

      const finalDrop = { ...draft, id: dropId! };
      onSaved(finalDrop as DropDraft & { id: string });
      return finalDrop;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const result = await saveDrop();
    if (result) setPublished(result as DropDraft & { id: string });
  }

  const storeForPublished = stores.find((s) => s.id === published?.storeId);

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-black text-zinc-900" style={{ letterSpacing: "-0.04em" }}>
            {draft.id ? "Edit drop" : "New drop"}
          </h2>
          {draft.title && <p className="text-xs text-zinc-400 mt-0.5">{draft.title}</p>}
        </div>
      </div>

      {/* Published → share sheet */}
      <AnimatePresence mode="wait">
        {published ? (
          <ShareSheet
            key="share"
            drop={published}
            storeHandle={storeForPublished?.handle ?? ""}
            onClose={() => { setPublished(null); onClose(); }}
          />
        ) : (
          <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Step progress */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
              {STEPS.map((s) => (
                <button key={s.id} onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    step === s.id
                      ? "bg-zinc-900 text-white"
                      : s.id < step
                      ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      : "text-zinc-300 cursor-default"
                  }`}>
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}>
                {step === 1 && <StepBasics  draft={draft} onChange={patch} stores={stores} />}
                {step === 2 && <StepProducts draft={draft} onChange={patch} designs={designs} />}
                {step === 3 && <StepCommerce draft={draft} onChange={patch} />}
                {step === 4 && <StepLaunch   draft={draft} onChange={patch} />}
                {step === 5 && <StepAudience draft={draft} onChange={patch} />}
                {step === 6 && (
                  <StepReview
                    draft={draft} stores={stores} designs={designs}
                    saving={saving}
                    onPublish={handlePublish}
                    onSaveDraft={() => saveDrop("draft")}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            {error && <p className="text-red-500 text-xs font-semibold mt-3">{error}</p>}

            {/* Navigation (not on review step) */}
            {step < 6 && (
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => saveDrop("draft")}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                >
                  Save draft
                </button>
                <div className="flex-1" />
                {step > 1 && (
                  <button onClick={() => setStep((s) => s - 1)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                    ← Back
                  </button>
                )}
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                >
                  Continue →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
