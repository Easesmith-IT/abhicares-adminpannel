import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import { readCookie } from "../../utils/readCookie";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdatePwd = ({ setIsModalOpen, adminId }) => {
  const adminInfo = readCookie("adminInfo");

  const currentPwdRef = useRef(null);
  const updatePwdRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { res: updatePwdRes, fetchData: updatePwdFetchData } = usePatchApiReq();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const currentPassword = currentPwdRef.current.value;
    const newPassword = updatePwdRef.current.value;

    await updatePwdFetchData(`/admin/update-admin-password`, {
      currentPassword,
      newPassword,
      adminId: adminInfo?.id,
    });
  };

  useEffect(() => {
    if (updatePwdRes?.status === 200 || updatePwdRes?.status === 201) {
      setIsModalOpen(false);
    }
  }, [updatePwdRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Password</DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <p className="text-center text-sm font-medium text-destructive">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleOnSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              ref={currentPwdRef}
              type="password"
              id="current-password"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              ref={updatePwdRef}
              type="password"
              id="new-password"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex justify-end">
            <Button variant="abhicares" type="submit">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePwd;
