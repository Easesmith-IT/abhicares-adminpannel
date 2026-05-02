import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => {
  return (
    <Card className="overflow-hidden pt-0 rounded-2xl shadow-sm">
      {/* Image */}
      <div className="w-full h-40">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
};

export default ServiceCardSkeleton;
