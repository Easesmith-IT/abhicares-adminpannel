import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import usePatchApiReq from "@/hooks/usePatchApiReq";
import Wrapper from "@/components/wrappers/Wrapper";
import ServiceForm from "../../components/category/ServiceForm";

const UpdateServicePage = () => {
  const { serviceId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const service = state?.service;

  const { fetchData, res, isLoading } = usePatchApiReq();

  const onSubmit = (values) => {
    console.log("values", values);

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));

    fetchData(`/admin/update-service/${serviceId}`, fd);
  };

  if (res?.status === 200 || res?.status === 201) {
    toast.success("Service updated");
    navigate(-1);
  }

  return (
    <Wrapper>
      <ServiceForm
        defaultValues={{
          name: service?.name || "",
          startingPrice: service?.startingPrice || "",
          description: service?.description || "",
          img: service?.imageUrl || "",
          appHomepage: service?.appHomepage ||"",
          webHomepage: service?.webHomepage|| "",
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Update Service"
      />
    </Wrapper>
  );
};

export default UpdateServicePage;
