import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  BarChart3,
  Scale,
} from "lucide-react";
import { formatInstant } from "@/utils/dateTime";

const getResponseTime = (offeredAt, respondedAt) => {
  if (!offeredAt || !respondedAt) return "-";

  const diffMs = new Date(respondedAt) - new Date(offeredAt);

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  return `${minutes} min ${seconds} sec`;
};

const statusVariant = (status) => {
  switch (status) {
    case "accepted":
      return "success";
    case "rejected":
      return "destructive";
    case "expired":
      return "outline";
    default:
      return "secondary";
  }
};

const formatLabel = (str) =>
  str?.replace(/([A-Z])/g, " $1")?.replace(/^./, (c) => c.toUpperCase());

const OfferedBookingDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const offer = state?.offer;

  if (!offer) {
    navigate("/admin/offered-bookings");
    return null;
  }

  const scoreCards = [
    ["Workload", offer?.scoreBreakdown?.workloadScore],
    ["Fairness", offer?.scoreBreakdown?.fairnessScore],
    ["Acceptance", offer?.scoreBreakdown?.acceptanceScore],
    ["Completion", offer?.scoreBreakdown?.completionScore],
    ["Rating Review", offer?.scoreBreakdown?.ratingReviewScore],
    ["Distance", offer?.scoreBreakdown?.distanceScore],
  ];

  const weights = Object.entries(offer?.weightsSnapshot || {});

  return (
    <Wrapper>
      <div className="py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackLink href={-1}>
              <H2>Offered Booking Details</H2>

              <p className="text-muted-foreground">
                Booking {offer?.bookingId?.bookingId}
              </p>
            </BackLink>
          </div>

          <Badge
            variant={statusVariant(offer?.status)}
            className="text-sm px-4 py-2 capitalize"
          >
            {offer?.status}
          </Badge>
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-4 gap-5">
          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-6 py-1">
              <p className="text-muted-foreground text-sm">Offer Score</p>

              <h3 className="text-4xl font-bold mt-2">{offer?.score || 0}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-6 py-1">
              <p className="text-muted-foreground text-sm">Attempt No</p>

              <h3 className="text-4xl font-bold mt-2">#{offer?.attemptNo}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-6 py-1">
              <p className="text-muted-foreground text-sm">Source</p>

              <h3 className="text-2xl font-semibold mt-3 uppercase">
                {offer?.source}
              </h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">Response Time</p>

              <h3 className="text-2xl font-semibold mt-3">
                {getResponseTime(offer?.offeredAt, offer?.respondedAt)}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* OFFER INFO */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <h3 className="font-semibold text-xl mb-6">Offer Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm">Seller</p>

                <p className="font-medium mt-1">{offer?.sellerId?.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Offered At</p>

                <p className="font-medium mt-1">
                  {formatInstant(offer?.offeredAt, "dd MMM yyyy, hh:mm aa")}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Responded At</p>

                <p className="font-medium mt-1">
                  {formatInstant(offer?.respondedAt, "dd MMM yyyy, hh:mm aa")}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Idempotency Key</p>

                <p className="font-medium mt-1 break-all">
                  {offer?.idempotencyKey || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SCORE BREAKDOWN */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 />
              <h3 className="text-xl font-semibold">
                Algorithm Score Breakdown
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {scoreCards.map(([label, val]) => (
                <div key={label} className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">{label}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-3xl font-bold">{val || 0}</span>

                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${val}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* WEIGHTS */}
        {weights.length > 0 && (
          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Scale />
                <h3 className="text-xl font-semibold">Weight Snapshot</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {weights.map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b pb-3">
                    <span>{formatLabel(k)}</span>

                    <span className="font-semibold">{v * 100}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* REASON CODES */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-5">
              Assignment Reason Codes
            </h3>

            <div className="flex flex-wrap gap-3 mb-6">
              {offer?.reasonCodes?.map((code) => (
                <Badge key={code} variant="outline" className="px-4 py-2">
                  {code}
                </Badge>
              ))}
            </div>

            <div className="rounded-xl bg-muted p-5">
              <p className="text-sm text-muted-foreground">Assignment Reason</p>

              <p className="font-medium mt-2">
                {offer?.assignmentReason || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ELIGIBILITY */}
        {offer?.eligibilitySnapshot?.length > 0 && (
          <Card className="rounded-2xl shadow-md border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck />
                <h3 className="text-xl font-semibold">Eligibility Snapshot</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {Object.entries(offer?.eligibilitySnapshot || {}).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between rounded-xl border p-4"
                    >
                      <span>{formatLabel(key)}</span>

                      <Badge variant={val ? "success" : "destructive"}>
                        {val ? "Yes" : "No"}
                      </Badge>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TIMELINE */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Offer Timeline</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">Offer Generated</p>

                  <p className="text-sm text-muted-foreground">
                    {formatInstant(offer?.offeredAt, "dd MMM yyyy, hh:mm aa")}
                  </p>
                </div>
              </div>

              {offer?.respondedAt && (
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">Seller Response</p>

                    <p className="text-sm text-muted-foreground">
                      {formatInstant(offer?.respondedAt, "dd MMM yyyy, hh:mm aa")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
};

export default OfferedBookingDetails;
