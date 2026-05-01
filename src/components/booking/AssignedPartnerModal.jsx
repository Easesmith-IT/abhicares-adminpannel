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

  const {
    res: assignRes,
    fetchData: assignSeller,
    isLoading: isAssignSellerLoading,
  } = usePatchApiReq();

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

  const handleAssign = async (sellerId, index) => {
    setIndex(index);
    await assignSeller(`/admin/allot-seller-order/${sellerId}`, {
      bookingId,
    });
  };

  useEffect(() => {
    if (assignRes?.status === 200 || assignRes?.status === 201) {
      // toast.success("Order assigned to seller successfully");
      getBooking();
      setIsModalOpen(false);
    }
  }, [assignRes]);

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
            const servedServices = seller.services
              ?.map((item) => item.serviceName)
              .join(", ");

            console.log("i", i);
            console.log("index", index);

            return (
              <Card
                key={seller._id}
                className="shadow-none! border border-slate-300!"
              >
                <CardContent className="p-4 space-y-4">
                  {/* ===== Header ===== */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                        {seller.name?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium leading-none">
                          {seller.name}
                        </p>
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
                      title={
                        !seller.online ? "Partner is offline" : "Assign partner"
                      }
                      onClick={() => handleAssign(seller._id, i)}
                    >
                      {index === i && isAssignSellerLoading ? (
                        <Spinner />
                      ) : (
                        "Assign"
                      )}
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedPartnerModal;
