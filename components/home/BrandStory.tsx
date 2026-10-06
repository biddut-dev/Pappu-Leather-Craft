import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#0B0B0B] border-b border-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Image with layered accent */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#161616] border border-[#262626]">
              <Image
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                alt="Leather Craftsmanship Workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-black/70 backdrop-blur-md border border-[#2E2E2E]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                  Artisanal Integrity
                </p>
                <p className="text-xs text-zinc-300 mt-1">
                  Every hide is hand-inspected for tensile strength, grain depth, and dye consistency.
                </p>
              </div>
            </div>

            {/* Decorative background border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#8B5E3C]/30 rounded-xl -z-10 hidden sm:block" />
          </div>

          {/* Right: Story Details */}
          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
              Our Heritage & Philosophy
            </span>

            <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold leading-tight">
              MADE WITH LEATHER. <br />
              <span className="text-gold-gradient">MADE TO LAST.</span>
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">
              In a marketplace saturated with synthetic materials and disposable footwear, Pappu Leather Craft was
              born from a straightforward dedication: honoring honest leather craftsmanship in Bangladesh.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              We collaborate with master cobblers possessing decades of tactile experience. From precise lasting to
              hand-waxed edge finishing, every pair is designed to comfortably conform to your step and gain character
              with age.
            </p>

            {/* Core Values checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#8B5E3C]/20 border border-[#8B5E3C] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#A47551]" />
                </div>
                <span className="text-xs text-zinc-200">Full-grain & top-grain cowhide leather selections</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#8B5E3C]/20 border border-[#8B5E3C] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#A47551]" />
                </div>
                <span className="text-xs text-zinc-200">High-density ergonomic cushioning for daily commute</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#8B5E3C]/20 border border-[#8B5E3C] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#A47551]" />
                </div>
                <span className="text-xs text-zinc-200">Fair transparent pricing without middleman markups</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
