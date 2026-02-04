import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CardSkeleton = ({ rows = 3 }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-40" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </CardContent>
  </Card>
);

const TimelineSkeleton = () => (
  <div className="flex gap-3">
    <Skeleton className="h-6 w-6 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);

const HelpCenterTicketDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        <CardSkeleton rows={5} />

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <TimelineSkeleton />
            <TimelineSkeleton />
            <TimelineSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenterTicketDetailsSkeleton;
