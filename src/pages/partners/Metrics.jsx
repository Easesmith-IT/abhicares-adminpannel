import React, { useEffect, useState } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  TrendingUp,
  Timer,
  AlertTriangle,
  RotateCcw,
  Send,
  MapPinned,
} from "lucide-react";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const metricCards = [
  {
    key: "attempts",
    label: "Total Attempts",
    icon: Send,
  },
  {
    key: "offers",
    label: "Offers Sent",
    icon: TrendingUp,
  },
  {
    key: "autoAssignSuccessRate",
    label: "Auto Assign Success Rate %",
    icon: TrendingUp,
  },
  {
    key: "timeoutRate",
    label: "Timeout Rate %",
    icon: Timer,
  },
  {
    key: "noCandidateRate",
    label: "No Candidate Rate %",
    icon: AlertTriangle,
  },
  {
    key: "avgRetriesBeforeAssign",
    label: "Avg Retries Before Assign",
    icon: RotateCcw,
  },
  {
    key: "avgTimeToFirstOfferMinutes",
    label: "Avg Time to First Offer (mins)",
    icon: Timer,
  },
];

const Metrics = () => {
  const [days, setDays] = useState("7");

  const { res, fetchData, isLoading } = useGetApiReq();

  const metrics = res?.data?.data || {};
  //   const [metrics, setMetrics] = useState({})

  const loadMetrics = async (selectedDays = days) => {
    await fetchData(`/admin/auto-assign-metrics?days=${selectedDays}`, {
      screenName: "AutoAssignMetrics",
      severity: "LOW",
      userType: "Admin",
    });
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res?.data", res?.data);
    }
  }, [res]);

  const handleDaysChange = (value) => {
    setDays(value);
    loadMetrics(value);
  };

  return (
    <Wrapper>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <BackLink href={-1}>
              <H2>Auto Assign Metrics</H2>

              <p className="text-muted-foreground mt-1">
                Performance and assignment diagnostics
              </p>
            </BackLink>
          </div>

          <Select value={days} onValueChange={handleDaysChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">Last 1 Day</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.key} className="rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="text-4xl font-bold">
                    {isLoading ? "--" : (metrics?.[item.key] ?? 0)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Diagnostics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Auto Assign Success Rate</span>
                <strong>{metrics.autoAssignSuccessRate || 0}%</strong>
              </div>

              <div className="flex justify-between">
                <span>Timeout Rate</span>
                <strong>{metrics.timeoutRate || 0}%</strong>
              </div>

              <div className="flex justify-between">
                <span>No Candidate Rate</span>
                <strong>{metrics.noCandidateRate || 0}%</strong>
              </div>

              <div className="flex justify-between">
                <span>Avg Retries Before Assign</span>
                <strong>{metrics.avgRetriesBeforeAssign || 0}</strong>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <MapPinned className="h-5 w-5" />
                No Candidate Hotspots
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!metrics?.noCandidateByCityService ||
              Object.keys(metrics.noCandidateByCityService).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No no-candidate failures found.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(metrics.noCandidateByCityService).map(
                    ([key, count]) => (
                      <div
                        key={key}
                        className="rounded-xl bg-muted p-4 flex justify-between"
                      >
                        <span className="text-sm break-all">{key}</span>

                        <strong>{count}</strong>
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default Metrics;
