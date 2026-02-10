import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

import { useCities } from "@/components/filters/city";
import { CityCardSkeleton } from "./CityCardSkeleton";
import { packageSchema } from "../../schemas/service.schema";

const PackageForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  serviceId,
  allProducts = [],
  label = "Save Package",
}) => {
  const fileRef = useRef(null);

  /* ---------------- Cities ---------------- */
  const {
    cities,
    page,
    totalPages,
    nextPage,
    prevPage,
    isLoading: cityLoading,
  } = useCities();

  /* ---------------- Images ---------------- */
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  /* ---------------- Form ---------------- */
  const form = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      description: "",
      //   products: [],
      cityConfigs: [],
      ...defaultValues,
      products:
        defaultValues?.products.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name,
        })) || [],
    },
  });

  const { watch, setValue, getValues } = form;
  const cityConfigs = watch("cityConfigs") || [];
  const products = watch("products") || [];
  console.log("products", products);
  

  /* ---------------- Merge cities ---------------- */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];
    const existingIds = new Set(existing.map((c) => c.cityId));

    const merged = [
      ...existing,
      ...cities
        .filter((c) => !existingIds.has(c._id))
        .map((city) => ({
          cityId: city._id,
          cityName: city.city,
          state: city.state,
          country: city.country,
          isActive: city.isActive,
          startingPrice: "",
          price: "",
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities, getValues, setValue]);

  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleCityConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  /* ---------------- Products ---------------- */
  const toggleProduct = (product) => {
    const exists = products.some((p) => p.productId === product._id);

    setValue(
      "products",
      exists
        ? products.filter((p) => p.productId !== product._id)
        : [...products, { productId: product._id, name: product.name }],
      { shouldDirty: true },
    );
  };

  /* ---------------- Images ---------------- */
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

    setPreviewImages(previews);
    setUploadedImages(previews);
  };

  const removeImage = (id) => {
    setPreviewImages((p) => p.filter((i) => i.id !== id));
    setUploadedImages((p) => p.filter((i) => i.id !== id));
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------------- Submit ---------------- */
  const handleFormSubmit = (values) => {
    const fd = new FormData();

    fd.append("name", values.name);
    fd.append("description", values.description);
    fd.append("serviceId", serviceId);
    fd.append("products", JSON.stringify(values.products));
    fd.append("cityConfigs", JSON.stringify(values.cityConfigs));

    uploadedImages.forEach((img) => img.file && fd.append("img", img.file));

    onSubmit(fd);
  };

  /* ---------------- UI ---------------- */
  return (
    <Card>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Products */}
            <div className="space-y-3">
              <FormLabel>Products</FormLabel>

              <div className="grid grid-cols-2 gap-3">
                {allProducts.map((product) => (
                  <label
                    key={product._id}
                    className="flex items-center gap-3 border rounded-md p-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={products.some(
                        (p) => p.productId === product._id,
                      )}
                      onCheckedChange={() => toggleProduct(product)}
                    />
                    {product.name}
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {products.map((p) => (
                  <Badge key={p.productId}>{p.name}</Badge>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <FormLabel>Images (max 3)</FormLabel>
              <Input
                ref={fileRef}
                type="file"
                multiple
                onChange={handleImages}
              />

              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((img) => (
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

            {/* City-wise pricing */}
            <h3 className="text-lg font-semibold">City-wise Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CityCardSkeleton key={i} />
                  ))
                : visibleCityConfigs.map((city) => {
                    const index = cityConfigs.findIndex(
                      (c) => c.cityId === city.cityId,
                    );

                    return (
                      <Card key={city.cityId}>
                        <CardContent className="space-y-4">
                          <h4 className="font-semibold">{city.cityName}</h4>

                          <FormField
                            control={form.control}
                            name={`cityConfigs.${index}.startingPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Starting Price</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`cityConfigs.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={page === 1}
                onClick={prevPage}
              >
                Prev
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={page === totalPages}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button variant="abhicares" type="submit" disabled={isLoading}>
                {label}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PackageForm;
