import { Download, Search, RefreshCw, ClipboardList, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";
import { useCustomSidebar } from "../../components/layout/sidebarContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaginationComp } from "../../components/shared/PaginationComp";
import Wrapper from "../../components/wrappers/Wrapper";
import BookingsTable from "../../components/booking/BookingsTable";
import MonthlyBookingModal from "../../components/modals/MonthlyBookingModal";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { H2 } from "../../components/shared/typography";

const Bookings = () => {
  const navigate = useNavigate();
  const { selectedCityId } = useCustomSidebar();

  const [searchVal, setSearchVal] = useState("");

  const { res: bookingRes, fetchData: fetchBookingsData, isLoading } = useGetApiReq();
  const { res: searchRes, fetchData: searchBooking } = useGetApiReq();

  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    date: "",
    endDate: "",
    status: "",
  });

  const handleReset = () => {
    setFilters({
      date: "",
      status: "",
      endDate: "",
    });

    setLimit("10");
    setSearchVal("");
  };

  /* ================= Fetch ================= */
  useEffect(() => {
    const cityQuery = selectedCityId ? `&cityId=${selectedCityId}` : "";
    if (filters.date || filters.status) {
      fetchBookingsData(
        `/admin/search-filter-bookings?status=${filters.status}&bookingDate=${filters.date}&page=${page}&limit=${limit}${cityQuery}`,
      );
    } else {
      fetchBookingsData(`/admin/get-booking-list?page=${page}&limit=${limit}${cityQuery}`);
    }
  }, [page, filters, limit, selectedCityId, fetchBookingsData]);

  useEffect(() => {
    if (bookingRes?.status === 200) {
      const data = bookingRes.data.data || [];
      const totalPages = bookingRes.data.pagination?.totalPages || 1;
      setTimeout(() => {
        setBookings(data);
        setPageCount(totalPages);
      }, 0);
    }
  }, [bookingRes]);

  useEffect(() => {
    if (searchRes?.status === 200) {
      const bookingsData = [searchRes.data.data[0]];
      setTimeout(() => {
        setBookings(bookingsData);
        setPageCount(0);
      }, 0);
    }
  }, [searchRes]);

  /* ================= Handlers ================= */
  const handleSearch = () => {
    if (!searchVal) return;
    searchBooking(`/admin/get-booking-by-id?bookingId=${searchVal}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Bookings Workspace</H2>
            <p className="text-xs text-slate-500 mt-1">Monitor booking schedules, dispatch tracking, and provider allotments.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/bookings/rejected-request")}
              className="bg-white border-slate-200"
            >
              Rejected Bookings
            </Button>
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

        {/* Filters Panel */}
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search booking by ID..."
                className="pr-10 bg-slate-50/50 border-slate-200"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-900"
              >
                <Search className="size-4" />
              </Button>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, date: e.target.value }))
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

            {/* Status Select */}
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
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="alloted">Alloted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-alloted">Not Alloted</SelectItem>
              </SelectContent>
            </Select>

            {/* Limit Select */}
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="w-[80px] bg-slate-50/50 border-slate-200 text-xs"
            />

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
              <RefreshCw className="mr-1 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        {/* Table list */}
        <BookingsTable bookings={bookings} isLoading={isLoading} />

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {pageCount || 1}</span>
          <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
        </div>
      </div>

      {isModalOpen && (
        <MonthlyBookingModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </Wrapper>
  );
};

export default Bookings;
