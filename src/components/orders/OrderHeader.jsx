import { format } from "date-fns";
import { ArrowLeft, FileText, MoreVertical, Phone, Undo2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { formatInstant } from "@/utils/dateTime";

const statusConfig = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  OutOfDelivery: "border-blue-200 bg-blue-50 text-blue-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function OrderHeader({
  order,
  status,
  onStatusChange,
  onViewInvoice,
  isInvoiceLoading,
  onAssignPartnerClick,
  onRefundClick,
  onContactClick,
}) {
  const cleanStatus = status || order?.status || "Pending";
  const statusClasses =
    statusConfig[cleanStatus] || "border-gray-200 bg-gray-50 text-gray-700";

  const formattedDate = order?.createdAt
    ? format(new Date(order.createdAt), "dd MMM yyyy hh:mm aa")
    : "-";

  const displayDate = order?.createdAt
    ? formatInstant(order.createdAt, "dd MMM yyyy hh:mm aa")
    : formattedDate;

  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/orders"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                Order #{order?.orderId || "Loading..."}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClasses}`}
              >
                {cleanStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Placed on {displayDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewInvoice}
            disabled={isInvoiceLoading}
            className="h-9 gap-1.5"
          >
            {isInvoiceLoading ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-gray-500" />
            )}
            Invoice
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefundClick}
            className="h-9 gap-1.5"
          >
            <Undo2 className="h-3.5 w-3.5 text-gray-500" />
            Refund
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAssignPartnerClick}
            className="h-9 gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5 text-gray-500" />
            Assign Partner
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onContactClick}
            disabled={!order?.user?.phone}
            className="h-9 gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-gray-500" />
            Contact
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Change Order Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled"}
                onClick={() => onStatusChange("Pending")}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled"}
                onClick={() => onStatusChange("OutOfDelivery")}
              >
                Out Of Delivery
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled"}
                onClick={() => onStatusChange("Completed")}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled" || cleanStatus === "Completed"}
                onClick={() => onStatusChange("Cancelled")}
                className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-950/30"
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
