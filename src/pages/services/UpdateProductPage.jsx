import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/category/ProductForm";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { useEffect } from "react";

const UpdateProductPage = () => {
  const { productId, serviceId } = useParams();
  const navigate = useNavigate();
  const {state} = useLocation();
  console.log("state", state);
  

  const { fetchData, res, isLoading } = usePatchApiReq();

  const handleUpdate = (formData) => {
    fetchData(`/admin/update-product/${productId}`, formData);
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
          <H2>Update Product</H2>
        </BackLink>

        <ProductForm
          defaultValues={state}
          serviceId={serviceId}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          submitLabel="Update Product"
        />
      </div>
    </Wrapper>
  );
};

export default UpdateProductPage;
