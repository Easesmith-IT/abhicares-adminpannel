"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import usePostApiReq from "@/hooks/usePostApiReq";
import { Spinner } from "../ui/spinner";
import { walletCreditSchema } from "../../schemas/user.schema";



export default function WalletCreditModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}) {
  const { fetchData, isLoading, res } = usePostApiReq();

  const form = useForm({
    resolver: zodResolver(walletCreditSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const onSubmit = async (values) => {
    await fetchData("/userWallet/credit", {
      userId,
      amount: values.amount,
      description: values.description,
    });
  };

  // Handle success response
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    }
  }, [res]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Credit User Wallet</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Refund for cancelled order"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button variant="abhicares" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Credit Wallet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
