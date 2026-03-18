"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart, GST_RATE } from "@/lib/cart-context";
import { supabase } from "@/lib/supabase";
import { useCurrency, toForeignAmount, CURRENCY_META } from "@/lib/currency-context";

const COUNTRY_LIST = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "AE", name: "UAE" },
  { code: "JP", name: "Japan" },
  { code: "NZ", name: "New Zealand" },
];

interface ShippingOption {
  id: string; label: string; carrier: string; rate: number; days: string;
}

interface AppliedCoupon {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  discount_amount: number;
  description: string | null;
}

// Tooltip component
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="ml-1 w-4 h-4 rounded-full bg-zinc-200 text-zinc-500 text-[9px] font-bold flex items-center justify-center hover:bg-zinc-300 transition-colors leading-none"
        aria-label="More info"
      >
        i
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-zinc-900 text-white text-[11px] leading-relaxed rounded-xl px-3 py-2.5 shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function CheckoutPage() {
  const { items, itemsSubtotal, printSubtotal, neckLabelSubtotal, total, clearCart } = useCart();
  const { currency, fmt } = useCurrency();
  const isINR = currency === "INR";

  const [country, setCountry] = useState("IN");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", pin: "", state: "",
    sameAsBilling: true,
    billingName: "", billingAddress: "", billingCity: "", billingPin: "",
  });

  const [shippingOptions,  setShippingOptions]  = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping,  setLoadingShipping]  = useState(false);

  // Coupon state
  const [couponInput,   setCouponInput]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError,   setCouponError]   = useState("");

  const [paying,       setPaying]       = useState(false);
  const [payError,     setPayError]     = useState("");
  const [refCopied,    setRefCopied]    = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    ref: string;
    name: string;
    email: string;
    items: typeof items;
    total: number;
    shipping: number;
    shippingLabel: string;
    couponCode: string | null;
    discount: number;
  } | null>(null);

  // Track where checkout was initiated from (studio vs store)
  type CheckoutOrigin = { type: "studio" } | { type: "store"; handle: string; name: string };
  const [checkoutOrigin, setCheckoutOrigin] = useState<CheckoutOrigin>({ type: "studio" });
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkout_origin");
      if (raw) setCheckoutOrigin(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const isFreeShipping  = appliedCoupon?.discount_type === "percent" && appliedCoupon?.discount_value === 100;
  const shippingCost    = isFreeShipping ? 0 : (selectedShipping?.rate ?? 0);
  const discount        = appliedCoupon?.discount_amount ?? 0;
  const discountedTotal = Math.max(0, total - discount);
  // GST only applies to INR (domestic India) orders
  const gstProduct      = isINR ? Math.round(discountedTotal * GST_RATE) : 0;
  const gstShipping     = isINR ? Math.round(shippingCost * GST_RATE) : 0;
  const totalGst        = gstProduct + gstShipping;
  const grandTotalINR   = discountedTotal + shippingCost + totalGst;
  // Numeric amount in the selected currency (for Razorpay charge)
  const grandTotalForeign = toForeignAmount(grandTotalINR, currency);

  // Weight: ~300g per tee + 100g packaging, billed in 0.5kg slabs
  const totalQty    = items.reduce((s, i) => s + i.qty, 0);
  const weightKg    = Math.max(0.5, Math.ceil((totalQty * 0.3 + 0.1) / 0.5) * 0.5);

  const fetchShipping = useCallback(async (countryCode: string, pin: string, qty = 1) => {
    setLoadingShipping(true);
    try {
      const weight = Math.max(0.5, Math.ceil((qty * 0.3 + 0.1) / 0.5) * 0.5);
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryCode, pin: pin || "201304", weight }),
      });
      const data = await res.json();
      if (data.options?.length) {
        setShippingOptions(data.options);
        setSelectedShipping(data.options[0]);
      }
    } catch {}
    setLoadingShipping(false);
  }, []);

  // Re-fetch when country or total qty changes
  useEffect(() => { fetchShipping(country, form.pin, totalQty); }, [country, totalQty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load Razorpay
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;
    setCouponLoading(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, orderTotal: total }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Invalid coupon");
      } else {
        setAppliedCoupon(data);
        setCouponInput("");
      }
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    }
    setCouponLoading(false);
  };

  // Shared helper: save order + increment coupon + clear cart
  const saveAndComplete = async (ref: string, paymentId: string, razorpayOrderId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const saveRes = await fetch("/api/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderRef: ref,
        razorpayPaymentId: paymentId,
        razorpayOrderId,
        product: items.map((i) => `${i.productName} ${i.gsm}`).join(" + "),
        color: items.map((i) => i.color).join(", "),
        size: items.map((i) => i.size).join(", "),
        printTier: items.map((i) => i.printTier).filter(Boolean).join(", ") || null,
        printDimensions: items.map((i) => i.printDims).filter(Boolean).join(", ") || null,
        blankPrice: items.reduce((s, i) => s + i.blankPrice, 0),
        printPrice: items.reduce((s, i) => s + i.printPrice, 0),
        shipping: selectedShipping?.rate ?? 0,
        total: grandTotalINR,
        currency,
        totalForeign: grandTotalForeign,
        couponCode: appliedCoupon?.code ?? null,
        discountAmount: discount,
        neckLabel: items.some(i => i.neckLabel),
        frontDesignUrl: items.map(i => i.frontDesignUrl  || "").find(Boolean) ?? null,
        backDesignUrl:  items.map(i => i.backDesignUrl   || "").find(Boolean) ?? null,
        mockupUrl:      items.map(i => i.thumbnail       || "").find(Boolean) ?? null,
        backMockupUrl:  items.map(i => i.backThumbnail   || "").find(Boolean) ?? null,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address + ", " + form.city + (form.pin ? " " + form.pin : "") + (form.state ? ", " + form.state : ""),
        city: form.city,
        pin: form.pin,
        country,
        userId: session?.user?.id ?? null,
      }),
    });
    if (!saveRes.ok) {
      const errData = await saveRes.json().catch(() => ({}));
      throw new Error(errData.error ?? `Order save failed (${saveRes.status})`);
    }
    if (appliedCoupon?.code) {
      await fetch("/api/coupon", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedCoupon.code }),
      });
    }
    // Snapshot cart items before clearing
    const itemsSnapshot = [...items];
    const shippingSnapshot = selectedShipping?.rate ?? 0;
    const shippingLabelSnapshot = selectedShipping?.label ?? "Standard Shipping";
    clearCart();
    setOrderSuccess({
      ref,
      name: form.name,
      email: form.email,
      items: itemsSnapshot,
      total: grandTotalINR,
      shipping: shippingSnapshot,
      shippingLabel: shippingLabelSnapshot,
      couponCode: appliedCoupon?.code ?? null,
      discount,
    });
  };

  const handlePay = async () => {
    if (!form.name || !form.email || !form.address || !form.city || !selectedShipping) return;
    setPaying(true); setPayError("");

    const ref = `HL${Date.now().toString(36).toUpperCase()}`;

    try {
      // ── Zero-total: skip Razorpay entirely ──────────────────────────────
      if (grandTotalINR === 0) {
        await saveAndComplete(ref, "FREE", "FREE");
        return;
      }

      // ── Normal paid flow ────────────────────────────────────────────────
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotalForeign, currency }),
      });
      const { orderId, key } = await orderRes.json();

      await new Promise<void>((resolve, reject) => {
        const options = {
          key, amount: Math.round(grandTotalForeign * 100), currency, order_id: orderId,
          name: "Halftone Labs",
          description: items.map((i) => `${i.productName} (${i.size})`).join(", "),
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#f15533" },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string }) => {
            try {
              await saveAndComplete(ref, response.razorpay_payment_id, response.razorpay_order_id);
              resolve();
            } catch (err) { reject(err); }
          },
          modal: { ondismiss: () => reject(new Error("cancelled")) },
        };
        // @ts-ignore
        const rz = new window.Razorpay(options);
        rz.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "cancelled") setPayError(msg);
    }
    setPaying(false);
  };

  // ── Empty cart ──
  if (items.length === 0 && !orderSuccess) {
    const backHref = checkoutOrigin.type === "store" ? `/store/${checkoutOrigin.handle}` : "/studio";
    const backLabel = checkoutOrigin.type === "store" ? `← Back to ${checkoutOrigin.name || "Store"}` : "← Back to Studio";
    return (
      <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-black mb-2" style={{ letterSpacing: "-0.04em" }}>Your cart is empty</h1>
          <p className="text-zinc-500 mb-6">
            {checkoutOrigin.type === "store" ? "Browse products and add them to your cart." : "Add some products from the Studio first."}
          </p>
          <Link href={backHref}>
            <button className="px-6 py-3 rounded-full bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 transition-colors">
              {backLabel}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (orderSuccess) {
    const successItems = orderSuccess.items;
    const successTotal = orderSuccess.total;
    const productSubtotal = successItems.reduce((s, i) => s + (i.blankPrice + i.printPrice) * i.qty, 0);
    const printSub   = successItems.reduce((s, i) => s + i.printPrice * i.qty, 0);
    const blankSub   = successItems.reduce((s, i) => s + i.blankPrice * i.qty, 0);
    const neckSub    = successItems.reduce((s, i) => s + (i.neckLabel ? 7 * i.qty : 0), 0);
    const gstAmount  = isINR ? Math.round((productSubtotal + neckSub - orderSuccess.discount + orderSuccess.shipping) * GST_RATE) : 0;

    // Estimated dates based on today
    const addDays = (d: number) => {
      const dt = new Date(); dt.setDate(dt.getDate() + d);
      return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    };

    const steps = [
      { icon: "✓",  label: "Order confirmed",   sub: "Payment received",           date: "Today",        done: true  },
      { icon: "🎨", label: "Design approved",    sub: "We verify your artwork",      date: addDays(2),     done: false },
      { icon: "👕", label: "In production",      sub: "Printed & quality checked",  date: addDays(5),     done: false },
      { icon: "📦", label: "Shipped",            sub: "Out for delivery",            date: addDays(7),     done: false },
    ];

    // Pick best thumbnail for display (prefer composite mockup)
    const heroThumb = successItems[0]?.thumbnail || successItems[0]?.frontDesignUrl || null;

    const copyRef = () => {
      navigator.clipboard.writeText(orderSuccess.ref).then(() => {
        setRefCopied(true);
        setTimeout(() => setRefCopied(false), 2000);
      });
    };

    return (
      <div className="min-h-screen bg-[#f8f7f5]">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#f8f7f5]/95 backdrop-blur-sm border-b border-zinc-100 px-5 py-4 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight" style={{ letterSpacing: "-0.04em" }}>Halftone Labs</span>
          <span className="text-xs font-mono text-zinc-400">#{orderSuccess.ref}</span>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-36 pt-8">

          {/* ── HERO ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden mb-8 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
            style={{ background: "linear-gradient(135deg, #111111 0%, #1a1a2e 100%)" }}
          >
            {/* Animated glow rings */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-16 -left-16 w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full"
                style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
              />
            </div>

            {/* Left: checkmark + message */}
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mb-5 shadow-lg shadow-green-900/30"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Order Confirmed</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{ letterSpacing: "-0.04em" }}>
                  Thank you,<br />{orderSuccess.name.split(" ")[0]}! 🎉
                </h1>
                <p className="text-zinc-400 text-sm mb-5 leading-relaxed max-w-sm">
                  Your custom tee is in our queue. We&apos;ll get it printed and shipped within 5–7 business days.
                </p>

                {/* Order ref chip */}
                <button onClick={copyRef} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 transition-colors text-white group">
                  <span className="text-xs font-mono font-semibold tracking-widest">#{orderSuccess.ref}</span>
                  {refCopied
                    ? <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  }
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">{refCopied ? "Copied!" : "Copy"}</span>
                </button>
              </motion.div>
            </div>

            {/* Right: product thumbnail */}
            {heroThumb && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
                className="relative flex-shrink-0"
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
                  style={{ background: successItems[0]?.colorHex + "33" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroThumb} alt="Your order" className="w-full h-full object-contain p-2" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-[#111]">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── PROGRESS TIMELINE ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 mb-6"
          >
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-zinc-400 mb-5">Your order journey</p>
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center text-center relative">
                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-0.5 z-0"
                      style={{ background: idx === 0 ? "#22c55e" : "#e4e4e7" }} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2 border-2 ${
                    step.done
                      ? "bg-green-500 border-green-500 text-white"
                      : idx === 1
                      ? "bg-orange-100 border-orange-300 text-orange-500"
                      : "bg-zinc-100 border-zinc-200 text-zinc-400"
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-[11px] font-bold leading-tight ${step.done ? "text-zinc-900" : "text-zinc-400"}`}>{step.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight hidden md:block">{step.sub}</p>
                  <span className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded-full ${step.done ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                    {step.date}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6"
          >
            {/* LEFT col — Receipt (wider) */}
            <div className="md:col-span-3 flex flex-col gap-6">

              {/* Items */}
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                  <p className="font-black text-sm" style={{ letterSpacing: "-0.03em" }}>Items ordered</p>
                  <span className="text-xs text-zinc-400">{successItems.reduce((s, i) => s + i.qty, 0)} item{successItems.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {successItems.map((item) => {
                    const thumb = item.thumbnail || item.frontDesignUrl || item.backDesignUrl;
                    return (
                      <div key={item.cartId} className="flex gap-4 px-6 py-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: item.colorHex + "22", border: `2px solid ${item.colorHex}33` }}>
                          {thumb
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={thumb} alt={item.productName} className="w-full h-full object-contain" />
                            : <div className="w-8 h-8 rounded-lg" style={{ background: item.colorHex }} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-900 truncate">{item.productName}{item.qty > 1 ? ` ×${item.qty}` : ""}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: item.colorHex }} />
                              {item.color}
                            </span>
                            <span className="text-zinc-300 text-xs">·</span>
                            <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full">{item.size}</span>
                            {item.side !== "none" && (
                              <>
                                <span className="text-zinc-300 text-xs">·</span>
                                <span className="text-xs text-zinc-500">{item.side === "both" ? "Front + Back" : `${item.side} print`}</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            {item.printTier && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                                {item.printTechnique} · {item.printTier}
                              </span>
                            )}
                            {item.neckLabel && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                                🏷️ Neck label
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm text-zinc-900">₹{((item.blankPrice + item.printPrice) * item.qty).toLocaleString("en-IN")}</p>
                          {item.qty > 1 && <p className="text-[10px] text-zinc-400">₹{(item.blankPrice + item.printPrice).toLocaleString("en-IN")} each</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Receipt breakdown */}
                <div className="px-6 py-4 bg-zinc-50/70 border-t border-zinc-100 flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Products</span><span>₹{blankSub.toLocaleString("en-IN")}</span>
                  </div>
                  {printSub > 0 && (
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>Customization</span><span>₹{printSub.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {neckSub > 0 && (
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>Neck labels</span><span>₹{neckSub.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {orderSuccess.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>Discount{orderSuccess.couponCode ? ` (${orderSuccess.couponCode})` : ""}</span>
                      <span>−₹{orderSuccess.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>{orderSuccess.shippingLabel || "Shipping"}</span>
                    <span>{orderSuccess.shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : `₹${orderSuccess.shipping.toLocaleString("en-IN")}`}</span>
                  </div>
                  {isINR && gstAmount > 0 && (
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>GST (5%)</span><span>₹{gstAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-base pt-3 mt-1 border-t border-zinc-200">
                    <span>Total paid</span>
                    <span className="text-orange-600">₹{successTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Guarantee strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🎨", title: "Print verified", body: "We review every design before printing" },
                  { icon: "✅", title: "Quality check", body: "Inspected before it ships to you" },
                  { icon: "📦", title: "Tracked delivery", body: "End-to-end courier tracking" },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 text-center">
                    <p className="text-2xl mb-1.5">{icon}</p>
                    <p className="text-xs font-black text-zinc-900 mb-1">{title}</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT col — Contact + delivery info */}
            <div className="md:col-span-2 flex flex-col gap-4">

              {/* Email confirmation */}
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-black text-sm" style={{ letterSpacing: "-0.02em" }}>Confirmation sent</p>
                </div>
                <p className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-3 py-2 rounded-xl mb-2 truncate">{orderSuccess.email}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">Check your inbox (and spam) for a full order confirmation with tracking details.</p>
              </div>

              {/* Delivery info */}
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="font-black text-sm" style={{ letterSpacing: "-0.02em" }}>Delivering to</p>
                </div>
                <p className="text-sm font-semibold text-zinc-900 mb-0.5">{orderSuccess.name}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{form.address}</p>
                <p className="text-xs text-zinc-500">{form.city}{form.pin ? ` — ${form.pin}` : ""}{form.state ? `, ${form.state}` : ""}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-xs font-semibold text-orange-600">Est. delivery by {addDays(7)}</span>
                </div>
              </div>

              {/* Need help */}
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 text-base">💬</div>
                  <p className="font-black text-sm" style={{ letterSpacing: "-0.02em" }}>Need help?</p>
                </div>
                <a href="mailto:hello@halftonelabs.in" className="block text-sm font-bold text-orange-500 hover:underline mb-1">hello@halftonelabs.in</a>
                <p className="text-xs text-zinc-400 leading-relaxed">We respond within 24 hours. Reference your order number <span className="font-mono font-semibold text-zinc-600">#{orderSuccess.ref}</span> when writing in.</p>
              </div>

              {/* All sales final */}
              <div className="flex items-start gap-2.5 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>All sales are final.</strong> Every product is custom made to order just for you — no returns or exchanges.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── INSTAGRAM STRIP ────────────────────────────────────────────── */}
          <motion.a
            href="https://instagram.com/halftonelabs"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="block w-full rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f97316 0%, #f43f5e 100%)" }}
          >
            <div className="flex items-center justify-between px-7 py-5">
              <div>
                <p className="text-white font-black text-base mb-0.5">Tag us when it arrives! 🤙</p>
                <p className="text-orange-100 text-sm">Share a photo <strong>@halftonelabs</strong> for a surprise gift 🎁</p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </div>
          </motion.a>
        </div>

        {/* ── FIXED BOTTOM BAR ───────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-zinc-100 px-4 py-3 z-10 shadow-xl">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Link href={`/track?ref=${orderSuccess.ref}&email=${encodeURIComponent(orderSuccess.email)}`} className="flex-1">
              <button className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Track order
              </button>
            </Link>
            <Link href={checkoutOrigin.type === "store" ? `/store/${checkoutOrigin.handle}` : "/products"} className="flex-1">
              <button className="w-full py-3.5 rounded-2xl border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-colors">
                Continue shopping →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] pt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ letterSpacing: "-0.04em" }}>Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-black text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Contact</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Full name</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-black text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Shipping address</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    {COUNTRY_LIST.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Street address, apartment…" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="City" />
                  <input value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
                    onBlur={(e) => country === "IN" && e.target.value && fetchShipping(country, e.target.value, totalQty)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={country === "IN" ? "PIN code" : "Postal code"} />
                </div>
                <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder={country === "IN" ? "State" : "State / Province / Region"} />
              </div>

              {/* Billing toggle */}
              <div className="mt-5 pt-5 border-t border-zinc-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div onClick={() => setForm((f) => ({ ...f, sameAsBilling: !f.sameAsBilling }))}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${form.sameAsBilling ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"}`}>
                    {form.sameAsBilling && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm text-zinc-700">Billing address same as shipping</span>
                </label>
                <AnimatePresence>
                  {!form.sameAsBilling && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 flex flex-col gap-3">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Billing address</p>
                      <input value={form.billingName} onChange={(e) => setForm((f) => ({ ...f, billingName: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Name on billing" />
                      <input value={form.billingAddress} onChange={(e) => setForm((f) => ({ ...f, billingAddress: e.target.value }))}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Billing address" />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={form.billingCity} onChange={(e) => setForm((f) => ({ ...f, billingCity: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="City" />
                        <input value={form.billingPin} onChange={(e) => setForm((f) => ({ ...f, billingPin: e.target.value }))}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="PIN / Postal code" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Shipping method */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-black text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Shipping method</h2>
              {loadingShipping ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Calculating rates…
                </div>
              ) : shippingOptions.length === 0 ? (
                <div className="text-sm text-zinc-400">
                  Enter your address to see shipping options.{" "}
                  <button onClick={() => fetchShipping(country, form.pin, totalQty)} className="text-orange-500 underline">Refresh</button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {shippingOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setSelectedShipping(opt)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${selectedShipping?.id === opt.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"}`}>
                      <div className="text-left">
                        <p className="font-semibold text-zinc-800">{opt.label}</p>
                        <p className="text-xs text-zinc-400">{opt.carrier} · {opt.days}</p>
                      </div>
                      <p className="font-bold">{fmt(opt.rate)}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Fulfilled from India note */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold border border-orange-100">
                  🇮🇳 Fulfilled from India
                </span>
                {country !== "IN" && (
                  <span className="text-xs text-zinc-400 italic">International delivery · Est. 10–20 business days</span>
                )}
              </div>
            </div>

            {/* Coupon code */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-black text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Coupon code</h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                  <div>
                    <p className="font-bold text-green-700 text-sm">🎉 {appliedCoupon.code}</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      {appliedCoupon.description ?? (appliedCoupon.discount_type === "percent"
                        ? `${appliedCoupon.discount_value}% off`
                        : `${fmt(appliedCoupon.discount_value)} off`)}
                      {" "}— saving {fmt(appliedCoupon.discount_amount)}
                    </p>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)}
                    className="text-green-400 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase placeholder:normal-case placeholder:text-zinc-400"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                    className="px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap">
                    {couponLoading ? "…" : "Apply"}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-500 mt-2">{couponError}</p>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 sticky top-24">
              <h2 className="font-black text-lg mb-5" style={{ letterSpacing: "-0.03em" }}>Order summary</h2>

              {/* Cart items */}
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: item.colorHex, border: "1px solid rgba(0,0,0,0.08)" }}>
                      {item.frontDesignUrl || item.backDesignUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={item.frontDesignUrl || item.backDesignUrl} alt="" className="w-8 h-8 object-contain" />
                        : <span className="text-[8px] text-white/60 leading-tight text-center">blank</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.productName} {item.qty > 1 ? `×${item.qty}` : ""}</p>
                      <p className="text-xs text-zinc-400">{item.color} · {item.size} · {item.side === "both" ? "Front + Back" : item.side === "none" ? "No print" : `${item.side} print`}</p>
                      {item.printTier && <p className="text-xs text-orange-500">DTG {item.printTier}</p>}
                    </div>
                    <p className="font-semibold text-sm">{fmt((item.blankPrice + item.printPrice) * item.qty)}</p>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-zinc-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Product</span>
                  <span>{fmt(itemsSubtotal)}</span>
                </div>
                {printSubtotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Customization</span>
                    <span>{fmt(printSubtotal)}</span>
                  </div>
                )}
                {neckLabelSubtotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Neck label</span>
                    <span>{fmt(neckLabelSubtotal)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>−{fmt(appliedCoupon.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 flex items-center">
                    Shipping
                    {country !== "IN" && (
                      <InfoTooltip text="Shipping fees DO NOT include customs duties and handling charges for international orders." />
                    )}
                  </span>
                  <span className={isFreeShipping ? "text-green-600 font-semibold" : ""}>
                    {isFreeShipping ? "Free 🎉" : selectedShipping ? fmt(shippingCost) : "—"}
                  </span>
                </div>
                {isINR && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">GST (5%)</span>
                    <span>{fmt(totalGst)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span>{fmt(grandTotalINR)}</span>
                </div>
              </div>

              {payError && (
                <div className="mt-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{payError}</div>
              )}

              <button
                onClick={handlePay}
                disabled={paying || !form.name || !form.email || !form.address || !form.city || !selectedShipping}
                className="w-full mt-5 py-4 rounded-2xl bg-orange-500 text-white font-black text-base hover:bg-orange-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {paying ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Processing…</>
                ) : <>Pay {fmt(grandTotalINR)} →</>}
              </button>

              <p className="text-xs text-zinc-400 text-center mt-3">
                Secured by Razorpay · <a href="mailto:hello@halftonelabs.in" className="underline">hello@halftonelabs.in</a>
              </p>
              <div className="mt-3 flex items-start gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                <svg className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  <strong className="text-zinc-700">All sales are final.</strong> No exchanges or returns — every product is custom made to order just for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
