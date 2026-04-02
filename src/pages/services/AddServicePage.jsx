import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import usePostApiReq from "@/hooks/usePostApiReq";
import Wrapper from "@/components/wrappers/Wrapper";
import ServiceForm from "../../components/category/ServiceForm";

const AddServicePage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { fetchData, res, isLoading } = usePostApiReq();

  const onSubmit = (values) => {

    console.log("values", values);
    
    const fd = new FormData();

    // ✅ send only ACTIVE city configs
    const activeCityConfigs = values.cityConfigs
      .filter((c) => c.isActive)
      .map((c) => ({
        cityId: c.cityId,
        isActive: c.isActive,
        startingPrice: Number(c.startingPrice),
        appHomepage: c.appHomepage,
        webHomepage: c.webHomepage,
        isTrending: c.isTrending || false,
      }));

    fd.append("name", values.name);
    fd.append("description", values.description || "");
    fd.append("categoryId", categoryId);
    fd.append("cityConfigs", JSON.stringify(activeCityConfigs));

     if (values.img) {
       fd.append("serviceImage", values.img);
     }
     if (values.bannerFile) {
       fd.append("serviceBanner", values.bannerFile);
     }

    fetchData("/services/create-service", fd);
  };


  if (res?.status === 200 || res?.status === 201) {
    // toast.success("Service added");
    navigate(-1);
  }

  return (
    <Wrapper>
      <ServiceForm
        defaultValues={{
          name: "",
          description: "",
          img: null,
          cityConfigs: [],
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Add Service"
      />
    </Wrapper>
  );
};

export default AddServicePage;
