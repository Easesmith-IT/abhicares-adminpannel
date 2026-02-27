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

import { X } from "lucide-react";
import { serviceSchema } from "../../schemas/service.schema";
import { BackLink } from "../shared/back-link";
import { H2 } from "../shared/typography";
import { useCities } from "@/components/filters/city";
import { CityCardSkeleton } from "./CityCardSkeleton";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";

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
    },
  });

  const { watch, setValue, getValues } = form;
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
                              {["appHomepage", "webHomepage"].map((key) => (
                                <FormField
                                  key={key}
                                  control={form.control}
                                  name={`cityConfigs.${index}.${key}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Label>
                                        {key === "appHomepage"
                                          ? "App Homepage"
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
                              ))}
                            </div>
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
