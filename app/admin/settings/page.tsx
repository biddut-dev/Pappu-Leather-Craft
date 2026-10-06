"use client";

import React, { useEffect, useState } from "react";
import { Settings, Check, Bell, MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { SiteSettings } from "@/types";
import { initialSettings } from "@/lib/seed-data";
import { useToast } from "@/context/ToastContext";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        success("Storefront settings updated successfully.");
      } else {
        error(data.message || "Failed to update settings.");
      }
    } catch {
      error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Storefront & Brand Settings
          </h1>
          <p className="text-xs text-zinc-400">
            Customize header announcement bar, WhatsApp hotline, workshop location, and contact information.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand & Identity */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
            Brand Identity
          </h2>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Brand Name</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#202020]">
            <Bell className="w-4 h-4 text-[#8B5E3C]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Announcement Bar
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Announcement Banner Text</label>
            <input
              type="text"
              value={settings.announcementBarText}
              onChange={(e) =>
                setSettings({ ...settings, announcementBarText: e.target.value })
              }
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-300 pt-2">
            <input
              type="checkbox"
              checked={settings.announcementBarActive}
              onChange={(e) =>
                setSettings({ ...settings, announcementBarActive: e.target.checked })
              }
              className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C]"
            />
            <span>Show Announcement Bar across storefront</span>
          </label>
        </div>

        {/* Contact Hotline & Support */}
        <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl md:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
            Support & Social Integration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Customer Hotline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Official WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Customer Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium">Workshop & Office Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Facebook Page URL</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Instagram URL</label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
