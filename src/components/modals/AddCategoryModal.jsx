import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import { categorySchema } from "../../schemas/service.schema";
import { Spinner } from "../ui/spinner";


const AddCategoryModal = ({
  isOpen,
  onClose,
  initialData = null,
  getCategories,
}) => {
  
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      totalServices: initialData?.totalServices || 0,
    },
  });
  
  const { res, fetchData, isLoading } = usePostApiReq();
  const {
    res: updateRes,
    fetchData: updateCategory,
    isLoading: isUpdateLoading,
  } = usePatchApiReq();


  
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialData?.name || "",
        totalServices: initialData?.totalServices ?? 0,
      });
    }
  }, [isOpen, initialData, form]);


  const handleSubmit = (values) => {

    if (initialData) {
      updateCategory(`/admin/update-category/${initialData._id}`, values);
    } else {
      fetchData(`/admin/create-category`, values);
    }
  };

  


  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      onClose();
      getCategories();
    }
  }, [res]);

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      onClose();
      getCategories();
    }
  }, [updateRes]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Plumbing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {initialData && <FormField
              control={form.control}
              name="totalServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Total Services{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="abhicares"
                disabled={isLoading || isUpdateLoading}
              >
                {isLoading || isUpdateLoading ? <Spinner /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
