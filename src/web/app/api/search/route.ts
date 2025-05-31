import { type NextRequest, NextResponse } from "next/server";
import { searchItems, searchItemsCount } from "@/lib/data-service";

export async function GET(request: NextRequest) {
  // Await searchParams before accessing properties
  const searchParams = await request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "12");

  if (!query) {
    return NextResponse.json({ items: [], count: 0 });
  }

  try {
    const [items, count] = await Promise.all([
      searchItems(query, page, limit),
      searchItemsCount(query),
    ]);

    return NextResponse.json({ items, count });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to search items" },
      { status: 500 }
    );
  }
}
