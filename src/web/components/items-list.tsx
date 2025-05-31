import { getItems } from "@/lib/items";
import ItemCard from "./item-card";
import { isValidItem, castToItem } from "@/lib/items";
import type { Item } from "@/lib/items";

export default async function ItemsList({
  page = 1,
  limit = 12,
  category,
}: {
  page: number;
  limit: number;
  category?: string;
}) {
  const itemsData = await getItems(page, limit, category);

  // Filter to ensure only valid items are used and cast others
  const items: Item[] = itemsData
    .filter(
      (item) =>
        isValidItem(item) ||
        (item && typeof item === "object" && "item_index" in item)
    )
    .map((item) => (isValidItem(item) ? item : castToItem(item)));

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="text-muted-foreground">
          Try changing your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item.item_index} item={item} />
      ))}
    </div>
  );
}
