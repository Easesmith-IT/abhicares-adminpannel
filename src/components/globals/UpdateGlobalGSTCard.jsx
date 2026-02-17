import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useGetApiReq from "@/hooks/useGetApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";

const UpdateGlobalGSTCard = () => {
  const [gst, setGst] = useState({
    enabled: false,
    percentage: 0,
  });

  const [error, setError] = useState(null);

  const { res, fetchData, isLoading } = useGetApiReq();
  const { fetchData: updateGST, isLoading: isUpdateLoading } = usePostApiReq();

  /* ===============================
     Fetch GST
  =============================== */
  useEffect(() => {
    fetchData("/gst/get-global-gst");
  }, []);

  useEffect(() => {
    if (res?.status === 200) {
      setGst(res.data.gst);
    }
  }, [res]);

  /* ===============================
     Update GST
  =============================== */
  const handleUpdate = () => {
    if (gst.percentage < 0 || gst.percentage > 28) {
      setError("GST percentage must be between 0 and 28");
      return;
    }

    setError(null);
    updateGST("/gst/update-global-gst", gst);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Global GST</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading GST configuration...
          </div>
        ) : (
          <>
            {/* Enable / Disable GST */}
            <div className="flex items-center justify-between">
              <Label>Enable GST</Label>
              <Switch
                checked={gst.enabled}
                onCheckedChange={(checked) =>
                  setGst((prev) => ({ ...prev, enabled: checked }))
                }
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
              />
            </div>

            {/* GST Percentage */}
            <div className="space-y-2">
              <Label>GST Percentage (%)</Label>
              <Input
                type="number"
                min={0}
                max={28}
                disabled={!gst.enabled}
                value={gst.percentage}
                onChange={(e) =>
                  setGst((prev) => ({
                    ...prev,
                    percentage:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                placeholder="Enter GST %"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end pt-2">
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateGlobalGSTCard;
