import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Wrapper from "@/components/wrappers/Wrapper";
import CategoryForm from "@/components/category/CategoryForm";
import usePostApiReq from "@/hooks/usePostApiReq";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { fetchData, res, isLoading } = usePostApiReq();

  const onSubmit = (values) => {
    const activeConfigs = values.cityConfigs.filter((c) => c.isActive);

    fetchData("/categories/create-category", {
      name: values.name,
      cityConfigs: activeConfigs,
    });
  };

  if (res?.status === 201) {
    toast.success("Category created");
    navigate(-1);
  }

  return (
    <Wrapper>
      <CategoryForm
        label="Add Category"
        isLoading={isLoading}
        defaultValues={{ name: "", cityConfigs: [] }}
        onSubmit={onSubmit}
      />
    </Wrapper>
  );
};

export default AddCategoryPage;
