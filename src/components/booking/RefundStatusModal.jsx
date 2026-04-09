"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import usePatchApiReq from "@/hooks/usePatchApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

// ✅ Validation schema
const formSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  refundStatus: z.enum(["pending", "processed", "failed", "not-applicable"]),
  comment: z.string().optional(),
});

export default function RefundStatusModal({ open, setOpen, bookingId,getBookingDetails }) {
  const { res,fetchData, isLoading } = usePatchApiReq();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingId: bookingId ||"",
      refundStatus: "",
      comment: "",
    },
  });

  // ✅ set bookingId when modal opens
  useEffect(() => {
    if (bookingId) {
      form.setValue("bookingId", bookingId);
    }
  }, [bookingId, form]);

  const onSubmit = async (values) => {
    await fetchData("/bookings/refund-status", values);
  };

useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
        setOpen(false);
        getBookingDetails()
      }
    }, [res]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Refund Status</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Booking ID */}
            {/* <FormField
              control={form.control}
              name="bookingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Refund Status */}
            <FormField
              control={form.control}
              name="refundStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="not-applicable">
                        Not Applicable
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" placeholder="Enter reason / comment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
