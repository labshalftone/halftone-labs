"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const GST_RATE = 0.05;         // 5% on products and shipping
export const NECK_LABEL_PRICE = 7;    // ₹7 per piece for DTF neck label

export interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  gsm: string;
  color: string;
  colorHex: string;
  size: string;
  qty: number;

  // Per-side design data (empty string = no design / blank that side)
  frontDesignUrl: string;
  backDesignUrl: string;
  frontPrintPrice: number;  // 0 if no front print
  backPrintPrice: number;   // 0 if no back print
  frontPrintTier: string;
  backPrintTier: string;
  printDims: string;        // primary print dimensions label
  printTechnique: "DTG" | "DTF" | "none"; // print method

  blankPrice: number;       // per unit blank garment price
  neckLabel: boolean;       // DTF neck label transfer (+₹7/piece)

  // Composite thumbnails — mockup with design overlaid (optional)
  thumbnail?: string;     // front-side composite
  backThumbnail?: string; // back-side composite
  mockupFront?: string;

  // Derived — computed by addItem, do not set manually
  printPrice: number;       // frontPrintPrice + backPrintPrice (per unit)
  side: "front" | "back" | "both" | "none";
  hasDesign: boolean;
  designDataUrl: string;    // frontDesignUrl || backDesignUrl (for thumbnail)
  printTier: string;        // composite label e.g. "5×5" or "5×5 + 8.5×11""
}

// What callers pass to addItem — no derived fields needed
export type AddItemPayload = Omit<
  CartItem,
  "cartId" | "printPrice" | "side" | "hasDesign" | "designDataUrl" | "printTier"
>;

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemPayload) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, qty: number) => void;
  clearCart: () => void;
  itemsSubtotal: number;        // blank price × qty across all items
  printSubtotal: number;        // print price × qty across all items
  neckLabelSubtotal: number;    // ₹7 × qty for items with neck label
  count: number;
  total: number;                // items + print + neckLabel (no shipping, no tax)
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  itemsSubtotal: 0,
  printSubtotal: 0,
  neckLabelSubtotal: 0,
  count: 0,
  total: 0,
});

function deriveFields(item: AddItemPayload): Omit<CartItem, "cartId"> {
  const printPrice  = item.frontPrintPrice + item.backPrintPrice;
  const hasFront    = !!item.frontDesignUrl;
  const hasBack     = !!item.backDesignUrl;
  const side: CartItem["side"] = hasFront && hasBack ? "both" : hasBack ? "back" : hasFront ? "front" : "none";
  const hasDesign   = hasFront || hasBack;
  const designDataUrl = item.frontDesignUrl || item.backDesignUrl;
  const tiers = [item.frontPrintTier, item.backPrintTier].filter(Boolean);
  const printTier   = tiers.length > 1 ? tiers.join(" + ") : tiers[0] ?? "";
  return { ...item, printPrice, side, hasDesign, designDataUrl, printTier, thumbnail: item.thumbnail ?? "", backThumbnail: item.backThumbnail ?? "", mockupFront: item.mockupFront ?? "" };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hl_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("hl_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((item: AddItemPayload) => {
    const derived = deriveFields(item);
    setItems((prev) => [...prev, { ...derived, cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}` }]);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => i.cartId === cartId ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemsSubtotal     = items.reduce((s, i) => s + i.blankPrice * i.qty, 0);
  const printSubtotal     = items.reduce((s, i) => s + i.printPrice * i.qty, 0);
  const neckLabelSubtotal = items.reduce((s, i) => s + (i.neckLabel ? NECK_LABEL_PRICE * i.qty : 0), 0);
  const total  = itemsSubtotal + printSubtotal + neckLabelSubtotal;
  const count  = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemsSubtotal, printSubtotal, neckLabelSubtotal, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
