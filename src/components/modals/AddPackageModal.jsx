import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

const AddPackageModal = ({
  setIsModalOpen,
  serviceId,
  getAllPackage,
  allProducts = [],
  selectedPackage = null,
}) => {
  const { res: addRes, fetchData: addPackage, isLoading } = usePostApiReq();
  const {
    res: updateRes,
    fetchData: updatePackage,
    isLoading: isPackageLoading,
  } = usePatchApiReq();

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: selectedPackage?.name || "",
    price: selectedPackage?.price || "",
    offerPrice: selectedPackage?.offerPrice || "",
    description: selectedPackage?.description || "",
    products: selectedPackage?.products || [],
    images: selectedPackage?.imageUrl || [],
    previewImages: [],
    uploadedImages: [],
  });

  /* ---------- Image Upload ---------- */

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    setForm((p) => ({
      ...p,
      uploadedImages: previews,
      previewImages: previews,
    }));
  };

  const removeImage = (id) => {
    setForm((p) => ({
      ...p,
      previewImages: p.previewImages.filter((i) => i.id !== id),
      uploadedImages: p.uploadedImages.filter((i) => i.id !== id),
    }));
  };

  /* ---------- Product Selection ---------- */

  const toggleProduct = (product) => {
    setForm((p) => {
      const exists = p.products.some((item) => item.productId === product._id);

      return {
        ...p,
        products: exists
          ? p.products.filter((item) => item.productId !== product._id)
          : [...p.products, { productId: product._id, name: product.name }],
      };
    });
  };

  /* ---------- Submit ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.offerPrice ||
      form.products.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("offerPrice", form.offerPrice);
    fd.append("description", form.description);
    fd.append("serviceId", serviceId);
    fd.append("products", JSON.stringify(form.products));
    fd.append("imageUrl", JSON.stringify(form.images));

    form.uploadedImages.forEach((img) => fd.append("img", img.file));

    selectedPackage
      ? updatePackage(`/admin/update-package/${selectedPackage._id}`, fd)
      : addPackage("/admin/create-package", fd);
  };

  useEffect(() => {
    if (addRes?.status === 200 || addRes?.status === 201) {
      // toast.success("Package added successfully");
      getAllPackage();
      setIsModalOpen(false);
    }
  }, [addRes]);

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      // toast.success("Package updated successfully");
      getAllPackage();
      setIsModalOpen(false);
    }
  }, [updateRes]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {selectedPackage ? "Update Package" : "Add Package"}
          </DialogTitle>
          <DialogDescription>
            Create or update a service package.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                className="resize-none"
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
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
                  setForm((p) => ({
                    ...p,
                    offerPrice: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <Label>Products</Label>

            <div className="grid grid-cols-2 gap-3">
              {allProducts.map((product) => (
                <label
                  key={product._id}
                  className="flex items-center gap-3 rounded-md border p-2 cursor-pointer"
                >
                  <Checkbox
                    checked={form.products.some(
                      (p) => p.productId === product._id,
                    )}
                    onCheckedChange={() => toggleProduct(product)}
                  />
                  {product.name}
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {form.products.map((p) => (
                <Badge key={p.productId} variant="secondary">
                  {p.name}
                </Badge>
              ))}
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

            <div className="grid grid-cols-3 gap-3">
              {form.previewImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    className="h-[120px] w-full rounded-md object-cover"
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

            <Button variant="abhicares" type="submit" disabled={isLoading||isPackageLoading}>
              {isLoading || isPackageLoading
                ? "Saving..."
                : selectedPackage
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPackageModal;
