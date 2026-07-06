import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Category } from "./Category";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { H2 } from "../../shared/typography";

const Categories = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const selectedAddress = useSelector(
    (state) => state.createOrderDraft.selectedAddress,
  );
  const cityId = useSelector((state) => state.createOrderDraft.cityId);

  useEffect(() => {
    if (cityId) {
      fetchData(`/categories/app/get-categories?cityId=${cityId}`);
    }
  }, [cityId, fetchData]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setCategories(res.data.categories || []);
    }
  }, [res]);

  if (!selectedAddress?._id) {
    return (
      <Navigate
        to={`/admin/customers/${params.customerId}/create-order`}
        replace
      />
    );
  }

  return (
    <div className="w-full space-y-6 font-poppins">
      <div className="space-y-2">
        <H2>Categories</H2>
        <p className="text-sm text-slate-600">
          You can add products and packages from multiple categories and
          services before confirming this order.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No categories found
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Category
              key={category?._id || category?.id || `${category?.name || "category"}-${index}`}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
