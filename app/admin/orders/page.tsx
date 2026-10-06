"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Truck, ChevronRight } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { success, error } = useToast();

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        success(`Order status updated to ${newStatus}`);
      } else {
        error("Failed to update status");
      }
    } catch {
      error("Network error");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: { label: string; value: string }[] = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Order Fulfillment & Courier Dispatch
          </h1>
          <p className="text-xs text-zinc-400">
            Total {orders.length} orders recorded across Bangladesh courier networks.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by order ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131313] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s.value
                  ? "bg-[#8B5E3C] text-white"
                  : "bg-[#141414] text-zinc-400 hover:text-white border border-[#242424]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Items</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status Update</th>
                <th className="p-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#161616] transition-colors">
                    <td className="p-3">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="font-mono font-bold text-white hover:text-[#A47551]"
                      >
                        {ord.orderNumber}
                      </Link>
                      <span className="text-[10px] text-zinc-500 block">
                        {formatDateTime(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-3">
                      <strong className="text-white block">{ord.customerName}</strong>
                      <span className="font-mono text-zinc-400 text-[11px]">
                        {ord.customerPhone}
                      </span>
                    </td>

                    <td className="p-3 text-zinc-300">
                      <span>{ord.items.length} product(s)</span>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[150px]">
                        {ord.items.map((i) => `${i.name} (${i.size})`).join(", ")}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2B2B2B] text-zinc-300 text-[10px]">
                        {ord.deliveryZone}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-white">
                      {formatPrice(ord.total)}
                      <span className="text-[10px] text-zinc-500 uppercase block font-normal">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleQuickStatusChange(ord._id, e.target.value as OrderStatus)
                        }
                        className="bg-[#181818] border border-[#2E2E2E] text-white rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-white rounded transition-colors inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
