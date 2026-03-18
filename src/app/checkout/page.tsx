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
  const { items, itemsSubtotal, printSubtotal, total, clearCart } = useCart();
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
  const [orderSuccess, setOrderSuccess] = useState<{ ref: string } | null>(null);

  // Track where checkout was initiated from (studio vs store)
  type CheckoutOrigin = { type: "studio" } | { type: "store"; handle: string; name: string };
  const [checkoutOrigin, setCheckoutOrigin] = useState<CheckoutOrigin>({ type: "studio" });
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkout_origin");
      if (raw) setCheckoutOrigin(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const shippingCost    = selectedShipping?.rate ?? 0;
  const discount        = appliedCoupon?.discount_amount ?? 0;
  const discountedTotal = Math.max(0, total - discount);
  // GST only applies to INR (domestic India) orders
  const gstProduct      = isINR ? Math.round(discountedTotal * GST_RATE) : 0;
  const gstShipping     = isINR ? Math.round(shippingCost * GST_RATE) : 0;
  const totalGst        = gstProduct + gstShipping;
  const grandTotalINR   = discountedTotal + shippingCost + totalGst;
  // Numeric amount in the selected currency (for Razorpay charge)
  const grandTotalForeign = toForeignAmount(grandTotalINR, currency);

  const fetchShipping = useCallback(async (countryCode: string, pin: string) => {
    setLoadingShipping(true);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryCode, pin: pin || "201304" }),
      });
      const data = await res.json();
      if (data.options?.length) {
        setShippingOptions(data.options);
        setSelectedShipping(data.options[0]);
      }
    } catch {}
    setLoadingShipping(false);
  }, []);

  useEffect(() => { fetchShipping(country, form.pin); }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePay = async () => {
    if (!form.name || !form.email || !form.address || !form.city || !selectedShipping) return;
    setPaying(true); setPayError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
            const ref = `HL${Date.now().toString(36).toUpperCase()}`;
            try {
              const saveRes = await fetch("/api/save-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderRef: ref,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  product: items.map((i) => `${i.productName} ${i.gsm}`).join(" + "),
                  color: items.map((i) => i.color).join(", "),
                  size: items.map((i) => i.size).join(", "),
                  printTier: items.map((i) => i.printTier).filter(Boolean).join(", ") || null,
                  printDimensions: items.map((i) => i.printDims).filter(Boolean).join(", ") || null,
                  blankPrice: items.reduce((s, i) => s + i.blankPrice, 0),
                  printPrice: items.reduce((s, i) => s + i.printPrice, 0),
                  shipping: selectedShipping.rate,
                  total: grandTotalINR,
                  currency,
                  totalForeign: grandTotalForeign,
                  couponCode: appliedCoupon?.code ?? null,
                  discountAmount: discount,
                  frontDesignUrl: items.map(i => i.frontDesignUrl || "").find(Boolean) ?? null,
                  backDesignUrl:  items.map(i => i.backDesignUrl  || "").find(Boolean) ?? null,
                  mockupUrl:      items.map(i => i.thumbnail      || "").find(Boolean) ?? null,
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
              // Increment coupon uses
              if (appliedCoupon?.code) {
                await fetch("/api/coupon", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code: appliedCoupon.code }),
                });
              }
              clearCart();
              setOrderSuccess({ ref });
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
    return (
      <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-10 text-center shadow-sm border border-zinc-100">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em" }}>Order Placed!</h2>
          <p className="text-zinc-500 text-sm mb-2">Order reference:</p>
          <p className="text-2xl font-mono font-bold text-orange-500 mb-4">{orderSuccess.ref}</p>
          <p className="text-zinc-500 text-sm mb-6">
            Confirmation sent to <strong>{form.email}</strong>. Track at{" "}
            <Link href="/track" className="text-orange-500 underline">/track</Link>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/track">
              <button className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Track Order
              </button>
            </Link>
            <Link href={checkoutOrigin.type === "store" ? `/store/${checkoutOrigin.handle}` : "/studio"}>
              <button className="px-5 py-2.5 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                {checkoutOrigin.type === "store" ? `Back to ${checkoutOrigin.name || "Store"}` : "Back to Studio"}
              </button>
            </Link>
          </div>
        </motion.div>
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
                    onBlur={(e) => country === "IN" && e.target.value && fetchShipping(country, e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={country === "IN" ? "PIN code" : "Postal code"} />
                </div>
                {country === "IN" && (
                  <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="State" />
                )}
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
                  <button onClick={() => fetchShipping(country, form.pin)} className="text-orange-500 underline">Refresh</button>
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
                  <span>{selectedShipping ? fmt(shippingCost) : "—"}</span>
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
