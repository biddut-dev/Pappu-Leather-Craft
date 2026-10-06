"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp } from "lucide-react";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-zinc-500 hidden sm:inline flex items-center gap-1">
        <ArrowDownUp className="w-3.5 h-3.5" />
        Sort:
      </span>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-[#141414] border border-[#2E2E2E] text-zinc-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#8B5E3C] text-xs cursor-pointer"
      >
        <option value="featured">Featured Collection</option>
        <option value="newest">Newest Releases</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
