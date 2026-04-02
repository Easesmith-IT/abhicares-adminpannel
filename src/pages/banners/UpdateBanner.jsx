import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Wrapper from "@/components/wrappers/Wrapper";
import BannerForm from "@/components/banners/BannerForm";
import useGetApiReq from "@/hooks/useGetApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";

import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import usePatchApiReq from "../../hooks/usePatchApiReq";

const UpdateBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 GET banner
  const {
    res: getRes,
    fetchData: getBanner,
    isLoading: isFetching,
  } = useGetApiReq();

  // 🔹 UPDATE banner
  const {
    res: updateRes,
    fetchData: updateBanner,
    isLoading,
  } = usePatchApiReq();

  /* ---------------- FETCH BANNER ---------------- */
  useEffect(() => {
    if (id) {
      getBanner(`/banners/get-banner-by-id/${id}`);
    }
  }, [id]);

  /* ---------------- HANDLE UPDATE ---------------- */
  const handleUpdate = (formData) => {
    updateBanner(`/banners/update-banner/${id}`, formData);
  };

  /* ---------------- SUCCESS ---------------- */
  useEffect(() => {
    if (updateRes?.status === 200) {
      navigate(-1);
    }
  }, [updateRes]);

  const banner = getRes?.data?.data;

  const normalizedBanner = banner
    ? {
        ...banner,
        cityConfigs: banner.cityConfigs.map((c) => ({
          ...c,
          existingImage: c.image || [], // 🔥 CRITICAL FIX
        })),
      }
    : null;

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>Update Banner</H2>
        </BackLink>

        {/* Loading */}
        {isFetching && <p>Loading banner...</p>}

        {/* Form */}
        {!isFetching && banner && (
          <BannerForm
            initialData={normalizedBanner}
            onSubmit={handleUpdate}
            isEdit
            isLoading={isLoading}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default UpdateBanner;
