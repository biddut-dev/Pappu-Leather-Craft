"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/shop/ProductCard";

export default function WishlistPage() {
  const { items, count } = useWishlist();

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/account" className="hover:text-white transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="space-y-1">
            <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
              My Wishlist ({count})
            </h1>
            <p className="text-xs text-zinc-400">
              Saved footwear and leather goods for your future wardrobe additions.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center bg-[#131313] border border-[#222222] rounded-lg space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center mx-auto text-zinc-600">
              <Heart className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif text-[#F3EDE3]">Your Wishlist is Empty</h3>
              <p className="text-xs text-zinc-400">
                Tap the heart icon on any leather product to save it here for later.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
