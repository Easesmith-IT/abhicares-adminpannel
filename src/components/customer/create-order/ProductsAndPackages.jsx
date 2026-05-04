import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { H2 } from "../../shared/typography";
import { addToCart, increaseQty, decreaseQty } from "../../../store/slices/cartSlice";
import { ProductCard } from "../ProductCard";
import useGetApiReq from "../../../hooks/useGetApiReq";
import ProductCardSkeleton from "../../ProductCardSkeleton";
import { useLocation, useParams } from "react-router-dom";

const dummyItems = [
  {
    _id: "1",
    name: "Hair Cut Basic",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    price: 199,
  },
  
];
const dummyItems1 = [
  {
    _id: "2",
    name: "Premium Facial Package",
    imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b",
    price: 999,
  },
  
];

const ProductsAndPackages = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const params = useParams();
  const { state } = useLocation();
  console.log("state", state);

  const getServiceScreen = ()=>{
    fetchData(
      `/services/get-service-screen/${params?.serviceId}?cityId=${state?.address?.cityBoundary}`,
    );
  }

  useEffect(() => {
    getServiceScreen();
  }, [state]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setProducts(res.data.products || []);
      setPackages(res.data.packages || []);
      console.log("res", res);
    }
  }, [res]);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const getQty = (id) => {
    const item = cart.find((i) => i._id === id);
    return item?.quantity || 0;
  };

  return (
    <div className="w-full font-poppins space-y-6">
      <H2>Products</H2>

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dummyItems.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            quantity={getQty(item._id)}
            onAdd={(item) => dispatch(addToCart(item))}
            onIncrease={(item) => dispatch(increaseQty(item._id))}
            onDecrease={(item) => dispatch(decreaseQty(item._id))}
          />
        ))}
      </div> */}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No products found
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              quantity={getQty(item._id)}
              onAdd={(item) =>
                dispatch(
                  addToCart({
                    ...item,
                    type: "Product",
                    serviceId: params?.serviceId,
                  }),
                )
              }
              onIncrease={(item) => dispatch(increaseQty(item._id))}
              onDecrease={(item) => dispatch(decreaseQty(item._id))}
            />
          ))}
        </div>
      )}

      <H2>Packages</H2>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && packages.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No packages found
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {packages.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              quantity={getQty(item._id)}
              onAdd={(item) =>
                dispatch(
                  addToCart({
                    ...item,
                    type: "Package",
                    serviceId: params?.serviceId,
                  }),
                )
              }
              onIncrease={(item) => dispatch(increaseQty(item._id))}
              onDecrease={(item) => dispatch(decreaseQty(item._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsAndPackages;
