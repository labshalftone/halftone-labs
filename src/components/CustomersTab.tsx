"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  pin: string | null;
  country: string;
  notes: string | null;
  created_at: string;
}

type CustomerForm = Omit<Customer, "id" | "created_at">;
function emptyForm(): CustomerForm {
  return { name: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", pin: "", country: "IN", notes: "" };
}

function CustomerModal({
  initial,
  onSave,
  onClose,
}: {
  initial: CustomerForm;
  onSave: (f: CustomerForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof CustomerForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError(null);
    try { await onSave(form); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ds-dark" style={{ letterSpacing: "-0.03em" }}>
            {initial.name ? "Edit Customer" : "New Customer"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-zinc-200 text-ds-body text-xl leading-none">&times;</button>
        </div>

        <div className="flex flex-col gap-3">
          {([
            ["Name *", "name", "text", "Full name"],
            ["Email", "email", "email", "customer@email.com"],
            ["Phone", "phone", "tel", "+91 98765 43210"],
            ["Address line 1", "address1", "text", "House / street"],
            ["Address line 2", "address2", "text", "Area / landmark"],
            ["City", "city", "text", "City"],
            ["State", "state", "text", "State"],
            ["PIN Code", "pin", "text", "PIN code"],
          ] as [string, keyof CustomerForm, string, string][]).map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form[key] as string) || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">Country</label>
            <select value={form.country} onChange={(e) => set("country", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors bg-white">
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="SG">Singapore</option>
              <option value="AE">UAE</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">Notes</label>
            <textarea
              placeholder="Internal notes about this customer"
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors resize-none"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</> : "Save Customer"}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-2xl border border-black/[0.06] text-ds-body text-sm font-semibold hover:border-zinc-400 transition-colors">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomersTab({ userId }: { userId: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<null | { mode: "create" } | { mode: "edit"; customer: Customer }>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/customers?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [userId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = async (form: CustomerForm) => {
    if (modalMode?.mode === "edit") {
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modalMode.customer.id, userId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCustomers((prev) => prev.map((c) => c.id === data.id ? data : c));
    } else {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCustomers((prev) => [data, ...prev]);
    }
    setModalMode(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/customers?id=${id}&userId=${userId}`, { method: "DELETE" });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
    setOpenMenuId(null);
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q)
      || (c.email ?? "").toLowerCase().includes(q)
      || (c.phone ?? "").includes(q)
      || (c.city ?? "").toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Customers</h2>
        <button onClick={() => setModalMode({ mode: "create" })}
          className="px-4 py-2 rounded-full bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors">
          + Add Customer
        </button>
      </div>

      {customers.length > 0 && (
        <div className="relative mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ds-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Search customers…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/[0.06] text-sm text-ds-dark placeholder:text-ds-muted focus:outline-none focus:border-zinc-400 transition-colors bg-white max-w-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-body">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ds-muted py-8">
          <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          Loading customers…
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-black/[0.06] rounded-2xl p-14 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-semibold text-ds-dark mb-2">No customers yet</h3>
          <p className="text-ds-body text-sm mb-6 max-w-xs mx-auto">
            Add customers to quickly fill shipping details when creating manual orders.
          </p>
          <button onClick={() => setModalMode({ mode: "create" })}
            className="px-6 py-3 rounded-full bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 transition-colors">
            Add first customer →
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-black/[0.06] rounded-2xl p-10 text-center">
          <p className="font-semibold text-ds-dark mb-1">No customers match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-ds-muted">Try searching by name, email, phone, or city.</p>
        </div>
      ) : (
        <div ref={menuRef} className="flex flex-col gap-2">
          {filtered.map((c) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-black/[0.06] px-5 py-4 flex items-start justify-between gap-4 hover:border-black/[0.1] transition-colors">
              <div className="flex items-start gap-4 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-ds-dark">{c.name}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {c.email && <p className="text-xs text-ds-body">{c.email}</p>}
                    {c.phone && <p className="text-xs text-ds-muted">{c.phone}</p>}
                  </div>
                  {(c.city || c.pin) && (
                    <p className="text-xs text-ds-muted mt-0.5">
                      {[c.address1, c.city, c.state, c.pin].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {c.notes && <p className="text-[10px] text-ds-muted mt-1 italic">{c.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setModalMode({ mode: "edit", customer: c })}
                  className="p-2 rounded-xl text-ds-muted hover:text-ds-dark hover:bg-black/[0.05] transition-colors" title="Edit">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  className="p-2 rounded-xl text-ds-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40" title="Delete">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalMode && (
          <CustomerModal
            initial={modalMode.mode === "edit" ? { ...modalMode.customer } : emptyForm()}
            onSave={handleSave}
            onClose={() => setModalMode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
