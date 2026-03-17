"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "INR" | "USD" | "EUR";

export const CURRENCY_META: Record<Currency, { symbol: string; label: string; flag: string }> = {
  INR: { symbol: "₹", label: "INR",  flag: "🇮🇳" },
  USD: { symbol: "$", label: "USD",  flag: "🇺🇸" },
  EUR: { symbol: "€", label: "EUR",  flag: "🇪🇺" },
};

// INR-per-foreign-unit with 2× international markup baked in
// Market: 1 USD ≈ 83 INR → at 2× we price as if 1 USD = 41.5 INR
// Market: 1 EUR ≈ 90 INR → at 2× we price as if 1 EUR = 45 INR
const RATES: Record<Currency, number> = {
  INR: 1,
  USD: 41.5,
  EUR: 45,
};

export function fmtPrice(inr: number, currency: Currency): string {
  const { symbol } = CURRENCY_META[currency];
  if (currency === "INR") {
    return `₹${Math.round(inr).toLocaleString("en-IN")}`;
  }
  const converted = inr / RATES[currency];
  // Round to nearest 0.5 for clean display
  const rounded = Math.ceil(converted * 2) / 2;
  return `${symbol}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fmt: (inr: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  setCurrency: () => {},
  fmt: (inr) => `₹${Math.round(inr).toLocaleString("en-IN")}`,
  symbol: "₹",
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const fmt = (inr: number) => fmtPrice(inr, currency);
  const symbol = CURRENCY_META[currency].symbol;
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fmt, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
