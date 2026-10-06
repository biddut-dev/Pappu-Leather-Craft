"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { initialFAQs } from "@/lib/seed-data";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIds, setOpenIds] = useState<string[]>(["faq-1", "faq-2"]);

  const categories = ["All", "Ordering", "Payment", "Delivery", "Returns", "Sizing", "Products"];

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFAQs =
    activeCategory === "All"
      ? initialFAQs
      : initialFAQs.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            Help Center
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about our leather footwear, sizing, nationwide courier delivery, and exchange terms.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-[#8B5E3C] text-white shadow-lg shadow-orange-950/20"
                  : "bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQs.map((faq) => {
            const isOpen = openIds.includes(faq._id);
            return (
              <div
                key={faq._id}
                className="bg-[#131313] border border-[#222222] hover:border-[#333333] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(faq._id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#1C1C1C] border border-[#2B2B2B] text-[10px] uppercase font-bold text-[#A47551] rounded">
                      {faq.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#8B5E3C]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-[#1C1C1C] animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="p-8 bg-[#131313] border border-[#242424] rounded-xl text-center space-y-4">
          <HelpCircle className="w-10 h-10 text-[#8B5E3C] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-white">Still have questions?</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Our footwear specialists are available to answer your sizing inquiries directly on WhatsApp.
            </p>
          </div>
          <div className="pt-1">
            <a
              href="https://wa.me/8801711234567?text=Hello%20Pappu%20Leather%20Craft%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E1E1E] hover:bg-[#282828] border border-[#333333] hover:border-[#25D366] text-white text-xs font-semibold rounded transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
