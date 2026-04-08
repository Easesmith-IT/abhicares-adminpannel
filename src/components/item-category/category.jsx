import { customId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { Actions } from "../shared/actions";
import { ConfirmModal } from "../shared/confirm-modal";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { TableCell, TableRow } from "../ui/table";

export const Category = ({ category, getItemCategories }) => {
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(category?.isActive || false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);

  const onView = () => navigate(`/admin/item-categories/${category?._id}`);
  const onEdit = () =>
    navigate(`/admin/item-categories/${category?._id}/update`);

  const onDelete = () => {
    setIsAlertModalOpen(true);
  };

  const { res:deleteRes,fetchData: deleteCategory, isLoading: isDeleting } =
    useDeleteApiReq();

  const handleDeleteCategory = async () => {
    await deleteCategory(`/items/delete/${category?._id}`);
  };

  const {
    res,
    fetchData: patchCategoryStatus,
    isLoading: isTogglePending,
  } = usePatchApiReq();

  const toggleStatus = async () => {
    const prev = isActive;

    setIsActive(!prev);

    try {
      await patchCategoryStatus(`/items/toggle-status/${category?._id}`);
    } catch (err) {
      setIsActive(prev); // rollback on error
    }
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      getItemCategories();
    }
  }, [res]);

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      getItemCategories();
      setIsAlertModalOpen(false)
    }
  }, [deleteRes]);

  return (
    <>
      <TableRow>
        <TableCell>{customId(category?._id)}</TableCell>
        <TableCell>{category.name}</TableCell>
        <TableCell>
          <p className="w-80 whitespace-pre-wrap">
            {category.description || "NA"}
          </p>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <Badge variant={category.isActive ? "success" : "destructive"}>
              {isTogglePending ? (
                <Spinner />
              ) : category.isActive ? (
                "Active"
              ) : (
                "Inactive"
              )}
            </Badge>

            <Switch
              checked={isActive}
              onCheckedChange={toggleStatus}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
            />
          </div>
        </TableCell>
        <TableCell>
          {new Date(category.createdAt).toLocaleDateString()}
        </TableCell>
        {/* <TableCell>{category.createdBy || "NA"}</TableCell> */}

        <TableCell className="text-right">
          <Actions onView={onView} onDelete={onDelete} onEdit={onEdit} />
        </TableCell>
      </TableRow>

      {isAlertModalOpen && (
        <ConfirmModal
          header="Delete Category"
          description="Are you sure you want to delete this category?"
          isModalOpen={isAlertModalOpen}
          setIsModalOpen={setIsAlertModalOpen}
          disabled={isDeleting}
          onConfirm={handleDeleteCategory}
        />
      )}
    </>
  );
};

Category.Skeleton = function CategorySkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="w-full h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-5" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-5" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-full h-5" />
      </TableCell>
    </TableRow>
  );
};
