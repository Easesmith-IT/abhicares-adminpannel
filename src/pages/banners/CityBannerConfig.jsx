import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  MapPin,
  Sliders,
  Tag,
  Gift,
  Calendar,
  Layers,
  Sparkles,
  Link as LinkIcon,
  CircleDot,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useGetApiReq from "@/hooks/useGetApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import { Spinner } from "@/components/ui/spinner";
import BannerForm from "@/components/banners/BannerForm";
import { toast } from "sonner";

export default function CityBannerConfig() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  // Active form tab
  const [activeFormTab, setActiveFormTab] = useState("home"); // "home" | "offer" | "refer"

  // API requests
  const { res: citiesRes, fetchData: getCities } = useGetApiReq();
  const { res: bannersRes, fetchData: getBanners, isLoading: bannersLoading } = useGetApiReq();
  const { res: categoriesRes, fetchData: getCategories } = useGetApiReq();

  const { fetchData: createHomeBanner, res: createHomeRes, isLoading: creatingHome } = usePostApiReq();
  const { fetchData: patchHomeBanner, res: patchHomeRes, isLoading: patchingHome } = usePatchApiReq();

  const { fetchData: createOfferBanner, res: createOfferRes, isLoading: creatingOffer } = usePostApiReq();
  const { fetchData: patchOfferBanner, res: patchOfferRes, isLoading: patchingOffer } = usePatchApiReq();

  const { fetchData: createReferBanner, res: createReferRes, isLoading: creatingRefer } = usePostApiReq();
  const { fetchData: patchReferBanner, res: patchReferRes, isLoading: patchingRefer } = usePatchApiReq();

  const [allCities, setAllCities] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadData = () => {
    getCities("/admin/get-availabe-city?limit=500");
    getBanners("/banners/get-admin-banners?page=1&limit=100");
    getCategories("/admin/get-all-category");
  };

  useEffect(() => {
    loadData();
  }, [cityId]);

  useEffect(() => {
    if (citiesRes?.status === 200) {
      setAllCities(citiesRes?.data?.data || []);
    }
  }, [citiesRes]);

  useEffect(() => {
    if (bannersRes?.status === 200) {
      setBannerList(bannersRes?.data?.data || []);
    }
  }, [bannersRes]);

  useEffect(() => {
    if (categoriesRes?.status === 200) {
      setCategories(categoriesRes?.data?.data || []);
    }
  }, [categoriesRes]);

  const city = allCities.find((c) => String(c._id) === String(cityId));
  const cityName = city?.name || "City";

  // Find banner docs by type
  const homeBannerDoc = bannerList.find((b) => b.type === "HOME");
  const offerBannerDoc = bannerList.find((b) => b.type === "OFFER");
  const referBannerDoc = bannerList.find((b) => b.type === "REFER");

  const homeCityConfig = homeBannerDoc?.cityConfigs?.find(
    (c) => String(c.cityId?._id || c.cityId) === String(cityId)
  );
  const offerCityConfig = offerBannerDoc?.cityConfigs?.find(
    (c) => String(c.cityId?._id || c.cityId) === String(cityId)
  );
  const referCityConfig = referBannerDoc?.cityConfigs?.find(
    (c) => String(c.cityId?._id || c.cityId) === String(cityId)
  );

  // Normalize data for forms
  const normalizeData = (bannerDoc) => {
    if (!bannerDoc) return null;
    return {
      ...bannerDoc,
      cityConfigs: (bannerDoc.cityConfigs || []).map((city) => ({
        ...city,
        banners: (city.banners || []).map((b) => ({
          ...b,
          existingImage: b.image || "",
          file: null,
          preview: "",
        })),
      })),
    };
  };

  const normalizedHome = normalizeData(homeBannerDoc);
  const normalizedOffer = normalizeData(offerBannerDoc);
  const normalizedRefer = normalizeData(referBannerDoc);

  // Success effects to reload and toast
  useEffect(() => {
    if (createHomeRes?.status === 200 || createHomeRes?.status === 201 || patchHomeRes?.status === 200) {
      toast.success("Home banners updated successfully!");
      loadData();
    }
  }, [createHomeRes, patchHomeRes]);

  useEffect(() => {
    if (createOfferRes?.status === 200 || createOfferRes?.status === 201 || patchOfferRes?.status === 200) {
      toast.success("Offer banner updated successfully!");
      loadData();
    }
  }, [createOfferRes, patchOfferRes]);

  useEffect(() => {
    if (createReferRes?.status === 200 || createReferRes?.status === 201 || patchReferRes?.status === 200) {
      toast.success("Refer banner updated successfully!");
      loadData();
    }
  }, [createReferRes, patchReferRes]);

  // Helper to resolve Category name
  const getCategoryName = (categoryId) => {
    const id = typeof categoryId === "object" ? categoryId?._id : categoryId;
    return categories.find((c) => String(c._id) === String(id))?.name || "None / Direct link";
  };

  // Stats calculation
  const totalBannersConfigured =
    (homeCityConfig?.banners?.filter((b) => b.image).length || 0) +
    (offerCityConfig?.banners?.filter((b) => b.image).length || 0) +
    (referCityConfig?.banners?.filter((b) => b.image).length || 0);

  const activeTypesCount =
    (homeCityConfig?.isActive ? 1 : 0) +
    (offerCityConfig?.isActive ? 1 : 0) +
    (referCityConfig?.isActive ? 1 : 0);

  return (
    <Wrapper>
      <div className="container mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
        {/* Breadcrumbs & Navigation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
            <span
              onClick={() => navigate("/admin/banners")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Marketing Banners
            </span>
            <span>/</span>
            <span className="text-slate-800 font-bold">{cityName} Configuration</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div className="space-y-1">
              <button
                onClick={() => navigate("/admin/banners")}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors uppercase tracking-wider mb-1 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back to overview
              </button>
              <H2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <MapPin className="h-6 w-6 text-blue-600 shrink-0" />
                Configure {cityName} Banners
              </H2>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
                ERP campaign management dashboard for city-specific banner advertising
              </p>
            </div>

            {/* Quick Metadata Block */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex flex-col text-right pr-3 border-r border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Active campaigns
                </span>
                <span className="text-sm font-black text-slate-800">
                  {activeTypesCount} / 3 Types
                </span>
              </div>
              <div className="flex flex-col text-right pl-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Total live slots
                </span>
                <span className="text-sm font-black text-slate-800">
                  {totalBannersConfigured} / 5 slots
                </span>
              </div>
            </div>
          </div>
        </div>

        {bannersLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
            <Spinner className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading banner configurations...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 3-COLUMN OVERVIEW GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Home Carousel Summary Card */}
              <Card className="border border-slate-200 shadow-2xs bg-white rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="p-4 bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-blue-600" />
                      Home Slider Banners
                    </CardTitle>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Main Slider (Max 3 Slots)
                    </p>
                  </div>
                  <Badge
                    className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full ${
                      homeCityConfig?.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {homeCityConfig?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {homeCityConfig?.banners?.some((b) => b.image) ? (
                    <div className="space-y-3">
                      {homeCityConfig.banners.map((b, idx) => {
                        if (!b.image) return null;
                        return (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200/50">
                            <img
                              src={`${import.meta.env.VITE_APP_IMAGE_URL}/${b.image}`}
                              alt={`Slot ${idx + 1}`}
                              className="h-10 w-16 object-cover rounded-md border"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-700">Slot {idx + 1}</p>
                              <p className="text-[10px] text-slate-400 font-semibold truncate flex items-center gap-0.5">
                                <Layers className="h-3 w-3 shrink-0" />
                                {getCategoryName(b.categoryId)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
                      <CircleDot className="h-8 w-8 text-slate-300" />
                      <p className="text-xs font-bold">No active Home Banners</p>
                    </div>
                  )}
                  <Button
                    onClick={() => setActiveFormTab("home")}
                    variant="outline"
                    className="w-full h-8 text-[11px] font-bold uppercase rounded-lg border-slate-200 cursor-pointer hover:bg-slate-50 transition-all mt-auto"
                  >
                    Configure Home Slider
                  </Button>
                </CardContent>
              </Card>

              {/* Offer Banner Summary Card */}
              <Card className="border border-slate-200 shadow-2xs bg-white rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="p-4 bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-blue-600" />
                      Special Offer Banner
                    </CardTitle>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Promo Campaign (1 Slot)
                    </p>
                  </div>
                  <Badge
                    className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full ${
                      offerCityConfig?.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {offerCityConfig?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {offerCityConfig?.banners?.[0]?.image ? (
                    <div className="space-y-3">
                      <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${offerCityConfig.banners[0].image}`}
                          alt="Offer Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Target</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                          <Layers className="h-3 w-3 text-slate-400" />
                          {getCategoryName(offerCityConfig.banners[0].categoryId)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
                      <CircleDot className="h-8 w-8 text-slate-300" />
                      <p className="text-xs font-bold">No active Offer Banner</p>
                    </div>
                  )}
                  <Button
                    onClick={() => setActiveFormTab("offer")}
                    variant="outline"
                    className="w-full h-8 text-[11px] font-bold uppercase rounded-lg border-slate-200 cursor-pointer hover:bg-slate-50 transition-all mt-auto"
                  >
                    Configure Offer Banner
                  </Button>
                </CardContent>
              </Card>

              {/* Refer Banner Summary Card */}
              <Card className="border border-slate-200 shadow-2xs bg-white rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="p-4 bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Gift className="h-4 w-4 text-blue-600" />
                      Referral Banner
                    </CardTitle>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Refer & Earn Program (1 Slot)
                    </p>
                  </div>
                  <Badge
                    className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full ${
                      referCityConfig?.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {referCityConfig?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {referCityConfig?.banners?.[0]?.image ? (
                    <div className="space-y-3">
                      <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${referCityConfig.banners[0].image}`}
                          alt="Referral Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Target</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                          <Layers className="h-3 w-3 text-slate-400" />
                          {getCategoryName(referCityConfig.banners[0].categoryId)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
                      <CircleDot className="h-8 w-8 text-slate-300" />
                      <p className="text-xs font-bold">No active Referral Banner</p>
                    </div>
                  )}
                  <Button
                    onClick={() => setActiveFormTab("refer")}
                    variant="outline"
                    className="w-full h-8 text-[11px] font-bold uppercase rounded-lg border-slate-200 cursor-pointer hover:bg-slate-50 transition-all mt-auto"
                  >
                    Configure Referral Banner
                  </Button>
                </CardContent>
              </Card>

            </div>

            {/* TABBED CONFIGURATION WORKSPACE */}
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden p-6 space-y-6">
              
              {/* Modern Segmented Tabs Buttons */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveFormTab("home")}
                  className={`flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeFormTab === "home"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Sliders className="h-4 w-4" />
                  Home Slider
                </button>
                <button
                  onClick={() => setActiveFormTab("offer")}
                  className={`flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeFormTab === "offer"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  Offer Banner
                </button>
                <button
                  onClick={() => setActiveFormTab("refer")}
                  className={`flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeFormTab === "refer"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  Refer & Earn
                </button>
              </div>

              {/* ACTIVE TAB WORKSPACE CONTENT */}
              <div className="space-y-4">
                
                {activeFormTab === "home" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      Configure the main marketing slider images for the top carousel slot. These images slide automatically on the home view. Supports linking each slide directly to category services.
                    </div>
                    {homeBannerDoc ? (
                      <BannerForm
                        key={`home-form-${cityId}-${homeBannerDoc._id}`}
                        initialData={normalizedHome}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await patchHomeBanner(`/banners/update-banner/${homeBannerDoc._id}`, formData);
                        }}
                        isEdit
                        hideTypeSelector
                        isLoading={patchingHome}
                      />
                    ) : (
                      <BannerForm
                        key={`home-form-create-${cityId}`}
                        initialData={{ type: "HOME", cityConfigs: [] }}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await createHomeBanner("/banners/create-banner", formData);
                        }}
                        hideTypeSelector
                        isLoading={creatingHome}
                      />
                    )}
                  </div>
                )}

                {activeFormTab === "offer" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      Set up special promotional discounts or seasonal sale cards. This appears as a checkout-linking coupon banner on category hubs. Allows linking to specific active categories.
                    </div>
                    {offerBannerDoc ? (
                      <BannerForm
                        key={`offer-form-${cityId}-${offerBannerDoc._id}`}
                        initialData={normalizedOffer}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await patchOfferBanner(`/banners/update-banner/${offerBannerDoc._id}`, formData);
                        }}
                        isEdit
                        hideTypeSelector
                        isLoading={patchingOffer}
                      />
                    ) : (
                      <BannerForm
                        key={`offer-form-create-${cityId}`}
                        initialData={{ type: "OFFER", cityConfigs: [] }}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await createOfferBanner("/banners/create-banner", formData);
                        }}
                        hideTypeSelector
                        isLoading={creatingOffer}
                      />
                    )}
                  </div>
                )}

                {activeFormTab === "refer" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      Promote your customer referral reward program. This banner prompts customers to share their invite codes to earn coin wallet payouts.
                    </div>
                    {referBannerDoc ? (
                      <BannerForm
                        key={`refer-form-${cityId}-${referBannerDoc._id}`}
                        initialData={normalizedRefer}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await patchReferBanner(`/banners/update-banner/${referBannerDoc._id}`, formData);
                        }}
                        isEdit
                        hideTypeSelector
                        isLoading={patchingRefer}
                      />
                    ) : (
                      <BannerForm
                        key={`refer-form-create-${cityId}`}
                        initialData={{ type: "REFER", cityConfigs: [] }}
                        selectedCityId={cityId}
                        onSubmit={async (formData) => {
                          await createReferBanner("/banners/create-banner", formData);
                        }}
                        hideTypeSelector
                        isLoading={creatingRefer}
                      />
                    )}
                  </div>
                )}

              </div>
            </Card>

          </div>
        )}
      </div>
    </Wrapper>
  );
}
