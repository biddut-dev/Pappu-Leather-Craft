"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variantId: string, quantity?: number) => boolean;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "plc_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { success, error } = useToast();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product: Product, variantId: string, quantity = 1): boolean => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      error("Please choose a valid shoe size.");
      return false;
    }

    if (variant.stock <= 0) {
      error(`Size ${variant.size} is currently out of stock.`);
      return false;
    }

    const price = product.discountPrice || product.price;

    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > variant.stock) {
          error(`Only ${variant.stock} left in size ${variant.size}.`);
          return prev;
        }
        return prev.map((item) =>
          item.variantId === variantId ? { ...item, quantity: nextQty } : item
        );
      } else {
        const newItem: CartItem = {
          productId: product._id,
          variantId: variant.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] || "",
          size: variant.size,
          color: variant.color,
          price,
          quantity: Math.min(quantity, variant.stock),
          maxStock: variant.stock,
        };
        return [...prev, newItem];
      }
    });

    success(`Added ${product.name} (Size ${variant.size}) to cart`);
    setIsOpen(true);
    return true;
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const clamped = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
