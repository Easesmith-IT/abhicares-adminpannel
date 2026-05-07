import { useEffect, useMemo, useState } from "react";
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

import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { CityCardCategorySkeleton } from "../category/CityCardSkeleton";
import { getImageDimensions } from "../../utils/getImageDimensions";

/* -------------------- SCHEMA -------------------- */

const BannerItemSchema = z.object({
  categoryId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  existingImage: z.string().optional().nullable(),
  preview: z.string().optional().nullable(),
  file: z.any().optional().nullable(),
});

const bannerSchema = z
  .object({
    type: z.enum(["HOME", "OFFER", "REFER"]),

    cityConfigs: z.array(
      z.object({
        cityId: z.string(),
        cityName: z.string().optional(),
        isActive: z.boolean(),
        banners: z.array(BannerItemSchema),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    data.cityConfigs.forEach((city, cityIndex) => {
      if (!city.isActive) return;

      city.banners.forEach((banner, bannerIndex) => {
        const hasImage = banner.file || banner.existingImage;

        if (!hasImage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cityConfigs", cityIndex, "banners", bannerIndex, "file"],
            message: "Banner image is required",
          });
        }
      });
    });
  });

const makeEmptyBanner = () => ({
  categoryId: "",
  serviceId: "",
  existingImage: "",
  preview: "",
  file: null,
});

const BANNER_MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;

const MAX_WIDTH = 2000;
const MAX_HEIGHT = 1200;

const BANNER_RATIO = 16 / 9;
const TOLERANCE = 0.03;

export default function BannerForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  isLoading,
}) {
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
      type: initialData?.type || "HOME",
      cityConfigs: initialData?.cityConfigs || [],
    },
  });

  const { watch, setValue, getValues } = form;

  const type = watch("type");
  const cityConfigs = watch("cityConfigs");

  /* ---------------- CATEGORIES ---------------- */

  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (categoryRes?.status === 200) {
      setCategories(categoryRes.data.data || []);
    }
  }, [categoryRes]);

  /* ---------------- SERVICES ---------------- */

  const loadServices = async (categoryId) => {
    if (!categoryId) return;
    await getServices(`/admin/get-category-service/${categoryId}`);
  };

  useEffect(() => {
    if (serviceRes?.status === 200) {
      const catId = serviceRes.config?.url.split("/").pop();

      setServicesMap((prev) => ({
        ...prev,
        [catId]: serviceRes.data.data || [],
      }));
    }
  }, [serviceRes]);

  /* ---------------- CITY MERGE ---------------- */

  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];

    const cityMap = new Map(cities.map((c) => [c._id, c.name]));

    const bannerCount = (initialData.type || type) === "HOME" ? 3 : 1;

    const merged = [
      ...existing.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId),
        banners: cfg.banners?.length
          ? cfg.banners
          : Array.from({
              length: bannerCount,
            }).map(makeEmptyBanner),
      })),

      ...cities
        .filter(
          (c) => !existing.some((e) => String(e.cityId) === String(c._id)),
        )
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          banners: Array.from({
            length: bannerCount,
          }).map(makeEmptyBanner),
        })),
    ];

    setValue("cityConfigs", merged, {
      shouldDirty: false,
    });
  }, [cities]);

  /* type change HOME/OFFER sync banner count */

  useEffect(() => {
    const expected = type === "HOME" ? 3 : 1;

    const updated = getValues("cityConfigs").map((c) => {
      let banners = [...(c.banners || [])];

      if (banners.length < expected) {
        while (banners.length < expected) {
          banners.push(makeEmptyBanner());
        }
      }

      if (banners.length > expected) {
        banners = banners.slice(0, expected);
      }

      return {
        ...c,
        banners,
      };
    });

    setValue("cityConfigs", updated);
  }, [type]);

  /* preload services for edit */
  useEffect(() => {
    const existing = getValues("cityConfigs") || [];

    existing.forEach((city) => {
      city.banners?.forEach((b) => {
        if (b.categoryId) {
          loadServices(b.categoryId);
        }
      });
    });
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const submitHandler = (data) => {
    const expected = data.type === "HOME" ? 3 : 1;

    const invalid = data.cityConfigs.some(
      (c) => c.isActive && c.banners.length !== expected,
    );

    if (invalid) {
      toast.error("Invalid banner count");
      return;
    }

    const formData = new FormData();

    formData.append("type", data.type);

    const clean = data.cityConfigs.map((c) => ({
      cityId: c.cityId,
      isActive: c.isActive,

      banners: c.banners.map((b) => ({
        image: b.existingImage || null,
        categoryId: b.categoryId || null,
        serviceId: b.serviceId || null,
      })),
    }));

    formData.append("cityConfigs", JSON.stringify(clean));

    data.cityConfigs.forEach((city) => {
      city.banners.forEach((b, i) => {
        if (b.file) {
          formData.append(`cityBanner_${city.cityId}_${i}`, b.file);
        }
      });
    });

    onSubmit(formData);
  };

  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  return (
    <Card>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-6"
          >
            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label>Banner Type</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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

            {/* CITIES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityLoading
                ? Array.from({
                    length: 6,
                  }).map((_, i) => <CityCardCategorySkeleton key={i} />)
                : visibleConfigs.map((city, cityIndex) => (
                    <div
                      key={city.cityId}
                      className="bg-white border rounded-md"
                    >
                      <CardContent className="pt-5 space-y-5">
                        <div className="flex justify-between">
                          <h3 className="font-semibold capitalize">
                            {city.cityName}
                          </h3>

                          <Switch
                            checked={city.isActive}
                            onCheckedChange={(val) =>
                              setValue(`cityConfigs.${cityIndex}.isActive`, val)
                            }
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                          />
                        </div>

                        {city.banners.map((banner, bannerIndex) => {
                          const services = servicesMap[banner.categoryId] || [];

                          return (
                            <Card
                              className="shadow-none! bg-white!"
                              key={bannerIndex}
                            >
                              <CardContent className="pt-4 space-y-4 p-0">
                                <div className="font-medium">
                                  Banner {bannerIndex + 1}
                                </div>

                                {/* category */}
                                <Select
                                  disabled={!city.isActive}
                                  value={banner.categoryId}
                                  key={`${city.cityId}-${bannerIndex}`}
                                  onValueChange={(val) => {
                                    setValue(
                                      `cityConfigs.${cityIndex}.banners.${bannerIndex}.categoryId`,
                                      val,
                                    );

                                    setValue(
                                      `cityConfigs.${cityIndex}.banners.${bannerIndex}.serviceId`,
                                      "",
                                    );

                                    loadServices(val);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {categories.map((c, index) => (
                                      <SelectItem
                                        key={c._id || index}
                                        value={c._id}
                                      >
                                        {c.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* service */}
                                <Select
                                  disabled={
                                    !city.isActive || !banner.categoryId
                                  }
                                  value={banner.serviceId}
                                  key={`-${city.cityId}-${bannerIndex}`}
                                  onValueChange={(val) =>
                                    setValue(
                                      `cityConfigs.${cityIndex}.banners.${bannerIndex}.serviceId`,
                                      val,
                                    )
                                  }
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

                                <p className="font-bold text-muted-foreground">
                                  Choose image to update banners
                                </p>

                                {/* image */}
                                <Input
                                  disabled={!city.isActive}
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (!ALLOWED_TYPES.includes(file.type)) {
                                      toast.error("Only JPG PNG WEBP allowed");
                                      return;
                                    }

                                    if (file.size > BANNER_MAX_SIZE) {
                                      toast.error("Banner max 2MB");
                                      return;
                                    }

                                    try {
                                      const dim =
                                        await getImageDimensions(file);

                                      if (
                                        dim.width < MIN_WIDTH ||
                                        dim.height < MIN_HEIGHT
                                      ) {
                                        toast.error(
                                          "Minimum 1280x720 required",
                                        );
                                        return;
                                      }

                                      if (
                                        dim.width > MAX_WIDTH ||
                                        dim.height > MAX_HEIGHT
                                      ) {
                                        toast.error(
                                          "Maximum 2000x1200 allowed",
                                        );
                                        return;
                                      }

                                      const ratio = dim.width / dim.height;

                                      // if (
                                      //   Math.abs(ratio - BANNER_RATIO) >
                                      //   TOLERANCE
                                      // ) {
                                      //   toast.error("Banner must be 16:9");
                                      //   return;
                                      // }

                                      setValue(
                                        `cityConfigs.${cityIndex}.banners.${bannerIndex}.file`,
                                        file,
                                      );

                                      setValue(
                                        `cityConfigs.${cityIndex}.banners.${bannerIndex}.preview`,
                                        URL.createObjectURL(file),
                                      );
                                    } catch {
                                      toast.error("Invalid banner image");
                                    }
                                  }}
                                />

                                <FormMessage>
                                  {
                                    form.formState.errors?.cityConfigs?.[
                                      cityIndex
                                    ]?.banners?.[bannerIndex]?.file?.message
                                  }
                                </FormMessage>
                                <p className="text-xs text-muted-foreground">
                                  Max 2MB • Recommended 1280x720
                                </p>

                                {(banner.preview || banner.existingImage) && (
                                  <img
                                    src={
                                      banner.preview
                                        ? banner.preview
                                        : `${import.meta.env.VITE_APP_IMAGE_URL}/${banner.existingImage}`
                                    }
                                    className="h-28 w-full object-cover rounded-md border"
                                  />
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </CardContent>
                    </div>
                  ))}
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
