import { type NextRequest, NextResponse } from "next/server";
import { getItemsCount } from "@/lib/data-service";

export async function GET(request: NextRequest) {
  // Await searchParams before accessing properties
  const searchParams = await request.nextUrl.searchParams;
  const category = searchParams.get("category");

  try {
    const count = await getItemsCount(category || undefined);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch item count" },
      { status: 500 }
    );
  }
}
