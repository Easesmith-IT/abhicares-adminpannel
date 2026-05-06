import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { Spinner } from "../ui/spinner";

const AssignCard = ({
  seller,
  i,
  index,
  assignedSellerId,
  setIndex,
  bookingId,
  getBooking,
  setIsModalOpen
}) => {
  const servedServices = seller.services
    ?.map((item) => item.serviceName)
    .join(", ");

  const [reason, setReason] = useState("");

    const {
      res: assignRes,
      fetchData: assignSeller,
      isLoading: isAssignSellerLoading,
    } = usePatchApiReq();

  const handleAssign = async (sellerId, index) => {
      setIndex(index);
  
      if (assignedSellerId) {
        await assignSeller(`/admin/reassign-seller-order/${sellerId}`, {
          bookingId,
          reason
        });
      } else {
        await assignSeller(`/admin/allot-seller-order/${sellerId}`, {
          bookingId,
        });
      }
    };

    useEffect(() => {
        if (assignRes?.status === 200 || assignRes?.status === 201) {
          // toast.success("Order assigned to seller successfully");
          getBooking();
          setIsModalOpen(false);
        }
      }, [assignRes]);

  return (
    <Card className="shadow-none! border border-slate-300!">
      <CardContent className="p-4 space-y-4">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
              {seller.name?.charAt(0)}
            </div>

            <div>
              <p className="font-medium leading-none">{seller.name}</p>
              <p className="text-xs text-muted-foreground">
                Partner ID: {seller.partnerId}
              </p>
            </div>
          </div>

          <Button
            variant="abhicares"
            size="sm"
            disabled={
              !seller.online ||
              seller?._id === assignedSellerId ||
              (index === i && isAssignSellerLoading)
            }
            title={!seller.online ? "Partner is offline" : "Assign partner"}
            onClick={() => handleAssign(seller._id, i)}
          >
            {seller.online ? index === i && isAssignSellerLoading ? (
              <Spinner />
            ) : (
              "Assign"
            ):"Offline"}
          </Button>
        </div>

        {/* ===== Status ===== */}
        <div className="flex gap-2">
          <Badge variant={seller.online ? "success" : "secondary"}>
            {seller.online ? "Online" : "Offline"}
          </Badge>

          <Badge variant="outline">
            {seller.services?.length || 0} Services
          </Badge>
        </div>

        {/* ===== Details ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Phone:</span>{" "}
            {seller.phone || "—"}
          </div>

          <div>
            <span className="text-muted-foreground">Business:</span>{" "}
            {seller.legalName || "—"}
          </div>

          <div>
            <span className="text-muted-foreground">GST:</span>{" "}
            {seller.gstNumber || "—"}
          </div>

          <div>
            <span className="text-muted-foreground">City:</span>{" "}
            {seller.address?.location?.city || "—"}
          </div>

          <div className="sm:col-span-2">
            <span className="text-muted-foreground">Category:</span>{" "}
            {seller.category ? seller.category?.name : "—"}
          </div>

          <div className="sm:col-span-2">
            <span className="text-muted-foreground">Services:</span>{" "}
            {servedServices ? servedServices : "—"}
          </div>
        </div>

        {assignedSellerId && (
          <div className="space-y-2 mt-2">
            <Label>Reason (Optional)</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              placeholder="Enter reason of re-assignment"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignCard;
