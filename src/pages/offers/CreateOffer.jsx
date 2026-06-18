import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import usePostApiReq from "@/hooks/usePostApiReq";
import OfferForm from "@/components/offer/OfferForm";

import Wrapper from "@/components/wrappers/Wrapper";
import { BackLink } from "@/components/shared/back-link";
import { H2 } from "@/components/shared/typography";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const CreateOffer = () => {
  const navigate = useNavigate();
  const { res,fetchData, isLoading } = usePostApiReq();

  const handleCreate = async (data) => {
    console.log("data",data);
    
     await fetchData("/offers/create-offer", { ...data, applicableUserTypes: [data?.applicableUserTypes]});
  };
  
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
        navigate("/admin/offers");
      }
    }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Create Offer</H2>
        </BackLink>

        <Card>
          <CardContent>
            <OfferForm
              onSubmit={handleCreate}
              isSubmitting={isLoading}
              submitLabel="Create Offer"
              onCancel={() => navigate(-1)}
            />
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
};

export default CreateOffer;
