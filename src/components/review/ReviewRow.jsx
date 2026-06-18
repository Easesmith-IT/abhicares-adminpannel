import { useEffect, useState } from "react";
import { Eye, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import DeleteModal from "../modals/DeleteModal";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ReviewDetailsModal from "../modals/ReviewDetailsModal";
import { Skeleton } from "../ui/skeleton";

export const ReviewRow = ({ review, fetchReviews }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { res: deleteReviewRes, fetchData: deleteReview } = useDeleteApiReq();

  const handleDelete = async () => {
    deleteReview(`/admin/delete-review?reviewId=${review?._id}`);
  };

  useEffect(() => {
    if (deleteReviewRes?.status === 200 || deleteReviewRes?.status === 201) {
      // toast.success("Review deleted successfully");
      fetchReviews();
      setIsDeleteModalOpen(false);
    }
  }, [deleteReviewRes]);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{review.title || "-"}</TableCell>

        <TableCell>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </TableCell>

        <TableCell>
          {review?.createdAt
            ? format(new Date(review.createdAt), "dd-MM-yyyy")
            : "-"}
        </TableCell>

        <TableCell className="truncate max-w-[300px]">
          {review.content || "-"}
        </TableCell>

        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            

            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsDetailsModalOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

          </div>
        </TableCell>
      </TableRow>

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteModalOpen}
        />
      )}

      {isDetailsModalOpen && (
        <ReviewDetailsModal
          setIsModalOpen={setIsDetailsModalOpen}
          review={review}
        />
      )}
    </>
  );
};

export const ReviewRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-full" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-16 ml-auto" />
    </TableCell>
  </TableRow>
);
