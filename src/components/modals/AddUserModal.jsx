import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

/* ---------------- SCHEMA ---------------- */
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  dateOfBirth: z.string().optional(),

  Gender: z.string().min(1, "Gender is required"),

});

/* ---------------- COMPONENT ---------------- */
const AddUserModal = ({ setIsModalOpen, user = null, getAllUsers }) => {
  const {
    res: addUserRes,
    fetchData: addUser,
    isLoading: addUserLoading,
  } = usePostApiReq();

  const {
    res: updateUserRes,
    fetchData: updateUser,
    isLoading: updateLoading,
  } = usePatchApiReq();

  /* ---------------- FORM ---------------- */
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      Gender: user?.Gender || "",
    },
  });

  /* ---------------- SUBMIT ---------------- */
  const handleOnSubmit = async (values) => {
    if (user) {
      await updateUser(`/admin/update-user/${user._id}`, values);
    } else {
      await addUser("/admin/create-user", values);
    }
  };

  /* ---------------- SUCCESS HANDLING ---------------- */
  useEffect(() => {
    if (addUserRes?.status === 200 || addUserRes?.status === 201) {
      toast.success("User created successfully");
      getAllUsers();
      setIsModalOpen(false);
    }
  }, [addUserRes]);

  useEffect(() => {
    if (updateUserRes?.status === 200 || updateUserRes?.status === 201) {
      // toast.success("User updated successfully");
      getAllUsers();
      setIsModalOpen(false);
    }
  }, [updateUserRes]);

  /* ---------------- UI ---------------- */
  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Update User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="space-y-4"
          >
            {/* NAME */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DOB */}
            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GENDER */}
            <FormField
              name="Gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={addUserLoading || updateLoading}>
                {addUserLoading || updateLoading
                  ? "Saving..."
                  : user
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
