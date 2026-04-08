// pages/CreateSeller.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerForm from "../../components/partner/SellerForm";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import usePostApiReq from "../../hooks/usePostApiReq";
import Wrapper from "../../components/wrappers/Wrapper";

const CreateSeller = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = usePostApiReq();

  const handleCreate = async (formData) => {
    fetchData("/sellers/create-seller", formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      // toast.success("User created successfully");
      navigate("/admin/partners");
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Create Seller</H2>
        </BackLink>
        <SellerForm onSubmit={handleCreate} isLoading={isLoading} />
      </div>
    </Wrapper>
  );
};

export default CreateSeller;
