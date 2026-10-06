"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await register(name, email, phone, password);
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setErrorMsg(res.error || "Registration failed.");
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#242424] rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <Image
              src="/images/logo.png"
              alt="Pappu Leather Craft"
              fill
              priority
              className="object-contain"
              sizes="64px"
            />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#8B5E3C] uppercase font-semibold">
            Join Pappu Leather Craft
          </span>
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Create Your Account
          </h1>
          <p className="text-xs text-zinc-400">
            Enjoy priority order dispatch, save shoe measurements, and track shipments seamlessly.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Full Name *</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Mobile Phone *</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01711234567"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Email Address *</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanvir@example.com"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Password (Min. 6 characters) *</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#202020] text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#A47551] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
