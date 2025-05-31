import { connectToDatabase } from "./mongodb";

export async function fetchItemsByIndexes(itemIndexes: (number | null)[]) {
  try {
    const { db } = await connectToDatabase();

    // Filter out null values
    const validIndexes = itemIndexes.filter(
      (index): index is number => typeof index === "number" && !isNaN(index)
    );

    // Query the database for items with the given indexes
    const items = await db
      .collection("items")
      .find({ item_index: { $in: validIndexes } })
      .toArray();

    // Create a map for easy lookup
    const itemsMap: Record<number, any> = {};
    items.forEach((item) => {
      if (item && typeof item.item_index === "number") {
        itemsMap[item.item_index] = item;
      }
    });

    return itemsMap;
  } catch (error) {
    console.error("Error in direct database query:", error);
    return {};
  }
}
