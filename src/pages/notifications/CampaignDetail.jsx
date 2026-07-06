import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import useGetApiReq from "../../hooks/useGetApiReq";
import { Skeleton } from "../../components/ui/skeleton";
import { formatInstant } from "@/utils/dateTime";

const DUMMY_CAMPAIGN = {
  id: "1",
  title: "Festive Offer Push",
  body: "Get up to 50% off on all services this festive season!",
  image_url: "https://via.placeholder.com/300x150",
  target_type: "customer",
  cities: ["Mumbai", "Delhi"],
  scheduled_at: "2026-03-25T10:00:00Z",
  status: "pending",
  stats: {
    total: 1200,
    sent: 800,
    pending: 300,
    failed: 100,
  },
};

const DUMMY_LOGS = [
  {
    user_id: "U123",
    status: "sent",
    error_message: null,
    sent_at: "2026-03-25T10:01:00Z",
  },
  {
    user_id: "U124",
    status: "failed",
    error_message: "Invalid device token",
    sent_at: "2026-03-25T10:02:00Z",
  },
  {
    user_id: "U125",
    status: "pending",
    error_message: null,
    sent_at: null,
  },
  {
    user_id: "U126",
    status: "sent",
    error_message: null,
    sent_at: "2026-03-25T10:03:00Z",
  },
  {
    user_id: "U127",
    status: "failed",
    error_message: "Push service timeout",
    sent_at: "2026-03-25T10:04:00Z",
  },
];

export default function CampaignDetail() {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);

  const { res, isLoading, fetchData } = useGetApiReq();

  const fetchCampaign = async () => {
    fetchData(`/notifications/notification/${id}`, {
      screenName: "CampaignDetail",
    });
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      
      setCampaign(res.data.data); // ✅ correct mapping
    }
  }, [res]);

  if (isLoading) {
    return (
      <Wrapper>
        <CampaignSkeleton />
      </Wrapper>
    );
  }

  if (!campaign) {
    return (
      <Wrapper>
        <div className="space-y-6 max-w-7xl mx-auto p-4">
          <BackLink href={-1}></BackLink>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 font-medium">Campaign not found</p>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}></BackLink>
        {/* 🔹 Campaign Info */}
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <p className="text-gray-700">{campaign.body}</p>

            {campaign.image_url && (
              <img src={campaign.image_url} className="rounded h-40" alt="" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <strong>Total Users:</strong> {campaign.total_users}
              </p>
              <p>
                <strong>Sent Count:</strong> {campaign.sent_count}
              </p>
              <p>
                <strong>Failed Count:</strong> {campaign.failed_count}
              </p>
              <p>
                <strong>Audience:</strong> {campaign.target_type}
              </p>

              <p>
                <strong>Cities:</strong> {campaign.cities?.join(", ") || "All"}
              </p>

              <p>
                <strong>Scheduled:</strong>{" "}
                {campaign.scheduled_at
                  ? formatInstant(campaign.scheduled_at, "dd MMM yyyy, hh:mm aa")
                  : "Immediate"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={campaign.status} />
              </p>
            </div>

            {campaign.error_summary && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <strong>Failure Reason:</strong> {campaign.error_summary}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🔹 Stats */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={campaign.stats?.total} />
          <StatCard label="Sent" value={campaign.stats?.sent} />
          <StatCard label="Pending" value={campaign.stats?.pending} />
          <StatCard label="Failed" value={campaign.stats?.failed} />
        </div> */}
      </div>
    </Wrapper>
  );
}

/* 🔹 Stat Card */
function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold">{value || 0}</p>
      </CardContent>
    </Card>
  );
}

/* 🔹 Status Badge */
function StatusBadge({ status }) {
  const variants = {
    sent: "default",
    pending: "secondary",
    failed: "destructive",
  };

  return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
}

function CampaignSkeleton() {
  return (
    <div className="space-y-6">
      {/* Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>

        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <Skeleton className="h-40 w-full rounded" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
}
