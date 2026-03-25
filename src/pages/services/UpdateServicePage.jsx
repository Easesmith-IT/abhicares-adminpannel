import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import usePatchApiReq from "@/hooks/usePatchApiReq";
import Wrapper from "@/components/wrappers/Wrapper";
import ServiceForm from "../../components/category/ServiceForm";

const UpdateServicePage = () => {
  const { serviceId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log("state", state);


  const service = state?.service;

  const { fetchData, res, isLoading } = usePatchApiReq();

  const onSubmit = (values) => {
    const fd = new FormData();

    // ✅ keep only ACTIVE city configs
    const activeCityConfigs = values.cityConfigs
      .filter((c) => c.isActive)
      .map((c) => ({
        cityId: c.cityId,
        isActive: c.isActive,
        startingPrice: Number(c.startingPrice),
        appHomepage: c.appHomepage,
        webHomepage: c.webHomepage,
      }));

    fd.append("name", values.name);
    fd.append("description", values.description || "");
    fd.append("categoryId", service.categoryId);
    fd.append("cityConfigs", JSON.stringify(activeCityConfigs));

   
     if (values.img) {
       fd.append("serviceImage", values.img);
     }
     if (values.bannerFile) {
       fd.append("serviceBanner", values.bannerFile);
     }

    fetchData(`/services/update-service/${serviceId}`, fd);
  };

  if (res?.status === 200 || res?.status === 201) {
    navigate(-1);
  }

  return (
    <Wrapper>
      <ServiceForm
        defaultValues={{
          name: service?.name || "",
          description: service?.description || "",
          img: null, // IMPORTANT
          previewImage: service?.imageUrl || "",
          bannerPreview: service?.bannerUrl || "",
          cityConfigs: service?.cityConfigs || [],
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Update Service"
      />
    </Wrapper>
  );
};

export default UpdateServicePage;
