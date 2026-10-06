"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200",
  ];

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div
        onClick={() => setIsZoomed(!isZoomed)}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#141414] border border-[#242424] cursor-zoom-in group shadow-2xl"
      >
        <Image
          src={displayImages[selectedIndex]}
          alt={`${productName} view ${selectedIndex + 1}`}
          fill
          priority
          className={`object-cover transition-transform duration-500 ease-out ${
            isZoomed ? "scale-150 cursor-zoom-out" : "group-hover:scale-105"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-[#8B5E3C] ring-2 ring-[#8B5E3C]/30"
                  : "border-[#222222] opacity-70 hover:opacity-100 hover:border-zinc-500"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
