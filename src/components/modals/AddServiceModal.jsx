import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react";

const AddServiceModal = ({
  setIsModalOpen,
  isModalOpen,
  categoryId,
  service = null,
  getCategoryServices,
}) => {
  const { res: addRes, fetchData: addService, isLoading } = usePostApiReq();
  const { res: updateRes, fetchData: updateService,isLoading:isUpdateLoading } = usePatchApiReq();

  const fileRef = useRef(null);

  const [description, setDescription] = useState(service?.description || "");

  const [form, setForm] = useState({
    name: service?.name || "",
    startingPrice: service?.startingPrice || "",
    img: service?.imageUrl || "",
    previewImage: "",
    appHomepage: service?.appHomepage ?? false,
    webHomepage: service?.webHomepage ?? false,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  console.log("isLoading", isLoading);
  

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({
        ...p,
        img: file,
        previewImage: reader.result,
      }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = "";
    setForm((p) => ({ ...p, img: "", previewImage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.startingPrice || !description || !form.img) {
      toast.error("All fields are required");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("startingPrice", form.startingPrice);
    fd.append("description", description);
    fd.append("appHomepage", form.appHomepage);
    fd.append("webHomepage", form.webHomepage);
    fd.append("img", form.img);
    fd.append("categoryId", categoryId);

    if (service) {
      updateService(`/admin/update-service/${service._id}`, fd);
    } else {
      addService("/admin/create-service", fd);
    }
  };

  useEffect(() => {
    if (addRes?.status === 200 || addRes?.status === 201) {
      // toast.success("Service added successfully");
      getCategoryServices();
      setIsModalOpen(false);
    }
  }, [addRes]);

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      // toast.success("Service updated successfully");
      getCategoryServices();
      setIsModalOpen(false);
    }
  }, [updateRes]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? "Update Service" : "Add Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={onChange} />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Starting Price</Label>
            <Input
              type="number"
              name="startingPrice"
              value={form.startingPrice}
              onChange={onChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Image</Label>
            <Input ref={fileRef} type="file" onChange={handleImage} />

            {(form.previewImage || form.img) && (
              <div className="relative w-fit">
                <img
                  src={
                    form.previewImage ||
                    `${import.meta.env.VITE_APP_IMAGE_URL}/${form.img}`
                  }
                  className="h-[120px] rounded-md border object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* App Homepage */}
            <div className="space-y-2">
              <Label>App Homepage</Label>
              <Select
                value={String(form.appHomepage)}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    appHomepage: v === "true",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Web Homepage */}
            <div className="space-y-2">
              <Label>Web Homepage</Label>
              <Select
                value={String(form.webHomepage)}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    webHomepage: v === "true",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

            <Button variant="abhicares" type="submit" disabled={isLoading}>
              {isLoading || isUpdateLoading
                ? "Saving..."
                : service
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
