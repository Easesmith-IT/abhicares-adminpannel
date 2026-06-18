import { format } from "date-fns";
import { AlertCircle, Calendar, Hash, ShieldAlert, BadgeCent } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RefundInfoCard({ order }) {
  const refund = order?.refundInfo;
  const transaction = order?.transactionDetails;
  const additional = order?.additionalInfo;

  if (!refund || !refund.status) return null;

  const status = refund.status.toLowerCase();
  const statusColorMap = {
    processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const statusColor = statusColorMap[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/10 p-6 shadow-sm dark:border-rose-950/20 dark:bg-rose-950/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <h3 className="font-semibold text-rose-900 dark:text-rose-300">Refund Ledger</h3>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColor}`}>
          {refund.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        {/* Core numbers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-3 border border-rose-100/30 dark:bg-gray-900 dark:border-rose-950/25">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Refunded Amount</span>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">₹{refund.amount || "0"}</p>
          </div>
          <div className="rounded-xl bg-white p-3 border border-rose-100/30 dark:bg-gray-900 dark:border-rose-950/25">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Refund Ratio</span>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mt-1">
              {refund.refundPercentage ? `${refund.refundPercentage}%` : "-"}
            </p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-3 pt-3 border-t border-rose-100/20 dark:border-rose-950/20 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Refund ID
            </span>
            <span className="font-mono text-gray-800 dark:text-gray-300 select-all">{refund.refundId || "-"}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Processed At
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-300">
              {refund.processedAt
                ? format(new Date(refund.processedAt), "dd MMM yyyy, hh:mm a")
                : "-"}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-400 shrink-0">Reason</span>
            <span className="text-gray-800 dark:text-gray-300 text-right leading-relaxed max-w-[180px]">
              {refund.reason || "Customer dissatisfaction / operational cancel."}
            </span>
          </div>
        </div>

        {/* Transaction Details */}
        {transaction && (
          <div className="border-t border-rose-100/20 pt-4 dark:border-rose-950/20 text-xs space-y-3">
            <h4 className="font-semibold text-rose-800 dark:text-rose-400">Transaction Details</h4>
            
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-400">Gateway Response</span>
              <span className="text-gray-800 dark:text-gray-300 text-right leading-relaxed max-w-[180px]">
                {transaction.gatewayResponse || "-"}
              </span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Gateway Process Date</span>
              <span className="font-medium text-gray-800 dark:text-gray-300">
                {transaction.processedAt
                  ? format(new Date(transaction.processedAt), "dd MMM yyyy, hh:mm a")
                  : "-"}
              </span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {additional && additional.method && (
          <div className="border-t border-rose-100/20 pt-4 dark:border-rose-950/20 text-xs flex justify-between">
            <span className="text-gray-400">Disbursement Method</span>
            <span className="font-semibold text-gray-800 dark:text-gray-300">{additional.method}</span>
          </div>
        )}
      </div>
    </div>
  );
}
