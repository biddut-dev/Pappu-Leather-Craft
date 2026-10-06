"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#242424] rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your account email and we will send you instructions to reset your password securely.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#181818] border border-[#8B5E3C] rounded-lg text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#A47551] mx-auto" />
            <p className="text-xs text-zinc-300">
              If an account matches <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs text-[#A47551] hover:underline font-semibold"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Registered Email</label>
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

            <button
              type="submit"
              className="w-full py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
