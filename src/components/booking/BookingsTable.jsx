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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

/* ================= Status Styles ================= */

const getStatusClasses = (status) => {
  switch (status) {
    case "cancelled":
      return "bg-orange-600 text-white";
    case "completed":
      return "bg-green-600 text-white";
    case "alloted":
      return "bg-emerald-600 text-white";
    case "not-alloted":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

/* ================= Table ================= */

const BookingsTable = ({ bookings, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead className="w-[200px]">Booking ID</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Booking Value</TableHead>
            <TableHead>Details</TableHead>
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
              <TableCell colSpan={6} className="py-6 text-center">
                No bookings found
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="font-medium">
                  {booking.bookingId}
                </TableCell>

                <TableCell>
                  {booking?.bookingDate &&
                    format(new Date(booking?.bookingDate), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>
                  {booking?.bookingTime &&
                    format(new Date(booking?.bookingDate), "hh:mm aa")}
                </TableCell>

                <TableCell>
                  {booking.createdAt &&
                    format(new Date(booking.createdAt), "dd-MM-yyyy")}
                </TableCell>

                <TableCell>
                  <span
                    className={`rounded px-2 py-1 text-sm capitalize font-semibold ${getStatusClasses(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </TableCell>

                <TableCell>₹{booking.orderValue}</TableCell>

                <TableCell>
                  <Button
                    variant="outline"
                    className="px-0 text-primary hover:underline"
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
      <TableCell>
        <Skeleton className="h-4 w-[140px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[90px] rounded-full" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-9 px-4 py-2 w-9" />
      </TableCell>
    </TableRow>
  );
};

export default BookingsTable;
