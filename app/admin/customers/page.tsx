"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";
import { User } from "@/types";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        // For demonstration, list demo customers
        setUsers([
          {
            _id: "u-1",
            name: "Tanvir Ahmed",
            email: "customer@gmail.com",
            phone: "+880 1712-000000",
            role: "customer",
            isActive: true,
            createdAt: "2026-02-01T00:00:00Z",
          },
          {
            _id: "u-2",
            name: "Sabbir Hasan",
            email: "sabbir.hasan@yahoo.com",
            phone: "+880 1819-334455",
            role: "customer",
            isActive: true,
            createdAt: "2026-02-15T00:00:00Z",
          },
          {
            _id: "u-3",
            name: "Mahmudul Alam",
            email: "mahmudul@gmail.com",
            phone: "+880 1911-778899",
            role: "customer",
            isActive: true,
            createdAt: "2026-03-01T00:00:00Z",
          },
          {
            _id: "user-admin-01",
            name: "Pappu Admin",
            email: "admin@pappuleather.com",
            phone: "+880 1711-234567",
            role: "admin",
            isActive: true,
            createdAt: "2026-01-01T00:00:00Z",
          },
        ]);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Customer Registry
          </h1>
          <p className="text-xs text-zinc-400">
            Registered customer accounts, contact mobiles for delivery coordination, and role authorizations.
          </p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Contact Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#161616] transition-colors">
                  <td className="p-3 font-semibold text-white">{u.name}</td>
                  <td className="p-3 font-mono text-zinc-300">{u.email}</td>
                  <td className="p-3 font-mono text-zinc-400">{u.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        u.role === "admin"
                          ? "bg-[#1E1813] border border-[#8B5E3C] text-[#C5A059]"
                          : "bg-[#181818] border border-[#2B2B2B] text-zinc-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-semibold text-[11px]">Active</span>
                  </td>
                  <td className="p-3 text-right text-zinc-500 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
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
