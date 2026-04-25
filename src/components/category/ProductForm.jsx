import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { useCities } from "@/components/filters/city";
import { productSchema } from "../../schemas/service.schema";
import { CityCardProductSkeleton } from "./CityCardSkeleton";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 2;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

const MIN_WIDTH = 512;
const MIN_HEIGHT = 512;

const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProductForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  serviceId,
  label = "Save Product",
}) => {
  const fileRef = useRef(null);

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
  const [uploadedImages, setUploadedImages] = useState([]);

  /* ---------------- Form ---------------- */
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      cityConfigs: defaultValues?.cityConfigs || [],
      // previewImage: defaultValues.imageUrl.map(
      //   (image) => ({preview:`${import.meta.env.VITE_APP_IMAGE_URL}/${image}`}),
      // ),
    },
  });

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

  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const cityConfigs = watch("cityConfigs") || [];
  const img = watch("img");
  const previewImage = watch("previewImage");

  console.log("getValues", getValues());

  console.log("cityConfigs", cityConfigs);

  /* ---------------- Merge cities ---------------- */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];

    const cityMap = new Map(cities.map((c) => [c._id, c.name]));

    const normalizedExisting = existing.map((cfg) => ({
      ...cfg,
      showOnHomepage: cfg.showOnHomepage || false,
      // 🔥 FIX: always force cityId to string
      cityId: typeof cfg.cityId === "object" ? cfg.cityId._id : cfg.cityId,

      cityName:
        cfg.cityName ??
        cityMap.get(
          typeof cfg.cityId === "object" ? cfg.cityId._id : cfg.cityId,
        ) ??
        "",
    }));

    const merged = [
      ...normalizedExisting,
      ...cities
        .filter(
          (city) => !normalizedExisting.some((c) => c.cityId === city._id),
        )
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          appHomepage: false,
          showOnHomepage: false,
          price: "",
          offerPrice: "",
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities]);

  /* ---------------- Visible cities ---------------- */
  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleCityConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  /* ---------------- Images ---------------- */
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
        reject();
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
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} invalid format`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds ${MAX_SIZE_MB}MB`);
        continue;
      }

      // duplicate prevention
      const duplicate = uploadedImages.some(
        (img) => img.file?.name === file.name && img.file?.size === file.size,
      );

      if (duplicate) {
        toast.error(`${file.name} already added`);
        continue;
      }

      try {
        const dim = await getImageDimensions(file);

        if (dim.width < MIN_WIDTH || dim.height < MIN_HEIGHT) {
          toast.error(`${file.name} min ${MIN_WIDTH}x${MIN_HEIGHT}`);
          continue;
        }

        if (dim.width > MAX_WIDTH || dim.height > MAX_HEIGHT) {
          toast.error(`${file.name} max ${MAX_WIDTH}x${MAX_HEIGHT}`);
          continue;
        }

        validFiles.push({
          id: crypto.randomUUID(),
          preview: URL.createObjectURL(file),
          file,
        });
      } catch {
        toast.error(`${file.name} corrupt image`);
      }
    }

    if (!validFiles.length) return;

    // append (important fix)
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
    const fd = new FormData();

    fd.append("name", values.name);
    fd.append("description", values.description);
    fd.append("serviceId", serviceId);

    const sanitizedCityConfigs = values.cityConfigs.map((cfg) => ({
      cityId: cfg.cityId,
      isActive: cfg.isActive,
      price: cfg.isActive ? Number(cfg.price) : 0,
      offerPrice: cfg.isActive ? Number(cfg.offerPrice) : 0,
      showOnHomepage: cfg.showOnHomepage || false,
    }));

    fd.append("cityConfigs", JSON.stringify(sanitizedCityConfigs));

    uploadedImages.forEach((img) => {
      if (img.file) fd.append("img", img.file);
    });

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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="quill-editor pb-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <div className="space-y-2 mt-5">
              <FormLabel>
                {" "}
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

            {/* City-wise Pricing */}
            <h3 className="text-lg font-semibold">City-wise Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CityCardProductSkeleton key={i} />
                  ))
                : visibleCityConfigs.map((city) => {
                    const index = cityConfigs.findIndex(
                      (c) => c.cityId === city.cityId,
                    );

                    const isActive = watch(`cityConfigs.${index}.isActive`);

                    return (
                      <Card key={city.cityId}>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <h4 className="font-semibold uppercase">
                              {city.cityName}
                            </h4>

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.isActive`}
                              render={({ field }) => (
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
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
                          <FormField
                            control={form.control}
                            name={`cityConfigs.${index}.showOnHomepage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Show on Homepage</FormLabel>
                                <FormControl>
                                  <Select
                                    disabled={!isActive}
                                    value={String(field.value)}
                                    onValueChange={(v) =>
                                      field.onChange(v === "true")
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">True</SelectItem>
                                      <SelectItem value="false">
                                        False
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
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

export default ProductForm;
