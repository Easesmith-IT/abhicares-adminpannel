import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { formatDateOnly, formatInstant, formatSlotTime } from "@/utils/dateTime";
import { getBookingStatusMeta } from "@/utils/bookingStatus";

const BookingsTable = ({ bookings, isLoading }) => {
  return (
    <div className="table-container overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-sm hover:translate-y-0">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/60 bg-slate-50">
            <TableHead className="h-11 pl-6 font-semibold text-slate-700">
              Booking ID
            </TableHead>
            <TableHead className="h-11 font-semibold text-slate-700">
              Scheduled Date
            </TableHead>
            <TableHead className="h-11 font-semibold text-slate-700">
              Scheduled Time
            </TableHead>
            <TableHead className="h-11 font-semibold text-slate-700">
              Created Date
            </TableHead>
            <TableHead className="h-11 font-semibold text-slate-700">
              Booking Status
            </TableHead>
            <TableHead className="h-11 font-semibold text-slate-700">
              Total Value
            </TableHead>
            <TableHead className="h-11 pr-6 text-right font-semibold text-slate-700">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableSkeletonRow key={i} />
            ))}

          {!isLoading && bookings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-12 text-center font-medium text-slate-400"
              >
                No bookings match the current query
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            bookings.map((booking) => {
              const statusMeta = getBookingStatusMeta(booking.status);

              return (
                <TableRow key={booking._id} className="hover:bg-slate-50/40">
                  <TableCell className="pl-6 font-bold text-slate-900">
                    {booking.bookingId}
                  </TableCell>

                  <TableCell className="text-slate-600">
                    {booking?.bookingDate &&
                      formatDateOnly(booking.bookingDate, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">
                    {booking?.bookingTime &&
                      formatSlotTime(booking.bookingTime, "hh:mm aa")}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-500">
                    {booking.createdAt &&
                      formatInstant(booking.createdAt, "dd-MM-yyyy")}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`shadow-none ${statusMeta.badgeClassName}`}
                    >
                      {statusMeta.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-extrabold text-slate-900">
                    Rs {Number(booking.orderValue ?? booking.itemTotalValue ?? 0)}
                  </TableCell>

                  <TableCell className="py-3 pr-6 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                      asChild
                    >
                      <Link state={booking} to={`/admin/bookings/${booking._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

const TableSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[90px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[60px]" />
      </TableCell>
      <TableCell className="pr-6 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  );
};

export default BookingsTable;
