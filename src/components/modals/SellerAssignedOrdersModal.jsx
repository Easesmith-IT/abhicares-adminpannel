import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import SellerOrderInfoModal from "./SellerOrderInfoModal";


const SellerAssignedOrdersModal = ({
  isSellerAssignedModalOpen,
  setIsSellerAssignedModalOpen,
}) => {
  const { partnerId } = useParams();

  const { res: ordersRes, fetchData: getOrders, isLoading } = useGetApiReq();
  const {
    res: filterRes,
    fetchData: filterByStatus,
    isLoading: filterLoading,
  } = usePostApiReq();

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ---------------- API FUNCTIONS ---------------- */

  const fetchOrders = () => {
    if (!partnerId) return;

    getOrders(
      `/admin/get-seller-order-list/${partnerId}?startDate=${filters.startDate}&endDate=${filters.endDate}`
    );
  };

  const handleStatusChange = (value) => {
    setStatus(value);

    if (!value) {
      fetchOrders();
      return;
    }

    filterByStatus(`/admin/get-seller-order-by-status/${partnerId}`, {
      status: value,
    });
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchOrders();
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    if (ordersRes?.status === 200) {
      setOrders(ordersRes.data.sellerOrders);
    }
  }, [ordersRes]);

  useEffect(() => {
    if (filterRes?.status === 200) {
      setOrders(filterRes.data.sellerOrders);
    }
  }, [filterRes]);

  const loading = isLoading || filterLoading;

  return (
    <>
      <Dialog
        open={isSellerAssignedModalOpen}
        onOpenChange={setIsSellerAssignedModalOpen}
      >
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Partner Assigned Orders</DialogTitle>
          </DialogHeader>

          {/* ---------------- Filters ---------------- */}
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Start Date</p>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">End Date</p>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloted">Alloted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ---------------- Table ---------------- */}
          {loading ? (
            <OrdersTableSkeleton />
          ) : orders.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No bookings found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 border-b border-white/40">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Order Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.bookingId}</TableCell>
                    <TableCell>₹{order.orderValue}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------- Order Info Modal ---------------- */}
      {selectedOrder && (
        <SellerOrderInfoModal
          sellerOrder={selectedOrder}
          setSellerOrderInfoModal={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default SellerAssignedOrdersModal;

/* ===================================================== */
/* ================= Skeleton Component ================= */
/* ===================================================== */

const OrdersTableSkeleton = ({ rows = 5 }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
