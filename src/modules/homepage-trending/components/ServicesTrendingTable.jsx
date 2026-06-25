import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
} from "../utils/homepageTrending.mappers";

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, index) => (
    <TableRow key={`service-skeleton-${index}`}>
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-28 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-8 w-20" />
      </TableCell>
    </TableRow>
  ));
}

export default function ServicesTrendingTable({
  rows,
  isLoading,
  rowLoadingMap,
  onToggle,
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/90">
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Service</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Category</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">City</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Starting Price</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Homepage Status</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Created At</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <LoadingRows />
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
              No services matched the selected city and filters.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const isPending = Boolean(rowLoadingMap[row.id]);

            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-slate-900">{row.name}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.cityName}</TableCell>
                <TableCell>{formatCurrency(row.startingPrice)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={row.homepageEnabled}
                      disabled={isPending}
                      aria-label={`Toggle homepage visibility for ${row.name}`}
                      onCheckedChange={(checked) => onToggle(row.id, checked)}
                    />
                    <Badge variant={row.homepageEnabled ? "success" : "outline"}>
                      {isPending
                        ? "Updating..."
                        : row.homepageEnabled
                          ? "Enabled"
                          : "Disabled"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {row.detailsHref ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to={row.detailsHref}>Open</Link>
                    </Button>
                  ) : (
                    <span className="text-sm text-slate-400">Unavailable</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
