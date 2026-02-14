import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import PackageForm from "../../components/category/PackageForm";

const UpdatePackagePage = () => {
  const { serviceId, packageId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { fetchData, res, isLoading } = usePatchApiReq();

  const handleUpdate = (fd) => {
    fetchData(`/packages/update-package/${packageId}`, fd);
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
          <H2>Update Package</H2>
        </BackLink>

        <PackageForm
          defaultValues={state.package}
          serviceId={serviceId}
          allProducts={state.products || []}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          label="Update Package"
        />
      </div>
    </Wrapper>
  );
};

export default UpdatePackagePage;
