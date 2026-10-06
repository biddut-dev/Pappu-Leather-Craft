import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Pappu Leather Craft",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Shipping Policy</span>
        </nav>

        <div className="space-y-2">
          <h1 className="editorial-heading text-3xl sm:text-4xl font-serif text-[#F3EDE3] font-bold">
            Shipping & Nationwide Delivery Policy
          </h1>
          <p className="text-zinc-400">
            Last updated: March 2026. Reliable courier delivery across all 64 districts in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#8B5E3C]">
              <Truck className="w-5 h-5" />
              <h3 className="font-bold uppercase text-white">Inside Dhaka City</h3>
            </div>
            <p className="text-zinc-400 text-xs">
              Delivery Fee: <strong className="text-white font-mono">৳70</strong>
            </p>
            <p className="text-zinc-400 text-xs">
              Estimated Delivery Time: <strong className="text-white font-mono">24 - 48 Hours</strong>
            </p>
          </div>

          <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#8B5E3C]">
              <Truck className="w-5 h-5" />
              <h3 className="font-bold uppercase text-white">Outside Dhaka (All Bangladesh)</h3>
            </div>
            <p className="text-zinc-400 text-xs">
              Delivery Fee: <strong className="text-white font-mono">৳130</strong>
            </p>
            <p className="text-zinc-400 text-xs">
              Estimated Delivery Time: <strong className="text-white font-mono">2 - 4 Business Days</strong>
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#222222]">
          <h2 className="text-lg font-serif font-bold text-white">Courier Partners</h2>
          <p>
            We partner with Bangladesh’s leading courier networks including Steadfast, Pathao Courier, RedX, and eCourier
            to ensure safe transit and doorstep cash-on-delivery collection.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">Parcel Inspection on Delivery</h2>
          <p>
            When our courier partner arrives, you are entitled to inspect the outer packaging and verify that the correct shoe
            model and ordered size are inside before handing over the cash payment.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">Order Tracking</h2>
          <p>
            As soon as your pair leaves our workshop in Dhaka, you will receive an SMS and can track the live progress via our
            dedicated <Link href="/order-tracking" className="text-[#A47551] underline">Order Tracking page</Link> using your order ID.
          </p>
        </div>
      </div>
    </div>
  );
}
