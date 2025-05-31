import { redirect } from "next/navigation";
import { getUserReviews } from "@/lib/reviews";
import {
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
} from "@/lib/recommendations";
import { getUser } from "@/lib/auth";
import ItemCard from "@/components/item-card";
import UserReviewsList from "@/components/user-reviews-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchItemsByIndexes } from "@/lib/direct-db-queries";
import { isValidReview, castToReview } from "@/lib/reviews";
import { isValidItem, castToItem } from "@/lib/items";
import type { Item } from "@/lib/items";
import type { Review } from "@/lib/reviews";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch reviews and recommendations
  const [reviewsData, collaborativeRecs, contentBasedRecs] = await Promise.all([
    getUserReviews(user.user_index),
    getCollaborativeRecommendations(user.user_index),
    getContentBasedRecommendations(user.user_index),
  ]);

  // Ensure reviews are of the correct type by filtering and casting
  const reviews: Review[] = Array.isArray(reviewsData)
    ? reviewsData
        .filter((review) => review && typeof review === "object")
        .map((review) =>
          isValidReview(review) ? review : castToReview(review)
        )
    : [];

  // Ensure recommendations are of the correct type
  const processItems = (data: any[]): Item[] =>
    Array.isArray(data)
      ? data
          .filter(
            (item) => item && typeof item === "object" && "item_index" in item
          )
          .map((item) => (isValidItem(item) ? item : castToItem(item)))
      : [];

  const collaborativeRecommendations = processItems(collaborativeRecs);
  const contentBasedRecommendations = processItems(contentBasedRecs);

  // If reviews exist but don't have item data, fetch the items directly
  let processedReviews = [...reviews];
  if (
    processedReviews.length > 0 &&
    (!processedReviews[0].item || !processedReviews[0].item?.main_category)
  ) {
    // Get all unique item indexes from reviews
    const itemIndexes = [
      ...new Set(
        processedReviews.map((review) => {
          // Ensure review has item_index property
          return typeof review === "object" && "item_index" in review
            ? review.item_index
            : null;
        })
      ),
    ];

    try {
      // Fetch items directly from the database
      const itemsMap = await fetchItemsByIndexes(itemIndexes);

      // Add the item data to each review
      processedReviews = processedReviews.map((review) => {
        const itemIndex =
          typeof review.item_index === "number" ? review.item_index : null;
        const item = itemIndex !== null ? itemsMap[itemIndex] || null : null;

        return {
          ...review,
          item,
        };
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              <p>
                User ID:{" "}
                <span className="font-medium text-foreground">
                  {user.user_index}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="collaborative">
          <TabsList className="mb-4">
            <TabsTrigger value="collaborative">
              Your Collaborative Recommendations
            </TabsTrigger>
            <TabsTrigger value="content-based">
              Your Content-Based Recommendations
            </TabsTrigger>
            <TabsTrigger value="reviews">Your Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="collaborative">
            {collaborativeRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collaborativeRecommendations.map((item) => (
                  <ItemCard key={item.item_index} item={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    No collaborative recommendations found.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content-based">
            {contentBasedRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {contentBasedRecommendations.map((item) => (
                  <ItemCard key={item.item_index} item={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    No content-based recommendations found.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <UserReviewsList reviews={processedReviews} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
