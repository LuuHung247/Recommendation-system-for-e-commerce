import { connectToDatabase } from "./mongodb";
import { items } from "./mock-data/items";
import { users } from "./mock-data/users";
import { reviews } from "./mock-data/reviews";
import { predictions } from "./mock-data/predict";
import { itemRecommendations } from "./mock-data/item-recommend";

// Set this to false to use MongoDB instead of mock data
const USE_MOCK_DATA = false;

// Utility function to remove duplicate items by item_index
export function removeDuplicateItems<T extends Record<string, any>>(
  items: T[]
): T[] {
  if (!items || items.length === 0) return items;

  const uniqueItems = new Map<number, T>();

  items.forEach((item) => {
    const itemIndex = item.item_index;
    if (itemIndex !== undefined && !uniqueItems.has(itemIndex)) {
      uniqueItems.set(itemIndex, item);
    }
  });

  return uniqueItems.size > 0 ? Array.from(uniqueItems.values()) : items;
}

export async function getItems(page = 1, limit = 12, category?: string) {
  if (USE_MOCK_DATA) {
    const filteredItems = category
      ? items.filter((item) => item.main_category === category)
      : items;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return removeDuplicateItems(filteredItems.slice(startIndex, endIndex));
  } else {
    const { db } = await connectToDatabase();
    const query = category ? { main_category: category } : {};
    const skip = (page - 1) * limit;

    const result = await db
      .collection("items")
      .find(query)
      .sort({ rating_number: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function getItemsCount(category?: string) {
  if (USE_MOCK_DATA) {
    if (category) {
      return items.filter((item) => item.main_category === category).length;
    }
    return items.length;
  } else {
    const { db } = await connectToDatabase();
    const query = category ? { main_category: category } : {};
    return db.collection("items").countDocuments(query);
  }
}

export async function getItemByIndex(itemIndex: number) {
  if (USE_MOCK_DATA) {
    return items.find((item) => item.item_index === itemIndex) || null;
  } else {
    const { db } = await connectToDatabase();
    return db.collection("items").findOne({ item_index: itemIndex });
  }
}

export async function getFeaturedItems(limit = 4) {
  if (USE_MOCK_DATA) {
    // Sort by rating_number and return top items
    const result = [...items]
      .sort((a, b) => b.rating_number - a.rating_number)
      .slice(0, limit);
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();
    const result = await db
      .collection("items")
      .find({})
      .sort({ rating_number: -1 })
      .limit(limit)
      .toArray();
    return removeDuplicateItems(result);
  }
}

export async function getCategories() {
  if (USE_MOCK_DATA) {
    const categories = new Set(items.map((item) => item.main_category));
    return Array.from(categories);
  } else {
    const { db } = await connectToDatabase();
    return db.collection("items").distinct("main_category");
  }
}

export async function getUserByIndex(userIndex: number) {
  if (USE_MOCK_DATA) {
    return users.find((user) => user.user_index === userIndex) || null;
  } else {
    const { db } = await connectToDatabase();
    return db.collection("users").findOne({ user_index: userIndex });
  }
}

export async function getUserReviews(userIndex: number) {
  if (USE_MOCK_DATA) {
    const userReviews = reviews.filter(
      (review) => review.user_index === userIndex
    );

    // Add item details to each review
    return userReviews.map((review) => {
      const item =
        items.find((item) => item.item_index === review.item_index) || null;
      return {
        ...review,
        item,
      };
    });
  } else {
    try {
      const { db } = await connectToDatabase();
      // Get all reviews for this user
      const userReviews = await db
        .collection("reviews")
        .find({ user_index: userIndex })
        .toArray();

      if (userReviews.length === 0) {
        return [];
      }

      // Extract all item indexes from the reviews
      const itemIndexes = userReviews
        .map((review) => review.item_index)
        .filter(Boolean);

      // Fetch all items that match these indexes
      const itemsData = await db
        .collection("items")
        .find({ item_index: { $in: itemIndexes } })
        .toArray();

      // Remove duplicate items if any
      const uniqueItemsData = removeDuplicateItems(itemsData);

      // Create a map for quick lookup
      const itemsMap: Record<number, any> = {};
      uniqueItemsData.forEach((item) => {
        if (item && item.item_index) {
          itemsMap[item.item_index] = item;
        }
      });

      // Add item data to each review
      const reviewsWithItems = userReviews.map((review) => {
        const itemIndex = review.item_index;
        return {
          ...review,
          item: itemsMap[itemIndex] || null,
        };
      });

      return reviewsWithItems;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return [];
    }
  }
}

export async function getUserRecommendations(userIndex: number) {
  if (USE_MOCK_DATA) {
    const prediction = predictions.find((p) => p.user_index === userIndex);

    if (
      !prediction ||
      !prediction.recommendation ||
      prediction.recommendation.length === 0
    ) {
      return [];
    }

    const result = items.filter((item) =>
      prediction.recommendation.includes(item.item_index)
    );
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();

    // Try to get recommendations from predicts collection first
    let predict = await db
      .collection("predicts")
      .findOne({ user_index: userIndex });

    // If not found, try cb_predict collection
    if (!predict) {
      predict = await db
        .collection("cb_predict")
        .findOne({ user_index: userIndex });
    }

    if (
      !predict ||
      !predict.recommendation ||
      predict.recommendation.length === 0
    ) {
      return [];
    }

    const result = await db
      .collection("items")
      .find({ item_index: { $in: predict.recommendation } })
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function getCollaborativeRecommendations(userIndex: number) {
  if (USE_MOCK_DATA) {
    const prediction = predictions.find((p) => p.user_index === userIndex);

    if (
      !prediction ||
      !prediction.recommendation ||
      prediction.recommendation.length === 0
    ) {
      return [];
    }

    const result = items.filter((item) =>
      prediction.recommendation.includes(item.item_index)
    );
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();

    // Get collaborative filtering recommendations from predicts collection
    const predict = await db
      .collection("predicts")
      .findOne({ user_index: userIndex });

    if (
      !predict ||
      !predict.recommendation ||
      predict.recommendation.length === 0
    ) {
      return [];
    }

    const result = await db
      .collection("items")
      .find({ item_index: { $in: predict.recommendation } })
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function getContentBasedRecommendations(userIndex: number) {
  if (USE_MOCK_DATA) {
    const prediction = predictions.find((p) => p.user_index === userIndex);

    if (
      !prediction ||
      !prediction.recommendation ||
      prediction.recommendation.length === 0
    ) {
      return [];
    }

    const result = items.filter((item) =>
      prediction.recommendation.includes(item.item_index)
    );
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();

    const predict = await db
      .collection("cb_predict")
      .findOne({ user_index: userIndex });

    if (
      !predict ||
      !predict.recommendation ||
      predict.recommendation.length === 0
    ) {
      return [];
    }

    const result = await db
      .collection("items")
      .find({ item_index: { $in: predict.recommendation } })
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function getRelatedItems(itemIndex: number) {
  if (USE_MOCK_DATA) {
    const itemRecommend = itemRecommendations.find(
      (ir) => ir.item_index === itemIndex
    );

    if (
      !itemRecommend ||
      !itemRecommend.recommendation ||
      itemRecommend.recommendation.length === 0
    ) {
      return [];
    }

    const result = items.filter((item) =>
      itemRecommend.recommendation.includes(item.item_index)
    );
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();
    const itemRecommend = await db
      .collection("item_rec")
      .findOne({ item_index: itemIndex });

    if (
      !itemRecommend ||
      !itemRecommend.recommendation ||
      itemRecommend.recommendation.length === 0
    ) {
      return [];
    }

    const result = await db
      .collection("items")
      .find({ item_index: { $in: itemRecommend.recommendation } })
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function searchItems(query: string, page = 1, limit = 12) {
  if (USE_MOCK_DATA) {
    const filteredItems = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.main_category.toLowerCase().includes(query.toLowerCase())
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const result = filteredItems.slice(startIndex, endIndex);
    return removeDuplicateItems(result);
  } else {
    const { db } = await connectToDatabase();

    // Create a text search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { main_category: { $regex: query, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    const result = await db
      .collection("items")
      .find(searchQuery)
      .sort({ rating_number: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return removeDuplicateItems(result);
  }
}

export async function searchItemsCount(query: string) {
  if (USE_MOCK_DATA) {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.main_category.toLowerCase().includes(query.toLowerCase())
    ).length;
  } else {
    const { db } = await connectToDatabase();

    // Create a text search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { main_category: { $regex: query, $options: "i" } },
      ],
    };

    return db.collection("items").countDocuments(searchQuery);
  }
}
