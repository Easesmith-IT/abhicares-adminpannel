import { EllipsisVerticalIcon, ImageOff, Pencil, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import AddCategoryModal from "../modals/AddCategoryModal";
import DeleteModal from "../modals/DeleteModal";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

export const Category = ({ category, getCategories }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
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
      handleDeleteToggle();
      getCategories();
    }
  }, [deleteRes]);

  return (
    <>
      <Card className="relative">
        <CardHeader>
          {category.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_APP_IMAGE_URL}/${category.imageUrl}`}
              alt={category.name}
              className="h-[200px] w-full rounded-t-xl object-cover"
            />
          ) : (
            <div className="h-[200px] flex justify-center items-center bg-gray-200 rounded-md w-full">
              <ImageOff className="size-10" />
            </div>
          )}
          <div className="mb-2 flex gap-2 justify-between">
            <h3
              onClick={() => navigate(`/admin/categories/${category._id}`)}
              className="text-lg font-semibold cursor-pointer hover:text-blue-500 hover:underline"
            >
              {category.name}
            </h3>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault(); // prevent menu auto-close issues
                    handleEditToggle();
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleDeleteToggle();
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TrashIcon className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground -mt-4">
          <Badge variant="secondary">{category.totalServices} Services</Badge>
          {/* <div className="flex justify-between">
            <span>Commission</span>
            <span className="font-medium text-black">
              {category.commission}%
            </span>
          </div>

          <div className="flex justify-between">
            <span>Convenience Fee</span>
            <span className="font-medium text-black">
              {category.convenience}%
            </span>
          </div> */}
        </CardContent>
      </Card>

      {isEditOpen && (
        <AddCategoryModal
          isOpen={isEditOpen}
          onClose={handleEditToggle}
          getCategories={getCategories}
          initialData={category}
        />
      )}

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
