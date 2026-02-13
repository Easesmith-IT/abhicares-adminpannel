import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const CityCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export const CityCardProductSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export const CityCardCategorySkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
