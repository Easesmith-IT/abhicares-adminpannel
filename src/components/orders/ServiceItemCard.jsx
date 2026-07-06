import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  ExternalLink,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateOnly, formatSlotTime } from "@/utils/dateTime";

const bookingStatusConfig = {
  completed: {
    variant: "success",
    label: "Completed",
    icon: CheckCircle2,
  },
  cancelled: {
    variant: "destructive",
    label: "Cancelled",
    icon: AlertTriangle,
  },
  alloted: {
    variant: "secondary",
    label: "Partner Assigned",
    icon: User,
  },
  pending: {
    variant: "warning",
    label: "Pending Matching",
    icon: Clock,
  },
  OutOfDelivery: {
    variant: "default",
    label: "Out of Delivery",
    icon: RefreshCw,
  },
};

export default function ServiceItemCard({ item, onAssignClick, onViewDetails }) {
  if (!item) return null;

  const booking = item.bookingId || {};
  const isPackage = !!item.package;
  const detail = isPackage ? item.package : item.product;
  const quantity = item.quantity || 1;
  const offerPrice = detail?.offerPrice || 0;
  const totalPrice = quantity * offerPrice;

  // Image resolution
  const imageUrl = detail?.imageUrl?.[0]
    ? `${import.meta.env.VITE_APP_IMAGE_URL}/${detail.imageUrl[0]}`
    : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200";

  // Booking details
  const bookingIdStr = booking.bookingId || booking._id || "N/A";
  const bookingDate = booking.bookingDate 
    ? formatDateOnly(booking.bookingDate, "dd MMM yyyy") 
    : "-";
  const bookingTime = booking.bookingTime 
    ? formatSlotTime(booking.bookingTime, "hh:mm aa") 
    : "-";

  // Partner status
  const partner = booking.sellerId || booking.assignedSellerId || null;
  const bookingStatus = booking.status || "pending";
  const statusConfig = bookingStatusConfig[bookingStatus] || {
    variant: "outline",
    label: bookingStatus,
    icon: Info,
  };
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Service Image Section */}
        <div className="relative w-full sm:w-44 h-36 shrink-0 bg-gray-50 dark:bg-gray-900">
          <img
            src={imageUrl}
            alt={detail?.name || "Service Item"}
            className="h-full w-full object-cover"
          />
          <Badge className="absolute left-3 top-3 text-[10px] uppercase font-semibold tracking-wider">
            {isPackage ? "Package" : "Product"}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                {detail?.name || "Unknown Service"}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                ID: {bookingIdStr}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-gray-950 dark:text-gray-50">
                ₹{totalPrice}
              </span>
              <p className="text-xs text-gray-400">
                Qty: {quantity} &times; ₹{offerPrice}
              </p>
            </div>
          </div>

          {/* Details row: Schedule & Professional */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-4 dark:border-gray-800/50">
            {/* Schedule Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{bookingDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>{bookingTime}</span>
              </div>
            </div>

            {/* Assigned Partner Info */}
            <div className="flex flex-col justify-center">
              {partner ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    <span>{partner.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 pl-5">
                    {partner.phone || "No phone number"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Unassigned Partner</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-4 dark:border-gray-800/50">
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium 
              ${statusConfig.variant === "success" && "bg-emerald-50 text-emerald-700 border-emerald-200"}
              ${statusConfig.variant === "destructive" && "bg-rose-50 text-rose-700 border-rose-200"}
              ${statusConfig.variant === "secondary" && "bg-blue-50 text-blue-700 border-blue-200"}
              ${statusConfig.variant === "warning" && "bg-amber-50 text-amber-700 border-amber-200"}
              ${statusConfig.variant === "default" && "bg-indigo-50 text-indigo-700 border-indigo-200"}
            `}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </span>

            {/* Actions Button group */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(booking._id || booking)}
                className="h-8 text-xs gap-1 hover:bg-gray-50"
              >
                View Booking
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssignClick(booking)}
                disabled={bookingStatus === "cancelled" || bookingStatus === "completed"}
                className="h-8 text-xs gap-1"
              >
                <RefreshCw className="h-3 w-3 text-gray-400" />
                {partner ? "Reassign Partner" : "Assign Partner"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
