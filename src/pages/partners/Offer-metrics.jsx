import React, { useEffect } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const cards = [
  {
    key: "totalOffered",
    label: "Total Offers",
    icon: User,
  },
  {
    key: "accepted",
    label: "Accepted",
    icon: CheckCircle2,
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
  },
  {
    key: "expired",
    label: "Expired",
    icon: Clock3,
  },
  {
    key: "rejectionRate",
    label: "Rejection Rate %",
    icon: ShieldAlert,
  },
  {
    key: "ignoredRate",
    label: "Ignored Rate %",
    icon: Clock3,
  },
  {
    key: "postAcceptReleaseRequestRate",
    label: "Release Request %",
    icon: RotateCcw,
  },
  {
    key: "postAcceptReleaseApprovedRate",
    label: "Release Approved %",
    icon: CheckCircle2,
  },
];

const getRiskMeta = (stats) => {
  if (!stats) {
    return {
      label: "—",
      tone: "text-muted-foreground",
    };
  }

  if (stats.postAcceptReleaseRequestRate > 50 || stats.ignoredRate > 25) {
    return {
      label: "High Risk",
      tone: "text-destructive",
    };
  }

  if (stats.rejectionRate > 15 || stats.postAcceptReleaseApprovedRate > 50) {
    return {
      label: "Medium Risk",
      tone: "text-amber-500",
    };
  }

  return {
    label: "Low Risk",
    tone: "text-green-600",
  };
};

const OfferMetrics = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const { partnerId } = useParams();

  const stats = res?.data?.data || {};
  const risk = getRiskMeta(stats);

  console.log("res?.data", res?.data);

  useEffect(() => {
    if (!partnerId) return;

    fetchData(`/admin/seller-offer-stats/${partnerId}`, {
      screenName: "SellerOfferStats",
      severity: "LOW",
      userType: "Admin",
    });
  }, [partnerId]);

  return (
    <Wrapper>
      <div className="space-y-8">
        <BackLink href={-1}>
          <H2>Seller Offer Metrics</H2>
        </BackLink>

        {/* Overview */}
        <div className="grid md:grid-cols-4 gap-5">
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Total Offered
              </p>
              <p className="text-4xl font-bold">{stats.totalOffered}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Total Responded
              </p>
              <p className="text-4xl font-bold">{stats.totalResponded}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Accepted</p>
              <p className="text-4xl font-bold">{stats.accepted}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Expired</p>
              <p className="text-4xl font-bold">{stats.expired}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Response Metrics */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Response Metrics</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Rejected</span>
                <strong>{stats.rejected}</strong>
              </div>

              <div className="flex justify-between">
                <span>Rejection Rate</span>
                <strong>{stats.rejectionRate}%</strong>
              </div>

              <div className="flex justify-between">
                <span>Ignored Rate</span>
                <strong>{stats.ignoredRate}%</strong>
              </div>

              <div className="flex justify-between">
                <span>Pre Accept Rejection Rate</span>
                <strong>{stats.preAcceptRejectionRate}%</strong>
              </div>
            </CardContent>
          </Card>

          {/* Release Request Metrics */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Release Request Metrics</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Release Requests</span>
                <strong>{stats.totalReleaseRequests}</strong>
              </div>

              <div className="flex justify-between">
                <span>Approved Releases Requests</span>
                <strong>{stats.approvedReleaseRequests}</strong>
              </div>

              <div className="flex justify-between">
                <span>Post Accept Release Request Rate</span>
                <strong>{stats.postAcceptReleaseRequestRate}%</strong>
              </div>

              <div className="flex justify-between">
                <span>Post Accept Release Approved Rate</span>
                <strong>{stats.postAcceptReleaseApprovedRate}%</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default OfferMetrics;
