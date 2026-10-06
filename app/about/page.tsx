import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Hammer, Award, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | Pappu Leather Craft",
  description: "The story of Pappu Leather Craft. Authentic leather craftsmanship in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            Since 2018
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            The Art of Honest Craftsmanship
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            Rooted in Bangladesh’s storied leather tanning heritage, Pappu Leather Craft exists to create
            genuine cowhide footwear that balances classic elegance, enduring resilience, and accessible pricing.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#161616] border border-[#242424] shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1800&auto=format&fit=crop"
            alt="Handcrafting Leather Shoes"
            fill
            priority
            className="object-cover brightness-[0.55]"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
            <p className="text-sm text-[#F3EDE3] font-serif max-w-lg italic">
              &ldquo;A great pair of leather shoes should never feel like a sacrifice between comfort and elegance. It must support every step you take.&rdquo;
            </p>
          </div>
        </div>

        {/* Our Story Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-white">How It Started</h2>
            <p>
              Pappu Leather Craft was conceived after witnessing an ongoing dilemma in Dhaka: shoes were either
              prohibitively priced foreign designer imports or cheap synthetic alternatives that peeled and cracked within months.
            </p>
            <p>
              Bangladesh houses some of the world’s most renowned raw hides and tanning traditions. By partnering directly
              with traditional craftsmen in Hazaribagh and modern tannery parks, we eliminated unnecessary retail layers to deliver
              genuine full-grain and top-grain footwear directly to your doorstep.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-white">Our Construction Philosophy</h2>
            <p>
              We focus on structure, weight balance, and breathable lining. Our loafers, oxfords, and boots feature
              anti-skid outsoles and high-density memory latex footbeds designed to conquer urban walking, office routines,
              and ceremonial events.
            </p>
            <p>
              We do not fabricate claims. Every pair is made with real cowhide leathers that develop genuine patina and soften
              naturally around the contours of your feet over time.
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#222222]">
          <div className="p-5 bg-[#131313] border border-[#222222] rounded-lg space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Genuine Materials</h3>
            <p className="text-[11px] text-zinc-400">Strictly selected cowhide leathers that age with dignity.</p>
          </div>

          <div className="p-5 bg-[#131313] border border-[#222222] rounded-lg space-y-2">
            <Hammer className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Artisan Stitched</h3>
            <p className="text-[11px] text-zinc-400">Every shoe lasted and inspected with tactile care.</p>
          </div>

          <div className="p-5 bg-[#131313] border border-[#222222] rounded-lg space-y-2">
            <Award className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Fair Pricing</h3>
            <p className="text-[11px] text-zinc-400">Direct-from-workshop pricing without inflated markups.</p>
          </div>

          <div className="p-5 bg-[#131313] border border-[#222222] rounded-lg space-y-2">
            <Sparkles className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Dedicated Support</h3>
            <p className="text-[11px] text-zinc-400">Direct WhatsApp guidance and hassle-free 7-day exchanges.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            <span>Experience the Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
