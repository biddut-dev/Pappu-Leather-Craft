"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";

export default function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Status & Tracking Controls
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setStatus(data.order.orderStatus);
          setTrackingNumber(data.order.trackingNumber || "");
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() || undefined,
          note: statusNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
        setStatusNote("");
        success("Order status and courier tracking updated.");
      } else {
        error(data.message || "Update failed.");
      }
    } catch {
      error("Network error while updating order.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 py-10">Loading order file...</div>;
  }

  if (!order) {
    return <div className="text-red-400 py-10">Order not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-[#181818] border border-[#2B2B2B] rounded-lg text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
              Fulfillment Manager
            </span>
            <h1 className="editorial-heading text-xl font-bold font-mono text-white">
              {order.orderNumber}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              Ordered Footwear & Accessories
            </h2>

            <div className="divide-y divide-[#202020]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex gap-4 items-center">
                  <div className="relative w-14 h-14 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-zinc-400 text-[11px]">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-white font-bold">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="pt-3 border-t border-[#202020] space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Courier Delivery ({order.deliveryZone})</span>
                <span className="font-mono text-white">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#202020] flex justify-between font-bold text-white text-sm">
                <span>Total Charge</span>
                <span className="font-mono text-[#F3EDE3]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              Status Audit History
            </h2>

            <div className="space-y-2">
              {order.statusHistory.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#181818] border border-[#262626] rounded flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white uppercase text-[10px]">
                      {h.status.replace(/_/g, " ")}
                    </span>
                    <p className="text-zinc-400 mt-0.5">{h.note}</p>
                    <span className="text-[10px] text-zinc-500">By {h.changedBy}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">
                    {formatDateTime(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status update form */}
          <form
            onSubmit={handleUpdate}
            className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              Update Status & Courier
            </h2>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing (Workshop)</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Courier Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. STDF-982342 / REDX-0912"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Update Note (Logged to audit)</label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Handed over to Pathao rider"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{updating ? "Saving..." : "Apply Status"}</span>
            </button>
          </form>

          {/* Customer & Shipping info */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-3 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>Recipient Info</span>
            </h2>

            <div className="space-y-1 text-zinc-300">
              <p className="font-semibold text-white">{order.customerName}</p>
              <p className="font-mono text-[#A47551]">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-zinc-400">{order.customerEmail}</p>}
              <p className="text-zinc-400 pt-1 leading-relaxed">
                {order.shippingAddress.fullAddress}
                <br />
                {order.shippingAddress.area && `${order.shippingAddress.area}, `}
                {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
