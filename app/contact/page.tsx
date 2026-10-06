"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success("Thank you! Your message has been dispatched to our customer care team.");
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            Customer Care & Workshop
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl font-serif text-[#F3EDE3] font-bold">
            Contact Pappu Leather Craft
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Have questions regarding shoe sizes, custom sizing, delivery timelines, or bulk corporate orders? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-6 text-xs shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#222222]">
                Direct Contacts
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1C1C1C] border border-[#2B2B2B] text-[#8B5E3C] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Customer Hotline:</strong>
                    <span className="text-zinc-300 font-mono">+880 1711-234567</span>
                    <p className="text-zinc-500 text-[11px]">Available Daily: 10:00 AM – 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1C1C1C] border border-[#2B2B2B] text-[#8B5E3C] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Email Inquiries:</strong>
                    <span className="text-zinc-300">support@pappuleather.com</span>
                    <p className="text-zinc-500 text-[11px]">Average response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1C1C1C] border border-[#2B2B2B] text-[#8B5E3C] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Workshop & Head Office:</strong>
                    <span className="text-zinc-300 leading-relaxed">
                      Hazaribagh / Dhanmondi Area, Dhaka, Bangladesh
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1C1C1C] border border-[#2B2B2B] text-[#8B5E3C] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Operating Hours:</strong>
                    <span className="text-zinc-300">Saturday to Thursday: 10:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp CTA */}
              <div className="pt-4 border-t border-[#222222]">
                <a
                  href="https://wa.me/8801711234567?text=Hello%20Pappu%20Leather%20Craft%2C%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 rounded text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#131313] border border-[#242424] rounded-xl space-y-6 shadow-xl">
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Send Us A Message
                </h2>
                <p className="text-xs text-zinc-400">
                  Fill out the form below and our team will get back to you promptly.
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-lg flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Thank you! Your message has been received. We will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01711234567"
                      className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Size recommendation / Order assistance"
                      className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question or request..."
                    className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
