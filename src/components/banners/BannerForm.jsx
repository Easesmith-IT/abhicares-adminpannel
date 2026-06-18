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
    onSearch,
    isLoading: cityLoading,
  } = useCities();

  const { res: categoryRes, fetchData: getCategories } = useGetApiReq();
  const { res: serviceRes, fetchData: getServices } = useGetApiReq();

  const [categories, setCategories] = useState([]);
  const [servicesMap, setServicesMap] = useState({});

  const [selectedCityId, setSelectedCityId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("all"); // "all" | "active"

  // Normalize initial data to handle backend populates cleanly (convert objects to ID strings)
  const normalizedInitialConfigs = useMemo(() => {
    if (!initialData?.cityConfigs) return [];
    return initialData.cityConfigs.map((cfg) => {
      const id = typeof cfg.cityId === "object" && cfg.cityId?._id ? cfg.cityId._id : cfg.cityId;
      const name = cfg.cityName || (typeof cfg.cityId === "object" && cfg.cityId?.name ? cfg.cityId.name : "");
      return {
        ...cfg,
        cityId: id,
        cityName: name,
        banners: cfg.banners?.map((b) => ({
          categoryId: b.categoryId?._id || b.categoryId || "",
          serviceId: b.serviceId?._id || b.serviceId || "",
          existingImage: b.image || b.existingImage || "",
          preview: b.preview || "",
          file: b.file || null,
        })) || [],
      };
    });
  }, [initialData]);

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      type: initialData?.type || "HOME",
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
    if (sidebarTab === "all" && cities.length && !selectedCityId) {
      setSelectedCityId(cities[0]._id);
    }
  }, [cities, sidebarTab, selectedCityId]);

  useEffect(() => {
    if (sidebarTab === "active" && activeConfigs.length && !selectedCityId) {
      setSelectedCityId(activeConfigs[0].cityId);
    }
  }, [activeConfigs, sidebarTab, selectedCityId]);

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
  }, [normalizedInitialConfigs]);

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

  const currentCityConfigIndex = useMemo(() => {
    return cityConfigs.findIndex((c) => String(c.cityId) === String(selectedCityId));
  }, [cityConfigs, selectedCityId]);

  const currentCityConfig = currentCityConfigIndex !== -1 ? cityConfigs[currentCityConfigIndex] : null;

  const cityConfigsErrors = form.formState.errors?.cityConfigs;
  const cityHasError = (index) => {
    return !!(cityConfigsErrors && cityConfigsErrors[index]);
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
          <div className="w-full sm:w-72">
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
                        onClick={() => field.onChange(t)}
                        className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
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

        {/* Form Content Split Pane */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cities Selector */}
          <div className="md:col-span-5 bg-white border border-slate-200/60 rounded-xl p-4 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Target Cities</span>
              <Badge className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {sidebarTab === "all" ? cities.length : activeConfigs.length} Loaded
              </Badge>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/50">
              <button
                type="button"
                onClick={() => {
                  setSidebarTab("all");
                  if (cities.length) {
                    setSelectedCityId(cities[0]._id);
                  }
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  sidebarTab === "all"
                    ? "bg-white text-slate-800 shadow-xs border border-slate-200/30"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Cities
              </button>
              <button
                type="button"
                onClick={() => {
                  setSidebarTab("active");
                  if (activeConfigs.length) {
                    setSelectedCityId(activeConfigs[0].cityId);
                  } else {
                    setSelectedCityId(null);
                  }
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  sidebarTab === "active"
                    ? "bg-white text-slate-800 shadow-xs border border-slate-200/30"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Active Only
              </button>
            </div>

            {/* Search Input */}
            {sidebarTab === "all" && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search cities..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-8.5 bg-slate-50 border-slate-200 focus:bg-white text-xs h-9 rounded-lg transition-all"
                />
              </div>
            )}

            {/* Cities Scroll Area */}
            <ScrollArea className="h-[380px] pr-2">
              <div className="space-y-1.5">
                {cityLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-11 bg-slate-50 rounded-lg animate-pulse border border-slate-100" />
                  ))
                ) : sidebarTab === "all" ? (
                  cities.map((city) => {
                    const configIndex = cityConfigs.findIndex(c => String(c.cityId) === String(city._id));
                    const isActive = configIndex !== -1 ? cityConfigs[configIndex].isActive : false;
                    const isSelected = selectedCityId === city._id;

                    return (
                      <div
                        key={city._id}
                        onClick={() => setSelectedCityId(city._id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-200 text-blue-900 shadow-2xs"
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="font-semibold text-xs capitalize truncate">{city.name}</span>
                          {configIndex !== -1 && cityHasError(configIndex) && (
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          )}
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={(val) => {
                            if (configIndex !== -1) {
                              setValue(`cityConfigs.${configIndex}.isActive`, val);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="scale-75 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
                        />
                      </div>
                    );
                  })
                ) : (
                  activeConfigs.map((cfg) => {
                    const isSelected = selectedCityId === cfg.cityId;
                    const configIndex = cityConfigs.findIndex(c => String(c.cityId) === String(cfg.cityId));

                    return (
                      <div
                        key={cfg.cityId}
                        onClick={() => setSelectedCityId(cfg.cityId)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-200 text-blue-900 shadow-2xs"
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-semibold text-xs capitalize truncate">{cfg.cityName}</span>
                          {configIndex !== -1 && cityHasError(configIndex) && (
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          )}
                        </div>
                        <Switch
                          checked={cfg.isActive}
                          onCheckedChange={(val) => {
                            if (configIndex !== -1) {
                              setValue(`cityConfigs.${configIndex}.isActive`, val);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="scale-75 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
                        />
                      </div>
                    );
                  })
                )}

                {!cityLoading && sidebarTab === "all" && cities.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">No cities found</div>
                )}
                {!cityLoading && sidebarTab === "active" && activeConfigs.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">No active cities configured yet</div>
                )}
              </div>
            </ScrollArea>

            {/* Compact Pagination */}
            {sidebarTab === "all" && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-medium text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={page === 1}
                    className="h-7 px-2 text-[10px] border-slate-200 cursor-pointer"
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={page === totalPages}
                    className="h-7 px-2 text-[10px] border-slate-200 cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Config Details */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            {!selectedCityId || currentCityConfigIndex === -1 ? (
              <div className="bg-white border border-slate-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[440px]">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Select a City</h4>
                <p className="text-xs text-slate-400 max-w-[240px] mt-1">
                  Choose a city from the list on the left to configure its marketing banners.
                </p>
              </div>
            ) : !currentCityConfig.isActive ? (
              <div className="bg-white border border-slate-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[440px]">
                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm capitalize">
                  {currentCityConfig.cityName} is Inactive
                </h4>
                <p className="text-xs text-slate-400 max-w-[250px] mt-1 mb-4">
                  Banners for this city are currently disabled. Enable this city to start configuring slots.
                </p>
                <Button
                  type="button"
                  onClick={() => setValue(`cityConfigs.${currentCityConfigIndex}.isActive`, true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold py-2 px-4 shadow-sm cursor-pointer"
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
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50 text-[10px] font-extrabold py-0.5 px-2 rounded-md">
                    Active
                  </Badge>
                </div>

                <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
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
