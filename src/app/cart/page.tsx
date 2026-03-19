"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, GST_RATE, NECK_LABEL_PRICE } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";

// ── Breadcrumb ──────────────────────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-ds-muted mb-8">
      <Link href="/" className="hover:text-ds-body transition-colors">Home</Link>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <Link href="/products" className="hover:text-ds-body transition-colors">Products</Link>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-ds-dark font-semibold">Cart</span>
    </nav>
  );
}

// ── Qty stepper ─────────────────────────────────────────────────────────────
function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center gap-1 bg-black/[0.05] rounded-xl p-1">
      <button
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-ds-body hover:bg-white hover:text-ds-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
      >−</button>
      <span className="w-6 text-center text-sm font-bold text-ds-dark">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-ds-body hover:bg-white hover:text-ds-dark transition-all text-sm font-bold"
      >+</button>
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQty, itemsSubtotal, printSubtotal, neckLabelSubtotal, total } = useCart();
  const { fmt, currency } = useCurrency();
  const isINR = currency === "INR";
  const router = useRouter();

  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (cartId: string) => {
    setRemovingId(cartId);
    setTimeout(() => removeItem(cartId), 260); // let exit animation finish
  };

  const gst = isINR ? Math.round(total * GST_RATE) : 0;
  const grandTotal = total + gst;

  // ── Empty state ─────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-black/[0.05] rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2" style={{ letterSpacing: "-0.04em" }}>Your cart is empty</h1>
        <p className="text-ds-muted text-sm mb-8 max-w-xs">Head to the studio to design your merch, or browse products to get started.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/studio">
            <button className="px-6 py-3 rounded-2xl bg-brand text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
              Open Studio →
            </button>
          </Link>
          <Link href="/products">
            <button className="px-6 py-3 rounded-2xl border-2 border-black/[0.06] text-ds-body font-bold text-sm hover:bg-white transition-colors">
              Browse products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Breadcrumb />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold" style={{ letterSpacing: "-0.04em" }}>
            Your cart
            <span className="ml-3 text-lg font-semibold text-ds-muted">
              ({items.reduce((s, i) => s + i.qty, 0)} {items.reduce((s, i) => s + i.qty, 0) === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Items ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const lineTotal = (item.blankPrice + item.printPrice) * item.qty
                  + (item.neckLabel ? NECK_LABEL_PRICE * item.qty : 0);
                const hasBoth = !!item.thumbnail && !!item.backThumbnail;

                return (
                  <motion.div
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: removingId === item.cartId ? 0 : 1, y: 0, scale: removingId === item.cartId ? 0.96 : 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl border border-black/[0.06] p-5"
                  >
                    <div className="flex gap-4">
                      {/* Mockup thumbnails */}
                      <div className="flex gap-2 flex-shrink-0">
                        <div
                          className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ background: item.colorHex + "22", border: `2px solid ${item.colorHex}33` }}
                        >
                          {item.thumbnail
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={item.thumbnail} alt="Front" className="w-full h-full object-contain" />
                            : <span className="text-[9px] font-semibold text-ds-muted uppercase tracking-wide">Front</span>
                          }
                        </div>
                        {hasBoth && (
                          <div
                            className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{ background: item.colorHex + "22", border: `2px solid ${item.colorHex}33` }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.backThumbnail!} alt="Back" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-base leading-tight" style={{ letterSpacing: "-0.02em" }}>
                              {item.productName}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {/* Color swatch + name */}
                              <span className="flex items-center gap-1 text-xs text-ds-body bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.colorHex }} />
                                {item.color}
                              </span>
                              <span className="text-xs text-ds-body bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                                Size {item.size}
                              </span>
                              {item.gsm && (
                                <span className="text-xs text-ds-body bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                                  {item.gsm} GSM
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(item.cartId)}
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-ds-muted hover:text-red-400 hover:bg-red-50 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Print info */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.side !== "none" && (
                            <span className="text-xs font-semibold text-brand-dark bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5">
                              {item.printTechnique} ·{" "}
                              {item.side === "both" ? "Front + Back" : item.side === "front" ? "Front" : "Back"}
                            </span>
                          )}
                          {item.printTier && (
                            <span className="text-xs text-ds-body bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                              {item.printTier}
                            </span>
                          )}
                          {item.neckLabel && (
                            <span className="text-xs text-ds-body bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                              Neck label
                            </span>
                          )}
                          {item.side === "none" && (
                            <span className="text-xs text-ds-muted bg-ds-light-gray border border-black/[0.06] rounded-full px-2 py-0.5">
                              Blank (no print)
                            </span>
                          )}
                        </div>

                        {/* Qty + price row */}
                        <div className="mt-3 flex items-center justify-between">
                          <QtyStepper qty={item.qty} onChange={(q) => updateQty(item.cartId, q)} />
                          <div className="text-right">
                            <p className="font-semibold text-base">{fmt(lineTotal)}</p>
                            {item.qty > 1 && (
                              <p className="text-xs text-ds-muted">{fmt((item.blankPrice + item.printPrice))} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link href="/products" className="self-start">
              <button className="flex items-center gap-1.5 text-sm text-ds-muted hover:text-ds-body transition-colors mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue shopping
              </button>
            </Link>
          </div>

          {/* ── Right: Summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Order summary</h2>

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-ds-body">Products</span>
                  <span>{fmt(itemsSubtotal)}</span>
                </div>
                {printSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ds-body">Customization</span>
                    <span>{fmt(printSubtotal)}</span>
                  </div>
                )}
                {neckLabelSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ds-body">Neck labels</span>
                    <span>{fmt(neckLabelSubtotal)}</span>
                  </div>
                )}
                {isINR && (
                  <div className="flex justify-between text-ds-muted">
                    <span>GST (5%)</span>
                    <span>{fmt(gst)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-3 mt-1 border-t border-black/[0.06]">
                  <span>Subtotal</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
                <p className="text-xs text-ds-muted -mt-1">Shipping calculated at checkout</p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-6 py-4 rounded-2xl bg-brand text-white font-semibold text-base hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout →
              </button>

              {/* Trust signals */}
              <div className="mt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs text-ds-muted">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured by Razorpay
                </div>
                <div className="flex items-center gap-2 text-xs text-ds-muted">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Every item made to order — MOQ 1
                </div>
                <div className="flex items-center gap-2 text-xs text-ds-muted">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ships in 5–7 business days
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
