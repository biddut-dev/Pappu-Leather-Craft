"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Users,
  Warehouse,
  MessageSquare,
  Tag,
  Truck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on admin login page, don't wrap with admin dashboard sidebar
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!user || !isAdmin)) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, isAdmin, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="bg-[#0B0B0B] min-h-screen flex items-center justify-center p-4">
        <div className="p-8 bg-[#131313] border border-[#262626] rounded-xl text-center space-y-3 max-w-sm">
          <ShieldAlert className="w-10 h-10 text-[#8B5E3C] mx-auto animate-pulse" />
          <h2 className="text-base font-bold text-white">Verifying Admin Authorization...</h2>
          <p className="text-xs text-zinc-400">Restricted staff console for Pappu Leather Craft.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory & Logs", href: "/admin/inventory", icon: Warehouse },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Delivery Zones", href: "/admin/delivery", icon: Truck },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-zinc-200 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-[#141414] border-b border-[#222222]">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/images/logo-icon.png"
              alt="Pappu Leather"
              fill
              className="object-contain"
              sizes="28px"
            />
          </div>
          <span className="font-serif font-bold text-[#F3EDE3] text-sm tracking-wider">
            PLC ADMIN
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#8B5E3C] text-white rounded font-mono">
            STAFF
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-zinc-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111111] border-r border-[#202020] flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Monogram */}
          <div className="space-y-1 pb-4 border-b border-[#202020]">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/images/logo-icon.png"
                  alt="Pappu Leather"
                  fill
                  className="object-contain"
                  sizes="36px"
                />
              </div>
              <div>
                <span className="font-serif tracking-widest text-base font-bold text-[#F3EDE3] uppercase block">
                  PAPPU LEATHER
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#8B5E3C] uppercase block">
                  MANAGEMENT CONSOLE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
                    isActive
                      ? "bg-[#1E1813] text-[#F3EDE3] border border-[#8B5E3C]/60"
                      : "text-zinc-400 hover:text-white hover:bg-[#181818]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#8B5E3C]" : "text-zinc-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#202020] space-y-3 bg-[#0D0D0D] text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="truncate">{user.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#1F1F1F] rounded text-[#A47551] uppercase font-bold">
              {user.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] rounded text-[11px] text-zinc-300 hover:text-white transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => logout()}
              className="p-2 bg-[#1A1A1A] hover:bg-red-950/40 border border-[#2A2A2A] text-zinc-400 hover:text-red-400 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
