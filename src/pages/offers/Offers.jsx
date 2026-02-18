import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import useGetApiReq from "@/hooks/useGetApiReq";

import Wrapper from "@/components/wrappers/Wrapper";
import { PaginationComp } from "@/components/shared/PaginationComp";
import OfferRow from "@/components/offer/OfferRow";

import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "../../components/shared/typography";

/* ---------------- Skeleton ---------------- */

const OfferTableSkeleton = ({ rows = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-24 ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

/* ---------------- Component ---------------- */

const Offers = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const getOffers = () => {
    fetchData(`/offers/get-offers?page=${page}`);
  };

  /* Fetch */
  useEffect(() => {
    getOffers();
  }, [page]);

  useEffect(() => {
    if (res?.status === 200) {
      console.log("res", res);
      
      setOffers(res.data.data || []);
      setPageCount(res.data?.pagination?.totalPages || 0);
    }
  }, [res]);

  /* Filter */
  // useEffect(() => {
  //   if (statusFilter === "all") {
  //     setFilteredOffers(offers);
  //   } else if (statusFilter === "active") {
  //     setFilteredOffers(offers.filter((o) => o.isActive));
  //   } else {
  //     setFilteredOffers(offers.filter((o) => !o.isActive));
  //   }
  // }, [statusFilter, offers]);

  return (
    <Wrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <H2>Offers</H2>

        <div className="flex gap-3">
          {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select> */}

          <Button variant="abhicares" asChild>
            <Link to="/admin/offers/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer</TableHead>
              <TableHead>Type</TableHead>
              {/* <TableHead>Type</TableHead> */}
              <TableHead>Created At</TableHead>
              <TableHead>Valid To</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <OfferTableSkeleton />
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No offers found
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <OfferRow key={offer._id} offer={offer} refetch={getOffers} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && (
        <PaginationComp
          page={page}
          pageCount={pageCount}
          setPage={setPage}
          className="mt-8"
        />
      )}
    </Wrapper>
  );
};

export default Offers;
