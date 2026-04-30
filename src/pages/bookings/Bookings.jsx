import { format } from "date-fns";
import { Download, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const Bookings = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { res: listRes, fetchData: getBookings, isLoading } = useGetApiReq();
  const { res: filterRes, fetchData: filterBookings } = useGetApiReq();
  const { res: searchRes, fetchData: searchBooking } = useGetApiReq();

  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    date: "",
    status: "",
  });

  const handleReset = () => {
    setFilters({
      date: "",
      status: "",
    });

    setLimit("10");

    searchRef.current.value = "";
  };

  /* ================= Fetch ================= */

  useEffect(() => {
    if (filters.date || filters.status) {
      filterBookings(
        `/admin/search-filter-bookings?status=${filters.status}&bookingDate=${filters.date}&page=${page}&limit=${limit}`,
      );
    } else {
      getBookings(`/admin/get-booking-list?page=${page}&limit=${limit}`);
    }
  }, [page, filters, limit]);

  useEffect(() => {
    if (listRes?.status === 200) {
      setBookings(listRes.data.data);
      setPageCount(listRes.data.pagination.totalPages);
    }
  }, [listRes]);

  console.log("bookings", bookings);

  useEffect(() => {
    if (filterRes?.status === 200) {
      console.log("filterRes", filterRes);
      
      setBookings(filterRes.data.data);
      setPageCount(filterRes.data.pagination.totalPages);
    }
  }, [filterRes]);
  
  useEffect(() => {
    if (searchRes?.status === 200) {
      console.log("searchRes", searchRes);
      
      setBookings([searchRes.data.data[0]]);
      setPageCount(0);
    }
  }, [searchRes]);

  /* ================= Handlers ================= */

  const handleSearch = () => {
    const bookingId = searchRef.current?.value;
    if (!bookingId) return;
    searchBooking(`/admin/get-booking-by-id?bookingId=${bookingId}`);
  };

  /* ================= UI ================= */

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <h1 className="text-[30px] font-semibold">Bookings</h1>

          <Button
            variant="abhicares"
            onClick={() => navigate("/admin/bookings/rejected-request")}
          >
            Rejected Bokkings
          </Button>
        </div>

        <div className="flex items-center gap-4 pb-5">
          {/* Date */}
          <Input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters((p) => ({ ...p, date: e.target.value }))
            }
            className="w-[160px]"
          />

          {/* Status */}
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((p) => ({ ...p, status: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="alloted">Alloted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-alloted">Not Alloted</SelectItem>
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
              placeholder="Search booking by id"
              className="w-[260px] pr-9"
            />
            <Search
              size={18}
              onClick={handleSearch}
              className="absolute right-2 top-2.5 cursor-pointer text-muted-foreground hover:text-black"
            />
          </div>

          <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />

          {/* Download */}
          <Button
            variant="abhicares"
            size="icon"
            onClick={() => setIsModalOpen(true)}
          >
            <Download size={18} />
          </Button>
        </div>

        <BookingsTable bookings={bookings} isLoading={isLoading} />

        <PaginationComp
          page={page}
          pageCount={pageCount}
          setPage={setPage}
          className="mt-8 mb-5"
        />

        {isModalOpen && (
          <MonthlyBookingModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default Bookings;
