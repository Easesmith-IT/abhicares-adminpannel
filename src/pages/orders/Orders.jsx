import { useEffect, useRef, useState } from "react";
import { Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import OrdersTable from "../../components/admin/OrdersTable";
import Wrapper from "../../components/wrappers/Wrapper";
import MonthlyOrderModal from "../../components/modals/MonthlyOrderModal";
import useGetApiReq from "../../hooks/useGetApiReq";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { PaginationComp } from "../../components/shared/PaginationComp";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const Orders = () => {
  const { res: getOrdersRes, fetchData: getOrders, isLoading } = useGetApiReq();
  const {
    res: getOrderByIDRes,
    fetchData: getOrderByID,
    error,
  } = useGetApiReq();

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [allOrders, setAllOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

   const handleReset = () => {
     setFilters({
       startDate: "",
       endDate: "",
       status: "",
     });

      setLimit("10");

     searchRef.current.value = ""
   };

  useEffect(() => {
    getOrders(
      `/admin/get-all-orders?page=${page}&status=${filters.status}&startDate=${filters.startDate}&endDate=${filters.endDate}&limit=${limit}`,
    );
  }, [page, filters,limit]);

  useEffect(() => {
    if (getOrdersRes?.status === 200) {
      setAllOrders(getOrdersRes.data.data);
      setPageCount(getOrdersRes.data.pagination?.totalPages || 0);
    }
  }, [getOrdersRes]);

  const getOrderById = () => {
    const orderId = searchRef.current?.value;
    if (!orderId) return;
    getOrderByID(`/admin/get-order-by-id?orderId=${orderId}`);
  };

  useEffect(() => {
    if (getOrderByIDRes?.status === 200) {
      setAllOrders([getOrderByIDRes.data.data]);
      setPageCount(0)
    }
  }, [getOrderByIDRes]);

  useEffect(() => {
    if (error) setAllOrders([]);
  }, [error]);

  return (
    <>
      <Wrapper>
        {/* Container */}
        <div className="w-full font-poppins">
          {/* Header (matches AdminPage style) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <h1 className="text-[30px] font-semibold text-black">Orders</h1>

            <div className="flex items-center gap-4">
              {/* Start Date */}
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value }))
                }
                className="rounded-md border px-3 py-2 text-sm"
              />

              {/* End Date */}
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value }))
                }
                className="rounded-md border px-3 py-2 text-sm"
              />

              {/* Status (shadcn Select) */}
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((p) => ({ ...p, status: value }))
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="OutOfDelivery">Out for Delivery</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

               <div>
            {/* <label className="text-sm font-medium mb-1 block">Limit</label> */}
            <Select value={limit} onValueChange={(value) => setLimit(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

              {/* Search */}
              <div className="relative">
                <Input
                  ref={searchRef}
                  placeholder="Search order by id"
                  className="w-[260px] rounded-md border px-3 py-2 pr-9 text-sm"
                />
                <Search
                  size={18}
                  onClick={getOrderById}
                  className="absolute right-2 top-2.5 cursor-pointer text-muted-foreground hover:text-black"
                />
              </div>

              <TooltipIconButton
                tooltip="Reset Filters"
                onClick={handleReset}
              />

              {/* Download */}
              <Button
                size="icon"
                variant="abhicares"
                onClick={() => setIsModalOpen(true)}
              >
                <Download size={18} />
              </Button>
            </div>
          </div>

          {/* Table */}
          <OrdersTable orders={allOrders} isLoading={isLoading} />

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {isModalOpen && (
        <MonthlyOrderModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
};

export default Orders;
