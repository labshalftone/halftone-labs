"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":  "#9e6c9e",
  "Design Confirmed": "#9e6c9e",
  "In Production": "#f15533",
  "Quality Check": "#f15533",
  "Shipped":       "#2196F3",
  "Delivered":     "#4CAF50",
};

function TrackContent() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    ref: params.get("ref") ?? "",
    email: params.get("email") ?? "",
  });
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-search if params present
  useEffect(() => {
    if (params.get("ref") && params.get("email")) handleTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async () => {
    if (!form.ref || !form.email) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/track?ref=${encodeURIComponent(form.ref.toUpperCase())}&email=${encodeURIComponent(form.email.toLowerCase())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setOrder(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none focus:border-halftone-purple transition-colors";

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</Link>
          <div className="flex items-center gap-5">
            <Link href="/studio" className="text-[0.78rem] font-bold text-halftone-muted hover:text-halftone-dark transition-colors">Studio</Link>
            <Link href="/account" className="text-[0.78rem] font-bold text-halftone-muted hover:text-halftone-dark transition-colors">My Orders</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[560px] mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label mb-4 block">
            <span className="w-5 h-[1.5px] inline-block bg-halftone-purple" />
            Order Tracking
          </span>
          <h1 className="text-4xl mb-2" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Track your order</h1>
          <p className="text-halftone-muted text-sm font-bold mb-8">Enter your order reference and email to see live status updates.</p>
        </motion.div>

        {/* Search form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Order Reference</label>
              <input
                type="text"
                placeholder="e.g. HL4X9K2M"
                className={inp}
                value={form.ref}
                onChange={(e) => setForm({ ...form, ref: e.target.value.toUpperCase() })}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="The email used when ordering"
                className={inp}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading || !form.ref || !form.email}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "#9e6c9e", fontWeight: 900 }}
            >
              {loading ? "Searching…" : "Track Order →"}
            </button>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl p-4 mb-6 text-sm font-bold"
              style={{ background: "#fff1f0", border: "1px solid #ffd7d5", color: "#c0392b" }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order result */}
        <AnimatePresence>
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">

              {/* Status banner */}
              <div className="rounded-2xl p-5 flex items-center justify-between"
                style={{ background: (STATUS_COLORS[order.status as string] ?? "#9e6c9e") + "10", border: `1px solid ${STATUS_COLORS[order.status as string] ?? "#9e6c9e"}25` }}>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest mb-1" style={{ color: STATUS_COLORS[order.status as string] ?? "#9e6c9e" }}>Current Status</p>
                  <p className="text-xl" style={{ fontWeight: 900, letterSpacing: "-0.04em", color: STATUS_COLORS[order.status as string] ?? "#9e6c9e" }}>{order.status as string}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted">Order Ref</p>
                  <p className="text-lg" style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>#{order.ref as string}</p>
                </div>
              </div>

              {/* Order details */}
              <div className="rounded-2xl border border-black/[0.06] p-5">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-3">Order Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Product", v: order.product_name as string },
                    { l: "Colour", v: order.color as string },
                    { l: "Size", v: order.size as string },
                    { l: "Print", v: (order.print_tier as string) ?? "No print" },
                    { l: "Total Paid", v: `₹${order.total}` },
                    { l: "Placed On", v: new Date(order.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-halftone-light rounded-xl p-3">
                      <p className="text-[0.58rem] font-bold uppercase tracking-widest text-halftone-muted">{l}</p>
                      <p className="text-sm font-bold mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone timeline */}
              <div className="rounded-2xl border border-black/[0.06] p-5">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-4">Order Timeline</p>
                <div className="flex flex-col gap-0">
                  {(order.milestones as Array<Record<string, unknown>>).map((m, i) => (
                    <div key={m.id as string} className="flex gap-4">
                      {/* Line + dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ background: "#9e6c9e" }} />
                        {i < (order.milestones as unknown[]).length - 1 && (
                          <div className="w-[1.5px] flex-1 my-1" style={{ background: "rgba(158,108,158,0.2)", minHeight: 24 }} />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className="text-sm font-bold" style={{ fontWeight: 900 }}>{m.title as string}</p>
                        {!!m.description && <p className="text-[0.78rem] text-halftone-muted font-bold mt-0.5">{String(m.description)}</p>}
                        <p className="text-[0.62rem] text-halftone-muted font-bold mt-1">
                          {new Date(m.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                          {new Date(m.created_at as string).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending steps */}
                {(order.status as string) !== "Delivered" && (
                  <div className="mt-2 pt-4 border-t border-black/[0.05]">
                    <p className="text-[0.7rem] font-bold text-halftone-muted">Next steps coming soon. Questions? Email <a href="mailto:hello@halftonelabs.in" className="text-halftone-dark underline underline-offset-2">hello@halftonelabs.in</a></p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
