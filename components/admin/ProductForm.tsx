"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, Check, Image as ImageIcon } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/context/ToastContext";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  initialProduct?: Product;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || `PLC-${Date.now().toString().slice(-6)}`);
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "cat-loafers");
  const [categoryName, setCategoryName] = useState(initialProduct?.categoryName || "Loafers");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(initialProduct?.discountPrice?.toString() || "");
  const [material, setMaterial] = useState(initialProduct?.material || "Full-Grain Cowhide Leather");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [imagesText, setImagesText] = useState(
    initialProduct?.images?.join("\n") ||
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200&auto=format&fit=crop"
  );
  const [sole, setSole] = useState(initialProduct?.sole || "Flexible TPR Rubber Anti-Skid");
  const [fit, setFit] = useState(initialProduct?.fit || "True to European standard size.");

  // Flags
  const [isFeatured, setIsFeatured] = useState(!!initialProduct?.isFeatured);
  const [isBestSeller, setIsBestSeller] = useState(!!initialProduct?.isBestSeller);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? true);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);

  // Variants (Sizes 40-44 default)
  const defaultVariants: ProductVariant[] = [
    { id: "v40", size: 40, color: "Cognac Brown", sku: `${sku}-40`, stock: 5 },
    { id: "v41", size: 41, color: "Cognac Brown", sku: `${sku}-41`, stock: 10 },
    { id: "v42", size: 42, color: "Cognac Brown", sku: `${sku}-42`, stock: 15 },
    { id: "v43", size: 43, color: "Cognac Brown", sku: `${sku}-43`, stock: 8 },
    { id: "v44", size: 44, color: "Cognac Brown", sku: `${sku}-44`, stock: 4 },
  ];

  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants?.length ? initialProduct.variants : defaultVariants
  );

  const [saving, setSaving] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialProduct) {
      setSlug(slugify(val));
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setCategoryId(e.target.value);
    setCategoryName(selectedOption.text);
  };

  const updateVariantStock = (idx: number, stock: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, stock: Math.max(0, stock) } : v))
    );
  };

  const addVariantRow = () => {
    const nextSize = variants.length > 0 ? Number(variants[variants.length - 1].size) + 1 || 45 : 40;
    setVariants((prev) => [
      ...prev,
      {
        id: "v-" + Date.now(),
        size: nextSize,
        color: "Brown",
        sku: `${sku}-${nextSize}`,
        stock: 5,
      },
    ]);
  };

  const removeVariantRow = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      error("Product name and price are required.");
      return;
    }

    setSaving(true);
    const parsedImages = imagesText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      name,
      slug: slug || slugify(name),
      sku,
      categoryId,
      categoryName,
      categorySlug: categoryId.replace("cat-", ""),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      material,
      shortDescription,
      description,
      images: parsedImages,
      sole,
      fit,
      variants,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive,
    };

    try {
      const url = initialProduct ? `/api/products/${initialProduct._id}` : "/api/products";
      const method = initialProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(initialProduct ? "Product updated." : "Product created successfully.");
        router.push("/admin/products");
      } else {
        error(data.message || "Failed to save product.");
      }
    } catch {
      error("Network error while saving product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs max-w-5xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-[#181818] border border-[#2B2B2B] rounded-lg text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="editorial-heading text-xl sm:text-2xl font-serif text-[#F3EDE3] font-bold">
            {initialProduct ? `Edit ${initialProduct.name}` : "Create New Leather Footwear"}
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-950/20 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Product"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              General Information
            </h2>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Classic Brown Leather Loafer"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="classic-brown-leather-loafer"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="PLC-LOAFER-01"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Category</label>
                <select
                  value={categoryId}
                  onChange={handleCategorySelect}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                >
                  <option value="cat-formal">Formal Shoes</option>
                  <option value="cat-loafers">Loafers</option>
                  <option value="cat-boots">Boots</option>
                  <option value="cat-casual">Casual Shoes</option>
                  <option value="cat-sandals">Sandals</option>
                  <option value="cat-accessories">Leather Accessories</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Leather Material Specification</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Full-Grain Cowhide Leather"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Short Highlight Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One-line summary for cards and search results"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Full Editorial Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on leather tanning, stitching, insole cushioning, and lasting..."
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Pricing & Sole */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              Pricing & Technical Build
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Regular Price (BDT ৳) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2990"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Discount / Offer Price (BDT ৳)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="2490 (Leave empty if no discount)"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Outsole Material</label>
                <input
                  type="text"
                  value={sole}
                  onChange={(e) => setSole(e.target.value)}
                  placeholder="e.g. Flexible TPR Rubber Anti-Skid"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Fit Advisory</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder="e.g. True to European size."
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Variants and Size Stock Manager */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#202020]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Shoe Size Variants & Stock System
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Every size has independent inventory. Customer checkout updates this automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariantRow}
                className="px-3 py-1 bg-[#1E1E1E] hover:bg-[#282828] border border-[#333333] rounded text-zinc-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Size</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div
                  key={v.id}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 bg-[#181818] border border-[#262626] rounded-lg"
                >
                  <div className="col-span-3">
                    <label className="text-[10px] text-zinc-500 block">EU Size</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, size: val } : item))
                        );
                      }}
                      className="w-full bg-[#121212] border border-[#2E2E2E] rounded px-2 py-1 text-white font-mono font-bold"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="text-[10px] text-zinc-500 block">Colorway</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, color: val } : item))
                        );
                      }}
                      className="w-full bg-[#121212] border border-[#2E2E2E] rounded px-2 py-1 text-white"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] text-zinc-500 block">Available Stock</label>
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariantStock(idx, Number(e.target.value))}
                      className="w-full bg-[#121212] border border-[#2E2E2E] rounded px-2 py-1 text-white font-mono font-bold"
                    />
                  </div>

                  <div className="col-span-2 text-right pt-3">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Flags */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-[#202020]">
              Product Visibility
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C]"
                />
                <span>Active on Public Store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C]"
                />
                <span>Featured Collection</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C]"
                />
                <span>Best Seller Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181818] border-[#2E2E2E] text-[#8B5E3C]"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>

          {/* Photography URLs */}
          <div className="p-6 bg-[#131313] border border-[#242424] rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#202020]">
              <ImageIcon className="w-4 h-4 text-[#8B5E3C]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Product Image URLs
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400">
              Enter one image URL per line. First image is used as primary card cover.
            </p>
            <textarea
              rows={4}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
