import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Wrapper from "@/components/wrappers/Wrapper";
import BannerForm from "@/components/banners/BannerForm";
import usePostApiReq from "@/hooks/usePostApiReq";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { useEffect } from "react";

const CreateBanner = () => {
  const navigate = useNavigate();
  const { fetchData, res, isLoading } = usePostApiReq();

  const handleCreate = (formData) => {
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    // 🚀 Directly send FormData (already prepared in BannerForm)
    fetchData("/banners/create-banner", formData);
  };

  // ✅ Success handling (same as category)
  useEffect(() => {
    if (res?.status === 201) {
      navigate(-1);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Create Banner</H2>
        </BackLink>
        <BannerForm
          onSubmit={handleCreate}
          isLoading={isLoading}
          defaultValues={{
            type: "",
            slot: "",
            cityConfigs: [],
          }}
        />
      </div>
    </Wrapper>
  );
};

export default CreateBanner;
