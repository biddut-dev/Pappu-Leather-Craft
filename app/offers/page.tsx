import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import { Tag, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Special Offers & Discounts | Pappu Leather Craft",
  description: "Browse discounted leather footwear and seasonal promotions.",
};

export default async function OffersPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.discountPrice && p.discountPrice < p.price);

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Special Offers</span>
        </nav>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8B5E3C] font-semibold">
            <Tag className="w-3.5 h-3.5 text-[#A47551]" />
            <span>Limited Promotion Pricing</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            Offers & Markdowns
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Enjoy premium genuine leather footwear at reduced prices. Handcrafted to the same stringent standards.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
