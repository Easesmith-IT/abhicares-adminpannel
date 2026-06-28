import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
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
  cancelled: "secondary",
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

export default function PartnerOfferedBookings() {
  const navigate = useNavigate();
  const params = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const { res, isLoading, error, fetchData } = useGetApiReq();

  useEffect(() => {
    const query = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
      ...(source && { source }),
    }).toString();

    fetchData(
      `/admin/seller-offer-history-admin/${params?.partnerId}?${query}`,
      {
        screenName: "OfferedBookings",
      },
    );
  }, [page, limit, search, status, source]);


  const offers = res?.data?.data || [];
  const pagination = res?.data?.pagination || {};

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setSource("");
    setPage(1);
  };

  return (
    <Wrapper>
      <div className="mt-6">
        <div className="flex justify-between items-center gap-3">
          <H2>Offered Bookings</H2>
          <PageSizeSelect
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            label=""
          />
        </div>

        {/* Metrics */}

        {/* <div className="grid md:grid-cols-4 gap-5 mt-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Offers</p>
            <h3 className="text-3xl font-bold mt-2">{metrics.totalOffers}</h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <h3 className="text-3xl font-bold mt-2">{metrics.accepted}</h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <h3 className="text-3xl font-bold mt-2">{metrics.rejected}</h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <h3 className="text-3xl font-bold mt-2">{metrics.avgScore}%</h3>
          </div>
        </div> */}

        {/* Filters */}

        <div className="flex flex-wrap gap-3 mt-6 mb-6">
          <Input
            placeholder="Search booking..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />

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
              <SelectItem value="offered">Offered</SelectItem>

              <SelectItem value="accepted">Accepted</SelectItem>

              <SelectItem value="rejected">Rejected</SelectItem>

              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
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
          </Select>

          <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
        </div>

        <div className="table-container mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200">
                <TableHead>Booking</TableHead>

                {/* <TableHead>Seller</TableHead> */}

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
                offers.map((offer) => (
                  <TableRow key={offer.offerId}>
                    <TableCell className="font-medium">
                      
                      <Link
                        className="hover:text-blue-700 hover:underline font-medium"
                        to={`/admin/bookings/${offer?.booking?._id}`}
                      >
                        {offer.booking.bookingId}
                      </Link>
                    </TableCell>

                    {/* <TableCell>
                      {offer.booking?.sellerId?.name || "-"}
                    </TableCell> */}

                    <TableCell>
                      <Badge
                        variant={
                          STATUS_VARIANT[offer.offerStatus?.toLowerCase()] ||
                          "outline"
                        }
                      >
                        {offer.offerStatus}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {offer.rejectReason ? (
                        <Badge variant="destructive">Has Reason</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>{offer.releaseRequest ? "Yes" : "-"}</TableCell>

                    <TableCell>
                      {offer.adminVisible ? (
                        <Badge variant="success">Visible</Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </TableCell>

                    <TableCell className="max-w-[200px]">
                      {offer.reasonMeta?.offerRejectReason || "-"}
                    </TableCell>

                    <TableCell>{formatDate(offer.offeredAt)}</TableCell>

                    <TableCell>{formatDate(offer.respondedAt)}</TableCell>

                    <TableCell className="flex justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate(
                            `/admin/partners/${params?.partnerId}/offered-bookings/${offer.offerId}`,
                            {
                              state: { offer },
                            },
                          )
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

        <div className="mt-8 mb-5 flex items-center justify-between gap-3">
          <PaginationComp
            page={page}
            pageCount={pagination?.totalPages || 1}
            setPage={setPage}
          />
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
    {Array.from({ length: 10 }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-5 w-full rounded-md" />
      </TableCell>
    ))}
  </TableRow>
);
