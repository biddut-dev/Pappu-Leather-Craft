"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Order } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/formatters";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/account" className="hover:text-white transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Orders</span>
        </nav>

        <div className="space-y-1">
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Order History
          </h1>
          <p className="text-xs text-zinc-400">
            Review past footwear orders, track courier statuses, and verify delivery addresses.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-24 bg-[#141414] rounded-lg animate-pulse" />
            <div className="h-24 bg-[#141414] rounded-lg animate-pulse" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-[#131313] border border-[#222222] rounded-lg space-y-3">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-300">No previous orders on record.</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-5 bg-[#141414] border border-[#242424] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <strong className="text-sm font-mono text-white">{order.orderNumber}</strong>
                    <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#2E2E2E] text-[10px] text-[#A47551] uppercase font-bold">
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Placed on {formatDateTime(order.createdAt)} • {order.items.length} product(s)
                  </p>
                  <p className="text-zinc-500 text-[11px]">
                    Delivering to: {order.shippingAddress.fullAddress}, {order.shippingAddress.district}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#202020]">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-500 uppercase">Total Amount</span>
                    <p className="text-base font-bold text-white font-mono">{formatPrice(order.total)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/order-tracking?orderNumber=${order.orderNumber}`}
                      className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] text-zinc-300 hover:text-white rounded transition-colors"
                    >
                      Track
                    </Link>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-semibold rounded transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
