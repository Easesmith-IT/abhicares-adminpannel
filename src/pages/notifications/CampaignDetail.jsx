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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(`/api/notifications/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    setLoading(true);

    // simulate API delay
    setTimeout(() => {
      setCampaign(DUMMY_CAMPAIGN);
      //   setLogs(DUMMY_LOGS);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading || !campaign) return <p>Loading...</p>;

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}></BackLink>
        {/* 🔹 Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle>{campaign.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-700">{campaign.body}</p>

            {campaign.image_url && (
              <img src={campaign.image_url} className="rounded h-40" alt="" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <strong>Audience:</strong> {campaign.target_type}
              </p>

              <p>
                <strong>Cities:</strong> {campaign.cities?.join(", ") || "All"}
              </p>

              <p>
                <strong>Scheduled:</strong>{" "}
                {campaign.scheduled_at
                  ? new Date(campaign.scheduled_at).toLocaleString()
                  : "Immediate"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={campaign.status} />
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 🔹 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={campaign.stats?.total} />
          <StatCard label="Sent" value={campaign.stats?.sent} />
          <StatCard label="Pending" value={campaign.stats?.pending} />
          <StatCard label="Failed" value={campaign.stats?.failed} />
        </div>
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
