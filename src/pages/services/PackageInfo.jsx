import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import useGetApiReq from "@/hooks/useGetApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import RatingsComp from "../../components/category/RatingsComp";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

/* ---------------- City Pricing ---------------- */

const CityWiseConfig = ({ cityConfigs = [] }) => {
  if (!cityConfigs.length) {
    return (
      <p className="text-sm text-muted-foreground">No city pricing available</p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">City-wise Pricing</h2>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cityConfigs.map((cfg) => (
          <Card
            key={cfg.cityId._id}
            className={!cfg.isActive ? "opacity-60" : ""}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between">
                <h3 className="font-semibold uppercase">{cfg.cityId.name}</h3>

                <Badge variant={cfg.isActive ? "success" : "destructive"}>
                  {cfg.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Offer Price
                </Label>
                <p className="text-xl font-semibold text-green-600">
                  ₹{cfg.offerPrice}
                </p>
                <p className="text-sm line-through text-muted-foreground">
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

/* ---------------- Skeleton ---------------- */

const PackageSkeleton = () => (
  <Wrapper>
    <div className="py-8 space-y-6">
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-4 w-72" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  </Wrapper>
);

/* ---------------- Main Screen ---------------- */

const PackageInfo = () => {
  const { packageId } = useParams();
  const { fetchData, res, isLoading } = useGetApiReq();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    fetchData(`/packages/get-package-details/${packageId}`, {
      screenName: "PACKAGE_DETAILS",
    });
  }, [packageId]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setPkg(res?.data?.data);
    }
  }, [res]);
  console.log("res", res);
  console.log("pkg", pkg);

  

  if (isLoading) return <PackageSkeleton />;
  if (!pkg) return null;

  return (
    <Wrapper>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div>
          <BackLink href={-1}>
            <H2>Package Details</H2>
          </BackLink>
          <p className="text-sm text-muted-foreground">
            Complete package information & pricing
          </p>
        </div>

        {/* Package Info */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pkg.imageUrl?.length ? (
                pkg.imageUrl.map((img) => (
                  <img
                    key={img}
                    src={`${import.meta.env.VITE_APP_IMAGE_URL}/${img}`}
                    onError={(e) =>
                      (e.currentTarget.src = "/images/placeholder-product.png")
                    }
                    className="h-[200px] w-full rounded-lg object-cover border"
                  />
                ))
              ) : (
                <div className="h-[200px] border rounded-lg flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{pkg.name}</h2>
              <p className="text-sm">
                <b>Duration Minutes:</b> <span>{pkg.durationMinutes}</span>
              </p>
              {pkg.description && (
                <div className="prose text-sm text-muted-foreground">
                  {parse(pkg.description)}
                </div>
              )}
            </div>

            <Separator />

            <RatingsComp item={pkg} />
          </CardContent>
        </Card>

        {/* City Pricing */}
        <CityWiseConfig cityConfigs={pkg.cityConfigs} />

        {/* Included Products */}
        {pkg.products?.length > 0 && (
          <>
            <Separator />
            <h2 className="text-xl font-semibold">Included Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.products.map(({ productId }) => {
                if (!productId) return null;
                console.log("productId", productId);

                return (
                  <Card key={productId._id}>
                    <CardContent className="p-4 flex gap-4">
                      {productId?.imageUrl?.[0] ? (
                        <img
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${productId.imageUrl?.[0]}`}
                          onError={(e) =>
                            (e.currentTarget.src =
                              "/images/placeholder-product.png")
                          }
                          className="h-[100px] w-[100px] rounded-md object-cover border"
                        />
                      ) : (
                        <div className="h-[100px] w-[100px] rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="font-medium">{productId.name}</h4>
                        {productId.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {parse(productId.description)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default PackageInfo;
