import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCities } from "@/components/filters/city";
import useGetApiReq from "@/hooks/useGetApiReq";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { CityCardCategorySkeleton } from "../category/CityCardSkeleton";

/* -------------------- ZOD SCHEMA -------------------- */
const bannerSchema = z.object({
  type: z.enum(["HOME", "OFFER", "REFER"]),
  cityConfigs: z.array(
    z.object({
      cityId: z.string(),
      isActive: z.boolean(),
      categoryId: z.string().nullable().optional(),
      serviceId: z.string().nullable().optional(),
      files: z.array(z.any()).optional(),
      previews: z.array(z.any()).optional(),
      existingImage: z.array(z.string()).optional(),
    }),
  ),
});

export default function BannerForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  isLoading,
}) {
  const bannerRef = useRef(null);

  const {
    cities,
    page,
    totalPages,
    nextPage,
    prevPage,
    isLoading: cityLoading,
  } = useCities();

  const { res: categoryRes, fetchData: getCategories } = useGetApiReq();
  const { res: serviceRes, fetchData: getServices } = useGetApiReq();

  const [categories, setCategories] = useState([]);
  const [servicesMap, setServicesMap] = useState({});

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      type: initialData.type || "",
      bannerFile: null,
      bannerPreview: initialData.defaultImage || "",
      cityConfigs: initialData.cityConfigs || [],
    },
  });

  const { watch, setValue, getValues } = form;

  const type = watch("type");
  const cityConfigs = watch("cityConfigs");

  /* -------------------- LOAD CATEGORIES -------------------- */
  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (categoryRes?.status === 200) {
      setCategories(categoryRes.data.data || []);
    }
  }, [categoryRes]);

  /* -------------------- LOAD SERVICES -------------------- */
  const loadServices = async (categoryId) => {
    await getServices(`/admin/get-category-service/${categoryId}`);
  };

  useEffect(() => {
    if (serviceRes?.status === 200) {
      const catId = serviceRes.config?.url.split("/").pop();
      setServicesMap((prev) => ({
        ...prev,
        [catId]: serviceRes.data.data,
      }));
    }
  }, [serviceRes]);

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
        .filter(
          (c) => !existing.some((e) => String(e.cityId) === String(c._id)),
        )
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          categoryId: "",
          serviceId: "",
          files: [],
          previews: [],
          existingImage: [],
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

  useEffect(() => {
    const existing = getValues("cityConfigs") || [];

    existing.forEach((c) => {
      if (c.categoryId) {
        loadServices(c.categoryId);
      }
    });
  }, []);

  /* -------------------- SUBMIT -------------------- */
  const submitHandler = (data) => {
    if (data.type === "HOME") {
      const invalid = data.cityConfigs.some(
        (c) =>
          c.isActive && (c.files?.length || c.existingImage?.length || 0) < 3,
      );

      if (invalid) {
        toast.error("Each active city must have 3 images for HOME banner");
        return;
      }
    }
    const formData = new FormData();

    formData.append("type", data.type);

    if (data.bannerFile) {
      formData.append("defaultImage", data.bannerFile);
    }

    const clean = data.cityConfigs.map((c) => ({
      cityId: c.cityId,
      image: c.existingImage || [],
      isActive: c.isActive,
      categoryId: c.categoryId || null,
      serviceId: c.serviceId || null,
    }));

    formData.append("cityConfigs", JSON.stringify(clean));

    data.cityConfigs.forEach((c) => {
      if (c.files?.length) {
        c.files.forEach((file, i) => {
          formData.append(`cityImage_${c.cityId}_${i}`, file);
        });
      }
    });

    onSubmit(formData);
  };

  const onError = (error) => {
    console.log("Error:", error);
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler, onError)}
            className="space-y-6"
          >
            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label>Type</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOME">HOME</SelectItem>
                      <SelectItem value="OFFER">OFFER</SelectItem>
                      <SelectItem value="REFER">REFER</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CITY CONFIGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CityCardCategorySkeleton key={i} />
                  ))
                : visibleConfigs.map((city) => {
                    const index = cityConfigs.findIndex(
                      (c) => c.cityId === city.cityId,
                    );
                    const services = servicesMap[city.categoryId] || [];

                    return (
                      <Card
                        key={city.cityId}
                        // className={!city.isActive ? "opacity-50" : ""}
                      >
                        <CardContent className="space-y-4 pt-4">
                          <div className="flex justify-between">
                            <h3 className="capitalize">{city.cityName}</h3>

                            <Switch
                              checked={city.isActive}
                              onCheckedChange={(val) =>
                                setValue(`cityConfigs.${index}.isActive`, val)
                              }
                              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                            />
                          </div>

                          {/* CATEGORY */}
                          <Select
                            value={city.categoryId}
                            onValueChange={(val) => {
                              setValue(`cityConfigs.${index}.categoryId`, val);
                              setValue(`cityConfigs.${index}.serviceId`, "");
                              loadServices(val);
                            }}
                            disabled={!city.isActive}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* SERVICE */}
                          <Select
                            value={city.serviceId}
                            onValueChange={(val) =>
                              setValue(`cityConfigs.${index}.serviceId`, val)
                            }
                            disabled={!city.categoryId || !city.isActive}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((s) => (
                                <SelectItem key={s._id} value={s._id}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* IMAGE */}
                          <Input
                            type="file"
                            multiple={type === "HOME"} // 🔥 key change
                            disabled={!city.isActive}
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);

                              if (!files.length) return;

                              const previews = files.map((f) =>
                                URL.createObjectURL(f),
                              );

                              setValue(`cityConfigs.${index}.files`, files);
                              setValue(
                                `cityConfigs.${index}.previews`,
                                previews,
                              );
                            }}
                          />

                          {(city.previews?.length > 0 ||
                            city.existingImage?.length > 0) && (
                            <div className="flex gap-2 flex-wrap">
                              {(city.previews?.length
                                ? city.previews
                                : city.existingImage || []
                              ).map((img, i) => (
                                <div key={i} className="relative">
                                  <img
                                    src={
                                      city.previews?.length
                                        ? img
                                        : `${import.meta.env.VITE_APP_IMAGE_URL}/${img}`
                                    }
                                    className="h-[100px] w-[100px] rounded-md border object-cover"
                                  />

                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -right-2 -top-2 h-5 w-5"
                                    onClick={() => {
                                      const newFiles = (
                                        city.files || []
                                      ).filter((_, idx) => idx !== i);
                                      const newPreviews = (
                                        city.previews || []
                                      ).filter((_, idx) => idx !== i);
                                      const newExisting = (
                                        city.existingImage || []
                                      ).filter((_, idx) => idx !== i);

                                      setValue(
                                        `cityConfigs.${index}.files`,
                                        newFiles,
                                      );
                                      setValue(
                                        `cityConfigs.${index}.previews`,
                                        newPreviews,
                                      );
                                      setValue(
                                        `cityConfigs.${index}.existingImage`,
                                        newExisting,
                                      );
                                    }}
                                  >
                                    <XIcon size={12} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>

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
              <Button variant="abhicares" type="submit">
                {isLoading ? <Spinner /> : isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
