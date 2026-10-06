import React from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SortDropdown from "@/components/shop/SortDropdown";
import { ChevronRight, PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const size = typeof resolvedParams.size === "string" ? resolvedParams.size : undefined;
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const onSaleOnly = resolvedParams.sale === "true";

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug: category,
      search,
      minPrice,
      maxPrice,
      size,
      sort,
      isOnSale: onSaleOnly || undefined,
    }),
    getCategories(),
  ]);

  const activeCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#A47551]">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Title & Category Banner */}
        <div className="mb-10 space-y-2">
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            {activeCategoryObj ? activeCategoryObj.name : "All Footwear & Accessories"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            {activeCategoryObj
              ? activeCategoryObj.description
              : "Discover our full portfolio of handcrafted Bangladeshi cowhide footwear, engineered for durability, structured support, and enduring elegance."}
          </p>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
          {/* Left: Filter Sidebar */}
          <div className="shrink-0 lg:w-64">
            <FilterSidebar categories={categories} />
          </div>

          {/* Right: Products Area */}
          <div className="flex-1 space-y-6">
            {/* Top Toolbar: Count + Sort */}
            <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
              <span className="text-xs text-zinc-400 font-mono">
                Showing <strong className="text-white">{products.length}</strong> styles
              </span>
              <SortDropdown />
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-[#111111] rounded-lg border border-[#222222] p-8">
                <div className="w-14 h-14 rounded-full bg-[#181818] border border-[#2B2B2B] flex items-center justify-center mx-auto text-zinc-500">
                  <PackageSearch className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-[#F3EDE3]">No matching products found</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Try relaxing your filters or exploring our other leather categories.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
