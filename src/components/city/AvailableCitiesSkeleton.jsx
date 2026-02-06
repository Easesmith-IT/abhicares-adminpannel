import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const AvailableCitiesSkeleton = ({ rows = 6 }) => {
  return (
        <>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* City */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* State */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Pincodes */}
              <TableCell>
                <Skeleton className="h-4 w-full max-w-[220px]" />
              </TableCell>

              {/* Polygon */}
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </>
  );
};

export default AvailableCitiesSkeleton;
