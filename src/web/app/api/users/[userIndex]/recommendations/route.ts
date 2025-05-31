import { type NextRequest, NextResponse } from "next/server";
import { getUserRecommendations } from "@/lib/data-service";

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
    const recommendations = await getUserRecommendations(userIndex);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
