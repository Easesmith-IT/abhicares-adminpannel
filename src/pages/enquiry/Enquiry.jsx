import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";

import Wrapper from "../../components/wrappers/Wrapper";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteModal from "../../components/modals/DeleteModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import { Button } from "../../components/ui/button";

const Enquiry = () => {
  const { res: deleteInquiryRes, fetchData: deleteInquiry } = useDeleteApiReq();

  const {
    res: getInquiriesRes,
    fetchData: getInquiries,
    isLoading,
  } = useGetApiReq();

  const {
    res: searchInquiriesRes,
    fetchData: searchInquiries,
    isLoading: searchInquiriesLoading,
  } = useGetApiReq();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [allInquiries, setAllInquiries] = useState([]);
  const [enquiryId, setEnquiryId] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const getAllInquiries = useCallback(() => {
    getInquiries(`/admin/get-all-enquiry?page=${page}`);
  }, [page]);

  useEffect(() => {
    getAllInquiries();
  }, [getAllInquiries]);

  useEffect(() => {
    if (getInquiriesRes?.status === 200 || getInquiriesRes?.status === 201) {
      setAllInquiries(getInquiriesRes.data.data);
      setPageCount(Number(getInquiriesRes.data.totalPage));
    }
  }, [getInquiriesRes]);

  useEffect(() => {
    if (
      searchInquiriesRes?.status === 200 ||
      searchInquiriesRes?.status === 201
    ) {
      setAllInquiries(searchInquiriesRes.data.data);
    }
  }, [searchInquiriesRes]);

  useEffect(() => {
    if (deleteInquiryRes?.status === 200 || deleteInquiryRes?.status === 201) {
      toast.success("Enquiry deleted successfully");
      setIsDeleteModalOpen(false);
      getAllInquiries();
    }
  }, [deleteInquiryRes]);

  const handleDeleteModal = (id) => {
    setEnquiryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    deleteInquiry(`/admin/delete-enquiry/${enquiryId}`);
  };

  const handlePageClick = (page) => setPage(page);

  /* debounce */
  const debounce = (delay) => {
    let timer;
    return (e) => {
      const value = e.target.value;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!value) {
          getAllInquiries();
        } else {
          searchInquiries(`/admin/search-enquiries?query=${value}`);
        }
      }, delay);
    };
  };

  const isTableLoading = isLoading || searchInquiriesLoading;

  return (
    <>
      <Wrapper>
        <div className="m-6">
          <div className="flex flex-row items-center justify-between">
            <H2>Enquiries</H2>

            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, phone, city"
                className="pl-10"
                onChange={debounce(1000)}
              />
            </div>
          </div>

          <div className="table-container mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead className="text-end">Delete</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isTableLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <EnquiryRowSkeleton key={i} />
                  ))}

                {!isLoading && allInquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No enquiries found
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && allInquiries.map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>{inquiry.name}</TableCell>
                    <TableCell>{inquiry.phone}</TableCell>
                    <TableCell>{inquiry.city}</TableCell>
                    <TableCell>{inquiry.state}</TableCell>
                    <TableCell>{inquiry.serviceType}</TableCell>
                    <TableCell className="text-end">
                      <Button
                        onClick={() => handleDeleteModal(inquiry._id)}
                        size="icon"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {isDeleteModalOpen && (
        <DeleteModal
          setState={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Enquiry;

const EnquiryRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-5 w-5 rounded-full mx-auto" />
      </TableCell>
    </TableRow>
  );
};
