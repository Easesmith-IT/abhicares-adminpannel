import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm pt-0">
      {/* Image Skeleton */}
      <div className="relative w-full h-40">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="p-4 space-y-2">
        {/* Name */}
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
};

export default CategoryCardSkeleton;
