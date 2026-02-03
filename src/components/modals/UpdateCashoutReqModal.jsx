import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import usePatchApiReq from "../../hooks/usePatchApiReq";

const UpdateCashoutReqModal = ({
  setIsUpdateModalOpen,
  cashOutReq,
  getSellerWallet,
}) => {
  const { res, fetchData, isLoading } = usePatchApiReq();

  const [cashOutInfo, setCashOutInfo] = useState({
    status: cashOutReq?.status || "",
    description: cashOutReq?.description || "",
    paymentId: cashOutReq?.accountDetails?.paymentId || "",
    date:
      cashOutReq?.accountDetails?.date
        ? format(
            new Date(cashOutReq.accountDetails.date),
            "yyyy-MM-dd"
          )
        : "",
  });

  /* ---------------- Handlers ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      cashOutInfo.status === "cancelled" &&
      !cashOutInfo.description
    ) {
      toast.error("Description is required");
      return;
    }

    if (
      cashOutInfo.status === "completed" &&
      (!cashOutInfo.description ||
        !cashOutInfo.paymentId ||
        !cashOutInfo.date)
    ) {
      toast.error("All fields are required");
      return;
    }

    fetchData(`/admin/approve-cashout/${cashOutReq._id}`, {
      ...cashOutInfo,
    });
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      toast.success("Cashout request updated");
      setIsUpdateModalOpen(false);
      getSellerWallet();
    }
  }, [res]);

  return (
    <Dialog open onOpenChange={setIsUpdateModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Cashout Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={cashOutInfo.status}
              onValueChange={(v) =>
                setCashOutInfo((p) => ({ ...p, status: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Info (only if completed) */}
          {cashOutInfo.status !== "cancelled" && (
            <>
              <div className="space-y-2">
                <Label>Payment ID</Label>
                <Input
                  value={cashOutInfo.paymentId}
                  onChange={(e) =>
                    setCashOutInfo((p) => ({
                      ...p,
                      paymentId: e.target.value,
                    }))
                  }
                  placeholder="Transaction / Ref ID"
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={cashOutInfo.date}
                  onChange={(e) =>
                    setCashOutInfo((p) => ({
                      ...p,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={cashOutInfo.description}
              onChange={(e) =>
                setCashOutInfo((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              placeholder="Reason / notes"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="abhicares"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCashoutReqModal;
