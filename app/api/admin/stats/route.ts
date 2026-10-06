import { NextResponse } from "next/server";
import { getOrders, getProducts, getCategories } from "@/lib/db";
import { getSessionUser, getAllUsers } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Admin authorization required" }, { status: 403 });
    }

    const [orders, products, categories, users] = await Promise.all([
      getOrders(),
      getProducts(),
      getCategories(),
      getAllUsers(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const today = new Date().toISOString().split("T")[0];
    const todayRevenue = orders
      .filter((o) => o.createdAt.startsWith(today))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "confirmed").length;

    // Low stock variants (stock <= 3)
    const lowStockProducts: { product: string; size: string | number; stock: number }[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock <= 3) {
          lowStockProducts.push({
            product: p.name,
            size: v.size,
            stock: v.stock,
          });
        }
      });
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalCategories: categories.length,
        totalCustomers: users.filter((u) => u.role === "customer").length,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 8),
        recentOrders: orders.slice(0, 6),
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to generate analytics stats", error: (err as Error).message },
      { status: 500 }
    );
  }
}
