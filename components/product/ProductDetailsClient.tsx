"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Star,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductGallery from "./ProductGallery";
import SizeGuideModal from "./SizeGuideModal";
import WhatsAppAssistance from "./WhatsAppAssistance";
import ProductReviews from "./ProductReviews";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find first variant in stock
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    const inStock = product.variants.find((v) => v.stock > 0);
    return inStock ? inStock.id : product.variants[0]?.id || "";
  });

  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "craft" | "delivery">("details");
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const currentPrice = product.discountPrice || product.price;
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariantId) return;
    const added = addItem(product, selectedVariantId, quantity);
    if (added) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariantId) return;
    const added = addItem(product, selectedVariantId, quantity);
    if (added) {
      router.push("/checkout");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Purchase Actions & Info (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C] font-semibold">
                {product.categoryName || "Handcrafted Leather"}
              </span>
              <span className="text-xs font-mono text-zinc-500">SKU: {product.sku}</span>
            </div>

            <h1 className="editorial-heading text-2xl sm:text-3xl md:text-4xl font-serif text-[#F3EDE3] font-bold">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? "fill-current" : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-zinc-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-[#141414] border border-[#242424] rounded-lg flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="px-2.5 py-1 bg-[#8B5E3C] text-white text-xs font-bold uppercase tracking-wider rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Color & Material overview */}
          <div className="space-y-1.5 text-xs">
            <p className="text-zinc-400">
              <strong className="text-zinc-200">Material:</strong> {product.material}
            </p>
            {product.colors && product.colors.length > 0 && (
              <p className="text-zinc-400">
                <strong className="text-zinc-200">Color Finish:</strong> {product.colors.join(", ")}
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <span>Select Shoe Size (EU)</span>
                {selectedVariant && (
                  <span className="text-[#8B5E3C] font-mono">Size {selectedVariant.size}</span>
                )}
              </label>

              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#A47551] hover:text-white transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Variant buttons */}
            <div className="grid grid-cols-5 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const outOfStock = v.stock <= 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      setQuantity(1);
                    }}
                    className={`py-3 rounded text-xs font-bold flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#8B5E3C] text-white border-2 border-[#A47551] shadow-lg"
                        : outOfStock
                        ? "bg-[#181818] text-zinc-600 border border-[#222222] line-through cursor-not-allowed"
                        : "bg-[#181818] text-zinc-300 border border-[#2E2E2E] hover:border-[#8B5E3C] hover:text-white"
                    }`}
                  >
                    <span>{v.size}</span>
                    <span className="text-[9px] font-normal opacity-70">
                      {outOfStock ? "Sold" : `${v.stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stock Warning */}
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <span>⚠️ Limited Inventory: Only {selectedVariant.stock} pairs left in Size {selectedVariant.size}.</span>
              </p>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity input */}
              <div className="flex items-center border border-[#2E2E2E] rounded bg-[#141414] px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-2 text-zinc-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedVariant && quantity < selectedVariant.stock) {
                      setQuantity((q) => q + 1);
                    }
                  }}
                  disabled={selectedVariant ? quantity >= selectedVariant.stock : true}
                  className="px-2 py-2 text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? "bg-[#1E1E1E] text-zinc-500 cursor-not-allowed border border-[#2A2A2A]"
                    : isAdded
                    ? "bg-emerald-700 text-white"
                    : "bg-[#1E1E1E] hover:bg-[#282828] text-white border border-[#333333] hover:border-[#8B5E3C]"
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#8B5E3C]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? "bg-[#8B5E3C] border-[#A47551] text-white"
                    : "bg-[#141414] border-[#2E2E2E] text-zinc-400 hover:text-white hover:border-zinc-500"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`w-full py-4 rounded text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-xl transition-all ${
                isOutOfStock
                  ? "bg-[#1E1E1E] text-zinc-600 cursor-not-allowed"
                  : "bg-[#8B5E3C] hover:bg-[#A47551] text-white hover:shadow-orange-950/30"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Buy Now (Cash On Delivery)</span>
            </button>
          </div>

          {/* WhatsApp Product Inquiry */}
          <WhatsAppAssistance product={product} selectedVariant={selectedVariant} />

          {/* Assurances */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2 p-2.5 bg-[#141414] border border-[#222222] rounded">
              <Truck className="w-4 h-4 text-[#8B5E3C] shrink-0" />
              <span>Nationwide Delivery (Inside Dhaka ৳70)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#141414] border border-[#222222] rounded">
              <RotateCcw className="w-4 h-4 text-[#8B5E3C] shrink-0" />
              <span>7-Day Hassle-Free Size Exchange</span>
            </div>
          </div>

          {/* Details / Craft / Delivery Tabs */}
          <div className="pt-6 border-t border-[#222222]">
            <div className="flex border-b border-[#242424] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 font-bold uppercase tracking-wider transition-colors mr-6 relative ${
                  activeTab === "details"
                    ? "text-[#F3EDE3] border-b-2 border-[#8B5E3C]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("craft")}
                className={`pb-2.5 font-bold uppercase tracking-wider transition-colors mr-6 relative ${
                  activeTab === "craft"
                    ? "text-[#F3EDE3] border-b-2 border-[#8B5E3C]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Material & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("delivery")}
                className={`pb-2.5 font-bold uppercase tracking-wider transition-colors relative ${
                  activeTab === "delivery"
                    ? "text-[#F3EDE3] border-b-2 border-[#8B5E3C]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Delivery & Returns
              </button>
            </div>

            <div className="pt-4 text-xs text-zinc-300 leading-relaxed">
              {activeTab === "details" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  {product.sole && (
                    <p>
                      <strong className="text-white">Sole Construction:</strong> {product.sole}
                    </p>
                  )}
                  {product.fit && (
                    <p>
                      <strong className="text-white">Fit Advisory:</strong> {product.fit}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "craft" && (
                <div className="space-y-3">
                  <p>
                    <strong className="text-white">Leather Specification:</strong> {product.material}
                  </p>
                  {product.careInstructions && product.careInstructions.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="font-semibold text-white">Recommended Leather Care:</p>
                      <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1">
                        {product.careInstructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="space-y-2">
                  <p>
                    <strong className="text-white">Dhaka Metropolitan:</strong> Delivered in 24 - 48
                    hours (৳70).
                  </p>
                  <p>
                    <strong className="text-white">Outside Dhaka:</strong> Delivered in 2 - 4 business
                    days across all 64 districts (৳130).
                  </p>
                  <p>
                    <strong className="text-white">Size Exchange:</strong> If the size does not fit
                    flawlessly, message us on WhatsApp within 7 days for a courier exchange.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews
        productId={product._id}
        initialRating={product.rating}
        initialCount={product.reviewCount}
      />

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-[#121212]/95 backdrop-blur-md border-t border-[#262626] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {product.images && product.images[0] && (
            <div className="relative w-10 h-10 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2B2B2B]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{product.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F3EDE3]">{formatPrice(currentPrice)}</span>
              {selectedVariant && (
                <span className="text-[10px] text-zinc-400 font-mono px-1.5 py-0.2 bg-[#1C1C1C] rounded border border-[#2B2B2B]">
                  EU {selectedVariant.size}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`shrink-0 px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
            isOutOfStock
              ? "bg-[#1E1E1E] text-zinc-500 cursor-not-allowed border border-[#282828]"
              : isAdded
              ? "bg-emerald-700 text-white"
              : "bg-[#8B5E3C] hover:bg-[#A47551] text-white"
          }`}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
