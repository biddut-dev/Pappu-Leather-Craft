"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/formatters";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { error, success } = useToast();

  // Form State
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"Inside Dhaka City" | "Outside Dhaka">(
    "Inside Dhaka City"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [customerNote, setCustomerNote] = useState("");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Delivery Fee Calculation
  const deliveryFee = deliveryZone === "Inside Dhaka City" ? 70 : 130;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.discountAmount) {
        setAppliedCoupon(data.coupon.code);
        setDiscountAmount(data.discountAmount);
        success(`Coupon applied! Saved ৳${data.discountAmount}`);
      } else {
        error(data.message || "Invalid coupon code");
      }
    } catch {
      error("Unable to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      error("Please fill in your name, contact phone, and full delivery address.");
      return;
    }

    if (items.length === 0) {
      error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email,
          shippingAddress: {
            division,
            district,
            area,
            fullAddress: address,
          },
          items,
          couponCode: appliedCoupon || undefined,
          deliveryZone,
          paymentMethod,
          customerNote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setPlacedOrderNumber(data.order.orderNumber);
        clearCart();

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        success("Order placed successfully!");
      } else {
        error(data.message || "Order placement failed. Please verify your items.");
      }
    } catch {
      error("Network error while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was placed successfully, show confirmation screen
  if (placedOrderNumber) {
    return (
      <div className="bg-[#0B0B0B] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-[#131313] border border-[#8B5E3C]/60 rounded-xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#1F1A15] border border-[#8B5E3C] flex items-center justify-center mx-auto text-[#C5A059]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-zinc-400">
              We have received your order and our artisan workshop will prepare your footwear carefully.
            </p>
          </div>

          <div className="p-4 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Order Number:</span>
              <strong className="text-[#F3EDE3] font-mono">{placedOrderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Customer:</span>
              <span className="text-white">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Zone:</span>
              <span className="text-white">{deliveryZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment:</span>
              <span className="text-white uppercase font-mono">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#262626]">
              <span className="text-zinc-300 font-semibold">Total Amount:</span>
              <strong className="text-sm font-bold text-[#F3EDE3] font-mono">
                {formatPrice(finalTotal)}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/order-tracking?orderNumber=${placedOrderNumber}&phone=${encodeURIComponent(phone)}`}
              className="flex-1 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors text-center"
            >
              Track Order Status
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2E2E2E] text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Guard against empty cart
  if (items.length === 0) {
    return (
      <div className="bg-[#0B0B0B] min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-base text-zinc-300 font-serif">Your shopping cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-[#8B5E3C] text-white text-xs font-bold uppercase rounded"
          >
            Browse Footwear
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-white transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Checkout</span>
        </nav>

        <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
          Checkout & Shipping
        </h1>

        {/* Mobile Accordion: Order Summary & Coupon (Visible only on mobile < lg) */}
        <div className="lg:hidden bg-[#131313] border border-[#2B2B2B] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-left text-xs text-white"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-zinc-300">
                {mobileSummaryOpen ? "Hide" : "Show"} Order Summary ({items.length})
              </span>
              <span className="text-[#8B5E3C] font-bold">{mobileSummaryOpen ? "▲" : "▼"}</span>
            </div>
            <strong className="text-sm font-bold text-[#F3EDE3] font-mono">
              {formatPrice(finalTotal)}
            </strong>
          </button>

          {mobileSummaryOpen && (
            <div className="p-4 pt-0 border-t border-[#222222] space-y-4 animate-in fade-in">
              <div className="space-y-3 pt-3 max-h-56 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-zinc-400 text-[11px]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon in mobile summary */}
              <div className="pt-2 border-t border-[#222222]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. PAPPU10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#8B5E3C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="px-3 py-2 bg-[#202020] hover:bg-[#8B5E3C] text-white text-xs font-semibold rounded border border-[#333333]"
                  >
                    {validatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Coupon active (-{formatPrice(discountAmount)})</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Customer Details */}
            <div className="p-4 sm:p-6 bg-[#131313] border border-[#222222] rounded-lg space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#222222] flex items-center gap-2">
                <span>1. Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-zinc-400 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">
                    Mobile Phone (For Courier Verification) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01711234567"
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Email Address (Optional for Invoice)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tanvir@example.com"
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-4 sm:p-6 bg-[#131313] border border-[#222222] rounded-lg space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#222222] flex items-center gap-2">
                <span>2. Delivery Address (Bangladesh)</span>
              </h2>

              <div className="space-y-4 text-xs">
                {/* Zone selector */}
                <div className="space-y-2">
                  <label className="text-zinc-400 font-medium">Select Delivery Zone *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDeliveryZone("Inside Dhaka City")}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        deliveryZone === "Inside Dhaka City"
                          ? "bg-[#1C1814] border-[#8B5E3C] text-white"
                          : "bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === "Inside Dhaka City"}
                        onChange={() => setDeliveryZone("Inside Dhaka City")}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-[#F3EDE3]">Inside Dhaka City</p>
                        <p className="text-[11px] text-zinc-400">৳70 • 24 - 48 Hours</p>
                      </div>
                    </label>

                    <label
                      onClick={() => setDeliveryZone("Outside Dhaka")}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        deliveryZone === "Outside Dhaka"
                          ? "bg-[#1C1814] border-[#8B5E3C] text-white"
                          : "bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === "Outside Dhaka"}
                        onChange={() => setDeliveryZone("Outside Dhaka")}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-[#F3EDE3]">Outside Dhaka</p>
                        <p className="text-[11px] text-zinc-400">৳130 • 2 - 4 Business Days</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Division & District */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Division *</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white text-xs"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">District / City *</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Dhaka, Gazipur, Bogura"
                      className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Thana / Area</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Dhanmondi, Mirpur 10"
                      className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                {/* Full detailed address */}
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Full Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, road number, flat/floor, landmark..."
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                {/* Special instructions */}
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">
                    Delivery Note / Call Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="e.g. Please call before delivery"
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 sm:p-6 bg-[#131313] border border-[#222222] rounded-lg space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#222222] flex items-center gap-2">
                <span>3. Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === "cod"
                      ? "bg-[#1C1814] border-[#8B5E3C] text-white"
                      : "bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#8B5E3C]" />
                      <strong className="text-white">Cash on Delivery (COD)</strong>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Pay with cash when the delivery person arrives at your doorstep. Inspect your pair before paying.
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod("bkash")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === "bkash"
                      ? "bg-[#1C1814] border-[#8B5E3C] text-white"
                      : "bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-500" />
                      <strong className="text-white">bKash Payment</strong>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Send payment to our Official Merchant Account. You can confirm transaction ID upon order placement.
                    </p>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod("nagad")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === "nagad"
                      ? "bg-[#1C1814] border-[#8B5E3C] text-white"
                      : "bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-orange-500" />
                      <strong className="text-white">Nagad Payment</strong>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Pay conveniently using your Nagad digital wallet.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#141414] border border-[#242424] rounded-lg space-y-5 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424]">
                Order Items ({items.length})
              </h2>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-zinc-400 text-[11px]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-3 border-t border-[#242424]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. PAPPU10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#8B5E3C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="px-4 py-2 bg-[#202020] hover:bg-[#8B5E3C] text-white text-xs font-semibold rounded border border-[#333333] transition-colors shrink-0 disabled:opacity-50"
                  >
                    {validatingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Coupon <strong>{appliedCoupon}</strong> active</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#242424] text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-300">
                  <span>Delivery Fee ({deliveryZone})</span>
                  <span className="font-mono font-semibold text-white">{formatPrice(deliveryFee)}</span>
                </div>

                <div className="pt-3 border-t border-[#242424] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Total Payable
                  </span>
                  <strong className="text-2xl font-bold text-[#F3EDE3] font-mono">
                    {formatPrice(finalTotal)}
                  </strong>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-[0.15em] rounded transition-all shadow-xl hover:shadow-orange-950/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? "Securing Your Order..." : "Confirm & Place Order"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
                <span>Zero Risk • 7-Day Size Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
