import { Skeleton } from "../ui/skeleton";

export const PartnerInfoSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
    <Skeleton className="h-8 w-40" />
  </div>
);

export const OrdersTableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export const WalletSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="flex gap-2">
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-9 w-28" />
    </div>
    <Skeleton className="h-40 w-full" />
  </div>
);
