"use client";

import React, { useState } from "react";
import { Truck, Check } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";
import { initialDeliveryZones } from "@/lib/seed-data";

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState(initialDeliveryZones);
  const { success } = useToast();

  const handleFeeChange = (idx: number, newFee: number) => {
    setZones((prev) =>
      prev.map((z, i) => (i === idx ? { ...z, fee: Math.max(0, newFee) } : z))
    );
  };

  const handleSave = () => {
    success("Delivery zones & courier rates updated.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Delivery Zones & Courier Rates
          </h1>
          <p className="text-xs text-zinc-400">
            Configure delivery fees applied dynamically at customer checkout for Dhaka and other 63 districts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg"
        >
          <Check className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone, idx) => (
          <div
            key={zone._id}
            className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl text-xs"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#202020]">
              <Truck className="w-4 h-4 text-[#8B5E3C]" />
              <h2 className="text-sm font-bold text-white uppercase">{zone.name}</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Standard Delivery Fee (BDT ৳)</label>
              <input
                type="number"
                value={zone.fee}
                onChange={(e) => handleFeeChange(idx, Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Estimated Delivery Window</label>
              <input
                type="text"
                value={zone.estimatedDelivery}
                onChange={(e) => {
                  const val = e.target.value;
                  setZones((prev) =>
                    prev.map((z, i) => (i === idx ? { ...z, estimatedDelivery: val } : z))
                  );
                }}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-zinc-500 font-medium">Covered Areas (Sample):</label>
              <div className="flex flex-wrap gap-1">
                {zone.areas.map((a, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#282828] text-[10px] text-zinc-400"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
