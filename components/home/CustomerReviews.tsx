import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

export default function CustomerReviews() {
  const reviews = [
    {
      id: "r1",
      name: "Sabbir Hasan",
      role: "Corporate Executive, Dhaka",
      product: "Executive Cap-Toe Oxford Noir",
      rating: 5,
      date: "March 2026",
      text: "I bought these oxfords for my sister's wedding and daily office wear. The leather quality is remarkable for the price point. No uncomfortable pinching even on the first day, and the hand-burnished finish looks stunning.",
    },
    {
      id: "r2",
      name: "Rashedul Karim",
      role: "Architect, Chittagong",
      product: "Classic Brown Leather Loafer",
      rating: 5,
      date: "February 2026",
      text: "The foam insole cushioning makes a noticeable difference when walking on site visits. Genuine leather smell and clean craftsmanship throughout. Will definitely order the Chelsea boots next.",
    },
    {
      id: "r3",
      name: "Mahmudul Alam",
      role: "University Lecturer, Sylhet",
      product: "Heritage Chelsea Leather Boot",
      rating: 5,
      date: "January 2026",
      text: "Very sturdy build and excellent pull-up leather that has already begun taking on character. Nationwide delivery was fast (arrived in Sylhet in 3 days) and the sizing was true to EU 42.",
    },
  ];

  return (
    <section className="py-20 bg-[#0B0B0B] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm text-zinc-300">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5.0</span>
            <span className="text-zinc-500">• Over 250+ Verified Orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-lg bg-[#131313] border border-[#222222] hover:border-[#8B5E3C]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#C5A059]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#A47551]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 text-[#242424] absolute -top-2 -left-1 -z-0" />
                  <p className="relative z-10 text-xs text-zinc-300 leading-relaxed font-light italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1F1F1F]">
                <p className="text-xs font-semibold text-white">{rev.name}</p>
                <p className="text-[11px] text-zinc-500">{rev.role}</p>
                <p className="text-[10px] text-[#8B5E3C] mt-1 font-mono">{rev.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
