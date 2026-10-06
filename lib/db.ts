import clientPromise from "./mongodb";
import {
  initialProducts,
  initialCategories,
  initialCoupons,
  initialDeliveryZones,
  initialBanners,
  initialFAQs,
  initialSettings,
  initialAdminUser,
} from "./seed-data";
import {
  Product,
  Category,
  Order,
  User,
  Review,
  Coupon,
  DeliveryZone,
  Banner,
  FAQItem,
  SiteSettings,
  InventoryLog,
} from "@/types";

// In-memory persistent state (persists across API calls in the Node process)
const memoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  orders: [] as Order[],
  users: [initialAdminUser] as User[],
  reviews: [] as Review[],
  coupons: [...initialCoupons],
  deliveryZones: [...initialDeliveryZones],
  banners: [...initialBanners],
  faqs: [...initialFAQs],
  settings: { ...initialSettings },
  inventoryLogs: [] as InventoryLog[],
};

// Database Name helper
const DB_NAME = process.env.MONGODB_DB_NAME || "pappu_leather_craft";

async function getMongoDb() {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      return client.db(DB_NAME);
    } catch (e) {
      console.warn("MongoDB connection fallback to memory store:", e);
      return null;
    }
  }
  return null;
}

// ---------------- PRODUCTS ----------------
export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number | string;
  sort?: string;
}): Promise<Product[]> {
  const db = await getMongoDb();
  let list: Product[] = [];

  if (db) {
    try {
      const query: Record<string, unknown> = { isActive: true };
      if (options?.categorySlug) query.categorySlug = options.categorySlug;
      if (options?.isFeatured) query.isFeatured = true;
      if (options?.isBestSeller) query.isBestSeller = true;
      if (options?.isNewArrival) query.isNewArrival = true;
      if (options?.isOnSale) query.isOnSale = true;
      if (options?.search) {
        query.$or = [
          { name: { $regex: options.search, $options: "i" } },
          { description: { $regex: options.search, $options: "i" } },
          { material: { $regex: options.search, $options: "i" } },
          { sku: { $regex: options.search, $options: "i" } },
        ];
      }
      const mongoDocs = await db.collection("products").find(query).toArray();
      if (mongoDocs.length > 0) {
        list = mongoDocs.map((doc) => ({ ...doc, _id: doc._id.toString() })) as unknown as Product[];
      } else {
        list = memoryStore.products;
      }
    } catch {
      list = memoryStore.products;
    }
  } else {
    list = memoryStore.products;
  }

  // Filter in memory for any fine-grained options
  let result = list.filter((p) => p.isActive);

  if (options?.categorySlug) {
    result = result.filter(
      (p) => p.categorySlug?.toLowerCase() === options.categorySlug?.toLowerCase()
    );
  }
  if (options?.isFeatured) result = result.filter((p) => p.isFeatured);
  if (options?.isBestSeller) result = result.filter((p) => p.isBestSeller);
  if (options?.isNewArrival) result = result.filter((p) => p.isNewArrival);
  if (options?.isOnSale) result = result.filter((p) => p.isOnSale || (p.discountPrice && p.discountPrice < p.price));

  if (options?.search) {
    const q = options.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (options?.minPrice !== undefined) {
    result = result.filter((p) => (p.discountPrice || p.price) >= (options.minPrice || 0));
  }
  if (options?.maxPrice !== undefined) {
    result = result.filter((p) => (p.discountPrice || p.price) <= (options.maxPrice || Infinity));
  }

  if (options?.size !== undefined && options.size !== "") {
    result = result.filter((p) =>
      p.variants.some((v) => String(v.size) === String(options.size) && v.stock > 0)
    );
  }

  // Sort
  if (options?.sort) {
    switch (options.sort) {
      case "price-low":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-high":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection("products").findOne({ slug });
      if (doc) return { ...doc, _id: doc._id.toString() } as unknown as Product;
    } catch {}
  }
  const found = memoryStore.products.find((p) => p.slug === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection("products").findOne({ _id: id as unknown as never });
      if (doc) return { ...doc, _id: doc._id.toString() } as unknown as Product;
    } catch {}
  }
  const found = memoryStore.products.find((p) => p._id === id);
  return found || null;
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const db = await getMongoDb();
  const now = new Date().toISOString();

  if (productData._id) {
    // update
    const idx = memoryStore.products.findIndex((p) => p._id === productData._id);
    const updated: Product = {
      ...(idx >= 0 ? memoryStore.products[idx] : ({} as Product)),
      ...productData,
      updatedAt: now,
    } as Product;

    if (idx >= 0) memoryStore.products[idx] = updated;
    else memoryStore.products.unshift(updated);

    if (db) {
      try {
        await db.collection("products").updateOne(
          { _id: productData._id as unknown as never },
          { $set: { ...productData, updatedAt: now } },
          { upsert: true }
        );
      } catch {}
    }
    return updated;
  } else {
    // create
    const newId = "prod-" + Date.now();
    const created: Product = {
      _id: newId,
      name: productData.name || "Untitled Product",
      slug: productData.slug || "prod-" + Date.now(),
      sku: productData.sku || `PLC-${Date.now().toString().slice(-6)}`,
      categoryId: productData.categoryId || "cat-loafers",
      categoryName: productData.categoryName || "Loafers",
      categorySlug: productData.categorySlug || "loafers",
      price: productData.price || 0,
      discountPrice: productData.discountPrice,
      costPrice: productData.costPrice,
      material: productData.material || "Leather",
      colors: productData.colors || ["Black"],
      images: productData.images || [],
      variants: productData.variants || [],
      tags: productData.tags || [],
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 0,
      isFeatured: !!productData.isFeatured,
      isBestSeller: !!productData.isBestSeller,
      isNewArrival: !!productData.isNewArrival,
      isOnSale: !!productData.isOnSale,
      isActive: productData.isActive !== false,
      description: productData.description || "",
      shortDescription: productData.shortDescription || "",
      createdAt: now,
      updatedAt: now,
    };

    memoryStore.products.unshift(created);
    if (db) {
      try {
        await db.collection("products").insertOne(created as unknown as never);
      } catch {}
    }
    return created;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getMongoDb();
  memoryStore.products = memoryStore.products.filter((p) => p._id !== id);
  if (db) {
    try {
      await db.collection("products").deleteOne({ _id: id as unknown as never });
    } catch {}
  }
  return true;
}

// ---------------- INVENTORY ----------------
export async function updateProductStock(
  productId: string,
  variantId: string,
  change: number,
  reason: string,
  admin = "System"
): Promise<{ success: boolean; newStock?: number; error?: string }> {
  const product = await getProductById(productId);
  if (!product) return { success: false, error: "Product not found" };

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return { success: false, error: "Variant not found" };

  const previousStock = variant.stock;
  const newStock = previousStock + change;

  if (newStock < 0) {
    return { success: false, error: "Insufficient stock available" };
  }

  variant.stock = newStock;
  await saveProduct(product);

  // Record inventory log
  const log: InventoryLog = {
    _id: "log-" + Date.now() + Math.random().toString(36).substring(7),
    productId: product._id,
    productName: product.name,
    variantId: variant.id,
    size: variant.size,
    previousStock,
    change,
    newStock,
    reason,
    admin,
    timestamp: new Date().toISOString(),
  };

  memoryStore.inventoryLogs.unshift(log);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("inventory_logs").insertOne(log as unknown as never);
    } catch {}
  }

  return { success: true, newStock };
}

export async function getInventoryLogs(): Promise<InventoryLog[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const logs = await db.collection("inventory_logs").find().sort({ timestamp: -1 }).toArray();
      if (logs.length > 0) return logs.map((l) => ({ ...l, _id: l._id.toString() })) as unknown as InventoryLog[];
    } catch {}
  }
  return memoryStore.inventoryLogs;
}

// ---------------- ORDERS ----------------
export async function getOrders(userId?: string): Promise<Order[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query = userId ? { userId } : {};
      const docs = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray();
      if (docs.length > 0) return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as Order[];
    } catch {}
  }
  if (userId) return memoryStore.orders.filter((o) => o.userId === userId);
  return memoryStore.orders;
}

export async function getOrderByNumber(orderNumber: string, phone?: string): Promise<Order | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query: Record<string, unknown> = {
        orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, "i") },
      };
      if (phone) {
        query.customerPhone = { $regex: new RegExp(phone.trim().slice(-10), "i") };
      }
      const doc = await db.collection("orders").findOne(query);
      if (doc) return { ...doc, _id: doc._id.toString() } as unknown as Order;
    } catch {}
  }

  const order = memoryStore.orders.find((o) => {
    const matchesNumber = o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase();
    if (!matchesNumber) return false;
    if (phone) {
      return o.customerPhone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-10));
    }
    return true;
  });
  return order || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection("orders").findOne({ _id: id as unknown as never });
      if (doc) return { ...doc, _id: doc._id.toString() } as unknown as Order;
    } catch {}
  }
  return memoryStore.orders.find((o) => o._id === id) || null;
}

export async function createOrder(orderData: Omit<Order, "_id">): Promise<Order> {
  // 1. Atomic Stock Decrement Validation
  for (const item of orderData.items) {
    const stockRes = await updateProductStock(
      item.productId,
      item.variantId,
      -item.quantity,
      `Order placed: ${orderData.orderNumber}`,
      "Customer Checkout"
    );
    if (!stockRes.success) {
      throw new Error(`Insufficient stock for ${item.name} (Size: ${item.size}).`);
    }
  }

  const newId = "ord-" + Date.now();
  const order: Order = {
    ...orderData,
    _id: newId,
  };

  memoryStore.orders.unshift(order);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("orders").insertOne(order as unknown as never);
    } catch {}
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["orderStatus"],
  note?: string,
  changedBy = "Admin",
  trackingNumber?: string
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({
    status,
    note: note || `Order status updated to ${status}`,
    changedBy,
    timestamp: new Date().toISOString(),
  });
  order.updatedAt = new Date().toISOString();

  const idx = memoryStore.orders.findIndex((o) => o._id === orderId);
  if (idx >= 0) memoryStore.orders[idx] = order;

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("orders").updateOne(
        { _id: orderId as unknown as never },
        {
          $set: {
            orderStatus: status,
            trackingNumber: order.trackingNumber,
            statusHistory: order.statusHistory,
            updatedAt: order.updatedAt,
          },
        }
      );
    } catch {}
  }

  return order;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const docs = await db.collection("categories").find({ isActive: true }).toArray();
      if (docs.length > 0) return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as Category[];
    } catch {}
  }
  return memoryStore.categories;
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const now = new Date().toISOString();
  if (categoryData._id) {
    const idx = memoryStore.categories.findIndex((c) => c._id === categoryData._id);
    const updated = {
      ...(idx >= 0 ? memoryStore.categories[idx] : ({} as Category)),
      ...categoryData,
    } as Category;
    if (idx >= 0) memoryStore.categories[idx] = updated;
    else memoryStore.categories.push(updated);
    return updated;
  } else {
    const created: Category = {
      _id: "cat-" + Date.now(),
      name: categoryData.name || "New Category",
      slug: categoryData.slug || "cat-" + Date.now(),
      description: categoryData.description || "",
      image: categoryData.image || "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200",
      isActive: true,
      createdAt: now,
    };
    memoryStore.categories.push(created);
    return created;
  }
}

// ---------------- COUPONS ----------------
export async function validateCoupon(code: string, subtotal: number): Promise<{
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  message?: string;
}> {
  const coupon = memoryStore.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }

  const now = new Date();
  if (new Date(coupon.expiryDate) < now) {
    return { valid: false, message: "This coupon code has expired." };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its maximum usage limit." };
  }

  if (subtotal < coupon.minimumPurchase) {
    return {
      valid: false,
      message: `Minimum order amount for this coupon is ৳${coupon.minimumPurchase}.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else {
    discount = coupon.value;
  }

  return { valid: true, coupon, discountAmount: discount, message: "Coupon applied successfully!" };
}

export async function getCoupons(): Promise<Coupon[]> {
  return memoryStore.coupons;
}

// ---------------- SETTINGS & BANNERS & FAQS ----------------
export async function getSettings(): Promise<SiteSettings> {
  return memoryStore.settings;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  memoryStore.settings = { ...memoryStore.settings, ...settings };
  return memoryStore.settings;
}

export async function getBanners(): Promise<Banner[]> {
  return memoryStore.banners;
}

export async function getFAQs(): Promise<FAQItem[]> {
  return memoryStore.faqs;
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  return memoryStore.deliveryZones;
}

// ---------------- REVIEWS ----------------
export async function getReviews(productId?: string): Promise<Review[]> {
  if (productId) {
    return memoryStore.reviews.filter((r) => r.productId === productId && r.isApproved);
  }
  return memoryStore.reviews;
}

export async function addReview(reviewData: Omit<Review, "_id" | "createdAt">): Promise<Review> {
  const review: Review = {
    ...reviewData,
    _id: "rev-" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  memoryStore.reviews.unshift(review);
  return review;
}

export async function moderateReview(reviewId: string, approve: boolean): Promise<boolean> {
  const r = memoryStore.reviews.find((rev) => rev._id === reviewId);
  if (r) {
    r.isApproved = approve;
    return true;
  }
  return false;
}
