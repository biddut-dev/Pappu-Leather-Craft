import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  const displayProducts = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-12 sm:py-20 bg-[#0E0E0E] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
              Our most celebrated leather silhouettes, vetted for enduring comfort and unmatched longevity.
            </p>
          </div>

          <Link
            href="/best-sellers"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#A47551] hover:text-[#F3EDE3] inline-flex items-center gap-2 transition-colors"
          >
            <span>See All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
