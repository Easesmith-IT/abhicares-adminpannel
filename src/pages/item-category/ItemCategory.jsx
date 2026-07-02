"use client";

import DataNotFound from "@/components/shared/DataNotFound";
import { PaginationComp } from "@/components/shared/PaginationComp";
import { PageSizeSelect } from "@/components/shared/PageSizeSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildQuery } from "../../utils/buildQuery";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";
import { Category } from "../../components/item-category/category";
import useGetApiReq from "../../hooks/useGetApiReq";

const ItemCategories = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setpageCount] = useState(0);
  const [limit, setLimit] = useState("10");
  const [categories, setCategories] = useState([]);
  const { fetchData, isLoading, res } = useGetApiReq();

  const getItemCategories = () => {
    const query = buildQuery({
      page,
      limit,
      search,
    });

    fetchData(`/items/getAllCategories?${query}`, {
      screenName: "AddItemCategory",
    });
  };

  useEffect(() => {
    getItemCategories();
  }, [page, limit, search]);
  

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setCategories(res?.data?.data?.categories);
      setpageCount(res?.data?.totalPages || 0);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <H2>Invoice Item Categories</H2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
            />
            <Button asChild variant="abhicares">
              <Link to={"/admin/invoice-item-categories/add"}>
                <PlusIcon />
                <span>Add Invoice Item Category</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {/* <TableHead>Created By</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category, index) => (
                <Category key={category?._id || index} category={category} getItemCategories={getItemCategories} />
              ))}

              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <Category.Skeleton key={index} />
                ))}
            </TableBody>
          </Table>
          {categories?.length === 0 && !isLoading && (
            <DataNotFound name="Categories" />
          )}
        </div>

        <div className="mt-8 mb-5 flex items-center justify-between gap-3">
          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default ItemCategories;
