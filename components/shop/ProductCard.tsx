"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    const firstInStock = product.variants.find((v) => v.stock > 0);
    return firstInStock ? firstInStock.id : product.variants[0]?.id || "";
  });

  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const currentPrice = product.discountPrice || product.price;
  const isWishlisted = isInWishlist(product._id);

  // Check total stock and selected variant stock
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariantId) return;
    const added = addItem(product, selectedVariantId, 1);
    if (added) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-[#131313] border border-[#222222] hover:border-[#8B5E3C]/60 rounded-lg overflow-hidden transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black/60"
      onMouseEnter={() => {
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setCurrentImageIndex(0);
      }}
    >
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-[#181818] overflow-hidden block">
        <Image
          src={product.images[currentImageIndex] || product.images[0] || ""}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-[#8B5E3C] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-[#1F1F1F] border border-[#3A3A3A] text-[#F3EDE3] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider rounded">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-[#2B231D] border border-[#8B5E3C]/40 text-[#C5A059] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider rounded">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? "bg-[#8B5E3C] text-white"
              : "bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 backdrop-blur-sm"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Low Stock Indicator */}
        {isLowStock && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 px-1.5 sm:px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-amber-600/40 text-amber-300 text-[9px] sm:text-[10px] font-medium rounded z-10">
            Only {selectedVariant.stock} left
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px] font-medium truncate max-w-[80px] sm:max-w-none">
              {product.categoryName || "Footwear"}
            </span>
            <div className="flex items-center gap-1 text-[#C5A059] shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-300">{product.rating.toFixed(1)}</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 hidden xs:inline">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-[#F3EDE3] group-hover:text-[#A47551] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
              {formatPrice(currentPrice)}
            </span>
            {product.discountPrice && (
              <span className="text-[11px] sm:text-xs text-zinc-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Sizes Quick Selector */}
        {product.variants.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400">
              <span>Size:</span>
              <span className="text-zinc-500 font-mono text-[10px]">
                {selectedVariant ? `EU ${selectedVariant.size}` : "Choose"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const outOfStock = v.stock <= 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`min-w-6 h-6 sm:min-w-7 sm:h-7 px-1 text-[10px] sm:text-[11px] font-medium rounded flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#8B5E3C] text-white border border-[#A47551]"
                        : outOfStock
                        ? "bg-[#181818] text-zinc-600 border border-[#222222] line-through cursor-not-allowed"
                        : "bg-[#1C1C1C] text-zinc-300 border border-[#2B2B2B] hover:border-[#8B5E3C] hover:text-white"
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Add CTA */}
        <div className="pt-1.5 sm:pt-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`w-full py-2 sm:py-2.5 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              isOutOfStock
                ? "bg-[#1E1E1E] text-zinc-500 cursor-not-allowed border border-[#282828]"
                : isAdded
                ? "bg-emerald-700 text-white"
                : "bg-[#1E1E1E] hover:bg-[#8B5E3C] text-zinc-200 hover:text-white border border-[#2E2E2E] hover:border-[#8B5E3C]"
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
