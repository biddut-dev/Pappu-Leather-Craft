"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#111111] border-l border-[#242424] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5E3C]" />
              <h2 className="text-base font-semibold tracking-wide uppercase">Your Cart ({itemCount})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-[#1E1E1E] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-serif text-[#F3EDE3]">Your cart is empty</p>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Discover handcrafted leather footwear built to endure every step of your journey.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-[#161616] border border-[#242424] rounded-lg transition-all hover:border-[#383838]"
                >
                  <div className="relative w-20 h-20 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-white hover:text-[#A47551] transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <span className="px-1.5 py-0.5 bg-[#202020] rounded border border-[#2C2C2C] text-[11px] text-[#F3EDE3]">
                          Size: {item.size}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#222222]">
                      <div className="flex items-center border border-[#2E2E2E] rounded bg-[#121212]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:text-[#A47551] text-zinc-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:text-[#A47551] text-zinc-400 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#F3EDE3]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal and Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#222222] bg-[#141414] space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between text-sm font-semibold text-white">
                  <span>Subtotal</span>
                  <span className="text-[#F3EDE3]">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Delivery charges calculated at checkout (Dhaka: ৳70 • Outside Dhaka: ৳130)
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-lg hover:shadow-orange-950/20"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-center text-xs font-semibold uppercase tracking-wider text-zinc-300 rounded transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
