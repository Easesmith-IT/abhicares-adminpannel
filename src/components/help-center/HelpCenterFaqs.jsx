import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import useGetApiReq from "../../hooks/useGetApiReq";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import DeleteModal from "../modals/DeleteModal";
import EditFaqModal from "../modals/EditFaqModal";

const FaqRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[240px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-4 w-[60px] ml-auto" />
    </TableCell>
  </TableRow>
);

const HelpCenterFaqs = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteFaq } = useDeleteApiReq();

  const [faqs, setFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getAllFaqs = () => fetchData("/admin/get-all-faq");

  useEffect(() => {
    getAllFaqs();
  }, []);

  console.log("faqs", faqs);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);
      setFaqs(res.data.data || []);
    }
  }, [res]);

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
    //   toast.success("FAQ deleted");
      getAllFaqs();
      setIsDeleteOpen(false);
    }
  }, [deleteRes]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-end">
        <Button variant="abhicares" onClick={() => setIsEditOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="table-container mt-5">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-200 border-b border-white/40">
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Skeleton */}
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <FaqRowSkeleton key={i} />
              ))}

            {/* Empty state */}
            {!isLoading && faqs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No FAQs found
                </TableCell>
              </TableRow>
            )}

            {/* Data */}
            {!isLoading &&
              faqs.map((faq) => (
                <TableRow key={faq._id}>
                  <TableCell className="font-medium">{faq.ques}</TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    <p className="w- whitespace-pre-wrap">{faq.ans}</p>
                  </TableCell>

                  <TableCell className="text-sm">
                    {format(new Date(faq.createdAt), "dd MMM yyyy")}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setSelectedFaq(faq);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => {
                          setSelectedFaq(faq._id);
                          setIsDeleteOpen(true);
                        }}
                        size="icon"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditFaqModal
          faq={selectedFaq}
          setIsModalOpen={setIsEditOpen}
          getAllFaqs={getAllFaqs}
        />
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <DeleteModal
          handleDelete={() => deleteFaq(`/admin/delete-faq/${selectedFaq}`)}
          setState={setIsDeleteOpen}
        />
      )}
    </div>
  );
};

export default HelpCenterFaqs;
