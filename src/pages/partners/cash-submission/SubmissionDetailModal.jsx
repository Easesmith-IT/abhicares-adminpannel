import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatInstant } from "@/utils/dateTime";

const statusColor = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-600",
  REJECTED: "bg-red-600",
};

export function SubmissionDetailsModal({
  data,
  isOpen,setIsOpen
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Cashout ID */}
          <DetailItem label="Cashout ID" value={data.cashoutId} />

          {/* Wallet */}
          <DetailItem label="Wallet ID" value={data.sellerWalletId} />

          {/* Amount */}
          <DetailItem label="Amount" value={`₹${data.value}`} />

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge className={`${statusColor[data.status]} text-white`}>
              {data.status}
            </Badge>
          </div>

          {/* Payment ID */}
          <DetailItem
            label="Payment ID"
            value={data.accountDetails?.paymentId || "—"}
          />
          <DetailItem
            label="Remarks"
            value={data.accountDetails?.remarks || "—"}
          />

          {/* Description */}
          <DetailItem label="Description" value={data.description || "—"} />

          {/* Created */}
          <DetailItem label="Created At" value={formatInstant(data.createdAt, "dd MMM yyyy, hh:mm aa")} />

          {/* Updated */}
          <DetailItem label="Updated At" value={formatInstant(data.updatedAt, "dd MMM yyyy, hh:mm aa")} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* 🔹 Reusable Row */
function DetailItem({
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value || "-"}</span>
    </div>
  );
}

/* 🔹 Date Formatter */
