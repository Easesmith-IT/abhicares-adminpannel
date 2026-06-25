import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
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
import { formatCurrency } from "../utils/homepageTrending.mappers";

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, index) => (
    <TableRow key={`package-skeleton-${index}`}>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell><Skeleton className="h-8 w-28 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-20" /></TableCell>
    </TableRow>
  ));
}

export default function PackagesTrendingTable({
  rows,
  isLoading,
  rowLoadingMap,
  onToggle,
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/90">
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Package</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Service</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Category</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">City</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Price</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Offer Price</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Duration</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Products Count</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Rating</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95">Homepage Status</TableHead>
          <TableHead className="sticky top-0 z-10 bg-slate-50/95 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <LoadingRows />
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="py-10 text-center text-sm text-slate-500">
              No packages matched the selected city and filters.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const isPending = Boolean(rowLoadingMap[row.id]);

            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-slate-900">{row.name}</TableCell>
                <TableCell>{row.serviceName}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.cityName}</TableCell>
                <TableCell>{formatCurrency(row.price)}</TableCell>
                <TableCell>{formatCurrency(row.offerPrice)}</TableCell>
                <TableCell>
                  {row.durationMinutes ? `${row.durationMinutes} min` : "--"}
                </TableCell>
                <TableCell>{row.productsCount}</TableCell>
                <TableCell>{Number(row.rating || 0).toFixed(1)}</TableCell>
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
