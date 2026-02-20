"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RefundInfoCard({ order }) {
  const refund = order?.refundInfo;
  const transaction = order?.transactionDetails;
  const additional = order?.additionalInfo;

  if (!refund) return null;

  const statusColor =
    refund.status === "processed"
      ? "bg-green-600"
      : refund.status === "failed"
        ? "bg-red-600"
        : "bg-yellow-500";

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Refund Information
          <Badge className={statusColor}>{refund.status?.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Basic Refund Info */}
        <div className="grid grid-cols-2 gap-4">
          <Info label="Refund Amount" value={`₹ ${refund.amount}`} />
          <Info
            label="Refund % "
            value={
              refund.refundPercentage ? `${refund.refundPercentage}%` : "-"
            }
          />
          <Info label="Refund ID" value={refund.refundId} />
          <Info
            label="Processed At"
            value={
              refund.processedAt
                ? format(new Date(refund.processedAt), "dd MMM yyyy, hh:mm a")
                : "-"
            }
          />
        </div>

        {/* Reason */}
        <div>
          <p className="font-medium text-muted-foreground">Reason</p>
          <p className="mt-1">{refund.reason || "-"}</p>
        </div>

        {/* Transaction Details */}
        {transaction && (
          <div className="border-t pt-4 space-y-2">
            <p className="font-medium">Transaction Details</p>

            <div className="grid grid-cols-2 gap-4">
              <Info
                label="Gateway Response"
                value={transaction.gatewayResponse}
              />
              <Info
                label="Processed At"
                value={
                  transaction.processedAt
                    ? format(
                        new Date(transaction.processedAt),
                        "dd MMM yyyy, hh:mm a",
                      )
                    : "-"
                }
              />
            </div>
          </div>
        )}

        {/* Additional Info */}
        {additional && (
          <div className="border-t pt-4 space-y-2">
            <p className="font-medium">Additional Info</p>

            <Info label="Method" value={additional.method} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium break-all">{value || "-"}</p>
  </div>
);
