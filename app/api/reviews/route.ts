import { NextResponse } from "next/server";
import { getReviews, addReview, moderateReview } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const reviews = await getReviews(productId);
    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch reviews", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();

    const { productId, rating, title, comment, orderId } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Please provide a rating and a comment." },
        { status: 400 }
      );
    }

    const newReview = await addReview({
      productId,
      userId: user?._id || "anon-" + Date.now(),
      userName: user?.name || body.userName || "Customer",
      userEmail: user?.email || body.userEmail || "",
      orderId,
      rating: Number(rating),
      title: title || "Verified Review",
      comment,
      images: body.images || [],
      isVerifiedPurchase: !!orderId || !!user,
      isApproved: true, // auto-approve standard reviews or admin can moderate
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to submit review", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ message: "Admin authorization required" }, { status: 403 });
    }

    const { reviewId, approve } = await request.json();
    const success = await moderateReview(reviewId, approve);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Moderation failed", error: (err as Error).message },
      { status: 500 }
    );
  }
}
