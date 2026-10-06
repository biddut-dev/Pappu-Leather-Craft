"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();

  // Don't show bottom nav in admin dashboard to prevent clutter
  if (pathname.startsWith("/admin")) return null;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Compass },
    {
      label: "Wishlist",
      href: "/account/wishlist",
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      label: "Cart",
      action: openCart,
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : null,
    },
    {
      label: user ? "Account" : "Sign In",
      href: user ? "/account" : "/login",
      icon: UserIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-lg border-t border-[#222222] md:hidden px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const content = (
            <div className="relative flex flex-col items-center justify-center py-1 px-3">
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-[#8B5E3C]" : "text-zinc-400"
                }`}
              />
              {item.badge !== null && item.badge !== undefined && (
                <span className="absolute top-0 right-1 w-4 h-4 bg-[#8B5E3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? "text-[#F3EDE3] font-medium" : "text-zinc-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="focus:outline-none"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={idx} href={item.href!} aria-label={item.label}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
