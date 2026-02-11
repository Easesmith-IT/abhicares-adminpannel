import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Wrapper from "../../components/wrappers/Wrapper";
import RatingsComp from "../../components/category/RatingsComp";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import useGetApiReq from "@/hooks/useGetApiReq";
import { Skeleton } from "../../components/ui/skeleton";

const CityWiseConfig = ({ cityConfigs = [] }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">
        City-wise Pricing
      </h2>

      <Separator />

      {cityConfigs.length === 0 && (
        <p className="text-sm text-muted-foreground">No city pricing found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cityConfigs.map((cfg) => (
          <Card
            key={cfg.cityId._id}
            className={`border transition shadow-sm hover:shadow-md ${
              !cfg.isActive ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="font-semibold uppercase tracking-wide">
                  {cfg.cityId.name}
                </h3>

                <Badge variant={cfg.isActive ? "success" : "destructive"}>
                  {cfg.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Offer Price
                </Label>
                <p className="text-xl font-semibold text-green-600">
                  ₹{cfg.offerPrice}
                </p>

                <p className="text-sm text-muted-foreground line-through">
                  ₹{cfg.price}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CityWiseConfigSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-56" />
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProductInfoSkeleton = () => {
  return (
    <Wrapper>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Product Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
              ))}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            <Separator />

            {/* Ratings */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>

        {/* City Pricing */}
        <CityWiseConfigSkeleton />
      </div>
    </Wrapper>
  );
};


const ProductInfo = () => {
  const { productId } = useParams();
  const location = useLocation();

  const isPackage = location?.state?.isPackage ?? false;

  const { res: productRes, isLoading, fetchData } = useGetApiReq();
  const [product, setProduct] = useState(null);

  /* Fetch product details */
  useEffect(() => {
    fetchData(`/products/get-product-details/${productId}`, {
      screenName: "PRODUCT_DETAILS",
    });
  }, [productId]);

  /* Set response */
  useEffect(() => {
    if (productRes?.status === 200) {
      setProduct(productRes.data.product);
    }
  }, [productRes]);

  if (isLoading) {
    return <ProductInfoSkeleton />;
  }


  if (!product) return null;

  return (
    <Wrapper>
      <div className="py-8 space-y-8 font-poppins">
        {/* Header */}
        <div>
          <BackLink href={-1}>
            <H2>{isPackage ? "Package" : "Product"} Details</H2>
          </BackLink>

          <p className="text-sm text-muted-foreground mt-1">
            Complete information, pricing & configuration
          </p>
        </div>

        {/* Product Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.imageUrl?.map((img) => (
                <img
                  key={img}
                  src={`${import.meta.env.VITE_APP_IMAGE_URL}/${img}`}
                  alt={product.name}
                  className="h-[200px] w-full rounded-lg object-cover border"
                />
              ))}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">{product.name}</h2>

              {product.description && (
                <div className="prose max-w-none text-sm text-muted-foreground">
                  {parse(product.description)}
                </div>
              )}
            </div>

            <Separator />

            {/* Ratings */}
            <RatingsComp item={product} />
          </CardContent>
        </Card>

        {/* City-wise Config */}
        <CityWiseConfig cityConfigs={product.cityConfigs || []} />

        {/* Package Products */}
        {/* {isPackage && product.products?.length > 0 && (
          <>
            <Separator />
            <h2 className="text-xl font-semibold">Included Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.products.map(({ productId: p }) => {
                if (!p) return null;

                return (
                  <Card key={p._id}>
                    <CardContent className="p-4 flex gap-4">
                      <img
                        src={`${import.meta.env.VITE_APP_IMAGE_URL}/${p.imageUrl?.[0]}`}
                        className="h-[100px] w-[100px] rounded-md object-cover border"
                      />

                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{p.name}</h4>

                        {p.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {parse(p.description)}
                          </div>
                        )}

                        <div className="flex gap-3 items-center">
                          <span className="font-semibold text-green-600">
                            ₹{p.offerPrice}
                          </span>
                          <span className="text-sm line-through text-muted-foreground">
                            ₹{p.price}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )} */}
      </div>
    </Wrapper>
  );
};

export default ProductInfo;
