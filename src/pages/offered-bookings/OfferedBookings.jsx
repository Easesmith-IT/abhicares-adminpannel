import { useEffect, useMemo, useState } from "react";
import { Eye, Search, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";
import useDebounce from "../../hooks/useDebounce";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import { H2 } from "../../components/shared/typography";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { formatInstant } from "@/utils/dateTime";

const STATUS_VARIANT = {
  offered: "secondary",
  accepted: "success",
  rejected: "destructive",
  expired: "outline",
  cancelled: "inprogress",
};

export default function OfferedBookings() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("");
  const [lastFiveHours, setLastFiveHours] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { res, isLoading, error, fetchData } = useGetApiReq();

  useEffect(() => {
    const query = new URLSearchParams({
      page,
      limit,
      lastFiveHours,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(source && { source }),
    }).toString();

    fetchData(`/admin/getAdminAllSellerOfferHistory?${query}`, {
      screenName: "OfferedBookings",
    });
  }, [page, limit, debouncedSearch, status, source, lastFiveHours]);


  const offers = res?.data?.data || [];
  const pagination = res?.data?.pagination || {};

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setSource("");
    setLastFiveHours(false);
    setPage(1);
  };

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Offered Bookings</H2>
            <p className="text-xs text-slate-500 mt-1">Monitor automated dispatch history, partner allot responses, and attempt scores.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm" variant="outline" className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
              <Link to={`/admin/offered-bookings/unassigned`}>
                Auto Assign Failed Bookings
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Input
                placeholder="Search booking ID..."
                className="pr-10 bg-slate-50/50 border-slate-200 h-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-900"
              >
                <Search className="size-4" />
              </Button>
            </div>

            {/* Status Select */}
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40 bg-slate-50/50 border-slate-200 text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Last 5 Hours filter button */}
            <Button
              variant={lastFiveHours ? "default" : "outline"}
              size="sm"
              onClick={() => setLastFiveHours((prev) => !prev)}
              className={lastFiveHours ? "bg-blue-600 hover:bg-blue-700 text-white h-9 font-medium" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-9"}
            >
              Last 5 Hours Only
            </Button>
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="bg-slate-50/50 border-slate-200 text-xs"
            />

            {/* Reset Filters button */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800 h-9">
              <RefreshCw className="mr-1.5 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        {/* Table list */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">Booking</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Seller</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Score</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Attempt</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Source</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Reason Codes</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Offered At</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Responded</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading && (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                      ))}
                    </>
                  )}

                  {!isLoading && offers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-slate-400 font-medium">
                        No offered bookings found
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    offers?.map((offer) => (
                      <TableRow key={offer._id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-semibold text-[#0F172A] pl-6">
                          <Link
                            className="hover:text-blue-700 hover:underline font-semibold"
                            to={`/admin/bookings/${offer?.bookingId?._id}`}
                          >
                            {offer?.bookingId?.bookingId || "-"}
                          </Link>
                        </TableCell>

                        <TableCell className="text-slate-700">{offer.sellerId?.name || "-"}</TableCell>

                        <TableCell>
                          <Badge variant={STATUS_VARIANT[offer.status]}>
                            {offer.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-slate-700 font-medium">{offer.score || "-"}</TableCell>

                        <TableCell className="text-slate-600 font-medium">#{offer.attemptNo || "0"}</TableCell>

                        <TableCell className="uppercase text-slate-600 font-semibold text-xs">
                          {offer.source || "-"}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {offer?.reasonCodes?.length > 0
                              ? offer.reasonCodes?.map((code) => (
                                  <Badge key={code} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                                    {code}
                                  </Badge>
                                ))
                              : "-"}
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-600 text-xs font-mono">{formatInstant(offer.offeredAt, "dd MMM yyyy, hh:mm aa")}</TableCell>

                        <TableCell className="text-slate-600 text-xs font-mono">{formatInstant(offer.respondedAt, "dd MMM yyyy, hh:mm aa")}</TableCell>

                        <TableCell className="text-right pr-6">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/admin/offered-bookings/${offer._id}`, {
                                state: {
                                  offer,
                                },
                              })
                            }
                            className="hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {pagination?.totalPages || 1}</span>
          <PaginationComp page={page} pageCount={pagination?.totalPages || 1} setPage={setPage} />
        </div>
      </div>
    </Wrapper>
  );
}

const MetricSkeleton = () => (
  <div className="rounded-2xl border bg-white p-6 shadow-sm">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-10 w-20" />
  </div>
);

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell className="pl-6"><Skeleton className="h-5 w-full rounded-md" /></TableCell>
    {Array.from({ length: 8 }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-5 w-full rounded-md" />
      </TableCell>
    ))}
    <TableCell className="pr-6"><Skeleton className="h-5 w-full rounded-md" /></TableCell>
  </TableRow>
);
