import { useEffect, useState } from "react";

import { Category } from "./Category";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { H2 } from "../../shared/typography";
import { useLocation } from "react-router-dom";

const dummyCategories = [
  {
    _id: "1",
    name: "Salon Services",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    price: 499,
    offerPrice: 299,
  },
  {
    _id: "2",
    name: "Home Cleaning",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    price: 999,
    offerPrice: 799,
  },
  {
    _id: "3",
    name: "AC Repair",
    imageUrl: "https://images.unsplash.com/photo-1581579185169-2e8c2a2b06f3",
    price: 1499,
    offerPrice: 1199,
  },
  {
    _id: "4",
    name: "Plumbing",
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7",
    price: 599,
    offerPrice: 499,
  },
  {
    _id: "5",
    name: "Electrician",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
    price: 699,
    offerPrice: 599,
  },
  {
    _id: "6",
    name: "Pest Control",
    imageUrl: "https://images.unsplash.com/photo-1598514982536-3c3c6b7c03d9",
    price: 1299,
    offerPrice: 999,
  },
  {
    _id: "7",
    name: "Car Wash",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    price: 399,
    offerPrice: 299,
  },
  {
    _id: "8",
    name: "Appliance Repair",
    imageUrl: "https://images.unsplash.com/photo-1581091012184-7c1b5a1c6f5d",
    price: 899,
    offerPrice: 749,
  },
];

const Categories = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [categories, setCategories] = useState([...dummyCategories]);
  const {state} = useLocation();

  const getCategories = ()=>{

      fetchData(`/categories/app/get-categories?cityId=${state?.address?.cityBoundary}`);
  }

  useEffect(() => {
    getCategories();
  }, [state]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setCategories(res.data.categories || []);
      
    }
  }, [res]);

  return (
      <div className="w-full font-poppins space-y-6">
        {/* Header */}
        <H2>Categories</H2>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categories.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No categories found
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Category key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
  );
};

export default Categories;
