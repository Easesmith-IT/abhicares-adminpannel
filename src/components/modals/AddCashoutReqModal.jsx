import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import usePostApiReq from "../../hooks/usePostApiReq";

const AddCashoutReqModal = ({
  setIsUpdateModalOpen,
  getCashOutRequests,
  walletId,
}) => {
  const { res, fetchData, isLoading } = usePostApiReq();

  const [cashOutInfo, setCashOutInfo] = useState({
    amount: "",
    description: "",
    paymentId: "",
  });

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCashOutInfo((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cashOutInfo.amount) {
      toast.error("Amount is required");
      return;
    }

    fetchData("/admin/add-seller-cashout", {
      sellerWalletId: walletId,
      value: cashOutInfo.amount,
      payId: cashOutInfo.paymentId,
      description: cashOutInfo.description,
    });
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      toast.success("Cashout request added");
      setIsUpdateModalOpen(false);
      getCashOutRequests(walletId);
    }
  }, [res]);

  return (
    <Dialog open onOpenChange={setIsUpdateModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add Cashout Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={cashOutInfo.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={cashOutInfo.description}
              onChange={handleChange}
              placeholder="Optional description"
            />
          </div>

          {/* Payment ID */}
          <div className="space-y-2">
            <Label htmlFor="paymentId">Payment ID</Label>
            <Input
              id="paymentId"
              name="paymentId"
              value={cashOutInfo.paymentId}
              onChange={handleChange}
              placeholder="Transaction / UPI / Ref ID"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="abhicares" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCashoutReqModal;
