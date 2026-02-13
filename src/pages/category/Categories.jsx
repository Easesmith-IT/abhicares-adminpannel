import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { CityFilter, useCities } from "@/components/filters/city";
import { PlusIcon } from "lucide-react";
import { Category } from "../../components/category/Category";
import CategoryCardSkeleton from "../../components/category/CategoryCardSkeleton";
import AddCategoryModal from "../../components/modals/AddCategoryModal";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { H2 } from "../../components/shared/typography";
import { Button } from "../../components/ui/button";
import Wrapper from "../../components/wrappers/Wrapper";
import { buildQuery } from "../../utils/buildQuery";
import { PaginationComp } from "../../components/shared/PaginationComp";

const Categories = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();
  const [categories, setCategories] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const { cities } = useCities();

  const handleAddCategory = () => {
    navigate("/admin/categories/add-category");
  };

  const handleReset = () => {
    setSelectedCity("");
  };

  const getCategories = useCallback(() => {
    const query = buildQuery({ cityId: selectedCity,page });

    fetchData(`/categories/get-categories?${query}`);
  }, [selectedCity, fetchData,page]);

  useEffect(() => {
    getCategories();
  }, [selectedCity]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);
      
      setCategories(res.data.data || []);
      setPageCount(res?.data?.pagination?.totalPages || 0);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <div className="pb-6 flex justify-between gap-5 items-center">
          <H2>Categories</H2>

          <div className="flex gap-3">
            <CityFilter
              cities={cities}
              value={selectedCity}
              onChange={setSelectedCity}
            />
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />

            <Button onClick={handleAddCategory} variant="abhicares">
              <PlusIcon />
              Add Category
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No category found
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Category
                key={category._id}
                category={category}
                getCategories={getCategories}
              />
            ))}
          </div>
        )}

        <PaginationComp
          className="mt-5"
          page={page}
          pageCount={pageCount}
          setPage={setPage}
        />

        {isAddCategoryModalOpen && (
          <AddCategoryModal
            isOpen={isAddCategoryModalOpen}
            onClose={handleAddCategory}
            getCategories={getCategories}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default Categories;
