import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SortDropdown from "@/components/shop/SortDropdown";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Pappu Leather Craft`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const categories = await getCategories();
  const activeCategory = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!activeCategory) {
    notFound();
  }

  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const size = typeof resolvedParams.size === "string" ? resolvedParams.size : undefined;
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const onSaleOnly = resolvedParams.sale === "true";

  const products = await getProducts({
    categorySlug: activeCategory.slug,
    minPrice,
    maxPrice,
    size,
    sort,
    isOnSale: onSaleOnly || undefined,
  });

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">{activeCategory.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-10 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
            Collection Showcase
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            {activeCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            {activeCategory.description}
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
          <div className="shrink-0 lg:w-64">
            <FilterSidebar categories={categories} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
              <span className="text-xs text-zinc-400 font-mono">
                Showing <strong className="text-white">{products.length}</strong> styles
              </span>
              <SortDropdown />
            </div>

            {products.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-[#111111] rounded-lg border border-[#222222] p-8">
                <p className="text-base text-[#F3EDE3] font-serif">No products currently in this category.</p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2.5 bg-[#8B5E3C] text-white text-xs font-semibold rounded"
                >
                  Browse All Footwear
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
