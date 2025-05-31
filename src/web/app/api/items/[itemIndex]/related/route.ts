import { type NextRequest, NextResponse } from "next/server";
import { getRelatedItems } from "@/lib/data-service";

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
    const relatedItems = await getRelatedItems(itemIndex);
    return NextResponse.json(relatedItems);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related items" },
      { status: 500 }
    );
  }
}
