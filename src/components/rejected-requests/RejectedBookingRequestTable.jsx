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
import { XCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Request from "./Request";



const RejectedBookingRequestTable = ({ requests, isLoading,getReqs }) => {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead>Request ID</TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Admin Note</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <RequestSkeleton key={i} />
            ))}

          {!isLoading && requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6">
                No requests found
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            requests.map((item) => (
              <Request key={item.requestId} item={item} refetch={getReqs} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

const RequestSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-28" />
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
      <Skeleton className="h-4 w-36" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20 rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-9 w-9" />
    </TableCell>
  </TableRow>
);

export default RejectedBookingRequestTable;
