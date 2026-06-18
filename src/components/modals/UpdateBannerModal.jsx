import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

import usePostApiReq from "../../hooks/usePostApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const UpdateBannerModal = ({ setIsModalOpen, getBannersFromServer, data }) => {
  const { res, fetchData, isLoading } = usePostApiReq();

  const { res: getAllCategoryRes, fetchData: getAllCategory } = useGetApiReq();

  const { res: getServicesRes, fetchData: getServices } = useGetApiReq();

  const [info, setInfo] = useState({
    categoryId: "",
    serviceId: "",
  });

  const [skipLinking, setSkipLinking] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allCategoryServices, setAllCategoryServices] = useState([]);

  /* -------------------- fetch categories -------------------- */
  useEffect(() => {
    getAllCategory("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (getAllCategoryRes?.status === 200) {
      setAllCategories(getAllCategoryRes.data.data || []);
    }
  }, [getAllCategoryRes]);

  /* -------------------- fetch services -------------------- */
  useEffect(() => {
    if (info.categoryId) {
      getServices(`/admin/get-category-service/${info.categoryId}`);
    }
  }, [info.categoryId]);

  useEffect(() => {
    if (getServicesRes?.status === 200) {
      setAllCategoryServices(getServicesRes.data.data || []);
    }
  }, [getServicesRes]);

  /* -------------------- submit -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("img", data.img);
    formData.append("type", data.type);
    formData.append("page", data.page);
    formData.append("section", data.section);

    if (!skipLinking) {
      formData.append("categoryId", info.categoryId);
      formData.append("serviceId", info.serviceId);
    }

    fetchData("/content/upload-banners", formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      // toast.success("Banner updated successfully");
      setIsModalOpen(false);
      getBannersFromServer();
    }
  }, [res]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skip linking */}
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={skipLinking}
              onCheckedChange={setSkipLinking}
              id="skip"
            />
            <Label htmlFor="skip" className="text-sm">
              Do not link banner to category/service
            </Label>
          </div>

          {!skipLinking && (
            <>
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={info.categoryId}
                  onValueChange={(value) =>
                    setInfo((p) => ({
                      ...p,
                      categoryId: value,
                      serviceId: "",
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service */}
              {info.categoryId && (
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select
                    value={info.serviceId}
                    onValueChange={(value) =>
                      setInfo((p) => ({ ...p, serviceId: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategoryServices.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end">
            <Button variant="abhicares" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBannerModal;
