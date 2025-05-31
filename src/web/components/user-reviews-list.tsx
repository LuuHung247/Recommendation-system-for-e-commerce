import type React from "react";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import type { Review } from "@/lib/reviews";
import { generateColorFromString, getCategoryIcon } from "@/lib/color-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIconByName } from "@/lib/icon-utils";

// Helper function to safely format ratings
function formatRating(rating: any): string {
  // Convert to number if it's not already
  const numRating = typeof rating === "number" ? rating : Number(rating);

  // Check if it's a valid number
  return !isNaN(numRating) ? numRating.toFixed(1) : "0.0";
}

export default function UserReviewsList({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't reviewed any items yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((review) => {
        // Check if item exists and has the required properties
        const hasValidItem =
          review.item &&
          typeof review.item === "object" &&
          "main_category" in review.item &&
          "title" in review.item;

        // Use a default color for items without category
        const bgColor =
          hasValidItem && review.item?.main_category
            ? generateColorFromString(review.item.main_category)
            : "#6b7280";

        // Use a default icon for items without category
        let IconComponent: React.ComponentType<any> = ShoppingBag;
        if (hasValidItem && review.item?.main_category) {
          const iconName = getCategoryIcon(review.item.main_category);
          IconComponent = getIconByName(iconName);
        }

        // Ensure rating is a number
        const rating =
          typeof review.rating === "number"
            ? review.rating
            : Number(review.rating);

        return (
          <Card
            key={
              typeof review._id === "string"
                ? review._id
                : review._id.toString()
            }
            className="overflow-hidden"
          >
            <div
              className="h-12 flex items-center px-4"
              style={{ backgroundColor: bgColor }}
            >
              <IconComponent className="h-6 w-6 text-white mr-2" />
              <span className="text-white font-medium">
                {hasValidItem && review.item?.main_category
                  ? review.item.main_category
                  : "Product Review"}
              </span>
            </div>
            <CardContent className="p-4">
              {hasValidItem && review.item?.title ? (
                <Link
                  href={`/items/${review.item_index}`}
                  className="hover:underline"
                  scroll={true}
                >
                  <h3 className="font-medium line-clamp-1 mb-2">
                    {review.item.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="font-medium text-muted-foreground mb-2">
                  Product #{review.item_index}
                </h3>
              )}

              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm">
                  {formatRating(review.rating)}
                </span>
              </div>

              {hasValidItem && review.item?.rating_number && (
                <Badge variant="outline" className="text-xs">
                  {review.item?.rating_number}{" "}
                  {review.item?.rating_number == 1 ? " review" : " reviews"}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
