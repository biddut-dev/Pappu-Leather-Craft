"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-[#1C1C1C]">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=2000&auto=format&fit=crop"
          alt="Pappu Leather Craft Artisan Footwear"
          fill
          priority
          className="object-cover object-center brightness-[0.38] contrast-[1.1] scale-105 transition-transform duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/90 via-[#0B0B0B]/50 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C]/80 border border-[#8B5E3C]/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A47551] animate-ping" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#F3EDE3] font-medium">
              Handcrafted in Bangladesh
            </span>
          </div>

          {/* Headline */}
          <h1 className="editorial-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F3EDE3] font-bold leading-[1.08] tracking-tight">
            CRAFTED FOR <br />
            <span className="text-gold-gradient">EVERY STEP.</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl">
            Premium leather footwear designed for those who value quality, comfort, and timeless style.
            Engineered for daily resilience, formal elegance, and enduring comfort.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-[0.18em] rounded transition-all shadow-xl hover:shadow-orange-950/30 group"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#141414]/80 hover:bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#8B5E3C] text-zinc-200 hover:text-white text-xs font-semibold uppercase tracking-[0.18em] rounded backdrop-blur-md transition-colors"
            >
              <span>Explore Our Story</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 sm:pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg text-zinc-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5E3C] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight sm:tracking-wide">Selected Cowhide</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5E3C] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight sm:tracking-wide">All 64 Districts</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5E3C] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight sm:tracking-wide">7-Day Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
