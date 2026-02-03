import { useEffect, useState } from "react";
import useGetApiReq from "../../hooks/useGetApiReq";

// Optional: replace images with lucide icons later if you want
import { ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard } from "./StatCard";

const Shared = () => {
  const { res: getOrderCountByStatusRes, fetchData: getOrderCountByStatus } =
    useGetApiReq();

  const [orderCount, setOrderCount] = useState({
    completed: 0,
    cancelled: 0,
    pending: 0,
    total: 0,
  });

  useEffect(() => {
    getOrderCountByStatus("/admin/get-order-count-by-status");
  }, []);

  useEffect(() => {
    if (getOrderCountByStatusRes?.status === 200) {
      let total = 0;
      getOrderCountByStatusRes.data.data.forEach(
        (item) => (total += item.count),
      );

      setOrderCount({
        cancelled:
          getOrderCountByStatusRes.data.data.find(
            (i) => i.status === "Cancelled",
          )?.count || 0,
        completed:
          getOrderCountByStatusRes.data.data.find(
            (i) => i.status === "Completed",
          )?.count || 0,
        pending:
          getOrderCountByStatusRes.data.data.find((i) => i.status === "Pending")
            ?.count || 0,
        total,
      });
    }
  }, [getOrderCountByStatusRes]);

  return (
    <div className="w-full px-[30px] py-[40px]">
      <div className="flex flex-wrap items-center justify-evenly gap-[50px]">
        {/* Total Orders */}
        <StatCard
          title="Total Orders"
          value={orderCount.total}
          icon={<ShoppingBag className="h-12 w-12 text-white" />}
          bg="bg-[#A5D3FD]"
        />

        {/* Completed Orders */}
        <StatCard
          title="Completed Orders"
          value={orderCount.completed}
          icon={<CheckCircle className="h-12 w-12 text-white" />}
          bg="bg-[#A5D3FD]"
        />

        {/* Pending Orders */}
        <StatCard
          title="Pending Orders"
          value={orderCount.pending}
          icon={<Clock className="h-12 w-12 text-white" />}
          bg="bg-[#A5D3FD]"
        />

        {/* Cancelled Orders */}
        <StatCard
          title="Cancelled Orders"
          value={orderCount.cancelled}
          icon={<XCircle className="h-12 w-12 text-white" />}
          bg="bg-[#A5D3FD]"
        />
      </div>
    </div>
  );
};

export default Shared;
