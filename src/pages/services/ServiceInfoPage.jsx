import parse from "html-react-parser";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import AddIconModal from "../../components/modals/AddIconModal";
import AddPackageModal from "../../components/modals/AddPackageModal";
import AddProductModal from "../../components/modals/AddProductModal";
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
import { Section } from "../../components";
import { buildQuery } from "../../utils/buildQuery";

/* -------------------------------------------------- */

const ServiceInfoPage = () => {
  const { serviceId, categoryId } = useParams();
  const navigate = useNavigate();

  /* -------- City Filter -------- */
  const [selectedCity, setSelectedCity] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

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

  const { res: deleteProductRes, fetchData: deleteProduct } = useDeleteApiReq();
  const { res: deletePackageRes, fetchData: deletePackage } = useDeleteApiReq();

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
    const query = buildQuery({ cityId: selectedCity, page });
    fetchProducts(`/products/get-service-product/${serviceId}?${query}`);
  };

  const getServicePackages = () =>
    fetchPackages(`/admin/get-service-package/${serviceId}`);

  /* -------- Effects -------- */
  useEffect(() => {
    getServiceDetails();
  }, []);

  useEffect(() => {
    getServiceProducts();
  }, [page, selectedCity]);

  useEffect(() => {
    getServicePackages();
  }, []);

  useEffect(() => {
    if (serviceRes?.status === 200) {
      console.log("serviceRes", serviceRes);

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
    }
  }, [packageRes]);

  useEffect(() => {
    if (deleteProductRes?.status === 200) {
      toast.success("Product deleted");
      getServiceProducts();
      setDeleteOpen(false);
    }
  }, [deleteProductRes]);

  useEffect(() => {
    if (deletePackageRes?.status === 200) {
      toast.success("Package deleted");
      getServicePackages();
      setDeleteOpen(false);
    }
  }, [deletePackageRes]);

  /* -------- Delete -------- */
  const handleDelete = () => {
    if (deleteType === "product") {
      deleteProduct(`/admin/delete-product/${selectedProduct}`);
    } else {
      deletePackage(`/admin/delete-package/${selectedPackage}`);
    }
  };

  /* -------- City filtering (client-side) -------- */
  const filteredProducts = selectedCity
    ? products.filter((p) => p.cityId === selectedCity._id)
    : products;

  const filteredPackages = selectedCity
    ? packages.filter((pkg) => pkg.cityId === selectedCity._id)
    : packages;

  /* -------------------------------------------------- */

  return (
    <>
      <Wrapper>
        <div className="space-y-8 font-poppins">
          <BackLink href={-1}>
            <H2>Service Details</H2>
          </BackLink>

          {/* -------- City Filter Bar -------- */}
          <div className="flex items-center justify-end gap-3">
            <CityFilter value={selectedCity} onChange={setSelectedCity} />

            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
          </div>

          {/* -------- Service Header -------- */}
          {service ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {service.icon ? (
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-16 w-16 rounded-md border p-0"
                                onClick={() => setIconModalOpen(true)}
                              >
                                <img
                                  src={`${import.meta.env.VITE_APP_IMAGE_URL}/${service.icon}`}
                                  alt="icon"
                                  className="h-full w-full rounded-md object-cover"
                                />
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="absolute -right-2 -top-2 h-6 w-6"
                                onClick={() => setIconModalOpen(true)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-16 w-16 border-dashed"
                              onClick={() => setIconModalOpen(true)}
                            >
                              <Plus />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {service.icon ? "Update icon" : "Upload icon"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      {/* <p className="text-sm text-muted-foreground">
                        Starting Price: ₹{service.startingPrice}
                      </p> */}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setFeatureModalOpen(true)}
                  >
                    Update Features
                  </Button>
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                  {parse(service.description || "")}
                </CardContent>
              </Card>

              <Section title="City-wise Configuration">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.cityConfigs.map((cfg) => (
                    <Card key={cfg.cityId._id}>
                      <CardContent className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold uppercase">
                              {cfg.cityId.name}
                            </h3>
                          </div>

                          <Badge
                            variant={cfg.isActive ? "success" : "inprogress"}
                          >
                            {cfg.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {/* Starting Price */}
                        <div>
                          <Label>Starting Price</Label>
                          <p className="text-sm">₹{cfg.startingPrice}</p>
                        </div>

                        {/* Homepage flags */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label>App Homepage</Label>
                            <p>{cfg.appHomepage ? "Yes" : "No"}</p>
                          </div>

                          <div>
                            <Label>Web Homepage</Label>
                            <p>{cfg.webHomepage ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {service.cityConfigs.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No config found
                    </p>
                  )}
                </div>
              </Section>
            </>
          ) : (
            <Skeleton className="h-[160px] w-full rounded-xl" />
          )}

          {/* -------- Products -------- */}
          <Section
            title="Products"
            onAdd={() =>
              navigate(
                `/admin/categories/${categoryId}/product/${serviceId}/add-product`,
              )
            }
          >
            {productLoading ? (
              <GridSkeleton />
            ) : filteredProducts.length === 0 ? (
              <Empty text="No products found" />
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
          </Section>

          <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />

          {/* -------- Packages -------- */}
          <Section
            title="Packages"
            onAdd={() =>
              navigate(
                `/admin/categories/${categoryId}/product/${serviceId}/add-package`,
                { state: { products } },
              )
            }
          >
            {packageLoading ? (
              <GridSkeleton />
            ) : filteredPackages.length === 0 ? (
              <Empty text="No packages found" />
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
                        `/admin/categories/${categoryId}/product/${serviceId}/info`,
                        { state: { product: pkg, isPackage: true } },
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
          </Section>
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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    className="cursor-pointer transition hover:shadow-md pt-0"
  >
    <img
      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${image}`}
      className="aspect-video h-[200px] w-full rounded-t-xl object-cover"
    />
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base">{title}</CardTitle>
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button size="icon" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-3">
        {desc && parse(desc)}
      </p>
    </CardContent>
  </Card>
);

const ItemCardSkeleton = () => (
  <Card className="pt-0">
    <Skeleton className="aspect-video h-[200px] w-full rounded-t-xl" />
    <CardHeader className="flex flex-row items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-[85%]" />
      <Skeleton className="h-3 w-[70%]" />
    </CardContent>
  </Card>
);

const Empty = ({ text }) => (
  <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
    {text}
  </div>
);
