import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useGetApiReq from "@/hooks/useGetApiReq";
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
import { 
  XIcon, 
  UploadCloud, 
  Search, 
  SlidersHorizontal, 
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { getImageDimensions } from "../../utils/getImageDimensions";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const IMAGE_MAX_SIZE = 2 * 1024 * 1024;
const BANNER_MAX_SIZE = 5 * 1024 * 1024;
const MIN_DIM = 512;
const MAX_DIM = 2000;

const CategoryForm = ({ defaultValues, onSubmit, isLoading, label }) => {
  const { res: cityRes, fetchData: getCities, isLoading: cityLoading } = useGetApiReq();
  const [cities, setCities] = useState([]);
  
  // Custom non-paginated search inside cities list
  const [searchVal, setSearchVal] = useState("");
  
  // Bulk configuration values
  const [bulkCommission, setBulkCommission] = useState("");
  const [bulkConvenience, setBulkConvenience] = useState("");

  const fileRef = useRef(null);
  const bannerRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      cityConfigs: [],
      ...defaultValues,
      previewImage: defaultValues?.previewImage,
      bannerPreview: defaultValues?.bannerPreview || "",
    },
  });

  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const bannerPreview = watch("bannerPreview");
  const bannerFile = watch("bannerFile");
  const cityConfigs = watch("cityConfigs") || [];
  const previewImage = watch("previewImage");
  const img = watch("img");

  // Fetch all cities on component mount
  useEffect(() => {
    getCities("/admin/get-availabe-city?limit=100");
  }, [getCities]);

  useEffect(() => {
    if (cityRes?.status === 200 || cityRes?.status === 201) {
      setCities(cityRes.data?.data || []);
    }
  }, [cityRes]);

  // Image & Banner processing helpers
  const validateAndSetBanner = async (file) => {
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
      if (dim.width < 1280 || dim.height < 720) {
        toast.error("Banner min 1280x720");
        return;
      }
      const preview = URL.createObjectURL(file);
      setValue("bannerFile", file);
      setValue("bannerPreview", preview);
    } catch {
      toast.error("Invalid banner image");
    }
  };

  const validateAndSetImage = async (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG PNG WEBP allowed");
      return;
    }
    if (file.size > IMAGE_MAX_SIZE) {
      toast.error("Image max 2MB");
      return;
    }
    try {
      const dim = await getImageDimensions(file);
      if (dim.width < MIN_DIM || dim.height < MIN_DIM) {
        toast.error("Minimum 512x512 required");
        return;
      }
      if (dim.width > MAX_DIM || dim.height > MAX_DIM) {
        toast.error("Maximum 2000x2000 allowed");
        return;
      }
      const preview = URL.createObjectURL(file);
      setValue("img", file);
      setValue("previewImage", preview);
    } catch {
      toast.error("Invalid/corrupt image");
    }
  };

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetBanner(file);
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const removeBanner = (e) => {
    e.stopPropagation();
    if (bannerRef.current) bannerRef.current.value = "";
    setValue("bannerFile", null);
    setValue("bannerPreview", "");
  };

  const removeImage = (e) => {
    e.stopPropagation();
    if (fileRef.current) fileRef.current.value = "";
    setValue("img", null);
    setValue("previewImage", "");
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (type === "banner") {
      await validateAndSetBanner(file);
    } else {
      await validateAndSetImage(file);
    }
  };

  // Merge loaded cities into configs
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

  // City lists mapped with index to match form arrays correctly
  const visibleConfigs = useMemo(() => {
    return cityConfigs.map((cfg, idx) => ({ ...cfg, originalIndex: idx }));
  }, [cityConfigs]);

  const filteredConfigs = useMemo(() => {
    return visibleConfigs.filter((c) =>
      c.cityName?.toLowerCase().includes(searchVal.toLowerCase())
    );
  }, [visibleConfigs, searchVal]);

  const handleBulkApply = () => {
    const currentConfigs = getValues("cityConfigs") || [];
    const updated = currentConfigs.map((cfg) => {
      if (cfg.isActive) {
        return {
          ...cfg,
          commission: bulkCommission !== "" ? parseFloat(bulkCommission) : cfg.commission,
          convenience: bulkConvenience !== "" ? parseFloat(bulkConvenience) : cfg.convenience,
        };
      }
      return cfg;
    });
    setValue("cityConfigs", updated, { shouldDirty: true });
    toast.success("Bulk settings applied to all active cities");
  };

  const onError = (error) => {
    toast.error("Please fill in all required fields and configs");
  };

  return (
    <div className="space-y-6">
      <BackLink href={-1}>
        <H2>{label}</H2>
      </BackLink>

      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardContent className="p-6 space-y-6">
          
          {/* Errors Diagnostics Panel */}
          {Object.keys(errors).length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-800 space-y-1">
              <h5 className="font-semibold flex items-center gap-1 text-rose-900">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                Please correct the following errors:
              </h5>
              <ul className="list-disc pl-4 space-y-0.5 text-rose-700 font-medium">
                {errors.name && <li>Category Name is required.</li>}
                {errors.cityConfigs?.root && <li>{errors.cityConfigs.root.message}</li>}
                {errors.cityConfigs && Array.isArray(errors.cityConfigs) && errors.cityConfigs.some(Boolean) && (
                  <li>Please check that active cities have valid commission and convenience values.</li>
                )}
              </ul>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label className="font-bold text-xs text-gray-700">Category Name</Label>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Home Repair, Salon & Spa..."
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category Banner Upload */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-gray-700">Category Banner</Label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "banner")}
                    onClick={() => bannerRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition duration-200 bg-white flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden group"
                  >
                    <input
                      ref={bannerRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={handleBanner}
                    />
                    {bannerPreview ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={bannerFile ? bannerPreview : `${import.meta.env.VITE_APP_IMAGE_URL}/${bannerPreview}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Replace Banner</span>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute right-2 top-2 h-6 w-6 rounded-full shadow-md z-10"
                          onClick={removeBanner}
                        >
                          <XIcon size={12} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs font-bold text-gray-600">Drag & Drop or Click</span>
                        <span className="text-[10px] text-gray-400 mt-1">16:9 ratio, min 1280x720, max 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Category Icon Upload */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-gray-700">Category Icon</Label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "image")}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition duration-200 bg-white flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden group"
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={handleImage}
                    />
                    {previewImage ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={img ? previewImage : `${import.meta.env.VITE_APP_IMAGE_URL}/${previewImage}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Replace Icon</span>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute right-2 top-2 h-6 w-6 rounded-full shadow-md z-10"
                          onClick={removeImage}
                        >
                          <XIcon size={12} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs font-bold text-gray-600">Drag & Drop or Click</span>
                        <span className="text-[10px] text-gray-400 mt-1">Square, 512x512 to 2000x2000, max 2MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Unified City Configurations */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-900">City Configurations</h3>
                  </div>
                  
                  {/* Search cities */}
                  <div className="relative w-full max-w-[200px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search city..."
                      className="h-8 pl-8 text-xs bg-white border-gray-200"
                    />
                  </div>
                </div>

                {/* Bulk config tools */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm flex items-end gap-3 flex-wrap">
                  <div className="flex-1 min-w-[120px] space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">Bulk Commission (%)</Label>
                    <Input
                      type="number"
                      value={bulkCommission}
                      onChange={(e) => setBulkCommission(e.target.value)}
                      placeholder="e.g. 10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">Bulk Convenience Fee</Label>
                    <Input
                      type="number"
                      value={bulkConvenience}
                      onChange={(e) => setBulkConvenience(e.target.value)}
                      placeholder="e.g. 50"
                      className="h-8 text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBulkApply}
                    className="h-8 text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Apply to Active
                  </Button>
                </div>

                {/* Scrollable list of cards */}
                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                  {cityLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <CityCardCategorySkeleton key={i} />
                      ))}
                    </div>
                  ) : filteredConfigs.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl">
                      No matching cities found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredConfigs.map((city) => {
                        const isActive = watch(`cityConfigs.${city.originalIndex}.isActive`);
                        return (
                          <Card key={city.cityId} className={`border border-gray-100 transition-all ${isActive ? 'bg-white border-blue-200 shadow-sm' : 'bg-white opacity-85'}`}>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <h4 className="font-bold text-xs uppercase tracking-tight text-gray-700">
                                  {city.cityName}
                                </h4>

                                <FormField
                                  control={form.control}
                                  name={`cityConfigs.${city.originalIndex}.isActive`}
                                  render={({ field }) => (
                                    <div className="flex items-center gap-1.5">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-200"
                                      />
                                      <Badge
                                        variant={field.value ? "success" : "inprogress"}
                                        className="text-[9px] font-bold px-1.5 py-0"
                                      >
                                        {field.value ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <FormField
                                  control={form.control}
                                  name={`cityConfigs.${city.originalIndex}.commission`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-1">
                                      <Label className="text-[10px] text-gray-400 font-semibold">Commission (%)</Label>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          disabled={!isActive}
                                          {...field}
                                          className="h-8 text-xs"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[10px]" />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`cityConfigs.${city.originalIndex}.convenience`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-1">
                                      <Label className="text-[10px] text-gray-400 font-semibold">Convenience Fee</Label>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          disabled={!isActive}
                                          {...field}
                                          className="h-8 text-xs"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[10px]" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {errors.cityConfigs?.root?.message && (
                <FormMessage className="text-rose-600 font-semibold">{errors.cityConfigs.root.message}</FormMessage>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
                <Button
                  variant="abhicares"
                  type="submit"
                  disabled={isLoading || cityLoading}
                  className="h-11 px-6 rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                  {label}
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
