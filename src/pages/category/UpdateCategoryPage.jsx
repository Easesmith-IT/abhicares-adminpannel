import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Wrapper from "@/components/wrappers/Wrapper";
import CategoryForm from "@/components/category/CategoryForm";

import usePatchApiReq from "@/hooks/usePatchApiReq";
import useGetApiReq from "@/hooks/useGetApiReq";
import { Spinner } from "@/components/ui/spinner";
import CategoryFormSkeleton from "../../components/CategoryFormSkeleton";

const UpdateCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const {
    fetchData: fetchCategory,
    res: categoryRes,
    isLoading: isFetching,
  } = useGetApiReq();

  const {
    fetchData: updateCategory,
    res: updateRes,
    isLoading: isUpdating,
  } = usePatchApiReq();

  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    fetchCategory(`/categories/get-categories/${categoryId}`);
  }, [categoryId]);

  useEffect(() => {
    if (categoryRes?.status === 201 || categoryRes?.status === 200) {
      console.log("categoryRes", categoryRes);

      const category = categoryRes?.data?.data;

      setDefaultValues({
        name: category.name,
        cityConfigs: (category.cityConfigs || []).map((cfg) => ({
          cityId: cfg?.cityId?._id,
          cityName: cfg?.cityId?.name,
          isActive: cfg.isActive,
          commission: cfg.commission,
          convenience: cfg.convenience,
        })),
        previewImage: category.imageUrl,
      });
    }
  }, [categoryRes]);


  const onSubmit = (values) => {
    const activeConfigs = values.cityConfigs.filter((c) => c.isActive);

    const fd = new FormData();

    fd.append("name", values.name);
    fd.append("cityConfigs", JSON.stringify(activeConfigs));

    if (values.img) {
      fd.append("img", values.img);
    }

    updateCategory(`/categories/update-category/${categoryId}`, fd);
  };

  useEffect(() => {
    if (updateRes?.status === 200) {
      navigate(-1);
    }
  }, [updateRes]);

  if (isFetching || !defaultValues) {
    return <CategoryFormSkeleton />;
  }

  console.log("defaultValues", defaultValues);

  return (
    <Wrapper>
      <CategoryForm
        label="Update Category"
        isLoading={isUpdating}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </Wrapper>
  );
};

export default UpdateCategoryPage;
