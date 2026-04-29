import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Settings2, AlertTriangle } from "lucide-react";
import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";

export default function AutoAssignSetting() {
  const [enabled, setEnabled] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);
  const [open, setOpen] = useState(false);

  // GET hook
  const {
    res: getRes,
    isLoading: gettingSetting,
    fetchData: fetchSetting,
  } = useGetApiReq();

  // PATCH hook
  const {
    res: updateSettingRes,
    isLoading: updatingSetting,
    fetchData: updateAutoAssign,
  } = usePatchApiReq();

  // Fetch current setting
  useEffect(() => {
    loadSetting();
  }, []);

  const loadSetting = async () => {
    await fetchSetting("/admin/auto-assign-setting", {
      screenName: "AutoAssignSetting",
      severity: "LOW",
      userType: "Admin",
    });
  };

  // Sync response
  useEffect(() => {
    if (getRes?.status === 200 || getRes?.status === 201) {
      console.log("getRes", getRes);

      setEnabled(getRes?.data?.data?.autoAssignEnabled);
    }
  }, [getRes]);

  const handleToggleClick = (checked) => {
    setPendingValue(checked);
    setOpen(true);
  };

  const handleUpdateSetting = async () => {
    if (pendingValue === null) return;

    await updateAutoAssign(
      "/admin/auto-assign-setting",
      {
        autoAssignEnabled: pendingValue,
      },
      {
        screenName: "AutoAssignSetting",
        severity: "MEDIUM",
        userType: "Admin",
      },
    );
  };

  useEffect(() => {
    if (updateSettingRes?.status === 200 || updateSettingRes?.status === 201) {
      setEnabled(pendingValue);
      setOpen(false);
    }
  }, [updateSettingRes]);

  return (
    <>
      <div className="rounded-2xl border bg-card shadow-sm p-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">Auto Assign Booking</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Automatically assign incoming bookings to providers.
          </p>
        </div>

        {gettingSetting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Switch
            checked={enabled}
            onCheckedChange={handleToggleClick}
            disabled={updatingSetting}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
          />
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!updatingSetting) setOpen(value);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <DialogTitle className="text-center">
              {pendingValue ? "Enable Auto Assign?" : "Disable Auto Assign?"}
            </DialogTitle>

            <DialogDescription className="text-center">
              {pendingValue
                ? "Bookings will be assigned automatically."
                : "Bookings will require manual assignment."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-muted p-4 text-sm text-center">
            New Status:{" "}
            <span className="font-semibold">
              {pendingValue ? "Enabled" : "Disabled"}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              disabled={updatingSetting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateSetting}
              disabled={updatingSetting}
              variant={pendingValue ? "abhicares" : "destructive"}
            >
              {updatingSetting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
