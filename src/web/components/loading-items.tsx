import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function LoadingItems({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-24" />
          <CardContent className="p-4 pt-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-5 w-12 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
