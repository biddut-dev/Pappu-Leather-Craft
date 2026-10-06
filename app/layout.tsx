import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pappu Leather Craft",
    default: "Pappu Leather Craft | Handcrafted Leather Footwear & Goods Bangladesh",
  },
  description:
    "Crafted for every step. Premium leather footwear, boots, formal oxfords, derbies, loafers, and handcrafted leather accessories made for lasting style in Bangladesh.",
  keywords: [
    "Leather shoes Bangladesh",
    "Pappu Leather Craft",
    "Leather boots Dhaka",
    "Loafers Bangladesh",
    "Handcrafted leather",
    "Men formal shoes",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://pappuleathercraft.com",
    siteName: "Pappu Leather Craft",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#0B0B0B] text-[#EDEDED] font-sans flex flex-col selection:bg-[#8B5E3C] selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer />
                <MobileBottomNav />
                <CartDrawer />
                <ChatbotWidget />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
