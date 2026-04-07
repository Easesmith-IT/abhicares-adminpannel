import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, X } from "lucide-react";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UpdatePwd from "./UpdatePwd";

const AddSubAdminModal = ({ setIsModalOpen, subAdmin, getSubadmins }) => {
  const {
    res: addSubAdminRes,
    fetchData: addSubAdmin,
    isLoading: addSubAdminLoading,
  } = usePostApiReq();

  const { res: updateSubAdminRes, fetchData: updateSubAdmin } =
    usePatchApiReq();

  const [info, setInfo] = useState({
    name: subAdmin?.name || "",
    password: subAdmin?.password || "",
    role: subAdmin?.role || "",
    adminId: subAdmin?.adminId || "",
  });

  const [isPasswordHide, setIsPasswordHide] = useState(true);
  const [updatePwdModal, setUpdatePwdModal] = useState(false);

  const [permissions, setPermissions] = useState({
    dashboard: subAdmin?.permissions?.dashboard || "",
    banners: subAdmin?.permissions?.banners || "",
    orders: subAdmin?.permissions?.orders || "",
    bookings: subAdmin?.permissions?.bookings || "",
    services: subAdmin?.permissions?.services || "",
    partners: subAdmin?.permissions?.partners || "",
    customers: subAdmin?.permissions?.customers || "",
    offers: subAdmin?.permissions?.offers || "",
    availableCities: subAdmin?.permissions?.availableCities || "",
    payments: subAdmin?.permissions?.payments || "",
    enquiry: subAdmin?.permissions?.enquiry || "",
    helpCenter: subAdmin?.permissions?.helpCenter || "",
    settings: subAdmin?.permissions?.settings || "",
    reviews: subAdmin?.permissions?.reviews || "",
    notifications: subAdmin?.permissions?.notifications || "",
    sellerCashout: subAdmin?.permissions?.sellerCashout || "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key, value) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const isInvalid =
      !info.adminId ||
      !info.name ||
      (!subAdmin && !info.password) ||
      !info.role ||
      Object.values(permissions).some((v) => !v);

    if (isInvalid) {
      toast.error("All fields are required");
      return;
    }

    if (subAdmin) {
      await updateSubAdmin(`/admin/update-sub-admin/${subAdmin._id}`, {
        ...info,
        permissions,
      });
    } else {
      addSubAdmin("/admin/create-Admin", { ...info, permissions });
    }
  };

  useEffect(() => {
    if (addSubAdminRes?.status === 200 || addSubAdminRes?.status === 201) {
      // toast.success("SubAdmin added successfully");
      setIsModalOpen(false);
      getSubadmins();
    }
  }, [addSubAdminRes]);

  useEffect(() => {
    if (
      updateSubAdminRes?.status === 200 ||
      updateSubAdminRes?.status === 201
    ) {
      // toast.success("SubAdmin updated successfully");
      setIsModalOpen(false);
      getSubadmins();
    }
  }, [updateSubAdminRes]);

  return (
    <>
      <Dialog open onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{subAdmin ? "Update" : "Add"} Sub Admin</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[65vh] pr-4">
            <form className="space-y-5" onSubmit={handleOnSubmit}>
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input
                  name="adminId"
                  value={info.adminId}
                  onChange={handleOnChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={info.name}
                  onChange={handleOnChange}
                />
              </div>

              {!subAdmin && (
                <div className="space-y-2 relative">
                  <Label>Password</Label>
                  <Input
                    type={isPasswordHide ? "password" : "text"}
                    name="password"
                    value={info.password}
                    onChange={handleOnChange}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordHide(!isPasswordHide)}
                    className="absolute right-3 top-9 text-muted-foreground"
                  >
                    {isPasswordHide ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  name="role"
                  value={info.role}
                  onChange={handleOnChange}
                >
                  <option value="">Select</option>
                  <option value="subAdmin">Sub Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Permissions</Label>

                {Object.keys(permissions).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key}</span>

                    <RadioGroup
                      value={permissions[key]}
                      onValueChange={(val) => handlePermissionChange(key, val)}
                      className="flex gap-4"
                    >
                      {["read", "write", "none"].map((val) => (
                        <div key={val} className="flex items-center gap-1">
                          <RadioGroupItem value={val} id={`${key}-${val}`} />
                          <Label htmlFor={`${key}-${val}`}>{val}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <div>
                  {subAdmin && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setUpdatePwdModal(true)}
                    >
                      Update Password
                    </Button>
                  )}
                </div>
                
                <Button variant="abhicares" type="submit">
                  {addSubAdminLoading
                    ? "Loading..."
                    : subAdmin
                      ? "Update"
                      : "Add"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {updatePwdModal && (
        <UpdatePwd
          setIsModalOpen={setUpdatePwdModal}
          adminId={subAdmin?.adminId}
        />
      )}
    </>
  );
};

export default AddSubAdminModal;
