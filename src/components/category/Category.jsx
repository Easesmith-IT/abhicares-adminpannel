import { EllipsisVerticalIcon, ImageOff, Pencil, TrashIcon, Percent, Wrench, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import DeleteModal from "../modals/DeleteModal";

export const Category = ({ category, getCategories }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const {
    res: deleteRes,
    fetchData: deleteCategory,
    isLoading: isDeleteLoading,
  } = useDeleteApiReq();

  const handleEditToggle = () => {
    navigate(`/admin/categories/${category?._id}/update-category`);
  };

  const handleDeleteToggle = () => {
    setIsDeleteOpen((prev) => !prev);
  };

  const handleDelete = () => {
    deleteCategory(`/admin/delete-category/${category._id}`);
  };

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      setTimeout(() => {
        handleDeleteToggle();
        getCategories();
      }, 0);
    }
  }, [deleteRes, getCategories]);

  return (
    <>
      <Card className="relative border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition duration-200 flex flex-col justify-between group">
        
        {/* Category Image Header */}
        <div className="relative h-[160px] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          {category.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_APP_IMAGE_URL}/${category.imageUrl}`}
              alt={category.name}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition duration-300"
            />
          ) : (
            <div className="h-full flex justify-center items-center text-slate-400">
              <ImageOff className="size-8 stroke-[1.5]" />
            </div>
          )}
          
          {/* Dropdown Menu on top right */}
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-sm text-slate-600 hover:bg-white">
                  <EllipsisVerticalIcon className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleEditToggle();
                  }}
                  className="flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Pencil className="size-3.5" />
                  Edit Catalog
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleDeleteToggle();
                  }}
                  className="flex items-center gap-2 cursor-pointer text-xs text-rose-600 hover:text-rose-700"
                >
                  <TrashIcon className="size-3.5" />
                  Delete Catalog
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Card Contents */}
        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3
              onClick={() => navigate(`/admin/categories/${category._id}`)}
              className="text-base font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition leading-snug"
            >
              {category.name}
            </h3>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase tracking-wider py-0.5 px-2">
                <Wrench className="size-3 mr-1" />
                {category.totalServices || 0} Services
              </Badge>
            </div>
          </div>

          <Separator className="border-slate-100" />

          {/* Commission & Convenience details */}
          <div className="space-y-2.5 text-xs text-slate-500">
            <div className="flex justify-between items-center">
              <span className="font-medium">Marketplace Commission</span>
              <span className="font-bold text-slate-900 flex items-center gap-0.5">
                {category.commission !== undefined ? category.commission : 15}%
                <Percent className="size-3 text-slate-400" />
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Convenience Surcharge</span>
              <span className="font-bold text-slate-900 flex items-center gap-0.5">
                {category.convenience !== undefined ? category.convenience : 5}%
                <Percent className="size-3 text-slate-400" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>



      {isDeleteOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteOpen}
          isLoading={isDeleteLoading}
        />
      )}
    </>
  );
};
