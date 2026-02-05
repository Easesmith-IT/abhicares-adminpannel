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

const getStatusClasses = (status) => {
  switch (status) {
    case "Cancelled":
      return "bg-orange-600 text-white";
    case "Completed":
      return "bg-green-600 text-white";
    case "Pending":
      return "bg-yellow-400 text-black";
    case "OutOfDelivery":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

const OrdersTable = ({ orders, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead className="w-[200px]">Order ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Value</TableHead>
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
          {!isLoading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No orders found
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.orderId}</TableCell>

                <TableCell>
                  {format(new Date(order.createdAt), "dd-MM-yyyy")}
                </TableCell>

                <TableCell>
                  <span
                    className={`rounded px-2 py-1 text-sm font-semibold ${getStatusClasses(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>

                <TableCell>₹{order.orderValue}</TableCell>

                <TableCell>
                  <Button
                    onClick={() => navigate()}
                    className="text-primary hover:underline"
                    variant="outline"
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
      <TableCell>
        <Skeleton className="h-4 w-[140px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[110px]" />
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

export default OrdersTable;
