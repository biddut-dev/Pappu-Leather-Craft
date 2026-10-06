"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Check, Layers, Edit2 } from "lucide-react";
import { Category } from "@/types";
import { useToast } from "@/context/ToastContext";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug || slugify(name),
          description: description.trim(),
          image:
            image.trim() ||
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200",
        }),
      });

      const data = await res.json();
      if (res.ok && data.category) {
        setCategories([...categories, data.category]);
        setShowForm(false);
        setName("");
        setSlug("");
        setDescription("");
        setImage("");
        success("New footwear category created.");
      } else {
        error(data.message || "Failed to create category");
      }
    } catch {
      error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Category Management
          </h1>
          <p className="text-xs text-zinc-400">
            Organize footwear collections (Formal, Loafers, Boots, Casual, Sandals, Accessories).
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "Cancel" : "Add Category"}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-[#131313] border border-[#2B2B2B] rounded-xl space-y-4 text-xs shadow-xl animate-in slide-in-from-top-3 max-w-2xl"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Create Footwear Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Monk Strap Shoes"
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short category description for hero cards"
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors"
          >
            {saving ? "Creating..." : "Save Category"}
          </button>
        </form>
      )}

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-5 bg-[#131313] border border-[#242424] rounded-xl flex gap-4 items-center shadow-lg"
          >
            <div className="relative w-16 h-16 rounded-lg bg-[#1C1C1C] overflow-hidden shrink-0 border border-[#2A2A2A]">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{cat.name}</h3>
              <p className="text-[11px] font-mono text-[#A47551]">/category/{cat.slug}</p>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
