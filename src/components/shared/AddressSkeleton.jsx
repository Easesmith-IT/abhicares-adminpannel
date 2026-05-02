import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

export const AddressSkeleton = ({ count = 3 }) => (
  <div className="space-y-4 grid grid-cols-2 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);
