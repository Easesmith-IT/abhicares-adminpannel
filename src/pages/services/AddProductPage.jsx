import { useNavigate, useParams } from "react-router-dom";
import usePostApiReq from "../../hooks/usePostApiReq";
import { H2 } from "../../components/shared/typography";
import ProductForm from "../../components/category/ProductForm";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { useEffect } from "react";

const AddProductPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { fetchData, res, isLoading } = usePostApiReq();

  const handleAdd = (formData) => {
    fetchData("/admin/create-product", formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      // toast.success("Product added successfully");
      navigate(-1);
    }
  }, [res]);

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
          submitLabel="Add Product"
        />
      </div>
    </Wrapper>
  );
};

export default AddProductPage;
