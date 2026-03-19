"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Design {
  id: string;
  name: string;
  product_id: string;
  product_name: string;
  color_name: string;
  color_hex: string;
  size: string;
  print_tier: string | null;
  blank_price: number;
  print_price: number;
  thumbnail: string | null;
  front_design_url: string | null;
  back_design_url: string | null;
  sku: string | null;
}

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
}

interface ShippingOption {
  id: string;
  label: string;
  carrier: string;
  rate: number;
  days: string;
}

type Step = "product" | "customer" | "shipping" | "review";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  saveToBook: boolean;
}

function emptyCustomerForm(): CustomerForm {
  return { name: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", pin: "", country: "IN", saveToBook: false };
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? "bg-green-500 text-white" : active ? "bg-ds-dark text-white" : "bg-black/[0.06] text-ds-muted"}`}>
        {done ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : n}
      </div>
      <span className={`text-[9px] font-semibold uppercase tracking-wider hidden sm:block ${active ? "text-ds-dark" : "text-ds-muted"}`}>{label}</span>
    </div>
  );
}

// ── Customer picker modal ───────────────────────────────────────────────────────

function CustomerPickerModal({
  userId,
  onSelect,
  onClose,
}: {
  userId: string;
  onSelect: (c: Customer | null, form: CustomerForm) => void;
  onClose: () => void;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "new">("list");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CustomerForm>(emptyCustomerForm());
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/customers?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q)
      || (c.email ?? "").toLowerCase().includes(q)
      || (c.phone ?? "").includes(q);
  });

  const set = (k: keyof CustomerForm, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleNewSubmit = () => {
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    onSelect(null, form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ds-dark" style={{ letterSpacing: "-0.03em" }}>
            {mode === "list" ? "Choose Customer" : "New Customer"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-zinc-200 text-ds-body text-xl leading-none">&times;</button>
        </div>

        {mode === "list" ? (
          <>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ds-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" placeholder="Search saved customers…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/[0.06] text-sm text-ds-dark placeholder:text-ds-muted focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>
              <button onClick={() => setMode("new")}
                className="px-4 py-2 rounded-xl bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors whitespace-nowrap">
                + New
              </button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-ds-muted py-6">
                <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-ds-muted mb-3">{search ? `No match for "${search}"` : "No saved customers yet"}</p>
                <button onClick={() => setMode("new")} className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
                  + Create new customer →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                {filtered.map((c) => (
                  <button key={c.id} onClick={() => onSelect(c, emptyCustomerForm())}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-ds-light-gray transition-colors text-left w-full">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ds-dark">{c.name}</p>
                      <p className="text-xs text-ds-muted">{[c.email, c.phone].filter(Boolean).join(" · ")}</p>
                      {c.city && <p className="text-xs text-ds-muted">{[c.address1, c.city].filter(Boolean).join(", ")}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setMode("list")} className="flex items-center gap-1.5 text-xs text-ds-muted hover:text-ds-body transition-colors mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back to saved customers
            </button>

            <div className="flex flex-col gap-3">
              {([
                ["Name *", "name", "text", "Full name"],
                ["Email", "email", "email", "customer@email.com"],
                ["Phone", "phone", "tel", "+91 98765 43210"],
                ["Address line 1 *", "address1", "text", "House / street"],
                ["Address line 2", "address2", "text", "Area / landmark (optional)"],
                ["City *", "city", "text", "City"],
                ["State", "state", "text", "State"],
                ["PIN Code *", "pin", "text", "6-digit PIN"],
              ] as [string, keyof CustomerForm, string, string][]).map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">{label}</label>
                  <input type={type} placeholder={ph} value={(form[key] as string) || ""}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors" />
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
              <label className="flex items-center gap-2.5 px-1 cursor-pointer">
                <input type="checkbox" checked={form.saveToBook} onChange={(e) => set("saveToBook", e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-black/[0.1] accent-zinc-900" />
                <span className="text-xs text-ds-body">Save to customer book</span>
              </label>
            </div>

            {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

            <div className="flex gap-2 mt-5">
              <button onClick={handleNewSubmit}
                className="flex-1 py-3 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors">
                Use this address →
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CreateOrderTab({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [step, setStep] = useState<Step>("product");

  // Product
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designsLoading, setDesignsLoading] = useState(true);
  const [designSearch, setDesignSearch] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  // Customer
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState<CustomerForm>(emptyCustomerForm());

  // Shipping
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Order note
  const [note, setNote] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ orderRef: string; total: number } | null>(null);

  // Sizes from catalog (fallback)
  const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  useEffect(() => {
    fetch(`/api/designs?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setDesigns(Array.isArray(d) ? d : []))
      .finally(() => setDesignsLoading(false));
  }, [userId]);

  useEffect(() => {
    fetch(`/api/wallet?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setWalletBalance(d.balance ?? null))
      .catch(() => {});
  }, [userId]);

  const fetchShipping = useCallback(async (pin: string, country: string) => {
    if (!pin && country === "IN") return;
    setShippingLoading(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, pin, weight: 0.5 }),
      });
      const data = await res.json();
      const opts: ShippingOption[] = data.options ?? [];
      setShippingOptions(opts);
      if (opts.length > 0) setSelectedShipping(opts[0]);
    } catch {}
    finally { setShippingLoading(false); }
  }, []);

  // Auto-fetch shipping when we reach shipping step
  useEffect(() => {
    if (step !== "shipping") return;
    const pin = selectedCustomer?.pin ?? customerForm.pin;
    const country = selectedCustomer?.country ?? customerForm.country;
    if (pin || country !== "IN") fetchShipping(pin ?? "", country);
  }, [step, selectedCustomer, customerForm.pin, customerForm.country, fetchShipping]);

  const filteredDesigns = designs.filter((d) =>
    d.name.toLowerCase().includes(designSearch.toLowerCase()) ||
    d.product_name.toLowerCase().includes(designSearch.toLowerCase()) ||
    d.color_name.toLowerCase().includes(designSearch.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer | null, form: CustomerForm) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerForm({
        name: customer.name,
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        address1: customer.address1 ?? "",
        address2: customer.address2 ?? "",
        city: customer.city ?? "",
        state: customer.state ?? "",
        pin: customer.pin ?? "",
        country: customer.country,
        saveToBook: false,
      });
    } else {
      setCustomerForm(form);
    }
    setCustomerPickerOpen(false);
    setStep("shipping");
  };

  const effectiveCustomer = {
    name: selectedCustomer?.name ?? customerForm.name,
    email: selectedCustomer?.email ?? customerForm.email,
    phone: selectedCustomer?.phone ?? customerForm.phone,
    address1: selectedCustomer?.address1 ?? customerForm.address1,
    address2: selectedCustomer?.address2 ?? customerForm.address2,
    city: selectedCustomer?.city ?? customerForm.city,
    state: selectedCustomer?.state ?? customerForm.state,
    pin: selectedCustomer?.pin ?? customerForm.pin,
    country: selectedCustomer?.country ?? customerForm.country,
  };

  const blankPrice = selectedDesign?.blank_price ?? 0;
  const printPrice = selectedDesign?.print_price ?? 0;
  const subtotal   = blankPrice + printPrice;
  const gst        = Math.round(subtotal * 0.05);
  const shipping   = selectedShipping?.rate ?? 0;
  const total      = subtotal + gst + shipping;

  const canProceedProduct   = !!selectedDesign;
  const canProceedCustomer  = !!(effectiveCustomer.name && (effectiveCustomer.address1 || effectiveCustomer.pin));
  const canProceedShipping  = !!selectedShipping;
  const insufficientBalance = walletBalance !== null && walletBalance < total;

  const handleSubmit = async () => {
    if (!selectedDesign || !canProceedCustomer || !selectedShipping) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/manual-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          merchantEmail: userEmail,
          designId: selectedDesign.id,
          productName: selectedDesign.product_name,
          colorName: selectedDesign.color_name,
          sizeName: selectedSize,
          blankPrice,
          printPrice,
          frontDesignUrl: selectedDesign.front_design_url,
          backDesignUrl: selectedDesign.back_design_url,
          thumbnail: selectedDesign.thumbnail,
          printTier: selectedDesign.print_tier,
          printTechnique: "DTG",
          shippingOption: selectedShipping.id,
          shippingAmount: selectedShipping.rate,
          customerName: effectiveCustomer.name,
          customerEmail: effectiveCustomer.email,
          customerPhone: effectiveCustomer.phone,
          address1: effectiveCustomer.address1,
          address2: effectiveCustomer.address2,
          city: effectiveCustomer.city,
          state: effectiveCustomer.state,
          pin: effectiveCustomer.pin,
          country: effectiveCustomer.country,
          note,
          saveCustomer: customerForm.saveToBook,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create order");
      setSubmitted({ orderRef: data.orderRef, total: data.total });
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setStep("product");
    setSelectedDesign(null);
    setSelectedSize("M");
    setSelectedCustomer(null);
    setCustomerForm(emptyCustomerForm());
    setShippingOptions([]);
    setSelectedShipping(null);
    setNote("");
    setSubmitError(null);
    setSubmitted(null);
  };

  // ── Success screen ────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-2xl font-semibold text-ds-dark mb-2" style={{ letterSpacing: "-0.04em" }}>Order placed!</h2>
        <p className="text-ds-body text-sm mb-1">Order <span className="font-mono font-bold">#{submitted.orderRef}</span></p>
        <p className="text-ds-body text-sm mb-6">₹{submitted.total.toLocaleString("en-IN")} debited from wallet. Confirmation sent to your email.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={resetAll} className="px-6 py-3 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors">
            Create another order →
          </button>
        </div>
      </div>
    );
  }

  // ── Steps UI ─────────────────────────────────────────────────────────────────

  const steps: { id: Step; label: string }[] = [
    { id: "product",  label: "Product"  },
    { id: "customer", label: "Customer" },
    { id: "shipping", label: "Shipping" },
    { id: "review",   label: "Review"   },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl font-semibold text-ds-dark" style={{ letterSpacing: "-0.04em" }}>Create Order</h2>
        {walletBalance !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ds-muted">Wallet</span>
            <span className={`text-sm font-bold ${walletBalance < 500 ? "text-red-500" : "text-ds-dark"}`}>
              ₹{walletBalance.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <StepDot n={i + 1} label={s.label} active={step === s.id} done={i < stepIndex} />
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full transition-colors ${i < stepIndex ? "bg-green-400" : "bg-black/[0.06]"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 1: Product ─────────────────────────────────────────────────── */}
        {step === "product" && (
          <motion.div key="product" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
              <h3 className="font-semibold text-ds-dark mb-4">Select a design</h3>

              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ds-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search designs…" value={designSearch}
                  onChange={(e) => setDesignSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/[0.06] text-sm text-ds-dark placeholder:text-ds-muted focus:outline-none focus:border-zinc-400 transition-colors" />
              </div>

              {designsLoading ? (
                <div className="flex items-center gap-2 text-sm text-ds-muted py-6">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                  Loading designs…
                </div>
              ) : filteredDesigns.length === 0 ? (
                <p className="text-sm text-ds-muted py-4 text-center">No designs found. <a href="/studio" className="text-brand font-semibold hover:text-brand-dark">Create one in Studio →</a></p>
              ) : (
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto -mx-1 px-1">
                  {filteredDesigns.map((d) => (
                    <button key={d.id} onClick={() => setSelectedDesign(selectedDesign?.id === d.id ? null : d)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedDesign?.id === d.id ? "border-zinc-900 bg-zinc-50" : "border-black/[0.06] hover:border-zinc-300"}`}>
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: d.thumbnail ? "#fff" : d.color_hex + "33" }}>
                        {d.thumbnail
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
                          : <span className="text-xl">👕</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ds-dark truncate">{d.name}</p>
                        <p className="text-xs text-ds-muted">{d.product_name} · {d.color_name}</p>
                        <p className="text-xs font-bold text-ds-dark mt-0.5">₹{(d.blank_price + d.print_price).toLocaleString("en-IN")} /unit</p>
                      </div>
                      {selectedDesign?.id === d.id && (
                        <svg className="w-5 h-5 text-ds-dark flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDesign && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
                <h3 className="font-semibold text-ds-dark mb-3 text-sm">Choose size</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${selectedSize === s ? "border-zinc-900 bg-ds-dark text-white" : "border-black/[0.06] text-ds-body hover:border-zinc-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <button onClick={() => setStep("customer")} disabled={!canProceedProduct}
              className="w-full py-4 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors disabled:opacity-40">
              Continue → Add customer
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Customer ─────────────────────────────────────────────────── */}
        {step === "customer" && (
          <motion.div key="customer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ds-dark">Customer &amp; shipping address</h3>
                <button onClick={() => setCustomerPickerOpen(true)}
                  className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors">
                  Choose saved →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {([
                  ["Name *", "name", "text", "Full name"],
                  ["Email", "email", "email", "customer@email.com"],
                  ["Phone", "phone", "tel", "+91 98765 43210"],
                  ["Address line 1 *", "address1", "text", "House / street"],
                  ["Address line 2", "address2", "text", "Area / landmark"],
                  ["City *", "city", "text", "City"],
                  ["State", "state", "text", "State"],
                  ["PIN Code *", "pin", "text", "6-digit PIN"],
                ] as [string, keyof CustomerForm, string, string][]).map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">{label}</label>
                    <input type={type} placeholder={ph}
                      value={(key === "saveToBook" ? "" : (customerForm[key] as string)) || ""}
                      onChange={(e) => {
                        setSelectedCustomer(null);
                        setCustomerForm((f) => ({ ...f, [key]: e.target.value }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1">Country</label>
                  <select value={customerForm.country}
                    onChange={(e) => { setSelectedCustomer(null); setCustomerForm((f) => ({ ...f, country: e.target.value })); }}
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
                <label className="flex items-center gap-2.5 px-1 cursor-pointer">
                  <input type="checkbox" checked={customerForm.saveToBook}
                    onChange={(e) => setCustomerForm((f) => ({ ...f, saveToBook: e.target.checked }))}
                    className="w-4 h-4 rounded border-2 border-black/[0.1] accent-zinc-900" />
                  <span className="text-xs text-ds-body">Save to customer book</span>
                </label>
              </div>

              {selectedCustomer && (
                <div className="mt-3 flex items-center gap-2 text-xs text-brand font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Filled from saved customer: {selectedCustomer.name}
                  <button onClick={() => { setSelectedCustomer(null); setCustomerForm(emptyCustomerForm()); }} className="text-ds-muted hover:text-red-500 ml-1">✕</button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("product")} className="px-5 py-4 rounded-2xl border border-black/[0.06] text-ds-body font-semibold text-sm hover:border-zinc-400 transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep("shipping")} disabled={!canProceedCustomer}
                className="flex-1 py-4 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors disabled:opacity-40">
                Continue → Shipping
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Shipping ─────────────────────────────────────────────────── */}
        {step === "shipping" && (
          <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
              <h3 className="font-semibold text-ds-dark mb-4">Choose shipping</h3>

              {shippingLoading ? (
                <div className="flex items-center gap-2 text-sm text-ds-muted py-4">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                  Fetching rates for {effectiveCustomer.pin || effectiveCustomer.country}…
                </div>
              ) : shippingOptions.length === 0 ? (
                <div>
                  <p className="text-sm text-ds-muted mb-3">
                    {effectiveCustomer.pin
                      ? `No rates found for PIN ${effectiveCustomer.pin}. Check the PIN or enter manually.`
                      : "Enter a PIN code to see live rates."}
                  </p>
                  <button onClick={() => fetchShipping(effectiveCustomer.pin ?? "", effectiveCustomer.country)}
                    className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors">
                    Retry →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {shippingOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setSelectedShipping(opt)}
                      className={`flex items-start justify-between p-4 rounded-xl border-2 text-left transition-all ${selectedShipping?.id === opt.id ? "border-zinc-900 bg-zinc-50" : "border-black/[0.06] hover:border-zinc-300"}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{opt.label.includes("Air") || opt.label.includes("Express") ? "✈️" : "🚛"}</span>
                          <p className="font-semibold text-sm text-ds-dark">{opt.label}</p>
                        </div>
                        <p className="text-xs text-ds-muted mt-0.5">{opt.carrier} · {opt.days}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-ds-dark">₹{opt.rate}</p>
                        {selectedShipping?.id === opt.id && (
                          <svg className="w-4 h-4 text-ds-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-black/[0.06]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ds-muted block mb-1.5">Production note (optional)</label>
                <textarea
                  placeholder="e.g. Double-check front print alignment, gift packaging, etc."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black/[0.06] focus:border-zinc-900 outline-none text-sm text-ds-dark transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("customer")} className="px-5 py-4 rounded-2xl border border-black/[0.06] text-ds-body font-semibold text-sm hover:border-zinc-400 transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep("review")} disabled={!canProceedShipping}
                className="flex-1 py-4 rounded-2xl bg-ds-dark text-white font-semibold text-sm hover:bg-ds-dark2 transition-colors disabled:opacity-40">
                Continue → Review
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Review ───────────────────────────────────────────────────── */}
        {step === "review" && selectedDesign && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
              <h3 className="font-semibold text-ds-dark mb-4">Order summary</h3>

              {/* Product */}
              <div className="flex gap-3 pb-4 border-b border-black/[0.06]">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: selectedDesign.thumbnail ? "#fff" : selectedDesign.color_hex + "33" }}>
                  {selectedDesign.thumbnail
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={selectedDesign.thumbnail} alt={selectedDesign.name} className="w-full h-full object-cover" />
                    : <span className="text-2xl">👕</span>}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ds-dark">{selectedDesign.name}</p>
                  <p className="text-xs text-ds-muted">{selectedDesign.product_name} · {selectedDesign.color_name} · {selectedSize}</p>
                  {selectedDesign.print_tier && <p className="text-xs text-brand font-semibold mt-0.5">{selectedDesign.print_tier}</p>}
                </div>
              </div>

              {/* Customer */}
              <div className="py-4 border-b border-black/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ds-muted mb-1.5">Ship to</p>
                <p className="text-sm font-semibold text-ds-dark">{effectiveCustomer.name}</p>
                <p className="text-xs text-ds-muted">{effectiveCustomer.email || ""}{effectiveCustomer.email && effectiveCustomer.phone ? " · " : ""}{effectiveCustomer.phone || ""}</p>
                <p className="text-xs text-ds-muted">
                  {[effectiveCustomer.address1, effectiveCustomer.address2, effectiveCustomer.city, effectiveCustomer.state, effectiveCustomer.pin].filter(Boolean).join(", ")}
                </p>
              </div>

              {/* Shipping */}
              {selectedShipping && (
                <div className="py-4 border-b border-black/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ds-muted mb-1.5">Shipping</p>
                  <p className="text-sm text-ds-dark">{selectedShipping.label} <span className="text-ds-muted">({selectedShipping.days})</span></p>
                </div>
              )}

              {note && (
                <div className="py-4 border-b border-black/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ds-muted mb-1">Note</p>
                  <p className="text-sm text-ds-body italic">{note}</p>
                </div>
              )}

              {/* Cost breakdown */}
              <div className="pt-4 flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-ds-body">Product</span>
                  <span>₹{blankPrice.toLocaleString("en-IN")}</span>
                </div>
                {printPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-body">Customization</span>
                    <span>₹{printPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ds-body">Shipping</span>
                  <span>₹{shipping.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ds-body">GST (5%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-black/[0.06] mt-1">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>

                {walletBalance !== null && (
                  <div className={`flex justify-between text-sm mt-1 font-medium ${insufficientBalance ? "text-red-500" : "text-green-600"}`}>
                    <span>Wallet balance after</span>
                    <span>{insufficientBalance ? "Insufficient balance" : `₹${(walletBalance - total).toLocaleString("en-IN")}`}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[11px] text-amber-700 font-medium">
                  The customer will <strong>not</strong> receive any email from us. Confirmation goes only to you at <strong>{userEmail}</strong>.
                </p>
              </div>
            </div>

            {submitError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{submitError}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep("shipping")} className="px-5 py-4 rounded-2xl border border-black/[0.06] text-ds-body font-semibold text-sm hover:border-zinc-400 transition-colors">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={submitting || insufficientBalance}
                className="flex-1 py-4 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing order…</>
                  : `Pay ₹${total.toLocaleString("en-IN")} from wallet →`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customerPickerOpen && (
          <CustomerPickerModal userId={userId} onSelect={handleCustomerSelect} onClose={() => setCustomerPickerOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
