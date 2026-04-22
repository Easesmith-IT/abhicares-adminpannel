import { useEffect, useState } from "react";
import { Wifi, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import useGetApiReq from "../../hooks/useGetApiReq";

const Stats = ({ setAllSellers }) => {
  const { res, fetchData } = useGetApiReq();
  const { res: onlineRes, fetchData: getOnlinePartners } = useGetApiReq();

  const [onlinePartners, setOnlinePartners] = useState(0);
  const [fulfillingSellers, setFulfillingSellers] = useState(0);

  useEffect(() => {
    getOnlinePartners("/admin/get-online-seller");
    fetchData("/admin/get-current-fullfiling-seller");
  }, []);

  useEffect(() => {
    if (onlineRes?.status === 200) {
      setOnlinePartners(onlineRes?.data?.pagination?.count || 0);
    }
  }, [onlineRes]);

  useEffect(() => {
    if (res?.status === 200) {
      setFulfillingSellers(res?.data?.pagination?.count || 0);
    }
  }, [res]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Online Partners */}
      <Card
        // onClick={() => setAllSellers(onlineRes?.data?.onlineSellers || [])}
        className="cursor-pointer border-l-4 border-emerald-500 transition hover:shadow-md"
      >
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Online Partners</p>
            <h2 className="text-3xl font-bold">{onlinePartners}</h2>
          </div>
          <Wifi className="h-12 w-12 text-emerald-500" />
        </CardContent>
      </Card>

      {/* Fulfilling Sellers */}
      <Card
        // onClick={() => setAllSellers(res?.data?.fulfillingSellers || [])}
        className="cursor-pointer border-l-4 border-indigo-500 transition hover:shadow-md"
      >
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Fulfilling Sellers</p>
            <h2 className="text-3xl font-bold">{fulfillingSellers}</h2>
          </div>
          <Target className="h-12 w-12 text-indigo-500" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
