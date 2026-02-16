import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import usePostApiReq from "@/hooks/usePostApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import { Input } from "../../../components/ui/input";

export default function VerifyCashSubmissionModal({
  open,
  onClose,
  submissionId,
  getData,
}) {
  const [status, setStatus] = useState("APPROVED");
  const [remarks, setRemarks] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const { res, fetchData, isLoading } = usePatchApiReq();

  const handleSubmit = async () => {
    fetchData(`/cashout/verifySubmission/${submissionId}/verify`, {
      status,
      remarks,
      paymentId,
    });
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      onClose();
      getData();
      console.log("submit res", res?.data);
    }
  }, [res]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Verify Cash Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Approve</SelectItem>
                <SelectItem value="REJECTED">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Id</label>
            <Input
              placeholder="Enter Payment Id"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
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
          <Button variant="abhicares" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
