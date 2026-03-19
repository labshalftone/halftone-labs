"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { supabase } from "@/lib/supabase";
import CartDrawer from "./CartDrawer";
import { useCurrency, CURRENCY_META, type Currency } from "@/lib/currency-context";
import { ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";

const CURRENCIES: Currency[] = ["INR", "USD", "EUR"];

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Academy", href: "/academy" },
  { label: "Help", href: "/help" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { count } = useCart();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* ── Floating pill navbar ── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[860px]"
      >
        <div className="bg-white/95 backdrop-blur-md border border-black/[0.07] rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.08)] px-3 py-2 flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center pl-2 shrink-0">
            <span
              className="text-[0.95rem] text-ds-dark"
              style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
            >
              Halftone Labs
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-[0.78rem] text-ds-body hover:text-ds-dark transition-colors rounded-full hover:bg-black/[0.04]"
                style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Currency picker */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCurrencyOpen((o) => !o)}
                className="flex items-center gap-1 text-[0.72rem] font-semibold px-2.5 py-1.5 rounded-full border border-black/[0.08] hover:border-black/20 transition-colors text-ds-body"
              >
                <span>{CURRENCY_META[currency].flag}</span>
                <span>{CURRENCY_META[currency].label}</span>
                <ChevronDown size={11} className="opacity-40" />
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setCurrencyOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden min-w-[120px]"
                    >
                      {CURRENCIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors text-left ${
                            currency === c ? "bg-ds-dark text-white" : "hover:bg-zinc-50 text-ds-dark"
                          }`}
                        >
                          <span>{CURRENCY_META[c].flag}</span>
                          <span>{CURRENCY_META[c].label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Studio pill */}
            <Link
              href="/studio"
              className="hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] px-3.5 py-2 rounded-full bg-ds-dark text-white hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              Studio
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.05] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={16} className="text-ds-dark" strokeWidth={2} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] min-h-[16px] rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center leading-none px-0.5">
                  {count}
                </span>
              )}
            </button>

            {/* Account */}
            {userEmail ? (
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.05] transition-colors"
                title={userEmail}
              >
                <User size={16} className="text-ds-dark" strokeWidth={2} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-[0.78rem] px-3 py-2 rounded-full hover:bg-black/[0.04] transition-colors text-ds-body"
                style={{ fontWeight: 500 }}
              >
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.05] transition-colors"
            >
              {menuOpen ? <X size={17} className="text-ds-dark" /> : <Menu size={17} className="text-ds-dark" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-6 left-4 right-4 bg-white rounded-3xl shadow-xl border border-black/[0.06] overflow-hidden"
            >
              {/* Nav links */}
              <div className="p-6 pt-8">
                <Link href="/" className="block mb-6">
                  <span className="text-lg font-bold text-ds-dark" style={{ letterSpacing: "-0.05em" }}>
                    Halftone Labs
                  </span>
                </Link>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-xl font-semibold text-ds-dark py-1"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="text-xl font-semibold text-ds-body py-1"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
              {/* Footer */}
              <div className="border-t border-black/[0.06] px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Link
                    href="/studio"
                    onClick={() => setMenuOpen(false)}
                    className="btn-brand text-[0.82rem] px-4 py-2"
                  >
                    Open Studio
                  </Link>
                  {userEmail ? (
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-ds-body font-medium"
                    >
                      Account
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-ds-body font-medium"
                    >
                      Login
                    </Link>
                  )}
                </div>
                {/* Currency switcher */}
                <div className="flex items-center gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setMenuOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        currency === c
                          ? "bg-ds-dark text-white"
                          : "bg-zinc-100 text-ds-body hover:bg-zinc-200"
                      }`}
                    >
                      <span>{CURRENCY_META[c].flag}</span>
                      <span>{CURRENCY_META[c].label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart drawer ── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
