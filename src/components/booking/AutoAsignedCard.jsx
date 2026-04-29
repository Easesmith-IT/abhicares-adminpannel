import React from "react";
import { format, isValid, formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "../ui/badge";
import { RotateCcw } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (!isValid(date)) return "-";

  return `${format(date, "dd MMM yyyy • hh:mm aa")} (${formatDistanceToNow(
    date,
    {
      addSuffix: true,
    },
  )})`;
};

const AutoAssignedCard = ({ booking }) => {
  const retryCount = booking?.autoAssignRetryCount ?? 0;

  const maxRetry = booking?.autoAssignMaxRetry ?? 1;

  const retryPercent = Math.min(100, Math.round((retryCount / maxRetry) * 100));

  const remainingRetries = Math.max(0, maxRetry - retryCount);

  const isLocked =
    booking?.autoAssignLockUntil &&
    new Date(booking.autoAssignLockUntil) > new Date();

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Auto Assignment Engine
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex flex-wrap gap-3">
          <Badge
            variant={booking?.autoAssignExhausted ? "destructive" : "secondary"}
          >
            Exhausted:
            {booking?.autoAssignExhausted ? " Yes" : " No"}
          </Badge>

          <Badge
            variant={
              booking?.autoAssignAdminActionRequired ? "warning" : "success"
            }
          >
            Admin Action:
            {booking?.autoAssignAdminActionRequired
              ? " Required"
              : " Not Required"}
          </Badge>

          {isLocked && <Badge variant="secondary">Assignment Locked</Badge>}
        </div>

        {/* Retry Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-xl border p-5">
            <p className="text-xs text-muted-foreground">Retry Count</p>

            <h3 className="text-3xl font-bold mt-2">{retryCount}</h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-xs text-muted-foreground">Max Retry</p>

            <h3 className="text-3xl font-bold mt-2">{maxRetry}</h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-xs text-muted-foreground">Remaining</p>

            <h3 className="text-3xl font-bold mt-2">{remainingRetries}</h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-xs text-muted-foreground">Retry Usage</p>

            <h3 className="text-3xl font-bold mt-2">{retryPercent}%</h3>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Retry Utilization</span>

            <span>
              {retryCount}/{maxRetry}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{
                width: `${retryPercent}%`,
              }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">First Offered At</p>

            <p className="font-medium mt-2">
              {formatDate(booking?.autoAssignFirstOfferedAt)}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Last Attempt At</p>

            <p className="font-medium mt-2">
              {formatDate(booking?.autoAssignLastAttemptAt)}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Exhausted At</p>

            <p className="font-medium mt-2">
              {formatDate(booking?.autoAssignExhaustedAt)}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Lock Until</p>

            <p className="font-medium mt-2">
              {booking?.autoAssignLockUntil
                ? formatDate(booking.autoAssignLockUntil)
                : "No Active Lock"}
            </p>
          </div>
        </div>

        {/* Lock Token */}
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground mb-2">Lock Token</p>

          <p className="font-mono text-sm break-all">
            {booking?.autoAssignLockToken || "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoAssignedCard;
