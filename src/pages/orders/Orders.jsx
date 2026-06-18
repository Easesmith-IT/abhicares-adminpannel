import { useEffect, useState } from "react";
import { Download, Search, RefreshCw } from "lucide-react";

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
import { Card, CardContent } from "@/components/ui/card";
import { PaginationComp } from "../../components/shared/PaginationComp";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { useCustomSidebar } from "@/components/layout/sidebarContext";
import { H2 } from "../../components/shared/typography";

const Orders = () => {
  const { res: getOrdersRes, fetchData: getOrders, isLoading } = useGetApiReq();
  const {
    res: getOrderByIDRes,
    fetchData: getOrderByID,
    error,
  } = useGetApiReq();

  const [searchVal, setSearchVal] = useState("");

  const { selectedCityId } = useCustomSidebar();
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
    setSearchVal("");
  };

  useEffect(() => {
    getOrders(
      `/admin/get-all-orders?page=${page}&status=${filters.status}&startDate=${filters.startDate}&endDate=${filters.endDate}&limit=${limit}&cityId=${selectedCityId || ""}`,
    );
  }, [page, filters, limit, selectedCityId, getOrders]);

  useEffect(() => {
    if (getOrdersRes?.status === 200) {
      const data = getOrdersRes.data.data || [];
      const totalPages = getOrdersRes.data.pagination?.totalPages || 1;
      setTimeout(() => {
        setAllOrders(data);
        setPageCount(totalPages);
      }, 0);
    }
  }, [getOrdersRes]);

  const getOrderById = () => {
    const orderId = searchVal;
    if (!orderId) return;
    getOrderByID(`/admin/get-order-by-id?orderId=${orderId}`);
  };

  useEffect(() => {
    if (getOrderByIDRes?.status === 200) {
      const orderData = [getOrderByIDRes.data.data];
      setTimeout(() => {
        setAllOrders(orderData);
        setPageCount(0);
      }, 0);
    }
  }, [getOrderByIDRes]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setAllOrders([]);
      }, 0);
    }
  }, [error]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getOrderById();
    }
  };

  return (
    <>
      <Wrapper>
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <H2 className="text-2xl font-bold tracking-tight text-slate-900">Orders Workspace</H2>
              <p className="text-xs text-slate-500 mt-1">Manage global orders, transaction records, and invoice histories.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="bg-white border-slate-200"
              >
                <Download className="size-4" />
              </Button>
            </div>
          </div>

          {/* Filters card */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              
              {/* Search Order */}
              <div className="relative flex-1 min-w-[240px]">
                <Input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search order by ID..."
                  className="pr-10 bg-slate-50/50 border-slate-200"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={getOrderById}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-900"
                >
                  <Search className="size-4" />
                </Button>
              </div>

              {/* Start & End Date Pickers */}
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, startDate: e.target.value }))
                  }
                  className="w-[140px] bg-slate-50/50 border-slate-200 text-xs"
                />
                <span className="text-slate-400 text-xs">-</span>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className="w-[140px] bg-slate-50/50 border-slate-200 text-xs"
                />
              </div>

              {/* Status Selector */}
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((p) => ({ ...p, status: value }))
                }
              >
                <SelectTrigger className="w-[150px] bg-slate-50/50 border-slate-200 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="OutOfDelivery">Out for Delivery</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Limit */}
              <Select value={limit} onValueChange={(value) => setLimit(value)}>
                <SelectTrigger className="w-[85px] bg-slate-50/50 border-slate-200 text-xs">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset */}
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
                <RefreshCw className="mr-1 size-3.5" />
                <span>Reset Filters</span>
              </Button>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <OrdersTable orders={allOrders} isLoading={isLoading} />

          {/* Pagination */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-400 font-medium">Page {page} of {pageCount || 1}</span>
            <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
          </div>
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
