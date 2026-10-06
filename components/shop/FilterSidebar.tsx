"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Check, SlidersHorizontal, X } from "lucide-react";
import { Category } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  availableSizes?: (string | number)[];
}

export default function FilterSidebar({
  categories,
  availableSizes = [40, 41, 42, 43, 44],
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSize = searchParams.get("size") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const onSaleOnly = searchParams.get("sale") === "true";

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/shop");
  };

  // Count active filters
  let activeFilterCount = 0;
  if (currentCategory) activeFilterCount++;
  if (currentSize) activeFilterCount++;
  if (currentMinPrice || currentMaxPrice) activeFilterCount++;
  if (onSaleOnly) activeFilterCount++;

  const hasActiveFilters = activeFilterCount > 0;

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
              !currentCategory
                ? "bg-[#1F1F1F] text-white font-semibold border border-[#333333]"
                : "text-zinc-400 hover:text-white hover:bg-[#151515]"
            }`}
          >
            <span>All Categories</span>
            {!currentCategory && <Check className="w-3.5 h-3.5 text-[#8B5E3C]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat._id}
                onClick={() => updateFilter("category", cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                  isSelected
                    ? "bg-[#1F1F1F] text-white font-semibold border border-[#333333]"
                    : "text-zinc-400 hover:text-white hover:bg-[#151515]"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8B5E3C]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Shoe Size (EU)</h4>
        <div className="grid grid-cols-5 gap-2">
          {availableSizes.map((size) => {
            const isSelected = currentSize === String(size);
            return (
              <button
                key={size}
                onClick={() => updateFilter("size", isSelected ? null : String(size))}
                className={`py-2 text-xs font-medium rounded border transition-all ${
                  isSelected
                    ? "bg-[#8B5E3C] text-white border-[#A47551]"
                    : "bg-[#151515] text-zinc-400 border-[#262626] hover:border-[#8B5E3C] hover:text-white"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Price (BDT ৳)</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min ৳"
              value={currentMinPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value || null)}
              className="w-1/2 bg-[#141414] border border-[#282828] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
            <input
              type="number"
              placeholder="Max ৳"
              value={currentMaxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value || null)}
              className="w-1/2 bg-[#141414] border border-[#282828] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("minPrice", "1000");
                params.set("maxPrice", "2500");
                router.push(`/shop?${params.toString()}`);
              }}
              className="px-2 py-1 bg-[#181818] border border-[#262626] rounded text-[10px] text-zinc-400 hover:text-white"
            >
              ৳1,000 - ৳2,500
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("minPrice", "2500");
                params.set("maxPrice", "4000");
                router.push(`/shop?${params.toString()}`);
              }}
              className="px-2 py-1 bg-[#181818] border border-[#262626] rounded text-[10px] text-zinc-400 hover:text-white"
            >
              ৳2,500 - ৳4,000
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("minPrice", "4000");
                params.delete("maxPrice");
                router.push(`/shop?${params.toString()}`);
              }}
              className="px-2 py-1 bg-[#181818] border border-[#262626] rounded text-[10px] text-zinc-400 hover:text-white"
            >
              ৳4,000+
            </button>
          </div>
        </div>
      </div>

      {/* Special Deals Checkbox */}
      <div className="pt-2 border-t border-[#222222]">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 hover:text-white">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => updateFilter("sale", e.target.checked ? "true" : null)}
            className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C] focus:ring-0"
          />
          <span>Discount & Offers Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button (Visible only on mobile < lg) */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs font-semibold text-zinc-200 hover:border-[#8B5E3C] transition-all shadow-md"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8B5E3C]" />
            <span>Filter Collection</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.2 bg-[#8B5E3C] text-white text-[10px] font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#A47551]">Adjust & Filter →</span>
        </button>
      </div>

      {/* Mobile Drawer (Modal Bottom Sheet) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
          />

          {/* Drawer Body */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-[#111111] border-t border-[#2E2E2E] rounded-t-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 z-10">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8B5E3C]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Filters {hasActiveFilters && `(${activeFilterCount})`}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileDrawerOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs text-[#A47551] hover:text-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-md bg-[#1C1C1C]"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-5 pb-24">
              {filterContent}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-[#222222] bg-[#141414] flex gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors text-center"
              >
                Apply & View Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-xs text-[#A47551] hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
        {filterContent}
      </aside>
    </>
  );
}
