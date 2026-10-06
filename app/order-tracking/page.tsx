"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import { Order, OrderStatus } from "@/types";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trackOrder = async (targetNumber: string, targetPhone?: string) => {
    if (!targetNumber.trim()) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const q = new URLSearchParams({ orderNumber: targetNumber.trim() });
      if (targetPhone) q.set("phone", targetPhone.trim());

      const res = await fetch(`/api/orders/track?${q.toString()}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMessage(data.message || "Order not found. Please double check details.");
      }
    } catch {
      setOrder(null);
      setErrorMessage("Network error while searching for order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      trackOrder(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderNumber, phone);
  };

  const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
    { status: "pending", label: "Order Placed", icon: Clock },
    { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { status: "processing", label: "Artisan Workshop", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
    { status: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const getStepStatus = (stepIndex: number, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentStatus === "cancelled") return "cancelled";
    if (currentIndex >= stepIndex) return "completed";
    return "upcoming";
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Order Tracking</span>
        </nav>

        <div className="space-y-2 text-center max-w-lg mx-auto">
          <h1 className="editorial-heading text-3xl sm:text-4xl font-serif text-[#F3EDE3] font-bold">
            Track Your Footwear
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enter your order number and mobile phone to monitor the live courier progression of your Pappu Leather Craft order.
          </p>
        </div>

        {/* Input Form */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl max-w-2xl mx-auto shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PLC-20261004-1234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C] uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 01711234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Searching..." : "Track Order"}</span>
            </button>
          </form>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="p-6 sm:p-8 bg-[#131313] border border-[#262626] rounded-xl space-y-8 animate-in fade-in">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#222222] gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400">
                  Tracking Order
                </span>
                <h2 className="text-xl font-bold font-mono text-[#F3EDE3]">{order.orderNumber}</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Placed on {formatDateTime(order.createdAt)} • Recipient: {order.customerName}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-zinc-400">Total:</span>
                <p className="text-lg font-bold text-white font-mono">{formatPrice(order.total)}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#1F1F1F] border border-[#303030] rounded text-[11px] text-[#A47551] uppercase font-semibold">
                  {order.orderStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Tracking Stepper */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Courier Milestone
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {steps.map((s, idx) => {
                  const state = getStepStatus(idx, order.orderStatus);
                  const Icon = s.icon;

                  return (
                    <div
                      key={s.status}
                      className={`p-3 rounded-lg border text-center space-y-2 flex flex-col items-center justify-center ${
                        state === "completed"
                          ? "bg-[#181512] border-[#8B5E3C] text-white"
                          : "bg-[#161616] border-[#222222] text-zinc-500 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          state === "completed" ? "bg-[#8B5E3C] text-white" : "bg-[#202020]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-tight">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Notes */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#222222]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Status History
                </h4>
                <div className="space-y-2">
                  {order.statusHistory.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#161616] border border-[#222222] rounded text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold text-white uppercase text-[11px]">
                          {h.status.replace(/_/g, " ")}
                        </span>
                        <p className="text-zinc-400 mt-0.5">{h.note}</p>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {formatDateTime(h.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-3 pt-4 border-t border-[#222222]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Package Contents
              </h4>
              <div className="divide-y divide-[#202020]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-zinc-400 text-[11px]">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300 font-bold">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#0B0B0B] min-h-[60vh] flex items-center justify-center text-zinc-500">
          Loading order tracking...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
