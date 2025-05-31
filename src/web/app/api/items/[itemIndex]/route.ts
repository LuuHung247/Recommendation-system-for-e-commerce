import { type NextRequest, NextResponse } from "next/server";
import { getItemByIndex } from "@/lib/data-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { itemIndex: string } }
) {
  // Await params before accessing properties
  const resolvedParams = await params;
  const itemIndex = Number.parseInt(resolvedParams.itemIndex);

  if (isNaN(itemIndex)) {
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
