import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { H2 } from "../../shared/typography";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../../../store/slices/cartSlice";
import { ProductCard } from "../ProductCard";
import useGetApiReq from "../../../hooks/useGetApiReq";
import ProductCardSkeleton from "../../ProductCardSkeleton";

const ProductsAndPackages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { res, fetchData, isLoading } = useGetApiReq();
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState(null);
  const params = useParams();
  const draft = useSelector((state) => state.createOrderDraft);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (draft.cityId) {
      fetchData(
        `/services/get-service-screen/${params?.serviceId}?cityId=${draft.cityId}`,
      );
    }
  }, [draft.cityId, fetchData, params?.serviceId]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setProducts(res.data.products || []);
      setPackages(res.data.packages || []);
    }
  }, [res]);

  const getQty = (id) => {
    const item = cart.find((entry) => entry._id === id);
    return item?.quantity || 0;
  };

  const handleAddItem = (item, type) => {
    dispatch(
      addToCart({
        ...item,
        type,
        customerId: params?.customerId,
        serviceId: params?.serviceId,
        serviceName: draft.selectedService?.name || "Selected Service",
        categoryId: draft.selectedCategory?.id || params?.categoryId,
        categoryName: draft.selectedCategory?.name || "Selected Category",
      }),
    );
    setRecentlyAddedItem(item.name);
  };

  if (!draft.selectedAddress?._id) {
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
        <H2>Products</H2>
        <p className="text-sm text-slate-600">
          Add items here, then return to categories or services to keep building
          one mixed cart for this customer.
        </p>
      </div>

      {recentlyAddedItem && (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold">{recentlyAddedItem}</span> was added
            to the draft cart.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/customers/${params?.customerId}/create-order/userAddresses/categories`,
                )
              }
              className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-900"
            >
              Add Another Service
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/customers/${params?.customerId}/create-order/checkout`,
                )
              }
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Review Cart
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No products found
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              quantity={getQty(item._id)}
              onAdd={(product) => handleAddItem(product, "Product")}
              onIncrease={(entry) => dispatch(increaseQty(entry._id))}
              onDecrease={(entry) => dispatch(decreaseQty(entry._id))}
            />
          ))}
        </div>
      )}

      <H2>Packages</H2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && packages.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No packages found
        </div>
      )}

      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {packages.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              quantity={getQty(item._id)}
              onAdd={(pkg) => handleAddItem(pkg, "Package")}
              onIncrease={(entry) => dispatch(increaseQty(entry._id))}
              onDecrease={(entry) => dispatch(decreaseQty(entry._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsAndPackages;
