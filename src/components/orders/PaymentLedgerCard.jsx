import { format } from "date-fns";
import { CreditCard, CheckCircle2, AlertTriangle, Calendar, FileCheck, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentLedgerCard({ ledger, paymentType, orderId }) {
  if (!ledger) return null;

  const isSettled = ledger.settled;
  const isPaid = ledger.paymentStatus?.toLowerCase() === "paid" || ledger.paymentStatus?.toLowerCase() === "settled";

  const formattedPaidAt = ledger.lastPaidAt
    ? format(new Date(ledger.lastPaidAt), "dd MMM yyyy, hh:mm aa")
    : "-";

  // Mock gateway/transaction ID based on orderId or ledger status
  const gatewayPaymentId = ledger.lastMethod === "COD" 
    ? "N/A (Cash on Delivery)" 
    : `pay_${orderId?.replace(/[^a-zA-Z0-9]/g, "").slice(-8) || "RzP72x9A1b"}`;
  const transactionId = `txn_${orderId?.replace(/[^a-zA-Z0-9]/g, "").slice(-8) || "TxN905Ew2p"}`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Payment Ledger</h3>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase
          ${isSettled 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-amber-50 text-amber-700 border-amber-200"
          }
        `}>
          {isSettled ? "Settled" : "Unsettled"}
        </span>
      </div>

      {/* Overview Block */}
      <div className="rounded-xl bg-gray-50/50 p-4 border border-gray-50 dark:bg-gray-900/40 dark:border-gray-900 mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Payment Status</span>
          <div className="flex items-center gap-1.5 font-semibold">
            <span className={`h-2 w-2 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className={isPaid ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}>
              {ledger.paymentStatus || "Unpaid"}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-medium">Method</span>
          <span className="font-semibold text-gray-950 dark:text-gray-50 flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5 text-gray-400" />
            {ledger.lastMethod || paymentType || "-"}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Last Paid At</span>
          <span className="font-medium text-gray-950 dark:text-gray-50 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {formattedPaidAt}
          </span>
        </div>
      </div>

      {/* Financial Table */}
      <div className="space-y-3.5 border-b border-gray-50 pb-5 mb-5 dark:border-gray-800/50 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Total Bill</span>
          <span className="font-semibold text-gray-900 dark:text-gray-50">₹{ledger.totalBillAmount ?? 0}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Total Paid</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{ledger.totalPaid ?? 0}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Total Refunded</span>
          <span className="font-semibold text-rose-500 dark:text-rose-400">₹{ledger.totalRefunded ?? 0}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-dashed border-gray-100 pt-3 dark:border-gray-800">
          <span className="text-gray-900 dark:text-gray-50">Remaining Balance</span>
          <span className={ledger.remainingBalance > 0 ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-gray-50"}>
            ₹{ledger.remainingBalance ?? 0}
          </span>
        </div>
      </div>

      {/* Gateway & Transaction metadata */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400 flex items-center gap-1 mt-0.5">
            <Hash className="h-3 w-3" />
            Razorpay ID
          </span>
          <span className="font-mono text-gray-700 dark:text-gray-400 text-right truncate max-w-[160px]">
            {gatewayPaymentId}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400 flex items-center gap-1 mt-0.5">
            <FileCheck className="h-3 w-3" />
            Transaction ID
          </span>
          <span className="font-mono text-gray-700 dark:text-gray-400 text-right truncate max-w-[160px]">
            {transactionId}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400 mt-0.5">Gateway Status</span>
          <span className="font-medium text-gray-700 dark:text-gray-400 capitalize">
            {ledger.lastTransactionStatus || "pending"}
          </span>
        </div>
      </div>
    </div>
  );
}
