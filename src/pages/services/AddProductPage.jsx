import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import usePostApiReq from "../../hooks/usePostApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import ProductForm from "../../components/category/ProductForm";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const AddProductPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { fetchData, res, isLoading } = usePostApiReq();

  const handleAdd = (formData) => {
    fetchData("/products/create-product", formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      navigate(-1);
    }
  }, [res, navigate]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Add Product</H2>
        </BackLink>

        <ProductForm
          serviceId={serviceId}
          onSubmit={handleAdd}
          isLoading={isLoading}
          label="Add Product"
        />
      </div>
    </Wrapper>
  );
};

export default AddProductPage;
