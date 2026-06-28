import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { PlusIcon, RefreshCw, LayoutGrid } from "lucide-react";
import { Category } from "../../components/category/Category";
import CategoryCardSkeleton from "../../components/category/CategoryCardSkeleton";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { H2 } from "../../components/shared/typography";
import { Button } from "../../components/ui/button";
import Wrapper from "../../components/wrappers/Wrapper";
import { buildQuery } from "../../utils/buildQuery";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import { useCustomSidebar } from "@/components/layout/sidebarContext";

const Categories = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();
  const [categories, setCategories] = useState([]);

  const { selectedCityId } = useCustomSidebar();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");

  const handleAddCategory = () => {
    navigate("/admin/categories/add-category");
  };

  const getCategories = useCallback(() => {
    const query = buildQuery({ cityId: selectedCityId, page, limit });
    fetchData(`/categories/get-categories?${query}`);
  }, [selectedCityId, fetchData, page, limit]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      const data = res.data.data || [];
      const totalPages = res?.data?.pagination?.totalPages || 1;
      setTimeout(() => {
        setCategories(data);
        setPageCount(totalPages);
      }, 0);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Marketplace Catalogues</H2>
            <p className="text-xs text-slate-500 mt-1">Configure service domains, baseline commissions, and category mappings.</p>
          </div>

          <div className="flex items-center gap-3">
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="bg-white border-slate-200"
            />
            <Button variant="outline" size="sm" onClick={getCategories} className="bg-white border-slate-200">
              <RefreshCw className="size-3.5" />
            </Button>
            <Button
              variant="abhicares"
              size="sm"
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <PlusIcon className="mr-1.5 size-4" />
              <span>Add Category</span>
            </Button>
          </div>
        </div>

        {/* Loading skeleton state */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <LayoutGrid className="size-10 stroke-[1.5] mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No marketplace categories registered</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Add a category to populate the services menu.</p>
            <Button size="sm" onClick={handleAddCategory} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs">
              Create New Category
            </Button>
          </div>
        )}

        {/* Category card grid */}
        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Category
                key={category._id}
                category={category}
                getCategories={getCategories}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {pageCount}</span>
          <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
        </div>
      </div>
    </Wrapper>
  );
};

export default Categories;
