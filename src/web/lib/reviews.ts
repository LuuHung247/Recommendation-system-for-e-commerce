import { getUserReviews } from "./data-service";
import type { Item } from "./items";
import { castToItem } from "./items";
import type { WithId, Document } from "mongodb";

export type Review = {
  _id: string | WithId<Document>["_id"];
  user_index: number;
  rating: number | string;
  item_index: number;
  item?: Item | null;
};

// Type guard to check if an object is a valid Review
export function isValidReview(review: any): review is Review {
  return (
    review &&
    typeof review === "object" &&
    "user_index" in review &&
    "rating" in review &&
    "item_index" in review
  );
}

// Function to safely cast MongoDB document to Review
export function castToReview(doc: WithId<Document> | any): Review {
  if (isValidReview(doc)) {
    return doc as Review;
  }

  // If it's not a valid review but has the required fields, try to cast it
  if (doc && typeof doc === "object") {
    return {
      _id: doc._id || "",
      user_index: Number(doc.user_index || 0),
      rating: doc.rating || 0,
      item_index: Number(doc.item_index || 0),
      item: doc.item ? castToItem(doc.item) : null,
    };
  }

  throw new Error("Cannot cast to Review: Invalid document structure");
}

export { getUserReviews };
