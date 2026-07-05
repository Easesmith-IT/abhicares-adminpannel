import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import AddIconModal from "../../components/modals/AddIconModal";
import DeleteModal from "../../components/modals/DeleteModal";
import FeaturesModal from "../../components/modals/FeaturesModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Pencil, Plus, Trash2 } from "lucide-react";

import Wrapper from "../../components/wrappers/Wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { CityFilter } from "@/components/filters/city";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import UpdateServiceGSTModal from "../../components/globals/UpdateServiceGSTModal";
import { useCustomSidebar } from "@/components/layout/sidebarContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/* -------------------------------------------------- */

const ServiceInfoPage = () => {
  const { serviceId, categoryId } = useParams();
  const navigate = useNavigate();

  /* -------- City Filter -------- */
  const { selectedCityId } = useCustomSidebar();
  const [selectedCity, setSelectedCity] = useState(selectedCityId || "");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [productLimit, setProductLimit] = useState("10");
  const [page1, setPage1] = useState(1);
  const [pageCount1, setPageCount1] = useState(1);
  const [packageLimit, setPackageLimit] = useState("10");
  const [isGstUpdateModalOpen, setIsGstUpdateModalOpen] = useState(false);

  useEffect(() => {
    setSelectedCity(selectedCityId || "");
  }, [selectedCityId]);

  useEffect(() => {
    setPage(1);
    setPage1(1);
  }, [selectedCity]);

  /* -------- API hooks -------- */
  const { res: serviceRes, fetchData: fetchService } = useGetApiReq();
  const {
    res: productRes,
    fetchData: fetchProducts,
    isLoading: productLoading,
  } = useGetApiReq();
  const {
    res: packageRes,
    fetchData: fetchPackages,
    isLoading: packageLoading,
  } = useGetApiReq();

  const { res: deleteRes, fetchData: performDelete } = useDeleteApiReq();

  /* -------- State -------- */
  const [service, setService] = useState(null);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("product");

  const handleReset = () => {
    setSelectedCity("");
  };

  /* -------- Fetchers -------- */
  const getServiceDetails = () =>
    fetchService(`/services/get-service-details/${serviceId}`);

  const getServiceProducts = () => {
    const query = buildQuery({ cityId: selectedCity, page, limit: productLimit });
    fetchProducts(`/products/get-service-product/${serviceId}?${query}`);
  };

  const getServicePackages = () => {
    const query = buildQuery({
      cityId: selectedCity,
      page: page1,
      limit: packageLimit,
      serviceId,
      isActive: true,
    });
    fetchPackages(`/packages/get-packages?${query}`);
  };

  const buildQuery = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  };

  /* -------- Effects -------- */
  useEffect(() => {
    getServiceDetails();
  }, []);

  useEffect(() => {
    getServiceProducts();
  }, [page, productLimit, selectedCity]);

  useEffect(() => {
    getServicePackages();
  }, [selectedCity, page1, packageLimit]);

  useEffect(() => {
    if (serviceRes?.status === 200) {
      setService(serviceRes.data.service);
    }
  }, [serviceRes]);

  useEffect(() => {
    if (productRes?.status === 200) {
      setProducts(productRes.data.data || []);
      setPageCount(productRes?.data?.pagination?.totalPages || 0);
    }
  }, [productRes]);

  useEffect(() => {
    if (packageRes?.status === 200) {
      setPackages(packageRes.data.data || []);
      setPageCount1(packageRes?.data?.pagination?.totalPages || 0);
    }
  }, [packageRes]);

  useEffect(() => {
    if (deleteRes?.status === 200) {
      if (deleteType === "product") {
        getServiceProducts();
      } else {
        getServicePackages();
      }
      setDeleteOpen(false);
    }
  }, [deleteRes]);

  /* -------- Delete -------- */
  const handleDelete = () => {
    if (deleteType === "product") {
      performDelete(`/admin/delete-product/${selectedProduct}`);
    } else {
      performDelete(`/admin/delete-package/${selectedPackage}`);
    }
  };

  /* -------- Lists are already city-filtered by the backend -------- */
  const filteredProducts = products;
  const filteredPackages = packages;

  /* -------------------------------------------------- */

  return (
    <>
      <Wrapper>
        {isGstUpdateModalOpen && (
          <UpdateServiceGSTModal
            open={isGstUpdateModalOpen}
            onOpenChange={setIsGstUpdateModalOpen}
          />
        )}
        <div className="space-y-6 font-poppins pb-10">
          <div className="flex justify-between gap-5 items-center">
            <BackLink href={-1}>
              <H2>Service Details</H2>
            </BackLink>
          </div>

          {/* -------- Service Header -------- */}
          {service ? (
            <Card className="overflow-hidden border border-slate-100 shadow-sm rounded-2xl bg-white">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {service?.bannerUrl ? (
                  <div className="w-full md:w-[320px] shrink-0 h-[180px] rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative group">
                    <img
                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${service?.bannerUrl}`}
                      alt="banner"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-[320px] shrink-0 h-[180px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Plus className="h-6 w-6 stroke-1" />
                    <span className="text-xs font-medium">No banner uploaded</span>
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        {/* Service Icon */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {service.icon ? (
                                <div className="relative shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-16 w-16 rounded-xl border border-slate-100 p-0 shadow-sm hover:bg-slate-50"
                                    onClick={() => setIconModalOpen(true)}
                                  >
                                    <img
                                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${service.icon}`}
                                      alt="icon"
                                      className="h-full w-full rounded-xl object-cover"
                                    />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute -right-1.5 -top-1.5 h-6 w-6 rounded-full border border-white shadow-sm hover:scale-105 transition"
                                    onClick={() => setIconModalOpen(true)}
                                  >
                                    <Pencil className="h-3 w-3 text-slate-600" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-16 w-16 border-dashed rounded-xl shrink-0"
                                  onClick={() => setIconModalOpen(true)}
                                >
                                  <Plus className="h-5 w-5 text-slate-400" />
                                </Button>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {service.icon ? "Update icon" : "Upload icon"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Service Workspace</span>
                          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">{service.name}</CardTitle>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-xl h-9 text-xs font-medium border-slate-200"
                          onClick={() => setFeatureModalOpen(true)}
                        >
                          Update Features
                        </Button>
                        <Button
                          variant="abhicares"
                          className="rounded-xl h-9 text-xs font-medium"
                          onClick={() => setIsGstUpdateModalOpen(true)}
                        >
                          Update GST
                        </Button>
                      </div>
                    </div>

                    {service.description && (
                      <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed max-w-3xl">
                        {parse(DOMPurify.sanitize(service.description))}
                      </div>
                    )}
                  </div>

                  {/* Overview metrics */}
                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-medium">Products:</span>
                      <span className="text-sm font-semibold text-slate-800">{products.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-medium">Packages:</span>
                      <span className="text-sm font-semibold text-slate-800">{packages.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span className="text-xs font-medium">Active Cities:</span>
                      <span className="text-sm font-semibold text-slate-800">
                        {service.cityConfigs.filter((c) => c.isActive).length} / {service.cityConfigs.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Skeleton className="h-[180px] w-full rounded-2xl" />
          )}

          {/* -------- Tabs Workspace -------- */}
          {service && (
            <Tabs defaultValue="products" className="w-full space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <TabsList className="bg-slate-100/80 p-1 rounded-xl">
                  <TabsTrigger value="products" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    📦 Products ({filteredProducts.length})
                  </TabsTrigger>
                  <TabsTrigger value="packages" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🎁 Packages ({filteredPackages.length})
                  </TabsTrigger>
                  <TabsTrigger value="cities" className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🗺️ City Configurations ({service.cityConfigs.length})
                  </TabsTrigger>
                </TabsList>

                {/* City filter dropdown */}
                <div className="flex items-center gap-3">
                  <CityFilter value={selectedCity} onChange={setSelectedCity} />
                  <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
                </div>
              </div>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Products</h3>
                    <p className="text-xs text-slate-500">Manage individual products and pricing details</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PageSizeSelect
                      value={productLimit}
                      onChange={(value) => {
                        setProductLimit(value);
                        setPage(1);
                      }}
                      label=""
                    />
                    <Button
                      variant="abhicares"
                      className="rounded-xl text-xs font-medium flex items-center gap-1.5 h-9"
                      onClick={() =>
                        navigate(
                          `/admin/categories/${categoryId}/product/${serviceId}/add-product`,
                        )
                      }
                    >
                      <Plus size={16} /> Add Product
                    </Button>
                  </div>
                </div>

                {productLoading ? (
                  <GridSkeleton />
                ) : filteredProducts.length === 0 ? (
                  <Empty text="No products found matching the selected city filter" />
                ) : (
                  <Grid>
                    {filteredProducts.map((p) => (
                      <ItemCard
                        key={p._id}
                        title={p.name}
                        desc={p.description}
                        image={p.imageUrl?.[0]}
                        onClick={() =>
                          navigate(
                            `/admin/categories/${categoryId}/product/${serviceId}/info/${p._id}`,
                            { state: { product: p, isPackage: false } },
                          )
                        }
                        onEdit={() =>
                          navigate(
                            `/admin/categories/${categoryId}/product/${serviceId}/update-product/${p?._id}`,
                            { state: p },
                          )
                        }
                        onDelete={() => {
                          setSelectedProduct(p._id);
                          setDeleteType("product");
                          setDeleteOpen(true);
                        }}
                      />
                    ))}
                  </Grid>
                )}

                <div className="pt-4 flex items-center justify-end gap-3">
                  <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
                </div>
              </TabsContent>

              {/* Packages Tab */}
              <TabsContent value="packages" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Packages</h3>
                    <p className="text-xs text-slate-500">Manage curated service packages and bundles</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PageSizeSelect
                      value={packageLimit}
                      onChange={(value) => {
                        setPackageLimit(value);
                        setPage1(1);
                      }}
                      label=""
                    />
                    <Button
                      variant="abhicares"
                      className="rounded-xl text-xs font-medium flex items-center gap-1.5 h-9"
                      onClick={() =>
                        navigate(
                          `/admin/categories/${categoryId}/product/${serviceId}/add-package`,
                          { state: { products } },
                        )
                      }
                    >
                      <Plus size={16} /> Add Package
                    </Button>
                  </div>
                </div>

                {packageLoading ? (
                  <GridSkeleton />
                ) : filteredPackages.length === 0 ? (
                  <Empty text="No packages found matching the selected city filter" />
                ) : (
                  <Grid>
                    {filteredPackages.map((pkg) => (
                      <ItemCard
                        key={pkg._id}
                        title={pkg.name}
                        desc={pkg.description}
                        image={pkg.imageUrl?.[0]}
                        onClick={() =>
                          navigate(
                            `/admin/categories/${categoryId}/package/${serviceId}/info/${pkg?._id}`,
                          )
                        }
                        onEdit={() => {
                          navigate(
                            `/admin/categories/${categoryId}/product/${serviceId}/update-package/${pkg?._id}`,
                            { state: { package: pkg, products } },
                          );
                        }}
                        onDelete={() => {
                          setSelectedPackage(pkg._id);
                          setDeleteType("package");
                          setDeleteOpen(true);
                        }}
                      />
                    ))}
                  </Grid>
                )}

                <div className="pt-4 flex items-center justify-end gap-3">
                  <PaginationComp
                    page={page1}
                    pageCount={pageCount1}
                    setPage={setPage1}
                  />
                </div>
              </TabsContent>

              {/* City Configurations Tab */}
              <TabsContent value="cities" className="space-y-6 outline-none">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">City-wise Configurations</h3>
                  <p className="text-xs text-slate-500">View pricing and homepage configurations per city</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.cityConfigs.map((cfg) => (
                    <Card key={cfg.cityId._id} className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                      <CardContent className="p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold uppercase text-slate-800 tracking-wide text-sm">
                            {cfg.cityId.name}
                          </h3>

                          <Badge
                            variant={cfg.isActive ? "success" : "inprogress"}
                            className="rounded-full px-2 py-0.5 text-[10px]"
                          >
                            {cfg.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <Separator className="bg-slate-100" />

                        {/* Starting Price */}
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400 font-medium">Starting Price</Label>
                          <p className="text-lg font-bold text-slate-800">₹{cfg.startingPrice}</p>
                        </div>

                        {/* Homepage flags */}
                        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                          <div className="space-y-1">
                            <Label className="text-slate-400 font-medium">App Homepage</Label>
                            <div className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.appHomepage ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                              <span className="font-semibold text-slate-700">{cfg.appHomepage ? "Yes" : "No"}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-slate-400 font-medium">Web Homepage</Label>
                            <div className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.webHomepage ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                              <span className="font-semibold text-slate-700">{cfg.webHomepage ? "Yes" : "No"}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {service.cityConfigs.length === 0 && (
                    <p className="text-slate-500 text-sm italic">
                      No config found
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Wrapper>

      {iconModalOpen && (
        <AddIconModal
          setIsModalOpen={setIconModalOpen}
          serviceId={serviceId}
          getServiceDetails={getServiceDetails}
        />
      )}

      {featureModalOpen && (
        <FeaturesModal
          setIsModalOpen={setFeatureModalOpen}
          allFeatures={service?.features}
          serviceId={serviceId}
          getServiceDetails={getServiceDetails}
        />
      )}

      {deleteOpen && (
        <DeleteModal setState={setDeleteOpen} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default ServiceInfoPage;

/* ===================================================== */
/* ================= Helper Components ================= */
/* ===================================================== */

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

const GridSkeleton = () => (
  <Grid>
    {Array.from({ length: 6 }).map((_, i) => (
      <ItemCardSkeleton key={i} />
    ))}
  </Grid>
);

const ItemCard = ({ title, desc, image, onClick, onEdit, onDelete }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer transition duration-200 hover:shadow-md pt-0 overflow-hidden border border-slate-100 rounded-2xl bg-white group flex flex-col justify-between h-full"
  >
    <div>
      <div className="relative h-[180px] w-full overflow-hidden bg-slate-50">
        {image ? (
          <img
            src={`${import.meta.env.VITE_APP_IMAGE_URL}/${image}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-1 flex-1 pr-2">{title}</CardTitle>
        <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-slate-100 border border-slate-100" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-rose-50 border border-rose-100 hover:border-rose-200" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          </Button>
        </div>
      </CardHeader>
    </div>
    <CardContent className="px-4 pb-4 pt-0">
      <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {desc && parse(DOMPurify.sanitize(desc))}
      </div>
    </CardContent>
  </Card>
);

const ItemCardSkeleton = () => (
  <Card className="pt-0 overflow-hidden border border-slate-100 rounded-2xl">
    <Skeleton className="h-[180px] w-full" />
    <CardHeader className="flex flex-row items-center justify-between p-4">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </CardHeader>
    <CardContent className="px-4 pb-4 pt-0 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-[85%]" />
    </CardContent>
  </Card>
);

const Empty = ({ text }) => (
  <div className="flex h-[150px] items-center justify-center text-sm text-slate-400 italic border border-dashed rounded-xl">
    {text}
  </div>
);
