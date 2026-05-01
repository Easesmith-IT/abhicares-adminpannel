import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateReferEarnModal = ({ setIsModalOpen }) => {
  const {
    res: updateReferAmountRes,
    fetchData: updateReferAmount,
    isLoading: updateReferAmountLoading,
  } = usePostApiReq();

  const { res: getReferAmountRes, fetchData: getReferAmount } = useGetApiReq();

  const [amount, setAmount] = useState("");

  const referAndEarnData = async () => {
    getReferAmount(`/admin/get-refer-and-earn-amount`);
  };

  useEffect(() => {
    referAndEarnData();
  }, []);

  useEffect(() => {
    if (
      getReferAmountRes?.status === 200 ||
      getReferAmountRes?.status === 201
    ) {
      setAmount(getReferAmountRes?.data?.doc?.[0]?.amount ?? "");
    }
  }, [getReferAmountRes]);

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    updateReferAmount("/admin/update-refer-and-earn-amount", {
      amount,
    });
  };

  useEffect(() => {
    if (
      updateReferAmountRes?.status === 200 ||
      updateReferAmountRes?.status === 201
    ) {
      // toast.success(updateReferAmountRes?.data?.message);
      setIsModalOpen(false);
    }
  }, [updateReferAmountRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Refer & Earn</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleOnChange}
              placeholder="Enter amount"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="abhicares"
              type="submit"
              disabled={updateReferAmountLoading}
            >
              {updateReferAmountLoading ? "Loading..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateReferEarnModal;
