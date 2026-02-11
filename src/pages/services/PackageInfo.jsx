import parse from "html-react-parser";
import { useLocation } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Wrapper from "../../components/wrappers/Wrapper";
import RatingsComp from "../../components/category/RatingsComp";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const ProductInfo = () => {
  const {
    state: { product, isPackage },
  } = useLocation();

  return (
    <Wrapper>
      <div className="py-8 space-y-8 font-poppins">
        {/* Header */}
        <div>
          <BackLink href={-1}>
            <H2>{isPackage ? "Package" : "Product"} Details</H2>
          </BackLink>

          <p className="text-sm text-muted-foreground mt-1">
            Complete information & ratings
          </p>
        </div>

        {/* Main Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product?.imageUrl?.map((img) => (
                <img
                  key={img}
                  src={`${import.meta.env.VITE_APP_IMAGE_URL}/${img}`}
                  alt={product?.name}
                  className="h-[200px] w-full rounded-lg object-cover border"
                />
              ))}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">{product?.name}</h2>

              {product?.description && (
                <div className="prose max-w-none text-sm text-muted-foreground">
                  {parse(product.description)}
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-green-600">
                  ₹{product?.offerPrice}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  ₹{product?.price}
                </span>
                <Badge variant="secondary">Best Price</Badge>
              </div>
            </div>

            <Separator />

            {/* Ratings */}
            <RatingsComp item={product} />
          </CardContent>
        </Card>

        {/* Package Products */}
        {isPackage && (
          <>
            <h2 className="text-xl font-semibold">Included Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product?.products?.map((item) => {
                const p = item?.productId;
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
        )}
      </div>
    </Wrapper>
  );
};

export default ProductInfo;
