import { useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { X, XIcon } from "lucide-react";
import { serviceSchema } from "../../schemas/service.schema";
import { BackLink } from "../shared/back-link";
import { H2 } from "../shared/typography";
import { useCities } from "@/components/filters/city";
import { CityCardSkeleton } from "./CityCardSkeleton";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { getImageDimensions } from "../../utils/getImageDimensions";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const IMAGE_MAX_SIZE = 2 * 1024 * 1024;
const BANNER_MAX_SIZE = 5 * 1024 * 1024;

const MIN_DIM = 512;
const MAX_DIM = 2000;

const BANNER_RATIO = 16 / 9;
const RATIO_TOLERANCE = 0.03;

const ServiceForm = ({ defaultValues, onSubmit, isLoading, label }) => {
  const fileRef = useRef(null);

  /* ----------------------------------
     Cities Hook (pagination source)
  ---------------------------------- */
  const {
    cities,
    page,
    totalPages,
    nextPage,
    prevPage,
    isLoading: cityLoading,
  } = useCities();

  /* ----------------------------------
     Form (ALL cities live here)
  ---------------------------------- */
  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      cityConfigs: [],
      ...defaultValues,
      previewImage: defaultValues.previewImage,
      bannerPreview: defaultValues?.bannerPreview || "",
    },
  });

  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const bannerRef = useRef(null);

  const bannerPreview = watch("bannerPreview");
  const bannerFile = watch("bannerFile");

  const handleBanner = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG PNG WEBP allowed");
      return;
    }

    if (file.size > BANNER_MAX_SIZE) {
      toast.error("Banner max 5MB");
      return;
    }

    try {
      const dim = await getImageDimensions(file);

      const ratio = dim.width / dim.height;

      // if (Math.abs(ratio - BANNER_RATIO) > RATIO_TOLERANCE) {
      //   toast.error("Banner must be 16:9");
      //   return;
      // }

      if (dim.width < 1280 || dim.height < 720) {
        toast.error("Recommended minimum 1280x720");
        return;
      }

      const preview = URL.createObjectURL(file);

      setValue("bannerFile", file);
      setValue("bannerPreview", preview);
    } catch {
      toast.error("Invalid banner image");
    }
  };

  const removeBanner = () => {
    if (bannerRef.current) bannerRef.current.value = "";

    setValue("bannerFile", null);
    setValue("bannerPreview", "");
  };

  console.log("getValues", getValues());

  const img = watch("img");
  const previewImage = watch("previewImage");
  const cityConfigs = watch("cityConfigs") || [];

  /* ----------------------------------
     Merge current page cities into cityConfigs
     (ACCUMULATE — Option B)
  ---------------------------------- */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];

    const cityMap = new Map(cities.map((c) => [c._id, c.name]));

    const merged = [
      ...existing.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId) ?? "",
      })),
      ...cities
        .filter((city) => !existing.some((c) => c.cityId === city._id))
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          startingPrice: "",
          appHomepage: false,
          webHomepage: false,
          isTrending: false,
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities]);

  /* ----------------------------------
     ONLY show current page cities (UI filter)
  ---------------------------------- */
  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleCityConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  /* ----------------------------------
     Image handling
  ---------------------------------- */
const handleImage = async (e) => {
 const file = e.target.files?.[0];
 if(!file) return;

 if(!ALLOWED_TYPES.includes(file.type)){
   toast.error("Only JPG PNG WEBP allowed");
   return;
 }

 if(file.size > IMAGE_MAX_SIZE){
   toast.error("Image max 2MB");
   return;
 }

 try{
   const dim = await getImageDimensions(file);

   if(
     dim.width < MIN_DIM ||
     dim.height < MIN_DIM
   ){
      toast.error("Minimum 512x512 required");
      return;
   }

   if(
      dim.width > MAX_DIM ||
      dim.height > MAX_DIM
   ){
      toast.error("Maximum 2000x2000 allowed");
      return;
   }

   const preview = URL.createObjectURL(file);

   setValue("img", file);
   setValue("previewImage", preview);

 } catch {
   toast.error("Corrupt image");
 }
};

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = "";
    setValue("img", null);
    setValue("previewImage", "");
  };

  const onError = (error) => {
    console.log("Error", error);
  };

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <div className="space-y-6">
      <BackLink href={-1}>
        <H2>{label}</H2>
      </BackLink>

      <Card>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <FormItem className="inline-block space-y-2">
                <Label>Service Banner</Label>

                <p className="text-sm text-muted-foreground">
                  Max 5MB • Recommended 1280x720
                </p>

                <Input
                  ref={bannerRef}
                  accept=".png,.jpg,.jpeg,.webp"
                  type="file"
                  onChange={handleBanner}
                />

                {bannerPreview && (
                  <div className="relative w-fit mt-2">
                    <img
                      src={
                        bannerFile
                          ? bannerPreview
                          : `${import.meta.env.VITE_APP_IMAGE_URL}/${bannerPreview}`
                      }
                      className="h-[150px] w-[300px] rounded-md border object-cover"
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-6 w-6"
                      onClick={removeBanner}
                    >
                      <XIcon size={14} />
                    </Button>
                  </div>
                )}
              </FormItem>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
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
                    <Label>Description</Label>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="quill-editor"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <FormItem className="inline-block mt-10">
                <Label>Image</Label>

                <p className="text-sm text-muted-foreground">
                  Square preferred • Max 2MB • Min 512x512
                </p>
                <Input
                  ref={fileRef}
                  accept=".png,.jpg,.jpeg,.webp"
                  type="file"
                  onChange={handleImage}
                />

                {previewImage && (
                  <div className="relative w-fit mt-2">
                    <img
                      src={
                        img
                          ? previewImage
                          : `${import.meta.env.VITE_APP_IMAGE_URL}/${previewImage}`
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
              </FormItem>

              {/* City-wise info */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  City-wise Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure price and homepage visibility per city. Pagination
                  only affects visibility — all city data will be submitted.
                </p>
              </div>

              {/* City cards (CURRENT PAGE ONLY) */}
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

                      return (
                        <Card key={city.cityId}>
                          <CardContent className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold uppercase">
                                  {city.cityName}
                                </h3>
                              </div>

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

                            {/* Starting Price */}
                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.startingPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Starting Price</Label>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      placeholder="Enter price"
                                      disabled={!isActive}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-3">
                              {["appHomepage", "webHomepage", "isTrending"].map(
                                (key) => (
                                  <FormField
                                    key={key}
                                    control={form.control}
                                    name={`cityConfigs.${index}.${key}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Label>
                                          {key === "appHomepage"
                                            ? "App Homepage"
                                            : key === "isTrending"
                                              ? "Is Trending"
                                              : "Web Homepage"}
                                        </Label>
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
                                            <SelectItem value="true">
                                              True
                                            </SelectItem>
                                            <SelectItem value="false">
                                              False
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />
                                ),
                              )}
                            </div>
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
    </div>
  );
};

export default ServiceForm;
