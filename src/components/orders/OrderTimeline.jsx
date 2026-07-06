import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  CreditCard,
  FileClock,
  MessageSquare,
  ReceiptText,
  RotateCcw,
  XCircle,
} from "lucide-react";

const buildTimelineEvents = (order, ledger) => {
  const events = [];
  if (!order) return events;

  events.push({
    id: "created",
    title: "Order Created",
    description: `Order ${order.orderId || ""} was created for ${order.user?.name || "customer"}.`,
    time: order.createdAt ? new Date(order.createdAt) : null,
    icon: ReceiptText,
    tone: "completed",
  });

  if (Array.isArray(order.items) && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const booking = item?.bookingId || {};
      const label = item?.product?.name || item?.package?.name || `Booking ${index + 1}`;
      const bookingDate = booking.bookingDate
        ? format(new Date(booking.bookingDate), "dd MMM yyyy")
        : "No date";
      const bookingTime = booking.bookingTime
        ? format(new Date(booking.bookingTime), "hh:mm aa")
        : "No time";

      events.push({
        id: `booking-${booking._id || index}`,
        title: "Service Scheduled",
        description: `${label} scheduled for ${bookingDate} at ${bookingTime}.`,
        time: booking.createdAt ? new Date(booking.createdAt) : null,
        icon: CalendarClock,
        tone: "completed",
      });
    });
  }

  if (ledger?.lastPaidAt) {
    events.push({
      id: "payment",
      title: "Payment Recorded",
      description: `Latest payment captured via ${ledger.lastMethod || order.paymentType || "unknown method"}.`,
      time: new Date(ledger.lastPaidAt),
      icon: CreditCard,
      tone: "completed",
    });
  } else if (ledger && Number(ledger.remainingBalance || 0) > 0) {
    events.push({
      id: "payment-pending",
      title: "Payment Pending",
      description: `Outstanding balance: ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(ledger.remainingBalance || 0))}.`,
      time: null,
      icon: FileClock,
      tone: "pending",
    });
  }

  if (order?.refundInfo?.status && order.refundInfo.status !== "not-applicable") {
    events.push({
      id: "refund",
      title: `Refund ${order.refundInfo.status}`,
      description: `Refund amount ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(order.refundInfo.amount || 0))}.`,
      time: order.refundInfo.processedAt
        ? new Date(order.refundInfo.processedAt)
        : null,
      icon: RotateCcw,
      tone:
        order.refundInfo.status === "processed"
          ? "completed"
          : order.refundInfo.status === "failed"
            ? "cancelled"
            : "pending",
    });
  }

  if (Array.isArray(order.orderNotes)) {
    order.orderNotes.forEach((note, index) => {
      events.push({
        id: `note-${note?._id || index}`,
        title: "Order Note Added",
        description: note?.text || "",
        time: note?.createdAt ? new Date(note.createdAt) : null,
        icon: MessageSquare,
        tone: "completed",
        actor: note?.createdBy || "Admin",
      });
    });
  }

  if (String(order.status || "").toLowerCase() === "completed") {
    events.push({
      id: "completed",
      title: "Order Completed",
      description: "Order marked as completed.",
      time: order.updatedAt ? new Date(order.updatedAt) : null,
      icon: Check,
      tone: "completed",
    });
  }

  if (String(order.status || "").toLowerCase() === "cancelled") {
    events.push({
      id: "cancelled",
      title: "Order Cancelled",
      description: order.cancellationReason || "Order was cancelled.",
      time: order.cancelledAt
        ? new Date(order.cancelledAt)
        : order.updatedAt
          ? new Date(order.updatedAt)
          : null,
      icon: XCircle,
      tone: "cancelled",
    });
  }

  return events.sort((a, b) => {
    const aTime = a.time ? a.time.getTime() : 0;
    const bTime = b.time ? b.time.getTime() : 0;
    return bTime - aTime;
  });
};

export default function OrderTimeline({ order, ledger }) {
  const timelineEvents = buildTimelineEvents(order, ledger);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Order Activity
        </h3>
        <span className="text-xs text-gray-400">Server-backed events only</span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative space-y-8 border-l border-gray-100 pl-6 dark:border-gray-800"
      >
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-gray-400">No order activity available.</p>
        ) : (
          timelineEvents.map((event) => {
            const Icon = event.icon;
            const colorClass =
              event.tone === "completed"
                ? "bg-emerald-500 border-emerald-500 text-white"
                : event.tone === "cancelled"
                  ? "bg-rose-500 border-rose-500 text-white"
                  : "bg-white border-gray-300 text-gray-400";

            return (
              <div key={event.id} className="relative">
                <span
                  className={`absolute -left-[35px] top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border ${colorClass}`}
                >
                  <Icon className="h-3 w-3" />
                </span>

                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                      {event.title}
                    </h4>
                    <p className="max-w-lg text-xs text-gray-500 dark:text-gray-400">
                      {event.description}
                    </p>
                    {event.actor && (
                      <p className="text-[11px] text-gray-400">
                        Added by {event.actor}
                      </p>
                    )}
                  </div>

                  {event.time && (
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-50">
                        {format(event.time, "hh:mm aa")}
                      </span>
                      <span className="block text-[10px] text-gray-400">
                        {format(event.time, "dd MMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
