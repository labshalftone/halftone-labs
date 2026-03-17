"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { supabase } from "@/lib/supabase";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-black/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-0">
            <span className="text-lg text-halftone-dark" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
              Halftone Labs
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8rem] text-halftone-dark/50 hover:text-halftone-purple transition-colors"
                style={{ letterSpacing: "-0.02em" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Studio link */}
            <Link
              href="/studio"
              className="hidden sm:inline-flex items-center gap-1.5 text-[0.8rem] font-bold px-4 py-2 rounded-full border transition-all hover:border-halftone-orange hover:text-halftone-orange"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#0f0f0f" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-halftone-orange inline-block" />
              Studio
            </Link>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5 text-halftone-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-halftone-orange text-white text-[9px] font-black flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* Login / Account */}
            {userEmail ? (
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-1.5 text-[0.8rem] font-bold px-3 py-2 rounded-full hover:bg-black/5 transition-colors text-halftone-dark/70"
                title={userEmail}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 text-[0.8rem] font-bold px-3 py-2 rounded-full hover:bg-black/5 transition-colors text-halftone-dark/60"
              >
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <span className={`w-5 h-0.5 bg-halftone-dark transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-5 h-0.5 bg-halftone-dark transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-halftone-dark transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="text-2xl text-halftone-dark" style={{ letterSpacing: "-0.04em" }}>
                  {link.label}
                </a>
              ))}
              <Link href="/studio" onClick={() => setMenuOpen(false)}
                className="text-2xl text-halftone-orange" style={{ letterSpacing: "-0.04em" }}>
                Studio ↗
              </Link>
              {userEmail ? (
                <Link href="/account" onClick={() => setMenuOpen(false)}
                  className="text-2xl text-halftone-dark/60" style={{ letterSpacing: "-0.04em" }}>
                  Account
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="text-2xl text-halftone-dark/60" style={{ letterSpacing: "-0.04em" }}>
                  Login
                </Link>
              )}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-4">
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
