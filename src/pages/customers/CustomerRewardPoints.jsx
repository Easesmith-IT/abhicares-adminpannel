import React, { useEffect, useState } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetApiReq from "../../hooks/useGetApiReq";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import AddRewardPointsModal from "../../components/customer/AddRewardPointsModal";
import { Button } from "../../components/ui/button";

const CustomerRewardPoints = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewardPoints, setRewardPoints] = useState([]);

  const params = useParams();
  const {state} = useLocation()
  const navigate = useNavigate();

  console.log("state", state);
  

  const { res, fetchData, isLoading } = useGetApiReq();

  const getRewardPoints = () => {
    fetchData(`/rewards/get-reward/${params?.customerId}`);
  };

  useEffect(() => {
    getRewardPoints();
  }, []);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);

      setRewardPoints(res?.data?.data || {});
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between gap-5 items-center">
          <BackLink href={-1}>
            <H2>Customer Reward Points</H2>
          </BackLink>
          <Button onClick={() => setIsModalOpen(true)} variant="abhicares">
            Add Reward Points
          </Button>
        </div>

        {isModalOpen && (
          <AddRewardPointsModal
            open={isModalOpen}
            setOpen={setIsModalOpen}
            getRewardPoints={getRewardPoints}
            cityId={rewardPoints?.city?._id || state?.city?._id}
          />
        )}

        {isLoading ? (
          <RewardDashboardSkeleton />
        ) : (
          <>
            {/* 🔹 Points Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Points</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {rewardPoints.totalPoints || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Used Points</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-red-500">
                  {rewardPoints.usedPoints || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Remaining Points</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-green-600">
                  {rewardPoints.remainingPoints || 0}
                </CardContent>
              </Card>
            </div>

            {/* 🔹 City Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>City Details</CardTitle>
                <Badge
                  variant={
                    rewardPoints?.city?.isActive ? "success" : "destructive"
                  }
                >
                  {rewardPoints?.city?.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="font-medium capitalize">
                    {rewardPoints?.city?.name || "NA"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latitude</p>
                  <p>{rewardPoints?.city?.latitude || "NA"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Longitude</p>
                  <p>{rewardPoints?.city?.longitude|| "NA"}</p>
                </div>
              </CardContent>
            </Card>

            {/* 🔹 Reward Config */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Configuration</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Earn Rate</p>
                  <p className="font-medium">{rewardPoints.earnRate || 0} pts / ₹</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Conversion Rate</p>
                  <p className="font-medium">{rewardPoints.conversionRate || 0}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Max Usage %</p>
                  <p className="font-medium">{rewardPoints.maxUsagePercent ||0}%</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Min Cart Value</p>
                  <p className="font-medium">₹{rewardPoints.minCartValue ||0}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Max Points / Order</p>
                  <p className="font-medium">
                    {rewardPoints.maxPointsPerOrder ||0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Wrapper>
  );
};

function RewardDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 🔹 Points Overview Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 City Info Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardHeader>

        <CardContent className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🔹 Reward Config Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerRewardPoints;
