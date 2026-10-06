import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="relative py-24 bg-[#080808] border-b border-[#1A1A1A] overflow-hidden">
      {/* Background Image with dark luxury treatment */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1800&auto=format&fit=crop"
          alt="Leather Boots Banner"
          fill
          className="object-cover object-center brightness-[0.25] contrast-[1.15]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/75 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl space-y-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
            Seasonal Footwear Spotlight
          </span>

          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold leading-tight">
            STEP INTO <br />
            <span className="text-gold-gradient">SOMETHING BETTER.</span>
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            Constructed with rugged pull-up cowhide leather, heavy-duty stitching, and slip-resistant commando treads.
            Tailored to handle urban rain, winter chills, and long evening walks.
          </p>

          <div className="pt-2">
            <Link
              href="/category/boots"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-xl"
            >
              <span>Shop Boot Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
