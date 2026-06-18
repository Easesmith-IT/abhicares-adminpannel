import React, { useState, useEffect, useCallback, useMemo } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreVertical,
  Play,
  Trash2,
  Edit,
  Eye,
  Video,
  X,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import useGetApiReq from "@/hooks/useGetApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import useDeleteApiReq from "@/hooks/useDeleteApiReq";
import useDebounce from "@/hooks/useDebounce";
import { useCities } from "@/components/filters/city";
import BannerForm from "@/components/banners/BannerForm";

const Banners = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filters for Tab 1 (Banners)
  const [bannerType, setBannerType] = useState("ALL");
  const [bannerCity, setBannerCity] = useState("ALL");
  const [bannerStatus, setBannerStatus] = useState("ALL");

  // API requests
  const { res: bannersRes, fetchData: getBanners, isLoading: bannersLoading } = useGetApiReq();
  const { res: videosRes, fetchData: getVideos, isLoading: videosLoading } = useGetApiReq();
  const { res: announcementsRes, fetchData: getAnnouncements, isLoading: announcementsLoading } = useGetApiReq();

  // Mutation API Hooks
  const { fetchData: patchBanner, res: patchBannerRes } = usePatchApiReq();
  const { fetchData: deleteBanner, res: deleteBannerRes } = useDeleteApiReq();
  const { fetchData: deleteVideo, res: deleteVideoRes } = useDeleteApiReq();
  const { fetchData: deleteAnnouncement, res: deleteAnnouncementRes } = useDeleteApiReq();

  // Fetch Cities (for filters & forms)
  const { res: allCitiesRes, fetchData: fetchAllCities } = useGetApiReq();
  const [allCities, setAllCities] = useState([]);

  // Fetch Categories & Services (for Video Dialog)
  const { res: categoriesRes, fetchData: fetchCategories } = useGetApiReq();
  const { res: servicesRes, fetchData: fetchServices } = useGetApiReq();
  const [allCategories, setAllCategories] = useState([]);
  const [servicesMap, setServicesMap] = useState({});

  // States for Modals/Drawers
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [formDrawerMode, setFormDrawerMode] = useState("create"); // "create" | "edit"

  // Video management states
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [videoDialogMode, setVideoDialogMode] = useState("create"); // "create" | "edit"
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoOrder, setVideoOrder] = useState("0");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoService, setVideoService] = useState("");
  const { fetchData: uploadVideoReq, res: uploadVideoRes, isLoading: videoUploading } = usePostApiReq();

  // Announcement states
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [announcementDialogMode, setAnnouncementDialogMode] = useState("create"); // "create" | "edit"
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [annCity, setAnnCity] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annCtaText, setAnnCtaText] = useState("Book Now");
  const [annCtaLink, setAnnCtaLink] = useState("");
  const [annBgColor, setAnnBgColor] = useState("#2563EB");
  const [annTextColor, setAnnTextColor] = useState("#FFFFFF");
  const [annIsActive, setAnnIsActive] = useState(true);
  const [selectedAnnouncementForPreview, setSelectedAnnouncementForPreview] = useState(null);
  const [isAnnouncementPreviewOpen, setIsAnnouncementPreviewOpen] = useState(false);
  const { fetchData: upsertAnnouncementReq, res: upsertAnnouncementRes, isLoading: announcementSaving } = usePostApiReq();

  // Confirm delete states
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, type: 'banner' | 'video' | 'announcement' }
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Video Play State
  const [playingVideoUrl, setPlayingVideoUrl] = useState("");
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  /* ------------------- DATA FETCHING ------------------- */
  const loadBanners = useCallback(() => {
    const queryParams = new URLSearchParams({
      page: 1,
      limit: 100,
      ...(bannerType !== "ALL" && { type: bannerType }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }).toString();
    getBanners(`/banners/get-admin-banners?${queryParams}`);
  }, [bannerType, debouncedSearch, getBanners]);

  const loadVideos = useCallback(() => {
    getVideos("/content/get-videos?reviewVideos=true&page=home&section=app-review-video");
  }, [getVideos]);

  const loadAnnouncements = useCallback(() => {
    getAnnouncements("/banners/get-announcements?page=1&limit=100");
  }, [getAnnouncements]);

  // Initial Fetches
  useEffect(() => {
    fetchAllCities("/admin/get-availabe-city?limit=100");
    fetchCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (allCitiesRes?.status === 200) {
      setAllCities(allCitiesRes?.data?.data || []);
    }
  }, [allCitiesRes]);

  useEffect(() => {
    if (categoriesRes?.status === 200) {
      setAllCategories(categoriesRes?.data?.data || []);
    }
  }, [categoriesRes]);

  // Load Services when Video Category changes
  useEffect(() => {
    if (videoCategory) {
      fetchServices(`/admin/get-category-service/${videoCategory}`);
    }
  }, [videoCategory]);

  useEffect(() => {
    if (servicesRes?.status === 200) {
      const catId = servicesRes.config?.url.split("/").pop();
      setServicesMap((prev) => ({
        ...prev,
        [catId]: servicesRes.data?.data || [],
      }));
    }
  }, [servicesRes]);

  // Active Tab Sync
  useEffect(() => {
    if (activeTab === "banners") {
      loadBanners();
    } else if (activeTab === "videos") {
      loadVideos();
    } else if (activeTab === "announcements") {
      loadAnnouncements();
    }
  }, [activeTab, loadBanners, loadVideos, loadAnnouncements]);

  // Trigger reloading on operation success
  useEffect(() => {
    if (patchBannerRes?.status === 200) {
      loadBanners();
      setIsFormDrawerOpen(false);
    }
  }, [patchBannerRes]);

  useEffect(() => {
    if (deleteBannerRes?.status === 200) {
      loadBanners();
      setIsDeleteConfirmOpen(false);
    }
  }, [deleteBannerRes]);

  useEffect(() => {
    if (uploadVideoRes?.status === 200) {
      loadVideos();
      setIsVideoDialogOpen(false);
      resetVideoFields();
    }
  }, [uploadVideoRes]);

  useEffect(() => {
    if (deleteVideoRes?.status === 200) {
      loadVideos();
      setIsDeleteConfirmOpen(false);
    }
  }, [deleteVideoRes]);

  useEffect(() => {
    if (upsertAnnouncementRes?.status === 200) {
      loadAnnouncements();
      setIsAnnouncementDialogOpen(false);
      resetAnnouncementFields();
    }
  }, [upsertAnnouncementRes]);

  useEffect(() => {
    if (deleteAnnouncementRes?.status === 200) {
      loadAnnouncements();
      setIsDeleteConfirmOpen(false);
    }
  }, [deleteAnnouncementRes]);

  const resetVideoFields = () => {
    setEditingVideo(null);
    setVideoFile(null);
    setVideoPreview("");
    setVideoTitle("");
    setVideoDesc("");
    setVideoOrder("0");
    setVideoCategory("");
    setVideoService("");
  };

  const resetAnnouncementFields = () => {
    setEditingAnnouncement(null);
    setAnnCity("");
    setAnnTitle("");
    setAnnCtaText("Book Now");
    setAnnCtaLink("");
    setAnnBgColor("#2563EB");
    setAnnTextColor("#FFFFFF");
    setAnnIsActive(true);
  };

  /* ------------------- ACTIONS & HANDLERS ------------------- */
  const handleToggleBannerStatus = async (banner) => {
    const formData = new FormData();
    formData.append("isActive", !banner.isActive);
    await patchBanner(`/banners/update-banner/${banner._id}`, formData);
  };

  const handleToggleAnnouncementStatus = async (ann) => {
    const postData = {
      cityId: ann.cityId?._id || ann.cityId,
      title: ann.title,
      ctaText: ann.ctaText,
      ctaLink: ann.ctaLink,
      bgColor: ann.bgColor,
      textColor: ann.textColor,
      isActive: !ann.isActive,
    };
    await upsertAnnouncementReq("/banners/update-announcement", postData);
  };

  const handleOpenEditBanner = (banner) => {
    setSelectedBanner(banner);
    setFormDrawerMode("edit");
    setIsFormDrawerOpen(true);
  };

  const handleOpenEditVideo = (vid) => {
    setEditingVideo(vid);
    setVideoTitle(vid.title);
    setVideoDesc(vid.description);
    setVideoOrder(String(vid.displayOrder));
    setVideoPreview(vid.video ? `${import.meta.env.VITE_APP_IMAGE_URL}/${vid.video}` : "");
    if (vid.serviceId) {
      setVideoCategory(vid.serviceId.categoryId || "");
      setVideoService(vid.serviceId._id || "");
    }
    setVideoDialogMode("edit");
    setIsVideoDialogOpen(true);
  };

  const handleOpenEditAnnouncement = (ann) => {
    setEditingAnnouncement(ann);
    setAnnCity(ann.cityId?._id || ann.cityId);
    setAnnTitle(ann.title);
    setAnnCtaText(ann.ctaText || "Book Now");
    setAnnCtaLink(ann.ctaLink || "");
    setAnnBgColor(ann.bgColor || "#2563EB");
    setAnnTextColor(ann.textColor || "#FFFFFF");
    setAnnIsActive(ann.isActive);
    setAnnouncementDialogMode("edit");
    setIsAnnouncementDialogOpen(true);
  };

  const handleDeleteClick = (id, type) => {
    setDeleteTarget({ id, type });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    if (type === "banner") {
      await deleteBanner(`/banners/delete-banner/${id}`);
    } else if (type === "video") {
      await deleteVideo(`/content/delete-video/${id}`);
    } else if (type === "announcement") {
      await deleteAnnouncement(`/banners/delete-announcement/${id}`);
    }
  };

  const handleUploadVideoSubmit = async (e) => {
    e.preventDefault();
    if (videoDialogMode === "create" && !videoFile) {
      toast.error("Please upload a video file.");
      return;
    }
    if (!videoTitle) {
      toast.error("Please enter a title.");
      return;
    }

    const formData = new FormData();
    if (videoFile) {
      formData.append("video", videoFile);
    }
    if (editingVideo?._id) {
      formData.append("id", editingVideo._id);
    }
    formData.append("title", videoTitle);
    formData.append("description", videoDesc);
    formData.append("displayOrder", videoOrder);
    formData.append("page", "home");
    formData.append("section", "app-review-video");
    formData.append("type", editingVideo?.type || `video_${Date.now()}`);
    if (videoService) {
      formData.append("serviceId", videoService);
    }

    await uploadVideoReq("/content/upload-video", formData);
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!annCity) {
      toast.error("Please select a city.");
      return;
    }
    if (!annTitle) {
      toast.error("Please enter a title.");
      return;
    }

    const postData = {
      cityId: annCity,
      title: annTitle,
      ctaText: annCtaText,
      ctaLink: annCtaLink,
      bgColor: annBgColor,
      textColor: annTextColor,
      isActive: annIsActive,
    };

    await upsertAnnouncementReq("/banners/update-announcement", postData);
  };

  /* ------------------- FILTERS AND FORMATTING ------------------- */
  const bannerList = bannersRes?.data?.data || [];
  const videoList = videosRes?.data?.videos || [];
  const announcementList = announcementsRes?.data?.data || [];

  const filteredBanners = useMemo(() => {
    return bannerList.filter((b) => {
      // Type Filter
      if (bannerType !== "ALL" && b.type !== bannerType) return false;

      // Status Filter
      if (bannerStatus !== "ALL") {
        const active = bannerStatus === "ACTIVE";
        if (b.isActive !== active) return false;
      }

      // City Filter
      if (bannerCity !== "ALL") {
        const hasCity = b.cityConfigs?.some(
          (c) => c.cityId && (c.cityId._id === bannerCity || c.cityId === bannerCity)
        );
        if (!hasCity) return false;
      }

      return true;
    });
  }, [bannerList, bannerType, bannerCity, bannerStatus]);

  const normalizedBanner = selectedBanner
    ? {
        ...selectedBanner,
        cityConfigs: selectedBanner.cityConfigs.map((city) => ({
          ...city,
          banners:
            city.banners?.map((b) => ({
              ...b,
              existingImage: b.image || "",
              file: null,
              preview: "",
            })) || [],
        })),
      }
    : null;

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <H2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Banner Management
            </H2>
            <p className="text-sm text-slate-500 font-medium">
              Manage campaign banners, promotional videos, and city announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by type, city, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 w-full bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dynamic CTA Button */}
            {activeTab === "banners" && (
              <Button
                onClick={() => {
                  setSelectedBanner(null);
                  setFormDrawerMode("create");
                  setIsFormDrawerOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm h-10 px-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Banner
              </Button>
            )}
            {activeTab === "videos" && (
              <Button
                onClick={() => {
                  resetVideoFields();
                  setVideoDialogMode("create");
                  setIsVideoDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm h-10 px-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Upload Video
              </Button>
            )}
            {activeTab === "announcements" && (
              <Button
                onClick={() => {
                  resetAnnouncementFields();
                  setAnnouncementDialogMode("create");
                  setIsAnnouncementDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm h-10 px-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Announcement
              </Button>
            )}
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <Tabs
          defaultValue="banners"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
            <TabsTrigger
              value="banners"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              All Banners
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Review Videos
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Announcements
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ALL BANNERS */}
          <TabsContent value="banners" className="space-y-4 outline-none">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filters
                </span>
              </div>

              {/* Type select */}
              <div className="w-[160px]">
                <Select value={bannerType} onValueChange={setBannerType}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="HOME">HOME</SelectItem>
                    <SelectItem value="OFFER">OFFER</SelectItem>
                    <SelectItem value="REFER">REFER</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City select */}
              <div className="w-[180px]">
                <Select value={bannerCity} onValueChange={setBannerCity}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Cities</SelectItem>
                    {allCities.map((city) => (
                      <SelectItem key={city._id} value={city._id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status select */}
              <div className="w-[160px]">
                <Select value={bannerStatus} onValueChange={setBannerStatus}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              {(bannerType !== "ALL" || bannerCity !== "ALL" || bannerStatus !== "ALL") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setBannerType("ALL");
                    setBannerCity("ALL");
                    setBannerStatus("ALL");
                  }}
                  className="text-slate-500 hover:text-slate-900 text-sm font-semibold rounded-lg"
                >
                  Reset Filters
                </Button>
              )}
            </div>

            {/* Banners Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {bannersLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-3">
                  <Spinner className="h-8 w-8 text-blue-600" />
                  <p className="text-sm font-medium text-slate-500">Loading campaign banners...</p>
                </div>
              ) : filteredBanners.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 text-lg">No Banners Found</h3>
                    <p className="text-slate-500 max-w-sm text-sm">
                      Create your first marketing banner to begin campaign drives.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedBanner(null);
                      setFormDrawerMode("create");
                      setIsFormDrawerOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Banner
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="w-[160px] font-bold text-slate-700">Thumbnail</TableHead>
                      <TableHead className="font-bold text-slate-700">Type</TableHead>
                      <TableHead className="font-bold text-slate-700">Cities</TableHead>
                      <TableHead className="font-bold text-slate-700">Linked To</TableHead>
                      <TableHead className="font-bold text-slate-700">Status</TableHead>
                      <TableHead className="font-bold text-slate-700">Slots</TableHead>
                      <TableHead className="font-bold text-slate-700">Created</TableHead>
                      <TableHead className="w-[100px] text-right font-bold text-slate-700"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => {
                      // Find first active banner image configuration
                      const activeConfig = banner.cityConfigs?.find((c) => c.isActive && c.banners?.[0]?.image);
                      const displayImg = activeConfig?.banners?.[0]?.image || banner.defaultImage;

                      // Linked entities
                      const firstBannerConfig = activeConfig?.banners?.[0];
                      const linkedCat = firstBannerConfig?.categoryId?.name;
                      const linkedService = firstBannerConfig?.serviceId?.name;

                      // Active Cities
                      const activeCities = banner.cityConfigs
                        ?.filter((c) => c.isActive)
                        ?.map((c) => c.cityId?.name || "Unknown City") || [];

                      return (
                        <TableRow
                          key={banner._id}
                          className="hover:bg-slate-50/80 transition-colors duration-200"
                        >
                          <TableCell className="align-middle">
                            {displayImg ? (
                              <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner group">
                                <img
                                  src={`${import.meta.env.VITE_APP_IMAGE_URL}/${displayImg}`}
                                  alt="Banner"
                                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                                />
                              </div>
                            ) : (
                              <div className="h-14 w-24 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium italic border border-slate-200">
                                No Preview
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="align-middle">
                            {banner.type === "HOME" && (
                              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-bold border border-blue-100 py-1 px-3.5 rounded-full">
                                HOME
                              </Badge>
                            )}
                            {banner.type === "OFFER" && (
                              <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 font-bold border border-amber-100 py-1 px-3.5 rounded-full">
                                OFFER
                              </Badge>
                            )}
                            {banner.type === "REFER" && (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold border border-emerald-100 py-1 px-3.5 rounded-full">
                                REFER
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="align-middle font-semibold text-slate-700">
                            {activeCities.length === 0 ? (
                              <span className="text-slate-400 italic text-xs font-normal">None Configured</span>
                            ) : activeCities.length <= 3 ? (
                              activeCities.join(", ")
                            ) : (
                              `${activeCities.slice(0, 2).join(", ")} +${activeCities.length - 2}`
                            )}
                          </TableCell>

                          <TableCell className="align-middle">
                            {linkedCat || linkedService ? (
                              <div className="space-y-0.5">
                                {linkedCat && (
                                  <div className="text-sm font-semibold text-slate-800">{linkedCat}</div>
                                )}
                                {linkedService && (
                                  <div className="text-xs text-slate-500 font-medium">{linkedService}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs font-medium">Not Linked</span>
                            )}
                          </TableCell>

                          <TableCell className="align-middle">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  banner.isActive ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                              />
                              <span className="text-sm font-bold text-slate-700">
                                {banner.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="align-middle font-bold text-slate-600">
                            {banner.type === "HOME" ? "3 / 3" : "1 / 1"}
                          </TableCell>

                          <TableCell className="align-middle">
                            <div className="text-sm font-semibold text-slate-800">
                              {new Date(banner.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">Admin Panel</div>
                          </TableCell>

                          <TableCell className="align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800">
                                  <MoreVertical className="h-4.5 w-4.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px] rounded-lg shadow-md border-slate-200">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBanner(banner);
                                    setIsPreviewDrawerOpen(true);
                                  }}
                                  className="font-medium cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4 text-slate-500" /> Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenEditBanner(banner)}
                                  className="font-medium cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4 text-slate-500" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleBannerStatus(banner)}
                                  className="font-medium cursor-pointer"
                                >
                                  <Switch
                                    checked={banner.isActive}
                                    className="scale-75 -ml-1 mr-1"
                                    onCheckedChange={() => {}}
                                  />
                                  Toggle Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(banner._id, "banner")}
                                  className="text-red-600 focus:text-red-700 font-medium cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: REVIEW VIDEOS */}
          <TabsContent value="videos" className="space-y-4 outline-none">
            {videosLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
                <Spinner className="h-8 w-8 text-blue-600" />
                <p className="text-sm font-medium text-slate-500">Loading customer testimonials...</p>
              </div>
            ) : videoList.length === 0 ? (
              <div className="p-20 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center gap-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Video className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 text-lg">No Videos Found</h3>
                  <p className="text-slate-500 max-w-sm text-sm">
                    Upload testimonial and product overview videos to enhance customer credibility.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    resetVideoFields();
                    setVideoDialogMode("create");
                    setIsVideoDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" /> Upload Video
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoList.map((vid) => (
                  <Card
                    key={vid._id}
                    className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl bg-white flex flex-col h-[450px]"
                  >
                    {/* Video Thumbnail Section */}
                    <div className="relative h-72 bg-slate-950 flex items-center justify-center group overflow-hidden">
                      {vid.video ? (
                        <video
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${vid.video}`}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="text-slate-500 text-xs italic">No Video File</div>
                      )}
                      <button
                        onClick={() => {
                          setPlayingVideoUrl(`${import.meta.env.VITE_APP_IMAGE_URL}/${vid.video}`);
                          setIsVideoPlayerOpen(true);
                        }}
                        className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/95 text-blue-600 shadow-lg hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100"
                      >
                        <Play className="h-5.5 w-5.5 fill-current ml-0.5" />
                      </button>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        Order: {vid.displayOrder}
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-800 line-clamp-1 text-base leading-tight">
                            {vid.title || "Customer Testimonial"}
                          </h4>
                          {vid.serviceId?.name && (
                            <Badge className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100 shrink-0 text-[10px] font-bold rounded">
                              {vid.serviceId.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {vid.description || "No description provided."}
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 border-t pt-3 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditVideo(vid)}
                          className="h-8 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" /> Replace
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(vid._id, "video")}
                          className="h-8 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: ANNOUNCEMENTS */}
          <TabsContent value="announcements" className="space-y-4 outline-none">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {announcementsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-3">
                  <Spinner className="h-8 w-8 text-blue-600" />
                  <p className="text-sm font-medium text-slate-500">Loading city announcements...</p>
                </div>
              ) : announcementList.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 text-lg">No Announcements</h3>
                    <p className="text-slate-500 max-w-sm text-sm">
                      Publish announcements specific to cities for broadcast updates.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      resetAnnouncementFields();
                      setAnnouncementDialogMode("create");
                      setIsAnnouncementDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Announcement
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-bold text-slate-700">City</TableHead>
                      <TableHead className="font-bold text-slate-700">Title</TableHead>
                      <TableHead className="font-bold text-slate-700">CTA Action</TableHead>
                      <TableHead className="font-bold text-slate-700">Status</TableHead>
                      <TableHead className="font-bold text-slate-700">Created</TableHead>
                      <TableHead className="w-[100px] text-right font-bold text-slate-700"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcementList.map((ann) => (
                      <TableRow
                        key={ann._id}
                        className="hover:bg-slate-50/80 transition-colors duration-200"
                      >
                        <TableCell className="align-middle font-bold text-slate-800 capitalize">
                          {ann.cityId?.name || "Global / Unknown"}
                        </TableCell>

                        <TableCell className="align-middle font-medium text-slate-700">
                          {ann.title}
                        </TableCell>

                        <TableCell className="align-middle">
                          {ann.ctaText ? (
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                {ann.ctaText}
                                {ann.ctaLink && <ExternalLink className="h-3 w-3 text-slate-400" />}
                              </div>
                              <div className="text-xs text-slate-400 truncate max-w-[150px]">
                                {ann.ctaLink || "No link"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs font-semibold">No CTA</span>
                          )}
                        </TableCell>

                        <TableCell className="align-middle">
                          <div className="flex items-center gap-3.5">
                            <Switch
                              checked={ann.isActive}
                              onCheckedChange={() => handleToggleAnnouncementStatus(ann)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
                            />
                            <span
                              className={`text-sm font-bold ${
                                ann.isActive ? "text-emerald-600" : "text-slate-400"
                              }`}
                            >
                              {ann.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-middle">
                          <div className="text-sm font-semibold text-slate-800">
                            {new Date(ann.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>

                        <TableCell className="align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800">
                                <MoreVertical className="h-4.5 w-4.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px] rounded-lg shadow-md border-slate-200">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAnnouncementForPreview(ann);
                                  setIsAnnouncementPreviewOpen(true);
                                }}
                                className="font-medium cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4 text-slate-500" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenEditAnnouncement(ann)}
                                className="font-medium cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4 text-slate-500" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(ann._id, "announcement")}
                                className="text-red-600 focus:text-red-700 font-medium cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ------------------- DIALOGS & DRAWERS ------------------- */}

      {/* 1. BANNER PREVIEW SLIDE OVER DRAWER */}
      <Sheet open={isPreviewDrawerOpen} onOpenChange={setIsPreviewDrawerOpen}>
        <SheetContent className="sm:max-w-md w-[500px] overflow-y-auto bg-slate-50 p-6 border-l shadow-2xl">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-extrabold text-slate-900 flex items-center justify-between">
              Banner Profile Details
            </SheetTitle>
          </SheetHeader>

          {selectedBanner && (
            <div className="space-y-6 pt-6">
              {/* Detailed Image Cards */}
              <div className="space-y-4">
                <Label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Preview Graphic
                </Label>
                {selectedBanner.cityConfigs?.map((cfg, i) => {
                  const activeImg = cfg.banners?.[0]?.image;
                  if (!activeImg) return null;
                  return (
                    <Card key={i} className="overflow-hidden border border-slate-200 shadow-xs rounded-xl bg-white">
                      <div className="relative h-44 bg-slate-100 flex items-center justify-center">
                        <img
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${activeImg}`}
                          alt="Banner Location"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                          {cfg.cityId?.name || "Global / Unknown"}
                        </div>
                      </div>
                      <CardContent className="p-3 bg-slate-50/50 flex flex-col gap-1 text-xs">
                        {cfg.banners?.[0]?.categoryId?.name && (
                          <div>
                            <span className="font-semibold text-slate-500">Category: </span>
                            <span className="font-bold text-slate-700">{cfg.banners[0].categoryId.name}</span>
                          </div>
                        )}
                        {cfg.banners?.[0]?.serviceId?.name && (
                          <div>
                            <span className="font-semibold text-slate-500">Service: </span>
                            <span className="font-bold text-slate-700">{cfg.banners[0].serviceId.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Core Attributes */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Banner Type</div>
                    <div className="font-extrabold text-slate-800 mt-1">{selectedBanner.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Slots Configured</div>
                    <div className="font-extrabold text-slate-800 mt-1">
                      {selectedBanner.type === "HOME" ? "3 / 3" : "1 / 1"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</div>
                    <div className="mt-1">
                      <Badge
                        className={
                          selectedBanner.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold"
                            : "bg-slate-100 text-slate-600 border-slate-200 font-bold"
                        }
                      >
                        {selectedBanner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Created Date</div>
                    <div className="font-bold text-slate-700 mt-1">
                      {new Date(selectedBanner.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Drawer actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsPreviewDrawerOpen(false);
                    handleOpenEditBanner(selectedBanner);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Configuration
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsPreviewDrawerOpen(false);
                    handleDeleteClick(selectedBanner._id, "banner");
                  }}
                  className="rounded-lg shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 2. CREATE/EDIT BANNER SLIDE OVER DRAWER */}
      <Sheet open={isFormDrawerOpen} onOpenChange={setIsFormDrawerOpen}>
        <SheetContent className="sm:max-w-2xl w-[700px] overflow-y-auto p-6 bg-slate-50 border-l shadow-2xl">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-extrabold text-slate-900">
              {formDrawerMode === "create" ? "Create New Marketing Banner" : "Edit Banner Configuration"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {formDrawerMode === "create" ? (
              <BannerForm
                onSubmit={async (formData) => {
                  await patchBanner("/banners/create-banner", formData);
                }}
                isLoading={bannersLoading}
                defaultValues={{
                  type: "HOME",
                  cityConfigs: [],
                }}
              />
            ) : (
              normalizedBanner && (
                <BannerForm
                  initialData={normalizedBanner}
                  onSubmit={async (formData) => {
                    await patchBanner(`/banners/update-banner/${selectedBanner._id}`, formData);
                  }}
                  isEdit
                  isLoading={bannersLoading}
                />
              )
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 3. UPLOAD/EDIT VIDEO DIALOG */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-slate-200 shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              {videoDialogMode === "create" ? "Upload Review Testimonial" : "Edit Video Asset Details"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUploadVideoSubmit} className="space-y-4 pt-2">
            {/* Video file selector */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Video File</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVideoFile(file);
                    setVideoPreview(URL.createObjectURL(file));
                  }
                }}
                className="border-slate-200"
              />
              {videoPreview && (
                <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-72 flex items-center justify-center relative">
                  <video src={videoPreview} className="w-full h-full object-cover" controls />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Video Title</Label>
              <Input
                type="text"
                placeholder="e.g. Customer AC Service Testimonial"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="border-slate-200"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Description</Label>
              <Input
                type="text"
                placeholder="Brief summary or review content snippet..."
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                className="border-slate-200"
              />
            </div>

            {/* Category / Service linking */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Category Link</Label>
                <Select value={videoCategory} onValueChange={setVideoCategory}>
                  <SelectTrigger className="border-slate-200 bg-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Service Link</Label>
                <Select
                  value={videoService}
                  onValueChange={setVideoService}
                  disabled={!videoCategory}
                >
                  <SelectTrigger className="border-slate-200 bg-white">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {(servicesMap[videoCategory] || []).map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Display Order</Label>
              <Input
                type="number"
                min="0"
                value={videoOrder}
                onChange={(e) => setVideoOrder(e.target.value)}
                className="border-slate-200 w-32"
              />
            </div>

            <DialogFooter className="pt-4 border-t gap-2 md:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVideoDialogOpen(false)}
                className="border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={videoUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                {videoUploading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                {videoDialogMode === "create" ? "Upload Video" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. CREATE/EDIT ANNOUNCEMENT DIALOG MODAL */}
      <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-slate-200 shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              {announcementDialogMode === "create" ? "Create Broadcast Announcement" : "Modify Announcement Campaign"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAnnouncementSubmit} className="space-y-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</Label>
                <Select
                  value={annCity}
                  onValueChange={setAnnCity}
                  disabled={announcementDialogMode === "edit"}
                >
                  <SelectTrigger className="border-slate-200 bg-white">
                    <SelectValue placeholder="Select target city" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCities.map((city) => (
                      <SelectItem key={city._id} value={city._id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Title</Label>
                <Input
                  type="text"
                  placeholder="Enter Title"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CTA Text</Label>
                <Input
                  type="text"
                  value={annCtaText}
                  onChange={(e) => setAnnCtaText(e.target.value)}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CTA Link</Label>
                <Input
                  type="text"
                  placeholder="Enter CTA Link"
                  value={annCtaLink}
                  onChange={(e) => setAnnCtaLink(e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2 md:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAnnouncementDialogOpen(false)}
                className="border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={announcementSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                {announcementSaving ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Save Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. ANNOUNCEMENT PREVIEW DRAWER */}
      <Sheet open={isAnnouncementPreviewOpen} onOpenChange={setIsAnnouncementPreviewOpen}>
        <SheetContent className="sm:max-w-md w-[500px] bg-slate-50 p-6 border-l shadow-2xl">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-extrabold text-slate-900">
              Announcement Widget Preview
            </SheetTitle>
          </SheetHeader>

          {selectedAnnouncementForPreview && (
            <div className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
                  Broadcast Layout
                </Label>
                <div
                  className="rounded-xl p-6 shadow-lg border border-black/10 flex flex-col justify-between items-center text-center gap-5 relative py-8"
                  style={{
                    backgroundColor: selectedAnnouncementForPreview.bgColor || "#2563EB",
                    color: selectedAnnouncementForPreview.textColor || "#FFFFFF",
                  }}
                >
                  <h3 className="font-extrabold text-lg md:text-xl tracking-tight leading-snug">
                    {selectedAnnouncementForPreview.title}
                  </h3>
                  {selectedAnnouncementForPreview.ctaText && (
                    <button
                      type="button"
                      className="px-5 py-2 rounded-full text-xs font-extrabold uppercase shadow-md transition-all duration-200"
                      style={{
                        backgroundColor: selectedAnnouncementForPreview.textColor || "#FFFFFF",
                        color: selectedAnnouncementForPreview.bgColor || "#2563EB",
                      }}
                    >
                      {selectedAnnouncementForPreview.ctaText}
                    </button>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">City Coverage</div>
                    <div className="font-extrabold text-slate-800 mt-1 capitalize">
                      {selectedAnnouncementForPreview.cityId?.name || "Global / Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Link Route</div>
                    <div className="font-semibold text-slate-600 mt-1 truncate">
                      {selectedAnnouncementForPreview.ctaLink || "No route config"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Publish Status</div>
                    <div className="mt-1">
                      <Badge
                        className={
                          selectedAnnouncementForPreview.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold"
                            : "bg-slate-100 text-slate-600 border-slate-200 font-bold"
                        }
                      >
                        {selectedAnnouncementForPreview.isActive ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Created Date</div>
                    <div className="font-bold text-slate-700 mt-1">
                      {new Date(selectedAnnouncementForPreview.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsAnnouncementPreviewOpen(false);
                    handleOpenEditAnnouncement(selectedAnnouncementForPreview);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Announcement
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsAnnouncementPreviewOpen(false);
                    handleDeleteClick(selectedAnnouncementForPreview._id, "announcement");
                  }}
                  className="rounded-lg shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 6. GENERIC DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-slate-200 shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Delete Marketing Asset?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 pt-1.5">
              Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t gap-2 md:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="border-slate-200 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
            >
              Delete Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. POPUP VIDEO PLAYER DIALOG */}
      <Dialog open={isVideoPlayerOpen} onOpenChange={setIsVideoPlayerOpen}>
        <DialogContent className="sm:max-w-[360px] h-[640px] p-0 bg-black border-none rounded-xl overflow-hidden shadow-2xl flex flex-col justify-center">
          <button
            onClick={() => setIsVideoPlayerOpen(false)}
            className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
          <div className="h-full w-full flex items-center justify-center bg-black">
            <video src={playingVideoUrl} className="w-full h-full object-contain" controls autoPlay />
          </div>
        </DialogContent>
      </Dialog>
    </Wrapper>
  );
};

export default Banners;
