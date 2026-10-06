"use client";

import React from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeTable = [
    { eu: 39, bd: 5, footCm: "24.5 cm", footInch: "9.6 inch" },
    { eu: 40, bd: 6, footCm: "25.0 cm", footInch: "9.8 inch" },
    { eu: 41, bd: 7, footCm: "25.5 cm", footInch: "10.0 inch" },
    { eu: 42, bd: 8, footCm: "26.5 cm", footInch: "10.4 inch" },
    { eu: 43, bd: 9, footCm: "27.5 cm", footInch: "10.8 inch" },
    { eu: 44, bd: 10, footCm: "28.5 cm", footInch: "11.2 inch" },
    { eu: 45, bd: 11, footCm: "29.5 cm", footInch: "11.6 inch" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#141414] border border-[#2E2E2E] rounded-xl p-6 shadow-2xl text-zinc-300 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="text-base font-serif font-bold text-[#F3EDE3]">Footwear Sizing Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#202020]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip */}
        <div className="p-3 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg text-xs leading-relaxed text-zinc-300">
          <p className="font-semibold text-[#A47551] mb-1">How to Measure Your Foot:</p>
          <p>
            Place your foot flat on a sheet of paper against a wall. Mark the tip of your longest toe and measure
            the distance to your heel in centimeters. Match with our chart below.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1C1C1C] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-2.5">EU Size</th>
                <th className="p-2.5">BD/UK</th>
                <th className="p-2.5">Foot Length (cm)</th>
                <th className="p-2.5">Inches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {sizeTable.map((row) => (
                <tr key={row.eu} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="p-2.5 font-bold text-[#F3EDE3]">EU {row.eu}</td>
                  <td className="p-2.5 text-zinc-400">{row.bd}</td>
                  <td className="p-2.5 text-zinc-300 font-mono">{row.footCm}</td>
                  <td className="p-2.5 text-zinc-400 font-mono">{row.footInch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-zinc-500 italic">
          Tip: If you fall between sizes or have wider feet, we recommend ordering one size larger. We offer a 7-day free size exchange if the fit isn&apos;t exact.
        </p>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1F1F1F] hover:bg-[#282828] border border-[#333333] rounded text-xs font-semibold text-white uppercase tracking-wider transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
