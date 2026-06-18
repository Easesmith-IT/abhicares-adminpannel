import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-2xl pt-0">
      <Skeleton className="w-full h-40" />

      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
