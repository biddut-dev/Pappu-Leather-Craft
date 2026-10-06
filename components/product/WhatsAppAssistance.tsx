"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Product, ProductVariant } from "@/types";

interface WhatsAppAssistanceProps {
  product: Product;
  selectedVariant?: ProductVariant;
  phone?: string;
}

export default function WhatsAppAssistance({
  product,
  selectedVariant,
  phone = "+8801711234567",
}: WhatsAppAssistanceProps) {
  const cleanPhone = phone.replace(/\D/g, "");

  const handleWhatsAppClick = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const sizeInfo = selectedVariant ? ` (Size: ${selectedVariant.size})` : "";
    const text = `Assalamu Alaikum Pappu Leather Craft,\nI would like to inquire about this shoe:\n*Product:* ${product.name}${sizeInfo}\n*SKU:* ${product.sku}\n*Price:* ৳${product.discountPrice || product.price}\n*Link:* ${currentUrl}`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] border border-[#272727] hover:border-[#25D366]/50 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
    >
      <MessageSquare className="w-4 h-4 text-[#25D366]" />
      <span>Ask About This Product On WhatsApp</span>
    </button>
  );
}
