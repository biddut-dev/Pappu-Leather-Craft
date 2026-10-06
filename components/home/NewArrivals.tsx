import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const displayItems = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  return (
    <section className="py-12 sm:py-20 bg-[#0B0B0B] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
              <Sparkles className="w-3.5 h-3.5 text-[#A47551]" />
              <span>Fresh Off The Last</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
              Explore the latest season releases, handcrafted with modern silhouettes and signature comfort.
            </p>
          </div>

          <Link
            href="/new-arrivals"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#A47551] hover:text-[#F3EDE3] inline-flex items-center gap-2 transition-colors"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
