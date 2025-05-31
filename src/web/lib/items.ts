import {
  getItems,
  getItemsCount,
  getItemByIndex,
  getFeaturedItems,
  getCategories,
} from "./data-service";
import type { WithId, Document } from "mongodb";

export type Item = {
  _id: string | WithId<Document>["_id"];
  main_category: string;
  title: string;
  average_rating: number | string;
  rating_number: number | string;
  item_index: number;
};

// Type guard to check if an object is a valid Item
export function isValidItem(item: any): item is Item {
  return (
    item &&
    typeof item === "object" &&
    "main_category" in item &&
    typeof item.main_category === "string" &&
    "title" in item &&
    typeof item.title === "string" &&
    "average_rating" in item &&
    (typeof item.average_rating === "number" ||
      typeof item.average_rating === "string") &&
    "rating_number" in item &&
    (typeof item.rating_number === "number" ||
      typeof item.rating_number === "string") &&
    "item_index" in item &&
    typeof item.item_index === "number"
  );
}

// Function to safely cast MongoDB document to Item
export function castToItem(doc: WithId<Document> | any): Item {
  if (isValidItem(doc)) {
    return doc as Item;
  }

  // If it's not a valid item but has the required fields, try to cast it
  if (doc && typeof doc === "object" && "item_index" in doc) {
    return {
      _id: doc._id || "",
      main_category: String(doc.main_category || "Unknown"),
      title: String(doc.title || "Unknown Item"),
      average_rating: doc.average_rating || 0,
      rating_number: doc.rating_number || 0,
      item_index: Number(doc.item_index),
    };
  }

  throw new Error("Cannot cast to Item: Invalid document structure");
}

export {
  getItems,
  getItemsCount,
  getItemByIndex,
  getFeaturedItems,
  getCategories,
};
