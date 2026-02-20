import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import useGetApiReq from "@/hooks/useGetApiReq";

export default function WalletBalanceCard({ userId }) {
  const { res, isLoading, fetchData } = useGetApiReq();

  const fetchWallet = async () => {
    await fetchData("/userWallet/balance", {
      params: { userId },
      screenName: "WalletBalanceCard",
    });
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  const wallet = res?.data?.data;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wallet Summary</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchWallet}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-semibold">₹ {wallet?.balance ?? 0}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Credits</span>
              <span className="font-semibold">
                ₹ {wallet?.totalCredits ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Amount</span>
              <span className="font-semibold text-yellow-600">
                ₹ {wallet?.pending ?? 0}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="font-medium">Available Balance</span>
              <span className="font-bold text-green-600">
                ₹ {wallet?.availableBalance ?? 0}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
