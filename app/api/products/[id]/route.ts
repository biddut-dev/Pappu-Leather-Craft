import { NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Error fetching product", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await saveProduct({ ...body, _id: id });
    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Error updating product", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Error deleting product", error: (err as Error).message },
      { status: 500 }
    );
  }
}
