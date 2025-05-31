import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUser } from "@/lib/auth";
import {
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
} from "@/lib/recommendations";
import ItemCard from "@/components/item-card";
import LoadingItems from "@/components/loading-items";
import { isValidItem, castToItem } from "@/lib/items";
import type { Item } from "@/lib/items";

export default async function UserRecommendations() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recommended For You</h2>
        <Link
          href="/profile"
          className="flex items-center text-primary hover:underline"
          scroll={true}
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <Suspense fallback={<LoadingItems count={4} />}>
        <RecommendationsGroup userIndex={user.user_index} />
      </Suspense>
    </section>
  );
}

async function RecommendationsGroup({ userIndex }: { userIndex: number }) {
  const [collaborativeData, contentBasedData] = await Promise.all([
    getCollaborativeRecommendations(userIndex),
    getContentBasedRecommendations(userIndex),
  ]);

  const toItems = (data: any[]): Item[] =>
    data
      .filter(
        (item) =>
          isValidItem(item) ||
          (item && typeof item === "object" && "item_index" in item)
      )
      .map((item) => (isValidItem(item) ? item : castToItem(item)));

  const collaborative = toItems(collaborativeData);
  const contentBased = toItems(contentBasedData);

  return (
    <div className="space-y-10">
      <RecommendationSection
        title="Collaborative Recommendations"
        items={collaborative}
      />
      <RecommendationSection
        title="Content-Based Recommendations"
        items={contentBased}
      />
    </div>
  );
}

function RecommendationSection({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.item_index} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
}
