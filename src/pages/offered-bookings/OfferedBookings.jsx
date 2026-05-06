import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

const STATUS_VARIANT = {
  offered: "secondary",
  accepted: "success",
  rejected: "destructive",
  expired: "outline",
  cancelled: "inprogress",
};

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

export default function OfferedBookings() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("");
  const [lastFiveHours, setLastFiveHours] = useState(false);

  const { res, isLoading, error, fetchData } = useGetApiReq();

  useEffect(() => {
    const query = new URLSearchParams({
      page,
      limit: 10,
      lastFiveHours,
      ...(search && { search }),
      ...(status && { status }),
      ...(source && { source }),
    }).toString();

    fetchData(`/admin/getAdminAllSellerOfferHistory?${query}`, {
      screenName: "OfferedBookings",
    });
  }, [page, search, status, source,lastFiveHours]);

  console.log("res", res);

  const offers = res?.data?.data || [];
  const pagination = res?.data?.pagination || {};

  console.log("offers", offers);
  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setSource("");
    setLastFiveHours(false);
    setPage(1);
  };

  return (
    <Wrapper>
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <H2>Offered Bookings</H2>

          <Button asChild variant="abhicares" className="w-auto px-4">
            <Link to={`/admin/offered-bookings/unassigned`}>
              Auto Assign Failed Bookings
            </Link>
          </Button>
        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-3 mt-6 mb-6">
          {/* <Input
            placeholder="Search booking..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          /> */}

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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={lastFiveHours ? "abhicares" : "outline"}
            onClick={() => setLastFiveHours((prev) => !prev)}
          >
            Get Last Five Hours Data
          </Button>

          {/* <Select
            value={source}
            onValueChange={(v) => {
              setSource(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>

              <SelectItem value="admin">Admin</SelectItem>

              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select> */}

          <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
        </div>

        <div className="table-container mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200">
                <TableHead>Booking</TableHead>

                <TableHead>Seller</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Score</TableHead>

                <TableHead>Attempt</TableHead>

                <TableHead>Source</TableHead>

                <TableHead>Reason Codes</TableHead>

                <TableHead>Offered At</TableHead>

                <TableHead>Responded</TableHead>

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

              {!isLoading && offers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No offered bookings found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                offers?.map((offer) => (
                  <TableRow key={offer._id}>
                    <TableCell className="font-medium">
                      <Link
                        className="hover:text-blue-700 hover:underline font-medium"
                        to={`/admin/bookings/${offer?.bookingId?._id}`}
                      >
                        {offer?.bookingId?.bookingId || "-"}
                      </Link>
                    </TableCell>

                    <TableCell>{offer.sellerId?.name || "-"}</TableCell>

                    <TableCell>
                      <Badge variant={STATUS_VARIANT[offer.status]}>
                        {offer.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{offer.score || "-"}</TableCell>

                    <TableCell>#{offer.attemptNo || "0"}</TableCell>

                    <TableCell className="uppercase">
                      {offer.source || "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {offer?.reasonCodes?.length > 0
                          ? offer.reasonCodes?.map((code) => (
                              <Badge key={code} variant="outline">
                                {code}
                              </Badge>
                            ))
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell>{formatDate(offer.offeredAt)}</TableCell>

                    <TableCell>{formatDate(offer.respondedAt)}</TableCell>

                    <TableCell className="flex justify-end">
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
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <PaginationComp
          page={page}
          pageCount={pagination?.totalPages || 1}
          setPage={setPage}
          className="mt-8 mb-5"
        />
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
    {Array.from({ length: 10 }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-5 w-full rounded-md" />
      </TableCell>
    ))}
  </TableRow>
);
