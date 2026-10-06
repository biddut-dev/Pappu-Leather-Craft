"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-[#0B0B0B] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#2A2A2A] flex items-center justify-center mx-auto text-zinc-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif text-[#F3EDE3] font-bold">Your Cart is Empty</h1>
          <p className="text-xs text-zinc-400">
            Explore our collection of handcrafted Bangladeshi leather shoes, boots, and accessories.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Shopping Cart</span>
        </nav>

        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Shopping Cart ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Layout: Items + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#131313] border border-[#222222] hover:border-[#333333] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2C2C2C]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-semibold text-white hover:text-[#A47551] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="px-2 py-0.5 bg-[#1C1C1C] border border-[#2B2B2B] rounded text-white font-mono text-[11px]">
                        Size: {item.size}
                      </span>
                      <span>•</span>
                      <span>{item.color}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#8B5E3C] sm:hidden">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#202020]">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#2E2E2E] rounded bg-[#181818]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 text-zinc-400 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-sm font-bold text-white min-w-[80px] text-right font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/shop"
                className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Summary Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-lg bg-[#141414] border border-[#242424] space-y-5 sticky top-24">
              <h2 className="text-base font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424]">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-white font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Estimated Delivery</span>
                  <span className="text-zinc-400">From ৳70 (at checkout)</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Estimated Tax</span>
                  <span className="text-zinc-400">৳0 (Inclusive)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Estimated Total</span>
                <span className="text-xl font-bold text-[#F3EDE3] font-mono">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-xl hover:shadow-orange-950/30"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
                <span>Cash on Delivery & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
