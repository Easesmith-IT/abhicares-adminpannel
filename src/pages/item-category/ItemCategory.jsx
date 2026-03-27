"use client";

import DataNotFound from "@/components/shared/DataNotFound";
import { PaginationComp } from "@/components/shared/PaginationComp";
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
import { toast } from "sonner";

const dummyCategories = [
  {
    _id: "65f1a1b2c3d4e5f601",
    name: "Medicine",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos, aspernatur quasi, dolorem excepturi saepe alias autem veritatis qui consectetur reprehenderit odio rem deleniti veniam ab assumenda, provident dolorum nemo aliquam!",
    isActive: true,
    createdAt: "2024-01-10T10:30:00.000Z",
    createdBy: "Admin",
  },
  {
    _id: "65f1a1b2c3d4e5f602",
    name: "Equipment",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos, aspernatur quasi, dolorem excepturi saepe alias autem veritatis qui consectetur reprehenderit odio rem deleniti veniam ab assumenda, provident dolorum nemo aliquam!",
    isActive: false,
    createdAt: "2024-01-12T14:15:00.000Z",
    createdBy: "Admin",
  },
  {
    _id: "65f1a1b2c3d4e5f603",
    name: "Surgical Items",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos, aspernatur quasi, dolorem excepturi saepe alias autem veritatis qui consectetur reprehenderit odio rem deleniti veniam ab assumenda, provident dolorum nemo aliquam!",
    isActive: true,
    createdAt: "2024-01-15T09:20:00.000Z",
  },
  {
    _id: "65f1a1b2c3d4e5f604",
    name: "Diagnostics",
    isActive: true,
    createdBy: "Admin",
    createdAt: "2024-01-18T16:45:00.000Z",
  },
  {
    _id: "65f1a1b2c3d4e5f605",
    name: "Personal Care",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos, aspernatur quasi, dolorem excepturi saepe alias autem veritatis qui consectetur reprehenderit odio rem deleniti veniam ab assumenda, provident dolorum nemo aliquam!",
    isActive: false,
    createdBy: "Admin",
    createdAt: "2024-01-20T11:10:00.000Z",
  },
];

const ItemCategories = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setpageCount] = useState(0);
  const [limit] = useState(10);
  const [categories, setCategories] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const handleModalOpen = () => setIsAddCategoryModalOpen((prev) => !prev);

  const query = buildQuery({
    page,
    limit,
    search,
  });

  const { fetchData, isLoading, error, res } = useGetApiReq();

  const getItemCategories = async (values) => {
    try {
      await fetchData(`/items/getAllCategories?${query}`, values, {
        screenName: "AddItemCategory",
      });

      // 👇 since your hook doesn't return response directly,
      // rely on success state or just navigate after call
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  useEffect(() => {
    getItemCategories()
  }, [])
  

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("get item category res", res);
      setCategories(res?.data?.data?.categories);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between">
          <H2>Item Categories</H2>
          <Button asChild variant="abhicares">
            <Link to={"/admin/item-categories/add"}>
              <PlusIcon />
              <span>Add Category</span>
            </Link>
          </Button>
        </div>
        <div className="lg:col-span-2 hidden">
          <label htmlFor="search" className="text-sm font-medium mb-1 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4  text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-lg bg-white"
            />
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
                <Category key={category?._id || index} category={category} />
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

        <PaginationComp
          page={page}
          pageCount={pageCount}
          setPage={setPage}
          className="mt-8 mb-5"
        />

        {isAddCategoryModalOpen && (
          <AddCategoryModal
            open={isAddCategoryModalOpen}
            onClose={handleModalOpen}
            refresh={() => {}}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default ItemCategories;
