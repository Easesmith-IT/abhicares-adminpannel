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
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

import { useCities } from "@/components/filters/city";
import { CityCardSkeleton } from "./CityCardSkeleton";
import { packageSchema } from "../../schemas/service.schema";
import { Spinner } from "../ui/spinner";

const PackageForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  serviceId,
  allProducts = [],
  label = "Save Package",
}) => {
  const fileRef = useRef(null);

  console.log("allProducts", allProducts);
  console.log("defaultValues", defaultValues);

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

  console.log("previewImages",previewImages);
  
  const [uploadedImages, setUploadedImages] = useState([]);

  /* ---------------- Form ---------------- */
  const form = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      cityConfigs: defaultValues?.cityConfigs || [],
      durationMinutes: defaultValues?.durationMinutes || 0,
      products:
        defaultValues?.products?.map((item) => ({
          productId:
            typeof item.productId === "object"
              ? item.productId._id
              : item.productId,
          name:
            typeof item.productId === "object"
              ? item.productId.name
              : undefined,
        })) || [],
    },
  });

  const {
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = form;

  const cityConfigs = watch("cityConfigs") || [];
  const products = watch("products") || [];

  useEffect(() => {
    if (defaultValues?.imageUrl) {
      setPreviewImages(
        defaultValues.imageUrl.map((image) => ({
          id: crypto.randomUUID(),
          preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${image}`,
        })),
      );
    }
  }, [defaultValues?.imageUrl]);

  /* ---------------- Merge cities ---------------- */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];
    const cityMap = new Map(cities.map((c) => [c._id, c.city || c.name]));

    const merged = [
      ...existing.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId) ?? "",
        isActive: cfg.isActive ?? false,
        showOnHomepage: cfg.showOnHomepage ?? false,
        price: cfg.price ?? "",
        offerPrice: cfg.offerPrice ?? "",
      })),
      ...cities
        .filter((city) => !existing.some((c) => c.cityId === city._id))
        .map((city) => ({
          cityId: city._id,
          cityName: city.city || city.name,
          isActive: false,
          showOnHomepage: false,
          price: "",
          offerPrice: "",
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities]);

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
    const pid = product._id.toString();

    const exists = products.some((p) => p.productId?.toString() === pid);

    setValue(
      "products",
      exists
        ? products.filter((p) => p.productId?.toString() !== pid)
        : [...products, { productId: pid, name: product.name }],
      { shouldDirty: true },
    );
  };

const MAX_IMAGES = 3;
const MAX_SIZE = 2 * 1024 * 1024; //2MB
const MIN_WIDTH = 512;
const MIN_HEIGHT = 512;
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const getImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      reject(new Error("Invalid/corrupt image"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });

const handleImages = async (e) => {
  let files = Array.from(e.target.files || []);

  if (!files.length) return;

  const remainingSlots = MAX_IMAGES - previewImages.length;

  if (files.length > remainingSlots) {
    toast.error(`Only ${remainingSlots} more image(s) allowed`);
    files = files.slice(0, remainingSlots);
  }

  const validFiles = [];

  for (const file of files) {
    // type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name}: invalid format`);
      continue;
    }

    // size validation
    if (file.size > MAX_SIZE) {
      toast.error(`${file.name}: exceeds 2MB`);
      continue;
    }

    // duplicate prevention (simple heuristic)
    const duplicate = uploadedImages.some(
      (i) => i.file?.name === file.name && i.file?.size === file.size,
    );

    if (duplicate) {
      toast.error(`${file.name} already added`);
      continue;
    }

    try {
      const dim = await getImageDimensions(file);

      if (dim.width < MIN_WIDTH || dim.height < MIN_HEIGHT) {
        toast.error(`${file.name}: minimum ${MIN_WIDTH}x${MIN_HEIGHT}`);
        continue;
      }

      if (dim.width > MAX_WIDTH || dim.height > MAX_HEIGHT) {
        toast.error(`${file.name}: maximum ${MAX_WIDTH}x${MAX_HEIGHT}`);
        continue;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
        file,
      });
    } catch {
      toast.error(`${file.name} is corrupt`);
    }
  }

  if (!validFiles.length) return;

  setPreviewImages((prev) => [...prev, ...validFiles]);
  setUploadedImages((prev) => [...prev, ...validFiles]);

  if (fileRef.current) {
    fileRef.current.value = "";
  }
};

  const removeImage = (id) => {
    setPreviewImages((p) => p.filter((i) => i.id !== id));
    setUploadedImages((p) => p.filter((i) => i.id !== id));
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------------- Submit ---------------- */
  const handleFormSubmit = (values) => {
    console.log("values",values);
    
    const fd = new FormData();

    fd.append("name", values.name);
    fd.append("description", values.description);
    fd.append("serviceId", serviceId);
    fd.append("products", JSON.stringify(values.products));
    fd.append("durationMinutes", values?.durationMinutes);

    const sanitizedCityConfigs = values.cityConfigs.map((cfg) => ({
      cityId: cfg.cityId,
      isActive: cfg.isActive,
      price: cfg.isActive ? Number(cfg.price) : 0,
      offerPrice: cfg.isActive ? Number(cfg.offerPrice) : 0,
    }));

    fd.append("cityConfigs", JSON.stringify(sanitizedCityConfigs));

    uploadedImages.forEach((img) => img.file && fd.append("img", img.file));

    onSubmit(fd);
  };

  const onError = (error) => {
    console.log("error", error);
  };

  /* ---------------- UI ---------------- */
  return (
    <Card>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, onError)}
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
             <FormField
                          control={form.control}
                          name="durationMinutes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration Minutes</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
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
            <div className="space-y-2 mt-5">
              <FormLabel>
                Images ({previewImages.length}/{MAX_IMAGES})
              </FormLabel>

              <Input
                ref={fileRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImages}
                disabled={previewImages.length >= MAX_IMAGES}
              />

              <p className="text-sm text-muted-foreground">
                Max 3 images • 2MB each • JPG PNG WEBP • Min 512x512
              </p>

              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((img) => (
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
            {/* Products */}
            <div className="space-y-3">
              <FormLabel>Products</FormLabel>

              {/* 🔴 PRODUCTS ERROR (FIXED) */}
              {errors.products?.message && (
                <div className="rounded-md border border-red-300 bg-red-50 p-2">
                  <p className="text-sm font-medium text-red-600">
                    {errors.products.message}
                  </p>
                </div>
              )}

              <div
                className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${
                  errors.products ? "ring-1 ring-red-300 rounded-md p-2" : ""
                }`}
              >
                {allProducts.map((product) => {
                  const selected = products.some(
                    (p) => p.productId === product._id,
                  );

                  return (
                    <label
                      key={product._id}
                      className={`flex gap-3 border rounded-md p-3 cursor-pointer ${
                        selected ? "border-green-500 bg-green-50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleProduct(product)}
                        className="sr-only"
                      />

                      <div className="flex-1">
                        {product?.imageUrl?.[0] ? (
                          <img
                            src={`${import.meta.env.VITE_APP_IMAGE_URL}/${product.imageUrl?.[0]}`}
                            alt={product.name}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                            className="h-[200px] w-full rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="h-[200px] w-full rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            No Image Available
                          </div>
                        )}

                        <div className="flex justify-between mt-2">
                          <p className="font-medium">{product.name}</p>
                          {product.rating && <Badge>⭐ {product.rating}</Badge>}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            {/* City-wise Pricing */}
            <h3 className="text-lg font-semibold">City-wise Pricing</h3>
            {/* Array-level city error */}
            {/* {errors.cityConfigs?.root?.message && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-600">
                  {errors.cityConfigs.root.message}
                </p>
              </div>
            )} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CityCardSkeleton key={i} />
                  ))
                : visibleCityConfigs.map((city) => {
                    const index = cityConfigs.findIndex(
                      (c) => c.cityId === city.cityId,
                    );

                    const isActive = watch(`cityConfigs.${index}.isActive`);

                    const cityError = errors.cityConfigs?.[index];
                    const cityErrorMessages = [];

                    if (cityError?.price?.message)
                      cityErrorMessages.push(cityError.price.message);
                    if (cityError?.offerPrice?.message)
                      cityErrorMessages.push(cityError.offerPrice.message);

                    return (
                      <Card
                        key={city.cityId}
                        className={
                          cityError ? "border-red-500 ring-1 ring-red-300" : ""
                        }
                      >
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold uppercase">
                              {city.cityName}
                            </h4>

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.isActive`}
                              render={({ field }) => (
                                <div className="flex items-center gap-2">
                                  <Switch
                                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);
                                      if (!checked) {
                                        clearErrors([
                                          `cityConfigs.${index}.price`,
                                          `cityConfigs.${index}.offerPrice`,
                                        ]);
                                      }
                                    }}
                                  />
                                  <Badge
                                    variant={
                                      field.value ? "success" : "inprogress"
                                    }
                                  >
                                    {field.value ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              )}
                            />
                          </div>

                          {cityErrorMessages.length > 0 && (
                            <div className="rounded-md border border-red-300 bg-red-50 p-2">
                              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                {cityErrorMessages.map((msg, i) => (
                                  <li key={i}>{msg}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name={`cityConfigs.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    disabled={!isActive}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`cityConfigs.${index}.offerPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Offer Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    disabled={!isActive}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
            {errors.cityConfigs?.root?.message && (
              <FormMessage>{errors.cityConfigs.root.message}</FormMessage>
            )}
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
                {isLoading ? <Spinner /> : label}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PackageForm;
