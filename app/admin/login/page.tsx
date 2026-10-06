"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@pappuleather.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setErrorMessage(res.error || "Invalid staff credentials.");
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <Image
              src="/images/logo.png"
              alt="Pappu Leather Craft Logo"
              fill
              priority
              className="object-contain"
              sizes="80px"
            />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#8B5E3C] uppercase font-semibold">
            Pappu Leather Craft
          </span>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Staff & Admin Console
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to manage inventory, process courier shipments, and adjust store catalog.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Admin Email</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Authenticating..." : "Enter Admin Console"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#202020] text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Return to Live Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
