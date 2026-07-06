const STATUS_META = {
  "not-alloted": {
    label: "Unassigned",
    badgeClassName:
      "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
    actionValue: "not-alloted",
  },
  "assigned-pending": {
    label: "Assigned",
    badgeClassName:
      "bg-violet-50 text-violet-700 hover:bg-violet-50 border border-violet-200",
    actionValue: "assigned",
  },
  alloted: {
    label: "Allotted",
    badgeClassName:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200",
    actionValue: "accepted",
  },
  "in-progress": {
    label: "In Progress",
    badgeClassName:
      "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200",
    actionValue: "in progress",
  },
  "payment-pending": {
    label: "Payment Pending",
    badgeClassName:
      "bg-orange-50 text-orange-700 hover:bg-orange-50 border border-orange-200",
    actionValue: "payment-pending",
  },
  completed: {
    label: "Completed",
    badgeClassName:
      "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
    actionValue: "completed",
  },
  cancelled: {
    label: "Cancelled",
    badgeClassName:
      "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
    actionValue: "cancelled",
  },
  "on-hold": {
    label: "On Hold",
    badgeClassName:
      "bg-yellow-50 text-yellow-800 hover:bg-yellow-50 border border-yellow-200",
    actionValue: "on hold",
  },
  "no-show": {
    label: "No Show",
    badgeClassName:
      "bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200",
    actionValue: "no show",
  },
  rescheduled: {
    label: "Rescheduled",
    badgeClassName:
      "bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border border-cyan-200",
    actionValue: "rescheduled",
  },
};

const ALIAS_MAP = {
  "not allotted": "not-alloted",
  "not allotted ": "not-alloted",
  "not-allotted": "not-alloted",
  assigned: "assigned-pending",
  accepted: "alloted",
  allotted: "alloted",
  "in progress": "in-progress",
  "payment pending": "payment-pending",
  "on hold": "on-hold",
  "no show": "no-show",
};

export const normalizeBookingStatus = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, " ");

  if (!normalized) return "";
  if (ALIAS_MAP[normalized]) return ALIAS_MAP[normalized];
  return normalized.replace(/\s/g, "-");
};

export const getBookingStatusMeta = (status) => {
  const normalized = normalizeBookingStatus(status);

  return (
    STATUS_META[normalized] || {
      label: normalized
        ? normalized.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown",
      badgeClassName:
        "bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200",
      actionValue: normalized || "",
    }
  );
};

export const toBookingStatusActionValue = (status) =>
  getBookingStatusMeta(status).actionValue;

export const BOOKING_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "not-alloted", label: "Unassigned" },
  { value: "assigned-pending", label: "Assigned" },
  { value: "alloted", label: "Allotted" },
  { value: "in-progress", label: "In Progress" },
  { value: "payment-pending", label: "Payment Pending" },
  { value: "on-hold", label: "On Hold" },
  { value: "no-show", label: "No Show" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const BOOKING_STATUS_ACTION_OPTIONS = [
  { value: "not-alloted", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "accepted", label: "Accepted" },
  { value: "en route", label: "En Route" },
  { value: "arrived", label: "Arrived" },
  { value: "in progress", label: "In Progress" },
  { value: "payment-pending", label: "Payment Pending" },
  { value: "on hold", label: "On Hold" },
  { value: "no show", label: "No Show" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
