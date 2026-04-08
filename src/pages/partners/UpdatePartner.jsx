import { useLocation, useNavigate } from "react-router-dom";
import SellerForm from "../../components/partner/SellerForm";
import usePostApiReq from "../../hooks/usePostApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { useEffect } from "react";

const UpdateSeller = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const seller = state?.seller;
  console.log("seller",seller);
  

  const { res,fetchData, isLoading } = usePatchApiReq();

  const handleUpdate = async (formData) => {
      await fetchData(`/sellers/update-seller/${seller._id}`, formData);

  };

  useEffect(() => {
      if (res?.status === 200 || res?.status === 201) {
        navigate("/admin/partners");
      }
    }, [res]);

  if (!seller) return <p>No seller data</p>;

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Update Seller</H2>
        </BackLink>
        <SellerForm
          initialData={seller}
          onSubmit={handleUpdate}
          isEdit
          isLoading={isLoading}
        />
      </div>
    </Wrapper>
  );
};

export default UpdateSeller;
