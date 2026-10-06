"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        success(`Product "${name}" deleted.`);
      } else {
        error("Failed to delete product.");
      }
    } catch {
      error("Network error.");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Footwear & Product Catalog
          </h1>
          <p className="text-xs text-zinc-400">
            Total {products.length} models with multi-size inventory tracking.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131313] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Variants / Total Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-500">
                    Loading catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);

                  return (
                    <tr key={p._id} className="hover:bg-[#161616] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2B2B2B]">
                            <Image
                              src={p.images[0] || ""}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-semibold text-white hover:text-[#A47551] transition-colors line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-zinc-500">{p.material}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono text-zinc-400">{p.sku}</td>

                      <td className="p-3 text-zinc-300">{p.categoryName || "Footwear"}</td>

                      <td className="p-3 font-mono">
                        <span className="font-bold text-white">
                          {formatPrice(p.discountPrice || p.price)}
                        </span>
                        {p.discountPrice && (
                          <span className="text-[10px] text-zinc-500 line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="font-mono text-zinc-200 font-semibold">
                          {totalStock} in stock
                        </span>
                        <div className="flex gap-1 mt-1">
                          {p.variants.map((v) => (
                            <span
                              key={v.id}
                              className={`px-1 py-0.5 rounded text-[9px] font-mono ${
                                v.stock > 0
                                  ? "bg-[#1E1E1E] text-zinc-300 border border-[#2C2C2C]"
                                  : "bg-red-950 text-red-400 border border-red-900"
                              }`}
                            >
                              {v.size}:{v.stock}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3">
                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-500 font-medium text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p._id}`}
                            className="p-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-zinc-300 hover:text-white rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 bg-[#1C1C1C] hover:bg-red-950/40 border border-[#2B2B2B] text-zinc-400 hover:text-red-400 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
