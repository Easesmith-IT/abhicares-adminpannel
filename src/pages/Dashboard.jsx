import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../components/admin/Main";
import OrdersTable from "../components/admin/OrdersTable";
import Wrapper from "../components/wrappers/Wrapper";
import useGetApiReq from "../hooks/useGetApiReq";
import { PaginationComp } from "../components/shared/PaginationComp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../components/ui/button";


const AdminPage = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchData(`/admin/get-recent-orders?page=${page}&status=${status}`);
  }, [page, status]);

  useEffect(() => {
    if (res?.status === 200) {
      setOrders(res.data.data);
      setPageCount(Number(res.data.pagination.totalPages));
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <Main />

        {/* Report Container */}
        <div>
          {/* Header */}
          <div className="flex h-[80px] items-center justify-between pb-2">
            <h1 className="text-[30px] font-semibold text-black">Orders</h1>

            <div className="flex items-center gap-5">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="OutOfDelivery">Out Of Delivery</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => navigate("/admin/orders")}
                variant="abhicares"
              >
                View All
              </Button>
            </div>
          </div>

          {/* Table */}
          <OrdersTable orders={orders} isLoading={isLoading} />

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default AdminPage;
