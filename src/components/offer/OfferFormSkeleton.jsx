import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const FieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-10 w-full" />
  </div>
);

const OfferFormSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-6 py-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Discount Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        {/* Applicability */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferFormSkeleton;
