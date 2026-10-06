import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import ProductCard from "@/components/shop/ProductCard";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found | Pappu Leather Craft" };

  return {
    title: `${product.name} | Pappu Leather Craft`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Pappu Leather Craft`,
      description: product.shortDescription,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const allProducts = await getProducts({ categorySlug: product.categorySlug });
  const relatedProducts = allProducts.filter((p) => p._id !== product._id).slice(0, 4);

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Pappu Leather Craft",
    },
    offers: {
      "@type": "Offer",
      url: `https://pappuleathercraft.com/product/${product.slug}`,
      priceCurrency: "BDT",
      price: product.discountPrice || product.price,
      availability:
        product.variants.some((v) => v.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
    },
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen pt-6 pb-24 md:py-8">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          {product.categorySlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/category/${product.categorySlug}`}
                className="hover:text-white transition-colors"
              >
                {product.categoryName || product.categorySlug}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#A47551] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailsClient product={product} />

        {/* Related Footwear Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#222222] space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
                Handpicked Complementary Styles
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#F3EDE3]">You May Also Appreciate</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
