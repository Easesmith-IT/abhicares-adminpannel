import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export const TicketRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[140px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[110px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-[90px] rounded-full" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </TableCell>
  </TableRow>
);
