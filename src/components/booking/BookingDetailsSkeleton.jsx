import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const BookingDetailsSkeleton = () => {
  return (
    <Wrapper>
      <BackLink href={-1}>
        <H2>Booking Details</H2>
      </BackLink>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="space-y-6 xl:col-span-2">
          {/* Booking Info */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-24" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[160px]" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>

          {/* Product */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Separator />
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>

          {/* Partner */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================= MAP ================= */}
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default BookingDetailsSkeleton;
