import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ================= Status Styles ================= */
const STATUS_BADGE_STYLE = {
  cancelled: "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
  completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  alloted: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200",
  "not-alloted": "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
};

/* ================= Table ================= */
const BookingsTable = ({ bookings, isLoading }) => {

  return (
    <div className="table-container border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white p-0 hover:translate-y-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200/60">
            <TableHead className="font-semibold text-slate-700 h-11 pl-6">Booking ID</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Scheduled Date</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Scheduled Time</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Created Date</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Booking Status</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Total Value</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Skeleton State */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableSkeletonRow key={i} />
            ))}

          {/* Empty State */}
          {!isLoading && bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                No bookings matches the current query
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            bookings.map((booking) => (
              <TableRow key={booking._id} className="hover:bg-slate-50/40">
                <TableCell className="font-bold text-slate-900 pl-6">
                  {booking.bookingId}
                </TableCell>

                <TableCell className="text-slate-600">
                  {booking?.bookingDate &&
                    format(new Date(booking?.bookingDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {booking?.bookingDate &&
                    format(new Date(booking?.bookingDate), "hh:mm aa")}
                </TableCell>

                <TableCell className="text-slate-500 font-mono text-xs">
                  {booking.createdAt &&
                    format(new Date(booking.createdAt), "dd-MM-yyyy")}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`capitalize shadow-none ${STATUS_BADGE_STYLE[booking.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}
                  >
                    {booking.status || "ALLOTTED"}
                  </Badge>
                </TableCell>

                <TableCell className="font-extrabold text-slate-900">₹{booking.orderValue}</TableCell>

                <TableCell className="text-right pr-6 py-3">
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
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

/* ================= Skeleton Row ================= */
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
        <Skeleton className="h-8 w-8 ml-auto rounded-md" />
      </TableCell>
    </TableRow>
  );
};

export default BookingsTable;
