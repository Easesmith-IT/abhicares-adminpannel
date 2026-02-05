import { useEffect, useState } from "react";
import parse from "html-react-parser";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Pencil, Trash2, Plus } from "lucide-react";

import useGetApiReq from "../../hooks/useGetApiReq";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import AddOfferModal from "../../components/modals/AddOfferModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { PaginationComp } from "../../components/shared/PaginationComp";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

/* ---------------- Skeleton Rows ---------------- */

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
          <Skeleton className="h-8 w-20 ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

/* ---------------- Component ---------------- */

const Offers = () => {
  const { res: deleteCouponRes, fetchData: deleteCoupon } =
    useDeleteApiReq();
  const {
    res: getCouponsRes,
    fetchData: getCoupons,
    isLoading,
  } = useGetApiReq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [offer, setOffer] = useState(null);
  const [allOffers, setAllOffers] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  /* ---------------- Fetch ---------------- */

  const getAllOffers = () => {
    getCoupons(`/admin/get-coupons?page=${page}`);
  };

  useEffect(() => {
    getAllOffers();
  }, [page]);

  useEffect(() => {
    if (getCouponsRes?.status === 200 || getCouponsRes?.status === 201) {
      setAllOffers(getCouponsRes.data.data || []);
      setPageCount(getCouponsRes.data.pagination?.totalPages || 1);
    }
  }, [getCouponsRes]);

  /* ---------------- Filter ---------------- */

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredResults(allOffers);
    } else {
      setFilteredResults(
        allOffers.filter((o) => o.status === statusFilter),
      );
    }
  }, [statusFilter, allOffers]);

  /* ---------------- Delete ---------------- */

  const handleDelete = () => {
    deleteCoupon(`/admin/delete-coupon/${offer}`);
  };

  useEffect(() => {
    if (deleteCouponRes?.status === 200 || deleteCouponRes?.status === 201) {
      toast.success("Offer deleted successfully");
      getAllOffers();
      setIsDeleteModalOpen(false);
    }
  }, [deleteCouponRes]);

  /* ---------------- Helpers ---------------- */

  const statusBadge = (status) =>
    status === "active" ? (
      <Badge className="bg-green-600">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );

  /* ---------------- Render ---------------- */

  return (
    <>
      <Wrapper>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Offers</h1>

          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="abhicares" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 border-b border-white/40">
                <TableHead>Coupon</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <OfferTableSkeleton />
              ) : filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-10"
                  >
                    No offers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((offer) => (
                  <TableRow key={offer._id}>
                    <TableCell className="font-medium">{offer.name}</TableCell>

                    <TableCell>
                      {offer.discountType === "fixed"
                        ? `₹${offer.couponFixedValue}`
                        : `${offer.offPercentage}%`}
                    </TableCell>

                    <TableCell className="capitalize">
                      {offer.discountType}
                    </TableCell>

                    <TableCell>
                      {offer.expiryDate
                        ? format(new Date(offer.expiryDate), "dd-MM-yyyy")
                        : "-"}
                    </TableCell>

                    <TableCell>{statusBadge(offer.status)}</TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setOffer(offer);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setOffer(offer._id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
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

      {/* Modals */}
      {isModalOpen && (
        <AddOfferModal
          setIsModalOpen={setIsModalOpen}
          getAllOffers={getAllOffers}
        />
      )}

      {isUpdateModalOpen && (
        <AddOfferModal
          setIsModalOpen={setIsUpdateModalOpen}
          getAllOffers={getAllOffers}
          offer={offer}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteModalOpen}
        />
      )}
    </>
  );
};

export default Offers;
