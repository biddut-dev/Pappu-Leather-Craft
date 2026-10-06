import React from "react";
import Link from "next/link";
import { RotateCcw, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy | Pappu Leather Craft",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Return Policy</span>
        </nav>

        <div className="space-y-2">
          <h1 className="editorial-heading text-3xl sm:text-4xl font-serif text-[#F3EDE3] font-bold">
            7-Day Exchange & Return Policy
          </h1>
          <p className="text-zinc-400">
            We want every pair of shoes from Pappu Leather Craft to feel tailored to your feet.
          </p>
        </div>

        <div className="p-5 bg-[#141414] border border-[#8B5E3C]/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-[#8B5E3C]">
            <RotateCcw className="w-5 h-5" />
            <h3 className="font-bold text-white uppercase">Size Exchange Guarantee</h3>
          </div>
          <p className="text-zinc-300">
            If the shoes you ordered feel slightly tight or loose upon trying them indoors, you can request a size exchange
            within <strong>7 days</strong> of delivery.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-serif font-bold text-white">Conditions for Return & Exchange</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
              <span>Footwear must be in unworn, brand-new condition without outdoor creasing or scuffed soles.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
              <span>Original branded shoe box, tags, and dust wraps must be preserved.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
              <span>Exchange requests must be submitted within 7 calendar days of courier delivery.</span>
            </li>
          </ul>

          <h2 className="text-lg font-serif font-bold text-white pt-4">How to Initiate an Exchange</h2>
          <p>
            You can message our WhatsApp helpline at <strong className="text-white">+880 1711-234567</strong> or email us at{" "}
            <strong className="text-white">support@pappuleather.com</strong> with your Order Number (e.g. PLC-20261004-1234) and your required replacement size.
          </p>
          <p>
            Our delivery partner will collect the returned box and deliver the replacement pair right to your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
