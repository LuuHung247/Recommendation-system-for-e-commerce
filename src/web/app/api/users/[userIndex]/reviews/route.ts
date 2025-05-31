import { type NextRequest, NextResponse } from "next/server";
import { getUserReviews } from "@/lib/data-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { userIndex: string } }
) {
  // Await params before accessing properties
  const resolvedParams = await params;
  const userIndex = Number.parseInt(resolvedParams.userIndex);

  if (isNaN(userIndex)) {
    return NextResponse.json({ error: "Invalid user index" }, { status: 400 });
  }

  try {
    const reviews = await getUserReviews(userIndex);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reviews" },
      { status: 500 }
    );
  }
}
