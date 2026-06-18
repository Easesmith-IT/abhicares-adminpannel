import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const UpdateComisionModal = ({
  setIsModalOpen,
  commission = "",
  getAllCategories,
}) => {
  const {
    res: updateCategoryDataRes,
    fetchData: updateCategoryData,
    isLoading: updateCategoryDataLoading,
  } = usePostApiReq();

  const [commissionInfo, setCommissionInfo] = useState({
    comissionRate: commission?.commission || "",
    convienceAmount: commission?.convenience || "",
  });

  useEffect(() => {
    setCommissionInfo({
      comissionRate: commission?.commission,
      convienceAmount: commission?.convenience,
    });
  }, [commission]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCommissionInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { comissionRate, convienceAmount } = commissionInfo;

    if (!comissionRate || !convienceAmount) {
      toast.error("All fields are required");
      return;
    }

    updateCategoryData("/admin/update-category-data", {
      categoryId: commission?._id,
      commission: comissionRate,
      convenience: convienceAmount,
    });
  };

  useEffect(() => {
    if (
      updateCategoryDataRes?.status === 200 ||
      updateCategoryDataRes?.status === 201
    ) {
      // toast.success("Updated successfully");
      getAllCategories();
      setIsModalOpen(false);
    }
  }, [updateCategoryDataRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Commission</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="comissionRate">Commission Rate (%)</Label>
            <Input
              id="comissionRate"
              type="number"
              name="comissionRate"
              value={commissionInfo.comissionRate}
              onChange={handleOnChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="convienceAmount">Convenience Amount</Label>
            <Input
              id="convienceAmount"
              type="number"
              name="convienceAmount"
              value={commissionInfo.convienceAmount}
              onChange={handleOnChange}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="abhicares"
              type="submit"
              disabled={updateCategoryDataLoading}
            >
              {updateCategoryDataLoading ? "Loading..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateComisionModal;
