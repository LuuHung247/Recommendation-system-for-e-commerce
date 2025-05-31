import { Suspense } from "react";
import { searchItems, searchItemsCount } from "@/lib/data-service";
import ItemCard from "@/components/item-card";
import LoadingItems from "@/components/loading-items";
import Pagination from "@/components/pagination";
import SearchForm from "@/components/search-form";
import { isValidItem, castToItem } from "@/lib/items";
import type { Item } from "@/lib/items";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams;

  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";

  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number.parseInt(resolvedSearchParams.page)
      : 1;

  const limit = 12;

  const [itemsData, totalItems] = await Promise.all([
    query ? searchItems(query, page, limit) : [],
    query ? searchItemsCount(query) : 0,
  ]);

  // Filter to ensure only valid items are used and cast others
  const items: Item[] = itemsData
    .filter(
      (item) =>
        isValidItem(item) ||
        (item && typeof item === "object" && "item_index" in item)
    )
    .map((item) => (isValidItem(item) ? item : castToItem(item)));

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>

      <div className="mb-8">
        <SearchForm initialQuery={query} />
      </div>

      {query ? (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {totalItems} results for "{query}"
            </p>
          </div>

          <Suspense fallback={<LoadingItems count={limit} />}>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.item_index} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </Suspense>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Enter a search term</h3>
          <p className="text-muted-foreground">
            Search for products by name or category.
          </p>
        </div>
      )}
    </div>
  );
}
