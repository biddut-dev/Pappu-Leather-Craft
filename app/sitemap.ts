import { MetadataRoute } from "next";
import { initialProducts, initialCategories } from "@/lib/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pappuleathercraft.com";

  const staticRoutes = [
    "",
    "/shop",
    "/new-arrivals",
    "/best-sellers",
    "/offers",
    "/about",
    "/contact",
    "/faq",
    "/size-guide",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
    "/order-tracking",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = initialProducts.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryRoutes = initialCategories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
