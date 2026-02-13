import Wrapper from "@/components/wrappers/Wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "@/components/shared/typography";
import { BackLink } from "@/components/shared/back-link";

const CityCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>

        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
};

export const CategoryFormSkeleton = () => {
  return (
    <Wrapper>
      <BackLink href={-1}>
        <H2>Update Category</H2>
      </BackLink>

      <Card className="mt-5">
        <CardContent className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* City-wise config title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* City cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CityCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default CategoryFormSkeleton;
