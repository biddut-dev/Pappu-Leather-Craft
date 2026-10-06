import React from "react";
import { ShieldCheck, Hammer, Tag, Truck } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "GENUINE MATERIALS",
      description: "Carefully sourced cowhide leathers that breathe naturally and age with a distinguished patina.",
    },
    {
      icon: Hammer,
      title: "CRAFTED WITH CARE",
      description: "Precision welted stitching, reinforced heel counters, and ergonomic latex foam insoles.",
    },
    {
      icon: Tag,
      title: "FAIR PRICING",
      description: "Direct-from-workshop pricing ensuring luxury grade footwear without excessive retail markups.",
    },
    {
      icon: Truck,
      title: "NATIONWIDE DELIVERY",
      description: "Prompt delivery across all 64 districts with Cash on Delivery and easy 7-day size exchanges.",
    },
  ];

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
            Pappu Standards
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
            Why Pappu Leather Craft
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Uncompromising footwear construction engineered specifically for comfort, durability and classic presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-lg bg-[#141414] border border-[#222222] hover:border-[#8B5E3C]/60 transition-all duration-300 space-y-4 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] border border-[#2C2C2C] flex items-center justify-center text-[#8B5E3C] group-hover:text-[#A47551] group-hover:border-[#8B5E3C] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
