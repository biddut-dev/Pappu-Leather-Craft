import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Pappu Leather Craft",
};

export default function TermsPage() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Terms & Conditions</span>
        </nav>

        <div className="space-y-2">
          <h1 className="editorial-heading text-3xl sm:text-4xl font-serif text-[#F3EDE3] font-bold">
            Terms of Service & Purchase
          </h1>
          <p className="text-zinc-400">Effective Date: March 2026</p>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-serif font-bold text-white">1. Orders & Pricing</h2>
          <p>
            All prices listed on Pappu Leather Craft are denominated in Bangladeshi Taka (BDT ৳) and include applicable local duties.
            We reserve the right to correct accidental pricing errors before order dispatch.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">2. Genuine Leather Variations</h2>
          <p>
            Because we use real full-grain and top-grain cowhides, slight natural variations in leather grain, shade depth, and wax finish
            are characteristic of authentic artisan leather goods and not defects.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">3. Cancellation Rules</h2>
          <p>
            Orders can be cancelled free of charge while in &ldquo;Pending&rdquo; or &ldquo;Confirmed&rdquo; status prior to courier dispatch.
            Once handed over to the courier partner, cancellations are subject to delivery fee charges.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">4. Applicable Law</h2>
          <p>
            These terms are governed by the laws of the People’s Republic of Bangladesh.
          </p>
        </div>
      </div>
    </div>
  );
}
