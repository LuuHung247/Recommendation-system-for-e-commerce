import { type NextRequest, NextResponse } from "next/server";
import { getContentBasedRecommendations } from "@/lib/data-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { userIndex: string } }
) {
  const userIndex = Number.parseInt(params.userIndex);

  if (isNaN(userIndex)) {
    return NextResponse.json({ error: "Invalid user index" }, { status: 400 });
  }

  try {
    const recommendations = await getContentBasedRecommendations(userIndex);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content-based recommendations" },
      { status: 500 }
    );
  }
}
