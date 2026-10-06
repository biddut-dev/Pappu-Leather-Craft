import React from "react";
import Link from "next/link";
import { Ruler, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Size Guide & Foot Measurements | Pappu Leather Craft",
  description: "Find your ideal shoe size with European and Bangladeshi foot measurement charts.",
};

export default function SizeGuidePage() {
  const sizeTable = [
    { eu: 39, bd: 5, footCm: "24.5 cm", footInch: "9.6 inch", fitting: "Slim Foot" },
    { eu: 40, bd: 6, footCm: "25.0 cm", footInch: "9.8 inch", fitting: "Standard Fit" },
    { eu: 41, bd: 7, footCm: "25.5 cm", footInch: "10.0 inch", fitting: "Standard Fit" },
    { eu: 42, bd: 8, footCm: "26.5 cm", footInch: "10.4 inch", fitting: "Most Common BD Size" },
    { eu: 43, bd: 9, footCm: "27.5 cm", footInch: "10.8 inch", fitting: "Standard Fit" },
    { eu: 44, bd: 10, footCm: "28.5 cm", footInch: "11.2 inch", fitting: "Wide Foot" },
    { eu: 45, bd: 11, footCm: "29.5 cm", footInch: "11.6 inch", fitting: "Broad Fit" },
  ];

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Size Guide</span>
        </nav>

        <div className="space-y-3 text-center max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            Precision Fit
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            Footwear Size Guide
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Our shoes follow standardized European (EU) sizing lasts. Follow our guide below to ensure your first pair fits like a glove.
          </p>
        </div>

        {/* 3 Step Measurement Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-3 text-xs">
            <span className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#333333] flex items-center justify-center font-bold text-white font-mono">
              1
            </span>
            <h3 className="font-bold text-white uppercase tracking-wider">Step on Paper</h3>
            <p className="text-zinc-400 leading-relaxed">
              Place a sheet of blank paper on a hard floor against a wall. Stand straight with your heel lightly touching the wall.
            </p>
          </div>

          <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-3 text-xs">
            <span className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#333333] flex items-center justify-center font-bold text-white font-mono">
              2
            </span>
            <h3 className="font-bold text-white uppercase tracking-wider">Mark the Tip</h3>
            <p className="text-zinc-400 leading-relaxed">
              Using a pen or pencil held vertically, mark the longest point of your toe (usually the big toe or second toe).
            </p>
          </div>

          <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-3 text-xs">
            <span className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#333333] flex items-center justify-center font-bold text-white font-mono">
              3
            </span>
            <h3 className="font-bold text-white uppercase tracking-wider">Measure in CM</h3>
            <p className="text-zinc-400 leading-relaxed">
              Use a ruler to measure the length between the edge of the paper and your pencil mark in centimeters.
            </p>
          </div>
        </div>

        {/* Conversion Table */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
          <h2 className="text-base font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#8B5E3C]" />
            <span>Size Conversion & Recommendations</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1A1A1A] text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3">EU Size</th>
                  <th className="p-3">BD / UK</th>
                  <th className="p-3">Foot Length (CM)</th>
                  <th className="p-3">Inches</th>
                  <th className="p-3">Fit Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {sizeTable.map((row) => (
                  <tr key={row.eu} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3 font-bold text-[#F3EDE3] font-mono">EU {row.eu}</td>
                    <td className="p-3 text-zinc-400 font-mono">{row.bd}</td>
                    <td className="p-3 text-zinc-300 font-mono">{row.footCm}</td>
                    <td className="p-3 text-zinc-400 font-mono">{row.footInch}</td>
                    <td className="p-3 text-zinc-400">{row.fitting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reassurance */}
        <div className="p-6 bg-[#181512] border border-[#8B5E3C]/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              <span>Not 100% Sure About Your Size?</span>
            </h3>
            <p className="text-xs text-zinc-400">
              No worries! We offer a 7-day hassle-free exchange on all unworn shoes in their original box.
            </p>
          </div>

          <Link
            href="/shop"
            className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors self-start sm:self-auto shrink-0"
          >
            Shop With Confidence
          </Link>
        </div>
      </div>
    </div>
  );
}
