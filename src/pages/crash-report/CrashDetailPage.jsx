import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import { BackLink } from "@/components/shared/back-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoBox, InfoCard, InfoRow } from "../../components/crash-report";
import Wrapper from "../../components/wrappers/Wrapper";
import CrashDetailSkeleton from "../../components/crash-report/CrashDetailSkeleton";

const CrashDetailPage = () => {
  const { crashId } = useParams();

  const { res: getCrashRes, fetchData: getCrash, isLoading } = useGetApiReq();

  const [crash, setCrash] = useState(null);

  // ----------------------------
  // Fetch single crash
  // ----------------------------
  useEffect(() => {
    if (crashId) {
      getCrash(`/crash-report/get/${crashId}`);
    }
  }, [crashId]);

  // ----------------------------
  // Handle response
  // ----------------------------
  useEffect(() => {
    if (getCrashRes?.status === 200 || getCrashRes?.status === 201) {
      setCrash(getCrashRes?.data?.data || null);
    }
  }, [getCrashRes]);

  const request = crash?.request;
  const device = crash?.device;

  // ----------------------------
  // Loading state
  // ----------------------------
if (isLoading) {
  return (
    <Wrapper>
      <CrashDetailSkeleton />
    </Wrapper>
  );
}


  if (!crash) {
    return (
      <Wrapper>
        <div className="py-12 text-center text-slate-500 font-medium">
          Crash report not found
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BackLink href="/admin/crash-report" />
          <h1 className="text-2xl font-bold">{crash.errorName}</h1>
        </div>

        {/* Meta Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard label="Severity">
            <Badge>{crash.severity}</Badge>
          </InfoCard>

          <InfoCard label="Status">
            {crash.resolved ? "Resolved" : "Open"}
          </InfoCard>

          <InfoCard label="Environment">{crash.environment || "-"}</InfoCard>
        </div>

        {/* App / User */}
        <div className="grid grid-cols-3 gap-5">
          <InfoBox title="Application">
            {crash.appName} · {crash.appVersion}
          </InfoBox>

          <InfoBox title="User Type">{crash.userType || "-"}</InfoBox>
          <InfoBox title="Source">{crash.source || "-"}</InfoBox>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <InfoBox title="Error Name">{crash.errorName || "-"}</InfoBox>
          <InfoBox title="Screen Name">{crash.screenName || "-"}</InfoBox>
          <InfoBox title="Error Id">{crash.errorId || "-"}</InfoBox>
        </div>

        {/* Request Info */}
        {request && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Overview</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              <InfoRow label="Method">
                <Badge variant="outline">{request.method}</Badge>
              </InfoRow>

              <InfoRow label="URL">{request.url}</InfoRow>
              <InfoRow label="IP Address">{request.ip || "-"}</InfoRow>

              {request.headers?.["user-agent"] && (
                <InfoRow label="User Agent">
                  {request.headers["user-agent"]}
                </InfoRow>
              )}
            </CardContent>
          </Card>
        )}

        {/* Device Info */}
        {device && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              <InfoBox title="Platform">
                <Badge variant="outline">{device.platform}</Badge>
              </InfoBox>

              <InfoBox title="OS">
                {device.os} {device.osVersion}
              </InfoBox>

              <InfoBox title="Device Model">
                {device.deviceModel || "-"}
              </InfoBox>

              <InfoBox title="Browser">{device.browser || "-"}</InfoBox>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        <InfoBox title="Error Message">{crash.errorMessage || "-"}</InfoBox>

        {/* Stack Trace */}
        {crash.stackTrace && (
          <div className="rounded-lg border bg-black text-green-400 p-4 font-mono text-sm overflow-auto">
            {crash.stackTrace}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default CrashDetailPage;
