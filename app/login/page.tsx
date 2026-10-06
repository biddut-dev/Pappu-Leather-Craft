"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setErrorMsg(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-[75vh] flex items-center justify-center py-12 px-4">
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
            Pappu Leather Craft
          </span>
          <h1 className="editorial-heading text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-zinc-400">
            Access your orders, saved sizes, delivery addresses and wishlist.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400 font-medium">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#A47551] hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="password"
                required
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
            <span>{loading ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#202020] text-center space-y-3">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#A47551] hover:underline font-semibold">
              Create an Account
            </Link>
          </p>

          <div className="p-3 bg-[#161616] rounded border border-[#242424] text-[11px] text-zinc-400 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>Demo Accounts</span>
            </div>
            <p>Admin: <code className="text-[#C5A059]">admin@pappuleather.com</code> / <code className="text-[#C5A059]">admin123456</code></p>
            <p>Customer: <code className="text-zinc-300">customer@gmail.com</code> / <code className="text-zinc-300">customer123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-zinc-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
