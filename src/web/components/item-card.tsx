import Link from "next/link";
import { Star } from "lucide-react";
import type { Item } from "@/lib/items";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { generateColorFromString, getCategoryIcon } from "@/lib/color-utils";
import { getIconByName } from "@/lib/icon-utils";

// Helper function to safely format ratings
function formatRating(rating: any): string {
  // Convert to number if it's not already
  const numRating = typeof rating === "number" ? rating : Number(rating);

  // Check if it's a valid number
  return !isNaN(numRating) ? numRating.toFixed(1) : "0.0";
}

export default function ItemCard({ item }: { item: Item }) {
  const bgColor = generateColorFromString(item.main_category);
  const iconName = getCategoryIcon(item.main_category);

  // Get the icon component safely
  const IconComponent = getIconByName(iconName);

  // Ensure rating values are numbers
  const averageRating =
    typeof item.average_rating === "number"
      ? item.average_rating
      : Number(item.average_rating);
  const ratingNumber =
    typeof item.rating_number === "number"
      ? item.rating_number
      : Number(item.rating_number);

  return (
    <Link href={`/items/${item.item_index}`} scroll={true}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div
          className="h-24 relative flex items-center justify-center p-4"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_60%)]"></div>
          <IconComponent className="h-10 w-10 text-white" />
        </div>
        <CardContent className="p-4 pt-6">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            {item.main_category}
          </div>
          <h3 className="font-medium line-clamp-2 mb-2">{item.title}</h3>

          <div className="flex items-center">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < averageRating
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              ({ratingNumber})
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: `${bgColor}30` }}
          >
            #{item.item_index}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
