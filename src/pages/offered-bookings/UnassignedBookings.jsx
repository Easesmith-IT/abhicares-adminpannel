import { useEffect, useState, useCallback } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import { BackLink } from "../../components/shared/back-link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import useCities from "../../components/filters/city/useCities";
import CityFilter from "../../components/filters/city/CityFilter";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_VARIANT = {
  "not-alloted": "destructive",
  "assigned-pending": "inprogress",
  "completed": "success",
};

const UnassignedBookings = () => {
  const navigate = useNavigate();
  const { cities } = useCities();

  const [status, setStatus] = useState("all");
  const [cityId, setCityId] = useState("");
  const [page, setPage] = useState(1);

  const handleReset = () => {
    setStatus("all");
    setCityId("");
    setPage(1);
  };

  const { res, isLoading, fetchData } = useGetApiReq();

  const fetchUnassignedBookings = useCallback(() => {
    const query = new URLSearchParams({
      page,
      limit: 10,
      status,
      ...(cityId && { cityId }),
    }).toString();

    fetchData(`/admin/auto-assign-failed-bookings?${query}`, {
      screenName: "UnassignedBookings",
    });
  }, [page, status, cityId, fetchData]);

  useEffect(() => {
    fetchUnassignedBookings();
  }, [fetchUnassignedBookings]);

  const bookings = res?.data?.data || [];
  const pagination = res?.data?.pagination || {};

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <BackLink href={-1}>
              <H2 className="text-2xl font-bold tracking-tight text-slate-900">Auto Assign Failed Bookings</H2>
            </BackLink>
            <p className="text-xs text-slate-500 mt-1">Manage bookings that failed automated assignment and require manual override.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchUnassignedBookings} className="bg-white border-slate-200">
              <RefreshCw className="size-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 bg-white border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="not-alloted">Not Alloted</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          {/* CityId Filter */}
          <CityFilter cities={cities} value={cityId} onChange={setCityId} />

          {/* Reset Button */}
          <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
        </div>

        {/* Table Card */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">User Details</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Retry Count</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Exhausted At</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Created At</TableHead>
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

                  {!isLoading && bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        No unassigned bookings found.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    bookings.map((item) => (
                      <TableRow key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium pl-6">
                          <Link
                            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                            to={`/admin/orders/${item?.orderId?._id}`}
                          >
                            {item?.orderId?.orderId || "—"}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0F172A]">{item?.userId?.name || "—"}</span>
                            <span className="text-xs text-slate-500">
                              {item?.userId?.phone || "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant={STATUS_VARIANT[item.status] || "secondary"}>
                            {item.status || "—"}
                          </Badge>
                        </TableCell>

                        <TableCell className="font-medium text-slate-700">#{item.autoAssignRetryCount || 0}</TableCell>

                        <TableCell className="text-slate-600">
                          {formatDate(item.autoAssignExhaustedAt)}
                        </TableCell>

                        <TableCell className="text-slate-600">{formatDate(item.createdAt)}</TableCell>

                        <TableCell className="text-right pr-6">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/admin/bookings/${item._id}`, {
                                state: { booking: item },
                              })
                            }
                            className="hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg"
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
          <span className="text-xs text-slate-400 font-medium">Page {page} of {pagination?.totalPages || 1}</span>
          <PaginationComp
            page={page}
            pageCount={pagination?.totalPages || 1}
            setPage={setPage}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default UnassignedBookings;

/* ---------------- Skeletons ---------------- */

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell className="pl-6"><Skeleton className="h-5 w-24 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-5 w-32 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-5 w-20 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-5 w-10 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-5 w-36 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-5 w-36 rounded-md" /></TableCell>
    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
  </TableRow>
);
