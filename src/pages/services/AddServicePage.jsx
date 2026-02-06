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
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    fd.append("categoryId", categoryId);

    fetchData("/admin/create-service", fd);
  };

  if (res?.status === 200 || res?.status === 201) {
    toast.success("Service added");
    navigate(-1);
  }

  return (
    <Wrapper>
      <ServiceForm
        defaultValues={{
          name: "",
          startingPrice: "",
          description: "",
          img: "",
          appHomepage: false,
          webHomepage: false,
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Add Service"
      />
    </Wrapper>
  );
};

export default AddServicePage;
