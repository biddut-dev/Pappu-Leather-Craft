"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Order } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/formatters";

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch {}
    }
    if (user) loadOrders();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="bg-[#0B0B0B] min-h-[60vh] flex items-center justify-center text-zinc-500">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#222222] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8B5E3C] font-semibold">
              Member Portal
            </span>
            <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email} • {user.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] text-zinc-300 hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/account/orders"
            className="p-5 bg-[#141414] border border-[#242424] hover:border-[#8B5E3C] rounded-lg transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Order History</h3>
            <p className="text-xs text-zinc-400">{orders.length} total orders recorded</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="p-5 bg-[#141414] border border-[#242424] hover:border-[#8B5E3C] rounded-lg transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">My Wishlist</h3>
            <p className="text-xs text-zinc-400">{wishlistCount} saved styles</p>
          </Link>

          <Link
            href="/account/addresses"
            className="p-5 bg-[#141414] border border-[#242424] hover:border-[#8B5E3C] rounded-lg transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Saved Addresses</h3>
            <p className="text-xs text-zinc-400">Manage Dhaka & courier points</p>
          </Link>

          <Link
            href="/account/profile"
            className="p-5 bg-[#141414] border border-[#242424] hover:border-[#8B5E3C] rounded-lg transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
              <UserIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Profile Settings</h3>
            <p className="text-xs text-zinc-400">Update password & phone</p>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-[#F3EDE3]">Recent Footwear Orders</h2>
            <Link
              href="/account/orders"
              className="text-xs text-[#A47551] hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 bg-[#131313] border border-[#242424] rounded-lg text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-300">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Browse Loafers & Boots
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-lg bg-[#141414] border border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-mono text-white">{order.orderNumber}</strong>
                      <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#2E2E2E] text-[10px] text-[#A47551] uppercase font-bold">
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      {formatDateTime(order.createdAt)} • {order.items.length} item(s) • {order.deliveryZone}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#202020]">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatPrice(order.total)}
                    </span>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-white text-xs rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
