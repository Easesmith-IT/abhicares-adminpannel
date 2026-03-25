import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rewardSchema } from "../../schemas/reward.schema";
import usePostApiReq from "../../hooks/usePostApiReq";
import { useParams } from "react-router-dom";
import { DialogDescription } from "../ui/dialog";

export default function AddRewardPointsModal({ open, setOpen, getRewardPoints, cityId }) {
  const params = useParams();
  const { res, fetchData, isLoading } = usePostApiReq();

  const form = useForm({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      points: "",
    },
  });

  const onSubmit = async (values) => {
    fetchData(`/rewards/add-bonus`, {
      userId: params?.customerId,
      city: cityId,
      points: values.points,
    });
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);
      setOpen(false)
      getRewardPoints();
    }
  }, [res]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔹 Dialog Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Reward Points</DialogTitle>
          {!cityId && (
            <DialogDescription>
              This user profile dont have city. Update its profile.
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Points */}
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter points"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="abhicares"
                type="submit"
                disabled={isLoading || !cityId}
              >
                {isLoading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
