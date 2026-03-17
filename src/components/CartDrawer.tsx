"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div>
                <h2 className="font-black text-lg" style={{ letterSpacing: "-0.04em" }}>Your Cart</h2>
                <p className="text-xs text-zinc-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-500 text-xl leading-none">&times;</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="font-bold text-zinc-700 mb-1">Your cart is empty</p>
                  <p className="text-sm text-zinc-400">Add a product from the Studio</p>
                  <button onClick={onClose}>
                    <Link href="/studio" className="mt-4 inline-block px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold">
                      Go to Studio
                    </Link>
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="flex gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                    {/* Design thumbnail */}
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: item.colorHex, border: "1px solid rgba(0,0,0,0.08)" }}
                    >
                      {item.designDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.designDataUrl} alt="design" className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-xs text-zinc-400 text-center leading-tight">blank</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-zinc-900 truncate">{item.productName}</p>
                      <p className="text-xs text-zinc-400">{item.gsm} · {item.color} · {item.size}</p>
                      {item.printTier && <p className="text-xs text-orange-500 font-medium mt-0.5">Print: {item.printTier}</p>}
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="font-bold text-sm">₹{(item.blankPrice + item.printPrice).toLocaleString("en-IN")}</p>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-zinc-500">Subtotal (excl. shipping)</p>
                  <p className="font-bold text-zinc-900">₹{total.toLocaleString("en-IN")}</p>
                </div>
                <p className="text-xs text-zinc-400 mb-4">Shipping calculated at checkout</p>
                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
                    Checkout →
                  </button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full mt-2 py-2 text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
