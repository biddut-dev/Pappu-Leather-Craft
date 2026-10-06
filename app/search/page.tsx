import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import { Search, ChevronRight, PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products | Pappu Leather Craft",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  const products = q ? await getProducts({ search: q }) : [];

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Search</span>
        </nav>

        {/* Search Input Bar */}
        <div className="max-w-2xl">
          <form action="/search" method="GET" className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search loafers, oxfords, boots, belts..."
              className="w-full bg-[#141414] border border-[#2B2B2B] rounded-lg pl-12 pr-28 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {q ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <p className="text-sm text-zinc-400">
                Found <strong className="text-white">{products.length}</strong> results for &ldquo;
                <span className="text-[#F3EDE3]">{q}</span>&rdquo;
              </p>
            </div>

            {products.length === 0 ? (
              <div className="p-16 text-center space-y-3 bg-[#111111] rounded-lg border border-[#222222]">
                <PackageSearch className="w-10 h-10 text-zinc-500 mx-auto" />
                <h3 className="text-base font-serif text-[#F3EDE3]">No footwear found</h3>
                <p className="text-xs text-zinc-400">
                  Try checking your spelling or search by material (e.g., &quot;cowhide&quot;, &quot;pull-up&quot;), or category.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2.5 bg-[#8B5E3C] text-white text-xs font-bold uppercase rounded"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-400 text-sm bg-[#121212] rounded-lg border border-[#222222]">
            Enter a keyword above to find your desired leather shoe or accessory.
          </div>
        )}
      </div>
    </div>
  );
}
