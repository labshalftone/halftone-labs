"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart, GST_RATE } from "@/lib/cart-context";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, clearCart, itemsSubtotal, printSubtotal, total } = useCart();

  const gst = Math.round(total * GST_RATE);
  const grandTotal = total + gst;

  const sideLabel = (side: string) => {
    if (side === "both") return "Front + Back print";
    if (side === "back")  return "Back print";
    if (side === "front") return "Front print";
    return "No print";
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
              <div>
                <h2 className="font-semibold text-lg" style={{ letterSpacing: "-0.04em" }}>Your Cart</h2>
                <p className="text-xs text-ds-muted">{items.length} item{items.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.05] transition-colors text-ds-body text-xl leading-none">&times;</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="font-bold text-ds-body mb-1">Your cart is empty</p>
                  <p className="text-sm text-ds-muted">Add a product from the Studio</p>
                  <Link href="/studio" onClick={onClose} className="mt-4 inline-block px-5 py-2.5 rounded-full bg-ds-dark text-white text-sm font-semibold">
                    Go to Studio
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="p-3 rounded-2xl bg-ds-light-gray border border-black/[0.06]">
                    <div className="flex gap-3">
                      {/* Thumbnails — show composite mockup if available, else fall back to design-on-colour */}
                      <div className="flex gap-1 flex-shrink-0">
                        {item.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumbnail} className="w-14 h-14 object-cover rounded-xl" alt="product" />
                        ) : (
                          <>
                            {item.frontDesignUrl || (!item.backDesignUrl) ? (
                              <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                                style={{ background: item.colorHex, border: "1px solid rgba(0,0,0,0.08)" }}>
                                {item.frontDesignUrl
                                  // eslint-disable-next-line @next/next/no-img-element
                                  ? <img src={item.frontDesignUrl} alt="front" className="w-9 h-9 object-contain" />
                                  : <span className="text-[9px] text-white/50 leading-tight text-center px-1">blank</span>
                                }
                              </div>
                            ) : null}
                            {item.backDesignUrl && (
                              <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                                style={{ background: item.colorHex, border: "1px solid rgba(0,0,0,0.08)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.backDesignUrl} alt="back" className="w-9 h-9 object-contain" />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-ds-dark truncate">{item.productName}</p>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="text-[10px] text-ds-body">{item.color}</span>
                          <span className="text-[10px] text-ds-muted">·</span>
                          <span className="text-[10px] text-ds-body">Size {item.size}</span>
                          <span className="text-[10px] text-ds-muted">·</span>
                          <span className="text-[10px] text-ds-body">{sideLabel(item.side)}</span>
                        </div>
                        {item.printTier && (
                          <span className="text-[10px] text-brand font-semibold">{item.printTier}</span>
                        )}
                        {!item.hasDesign && (
                          <span className="text-[10px] text-ds-muted">Blank — no print</span>
                        )}
                      </div>

                      <button onClick={() => removeItem(item.cartId)} className="text-ds-muted hover:text-red-400 transition-colors self-start mt-0.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    {/* Qty + price row */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.cartId, item.qty - 1)}
                          className="w-7 h-7 rounded-full border border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-400 transition-colors text-sm font-bold leading-none">−</button>
                        <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId, item.qty + 1)}
                          className="w-7 h-7 rounded-full border border-black/[0.06] flex items-center justify-center text-ds-body hover:border-zinc-400 transition-colors text-sm font-bold leading-none">+</button>
                      </div>
                      <p className="font-bold text-sm">₹{((item.blankPrice + item.printPrice) * item.qty).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer breakdown */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-black/[0.06]">
                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-body">Product</span>
                    <span>₹{itemsSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {printSubtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ds-body">Customization</span>
                      <span>₹{printSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-body">Shipping</span>
                    <span className="text-ds-muted">at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-body">GST (5%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-black/[0.06] mt-1">
                    <span>Est. Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[10px] text-ds-muted">Final total incl. shipping shown at checkout</p>
                </div>

                <Link href="/cart" onClick={onClose}>
                  <button className="w-full py-4 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-orange-600 transition-colors">
                    View Cart & Checkout →
                  </button>
                </Link>
                <button onClick={clearCart} className="w-full mt-2 py-2 text-xs text-ds-muted hover:text-red-500 transition-colors">
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
