import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export const BookingTableSkeleton = ({ rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-24 ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
