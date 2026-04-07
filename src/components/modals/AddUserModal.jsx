import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

const AddUserModal = ({ setIsModalOpen, user = "", getAllUsers }) => {
  const {
    res: addUserRes,
    fetchData: addUser,
    isLoading: addUserLoading,
  } = usePostApiReq();

  const { res: updateUserRes, fetchData: addUserFetchData } = usePatchApiReq();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    status: user?.status ?? true,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((p) => ({ ...p, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.name || !userInfo.phone || userInfo.status === "") {
      toast.error("All fields are required");
      return;
    }

    if (user) {
      await addUserFetchData(`/admin/update-user/${user._id}`, {
        ...userInfo,
      });
    } else {
      addUser("/admin/create-user", { ...userInfo });
    }
  };

  useEffect(() => {
    if (addUserRes?.status === 200 || addUserRes?.status === 201) {
      // toast.success("User created successfully");
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

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Update User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleOnChange}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="number"
              value={userInfo.phone}
              onChange={handleOnChange}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={String(userInfo.status)}
              onValueChange={(v) =>
                setUserInfo((p) => ({
                  ...p,
                  status: v === "true",
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={addUserLoading}>
              {addUserLoading ? "Saving..." : user ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
