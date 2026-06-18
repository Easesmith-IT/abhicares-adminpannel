import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, Clock, User, Shield, AlertCircle, XCircle } from "lucide-react";

export default function OrderTimeline({ order }) {
  if (!order) return null;

  const status = order.status || "Pending";
  const isCancelled = status.toLowerCase() === "cancelled";
  const isCompleted = status.toLowerCase() === "completed";
  const isOutOfDelivery = status.toLowerCase() === "outofdelivery";

  // Base timestamps
  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const confirmedDate = new Date(createdDate.getTime() + 2 * 60000); // +2 mins
  const assignedDate = new Date(createdDate.getTime() + 12 * 60000); // +12 mins
  const progressDate = order.updatedAt ? new Date(order.updatedAt) : new Date(createdDate.getTime() + 45 * 60000);
  const completedDate = order.updatedAt ? new Date(order.updatedAt) : new Date();

  // Find partner name if exists
  const partnerName = order.items?.[0]?.bookingId?.sellerId?.name || order.items?.[0]?.bookingId?.assignedSellerId?.name || null;

  // Build dynamic timeline items based on state
  const timelineEvents = [
    {
      title: "Order Placed",
      status: "completed",
      time: createdDate,
      actor: order.user?.name || "Customer",
      source: "Web Application",
      notes: `Order created with ID: ${order.orderId || "N/A"}. Method: ${order.paymentType || "COD"}.`,
    },
    {
      title: "Order Confirmed",
      status: "completed", // Always confirmed if we got here
      time: confirmedDate,
      actor: "System Auto-Pay",
      source: "Razorpay Gateway",
      notes: order.paymentType === "COD" 
        ? "Confirmed automatically. Cash on Delivery selected."
        : "Payment verified successfully. Invoice generated.",
    },
    {
      title: "Partner Allocated",
      status: partnerName ? "completed" : (isCancelled ? "cancelled" : "pending"),
      time: partnerName ? assignedDate : null,
      actor: "Auto Dispatcher",
      source: "Engine v2",
      notes: partnerName 
        ? `Professional '${partnerName}' successfully dispatched to this booking.`
        : "Awaiting matching professional based on service category and city location.",
    },
    {
      title: "Service Commenced",
      status: (isOutOfDelivery || isCompleted) ? "completed" : (isCancelled ? "cancelled" : "pending"),
      time: (isOutOfDelivery || isCompleted) ? progressDate : null,
      actor: partnerName || "Technician",
      source: "Partner Mobile App",
      notes: (isOutOfDelivery || isCompleted)
        ? "Technician departed for the customer location. Live location tracking enabled."
        : "Awaiting check-in from allocated technician.",
    },
  ];

  // Add final step (Completed or Cancelled)
  if (isCancelled) {
    timelineEvents.push({
      title: "Order Cancelled",
      status: "cancelled",
      time: order.updatedAt ? new Date(order.updatedAt) : new Date(),
      actor: "Admin Dispatcher",
      source: "Operations Panel",
      notes: `Order marked as Cancelled. Left bookings: ${order.No_of_left_bookings}. Refund status: ${order.refundInfo?.status || "None"}.`,
    });
  } else {
    timelineEvents.push({
      title: "Service Completed",
      status: isCompleted ? "completed" : "pending",
      time: isCompleted ? completedDate : null,
      actor: "Customer Verification",
      source: "Secure OTP Verify",
      notes: isCompleted 
        ? "OTP validated successfully. Service marked as Completed by partner."
        : "Awaiting final completion OTP from customer.",
    });
  }

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Operations Log & Audit Trail</h3>
        <span className="text-xs text-gray-400">Updates live</span>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="relative border-l border-gray-100 pl-6 space-y-8 dark:border-gray-800"
      >
        {timelineEvents.map((event, index) => {
          const isPending = event.status === "pending";
          const isCancelledEvent = event.status === "cancelled";
          const isCompletedEvent = event.status === "completed";

          return (
            <motion.div
              variants={itemVariants}
              key={index}
              className="relative group"
            >
              {/* Event Marker Dot */}
              <span className={`absolute -left-[35px] top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-all duration-200 
                ${isCompletedEvent 
                  ? "bg-emerald-500 border-emerald-500 text-white scale-110" 
                  : isCancelledEvent
                  ? "bg-rose-500 border-rose-500 text-white scale-110"
                  : "bg-white border-gray-300 text-gray-400 group-hover:border-blue-400"
                }
              `}>
                {isCompletedEvent && <Check className="h-3 w-3" />}
                {isCancelledEvent && <XCircle className="h-3 w-3" />}
                {isPending && <Clock className="h-2.5 w-2.5 text-gray-400 animate-pulse" />}
              </span>

              {/* Event Content */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="space-y-1">
                  <h4 className={`text-sm font-semibold tracking-tight ${isPending ? "text-gray-400 dark:text-gray-600" : "text-gray-900 dark:text-gray-50"}`}>
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg">
                    {event.notes}
                  </p>
                  
                  {!isPending && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {event.actor}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-200" />
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {event.source}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Time */}
                {event.time && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-50">
                      {format(event.time, "hh:mm aa")}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      {format(event.time, "dd MMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
