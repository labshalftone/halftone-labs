"use client";

import { useState, useEffect, useCallback } from "react";

interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WalletTab({ userId }: { userId: string }) {
  const [balance, setBalance]             = useState<number>(0);
  const [currency, setCurrency]           = useState<string>("INR");
  const [transactions, setTransactions]   = useState<WalletTransaction[]>([]);
  const [loading, setLoading]             = useState(true);
  const [addingCredit, setAddingCredit]   = useState(false);
  const [creditAmount, setCreditAmount]   = useState("");
  const [processing, setProcessing]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [activeFlowTab, setActiveFlowTab] = useState<"inflow" | "outflow">("inflow");
  const [changingCurrency, setChangingCurrency]   = useState(false);
  const [selectedCurrency, setSelectedCurrency]   = useState<string>("");
  const [currencySaving, setCurrencySaving]       = useState(false);
  const [currencyError, setCurrencyError]         = useState<string | null>(null);

  const CURRENCIES = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  ];

  const loadWallet = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setBalance(Number(data.balance ?? 0));
        setCurrency(data.currency ?? "INR");
        setTransactions(data.transactions ?? []);
      }
    } catch (e) {
      console.error("[WalletTab] load error:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadWallet(); }, [loadWallet]);

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>)["Razorpay"]) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleAddCredit = async () => {
    setError(null);
    const amount = Number(creditAmount);
    if (!amount || amount < 100 || amount > 100000) {
      setError("Amount must be between ₹100 and ₹1,00,000");
      return;
    }

    setProcessing(true);
    try {
      // Create Razorpay order
      const res = await fetch("/api/wallet/add-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to initiate payment");
        return;
      }

      const { razorpayOrderId, keyId, amount: confirmedAmount } = data;

      // Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Please try again.");
        return;
      }

      // Open Razorpay checkout
      const RazorpayConstructor = (window as unknown as Record<string, unknown>)["Razorpay"] as new (opts: unknown) => { open(): void };
      const rzp = new RazorpayConstructor({
        key: keyId,
        amount: Math.round(confirmedAmount * 100),
        currency: "INR",
        name: "Halftone Labs",
        description: "Wallet Top-up",
        order_id: razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/wallet/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: confirmedAmount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setBalance(Number(verifyData.newBalance ?? 0));
              setCreditAmount("");
              setAddingCredit(false);
              // Refresh full transaction list
              await loadWallet();
            } else {
              setError(verifyData.error ?? "Payment verification failed");
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {},
        theme: { color: "#111111" },
      });
      rzp.open();
    } catch (e) {
      console.error("[WalletTab] add-credit error:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveCurrency = async () => {
    if (!selectedCurrency || selectedCurrency === currency) {
      setChangingCurrency(false);
      return;
    }
    setCurrencySaving(true);
    setCurrencyError(null);
    try {
      const res = await fetch("/api/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currency: selectedCurrency }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrency(selectedCurrency);
        setChangingCurrency(false);
      } else {
        setCurrencyError(data.error ?? "Failed to update currency");
      }
    } catch {
      setCurrencyError("Something went wrong. Please try again.");
    } finally {
      setCurrencySaving(false);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    activeFlowTab === "inflow" ? t.type === "credit" : t.type === "debit"
  );

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Loading wallet…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Title */}
      <h2 className="text-2xl font-black text-zinc-900 mb-6" style={{ letterSpacing: "-0.04em" }}>Wallet</h2>

      {/* Credit balance card */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Your Credit</p>
        <p className="text-4xl font-black text-zinc-900 mb-1" style={{ letterSpacing: "-0.03em" }}>
          {currency} {formatCurrency(balance)}
        </p>
        <div className="mt-4 flex flex-col gap-1.5">
          <p className="text-xs text-zinc-500">
            • What is Credit and how does it work?{" "}
            <span className="text-orange-500 cursor-pointer hover:underline">Learn more</span>
          </p>
          <p className="text-xs text-zinc-500">
            • Credit are not eligible for withdrawal.
          </p>
        </div>
      </div>

      {/* Payment card section */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-4">
        <p className="text-sm font-black text-zinc-900 mb-1" style={{ letterSpacing: "-0.02em" }}>Payment card</p>
        <p className="text-xs text-zinc-500 mb-4">
          Add funds to your wallet to confirm Shopify orders and cover production costs.
        </p>

        {!addingCredit ? (
          <button
            onClick={() => { setAddingCredit(true); setError(null); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm font-black hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            + Add Credit
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="1"
                  placeholder="Enter amount (min ₹100)"
                  value={creditAmount}
                  onChange={(e) => { setCreditAmount(e.target.value); setError(null); }}
                  className="w-full pl-8 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  onKeyDown={(e) => e.key === "Enter" && handleAddCredit()}
                />
              </div>
              <button
                onClick={handleAddCredit}
                disabled={processing || !creditAmount}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {processing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : null}
                Pay via Razorpay
              </button>
              <button
                onClick={() => { setAddingCredit(false); setCreditAmount(""); setError(null); }}
                className="px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Store billing currency */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Store billing currency</p>

        {!changingCurrency ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-700">
                {CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency}
              </div>
              <span className="font-bold text-zinc-900 text-sm">{currency}</span>
            </div>
            <button
              onClick={() => { setSelectedCurrency(currency); setChangingCurrency(true); setCurrencyError(null); }}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-semibold hover:border-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c.code)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    selectedCurrency === c.code
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 hover:border-zinc-400 text-zinc-700"
                  }`}
                >
                  <span className="text-sm font-bold w-6 text-center">{c.symbol}</span>
                  <div>
                    <p className="text-xs font-bold leading-none">{c.code}</p>
                    <p className={`text-[10px] mt-0.5 leading-none ${selectedCurrency === c.code ? "text-zinc-300" : "text-zinc-400"}`}>{c.name}</p>
                  </div>
                </button>
              ))}
            </div>
            {currencyError && <p className="text-xs text-red-500">{currencyError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleSaveCurrency}
                disabled={currencySaving || !selectedCurrency}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {currencySaving ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : null}
                Save
              </button>
              <button
                onClick={() => { setChangingCurrency(false); setCurrencyError(null); }}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 text-sm font-semibold hover:text-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Transaction Record */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6">
        <p className="text-sm font-black text-zinc-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
          Wallet Transaction Record
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-zinc-100 rounded-xl p-1 w-fit">
          {(["inflow", "outflow"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFlowTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeFlowTab === tab
                  ? "bg-white shadow-sm text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-100 rounded-xl">
            <p className="text-zinc-400 text-sm font-semibold">No data</p>
            <p className="text-zinc-300 text-xs mt-1">
              {activeFlowTab === "inflow" ? "No credits yet" : "No debits yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-400 text-[10px] uppercase tracking-widest border-b border-zinc-100">
                  <th className="text-left py-2 pr-4 font-semibold">Description</th>
                  <th className="text-left py-2 pr-4 font-semibold">Time</th>
                  <th className="text-right py-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-zinc-800 text-xs">{t.description ?? "—"}</p>
                      {t.reference_id && (
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{t.reference_id}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(t.created_at)}
                    </td>
                    <td className={`py-3 text-right font-black text-sm ${
                      t.type === "credit" ? "text-green-600" : "text-red-500"
                    }`}>
                      {t.type === "credit" ? "+ " : "- "}₹{formatCurrency(Number(t.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
