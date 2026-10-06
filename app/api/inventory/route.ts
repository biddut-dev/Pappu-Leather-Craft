import { NextResponse } from "next/server";
import { getInventoryLogs, updateProductStock } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Admin authorization required" }, { status: 403 });
    }

    const logs = await getInventoryLogs();
    return NextResponse.json({ success: true, logs });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch inventory logs", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Admin authorization required" }, { status: 403 });
    }

    const { productId, variantId, change, reason } = await request.json();
    if (!productId || !variantId || change === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const res = await updateProductStock(
      productId,
      variantId,
      Number(change),
      reason || "Manual admin adjustment",
      user.name
    );

    if (!res.success) {
      return NextResponse.json({ message: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, newStock: res.newStock });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Stock adjustment failed", error: (err as Error).message },
      { status: 500 }
    );
  }
}
