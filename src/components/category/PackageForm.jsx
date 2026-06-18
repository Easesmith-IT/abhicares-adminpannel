import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

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
import { X, UploadCloud, Search, SlidersHorizontal, AlertCircle } from "lucide-react";

import { packageSchema } from "../../schemas/service.schema";
import { CityCardSkeleton } from "./CityCardSkeleton";
import { Spinner } from "../ui/spinner";
import useGetApiReq from "../../hooks/useGetApiReq";
import { getImageDimensions } from "../../utils/getImageDimensions";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const MAX_IMAGES = 3;
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_WIDTH = 512;
const MIN_HEIGHT = 512;
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PackageForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  serviceId,
  allProducts = [],
  label = "Save Package",
}) => {
  const fileRef = useRef(null);

  /* ---------------- Cities ---------------- */
  const { res: cityRes, fetchData: getCities, isLoading: cityLoading } = useGetApiReq();
  const [cities, setCities] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [productSearchVal, setProductSearchVal] = useState("");

  /* ---------------- Bulk configs ---------------- */
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkOfferPrice, setBulkOfferPrice] = useState("");

  /* ---------------- Images ---------------- */
  const [previewImages, setPreviewImages] = useState([]);
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

  // Fetch all cities on component mount
  useEffect(() => {
    getCities("/admin/get-availabe-city?limit=100");
  }, [getCities]);

  useEffect(() => {
    if (cityRes?.status === 200 || cityRes?.status === 201) {
      setCities(cityRes.data?.data || []);
    }
  }, [cityRes]);

  /* ---------------- Merge cities ---------------- */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];
    const cityMap = new Map(cities.map((c) => [c._id, c.city || c.name]));

    const normalizedExisting = existing.map((cfg) => ({
      ...cfg,
      cityId: typeof cfg.cityId === "object" ? cfg.cityId._id : cfg.cityId,
      cityName:
        cfg.cityName ??
        cityMap.get(
          typeof cfg.cityId === "object" ? cfg.cityId._id : cfg.cityId,
        ) ??
        "",
    }));

    const merged = [
      ...normalizedExisting.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId) ?? "",
        isActive: cfg.isActive ?? false,
        showOnHomepage: cfg.showOnHomepage ?? false,
        price: cfg.price ?? "",
        offerPrice: cfg.offerPrice ?? "",
      })),
      ...cities
        .filter((city) => !normalizedExisting.some((c) => c.cityId === city._id))
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

  /* ---------------- Visible cities ---------------- */
  const visibleConfigs = useMemo(() => {
    return cityConfigs.map((cfg, idx) => ({ ...cfg, originalIndex: idx }));
  }, [cityConfigs]);

  const filteredConfigs = useMemo(() => {
    return visibleConfigs.filter((c) =>
      c.cityName?.toLowerCase().includes(searchVal.toLowerCase())
    );
  }, [visibleConfigs, searchVal]);

  /* ---------------- Products checklist filtering ---------------- */
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) =>
      p.name?.toLowerCase().includes(productSearchVal.toLowerCase())
    );
  }, [allProducts, productSearchVal]);

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

  /* ---------------- Image Helpers ---------------- */
  const processFiles = async (files) => {
    const remainingSlots = MAX_IMAGES - previewImages.length;

    if (files.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more image(s) allowed`);
      files = files.slice(0, remainingSlots);
    }

    const validFiles = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: invalid format`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: exceeds 2MB`);
        continue;
      }

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
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) processFiles(files);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) await processFiles(files);
  };

  const removeImage = (id) => {
    setPreviewImages((p) => p.filter((i) => i.id !== id));
    setUploadedImages((p) => p.filter((i) => i.id !== id));
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------------- Bulk Apply ---------------- */
  const handleBulkApply = () => {
    const currentConfigs = getValues("cityConfigs") || [];
    const updated = currentConfigs.map((cfg) => {
      if (cfg.isActive) {
        return {
          ...cfg,
          price: bulkPrice !== "" ? Number(bulkPrice) : cfg.price,
          offerPrice: bulkOfferPrice !== "" ? Number(bulkOfferPrice) : cfg.offerPrice,
        };
      }
      return cfg;
    });
    setValue("cityConfigs", updated, { shouldDirty: true });
    toast.success("Bulk settings applied to all active cities");
  };

  /* ---------------- Submit ---------------- */
  const handleFormSubmit = (values) => {
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
    toast.error("Please correct the form errors before submitting");
  };

  /* ---------------- UI ---------------- */
  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
      <CardContent className="space-y-6 p-0">
        
        {/* Errors Diagnostics Panel */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-800 space-y-1">
            <h5 className="font-semibold flex items-center gap-1 text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              Please correct the following errors:
            </h5>
            <ul className="list-disc pl-4 space-y-0.5 text-rose-700 font-medium">
              {errors.name && <li>Package Name is required.</li>}
              {errors.durationMinutes && <li>Duration Minutes must be at least 1.</li>}
              {errors.products && <li>{errors.products.message}</li>}
              {errors.cityConfigs?.root && <li>{errors.cityConfigs.root.message}</li>}
              {errors.cityConfigs && Array.isArray(errors.cityConfigs) && errors.cityConfigs.some(Boolean) && (
                <li>Please check that active cities have valid pricing configurations.</li>
              )}
            </ul>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, onError)}
            className="space-y-6"
          >
            {/* General Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label className="font-bold text-xs text-gray-700">Package Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Premium Painting Package, AC Service Combo..."
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label className="font-bold text-xs text-gray-700">Duration (Minutes)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="e.g. 90, 180"
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label className="font-bold text-xs text-gray-700">Description</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a brief description of the package"
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Drag and Drop Media Zones */}
            <div className="space-y-3">
              <Label className="font-bold text-xs text-gray-700">
                Package Images ({previewImages.length}/{MAX_IMAGES})
              </Label>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition duration-200 bg-white flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group"
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImages}
                  disabled={previewImages.length >= MAX_IMAGES}
                  className="hidden"
                />
                
                <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition duration-200 mb-2" />
                <p className="text-xs font-semibold text-gray-700">Drag & drop files here or click to select</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Max 3 images • Up to {MAX_SIZE / (1024 * 1024)}MB each • JPG, PNG, WEBP • Min {MIN_WIDTH}x{MIN_HEIGHT}
                </p>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                  {previewImages.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm group">
                      <img
                        src={img.preview}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-5 w-5 rounded-full shadow hover:scale-105 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-slate-100 my-6" />

            {/* Products Selector */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Included Products</Label>
                  <p className="text-[10px] text-slate-400 mt-0.5">Choose one or more products to bundle in this package</p>
                </div>
                
                {/* Search products */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={productSearchVal}
                    onChange={(e) => setProductSearchVal(e.target.value)}
                    className="pl-9 h-9 rounded-lg border-slate-200 text-xs focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {errors.products?.message && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 flex items-center gap-2 text-rose-700">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <p className="text-xs font-semibold">{errors.products.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[360px] overflow-y-auto pr-1 py-1">
                {filteredProducts.map((product) => {
                  const selected = products.some(
                    (p) => p.productId === product._id,
                  );

                  return (
                    <div
                      key={product._id}
                      onClick={() => toggleProduct(product)}
                      className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer transition duration-200 relative group h-full ${
                        selected 
                          ? "border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-400" 
                          : "border-slate-100 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-[120px] w-full bg-slate-50 relative overflow-hidden">
                        {product?.imageUrl?.[0] ? (
                          <img
                            src={`${import.meta.env.VITE_APP_IMAGE_URL}/${product.imageUrl?.[0]}`}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 text-[10px]">
                            No Image
                          </div>
                        )}
                        {selected && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm z-10">
                            <svg className="w-3.5 h-3.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-xs text-slate-800 line-clamp-1">{product.name}</p>
                          {product.description && (
                            <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}>
                            </div>
                          )}
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500 text-[10px]">★</span>
                            <span className="text-[10px] font-bold text-slate-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <p className="text-slate-400 text-xs italic p-4 col-span-full">No products found matching your search</p>
                )}
              </div>
            </div>

            <Separator className="bg-slate-100 my-6" />

            {/* City Configurations */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">City-wise Configuration</h3>
                  <p className="text-xs text-slate-500">Configure status and pricing per operational city</p>
                </div>
                
                {/* Search cities */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search cities..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="pl-9 h-9 rounded-lg border-slate-200 text-xs focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bulk settings apply card */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/10 p-4 space-y-4">
                <div className="flex items-center gap-1.5 text-blue-900">
                  <SlidersHorizontal size={14} className="text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Bulk Settings (Apply to Active Cities)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    type="number"
                    placeholder="Bulk Price"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="h-9 rounded-lg border-slate-200 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Bulk Offer Price"
                    value={bulkOfferPrice}
                    onChange={(e) => setBulkOfferPrice(e.target.value)}
                    className="h-9 rounded-lg border-slate-200 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-lg text-xs font-semibold bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={handleBulkApply}
                  >
                    Apply Bulk Settings
                  </Button>
                </div>
              </div>

              {/* City Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
                {cityLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <CityCardSkeleton key={i} />
                  ))
                ) : filteredConfigs.length === 0 ? (
                  <p className="text-slate-400 text-xs italic p-4">No cities match your search filter</p>
                ) : (
                  filteredConfigs.map((city) => {
                    const idx = city.originalIndex;
                    const isActive = watch(`cityConfigs.${idx}.isActive`);
                    const cityError = errors.cityConfigs?.[idx];
                    const cityErrorMessages = [];

                    if (cityError?.price?.message) cityErrorMessages.push(cityError.price.message);
                    if (cityError?.offerPrice?.message) cityErrorMessages.push(cityError.offerPrice.message);

                    return (
                      <Card
                        key={city.cityId}
                        className={`border transition duration-200 ${
                          cityError ? "border-rose-300 bg-rose-50/5" : "border-slate-100"
                        } ${!isActive ? "opacity-60 bg-slate-50/50" : "bg-white shadow-sm"}`}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold uppercase text-slate-800 tracking-wide text-xs">
                              {city.cityName}
                            </h4>

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${idx}.isActive`}
                              render={({ field }) => (
                                <div className="flex items-center gap-2">
                                  <Switch
                                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);
                                      if (!checked) {
                                        clearErrors([
                                          `cityConfigs.${idx}.price`,
                                          `cityConfigs.${idx}.offerPrice`,
                                        ]);
                                      }
                                    }}
                                  />
                                  <Badge
                                    variant={field.value ? "success" : "inprogress"}
                                    className="rounded-full px-2 py-0.5 text-[9px]"
                                  >
                                    {field.value ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              )}
                            />
                          </div>

                          {cityErrorMessages.length > 0 && (
                            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-2">
                              <ul className="list-disc list-inside text-[10px] text-rose-600 space-y-0.5 font-medium">
                                {cityErrorMessages.map((msg, i) => (
                                  <li key={i}>{msg}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`cityConfigs.${idx}.price`}
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel className="text-[10px] font-semibold text-slate-500">Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      disabled={!isActive}
                                      className="h-8 text-xs border-slate-200"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${idx}.offerPrice`}
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel className="text-[10px] font-semibold text-slate-500">Offer Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      disabled={!isActive}
                                      className="h-8 text-xs border-slate-200"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="abhicares" type="submit" disabled={isLoading} className="rounded-xl h-10 px-6 text-sm font-semibold">
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
