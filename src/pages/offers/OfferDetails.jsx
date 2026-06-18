import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";

import useGetApiReq from "@/hooks/useGetApiReq";
import Wrapper from "@/components/wrappers/Wrapper";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";
import { cn } from "../../lib/utils";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const OfferDetail = () => {
  const { offerId } = useParams();
  const { fetchData, res, isLoading } = useGetApiReq();

  useEffect(() => {
    fetchData(`/offers/get-offer-details/${offerId}`);
  }, [offerId]);

  const offer = res?.data?.data;

  console.log("res?.data?.data", res?.data?.data);
  

  if (isLoading) {
    return (
      <Wrapper>
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-40 w-full" />
      </Wrapper>
    );
  }

  if (!offer) {
    return (
      <Wrapper>
        <div className="py-12 text-center text-slate-500 font-medium">
          Offer not found
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* ---------------- Header ---------------- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <BackLink href={-1}>
            <H2>{offer.name}</H2>
          <p className="text-sm text-muted-foreground">{offer.code}</p>
          </BackLink>
        </div>

        <div className="flex gap-3">
          <Badge
            className={cn(
              "px-5",
              offer.isActive ? "bg-green-600" : "bg-gray-400",
            )}
          >
            {offer.isActive ? "Active" : "Inactive"}
          </Badge>

          <Button asChild variant="outline">
            <Link to={`/admin/offers/${offer._id}/update`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* ---------------- Grid ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validity */}
        <InfoCard title="Validity">
          <Detail
            label="Valid From"
            value={format(new Date(offer.validFrom), "dd MMM yyyy")}
          />
          <Detail
            label="Valid To"
            value={format(new Date(offer.validTo), "dd MMM yyyy")}
          />
        </InfoCard>

        {/* Discount */}
        <InfoCard title="Discount">
          <Detail label="Type" value={offer.type} />
          <Detail
            label="Discount Value"
            value={
              offer.type === "FLAT"
                ? `₹${offer.discountValue}`
                : `${offer.discountValue}%`
            }
          />
          <Detail label="Max Discount" value={offer.maxDiscountAmount || "-"} />
          <Detail label="Min Order Value" value={offer.minOrderValue || "-"} />
        </InfoCard>

        {/* Usage */}
        <InfoCard title="Usage">
          <Detail label="Used Count" value={offer.usesCount} />
          <Detail label="Max Uses Per User" value={offer.maxUsesPerUser} />
          <Detail label="Max Uses" value={offer.maxUses} />
          <Detail label="Priority" value={offer.priority} />
        </InfoCard>

        {/* Cities */}
        <InfoCard title="Applicable Cities">
          {offer.applicableCities.length === 0 ? (
            <Empty />
          ) : (
            offer.applicableCities.map((city) => (
              <div key={city._id} className="flex justify-between text-sm">
                <span>{city.cityId?.name}</span>
                <Badge variant={city.isActive ? "default" : "secondary"}>
                  {city.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))
          )}
        </InfoCard>
      </div>

      {/* ---------------- Applicability ---------------- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ListCard title="Services" items={offer.applicableTo.services} />

        <ListCard title="Products" items={offer.applicableTo.products} />

        <ListCard title="Packages" items={offer.applicableTo.packages} />
      </div>

      {/* ---------------- Type Specific ---------------- */}
      <div className="mt-6 grid grid-cols-2 gap-5">
        <InfoCard title="Offer Configuration">
          {offer.type === "FLAT" && (
            <Detail label="Currency" value={offer.flat.currency} />
          )}

          {offer.type === "PERCENTAGE" && (
            <Detail
              label="Max Discount Amount"
              value={offer.percentage?.maxDiscountAmount || "-"}
            />
          )}

          {offer.type === "COMBO" && (
            <>
              <Detail label="Buy Quantity" value={offer.combo.buyQuantity} />
              <Detail label="Get Quantity" value={offer.combo.getQuantity} />
              <Detail label="Discount On" value={offer.combo.discountOn} />
            </>
          )}
        </InfoCard>
        <InfoCard title="Applicable User Types">
          
              <Detail label="Applicable User Types" value={offer.applicableUserTypes} />
              
        </InfoCard>
      </div>
    </Wrapper>
  );
};

export default OfferDetail;

/* ---------------- Reusable Components ---------------- */

const InfoCard = ({ title, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">{children}</CardContent>
  </Card>
);

const Detail = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ListCard = ({ title, items }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {items.length === 0 ? (
        <Empty />
      ) : (
        items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>{item.name}</span>
            {"price" in item && <span>₹{item.price}</span>}
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

const Empty = () => <p className="text-sm text-muted-foreground">No data</p>;
