import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useGetApiReq from "@/hooks/useGetApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import OfferForm from "@/components/offer/OfferForm";

import Wrapper from "@/components/wrappers/Wrapper";
import { BackLink } from "@/components/shared/back-link";
import { H2 } from "@/components/shared/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import OfferFormSkeleton from "../../components/offer/OfferFormSkeleton";
import { toCalendarDate } from "@/utils/dateTime";

const normalizeOfferForForm = (offer) => ({
  ...offer,

  applicableUserTypes:offer.applicableUserTypes?.[0],
  // ✅ Convert dates
  validFrom: toCalendarDate(offer.validFrom),
  validTo: toCalendarDate(offer.validTo),

  // ✅ Convert populated refs to IDs
  applicableTo: {
    services: offer.applicableTo?.services?.map((s) => s._id) || [],
    products: offer.applicableTo?.products?.map((p) => p._id) || [],
    packages: offer.applicableTo?.packages?.map((p) => p._id) || [],
  },

  // ✅ Convert city objects
  applicableCities:
    offer.applicableCities?.map((c) => ({
      cityId: c.cityId?._id,
      isActive: c.isActive ?? true,
    })) || [],
});


const UpdateOffer = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const { fetchData: getOffer, res } = useGetApiReq();
  const { res:updateOfferRes,fetchData: updateOffer, isLoading } = usePatchApiReq();

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    getOffer(`/offers/get-offer-details/${offerId}`);
  }, [offerId]);

  useEffect(() => {
    if (res?.status === 200) {
      setInitialValues(normalizeOfferForForm(res.data.data));
    }
  }, [res]);

  const handleUpdate = async (data) => {
    
    await updateOffer(`/offers/update-offer/${offerId}`, data);

  };

    useEffect(() => {
      if (updateOfferRes?.status === 200 || updateOfferRes?.status === 201) {
        navigate("/admin/offers");
      }
    }, [updateOfferRes]);

  if (!initialValues) {
    return (
      <Wrapper>
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />

          <OfferFormSkeleton />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Update Offer</H2>
        </BackLink>

        <Card>
          <CardContent>
            <OfferForm
              initialValues={initialValues}
              onSubmit={handleUpdate}
              isSubmitting={isLoading}
              submitLabel="Update Offer"
              onCancel={() => navigate(-1)}
            />
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
};

export default UpdateOffer;
