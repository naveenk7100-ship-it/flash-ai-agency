import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CustomerReview } from "@/lib/types";

export async function GET() {
  try {
    const reviews = await db.getReviews(true);
    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reviewerName, company, role, rating, reviewText } = body;

    // Strict validation
    if (!reviewerName || !company || !reviewText) {
      return NextResponse.json(
        { success: false, error: "Reviewer name, company, and review text are required." },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a valid number between 1 and 5." },
        { status: 400 }
      );
    }

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reviewerName: String(reviewerName).trim(),
      company: String(company).trim(),
      role: role ? String(role).trim() : undefined,
      rating: numRating,
      reviewText: String(reviewText).trim(),
      status: "pending", // Always pending until authorized by admin!
      date: new Date().toISOString(),
      verifiedClient: false
    };

    await db.saveReview(newReview);

    return NextResponse.json({
      success: true,
      message: "Review submitted for verification.",
      review: newReview
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
