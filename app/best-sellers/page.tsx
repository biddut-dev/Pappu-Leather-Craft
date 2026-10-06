import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import { Flame, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Best Sellers | Pappu Leather Craft",
  description: "Our most trusted and top-rated genuine leather shoes and accessories.",
};

export default async function BestSellersPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.isBestSeller);
  const displayList = products.length > 0 ? products : allProducts.slice(0, 8);

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Best Sellers</span>
        </nav>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Proven Enduring Comfort</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            Best Sellers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Footwear that has earned hundreds of verified 5-star ratings from professionals, students, and leather enthusiasts nationwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
