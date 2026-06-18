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

const STATUS_BADGE_STYLE = {
  Cancelled: "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
  Completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  Pending: "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200",
  OutOfDelivery: "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
};

const OrdersTable = ({ orders, isLoading }) => {
  return (
    <div className="table-container border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white p-0 hover:translate-y-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200/60">
            <TableHead className="font-semibold text-slate-700 h-11 pl-6">Order ID</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Order Date</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 h-11">Total Order Value</TableHead>
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
          {!isLoading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                No orders found matching the query.
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            orders.map((order) => (
              <TableRow key={order._id} className="hover:bg-slate-50/40">
                <TableCell className="font-bold text-slate-900 pl-6">{order.orderId}</TableCell>

                <TableCell className="text-slate-600">
                  {format(new Date(order.createdAt), "dd MMM yyyy")}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`capitalize shadow-none ${STATUS_BADGE_STYLE[order.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell className="font-extrabold text-slate-950">₹{order.orderValue}</TableCell>

                <TableCell className="text-right pr-6 py-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                    asChild
                  >
                    <Link state={order} to={`/admin/orders/${order._id}`}>
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

const TableSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-[130px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[70px]" />
      </TableCell>
      <TableCell className="pr-6 text-right">
        <Skeleton className="h-8 w-8 ml-auto rounded-md" />
      </TableCell>
    </TableRow>
  );
};

export default OrdersTable;
