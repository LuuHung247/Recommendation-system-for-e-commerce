import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";
import { getItemByIndex, isValidItem, castToItem } from "@/lib/items";
import { getRelatedItems } from "@/lib/recommendations";
import ItemCard from "@/components/item-card";
import LoadingItems from "@/components/loading-items";
import {
  generateColorFromString,
  getCategoryIcon,
  getDarkerColor,
} from "@/lib/color-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getIconByName } from "@/lib/icon-utils";
import type { Item } from "@/lib/items";

// Helper function to safely format ratings
function formatRating(rating: any): string {
  // Convert to number if it's not already
  const numRating = typeof rating === "number" ? rating : Number(rating);

  // Check if it's a valid number
  return !isNaN(numRating) ? numRating.toFixed(1) : "0.0";
}

type ItemPageProps = {
  params: Promise<{
    itemIndex: string;
  }>;
};

export default async function ItemPage({ params }: ItemPageProps) {
  // Await params before accessing properties
  const resolvedParams = await params;
  const itemIndex = Number.parseInt(resolvedParams.itemIndex);

  if (isNaN(itemIndex)) {
    notFound();
  }

  const itemData = await getItemByIndex(itemIndex);

  if (!itemData) {
    notFound();
  }

  // Ensure we have a valid item
  const item = isValidItem(itemData) ? itemData : castToItem(itemData);

  const bgColor = generateColorFromString(item.main_category);
  const textColor = getDarkerColor(bgColor);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-2">
          <span>{item.main_category}</span> •{" "}
          <span>Product #{item.item_index}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>

        <div className="flex items-center mb-6">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < averageRating
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {formatRating(item.average_rating)} ({ratingNumber} reviews)
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div
            className="rounded-lg p-8 mb-8 relative overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]"></div>
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,_white_0%,_transparent_50%)]"></div>
            <div className="relative flex flex-col items-center justify-center text-white">
              <IconComponent className="h-24 w-24 mb-4" />
              <h2 className="text-xl font-bold text-center">{item.title}</h2>
              <Badge
                className="mt-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                {item.main_category}
              </Badge>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="font-bold">Product Description</h3>
            <p>
              This premium product from our {item.main_category} collection
              offers exceptional quality and value. With an average rating of{" "}
              {formatRating(item.average_rating)} from {ratingNumber} customers,
              it's one of our most popular items.
            </p>
            <p>
              The {item.title} features a sleek design and premium materials,
              making it a perfect addition to your collection. Whether you're a
              professional or enthusiast, this product will exceed your
              expectations.
            </p>
            <h3 className="font-bold">Key Features</h3>
            <ul>
              <li>Premium quality materials and construction</li>
              <li>Designed for optimal performance and durability</li>
              <li>Versatile functionality for various applications</li>
              <li>Backed by positive customer reviews and ratings</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-muted p-6 rounded-lg sticky top-20">
            <h3 className="font-semibold mb-4">Product Information</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{item.main_category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">
                  {formatRating(item.average_rating)}/5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{ratingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product ID</span>
                <span className="font-medium">#{item.item_index}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-green-500" />
                <span>Top rated in {item.main_category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Fast shipping available</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span>Popular among customers</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-1">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          Customers who viewed items in your browsing history also viewed
        </h2>
        <Suspense fallback={<LoadingItems count={4} />}>
          <RelatedItems itemIndex={itemIndex} />
        </Suspense>
      </div>
    </div>
  );
}

async function RelatedItems({ itemIndex }: { itemIndex: number }) {
  const relatedItemsData = await getRelatedItems(itemIndex);

  // Filter to ensure only valid items are used and cast others
  const relatedItems: Item[] = relatedItemsData
    .filter(
      (item) =>
        isValidItem(item) ||
        (item && typeof item === "object" && "item_index" in item)
    )
    .map((item) => (isValidItem(item) ? item : castToItem(item)));

  if (relatedItems.length === 0) {
    return <p className="text-muted-foreground">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedItems.map((item) => (
        <ItemCard key={item.item_index} item={item} />
      ))}
    </div>
  );
}
