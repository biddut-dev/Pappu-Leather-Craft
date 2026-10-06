import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Pappu Leather Craft",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Privacy Policy</span>
        </nav>

        <div className="space-y-2">
          <h1 className="editorial-heading text-3xl sm:text-4xl font-serif text-[#F3EDE3] font-bold">
            Customer Privacy & Data Protection
          </h1>
          <p className="text-zinc-400">Effective Date: March 2026</p>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-serif font-bold text-white">1. Information We Collect</h2>
          <p>
            When you place an order or create an account on Pappu Leather Craft, we collect necessary shipping
            details: your full name, contact telephone number, delivery address in Bangladesh, and email address for order invoicing.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">2. How Your Information Is Used</h2>
          <p>
            Your information is strictly utilized to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
            <li>Dispatch ordered footwear via authorized couriers to your address.</li>
            <li>Send order confirmation and live delivery tracking SMS/notifications.</li>
            <li>Coordinate size exchanges or customer service inquiries.</li>
          </ul>

          <h2 className="text-lg font-serif font-bold text-white pt-2">3. Zero Third-Party Selling</h2>
          <p>
            We do not sell, rent, or trade your phone numbers, addresses, or email data to any third-party advertisers or telemarketers.
          </p>

          <h2 className="text-lg font-serif font-bold text-white pt-2">4. Payment Security</h2>
          <p>
            We never store credit card numbers, bank PINs, or bKash/Nagad secrets on our servers. All digital payments are processed through
            secure authorized payment gateways.
          </p>
        </div>
      </div>
    </div>
  );
}
