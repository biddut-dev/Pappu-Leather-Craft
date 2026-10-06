import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1C1C1C] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/logo-icon.png"
                  alt="Pappu Leather Craft Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <span className="font-serif tracking-widest text-xl font-bold text-[#F3EDE3] uppercase block">
                  PAPPU LEATHER CRAFT
                </span>
                <p className="text-[10px] tracking-[0.25em] text-[#8B5E3C] uppercase -mt-0.5">
                  BANGLADESH • ARTISAN FOOTWEAR
                </p>
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Devoted to genuine leather craftsmanship, structured comfort, and timeless durability.
              Handcrafted in Bangladesh for gentlemen who appreciate honest materials and refined style.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <span>Hazaribagh / Dhanmondi, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Phone className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <span>+880 1711-234567 (10:00 AM - 10:00 PM)</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Mail className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <span>support@pappuleather.com</span>
              </div>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F3EDE3] mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/category/formal" className="hover:text-white transition-colors">
                  Formal Shoes
                </Link>
              </li>
              <li>
                <Link href="/category/loafers" className="hover:text-white transition-colors">
                  Loafers
                </Link>
              </li>
              <li>
                <Link href="/category/boots" className="hover:text-white transition-colors">
                  Boots
                </Link>
              </li>
              <li>
                <Link href="/category/casual" className="hover:text-white transition-colors">
                  Casual Shoes
                </Link>
              </li>
              <li>
                <Link href="/category/sandals" className="hover:text-white transition-colors">
                  Sandals
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-white transition-colors">
                  Belts & Wallets
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F3EDE3] mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/order-tracking" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide & Measurements
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  7-Day Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT & SOCIAL */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F3EDE3] mb-4">
              Connect With Us
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Need personalized sizing advice or bespoke orders? Message our master craft team.
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/8801711234567?text=Hello%20Pappu%20Leather%20Craft%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] hover:bg-[#25D366]/20 border border-[#2A2A2A] rounded text-xs text-zinc-200 hover:text-white transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Assistant</span>
              </a>
              <div className="flex gap-2 pt-2">
                <a
                  href="https://facebook.com/pappuleathercraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#272727] rounded text-xs text-zinc-300"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/pappuleathercraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#272727] rounded text-xs text-zinc-300"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Pappu Leather Craft. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="hover:text-[#A47551]">
              Staff Portal
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>Payment Accepted:</span>
            <span className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#272727] text-white">COD</span>
            <span className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#272727] text-pink-400 font-semibold">bKash</span>
            <span className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#272727] text-orange-400 font-semibold">Nagad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
