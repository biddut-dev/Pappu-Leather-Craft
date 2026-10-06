"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      success("Thank you for subscribing! Your 10% coupon code is PAPPU10.");
    }, 600);
  };

  return (
    <section className="py-20 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#2B2B2B] flex items-center justify-center mx-auto text-[#8B5E3C]">
          <Mail className="w-5 h-5" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
            Insider Privilege
          </span>
          <h2 className="editorial-heading text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
            GET 10% OFF YOUR FIRST ORDER.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Subscribe to receive private preview access to seasonal releases, leather care advice, and exclusive customer rewards.
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 bg-[#141414] border border-[#8B5E3C]/60 rounded-lg max-w-md mx-auto flex items-center justify-center gap-2 text-sm text-[#F3EDE3]">
            <CheckCircle className="w-5 h-5 text-[#8B5E3C]" />
            <span>Welcome! Use code <strong>PAPPU10</strong> at checkout for 10% off.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-[#141414] border border-[#2B2B2B] rounded px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <span>{loading ? "Joining..." : "Subscribe"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-zinc-500">
          We respect your privacy. You can unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
}
