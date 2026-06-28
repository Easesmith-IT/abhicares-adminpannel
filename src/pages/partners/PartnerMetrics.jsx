import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock3,
  Percent,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import useGetApiReq from "../../hooks/useGetApiReq";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import usePostApiReq from "../../hooks/usePostApiReq";

const metricsData = {
  acceptanceRate: 0,
  acceptedOffers: 0,
  approvedRejectRequests: 0,
  completedBookings: 0,
  completionRate: 0,
  expiredOffers: 0,
  offerExpiryRate: 0,
  offerRejectionRate: 0,
  rejectRequests: 0,
  rejectedOffers: 0,
  releaseApprovalRate: 0,
  releaseRequestRate: 0,
  totalAssignedBookings: 0,
  totalOffers: 0,
};
const PartnerMetrics = ({ metrics = metricsData }) => {
  const { res, fetchData, isLoading } = usePostApiReq();
  const { partnerId } = useParams();

  const stats = [
    {
      title: "Assigned Bookings",
      value: metrics.totalAssignedBookings,
      icon: Briefcase,
    },
    {
      title: "Completed",
      value: metrics.completedBookings,
      icon: CheckCircle2,
    },
    {
      title: "Offers Accepted",
      value: metrics.acceptedOffers,
      icon: BadgeCheck,
    },
    {
      title: "Reject Requests",
      value: metrics.rejectRequests,
      icon: ShieldCheck,
    },
  ];

  const rates = [
    {
      label: "Acceptance Rate",
      value: metrics.acceptanceRate,
      color: "bg-green-500",
    },
    {
      label: "Completion Rate",
      value: metrics.completionRate,
      color: "bg-blue-500",
    },
    {
      label: "Offer Expiry",
      value: metrics.offerExpiryRate,
      color: "bg-amber-500",
    },
    {
      label: "Offer Rejection",
      value: metrics.offerRejectionRate,
      color: "bg-red-500",
    },
    {
      label: "Release Approval",
      value: metrics.releaseApprovalRate,
      color: "bg-purple-500",
    },
  ];

  const recalculateMetrics = () => {
    fetchData(`/admin/recalculate-seller-metrics/${partnerId}`);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
    }
  }, [res]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <p className="text-muted-foreground text-sm">
              Partner performance and offer analytics
            </p>
          </div>
        </div>
        <Button
          className=""
          variant="abhicares"
          disabled={isLoading}
          onClick={recalculateMetrics}
        >
          {isLoading ? <Spinner /> : "Recalculate Metrics"}
        </Button>
      </div>

      {/* Top KPI cards */}
      <div className="grid md:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="rounded-2xl border-0 shadow-md bg-gradient-to-br from-white to-slate-50"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <Badge variant="secondary">Live</Badge>
                </div>

                <h3 className="text-3xl font-bold">{item.value}</h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {item.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rates Section */}
      <Card className="rounded-2xl shadow-md border-0">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Performance Rates</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rates.map((rate) => (
              <div key={rate.label} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{rate.label}</span>
                  <span className="font-semibold">{rate.value}%</span>
                </div>

                <Progress value={rate.value} className="h-3 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Offer Funnel */}
      <div className="grid md:grid-cols-4 gap-5">
        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-6 text-center">
            <Briefcase className="mx-auto mb-3 text-blue-600" />
            <p className="text-4xl font-bold">{metrics.totalOffers}</p>
            <h4 className="text-sm text-muted-foreground mb-2">Total Offers</h4>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-green-600" />
            <p className="text-4xl font-bold">{metrics.acceptedOffers}</p>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-6 text-center">
            <Clock3 className="mx-auto mb-3 text-amber-500" />
            <p className="text-4xl font-bold">{metrics.expiredOffers}</p>
            <p className="text-sm text-muted-foreground">Expired</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-0">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto mb-3 text-red-500" />
            <p className="text-4xl font-bold">{metrics.rejectedOffers}</p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerMetrics;
