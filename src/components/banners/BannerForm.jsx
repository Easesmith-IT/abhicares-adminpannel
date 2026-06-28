import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { CityCardCategorySkeleton } from "../category/CityCardSkeleton";
import { getImageDimensions } from "../../utils/getImageDimensions";

import {
  Search,
  MapPin,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

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
    isActive: z.boolean().optional(),

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
        // Only the first banner slot (Slot 1) is strictly required to have an image.
        if (bannerIndex === 0) {
          const hasImage = banner.file || banner.existingImage;

          if (!hasImage) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["cityConfigs", cityIndex, "banners", bannerIndex, "file"],
              message: "Banner image is required",
            });
          }
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

export default function BannerForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  isLoading,
  selectedCityId: propSelectedCityId,
  hideTypeSelector = false,
  availableCities = [],
  availableCategories = [],
}) {
  const { res: allCitiesRes, fetchData: fetchAllCities, isLoading: cityLoading } = useGetApiReq();
  const [cities, setCities] = useState(availableCities);

  useEffect(() => {
    if (!availableCities.length) {
      fetchAllCities("/admin/get-availabe-city?limit=500");
    }
  }, [availableCities.length, fetchAllCities]);

  useEffect(() => {
    if (availableCities.length) {
      setCities(availableCities);
      return;
    }

    if (allCitiesRes?.status === 200 || allCitiesRes?.status === 201) {
      setCities(allCitiesRes.data?.data || []);
    }
  }, [allCitiesRes, availableCities]);

  const { res: categoryRes, fetchData: getCategories } = useGetApiReq();
  const { res: serviceRes, fetchData: getServices } = useGetApiReq();

  const [categories, setCategories] = useState(availableCategories);
  const [servicesMap, setServicesMap] = useState({});

  const [selectedCityId, setSelectedCityId] = useState(propSelectedCityId || null);
  const [sidebarTab, setSidebarTab] = useState("all"); // "all" | "active"

  // Normalize initial data to handle backend populates cleanly (convert objects to ID strings)
  const normalizedInitialConfigs = useMemo(() => {
    if (!initialData?.cityConfigs) return [];
    const expected = (initialData.type || "HOME") === "HOME" ? 3 : 1;
    return initialData.cityConfigs.map((cfg) => {
      const id = typeof cfg.cityId === "object" && cfg.cityId?._id ? cfg.cityId._id : cfg.cityId;
      const name = cfg.cityName || (typeof cfg.cityId === "object" && cfg.cityId?.name ? cfg.cityId.name : "");
      
      const parsedBanners = cfg.banners?.map((b) => ({
        categoryId: b.categoryId?._id || b.categoryId || "",
        serviceId: b.serviceId?._id || b.serviceId || "",
        existingImage: b.image || b.existingImage || "",
        preview: b.preview || "",
        file: b.file || null,
      })) || [];

      // Pad banners list up to expected size
      const paddedBanners = [
        ...parsedBanners,
        ...Array.from({ length: Math.max(0, expected - parsedBanners.length) }).map(makeEmptyBanner)
      ];

      return {
        ...cfg,
        cityId: id,
        cityName: name,
        banners: paddedBanners,
      };
    });
  }, [initialData]);

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      type: initialData?.type || "HOME",
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      cityConfigs: normalizedInitialConfigs,
    },
  });

  const { watch, setValue, getValues } = form;

  const type = watch("type");
  const cityConfigs = watch("cityConfigs");

  /* ---------------- TABS CONFIG ---------------- */
  useEffect(() => {
    if (isEdit) {
      setSidebarTab("active");
    }
  }, [isEdit]);

  const activeConfigs = useMemo(() => {
    return cityConfigs.filter((c) => c.isActive);
  }, [cityConfigs]);

  // Set default city selection
  useEffect(() => {
    if (propSelectedCityId) {
      setSelectedCityId(propSelectedCityId);
      return;
    }
    if (cities.length && !selectedCityId) {
      const activeCfg = cityConfigs?.find((c) => c.isActive);
      if (activeCfg) {
        setSelectedCityId(activeCfg.cityId);
      } else {
        setSelectedCityId(cities[0]._id);
      }
    }
  }, [cities, cityConfigs, selectedCityId, propSelectedCityId]);

  /* ---------------- CATEGORIES ---------------- */

  useEffect(() => {
    if (!availableCategories.length) {
      getCategories("/admin/get-all-category");
    }
  }, [availableCategories.length, getCategories]);

  useEffect(() => {
    if (availableCategories.length) {
      setCategories(availableCategories);
      return;
    }

    if (categoryRes?.status === 200) {
      setCategories(categoryRes.data.data || []);
    }
  }, [availableCategories, categoryRes]);

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
      ...existing.map((cfg) => {
        const currentBanners = cfg.banners || [];
        const paddedBanners = currentBanners.length >= bannerCount
          ? currentBanners.slice(0, bannerCount)
          : [
              ...currentBanners,
              ...Array.from({ length: bannerCount - currentBanners.length }).map(makeEmptyBanner)
            ];
        return {
          ...cfg,
          cityName: cfg.cityName ?? cityMap.get(cfg.cityId),
          banners: paddedBanners,
        };
      }),

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

  const handleToggleActive = (cityIndex, val) => {
    if (val) {
      // Deactivate all other cities
      cityConfigs.forEach((cfg, idx) => {
        if (idx !== cityIndex && cfg.isActive) {
          setValue(`cityConfigs.${idx}.isActive`, false);
        }
      });
    }
    setValue(`cityConfigs.${cityIndex}.isActive`, val);
  };

  /* ---------------- SUBMIT ---------------- */

  const submitHandler = (data) => {
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("isActive", data.isActive ?? true);

    const clean = data.cityConfigs.map((c) => {
      if (!c.isActive) {
        return {
          cityId: c.cityId,
          isActive: false,
          banners: [],
        };
      }

      // Filter out empty banner slots (keep Slot 1 always, and any others that have an image)
      const filteredBanners = c.banners.filter((b, idx) => idx === 0 || b.existingImage || b.file);

      return {
        cityId: c.cityId,
        isActive: true,
        banners: filteredBanners.map((b) => ({
          image: b.existingImage || null,
          categoryId: b.categoryId || null,
          serviceId: b.serviceId || null,
        })),
      };
    });

    formData.append("cityConfigs", JSON.stringify(clean));

    data.cityConfigs.forEach((city) => {
      if (!city.isActive) return;

      const filteredBanners = city.banners.filter((b, idx) => idx === 0 || b.existingImage || b.file);
      filteredBanners.forEach((b, i) => {
        if (b.file) {
          formData.append(`cityBanner_${city.cityId}_${i}`, b.file);
        }
      });
    });

    onSubmit(formData);
  };

  const currentCityConfigIndex = useMemo(() => {
    return cityConfigs.findIndex((c) => String(c.cityId) === String(selectedCityId));
  }, [cityConfigs, selectedCityId]);

  const currentCityConfig = currentCityConfigIndex !== -1 ? cityConfigs[currentCityConfigIndex] : null;

  const cityConfigsErrors = form.formState.errors?.cityConfigs;
  const cityHasError = (index) => {
    return !!(cityConfigsErrors && cityConfigsErrors[index]);
  };

  const handleApplyToAllActive = () => {
    if (!currentCityConfig) return;

    const hasAnyBanner = currentCityConfig.banners.some(
      (b) => b.file || b.existingImage
    );
    if (!hasAnyBanner) {
      toast.error("Please configure at least one banner image before copying.");
      return;
    }

    const updated = cityConfigs.map((cfg) => {
      if (cfg.isActive && String(cfg.cityId) !== String(currentCityConfig.cityId)) {
        return {
          ...cfg,
          banners: currentCityConfig.banners.map((b) => ({
            ...b,
          })),
        };
      }
      return cfg;
    });

    setValue("cityConfigs", updated, { shouldDirty: true });
    toast.success(
      `Applied ${currentCityConfig.cityName}'s banners configuration to all active cities.`
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="space-y-6"
      >
        {/* Global Validation Message */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              Some active cities have missing or invalid configurations. Please check highlighted items.
            </div>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {!hideTypeSelector && (
              <div className="w-full sm:w-60">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <Label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Banner Type</Label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/50">
                        {["HOME", "OFFER", "REFER"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            disabled={isEdit}
                            onClick={() => field.onChange(t)}
                            className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                              field.value === t
                                ? "bg-white text-blue-600 shadow-xs border border-slate-200/30"
                                : "text-slate-600 hover:text-slate-800"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Overall Status</Label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5 h-[38px] w-[140px] justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {field.value ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      className="scale-75 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-end self-stretch sm:self-auto pt-4 sm:pt-0">
            <Button
              variant="abhicares"
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 shadow-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Spinner className="h-4 w-4" /> : null}
              {isEdit ? "Update Configuration" : "Create Configuration"}
            </Button>
          </div>
        </div>

        {/* Form Content Focused Single Column */}
        <div className="space-y-6">
          
          {/* Top Panel: Target City Heading & Status Selector */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 capitalize">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                  {currentCityConfig?.cityName || "Configure Banners"} - {type} Banners
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
                  Target Configuration Status & Settings
                </p>
              </div>

              {selectedCityId && currentCityConfigIndex !== -1 && (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-lg px-3.5 py-1.5 self-start sm:self-auto">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    Active Status:
                  </span>
                  <Switch
                    checked={currentCityConfig.isActive}
                    onCheckedChange={(val) => {
                      handleToggleActive(currentCityConfigIndex, val);
                    }}
                    className="scale-90 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Configuration details for selected city */}
          <div className="flex flex-col space-y-4">
            {!selectedCityId || currentCityConfigIndex === -1 ? (
              <div className="bg-white border border-slate-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[250px]">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Select a City</h4>
                <p className="text-xs text-slate-400 max-w-[240px] mt-1">
                  Choose a target city from the dropdown above to configure its marketing banners.
                </p>
              </div>
            ) : !currentCityConfig.isActive ? (
              <div className="bg-white border border-slate-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[250px]">
                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm capitalize">
                  Banners are Inactive for {currentCityConfig.cityName}
                </h4>
                <p className="text-xs text-slate-400 max-w-[320px] mt-1 mb-4">
                  Banners for this city are currently disabled. Enable the active status to configure slots.
                </p>
                <Button
                  type="button"
                  onClick={() => handleToggleActive(currentCityConfigIndex, true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold py-2 px-5 shadow-sm cursor-pointer"
                >
                  Enable Banners for {currentCityConfig.cityName}
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs flex flex-col space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm capitalize flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {currentCityConfig.cityName} Banners
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
                      {type === "HOME" ? "3 Banner Slots (Home Page Carousel)" : "1 Banner Slot"}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 pr-1">
                  {currentCityConfig.banners.map((banner, bannerIndex) => {
                    const services = servicesMap[banner.categoryId] || [];
                    const hasError = form.formState.errors?.cityConfigs?.[currentCityConfigIndex]?.banners?.[bannerIndex]?.file;

                    return (
                      <div
                        key={bannerIndex}
                        className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-4 space-y-3.5"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-xs font-extrabold text-slate-800">
                            Banner Slot {bannerIndex + 1}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            Slot {bannerIndex + 1} of {type === "HOME" ? "3" : "1"}
                          </span>
                        </div>

                        {/* Category & Service Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                            <Select
                              value={banner.categoryId || ""}
                              onValueChange={(val) => {
                                setValue(
                                  `cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.categoryId`,
                                  val,
                                );
                                setValue(
                                  `cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.serviceId`,
                                  "",
                                );
                                loadServices(val);
                              }}
                            >
                              <SelectTrigger className="bg-white border-slate-200 h-9 text-xs">
                                <SelectValue placeholder="Link to Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((c, idx) => (
                                  <SelectItem key={c._id || idx} value={c._id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service (Optional)</Label>
                            <Select
                              disabled={!banner.categoryId}
                              value={banner.serviceId || ""}
                              onValueChange={(val) =>
                                setValue(
                                  `cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.serviceId`,
                                  val,
                                )
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 h-9 text-xs">
                                <SelectValue placeholder={banner.categoryId ? "Link to Service" : "Select Category First"} />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((s) => (
                                  <SelectItem key={s._id} value={s._id}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Image dropzone */}
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                            <span>Upload Image Asset</span>
                            <span className="text-slate-400 lowercase font-normal normal-case text-[9px]">
                              Max 2MB • JPG, PNG, WEBP • Min 1280x720
                            </span>
                          </Label>

                          {banner.preview || banner.existingImage ? (
                            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group h-32 flex items-center justify-center shadow-2xs">
                              <img
                                src={
                                  banner.preview
                                    ? banner.preview
                                    : `${import.meta.env.VITE_APP_IMAGE_URL}/${banner.existingImage}`
                                }
                                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-45"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 duration-200">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-7 text-[10px] font-bold rounded bg-white hover:bg-slate-100 cursor-pointer"
                                  onClick={() => document.getElementById(`file-input-${currentCityConfig.cityId}-${bannerIndex}`).click()}
                                >
                                  Replace
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-7 text-[10px] font-bold rounded cursor-pointer"
                                  onClick={() => {
                                    setValue(`cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.file`, null);
                                    setValue(`cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.preview`, "");
                                    setValue(`cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.existingImage`, "");
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => document.getElementById(`file-input-${currentCityConfig.cityId}-${bannerIndex}`).click()}
                              className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 bg-white ${
                                hasError ? "border-red-300 bg-red-50/10 hover:bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <UploadCloud className={`h-6 w-6 mb-1 ${hasError ? "text-red-400" : "text-slate-400"}`} />
                              <p className="text-[11px] font-bold text-slate-700">Click to upload banner image</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">Drag and drop file here, or click to browse</p>
                            </div>
                          )}

                          <input
                            id={`file-input-${currentCityConfig.cityId}-${bannerIndex}`}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            className="hidden"
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
                                const dim = await getImageDimensions(file);

                                if (dim.width < MIN_WIDTH || dim.height < MIN_HEIGHT) {
                                  toast.error("Minimum 1280x720 required");
                                  return;
                                }

                                if (dim.width > MAX_WIDTH || dim.height > MAX_HEIGHT) {
                                  toast.error("Maximum 2000x1200 allowed");
                                  return;
                                }

                                setValue(
                                  `cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.file`,
                                  file,
                                );

                                setValue(
                                  `cityConfigs.${currentCityConfigIndex}.banners.${bannerIndex}.preview`,
                                  URL.createObjectURL(file),
                                );
                              } catch {
                                toast.error("Invalid banner image");
                              }
                            }}
                          />

                          {hasError && (
                            <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3.5 w-3.5" />
                              {form.formState.errors?.cityConfigs?.[currentCityConfigIndex]?.banners?.[bannerIndex]?.file?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </form>
    </Form>
  );
}
