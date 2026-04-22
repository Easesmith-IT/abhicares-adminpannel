import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCities } from "@/components/filters/city";

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
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { BackLink } from "@/components/shared/back-link";
import { H2 } from "@/components/shared/typography";
import { categorySchema } from "../../schemas/service.schema";
import { CityCardCategorySkeleton } from "./CityCardSkeleton";
import { XIcon } from "lucide-react";

const CategoryForm = ({ defaultValues, onSubmit, isLoading, label }) => {
  const {
    cities,
    page,
    totalPages,
    nextPage,
    prevPage,
    isLoading: cityLoading,
  } = useCities();

  const fileRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      cityConfigs: [],
      ...defaultValues,
      previewImage: defaultValues?.previewImage,
      // bannerFile: defaultValues?.banner || "",
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

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setValue("bannerFile", file);
    setValue("bannerPreview", preview);
  };

  const removeBanner = () => {
    if (bannerRef.current) bannerRef.current.value = "";

    setValue("bannerFile", null);
    setValue("bannerPreview", "");
  };

  console.log("getValues", getValues());

  const cityConfigs = watch("cityConfigs") || [];
  const previewImage = watch("previewImage");
  const img = watch("img");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setValue("img", file);
    setValue("previewImage", preview);
  };

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = "";
    setValue("img", null);
    setValue("previewImage", "");
  };

  /**
   * Merge paginated cities into cityConfigs (same pattern as ServiceForm)
   */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];
    const cityMap = new Map(cities.map((c) => [c._id, c.name]));

    const merged = [
      ...existing.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId),
      })),
      ...cities
        .filter((c) => !existing.some((e) => e.cityId === c._id))
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          commission: 0,
          convenience: 0,
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities]);

  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  const onError = (error) => {
    console.log("error", error);
  };

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
                <Label>Category Banner</Label>

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
                    <Label>Category Name</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="inline-block space-y-2">
                <Label>Image</Label>
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
                      className="h-[150px] rounded-md border object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-6 w-6"
                      onClick={removeImage}
                    >
                      <XIcon size={14} />
                    </Button>
                  </div>
                )}
              </FormItem>

              {/* City Configs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <CityCardCategorySkeleton key={i} />
                    ))
                  : visibleConfigs.map((city) => {
                      const index = cityConfigs.findIndex(
                        (c) => c.cityId === city.cityId,
                      );

                      const isActive = watch(`cityConfigs.${index}.isActive`);

                      return (
                        <Card key={city.cityId}>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between">
                              <h3 className="font-semibold uppercase">
                                {city.cityName}
                              </h3>

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
                              name={`cityConfigs.${index}.commission`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Commission (%)</Label>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={!isActive}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.convenience`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Convenience Fee</Label>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={!isActive}
                                      {...field}
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
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevPage}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={nextPage}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="abhicares"
                  type="submit"
                  disabled={isLoading || cityLoading}
                >
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

export default CategoryForm;
