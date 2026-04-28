import * as React from "react";
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

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  adminNote: z
    .string()
    .min(5, "Minimum 5 characters required")
    .max(300, "Maximum 300 characters"),
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
}) => {
  const { res, fetchData, isLoading } = usePostApiReq();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminNote: "",
    },
  });

  const onSubmit = (values) => {
    fetchData(API_MAP[mode], {
      requestId,
      adminNote: values.adminNote,
    });
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      form.reset();
      setOpen(false);

      if (refetch) {
        refetch();
      }
    }
  }, [res]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {TITLE_MAP[mode]}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
