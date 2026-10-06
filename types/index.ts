export interface ProductVariant {
  id: string;
  size: number | string; // e.g. 40, 41, 42, 43, 44, 45, or "Standard"
  color: string; // e.g. "Cognac Brown", "Jet Black", "Oxblood"
  sku: string;
  stock: number;
  reservedStock?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  material: string; // e.g. "Full-Grain Cowhide Leather"
  colors: string[];
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  isActive: boolean;
  sole?: string;
  fit?: string;
  careInstructions?: string[];
  deliveryInfo?: string;
  returnInfo?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string | null;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  size: number | string;
  color: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface UserAddress {
  id: string;
  isDefault?: boolean;
  label: string; // "Home", "Office"
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | "superadmin" | "staff";
  avatar?: string;
  addresses?: UserAddress[];
  isActive: boolean;
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: number | string;
  color: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface StatusHistory {
  status: OrderStatus;
  note?: string;
  changedBy: string;
  timestamp: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    division: string;
    district: string;
    area: string;
    fullAddress: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryZone: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  customerNote?: string;
  adminNote?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  orderId?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit?: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface DeliveryZone {
  _id: string;
  name: string;
  fee: number;
  estimatedDelivery: string;
  areas: string[];
  isActive: boolean;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaUrl: string;
  badge?: string;
  isActive: boolean;
  order: number;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: "Ordering" | "Payment" | "Delivery" | "Returns" | "Sizing" | "Products";
  order: number;
}

export interface InventoryLog {
  _id: string;
  productId: string;
  productName: string;
  variantId: string;
  size: number | string;
  previousStock: number;
  change: number;
  newStock: number;
  reason: string;
  admin: string;
  timestamp: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  variantInfo: string;
  type: "return" | "exchange" | "refund";
  reason: string;
  description: string;
  images?: string[];
  status: "pending" | "approved" | "rejected" | "received" | "completed";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  announcementBarText: string;
  announcementBarActive: boolean;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  storyHeading: string;
  storyBody: string;
}
