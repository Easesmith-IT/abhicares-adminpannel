import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  User,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const getResponseMinutes = (offeredAt, respondedAt) => {
  if (!offeredAt || !respondedAt) return "-";

  const diff =
    (new Date(respondedAt) - new Date(offeredAt)) / 60000;

  return `${Math.round(diff)} mins`;
};

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
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

export default function PartnerOfferedBookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const offer = state?.offer;
  console.log("offer", offer);
  

  if (!offer) {
    navigate(-1);
    return null;
  }

  const booking = offer?.booking;
  const seller = booking?.sellerId;
  const customer = booking?.userId;

  const summaryCards = [
    {
      label: "Response Time",
      value: getResponseMinutes(
        offer.offeredAt,
        offer.respondedAt
      ),
    },
    {
      label: "Admin Visible",
      value: offer.adminVisible ? "Yes" : "No",
    },
    {
      label: "Auto Events",
      value: offer.autoAssignEvents?.length || 0,
    },
    {
      label: "Release Request",
      value: offer.releaseRequest ? "Present" : "None",
    },
  ];

  return (
    <Wrapper>
      <div className="py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <BackLink href={-1}>
              <H2>Offered Booking Details</H2>
            </BackLink>

            <p className="text-muted-foreground mt-2">{booking?.bookingId}</p>

            <p className="text-xs text-muted-foreground mt-1">
              Offer ID: {offer?.offerId}
            </p>
          </div>

          <Badge
            variant={getStatusVariant(offer?.offerStatus)}
            className="capitalize px-4 py-2"
          >
            {offer?.offerStatus}
          </Badge>
        </div>

        {/* REJECTION ALERT */}
        {offer?.offerStatus === "rejected" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-5 w-5" />

                <div>
                  <h3 className="font-semibold text-lg">Offer Rejected</h3>

                  <p className="mt-2">
                    Reject Reason:
                    <span className="font-semibold ml-2">
                      {offer.rejectReason}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SUMMARY */}
        <div className="grid md:grid-cols-4 gap-5">
          {summaryCards.map((item) => (
            <Card key={item.label} className="rounded-2xl shadow-md border-0">
              <CardContent className="p-6 py-2">
                <p className="text-sm text-muted-foreground">{item.label}</p>

                <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BOOKING + SELLER INFO */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <User />
              <h3 className="text-xl font-semibold">Booking Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Partner">{seller?.name}</Info>

              <Info label="Partner ID">
                <Link
                  className="hover:text-blue-700 hover:underline font-medium"
                  to={`/admin/bookings/${seller?._id}`}
                >
                  {seller?.partnerId}
                </Link>
              </Info>

              <Info label="Partner Phone">{seller?.phone}</Info>

              <Info label="Customer">{customer?.name}</Info>

              <Info label="Customer Phone">{customer?.phone}</Info>

              <Info label="Booking Status">{booking?.status}</Info>

              <Info label="Booking Date">
                {formatDate(booking?.bookingDate)}
              </Info>

              <Info label="Booking Time">
                {formatDate(booking?.bookingTime)}
              </Info>

              <Info label="Assigned Seller">
                {booking?.assignedSellerId ? "Assigned" : "Not Assigned"}
              </Info>
            </div>
          </CardContent>
        </Card>

        {/* OFFER DETAILS */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Offer Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Offered At">{formatDate(offer?.offeredAt)}</Info>

              <Info label="Responded At">{formatDate(offer?.respondedAt)}</Info>

              <Info label="Expires At">{formatDate(offer?.expiresAt)}</Info>

              <Info label="Response Duration">
                {getResponseMinutes(offer?.offeredAt, offer?.respondedAt)}
              </Info>
            </div>
          </CardContent>
        </Card>

        {/* REASON META */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck />
              <h3 className="text-xl font-semibold">Reason Metadata</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Offer Reject Reason">
                {offer?.reasonMeta?.offerRejectReason || "-"}
              </Info>

              <Info label="Release Reason">
                {offer?.reasonMeta?.releaseReason || "-"}
              </Info>

              <Info label="Admin Note">
                {offer?.reasonMeta?.adminNote || "-"}
              </Info>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Event Reasons
              </p>

              {offer?.reasonMeta?.eventReasons?.length ? (
                <div className="space-y-4">
                  {offer.reasonMeta.eventReasons.map((event, i) => (
                    <div key={i} className="rounded-xl border p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Info label="Event Type">{event?.eventType}</Info>

                        <Info label="Reason">{event?.reason}</Info>

                        <Info label="Created At">
                          {formatDate(event?.createdAt)}
                        </Info>

                        {/* <Info label="Metadata">
                          {event?.metadata
                            ? JSON.stringify(event.metadata)
                            : "-"}
                        </Info> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No event reasons</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AUTO EVENTS */}
        {/* <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity />
              <h3 className="text-xl font-semibold">Auto Assign Events</h3>
            </div>

            {!offer?.autoAssignEvents?.length ? (
              <p className="text-muted-foreground">
                No auto assignment events recorded.
              </p>
            ) : (
              <div className="space-y-4">
                {offer.autoAssignEvents.map((event, i) => (
                  <pre
                    key={i}
                    className="bg-muted rounded-xl p-5 text-sm overflow-auto"
                  >
                    {JSON.stringify(event, null, 2)}
                  </pre>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* TIMELINE */}
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Timeline</h3>

            <div className="space-y-6">
              <TimelineItem
                icon={Clock3}
                title="Booking Created"
                time={booking?.createdAt}
              />

              <TimelineItem
                icon={Clock3}
                title="Offer Generated"
                time={offer?.offeredAt}
              />

              {offer?.respondedAt && (
                <TimelineItem
                  icon={CheckCircle2}
                  title="Seller Responded"
                  time={offer?.respondedAt}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

function Info({ label, children }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="font-medium mt-1">
        {children || "-"}
      </p>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  time,
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="text-sm text-muted-foreground">
          {formatDate(time)}
        </p>
      </div>
    </div>
  );
}
