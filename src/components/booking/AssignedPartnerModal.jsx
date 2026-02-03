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

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";

const AssignedPartnerModal = ({
  setIsModalOpen,
  serviceId = "",
  bookingId,
  getBooking,
}) => {
  const [sellers, setSellers] = useState([]);

  const { res: sellerRes, fetchData: getSellers, isLoading } = useGetApiReq();

  const { res: assignRes, fetchData: assignSeller } = usePatchApiReq();

  /* ================= Fetch Sellers ================= */

  useEffect(() => {
    if (serviceId) {
      getSellers(`/admin/get-seller-list/${serviceId}`);
    }
  }, [serviceId]);

  useEffect(() => {
    if (sellerRes?.status === 200) {
      setSellers(sellerRes.data.data);
    }
  }, [sellerRes]);

  /* ================= Assign ================= */

  const handleAssign = async (sellerId) => {
    await assignSeller(`/admin/allot-seller-order/${sellerId}`, {
      bookingId,
    });
  };

  useEffect(() => {
    if (assignRes?.status === 200 || assignRes?.status === 201) {
      toast.success("Order assigned to seller successfully");
      getBooking();
      setIsModalOpen(false);
    }
  }, [assignRes]);

  /* ================= UI ================= */

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Partner</DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && sellers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No sellers found for selected service.
          </p>
        )}

        {/* Sellers */}
        <div className="space-y-3">
          {sellers.map((seller) => (
            <Card key={seller._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="text-sm">
                  <p className="font-medium">{seller.name}</p>
                  <p className="text-muted-foreground">{seller.phone}</p>
                </div>

                <Button variant="abhicares" onClick={() => handleAssign(seller._id)} size="sm">
                  Assign
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedPartnerModal;
