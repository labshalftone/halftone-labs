"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":      "#9E6C9E",
  "Design Confirmed":  "#9E6C9E",
  "In Production":     "#e05a3a",
  "Quality Check":     "#e05a3a",
  "Shipped":           "#2196F3",
  "Delivered":         "#4CAF50",
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

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="h-14 flex items-center px-6 border-b border-black/[0.05]">
        <div className="max-w-[1100px] w-full mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-base text-ds-dark"
            style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
          >
            Halftone Labs
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/studio" className="text-[0.78rem] font-semibold text-ds-muted hover:text-ds-dark transition-colors">Studio</Link>
            <Link href="/account" className="text-[0.78rem] font-semibold text-ds-muted hover:text-ds-dark transition-colors">My Orders</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[560px] mx-auto px-6 pt-14 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="ds-label ds-label-brand mb-4 block">Order Tracking</span>
          <h1
            className="text-4xl text-ds-dark mb-2"
            style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
          >
            Track your order
          </h1>
          <p className="text-ds-body text-sm mb-8">
            Enter your order reference and email to see live status updates.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ds-card p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="ds-label mb-1.5 block">Order Reference</label>
              <input
                type="text"
                placeholder="e.g. HL4X9K2M"
                className="field font-bold"
                value={form.ref}
                onChange={(e) => setForm({ ...form, ref: e.target.value.toUpperCase() })}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <div>
              <label className="ds-label mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="The email used when ordering"
                className="field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading || !form.ref || !form.email}
              className="btn-brand w-full justify-center py-3.5 disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Searching…</>
              ) : "Track Order →"}
            </button>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order result */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Status banner */}
              <div
                className="rounded-2xl p-5 flex items-center justify-between"
                style={{
                  background: (STATUS_COLORS[order.status as string] ?? "#9E6C9E") + "12",
                  border: `1px solid ${STATUS_COLORS[order.status as string] ?? "#9E6C9E"}30`,
                }}
              >
                <div>
                  <p
                    className="text-[0.62rem] font-bold uppercase tracking-widest mb-1"
                    style={{ color: STATUS_COLORS[order.status as string] ?? "#9E6C9E" }}
                  >
                    Current Status
                  </p>
                  <p
                    className="text-xl font-semibold"
                    style={{
                      letterSpacing: "-0.04em",
                      color: STATUS_COLORS[order.status as string] ?? "#9E6C9E",
                    }}
                  >
                    {order.status as string}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-ds-muted">Order Ref</p>
                  <p className="text-lg font-semibold text-ds-dark" style={{ letterSpacing: "-0.02em" }}>
                    #{order.ref as string}
                  </p>
                </div>
              </div>

              {/* Order details */}
              <div className="ds-card p-5">
                <p className="ds-label mb-3 block">Order Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Product", v: order.product_name as string },
                    { l: "Colour", v: order.color as string },
                    { l: "Size", v: order.size as string },
                    { l: "Print", v: (order.print_tier as string) ?? "No print" },
                    { l: "Total Paid", v: `₹${order.total}` },
                    {
                      l: "Placed On",
                      v: new Date(order.created_at as string).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }),
                    },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-ds-light-gray rounded-xl p-3">
                      <p className="text-[0.58rem] font-bold uppercase tracking-widest text-ds-muted">{l}</p>
                      <p className="text-sm font-semibold text-ds-dark mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone timeline */}
              <div className="ds-card p-5">
                <p className="ds-label mb-4 block">Order Timeline</p>
                <div className="flex flex-col gap-0">
                  {(order.milestones as Array<Record<string, unknown>>).map((m, i) => (
                    <div key={m.id as string} className="flex gap-4">
                      {/* Dot + line */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5 bg-brand" />
                        {i < (order.milestones as unknown[]).length - 1 && (
                          <div className="w-[1.5px] flex-1 my-1 bg-brand/20" style={{ minHeight: 24 }} />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className="text-sm font-semibold text-ds-dark">{m.title as string}</p>
                        {!!m.description && (
                          <p className="text-[0.78rem] text-ds-body mt-0.5">{String(m.description)}</p>
                        )}
                        <p className="text-[0.62rem] text-ds-muted mt-1">
                          {new Date(m.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          {" · "}
                          {new Date(m.created_at as string).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending steps */}
                {(order.status as string) !== "Delivered" && (
                  <div className="mt-2 pt-4 border-t border-black/[0.05]">
                    <p className="text-[0.7rem] text-ds-muted">
                      Next steps coming soon. Questions?{" "}
                      <a
                        href="mailto:hello@halftonelabs.in"
                        className="text-ds-dark underline underline-offset-2 hover:text-brand transition-colors"
                      >
                        hello@halftonelabs.in
                      </a>
                    </p>
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
