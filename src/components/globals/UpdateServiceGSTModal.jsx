import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetApiReq from "@/hooks/useGetApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";
import { useParams } from "react-router-dom";

const UpdateServiceGSTModal = ({ open, onOpenChange }) => {
  const { serviceId } = useParams();

  const [gstType, setGstType] = useState("GLOBAL");
  const [customPercentage, setCustomPercentage] = useState("");
  const [error, setError] = useState(null);

  const { res, fetchData, isLoading } = useGetApiReq();
  const {
    res: updateRes,
    fetchData: updateGST,
    isLoading: isUpdateLoading,
  } = usePostApiReq();

  /* ===============================
     Fetch effective service GST
  =============================== */
  useEffect(() => {
    if (open && serviceId) {
      fetchData(`/gst/get-custom-gst/${serviceId}`);
    }
  }, [open, serviceId]);

  useEffect(() => {
    if (res?.status === 200) {
      const gst = res?.data?.gst;
      setGstType(gst?.gstType || "GLOBAL");

      

      // Only prefill input if CUSTOM
      setCustomPercentage(
        gst?.gstType === "CUSTOM" ? (gst?.effectiveGSTPercentage ?? "") : "",
      );
    }
  }, [res]);

  /* ===============================
     Update service GST
  =============================== */
  const handleUpdate = () => {
    if (
      gstType === "CUSTOM" &&
      (customPercentage === "" || customPercentage < 0 || customPercentage > 28)
    ) {
      setError("GST must be between 0 and 28%");
      return;
    }

    setError(null);

    updateGST(`/gst/update-custom-gst/${serviceId}`, {
      gstType,
      customPercentage: gstType === "CUSTOM" ? Number(customPercentage) : null,
    });
  };

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      onOpenChange(false);
    }
  }, [updateRes]);

  /* ===============================
     Reset on close
  =============================== */
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Service GST Settings</DialogTitle>
        </DialogHeader>

        <Card className="border-none shadow-none!">
          <CardContent className="space-y-4 p-0">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading GST...
              </div>
            ) : (
              <>
                {/* GST TYPE */}
                <div className="space-y-2">
                  <Label>GST Type</Label>
                  <Select value={gstType} onValueChange={setGstType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select GST type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GLOBAL">Use Global GST</SelectItem>
                      <SelectItem value="CUSTOM">
                        Custom GST for this service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CUSTOM GST INPUT */}
                {gstType === "CUSTOM" && (
                  <div className="space-y-2">
                    <Label>Custom GST (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={28}
                      value={customPercentage}
                      onChange={(e) =>
                        setCustomPercentage(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="Enter GST percentage"
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
              </>
            )}
          </CardContent>
        </Card>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdateLoading}
          >
            Cancel
          </Button>

          <Button
            variant="abhicares"
            onClick={handleUpdate}
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update GST"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceGSTModal;
