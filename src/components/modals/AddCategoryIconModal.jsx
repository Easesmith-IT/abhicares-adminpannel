import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import usePostApiReq from "../../hooks/usePostApiReq";

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
import usePatchApiReq from "../../hooks/usePatchApiReq";

const AddCategoryIconModal = ({
  setIsModalOpen,
  categoryId,
  getCategoryDetails,
}) => {
  const { res, fetchData, isLoading } = usePatchApiReq();
  const fileRef = useRef(null);

  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setIcon(file);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
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
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
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
