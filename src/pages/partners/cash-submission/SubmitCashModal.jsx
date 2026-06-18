import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import usePostApiReq from "@/hooks/usePostApiReq";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Spinner } from "../../../components/ui/spinner";

export default function SubmitCashModal({ open, onClose, state, getData }) {
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const { deliveryAgentId } = useParams();

  const { res, fetchData, isLoading } = usePostApiReq();

  const handleSubmit = async () => {
    if (amount <= 0) {
      return toast.error("Enter Amount");
    }
    fetchData(`/cash-collection/submit-cash`, {
      deliveryPartnerId: deliveryAgentId,
      cityId: state?.cityId,
      zoneId: state?.zoneId,
      amount: Number(amount),
      remarks,
    });
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      onClose();
      getData();
      console.log("submit res", res?.data);
    }
  }, [res]);
  console.log("amount", amount);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Submit Cash</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Remarks</label>
            <Textarea
              placeholder="Add remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="abhicares"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Spinner className="mr-2" />}
            {!isLoading && "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
