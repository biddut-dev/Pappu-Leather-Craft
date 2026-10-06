"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import { Order } from "@/types";

interface StatsData {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  lowStockCount: number;
  lowStockProducts: { product: string; size: string | number; stock: number }[];
  recentOrders: Order[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#181818] rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#141414] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Store Revenue",
      value: formatPrice(stats.totalRevenue),
      subtext: `Today: ${formatPrice(stats.todayRevenue)}`,
      icon: DollarSign,
      color: "text-emerald-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      subtext: `${stats.pendingOrders} awaiting fulfillment`,
      icon: ShoppingBag,
      color: "text-amber-400",
    },
    {
      label: "Active Catalog",
      value: `${stats.totalProducts} Products`,
      subtext: `Across ${stats.totalCategories} categories`,
      icon: Package,
      color: "text-[#8B5E3C]",
    },
    {
      label: "Low Stock Alert",
      value: `${stats.lowStockCount} Sizes`,
      subtext: "Needs restocking soon",
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? "text-red-400" : "text-zinc-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202020]">
        <div>
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Executive Dashboard
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time business performance, courier dispatches, and inventory health for Pappu Leather Craft.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-orange-950/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Footwear</span>
          </Link>

          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2B2B2B] text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Truck className="w-4 h-4 text-[#8B5E3C]" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-[#131313] border border-[#222222] rounded-xl flex items-start justify-between shadow-lg"
            >
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  {kpi.label}
                </span>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-zinc-500">{kpi.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg bg-[#1A1A1A] border border-[#262626] ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-[#131313] border border-[#222222] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Recent Customer Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[#A47551] hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No orders received yet. Place a test order from the customer store!
            </div>
          ) : (
            <div className="divide-y divide-[#202020] text-xs">
              {stats.recentOrders.map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="font-mono font-bold text-white hover:text-[#A47551]"
                      >
                        {ord.orderNumber}
                      </Link>
                      <span className="px-2 py-0.2 rounded bg-[#1C1814] border border-[#8B5E3C]/40 text-[#C5A059] text-[10px] uppercase font-bold">
                        {ord.orderStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      {ord.customerName} ({ord.customerPhone}) • {ord.deliveryZone}
                    </p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <p className="font-mono font-bold text-white">{formatPrice(ord.total)}</p>
                    <p className="text-[10px] text-zinc-500">{formatDateTime(ord.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Warning (5 cols) */}
        <div className="lg:col-span-5 bg-[#131313] border border-[#222222] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Low Inventory Sizes
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-[#A47551] hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              All variant sizes are comfortably stocked.
            </div>
          ) : (
            <div className="divide-y divide-[#202020] text-xs">
              {stats.lowStockProducts.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <p className="font-semibold text-white truncate">{item.product}</p>
                    <p className="text-[11px] text-zinc-400">Size {item.size}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      item.stock === 0
                        ? "bg-red-950 text-red-300 border border-red-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {item.stock === 0 ? "Out of Stock" : `${item.stock} Left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
