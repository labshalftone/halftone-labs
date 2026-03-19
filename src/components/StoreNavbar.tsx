"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "./CartDrawer";

export default function StoreNavbar({
  storeName,
  storeHandle,
  variant = "overlay",
}: {
  storeName: string;
  storeHandle: string;
  /** overlay = transparent on dark hero, scrolls to white | solid = always white */
  variant?: "overlay" | "solid";
}) {
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    if (variant === "solid") { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const light = scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          light
            ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Store name — NOT Halftone branding */}
          <Link
            href={`/store/${storeHandle}`}
            className={`font-semibold text-lg leading-none transition-colors ${
              light ? "text-ds-dark" : "text-white"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {storeName}
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/track"
              className={`hidden sm:block text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
                light
                  ? "text-ds-body hover:text-ds-dark hover:bg-black/5"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Track order
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                light ? "hover:bg-black/5" : "hover:bg-white/10"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${light ? "text-ds-dark" : "text-white"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand text-white text-[9px] font-semibold flex items-center justify-center leading-none px-1">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
