import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { X } from "lucide-react";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { getImageDimensions } from "../../utils/getImageDimensions";

const MAX_SIZE = 1 * 1024 * 1024; //1MB

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MIN_DIM = 256;
const MAX_DIM = 1024;

const AddCategoryIconModal = ({
  setIsModalOpen,
  categoryId,
  getCategoryDetails,
}) => {
  const { res, fetchData, isLoading } = usePatchApiReq();
  const fileRef = useRef(null);

  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState("");

 const handleImageChange = async (e) => {
 const file = e.target.files?.[0];
 if (!file) return;

 if(!ALLOWED_TYPES.includes(file.type)){
   toast.error("Only JPG, PNG, WEBP allowed");
   return;
 }

 if(file.size > MAX_SIZE){
   toast.error("Icon max size 1MB");
   return;
 }

 try{
   const dim = await getImageDimensions(file);

   if(
      dim.width < MIN_DIM ||
      dim.height < MIN_DIM
   ){
      toast.error("Minimum 256x256 required");
      return;
   }

   if(
      dim.width > MAX_DIM ||
      dim.height > MAX_DIM
   ){
      toast.error("Maximum 1024x1024 allowed");
      return;
   }

   // enforce square icon
   const ratio = dim.width / dim.height;

  //  if(Math.abs(ratio - 1) > 0.03){
  //     toast.error("Icon must be square (1:1)");
  //     return;
  //  }

   const reader = new FileReader();

   reader.onload = () => {
      setIcon(file);
      setPreview(reader.result);
   };

   reader.readAsDataURL(file);

 } catch {
   toast.error("Invalid or corrupt image");
 }
};

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!icon) {
      toast.error("Please select an icon");
      return;
    }

    const formData = new FormData();
    formData.append("img", icon);

    fetchData(`/categories/upload-category-icon/${categoryId}`, formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      getCategoryDetails();
      setIsModalOpen(false);
    }
  }, [res]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Category Icon</DialogTitle>
          <DialogDescription>
            Upload an icon that represents this category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File input */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <p className="text-sm text-muted-foreground">
              Square icon • Max 1MB • 256x256 min • PNG/WebP preferred
            </p>
            <Input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="relative w-fit">
              <img
                src={preview}
                alt="icon preview"
                className="h-[120px] rounded-md border object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={() => {
                  setIcon(null);
                  setPreview("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <X size={14} />
              </Button>
            </div>
          )}

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
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryIconModal;
