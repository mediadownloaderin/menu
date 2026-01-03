"use client"
import { createContext } from "react";
import type { CartItemType } from "@/lib/types";

export interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: Omit<CartItemType, "quantity" | "minOrder">, minOrder: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateCartItem: (id: number, quantity: number) => void;
  getQuantity: (id: number) => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);