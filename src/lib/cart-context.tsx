"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const GST_RATE = 0.05; // 5% on products and shipping

export interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  gsm: string;
  color: string;
  colorHex: string;
  size: string;
  qty: number;
  side: "front" | "back" | "both";
  blankPrice: number;   // per unit
  printPrice: number;   // per unit
  printTier: string;
  printDims: string;
  hasDesign: boolean;
  designDataUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, qty: number) => void;
  clearCart: () => void;
  itemsSubtotal: number;   // blank price × qty across all items
  printSubtotal: number;   // print price × qty across all items
  count: number;
  total: number;           // items + print (no shipping, no tax)
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  itemsSubtotal: 0,
  printSubtotal: 0,
  count: 0,
  total: 0,
});

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

  const addItem = useCallback((item: Omit<CartItem, "cartId">) => {
    setItems((prev) => [...prev, { ...item, cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}` }]);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => i.cartId === cartId ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemsSubtotal = items.reduce((s, i) => s + i.blankPrice * i.qty, 0);
  const printSubtotal = items.reduce((s, i) => s + i.printPrice * i.qty, 0);
  const total = itemsSubtotal + printSubtotal;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemsSubtotal, printSubtotal, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
