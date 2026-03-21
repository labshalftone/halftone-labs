"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "INR" | "USD" | "EUR";

export const CURRENCY_META: Record<Currency, { symbol: string; label: string; flag: string }> = {
  INR: { symbol: "₹", label: "INR", flag: "🇮🇳" },
  USD: { symbol: "$", label: "USD", flag: "🌍" },
  EUR: { symbol: "€", label: "EUR", flag: "🇪🇺" },
};

export const RATES: Record<Currency, number> = {
  INR: 1,
  USD: 41.5,
  EUR: 45,
};

export function toForeignAmount(inr: number, currency: Currency): number {
  if (currency === "INR") return Math.round(inr);
  return Math.round((inr / RATES[currency]) * 100) / 100;
}

export function fmtPrice(inr: number, currency: Currency): string {
  const { symbol } = CURRENCY_META[currency];
  if (currency === "INR") {
    return `₹${Math.round(inr).toLocaleString("en-IN")}`;
  }
  const converted = inr / RATES[currency];
  const rounded = Math.ceil(converted * 2) / 2;
  return `${symbol}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`;
}

function getCookieCurrency(): Currency {
  if (typeof document === "undefined") return "INR";
  const match = document.cookie.match(/(?:^|;\s*)hl_currency=([^;]+)/);
  const val = match?.[1];
  if (val === "USD" || val === "EUR" || val === "INR") return val;
  return "INR";
}

function setCookieCurrency(c: Currency) {
  document.cookie = `hl_currency=${c};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fmt: (inr: number) => string;
  symbol: string;
  /** true = Indian region, false = global */
  isIndia: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  setCurrency: () => {},
  fmt: (inr) => `₹${Math.round(inr).toLocaleString("en-IN")}`,
  symbol: "₹",
  isIndia: true,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  // Read geo-detected cookie on mount (after hydration)
  useEffect(() => {
    setCurrencyState(getCookieCurrency());
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setCookieCurrency(c);
  };

  const fmt = (inr: number) => fmtPrice(inr, currency);
  const symbol = CURRENCY_META[currency].symbol;
  const isIndia = currency === "INR";

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fmt, symbol, isIndia }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
