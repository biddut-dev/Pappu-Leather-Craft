"use client";

import React, { useEffect, useState } from "react";
import { Plus, Tag, Check, Trash2 } from "lucide-react";
import { Coupon } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";
import { initialCoupons } from "@/lib/seed-data";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(2000);
  const { success } = useToast();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      _id: "coup-" + Date.now(),
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minimumPurchase: Number(minPurchase),
      usageLimit: 500,
      usedCount: 0,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: "2026-12-31",
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setShowForm(false);
    setCode("");
    success(`Coupon code ${newCoupon.code} created.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Promotional Coupons & Vouchers
          </h1>
          <p className="text-xs text-zinc-400">
            Create discount codes validated strictly server-side during checkout.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "Cancel" : "Add Coupon"}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-[#131313] border border-[#2B2B2B] rounded-xl space-y-4 text-xs shadow-xl max-w-xl animate-in slide-in-from-top-3"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Create New Discount</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. EID2026"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed BDT Amount (৳)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Discount Value *</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Minimum Order Amount (৳) *</label>
              <input
                type="number"
                required
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors"
          >
            Save Coupon
          </button>
        </form>
      )}

      <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Value</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Times Used</th>
                <th className="p-3">Expiry</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-[#161616] transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-white px-2 py-1 bg-[#1A1A1A] border border-[#2C2C2C] rounded">
                      {c.code}
                    </span>
                  </td>

                  <td className="p-3 font-semibold text-emerald-400">
                    {c.type === "percentage" ? `${c.value}% OFF` : `৳${c.value} FLAT`}
                  </td>

                  <td className="p-3 font-mono text-zinc-300">
                    {formatPrice(c.minimumPurchase)}
                  </td>

                  <td className="p-3 font-mono text-zinc-400">{c.usedCount} times</td>

                  <td className="p-3 text-zinc-400 font-mono">{c.expiryDate}</td>

                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold uppercase text-[10px]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
