import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import usePostApiReq from "../../hooks/usePostApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { X } from "lucide-react";
import { getImageDimensions } from "../../utils/getImageDimensions";

const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MIN_DIM = 512;
const MAX_DIM = 2000;

const AddFeatureModal = ({
  setIsModalOpen,
  feature = null,
  getServiceDetails,
  serviceId,
  index,
}) => {
  const { res: addRes, fetchData: addFeature, isLoading } =
    usePostApiReq();
  const { res: updateRes, fetchData: updateFeature,isLoading:isLoading2 } =
    usePatchApiReq();

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: feature?.title || "",
    description: feature?.description || "",
    img: feature?.image || null,
    preview: "",
  });

  /* ---------- Image ---------- */

 const handleImage = async (e) => {
   const file = e.target.files?.[0];
   if (!file) return;

   if (!ALLOWED_TYPES.includes(file.type)) {
     toast.error("Only JPG PNG WEBP allowed");
     return;
   }

   if (file.size > MAX_SIZE) {
     toast.error("Image max 2MB");
     return;
   }

   try {
     const dim = await getImageDimensions(file);

     if (dim.width < MIN_DIM || dim.height < MIN_DIM) {
       toast.error("Minimum 512x512 required");
       return;
     }

     if (dim.width > MAX_DIM || dim.height > MAX_DIM) {
       toast.error("Maximum 2000x2000 allowed");
       return;
     }

     const reader = new FileReader();

     reader.onload = () =>
       setForm((p) => ({
         ...p,
         img: file,
         preview: reader.result,
       }));

     reader.readAsDataURL(file);
   } catch {
     toast.error("Invalid or corrupt image");
   }
 };

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = "";
    setForm((p) => ({ ...p, img: null, preview: "" }));
  };

  /* ---------- Submit ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.img) {
      toast.error("All fields are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.name);
    fd.append("description", form.description);
    fd.append("img", form.img);

    if (feature) fd.append("index", index);

    feature
      ? updateFeature(
          `/admin/update-service-feature/${serviceId}`,
          fd,
        )
      : addFeature(`/admin/add-service-feature/${serviceId}`, fd);
  };

  /* ---------- Effects ---------- */

  useEffect(() => {
    if (addRes?.status === 200 || addRes?.status === 201) {
      getServiceDetails();
      setIsModalOpen(false);
    }
  }, [addRes]);

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      getServiceDetails();
      setIsModalOpen(false);
    }
  }, [updateRes]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {feature ? "Update Feature" : "Add Feature"}
          </DialogTitle>
          <DialogDescription>
            Add or update a feature shown for this service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Image</Label>
            <p className="text-sm text-muted-foreground">
              Max 2MB • Min 512x512 • JPG PNG WEBP
            </p>
            <Input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImage}
            />

            {(form.preview || form.img) && (
              <div className="relative w-fit">
                <img
                  src={
                    form.preview ||
                    `${import.meta.env.VITE_APP_IMAGE_URL}/${form.img}`
                  }
                  className="h-[120px] rounded-md border object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
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

            <Button
              variant="abhicares"
              type="submit"
              disabled={isLoading || isLoading2}
            >
              {isLoading || isLoading2
                ? "Saving..."
                : feature
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeatureModal;
