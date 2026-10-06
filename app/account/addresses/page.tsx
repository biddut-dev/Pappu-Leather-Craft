"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AddressesPage() {
  const { success } = useToast();
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      label: "Home Address",
      name: "Tanvir Ahmed",
      phone: "+880 1712-000000",
      district: "Dhaka",
      division: "Dhaka",
      area: "Dhanmondi 27",
      fullAddress: "House 14, Road 27, Dhanmondi, Dhaka - 1209",
      isDefault: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState("Office");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [fullAddress, setFullAddress] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !fullAddress) return;

    const newAddr = {
      id: "addr-" + Date.now(),
      label,
      name,
      phone,
      district,
      division: "Dhaka",
      area: "",
      fullAddress,
      isDefault: false,
    };

    setAddresses([...addresses, newAddr]);
    setShowAddForm(false);
    setName("");
    setPhone("");
    setFullAddress("");
    success("New delivery address added.");
  };

  const handleRemove = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    success("Address removed.");
  };

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
          <span className="text-[#A47551]">Addresses</span>
        </nav>

        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="space-y-1">
            <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
              Saved Delivery Addresses
            </h1>
            <p className="text-xs text-zinc-400">
              Speed up checkout by saving standard delivery points across Bangladesh.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel" : "Add Address"}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <form
            onSubmit={handleAdd}
            className="p-6 bg-[#131313] border border-[#2B2B2B] rounded-xl space-y-4 text-xs animate-in slide-in-from-top-3 shadow-xl"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Add New Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400">Label (Home / Office)</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400">District / City</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Full Address</label>
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House, road, landmark..."
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Saved Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-5 bg-[#141414] border border-[#242424] rounded-lg text-xs space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B5E3C]" />
                  <span className="font-bold text-white uppercase tracking-wider">{addr.label}</span>
                </div>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-[#1E1A16] border border-[#8B5E3C] text-[#C5A059] text-[10px] rounded font-semibold">
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-1 text-zinc-300">
                <p className="font-semibold text-white">{addr.name}</p>
                <p className="text-zinc-400">{addr.phone}</p>
                <p className="text-zinc-400">{addr.fullAddress}</p>
                <p className="text-zinc-500 font-mono">{addr.district}, Bangladesh</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleRemove(addr.id)}
                  className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
