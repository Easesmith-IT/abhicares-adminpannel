import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Undo2, 
  UserPlus, 
  Phone, 
  MoreVertical, 
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
    icon: Clock,
  },
  OutOfDelivery: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
    icon: Truck,
  },
  Completed: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
    icon: CheckCircle,
  },
  Cancelled: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900/50",
    icon: XCircle,
  },
  Default: {
    bg: "bg-gray-50 dark:bg-gray-950/30",
    text: "text-gray-700 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-900/50",
    icon: HelpCircle,
  }
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
  const config = statusConfig[cleanStatus] || statusConfig.Default;
  const StatusIcon = config.icon;

  const formattedDate = order?.createdAt
    ? format(new Date(order.createdAt), "dd MMM yyyy • hh:mm aa")
    : "-";

  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex h-18 items-center justify-between px-6">
        {/* Left Side: Navigation & Identity */}
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

              {/* Status Badge with motion */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cleanStatus}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {cleanStatus}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Placed on {formattedDate}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Row */}
        <div className="flex items-center gap-2">
          {/* Invoice Button */}
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

          {/* Refund Trigger (Warning styling if applicable) */}
          {order?.refundInfo?.status ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefundClick}
              className="h-9 gap-1.5 border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 dark:border-orange-950/30 dark:bg-orange-950/10 dark:text-orange-400"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Refund Info
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefundClick}
              className="h-9 gap-1.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Refund
            </Button>
          )}

          {/* Assign Professional */}
          <Button
            variant="outline"
            size="sm"
            onClick={onAssignPartnerClick}
            className="h-9 gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5 text-gray-500" />
            Assign Partner
          </Button>

          {/* Contact Customer */}
          <Button
            variant="outline"
            size="sm"
            onClick={onContactClick}
            className="h-9 gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-gray-500" />
            Contact
          </Button>

          {/* More Actions Dropdown */}
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
                className="flex items-center justify-between"
              >
                Pending
                {cleanStatus === "Pending" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled"}
                onClick={() => onStatusChange("OutOfDelivery")}
                className="flex items-center justify-between"
              >
                Out Of Delivery
                {cleanStatus === "OutOfDelivery" && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled"}
                onClick={() => onStatusChange("Completed")}
                className="flex items-center justify-between"
              >
                Completed
                {cleanStatus === "Completed" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cleanStatus === "Cancelled" || cleanStatus === "Completed"}
                onClick={() => onStatusChange("Cancelled")}
                className="flex items-center justify-between text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-700"
              >
                Cancelled
                {cleanStatus === "Cancelled" && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => alert("Notification sent to Customer!")}>
                Alert Customer (SMS/WhatsApp)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Notification sent to Professional!")}>
                Alert Assigned Partner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
