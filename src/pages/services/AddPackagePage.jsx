import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import usePostApiReq from "../../hooks/usePostApiReq";
import PackageForm from "../../components/category/PackageForm";

const AddPackagePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
    const { state } = useLocation();

  const { fetchData, res, isLoading } = usePostApiReq();

  const handleAdd = (fd) => {
    fetchData("/packages/create-package", fd);
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
          <H2>Add Package</H2>
        </BackLink>

        <PackageForm
          serviceId={serviceId}
          allProducts={state?.products || []}
          onSubmit={handleAdd}
          isLoading={isLoading}
          label="Add Package"
        />
      </div>
    </Wrapper>
  );
};

export default AddPackagePage;
