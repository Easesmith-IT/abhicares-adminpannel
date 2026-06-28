"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { POST, PUT } from "@/constants/apiMethods";
import { Textarea } from "../ui/textarea";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),
  description: z.string().optional(),
});

const AddCategoryModal = ({ open, onClose, data, refresh }) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending } = useApiMutation({
    url: "/items/create",
    method: POST,
    invalidateKey: ["category"],
  });

  const { mutateAsync: updateCategory, isPending: isUpdateCategoryPending } =
    useApiMutation({
      url: `/items/update/${data?._id}`,
      method: PUT,
      invalidateKey: ["category"],
    });

  useEffect(() => {
    if (open) {
      form.reset({
        name: data?.name || "",
        description: data?.description || "",
      });
    }
  }, [open, data, form]);

  const onSubmit = async (values) => {

    data ? await updateCategory(values) : await mutateAsync(values);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {data?._id ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending || isUpdateCategoryPending}
              >
                Cancel
              </Button>

              <Button
                variant="medico"
                type="submit"
                disabled={isPending || isUpdateCategoryPending}
              >
                {isPending || isUpdateCategoryPending ? (
                  <Spinner />
                ) : data ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
