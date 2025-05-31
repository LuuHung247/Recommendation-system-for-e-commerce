import { Suspense } from "react";
import { getItemsCount } from "@/lib/items";
import ItemsList from "@/components/items-list";
import ItemsFilter from "@/components/items-filter";
import Pagination from "@/components/pagination";
import LoadingItems from "@/components/loading-items";

type ItemsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  // Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams;

  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number.parseInt(resolvedSearchParams.page)
      : 1;

  const category =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;

  const limit = 12;

  const totalItems = await getItemsCount(category);
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ItemsFilter selectedCategory={category} />
        </div>

        <div className="md:col-span-3">
          <Suspense fallback={<LoadingItems count={limit} />}>
            <ItemsList page={page} limit={limit} category={category} />
          </Suspense>

          <div className="mt-8">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
