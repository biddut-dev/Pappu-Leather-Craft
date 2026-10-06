import { getProducts, getCategories } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NewArrivals from "@/components/home/NewArrivals";
import PromoBanner from "@/components/home/PromoBanner";
import CustomerReviews from "@/components/home/CustomerReviews";
import SocialGallery from "@/components/home/SocialGallery";
import Newsletter from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryShowcase categories={categories} />
      <BestSellers products={products} />
      <BrandStory />
      <WhyChooseUs />
      <NewArrivals products={products} />
      <PromoBanner />
      <CustomerReviews />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}
