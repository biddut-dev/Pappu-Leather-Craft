/**
 * Pappu Leather Craft - Intelligent Offline Knowledge Engine
 * 100% self-contained without external third-party API dependencies.
 */

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: string[];
  productCards?: {
    name: string;
    slug: string;
    price: string;
    image: string;
    category: string;
  }[];
  actionLink?: {
    label: string;
    url: string;
    external?: boolean;
  };
}

export function generateBotResponse(userInput: string): ChatMessage {
  const query = userInput.toLowerCase().trim();
  const id = "msg-" + Date.now() + Math.random().toString(36).substring(7);
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. GREETINGS
  if (
    query.match(/\b(hi|hello|hey|salam|assalamu alaikum|morning|evening|namaskar|hola)\b/)
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Assalamu Alaikum! Welcome to Pappu Leather Craft. I am your artisan concierge. How may I assist you with footwear sizing, orders, or leather recommendations today?",
      quickReplies: [
        "👞 Best Sellers",
        "👟 Size Guide Help",
        "📦 Track My Order",
        "🚚 Delivery Charges",
        "💬 WhatsApp Support",
      ],
    };
  }

  // 2. ORDER TRACKING
  if (
    query.includes("track") ||
    query.includes("where is my order") ||
    query.includes("parcel") ||
    query.includes("consignment") ||
    query.includes("order status") ||
    query.match(/\bplc-\d+/i)
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "You can monitor your live courier journey directly using our real-time tracking tool. Enter your Order ID (e.g. PLC-20261004-XXXX) and mobile phone.",
      actionLink: {
        label: "Open Order Tracking Page",
        url: "/order-tracking",
      },
      quickReplies: ["🚚 Delivery Times", "💬 Talk to Support", "👞 Back to Shoes"],
    };
  }

  // 3. SIZING & FIT
  if (
    query.includes("size") ||
    query.includes("fit") ||
    query.includes("tight") ||
    query.includes("loose") ||
    query.includes("measure") ||
    query.includes("chart") ||
    query.includes("narrow") ||
    query.includes("wide")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Our footwear uses standardized European (EU) sizing:\n\n• EU 40 = 25.0 cm (BD 6)\n• EU 41 = 25.5 cm (BD 7)\n• EU 42 = 26.5 cm (BD 8)\n• EU 43 = 27.5 cm (BD 9)\n• EU 44 = 28.5 cm (BD 10)\n\nTip: If you have wider feet or fall between sizes, we recommend going one size up. Plus, we offer a 7-day free size exchange if needed!",
      actionLink: {
        label: "View Interactive Size Guide",
        url: "/size-guide",
      },
      quickReplies: ["🔄 Exchange Policy", "👞 Shop Loafers", "💬 WhatsApp Sizing Help"],
    };
  }

  // 4. DELIVERY CHARGES & TIMELINES
  if (
    query.includes("delivery") ||
    query.includes("shipping") ||
    query.includes("charge") ||
    query.includes("cost") ||
    query.includes("dhaka") ||
    query.includes("chittagong") ||
    query.includes("sylhet") ||
    query.includes("outside") ||
    query.includes("how long")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Here are our delivery terms across Bangladesh:\n\n📍 Inside Dhaka City: ৳70 (Delivered within 24 to 48 hours)\n📍 Outside Dhaka (All 63 Districts): ৳130 (Delivered within 2 to 4 business days)\n\nWe deliver via top courier partners with Cash on Delivery available at your doorstep.",
      actionLink: {
        label: "Read Shipping Policy",
        url: "/shipping-policy",
      },
      quickReplies: ["💵 Cash on Delivery", "📦 Track Order", "👞 Shop Footwear"],
    };
  }

  // 5. PAYMENT METHODS & BKASH / COD
  if (
    query.includes("pay") ||
    query.includes("bkash") ||
    query.includes("nagad") ||
    query.includes("cod") ||
    query.includes("cash on delivery") ||
    query.includes("advance")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "We support the following payment methods:\n\n1. Cash on Delivery (COD) - Inspect parcel box upon rider arrival.\n2. bKash - Instant merchant transfer.\n3. Nagad - Digital wallet checkout.\n\nNo mandatory full advance payment required for regular ready-stock shoes!",
      quickReplies: ["🚚 Delivery Charges", "👞 Shop Collection", "💬 WhatsApp Us"],
    };
  }

  // 6. RETURN & EXCHANGE POLICY
  if (
    query.includes("return") ||
    query.includes("exchange") ||
    query.includes("replace") ||
    query.includes("refund") ||
    query.includes("damaged")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "We provide a 7-day hassle-free size exchange guarantee! If your new pair feels snug or loose indoors, contact us on WhatsApp with your Order ID and we will coordinate an exchange courier right to your door.",
      actionLink: {
        label: "View Return Policy",
        url: "/return-policy",
      },
      quickReplies: ["👟 Size Guide", "💬 WhatsApp Exchange", "👞 Browse Shoes"],
    };
  }

  // 7. LEATHER AUTHENTICITY & CARE
  if (
    query.includes("genuine") ||
    query.includes("real leather") ||
    query.includes("leather") ||
    query.includes("material") ||
    query.includes("cowhide") ||
    query.includes("care") ||
    query.includes("polish") ||
    query.includes("waterproof")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Every shoe is constructed using real cowhide leathers (pull-up leather, top-grain calfskin, and supple milled cowhide) sourced and crafted in Bangladesh.\n\nCare tip: Clean with a dry cotton cloth and apply neutral shoe cream once every fortnight. Keep away from prolonged monsoon soak.",
      quickReplies: ["👞 Shop Oxfords", "👞 Shop Boots", "👟 Sizing Advice"],
    };
  }

  // 8. LOAFERS RECOMMENDATIONS
  if (query.includes("loafer") || query.includes("penny") || query.includes("tassel")) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Our loafers are legendary for their memory latex insole and zero-slip TPR soles. Here are our top loafer styles:",
      productCards: [
        {
          name: "Classic Brown Leather Loafer",
          slug: "classic-brown-leather-loafer",
          price: "৳2,490",
          image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
          category: "Loafers",
        },
        {
          name: "Artisan Tassel Loafer Oxblood",
          slug: "artisan-tassel-loafer-oxblood",
          price: "৳3,250",
          image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop",
          category: "Loafers",
        },
      ],
      actionLink: {
        label: "View All Loafers",
        url: "/category/loafers",
      },
      quickReplies: ["👟 Size 42 Availability", "🚚 Delivery Charges", "👞 Formal Oxfords"],
    };
  }

  // 9. FORMAL / OXFORDS / DERBY
  if (
    query.includes("formal") ||
    query.includes("oxford") ||
    query.includes("derby") ||
    query.includes("office") ||
    query.includes("wedding")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "For boardrooms, formal events, and weddings, our cap-toe Oxfords provide sleek closed-lacing and structured elegance:",
      productCards: [
        {
          name: "Executive Cap-Toe Oxford Noir",
          slug: "executive-cap-toe-oxford-noir",
          price: "৳3,450",
          image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop",
          category: "Formal",
        },
      ],
      actionLink: {
        label: "Explore Formal Collection",
        url: "/category/formal",
      },
      quickReplies: ["👞 Loafers", "👟 Size Guide", "💬 WhatsApp Order"],
    };
  }

  // 10. BOOTS
  if (query.includes("boot") || query.includes("chelsea")) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Built with heavy pull-up cowhide and rugged commando soles, our Chelsea boots get better with age:",
      productCards: [
        {
          name: "Heritage Chelsea Leather Boot",
          slug: "heritage-chelsea-leather-boot",
          price: "৳4,790",
          image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
          category: "Boots",
        },
      ],
      actionLink: {
        label: "Shop Boots Collection",
        url: "/category/boots",
      },
      quickReplies: ["🚚 Delivery Time", "👟 Size Guide", "👞 Casual Shoes"],
    };
  }

  // 11. COUPONS & DISCOUNTS
  if (
    query.includes("coupon") ||
    query.includes("discount") ||
    query.includes("offer") ||
    query.includes("promo") ||
    query.includes("voucher")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "You can use code PAPPU10 at checkout to receive 10% OFF your order (minimum purchase ৳2,000)! Or WELCOME200 for ৳200 flat discount on orders over ৳1,500.",
      quickReplies: ["👞 Shop Now", "🚚 Delivery Charges", "👟 Sizing Advice"],
    };
  }

  // 12. HUMAN AGENT / WHATSAPP / CONTACT
  if (
    query.includes("human") ||
    query.includes("agent") ||
    query.includes("whatsapp") ||
    query.includes("call") ||
    query.includes("person") ||
    query.includes("custom")
  ) {
    return {
      id,
      sender: "bot",
      timestamp,
      text: "Our workshop team is available daily from 10:00 AM to 10:00 PM on WhatsApp at +880 1711-234567. We can assist with custom requests, sizing photos, or order updates!",
      actionLink: {
        label: "Open WhatsApp Chat Now",
        url: "https://wa.me/8801711234567?text=Hello%20Pappu%20Leather%20Craft%2C%20I%20need%20assistance.",
        external: true,
      },
      quickReplies: ["📞 Call Hotline", "📦 Track Order", "👞 Browse Catalog"],
    };
  }

  // 13. DEFAULT / FALLBACK
  return {
    id,
    sender: "bot",
    timestamp,
    text: "I want to make sure you get exact answers. What would you like help with?",
    quickReplies: [
      "👞 Best Sellers",
      "👟 Size Guide & Fit",
      "🚚 Delivery Fee & Times",
      "📦 Track My Order",
      "💬 Connect to WhatsApp",
    ],
  };
}
