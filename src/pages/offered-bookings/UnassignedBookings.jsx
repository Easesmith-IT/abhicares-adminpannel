import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import { BackLink } from "../../components/shared/back-link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
};

const UnassignedBookings = () => {
  const navigate = useNavigate();
  const { cities } = useCities();

  const [status, setStatus] = useState("not-alloted");
  const [cityId, setCityId] = useState("");
  const [page, setPage] = useState(1);

  const handleReset = () => {
    setStatus("not-alloted");
    setCityId("");
    setPage(1);
  };

  const { res, isLoading, fetchData } = useGetApiReq();

  useEffect(() => {
    const query = new URLSearchParams({
      page,
      limit: 10,
      status,
      ...(cityId && { cityId }),
    }).toString();

    fetchData(`/admin/auto-assign-failed-bookings?${query}`, {
      screenName: "UnassignedBookings",
    });
  }, [page, status, cityId]);

  const bookings = res?.data?.data || [];
  const pagination = res?.data?.pagination || {};

  return (
    <Wrapper>
      <div className="mt-6">
        <BackLink>
          <H2>Auto Assign Failed Bookings</H2>
        </BackLink>

        <div className="flex flex-wrap gap-3 mt-6 mb-6">
          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
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

        {/* Table */}
        <div className="table-container mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200">
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retry Count</TableHead>
                <TableHead>Exhausted At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell colSpan={7} className="text-center">
                    No unassigned bookings found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                bookings.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      <Link
                        className="hover:text-blue-700 hover:underline font-medium"
                        to={`/admin/orders/${item?.orderId?._id}`}
                      >
                        {item?.orderId?.orderId}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item?.userId?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {item?.userId?.phone}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={STATUS_VARIANT[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell>#{item.autoAssignRetryCount || 0}</TableCell>

                    <TableCell>
                      {formatDate(item.autoAssignExhaustedAt)}
                    </TableCell>

                    <TableCell>{formatDate(item.createdAt)}</TableCell>

                    <TableCell className="flex justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/admin/bookings/${item._id}`, {
                            state: { booking: item },
                          })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <PaginationComp
          page={page}
          pageCount={pagination?.totalPages || 1}
          setPage={setPage}
          className="mt-8 mb-5"
        />
      </div>
    </Wrapper>
  );
};

export default UnassignedBookings;

/* ---------------- Skeletons ---------------- */

const TableRowSkeleton = () => (
  <TableRow>
    {Array.from({ length: 7 }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-5 w-full rounded-md" />
      </TableCell>
    ))}
  </TableRow>
);
