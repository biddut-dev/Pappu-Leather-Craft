import { NextResponse } from "next/server";
import { getCategories, saveCategory } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch categories", error: (err as Error).message },
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

    const body = await request.json();
    const created = await saveCategory(body);
    return NextResponse.json({ success: true, category: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to save category", error: (err as Error).message },
      { status: 500 }
    );
  }
}
