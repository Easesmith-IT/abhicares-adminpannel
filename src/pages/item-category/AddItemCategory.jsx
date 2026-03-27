"use client";

import { BackLink } from "@/components/shared/back-link";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { H2 } from "../../components/shared/typography";
import usePostApiReq from "@/hooks/usePostApiReq"; // 👈 use your hook
import Wrapper from "../../components/wrappers/Wrapper";
import CategoryForm from "../../components/item-category/CategoryForm";
import { useEffect } from "react";

const AddItemCategory = () => {
  const navigate = useNavigate();

  const { fetchData, isLoading, error, res } = usePostApiReq();

  const handleSubmit = async (values) => {
    try {
      await fetchData("/items/create", values, {
        screenName: "AddItemCategory",
      });

      // 👇 since your hook doesn't return response directly,
      // rely on success state or just navigate after call
    } catch (error) {
      toast.error("Failed to create category");
    }
  };
  
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("add item category res", res);
      navigate("/admin/item-categories");
      }
    }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href="/admin/item-categories">
          <H2>Add Category</H2>
        </BackLink>

        <CategoryForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create"
        />
      </div>
    </Wrapper>
  );
};

export default AddItemCategory;
