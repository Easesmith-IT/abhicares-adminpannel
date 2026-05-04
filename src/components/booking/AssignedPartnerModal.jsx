import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { Spinner } from "../ui/spinner";
import AssignCard from "./AssignCard";

const AssignedPartnerModal = ({
  setIsModalOpen,
  serviceId = "",
  bookingId,
  getBooking,
  assignedSellerId,
}) => {
  console.log("serviceId", serviceId);

  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(null);

  const { res: sellerRes, fetchData: getSellers, isLoading } = useGetApiReq();

  /* ================= Initial Fetch ================= */

  useEffect(() => {
    if (serviceId) {
      getSellers(`/admin/get-seller-list/${serviceId}?search=${search}`);
    }
  }, [serviceId, search]);

  /* ================= Search (API Driven) ================= */

  /* ================= Response ================= */

  useEffect(() => {
    if (sellerRes?.status === 200) {
      setSellers(sellerRes.data.data || []);
      console.log("sellerRes", sellerRes);
    }
  }, [sellerRes]);

  /* ================= Assign ================= */

  /* ================= UI ================= */

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Partner</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <Input
          placeholder="Search by phone number or partner ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && sellers.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            No sellers found.
          </p>
        )}

        {/* Sellers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {sellers.map((seller, i) => {
            console.log("i", i);
            console.log("index", index);

            return (
              <AssignCard
                i={i}
                index={index}
                setIndex={setIndex}
                seller={seller}
                key={seller._id}
                assignedSellerId={assignedSellerId}
                bookingId={bookingId}
                getBooking={getBooking}
                setIsModalOpen={setIsModalOpen}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedPartnerModal;
