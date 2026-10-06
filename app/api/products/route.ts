import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const size = searchParams.get("size") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const isFeatured = searchParams.get("featured") === "true";
    const isBestSeller = searchParams.get("bestseller") === "true";
    const isNewArrival = searchParams.get("newarrivals") === "true";
    const isOnSale = searchParams.get("sale") === "true";

    const products = await getProducts({
      categorySlug,
      search,
      minPrice,
      maxPrice,
      size,
      sort,
      isFeatured: isFeatured || undefined,
      isBestSeller: isBestSeller || undefined,
      isNewArrival: isNewArrival || undefined,
      isOnSale: isOnSale || undefined,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: "Error fetching products", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ message: "Product name and price are required." }, { status: 400 });
    }

    const created = await saveProduct(body);
    return NextResponse.json({ success: true, product: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to create product", error: (err as Error).message },
      { status: 500 }
    );
  }
}
