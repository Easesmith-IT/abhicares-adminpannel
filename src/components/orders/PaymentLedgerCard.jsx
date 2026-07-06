import { Calendar, CreditCard, FileCheck } from "lucide-react";

import { formatInstant } from "@/utils/dateTime";

const amountFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value) => amountFormatter.format(Number(value || 0));

export default function PaymentLedgerCard({ ledger, paymentType }) {
  if (!ledger) return null;

  const normalizedStatus = String(ledger.paymentStatus || "").toLowerCase();
  const isSettled = Boolean(ledger.settled);
  const isPaid =
    normalizedStatus === "paid" ||
    normalizedStatus === "settled" ||
    normalizedStatus === "completed";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Payment Ledger
        </h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isSettled
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {isSettled ? "Settled" : "Open"}
        </span>
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-gray-50 bg-gray-50/50 p-4 dark:border-gray-900 dark:bg-gray-900/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Payment Status</span>
          <div className="flex items-center gap-1.5 font-semibold">
            <span
              className={`h-2 w-2 rounded-full ${
                isPaid ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span
              className={
                isPaid
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              {ledger.paymentStatus || "Unpaid"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400">Method</span>
          <span className="flex items-center gap-1 font-semibold text-gray-950 dark:text-gray-50">
            <CreditCard className="h-3.5 w-3.5 text-gray-400" />
            {ledger.lastMethod || paymentType || "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Last Paid At</span>
          <span className="flex items-center gap-1 font-medium text-gray-950 dark:text-gray-50">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {ledger.lastPaidAt
              ? formatInstant(ledger.lastPaidAt, "dd MMM yyyy, hh:mm aa")
              : "-"}
          </span>
        </div>
      </div>

      <div className="mb-5 space-y-3.5 border-b border-gray-50 pb-5 text-sm dark:border-gray-800/50">
        <div className="flex justify-between text-gray-500">
          <span>Total Bill</span>
          <span className="font-semibold text-gray-900 dark:text-gray-50">
            {formatAmount(ledger.totalBillAmount)}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Total Paid</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {formatAmount(ledger.totalPaid)}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Total Refunded</span>
          <span className="font-semibold text-rose-500 dark:text-rose-400">
            {formatAmount(ledger.totalRefunded)}
          </span>
        </div>
        <div className="flex justify-between border-t border-dashed border-gray-100 pt-3 font-semibold dark:border-gray-800">
          <span className="text-gray-900 dark:text-gray-50">Remaining Balance</span>
          <span
            className={
              Number(ledger.remainingBalance || 0) > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-900 dark:text-gray-50"
            }
          >
            {formatAmount(ledger.remainingBalance)}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start justify-between gap-4">
          <span className="mt-0.5 flex items-center gap-1 text-gray-400">
            <FileCheck className="h-3 w-3" />
            Last Transaction Status
          </span>
          <span className="max-w-[160px] text-right font-medium capitalize text-gray-700 dark:text-gray-400">
            {ledger.lastTransactionStatus || "No transaction recorded"}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">Ledger ID</span>
          <span className="max-w-[160px] truncate text-right font-mono text-gray-700 dark:text-gray-400">
            {ledger.paymentId || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
