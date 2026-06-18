import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import { Skeleton } from "../ui/skeleton";
import DeleteModal from "./DeleteModal";
import { Trash2Icon } from "lucide-react";
import { PaginationComp } from "../shared/PaginationComp";

const UnapprovedSellerModal = ({
  setIsUnapprovedSellerModalOpen,
  getSellers,
}) => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const { res: approveRes, fetchData: approveSeller } = usePatchApiReq();
  const { res: deleteRes, fetchData: deleteSeller } = usePostApiReq();

  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sellerId, setSellerId] = useState("");

  const fetchInReview = () => {
    fetchData(`/admin/in-review-seller?page=${page}`);
  };

  useEffect(() => {
    fetchInReview();
  }, [page]);

  useEffect(() => {
    if (res?.status === 200) {
      setSellers(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);
    }
  }, [res]);

  /* Approve */
  const handleApprove = (id) => {
    approveSeller(`/admin/update-seller-status/${id}`, {
      status: "APPROVED",
    });
  };

  useEffect(() => {
    if (approveRes?.status === 200) {
      // toast.success("Partner approved");
      fetchInReview();
      getSellers();
    }
  }, [approveRes]);

  /* Delete */
  const handleDelete = () => {
    deleteSeller(`/admin/delete-seller/${sellerId}`);
  };

  useEffect(() => {
    if (deleteRes?.status === 200) {
      // toast.success("Partner deleted");
      setDeleteOpen(false);
      fetchInReview();
      getSellers();
    }
  }, [deleteRes]);

  return (
    <>
      <Dialog open onOpenChange={() => setIsUnapprovedSellerModalOpen(false)}>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Unapproved Partners</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : sellers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No unapproved partners found
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 border-b border-white/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sellers.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>
                        <div className="whitespace-pre-wrap w-100">
                          {s.services?.length > 0? s.services.map((x) => x.name).join(", "):"-"}
                        </div>
                      </TableCell>
                      <TableCell>{s.category || "-"}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">IN-REVIEW</Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-3">
                        <Button size="sm" onClick={() => handleApprove(s._id)}>
                          Approve
                        </Button>
                        <Trash2Icon
                          className="cursor-pointer text-red-500"
                          onClick={() => {
                            setSellerId(s._id);
                            setDeleteOpen(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <PaginationComp
                page={page}
                pageCount={totalPages}
                setPage={setPage}
                className="mt-8 mb-5"
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {deleteOpen && (
        <DeleteModal
          isOpen={deleteOpen}
          setState={setDeleteOpen}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default UnapprovedSellerModal;

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell className="flex justify-end gap-3">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="mt-6 flex justify-center gap-4">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </>
  );
};
