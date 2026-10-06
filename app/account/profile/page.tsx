"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, User, Mail, Phone, Lock, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    success("Profile details updated successfully.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/account" className="hover:text-white transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551]">Profile</span>
        </nav>

        <div className="space-y-1">
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Profile Settings
          </h1>
          <p className="text-xs text-zinc-400">
            Manage your personal identity, contact mobile, and account credentials.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-6 text-xs shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#222222]">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded pl-10 pr-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Contact Phone</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded pl-10 pr-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-400 font-medium">Registered Email (Cannot be changed)</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || "customer@example.com"}
                    className="w-full bg-[#161616] border border-[#242424] rounded pl-10 pr-3 py-2.5 text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#222222]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#222222]">
              Security & Password
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Current Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded pl-10 pr-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded pl-10 pr-3 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
