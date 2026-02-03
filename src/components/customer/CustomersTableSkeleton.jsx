import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export const CustomersTableSkeleton = ({ rows = 6 }) => {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {/* Customer Name */}
      <TableCell>
        <Skeleton className="h-4 w-[160px]" />
      </TableCell>

      {/* Contact Number */}
      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));
};
