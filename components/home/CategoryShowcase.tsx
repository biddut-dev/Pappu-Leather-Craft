import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/types";

interface CategoryShowcaseProps {
  categories: Category[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-12 sm:py-20 bg-[#0B0B0B] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
              Curated Silhouette
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#A47551] hover:text-[#F3EDE3] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Category Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group relative h-56 sm:h-72 md:h-80 rounded-lg overflow-hidden bg-[#161616] border border-[#222222] hover:border-[#8B5E3C] transition-all flex flex-col justify-end p-3.5 sm:p-5"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center brightness-[0.6] group-hover:scale-110 group-hover:brightness-[0.45] transition-all duration-700"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                  {cat.productCount ? `${cat.productCount} Styles` : "Explore"}
                </span>
                <h3 className="text-base font-serif font-bold text-white group-hover:text-[#F3EDE3] transition-colors">
                  {cat.name}
                </h3>
                <div className="w-6 h-[2px] bg-[#8B5E3C] group-hover:w-12 transition-all duration-300" />
              </div>

              {/* Hover arrow badge */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
