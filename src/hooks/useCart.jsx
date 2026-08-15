import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, qty }]

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.product.id === product.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.product.price_kobo * x.qty, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, x) => sum + x.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
