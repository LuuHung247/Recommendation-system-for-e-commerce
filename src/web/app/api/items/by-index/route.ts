import { type NextRequest, NextResponse } from "next/server";
import { getItemByIndex } from "@/lib/data-service";

export async function GET(request: NextRequest) {
  // Await searchParams before accessing properties
  const searchParams = await request.nextUrl.searchParams;
  const itemIndex = Number.parseInt(searchParams.get("index") || "0");

  if (isNaN(itemIndex) || itemIndex === 0) {
    return NextResponse.json({ error: "Invalid item index" }, { status: 400 });
  }

  try {
    const item = await getItemByIndex(itemIndex);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}
