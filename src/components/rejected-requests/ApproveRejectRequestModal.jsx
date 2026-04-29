import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import usePostApiReq from "../../hooks/usePostApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  adminNote: z
    .string()
    .min(5, "Minimum 5 characters required")
    .max(300, "Maximum 300 characters"),

  assignmentMode: z.enum(["manual", "auto"]).optional(),
});

const API_MAP = {
  approve: "/admin/approve-seller-booking-reject-request",
  reject: "/admin/reject-seller-booking-reject-request",
};

const TITLE_MAP = {
  approve: "Approve Reject Request",
  reject: "Reject Seller Request",
};

const BUTTON_MAP = {
  approve: "Approve Request",
  reject: "Reject Request",
};

const PLACEHOLDER_MAP = {
  approve: "Enter approval note...",
  reject: "Enter rejection reason...",
};

const ApproveRejectRequestModal = ({
  open,
  setOpen,
  requestId,
  mode = "approve",
  refetch,
  autoAssignEnabled = true, // from global settings
  bookingId
}) => {
  const { res, fetchData, isLoading } = usePostApiReq();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminNote: "",
      assignmentMode: "auto",
    },
  });

  const onSubmit = (values) => {
    const payload = {
      requestId,
      adminNote: values.adminNote,
    };

    if (mode === "approve") {
      payload.assignmentMode = values.assignmentMode;
    }

    fetchData(API_MAP[mode], payload, {
      screenName: "ApproveRejectRequestModal",
      severity: "MEDIUM",
      userType: "Admin",
    });
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      form.reset({
        adminNote: "",
        assignmentMode: "manual",
      });

      if (mode === "approve") {
        navigate(`/admin/bookings/${bookingId}`)
      }

      setOpen(false);

      refetch?.();
    }
  }, [res]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {TITLE_MAP[mode]}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Assignment Mode only for approve */}
            {mode === "approve" && (
              <FormField
                control={form.control}
                name="assignmentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Mode</FormLabel>

                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {/* Manual */}
                        <label
                          htmlFor="manual"
                          className={`rounded-2xl border p-4 cursor-pointer transition 
            ${
              field.value === "manual"
                ? "border-primary ring-2 ring-primary/20 bg-muted/30"
                : "hover:border-muted-foreground/40"
            }`}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem
                              value="manual"
                              id="manual"
                              className="mt-1"
                            />

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                Manual Assignment
                              </div>

                              <p className="text-sm text-muted-foreground">
                                Approve request without sending to auto-assign
                                queue.
                              </p>
                            </div>
                          </div>
                        </label>

                        {/* Auto */}
                        <label
                          htmlFor="auto"
                          className={`rounded-2xl border p-4 transition
            ${
              !autoAssignEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
            ${
              field.value === "auto"
                ? "border-primary ring-2 ring-primary/20 bg-muted/30"
                : "hover:border-muted-foreground/40"
            }`}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem
                              value="auto"
                              id="auto"
                              disabled={!autoAssignEnabled}
                              className="mt-1"
                            />

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-medium">
                                <Zap className="h-4 w-4" />
                                Auto Queue Assignment
                              </div>

                              <p className="text-sm text-muted-foreground">
                                Immediately push booking into auto-assign queue.
                              </p>

                              {!autoAssignEnabled && (
                                <p className="text-xs font-medium text-destructive">
                                  Global auto-assign is currently disabled
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="adminNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Note</FormLabel>

                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={PLACEHOLDER_MAP[mode]}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                variant={mode === "approve" ? "abhicares" : "destructive"}
              >
                {isLoading ? "Processing..." : BUTTON_MAP[mode]}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveRejectRequestModal;
