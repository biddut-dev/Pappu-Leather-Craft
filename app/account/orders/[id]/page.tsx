"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Truck, CheckCircle2, MapPin, AlertCircle } from "lucide-react";
import { Order } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/formatters";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0B0B0B] min-h-[60vh] flex items-center justify-center text-zinc-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#0B0B0B] min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h2 className="text-lg font-serif text-white">Order Not Found</h2>
          <p className="text-xs text-zinc-400">
            The requested order ID could not be loaded or you do not have permission to view it.
          </p>
          <Link
            href="/account/orders"
            className="inline-block px-5 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/account" className="hover:text-white transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/account/orders" className="hover:text-white transition-colors">
            Orders
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551] font-mono">{order.orderNumber}</span>
        </nav>

        {/* Top Header Card */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
              Order Receipt
            </span>
            <h1 className="text-2xl font-bold font-mono text-white">{order.orderNumber}</h1>
            <p className="text-xs text-zinc-400">Placed on {formatDateTime(order.createdAt)}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#1C1814] border border-[#8B5E3C] text-[#C5A059] text-xs font-bold uppercase rounded">
              {order.orderStatus.replace(/_/g, " ")}
            </span>
            <Link
              href={`/order-tracking?orderNumber=${order.orderNumber}`}
              className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Courier</span>
            </Link>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#222222]">
            Ordered Footwear & Accessories
          </h2>

          <div className="divide-y divide-[#202020]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-[#1C1C1C] rounded border border-[#2B2B2B] text-white text-[11px] font-mono">
                      Size: {item.size}
                    </span>
                    <span>•</span>
                    <span>Color: {item.color}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-[#222222] space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount ({order.couponCode || "Coupon"})</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Fee ({order.deliveryZone})</span>
              <span className="font-mono text-white">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-[#222222] flex justify-between items-baseline text-sm font-bold text-white">
              <span>Total Amount</span>
              <span className="text-lg font-mono text-[#F3EDE3]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B5E3C]" />
              <span>Delivery Address</span>
            </h3>
            <p className="font-semibold text-white">{order.customerName}</p>
            <p className="text-zinc-400">{order.customerPhone}</p>
            <p className="text-zinc-300 leading-relaxed">
              {order.shippingAddress.fullAddress}
              <br />
              {order.shippingAddress.area && `${order.shippingAddress.area}, `}
              {order.shippingAddress.district}, {order.shippingAddress.division}
            </p>
          </div>

          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5E3C]" />
              <span>Payment & Courier</span>
            </h3>
            <div className="space-y-1.5 text-zinc-300">
              <p>
                <strong className="text-white">Method:</strong>{" "}
                <span className="uppercase font-mono">{order.paymentMethod}</span>
              </p>
              <p>
                <strong className="text-white">Payment Status:</strong>{" "}
                <span className="capitalize">{order.paymentStatus}</span>
              </p>
              <p>
                <strong className="text-white">Zone:</strong> {order.deliveryZone}
              </p>
              {order.trackingNumber && (
                <p>
                  <strong className="text-white">Tracking No:</strong>{" "}
                  <code className="text-[#A47551] font-mono">{order.trackingNumber}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
