import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Access check: Admin can view any, user can view own
    if (
      user?.role !== "admin" &&
      user?.role !== "superadmin" &&
      (!user || order.userId !== user._id)
    ) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch order", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, note, trackingNumber } = body;

    const updated = await updateOrderStatus(id, status, note, user.name, trackingNumber);
    if (!updated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to update order", error: (err as Error).message },
      { status: 500 }
    );
  }
}
