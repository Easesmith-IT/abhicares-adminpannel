import {
  Download,
  Search,
  RefreshCw,
} from "lucide-react";
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
import { H2 } from "../../components/shared/typography";
import { BOOKING_STATUS_FILTER_OPTIONS } from "@/utils/bookingStatus";

const Bookings = () => {
  const navigate = useNavigate();
  const { selectedCityId } = useCustomSidebar();

  const [searchVal, setSearchVal] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");
  const [filters, setFilters] = useState({
    date: "",
    endDate: "",
    status: "all",
  });

  const {
    res: bookingRes,
    fetchData: fetchBookingsData,
    isLoading,
  } = useGetApiReq();
  const { res: searchRes, fetchData: searchBooking } = useGetApiReq();

  const handleReset = () => {
    setFilters({
      date: "",
      endDate: "",
      status: "all",
    });
    setLimit("10");
    setSearchVal("");
    setPage(1);
  };

  useEffect(() => {
    const cityQuery = selectedCityId ? `&cityId=${selectedCityId}` : "";
    const hasFilters =
      Boolean(filters.date) || Boolean(filters.endDate) || filters.status !== "all";

    if (hasFilters) {
      const statusQuery =
        filters.status && filters.status !== "all"
          ? `status=${filters.status}&`
          : "";
      const dateQuery = filters.date ? `bookingDate=${filters.date}&` : "";
      const endDateQuery = filters.endDate ? `endDate=${filters.endDate}&` : "";

      fetchBookingsData(
        `/admin/search-filter-bookings?${statusQuery}${dateQuery}${endDateQuery}page=${page}&limit=${limit}${cityQuery}`,
      );
      return;
    }

    fetchBookingsData(`/admin/get-booking-list?page=${page}&limit=${limit}${cityQuery}`);
  }, [fetchBookingsData, filters, limit, page, selectedCityId]);

  useEffect(() => {
    if (bookingRes?.status === 200) {
      const data = bookingRes.data.data || [];
      const totalPages = bookingRes.data.pagination?.totalPages || 1;
      setBookings(data);
      setPageCount(totalPages);
    }
  }, [bookingRes]);

  useEffect(() => {
    if (searchRes?.status === 200) {
      const bookingsData = searchRes.data.data?.length ? [searchRes.data.data[0]] : [];
      setBookings(bookingsData);
      setPageCount(1);
    }
  }, [searchRes]);

  const handleSearch = () => {
    if (!searchVal) return;
    searchBooking(`/admin/get-booking-by-id?bookingId=${searchVal}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Wrapper>
      <div className="mx-auto min-h-screen max-w-[1600px] space-y-6 bg-[#F8FAFC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">
              Bookings Workspace
            </H2>
            <p className="mt-1 text-xs text-slate-500">
              Monitor booking schedules, dispatch tracking, and provider
              allotments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/bookings/rejected-request")}
              className="border-slate-200 bg-white"
            >
              Rejected Bookings
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsModalOpen(true)}
              className="border-slate-200 bg-white"
            >
              <Download className="size-4" />
            </Button>
          </div>
        </div>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-[240px] flex-1">
              <Input
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search booking by ID..."
                className="border-slate-200 bg-slate-50/50 pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSearch}
                className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-slate-400 hover:text-slate-900"
              >
                <Search className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.date}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, date: event.target.value }))
                }
                className="w-[140px] border-slate-200 bg-slate-50/50 text-xs"
              />
              <span className="text-xs text-slate-400">to</span>
              <Input
                type="date"
                value={filters.endDate}
                min={filters.date || undefined}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: event.target.value,
                  }))
                }
                className="w-[140px] border-slate-200 bg-slate-50/50 text-xs"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-[170px] border-slate-200 bg-slate-50/50 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="w-[80px] border-slate-200 bg-slate-50/50 text-xs"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800"
            >
              <RefreshCw className="mr-1 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        <BookingsTable bookings={bookings} isLoading={isLoading} />

        <div className="flex items-center justify-between pt-2">
          <span className="whitespace-nowrap text-xs font-medium text-slate-400">
            Page {page} of {pageCount || 1}
          </span>
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
