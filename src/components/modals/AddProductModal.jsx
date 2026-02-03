import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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

const AddProductModal = ({
  setIsModalOpen,
  serviceId,
  product = null,
  getAllProducts,
}) => {
  const { res: addRes, fetchData: addProduct, isLoading } = usePostApiReq();
  const {
    res: updateRes,
    fetchData: updateProduct,
    isLoading: isUpdateLoading,
  } = usePatchApiReq();

  const fileRef = useRef(null);

  /* -------------------- State -------------------- */

  const [description, setDescription] = useState(product?.description || "");

  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    offerPrice: product?.offerPrice || "",
    images: product?.imageUrl || [],
    previewImages: product?.imageUrl
      ? product.imageUrl.map((img) => ({
          id: crypto.randomUUID(),
          preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${img}`,
          file: null,
        }))
      : [],
    uploadedImages: [],
  });

  /* -------------------- Image Upload -------------------- */

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const previews = files.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      file,
    }));

    setForm((prev) => ({
      ...prev,
      previewImages: previews,
      uploadedImages: previews,
    }));
  };

  const removeImage = (id) => {
    setForm((prev) => ({
      ...prev,
      previewImages: prev.previewImages.filter((i) => i.id !== id),
      uploadedImages: prev.uploadedImages.filter((i) => i.id !== id),
    }));

    if (fileRef.current) fileRef.current.value = "";
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.offerPrice || !description) {
      toast.error("All fields are required");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("offerPrice", form.offerPrice);
    fd.append("serviceId", serviceId);
    fd.append("description", description);
    fd.append("imageUrl", JSON.stringify(form.images));

    form.uploadedImages.forEach((img) => {
      if (img.file) fd.append("img", img.file);
    });

    product
      ? updateProduct(`/admin/update-product/${product._id}`, fd)
      : addProduct("/admin/create-product", fd);
  };

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    if (addRes?.status === 200 || addRes?.status === 201) {
      toast.success("Product added successfully");
      getAllProducts();
      setIsModalOpen(false);
    }
  }, [addRes]);

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      toast.success("Product updated successfully");
      getAllProducts();
      setIsModalOpen(false);
    }
  }, [updateRes]);

  /* -------------------- UI -------------------- */

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent
        className="
          max-w-3xl 
          w-full 
          max-h-[90vh] 
          overflow-y-auto 
        "
      >
        <DialogHeader>
          <DialogTitle>
            {product ? "Update Product" : "Add Product"}
          </DialogTitle>
          <DialogDescription>
            Create or update a product under this service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Offer Price</Label>
              <Input
                type="number"
                value={form.offerPrice}
                onChange={(e) =>
                  setForm((p) => ({ ...p, offerPrice: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="rounded-md border overflow-hidden">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="h-20 w-full"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images (max 3)</Label>
            <Input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {form.previewImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    className="h-[120px] w-full rounded-md border object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage(img.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
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

            <Button
              variant="abhicares"
              type="submit"
              disabled={isLoading || isUpdateLoading}
            >
              {isLoading || isUpdateLoading
                ? "Saving..."
                : product
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
