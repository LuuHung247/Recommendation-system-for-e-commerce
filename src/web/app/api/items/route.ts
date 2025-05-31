import { type NextRequest, NextResponse } from "next/server";
import { getItems } from "@/lib/data-service";

export async function GET(request: NextRequest) {
  // Await searchParams before accessing properties
  const searchParams = await request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");

  try {
    const items = await getItems(page, limit, category || undefined);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
