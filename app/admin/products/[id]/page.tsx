"use client";

import React, { useEffect, useState, use } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="text-zinc-500 py-10">Loading footwear editor...</div>;
  }

  if (!product) {
    return <div className="text-red-400 py-10">Product not found.</div>;
  }

  return <ProductForm initialProduct={product} />;
}
