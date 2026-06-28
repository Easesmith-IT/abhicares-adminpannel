import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MapPinned,
  RotateCcw,
  Send,
  ShieldAlert,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";

import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { axiosInstance } from "../../utils/axiosInstance";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS_OPTIONS = [
  { value: "1", label: "Last 1 Day" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
];

const metricCards = [
  {
    key: "attempts",
    label: "Assignment Attempts",
    icon: Send,
    description: "Total auto-assign cycles triggered in the selected period.",
    tone: "slate",
  },
  {
    key: "offers",
    label: "Offers Sent",
    icon: TrendingUp,
    description: "Partner offers pushed out from the assignment engine.",
    tone: "blue",
  },
  {
    key: "autoAssignSuccessRate",
    label: "Success Rate",
    icon: Target,
    suffix: "%",
    description: "Share of attempts that successfully reached an assignment outcome.",
    tone: "emerald",
  },
  {
    key: "timeoutRate",
    label: "Timeout Rate",
    icon: Timer,
    suffix: "%",
    description: "Assignments that expired before a usable response was captured.",
    tone: "amber",
  },
  {
    key: "noCandidateRate",
    label: "No Candidate Rate",
    icon: AlertTriangle,
    suffix: "%",
    description: "Attempts that failed because no eligible partner pool was found.",
    tone: "rose",
  },
  {
    key: "avgRetriesBeforeAssign",
    label: "Average Retries",
    icon: RotateCcw,
    decimals: 1,
    description: "How many retries the engine needed before assignment or closure.",
    tone: "violet",
  },
  {
    key: "avgTimeToFirstOfferMinutes",
    label: "Time To First Offer",
    icon: Timer,
    suffix: " mins",
    decimals: 1,
    description: "Average delay before the first partner offer was sent.",
    tone: "cyan",
  },
];

const summaryRows = [
  {
    key: "autoAssignSuccessRate",
    label: "Auto assign success",
    description: "Healthy systems keep this high and steady.",
    tone: "emerald",
  },
  {
    key: "timeoutRate",
    label: "Timeout exposure",
    description: "Elevated values usually indicate response or batching delays.",
    tone: "amber",
  },
  {
    key: "noCandidateRate",
    label: "Supply gap risk",
    description: "High values mean the city-service pool is too thin or filtered out.",
    tone: "rose",
  },
  {
    key: "avgRetriesBeforeAssign",
    label: "Retry pressure",
    description: "Tracks how much rework the engine needs to close assignments.",
    tone: "violet",
  },
];

const toneClasses = {
  slate: {
    card: "border-slate-200 bg-white",
    iconWrap: "bg-slate-100 text-slate-700",
    accent: "bg-slate-700",
    text: "text-slate-700",
    soft: "bg-slate-100",
  },
  blue: {
    card: "border-blue-200 bg-gradient-to-br from-white to-blue-50/70",
    iconWrap: "bg-blue-100 text-blue-700",
    accent: "bg-blue-600",
    text: "text-blue-700",
    soft: "bg-blue-100/80",
  },
  emerald: {
    card: "border-emerald-200 bg-gradient-to-br from-white to-emerald-50/70",
    iconWrap: "bg-emerald-100 text-emerald-700",
    accent: "bg-emerald-600",
    text: "text-emerald-700",
    soft: "bg-emerald-100/80",
  },
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-white to-amber-50/70",
    iconWrap: "bg-amber-100 text-amber-700",
    accent: "bg-amber-500",
    text: "text-amber-700",
    soft: "bg-amber-100/80",
  },
  rose: {
    card: "border-rose-200 bg-gradient-to-br from-white to-rose-50/70",
    iconWrap: "bg-rose-100 text-rose-700",
    accent: "bg-rose-600",
    text: "text-rose-700",
    soft: "bg-rose-100/80",
  },
  violet: {
    card: "border-violet-200 bg-gradient-to-br from-white to-violet-50/70",
    iconWrap: "bg-violet-100 text-violet-700",
    accent: "bg-violet-600",
    text: "text-violet-700",
    soft: "bg-violet-100/80",
  },
  cyan: {
    card: "border-cyan-200 bg-gradient-to-br from-white to-cyan-50/70",
    iconWrap: "bg-cyan-100 text-cyan-700",
    accent: "bg-cyan-600",
    text: "text-cyan-700",
    soft: "bg-cyan-100/80",
  },
};

const formatMetricValue = (value, { suffix = "", decimals = 0 } = {}) => {
  const numericValue = Number(value || 0);
  const rendered =
    decimals > 0 ? numericValue.toFixed(decimals) : Math.round(numericValue).toString();

  return `${rendered}${suffix}`;
};

const clampPercent = (value) => {
  const numericValue = Number(value || 0);
  return Math.max(0, Math.min(100, numericValue));
};

const compactReference = (value) => {
  if (!value) return "Unknown";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
};

const parseHotspotKey = (key) => {
  if (!key) {
    return { cityRef: "", serviceRef: "" };
  }

  if (/^[0-9a-fA-F]{48}$/.test(key)) {
    return {
      cityRef: key.slice(0, 24),
      serviceRef: key.slice(24),
    };
  }

  for (const separator of ["::", "|", ":"]) {
    if (key.includes(separator)) {
      const [cityRef, serviceRef] = key.split(separator);
      return {
        cityRef: cityRef || "",
        serviceRef: serviceRef || "",
      };
    }
  }

  return {
    cityRef: key,
    serviceRef: "",
  };
};

const getSystemStatus = (metrics) => {
  const successRate = Number(metrics?.autoAssignSuccessRate || 0);
  const noCandidateRate = Number(metrics?.noCandidateRate || 0);
  const timeoutRate = Number(metrics?.timeoutRate || 0);

  if (noCandidateRate >= 60 || timeoutRate >= 35) {
    return {
      label: "Needs Attention",
      variant: "destructive",
      helper: "Supply or timeout pressure is materially affecting auto assignment.",
    };
  }

  if (successRate >= 60 && noCandidateRate <= 25 && timeoutRate <= 15) {
    return {
      label: "Stable",
      variant: "success",
      helper: "Assignment coverage looks operationally healthy for this window.",
    };
  }

  return {
    label: "Watch Closely",
    variant: "inprogress",
    helper: "Performance is mixed. Review hotspots and retry behavior below.",
  };
};

const getPrimaryInsight = (metrics) => {
  const noCandidateRate = Number(metrics?.noCandidateRate || 0);
  const timeoutRate = Number(metrics?.timeoutRate || 0);
  const retries = Number(metrics?.avgRetriesBeforeAssign || 0);

  if (noCandidateRate >= 60) {
    return "Most assignment failures are caused by missing eligible candidates, not slow responses.";
  }

  if (timeoutRate >= 25) {
    return "Timeouts are a primary failure driver. Review partner responsiveness and queue windows.";
  }

  if (retries >= 4) {
    return "The engine is working too hard to land assignments. Retry pressure is elevated.";
  }

  return "Assignment flow is relatively controlled. Continue monitoring coverage and first-offer speed.";
};

const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value || "");

const Metrics = () => {
  const [days, setDays] = useState("7");
  const [cityMap, setCityMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const { res, fetchData, isLoading } = useGetApiReq();

  const metrics = res?.data?.data || {};

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

  const status = useMemo(() => getSystemStatus(metrics), [metrics]);

  const hotspotEntries = useMemo(() => {
    const entries = Object.entries(metrics?.noCandidateByCityService || {}).map(
      ([key, count]) => ({
        key,
        count: Number(count || 0),
        ...parseHotspotKey(key),
      }),
    );

    return entries.sort((a, b) => b.count - a.count);
  }, [metrics]);

  const hotspotPeak = hotspotEntries[0]?.count || 1;
  const hotspotTotal = hotspotEntries.reduce((sum, entry) => sum + entry.count, 0);

  const handleDaysChange = (value) => {
    setDays(value);
    loadMetrics(value);
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-availabe-city?limit=500");
        if (response.data?.success) {
          const nextCityMap = (response.data.data || []).reduce((acc, city) => {
            if (city?._id) {
              acc[city._id] = city.name || city.cityName || city._id;
            }
            return acc;
          }, {});
          setCityMap(nextCityMap);
        }
      } catch (error) {
        console.error("Failed to resolve hotspot cities", error);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    const unresolvedServiceIds = [
      ...new Set(
        hotspotEntries
          .map((entry) => entry.serviceRef)
          .filter((serviceRef) => isObjectId(serviceRef) && !serviceMap[serviceRef]),
      ),
    ];

    if (unresolvedServiceIds.length === 0) {
      return;
    }

    const loadServices = async () => {
      try {
        const responses = await Promise.all(
          unresolvedServiceIds.map((serviceId) =>
            axiosInstance
              .get(`/services/get-service-details/${serviceId}`)
              .then((response) => ({
                serviceId,
                serviceName:
                  response.data?.data?.name ||
                  response.data?.service?.name ||
                  response.data?.name ||
                  serviceId,
              }))
              .catch(() => ({
                serviceId,
                serviceName: serviceId,
              })),
          ),
        );

        setServiceMap((prev) => {
          const next = { ...prev };
          responses.forEach(({ serviceId, serviceName }) => {
            next[serviceId] = serviceName;
          });
          return next;
        });
      } catch (error) {
        console.error("Failed to resolve hotspot services", error);
      }
    };

    loadServices();
  }, [hotspotEntries, serviceMap]);

  return (
    <Wrapper>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <BackLink href={-1}>
                <div>
                  <H2 className="text-[30px] font-bold tracking-tight text-slate-950">
                    Auto Assign Analytics
                  </H2>
                  <p className="mt-1 text-sm text-slate-500">
                    Monitor assignment health, retry pressure, timeout exposure, and supply gaps.
                  </p>
                </div>
              </BackLink>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                <Badge variant="outline" className="border-slate-300 bg-white text-slate-600">
                  {DAYS_OPTIONS.find((option) => option.value === days)?.label}
                </Badge>
                <Badge variant="outline" className="border-slate-300 bg-white text-slate-600">
                  {formatMetricValue(metrics?.attempts)} attempts reviewed
                </Badge>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                {status.helper} {getPrimaryInsight(metrics)}
              </p>
            </div>

            <div className="flex w-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur xl:max-w-[360px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Reporting Window
                </span>
                <ShieldAlert className="h-4 w-4 text-slate-400" />
              </div>

              <Select value={days} onValueChange={handleDaysChange}>
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Success
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {formatMetricValue(metrics?.autoAssignSuccessRate, { suffix: "%" })}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    No Candidate
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {formatMetricValue(metrics?.noCandidateRate, { suffix: "%" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => {
            const Icon = item.icon;
            const tone = toneClasses[item.tone];

            return (
              <Card
                key={item.key}
                className={`overflow-hidden rounded-[24px] border shadow-[0_10px_30px_rgba(15,23,42,0.05)] ${tone.card}`}
              >
                <CardContent className="p-5">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.iconWrap}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[34px] font-bold leading-none tracking-tight text-slate-950">
                      {isLoading ? "--" : formatMetricValue(metrics?.[item.key], item)}
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/90">
                      <div
                        className={`h-full rounded-full ${tone.accent}`}
                        style={{
                          width: `${clampPercent(
                            item.suffix === "%"
                              ? metrics?.[item.key]
                              : item.key === "avgRetriesBeforeAssign"
                                ? Number(metrics?.[item.key] || 0) * 12
                                : item.key === "avgTimeToFirstOfferMinutes"
                                  ? Number(metrics?.[item.key] || 0) * 10
                                  : Number(metrics?.[item.key] || 0) * 5,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="text-xl font-bold text-slate-950">
                Assignment Summary
              </CardTitle>
              <p className="text-sm text-slate-500">
                High-signal diagnostics for how efficiently the engine is closing assignments.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {summaryRows.map((row) => {
                const value = metrics?.[row.key] || 0;
                const tone = toneClasses[row.tone];
                const renderedValue =
                  row.key === "avgRetriesBeforeAssign"
                    ? formatMetricValue(value, { decimals: 1 })
                    : formatMetricValue(value, { suffix: "%" });

                const progressValue =
                  row.key === "avgRetriesBeforeAssign"
                    ? Math.min(100, Number(value || 0) * 15)
                    : clampPercent(value);

                return (
                  <div
                    key={row.key}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {row.description}
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${tone.text}`}>{renderedValue}</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${tone.accent}`}
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <MapPinned className="h-5 w-5 text-slate-500" />
                No Candidate Hotspots
              </CardTitle>
              <p className="text-sm text-slate-500">
                Top city-service combinations where the engine could not find eligible partners.
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {hotspotEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  No no-candidate failures were recorded for the selected period.
                </div>
              ) : (
                hotspotEntries.map((entry, index) => {
                  const width = Math.max(10, (entry.count / hotspotPeak) * 100);
                  const shareOfHotspots = hotspotTotal > 0 ? Math.round((entry.count / hotspotTotal) * 100) : 0;
                  const cityLabel = cityMap[entry.cityRef] || "Unknown city";
                  const serviceLabel = serviceMap[entry.serviceRef] || "Unknown service";
                  const hasResolvedCity = cityLabel !== "Unknown city";
                  const hasResolvedService = serviceLabel !== "Unknown service";

                  return (
                    <div
                      key={`${entry.key}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-slate-300 bg-white text-slate-600">
                              Hotspot #{index + 1}
                            </Badge>
                            <Badge variant="outline" className="border-slate-300 bg-white text-slate-600">
                              {shareOfHotspots}% of hotspot failures
                            </Badge>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              City
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-950">
                              {cityLabel}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-slate-500">
                              {hasResolvedCity
                                ? `Ref: ${compactReference(entry.cityRef)}`
                                : `City reference: ${compactReference(entry.cityRef)}`}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              Service
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-950">
                              {serviceLabel}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-slate-500">
                              {hasResolvedService
                                ? `Ref: ${compactReference(entry.serviceRef)}`
                                : `Service reference: ${compactReference(entry.serviceRef || entry.key)}`}
                            </p>
                          </div>

                          <p className="max-w-xl text-sm leading-6 text-slate-600">
                            {entry.count} auto-assign attempts in this city-service combination failed because no eligible partner was available.
                          </p>
                        </div>

                        <div className="min-w-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Failures
                          </p>
                          <p className="mt-1 text-2xl font-bold text-slate-950">{entry.count}</p>
                        </div>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
                        <span>Relative failure volume</span>
                        <span>{Math.round(width)}% of top hotspot</span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">What good looks like</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Rising success rate with low timeout and low no-candidate exposure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">What to investigate</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Timeouts and repeated retries usually point to queue latency or weak partner response.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Where to act first</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use the hotspot list to expand partner coverage for the most failure-prone city-service pools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default Metrics;
