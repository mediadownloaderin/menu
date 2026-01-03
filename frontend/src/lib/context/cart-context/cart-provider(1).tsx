"use client"
import { useState } from "react";
import type { CartItemType } from "@/lib/types";
import { CartContext } from "./cart-context";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const addToCart = (
    item: Omit<CartItemType, "quantity" | "minOrder">,
    minOrder: number
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Add minOrder more if item already exists
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + minOrder }
            : i
        );
      }
      // First time: add with minOrder
      return [...prev, { ...item, quantity: minOrder, minOrder }];
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Prevent quantity going below minOrder
        const finalQty = Math.max(item.minOrder, quantity);

        return { ...item, quantity: finalQty };
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getQuantity = (id: number) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};