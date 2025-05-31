import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedItems } from "@/lib/items";
import ItemCard from "@/components/item-card";
import UserRecommendations from "@/components/user-recommendations";
import LoadingItems from "@/components/loading-items";
import { isValidItem, castToItem } from "@/lib/items";
import type { Item } from "@/lib/items";

export default async function Home() {
  const featuredItemsData = await getFeaturedItems();

  // Filter to ensure only valid items are used and cast others
  const featuredItems: Item[] = featuredItemsData
    .filter(
      (item) =>
        isValidItem(item) ||
        (item && typeof item === "object" && "item_index" in item)
    )
    .map((item) => (isValidItem(item) ? item : castToItem(item)));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Amazing Products
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Shop our curated collection of high-quality items with
                personalized recommendations just for you.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/items" scroll={true}>
                  <Button size="lg">
                    Shop Now
                    <ShoppingBag className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Link
            href="/items"
            className="flex items-center text-primary hover:underline"
            scroll={true}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <Suspense fallback={<LoadingItems count={4} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.item_index} item={item} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* User Recommendations */}
      <UserRecommendations />
    </div>
  );
}
