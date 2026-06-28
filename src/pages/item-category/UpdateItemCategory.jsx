"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { BackLink } from "@/components/shared/back-link";

import useGetApiReq from "@/hooks/useGetApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import { useNavigate, useParams } from "react-router-dom";
import { H2 } from "../../components/shared/typography";
import CategoryForm from "../../components/item-category/CategoryForm";
import Wrapper from "../../components/wrappers/Wrapper";

const EditCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // ✅ GET hook
  const { res, isLoading, fetchData } = useGetApiReq();

  // ✅ PATCH hook
  const {
    res: patchRes,
    isLoading: isUpdating,
    fetchData: updateCategory,
  } = usePatchApiReq();

  // 🔥 Fetch category data
  useEffect(() => {
    if (categoryId) {
      fetchData(`/items/category/${categoryId}`, {
        screenName: "EditCategory",
      });
    }
  }, [categoryId]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
    }
  }, [res]);

  const category = res?.data?.data?.category;

  // 🔥 Submit handler
  const handleSubmit = async (values) => {
    try {
      await updateCategory(`/items/update/${categoryId}`, values, {
        screenName: "EditCategory",
      });

      navigate("/admin/item-categories");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  if (!category) return <p className="p-6">Category not found</p>;

  return (
    <Wrapper>

    <div className="space-y-6">
      <BackLink href="/admin/item-categories">
        <H2>Edit Category</H2>
      </BackLink>

      <CategoryForm
        defaultValues={category}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        submitLabel="Update"
        />
    </div>
        </Wrapper>
  );
};

export default EditCategoryPage;
