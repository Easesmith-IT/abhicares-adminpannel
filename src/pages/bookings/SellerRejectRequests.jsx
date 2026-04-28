import { useEffect, useState } from "react";
import useGetApiReq from "../../hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import RejectedBookingRequestTable from "../../components/rejected-requests/RejectedBookingRequestTable";

const RejectedBookingRequests = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");
  const [limit, setLimit] = useState("10");

  const getReqs = ()=>{
     fetchData(
      `/admin/seller-booking-reject-requests?page=${page}&limit=${limit}&status=${statusFilter}`,
    );
  }

  useEffect(() => {
   getReqs()
  }, [page, limit, statusFilter]);

  useEffect(() => {
    if (res?.status === 200) {
        console.log("res", res);
        
      setRequests(res?.data?.data || []);
      setPageCount(res?.data?.pagination?.totalPages || 1);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <BackLink href={-1}>
          <H2>Seller Reject Requests</H2>
        </BackLink>

        <div className="flex items-center gap-4 py-5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Request Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <RejectedBookingRequestTable
          requests={requests}
          isLoading={isLoading}
          getReqs={getReqs}
        />

        <PaginationComp
          page={page}
          pageCount={pageCount}
          setPage={setPage}
          className="mt-8 mb-5"
        />
      </div>
    </Wrapper>
  );
};

export default RejectedBookingRequests;
