import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone") || undefined;

    if (!orderNumber) {
      return NextResponse.json(
        { message: "Please enter an order number." },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderNumber, phone);

    if (!order) {
      return NextResponse.json(
        { message: "No matching order found. Please verify your order number and phone." },
        { status: 404 }
      );
    }

    // Return safe tracking info without exposing sensitive internal notes
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone.replace(/.(?=.{4})/g, "*"), // masked phone
        orderStatus: order.orderStatus,
        deliveryZone: order.deliveryZone,
        trackingNumber: order.trackingNumber,
        statusHistory: order.statusHistory,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Tracking lookup failed", error: (err as Error).message },
      { status: 500 }
    );
  }
}
