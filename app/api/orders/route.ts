import { NextResponse } from "next/server";
import { getOrders, createOrder, validateCoupon, getProductById } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/formatters";
import { OrderItem } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    // If admin, can view all orders. If customer, can only view own orders.
    if (user?.role === "admin" || user?.role === "superadmin") {
      const orders = await getOrders(requestedUserId || undefined);
      return NextResponse.json({ success: true, orders });
    }

    if (user) {
      const orders = await getOrders(user._id);
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json({ message: "Please log in to view orders" }, { status: 401 });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      couponCode,
      deliveryZone,
      paymentMethod,
      customerNote,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress?.fullAddress || !items?.length) {
      return NextResponse.json(
        { message: "Please provide your full name, phone number, address, and cart items." },
        { status: 400 }
      );
    }

    // 1. Server-side re-validation of items, prices, and stock
    let serverSubtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { message: `Size variant not found for ${product.name}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { message: `Only ${variant.stock} left in stock for ${product.name} (Size ${variant.size}).` },
          { status: 400 }
        );
      }

      const realPrice = product.discountPrice || product.price;
      const itemSubtotal = realPrice * item.quantity;
      serverSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product._id,
        variantId: variant.id,
        name: product.name,
        image: product.images[0] || "",
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        price: realPrice,
        subtotal: itemSubtotal,
      });
    }

    // 2. Coupon Validation Server-Side
    let discount = 0;
    if (couponCode) {
      const couponRes = await validateCoupon(couponCode, serverSubtotal);
      if (couponRes.valid && couponRes.discountAmount) {
        discount = couponRes.discountAmount;
      }
    }

    // 3. Delivery Fee
    const isInsideDhaka = deliveryZone === "Inside Dhaka City" || deliveryZone?.toLowerCase().includes("inside");
    const deliveryFee = isInsideDhaka ? 70 : 130;

    const total = Math.max(0, serverSubtotal - discount + deliveryFee);
    const orderNumber = generateOrderNumber();

    const newOrder = await createOrder({
      orderNumber,
      userId: user?._id || undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || "",
      shippingAddress: {
        division: shippingAddress.division || "Dhaka",
        district: shippingAddress.district || "Dhaka",
        area: shippingAddress.area || "",
        fullAddress: shippingAddress.fullAddress.trim(),
      },
      items: validatedItems,
      subtotal: serverSubtotal,
      discount,
      deliveryFee,
      total,
      deliveryZone: isInsideDhaka ? "Inside Dhaka City" : "Outside Dhaka",
      couponCode: discount > 0 ? couponCode : undefined,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
      customerNote: customerNote?.trim() || undefined,
      statusHistory: [
        {
          status: "pending",
          note: "Order placed successfully by customer.",
          changedBy: "Customer",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: (err as Error).message || "Order placement failed." },
      { status: 500 }
    );
  }
}
