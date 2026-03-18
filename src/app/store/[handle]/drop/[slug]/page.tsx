"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import StoreNavbar from "@/components/StoreNavbar";
import { useCurrency } from "@/lib/currency-context";

type DropProduct = {
  id: string;
  sort_order: number;
  is_featured: boolean;
  design: {
    id: string;
    name: string;
    product_name: string;
    color_name: string;
    color_hex: string;
    retail_price_inr: number;
    image_url: string | null;
    sizes: string[];
  } | null;
};

type Drop = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: "draft" | "live" | "scheduled" | "ended";
  launch_at: string | null;
  ended_at: string | null;
  cover_image_url: string | null;
  countdown_enabled: boolean;
  waitlist_enabled: boolean;
  waitlist_message: string | null;
  drop_products: DropProduct[];
};

type StoreInfo = {
  id: string;
  handle: string;
  artist_name: string;
  description: string | null;
  instagram: string | null;
  logo_url: string | null;
};

export default function DropPage({ params }: { params: Promise<{ handle: string; slug: string }> }) {
  const { handle, slug } = use(params);
  const { fmt } = useCurrency();

  const [drop, setDrop] = useState<Drop | null>(null);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [launched, setLaunched] = useState(false);

  // Waitlist form
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [waConcent, setWaConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/drops/public?storeHandle=${encodeURIComponent(handle)}&slug=${encodeURIComponent(slug)}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error("Failed to load drop");
        const data = await res.json();
        setDrop(data.drop);
        setStore(data.store);
        // If already past launch date, mark as launched
        if (data.drop.launch_at && new Date(data.drop.launch_at).getTime() <= Date.now()) {
          setLaunched(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle, slug]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setWaitlistError(null);
    try {
      const res = await fetch("/api/drops/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dropId: drop!.id,
          email: email.trim(),
          whatsapp: waConcent && whatsapp.trim() ? whatsapp.trim() : null,
          whatsapp_consent: waConcent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to join waitlist");
      setSubmitted(true);
    } catch (e) {
      setWaitlistError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {store && <StoreNavbar storeHandle={handle} storeName={store.artist_name} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading drop…</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !drop || !store) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-2xl font-black text-zinc-900" style={{ letterSpacing: "-0.03em" }}>Drop not found</h1>
          <p className="text-zinc-500 text-sm mt-2 mb-6">This drop may have ended or doesn&apos;t exist.</p>
          <Link href={`/store/${handle}`} className="px-5 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors">
            Visit store →
          </Link>
        </div>
      </div>
    );
  }

  const isScheduled = drop.status === "scheduled";
  const isLive = drop.status === "live" || (isScheduled && launched);
  const isEnded = drop.status === "ended";
  const showCountdown = drop.countdown_enabled && drop.launch_at && isScheduled && !launched;
  const showWaitlist = drop.waitlist_enabled && isScheduled && !launched;

  const products = (drop.drop_products ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter((p) => p.design);

  return (
    <div className="min-h-screen bg-white">
      <StoreNavbar storeHandle={handle} storeName={store.artist_name} />

      {/* Hero */}
      <div className="relative">
        {drop.cover_image_url ? (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={drop.cover_image_url} alt={drop.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-40 md:h-56 bg-gradient-to-br from-zinc-900 to-zinc-700" />
        )}

        {/* Hero content overlay */}
        <div className={`${drop.cover_image_url ? "absolute bottom-0 left-0 right-0" : ""} px-6 py-6 md:px-10`}>
          <div className="max-w-3xl mx-auto">
            {/* Status badge */}
            <div className="mb-3">
              {isEnded && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/80 backdrop-blur-sm text-zinc-600 text-xs font-semibold">
                  Drop ended
                </span>
              )}
              {isScheduled && !launched && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 backdrop-blur-sm text-blue-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Coming soon
                </span>
              )}
              {isLive && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100/90 backdrop-blur-sm text-green-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live now
                </span>
              )}
            </div>

            <h1 className={`text-3xl md:text-5xl font-black leading-tight ${drop.cover_image_url ? "text-white" : "text-zinc-900"}`} style={{ letterSpacing: "-0.04em" }}>
              {drop.title}
            </h1>
            {drop.description && (
              <p className={`mt-3 text-base leading-relaxed max-w-xl ${drop.cover_image_url ? "text-white/80" : "text-zinc-500"}`}>
                {drop.description}
              </p>
            )}
            <p className={`mt-2 text-sm font-medium ${drop.cover_image_url ? "text-white/60" : "text-zinc-400"}`}>
              by {store.artist_name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 pb-20">

        {/* Countdown section */}
        {showCountdown && drop.launch_at && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-zinc-950 text-white rounded-2xl p-6 md:p-8 text-center"
          >
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Drop launches in</p>
            <CountdownTimer launchAt={drop.launch_at} onLaunched={() => setLaunched(true)} />
            {drop.launch_at && (
              <p className="mt-4 text-zinc-500 text-sm">
                {new Date(drop.launch_at).toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
          </motion.div>
        )}

        {/* Waitlist section */}
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8"
          >
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">📋</div>
              <h2 className="text-lg font-black text-zinc-900" style={{ letterSpacing: "-0.03em" }}>
                {drop.waitlist_message ?? "Get notified when this drops"}
              </h2>
              <p className="text-zinc-500 text-sm mt-1">Be first in line. No spam, ever.</p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-black text-zinc-900">You&apos;re on the list!</p>
                  <p className="text-zinc-500 text-sm mt-1">We&apos;ll notify you the moment this drops.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleWaitlistSubmit}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waConcent}
                      onChange={(e) => setWaConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-amber-500"
                    />
                    <span className="text-sm text-zinc-600">Also notify me on WhatsApp</span>
                  </label>
                  {waConcent && (
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  )}
                  {waitlistError && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{waitlistError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Joining…" : "Notify me →"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Ended banner */}
        {isEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-zinc-100 border border-zinc-200 rounded-2xl p-5 text-center"
          >
            <p className="text-zinc-600 font-semibold text-sm">This drop has ended.</p>
            <p className="text-zinc-400 text-xs mt-1">Check the store for other available products.</p>
            <Link href={`/store/${handle}`} className="inline-block mt-3 px-4 py-2 bg-zinc-900 text-white rounded-full text-xs font-semibold hover:bg-zinc-700 transition-colors">
              Visit store
            </Link>
          </motion.div>
        )}

        {/* Products grid */}
        {products.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-black text-zinc-900 mb-4" style={{ letterSpacing: "-0.03em" }}>
              {isScheduled && !launched ? "Products in this drop" : isEnded ? "What was in this drop" : "Available now"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p, i) => {
                const d = p.design!;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group rounded-2xl border border-zinc-200 overflow-hidden bg-white hover:border-zinc-300 transition-all hover:shadow-md ${isEnded ? "opacity-60" : ""}`}
                  >
                    {/* Product image */}
                    <div className="aspect-square bg-zinc-50 overflow-hidden relative">
                      {d.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.image_url}
                          alt={d.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>
                      )}
                      {p.is_featured && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-full uppercase tracking-wide">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow" style={{ background: d.color_hex || "#888" }} />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-xs font-semibold text-zinc-800 line-clamp-1">{d.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{d.product_name} · {d.color_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-black text-zinc-900">{fmt(d.retail_price_inr)}</p>
                        {isLive && (
                          <Link
                            href={`/store/${handle}/${d.id}`}
                            className="text-[10px] font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-900 hover:text-white px-2 py-1 rounded-lg transition-colors"
                          >
                            Buy →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty products for scheduled drop */}
        {products.length === 0 && isScheduled && !launched && (
          <div className="mt-10 text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <div className="text-4xl mb-3">🔮</div>
            <p className="text-zinc-600 font-semibold">Products coming soon</p>
            <p className="text-zinc-400 text-sm mt-1">The artist is still putting the final touches on this drop.</p>
          </div>
        )}

        {/* Back to store */}
        <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
          <Link href={`/store/${handle}`} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {store.artist_name}&apos;s store
          </Link>
          {store.instagram && (
            <a
              href={`https://instagram.com/${store.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-pink-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @{store.instagram.replace("@", "")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
