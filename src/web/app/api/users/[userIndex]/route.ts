import { type NextRequest, NextResponse } from "next/server";
import { getUserByIndex } from "@/lib/data-service";

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
    const user = await getUserByIndex(userIndex);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
