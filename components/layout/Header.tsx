"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Offers", href: "/offers" },
    { label: "About", href: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#242424] shadow-xl"
            : "bg-[#0B0B0B] border-b border-[#1E1E1E]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* LEFT: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-zinc-300 hover:text-white shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <Link href="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative w-8 h-8 sm:w-11 sm:h-11 shrink-0">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Pappu Leather Craft Logo"
                    fill
                    priority
                    className="object-contain"
                    sizes="44px"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-serif tracking-normal sm:tracking-widest text-sm xs:text-base sm:text-lg md:text-xl font-bold text-[#F3EDE3] uppercase group-hover:text-[#A47551] transition-colors truncate">
                    PAPPU LEATHER CRAFT
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-[#8B5E3C] uppercase -mt-0.5 font-sans truncate">
                    BANGLADESH • EST. 2018
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-wider uppercase transition-colors relative py-1 ${
                      isActive
                        ? "text-[#F3EDE3] font-medium"
                        : "text-zinc-400 hover:text-[#F3EDE3]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5E3C] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-1 sm:space-x-5 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2 text-zinc-300 hover:text-[#A47551] transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Link (Hidden on mobile since it is in bottom nav) */}
              <Link
                href="/account/wishlist"
                className="relative hidden sm:block p-2 text-zinc-300 hover:text-[#A47551] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#8B5E3C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-1.5 sm:p-2 text-zinc-300 hover:text-[#A47551] transition-colors flex items-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-[#8B5E3C] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account / Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 p-1.5 text-zinc-300 hover:text-white border border-[#2E2E2E] rounded-md hover:border-[#8B5E3C] transition-all text-xs"
                    >
                      <UserIcon className="w-4 h-4 text-[#A47551]" />
                      <span className="hidden md:inline max-w-[100px] truncate font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#171717] border border-[#2E2E2E] rounded-lg shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-[#242424]">
                          <p className="text-xs text-zinc-400">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#C5A059] font-medium hover:bg-[#222222] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-[#222222] transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-[#222222] transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Order History
                        </Link>
                        <Link
                          href="/order-tracking"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-[#222222] transition-colors"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          Track An Order
                        </Link>

                        <div className="border-t border-[#242424] my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-[#222222] transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#2E2E2E] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#8B5E3C] transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Dropdown) */}
        {searchOpen && (
          <div className="bg-[#121212] border-b border-[#242424] py-4 px-4 sm:px-6 animate-in slide-in-from-top-3">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search loafers, formal oxfords, boots, belts, wallets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-md pl-12 pr-24 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-medium px-4 py-2 rounded transition-colors"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500">
                <span>Popular:</span>
                <Link href="/search?q=loafer" className="hover:text-[#A47551] underline">
                  Loafers
                </Link>
                <span>•</span>
                <Link href="/search?q=boot" className="hover:text-[#A47551] underline">
                  Chelsea Boots
                </Link>
                <span>•</span>
                <Link href="/search?q=oxford" className="hover:text-[#A47551] underline">
                  Cap-Toe Oxford
                </Link>
                <span>•</span>
                <Link href="/search?q=belt" className="hover:text-[#A47551] underline">
                  Solid Belts
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#121212] border-b border-[#242424] px-6 py-6 animate-in slide-in-from-top-4 space-y-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-base tracking-wide text-zinc-200 hover:text-[#A47551] transition-colors border-b border-[#1E1E1E]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/order-tracking"
                className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-center text-zinc-300 hover:text-white"
              >
                Track Order
              </Link>
              <Link
                href="/size-guide"
                className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-center text-zinc-300 hover:text-white"
              >
                Size Guide
              </Link>
              <Link
                href="/contact"
                className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-center text-zinc-300 hover:text-white"
              >
                Contact & WhatsApp
              </Link>
              <Link
                href="/faq"
                className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-center text-zinc-300 hover:text-white"
              >
                FAQs
              </Link>
            </div>

            {isAdmin && (
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="block w-full py-2.5 bg-[#8B5E3C] text-white text-center font-medium rounded text-sm"
                >
                  Open Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
