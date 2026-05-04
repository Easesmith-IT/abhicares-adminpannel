import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "../../components/shared/typography";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { Button } from "../../components/ui/button";

const Payments = () => {
  const navigate = useNavigate();

  const {
    res: getPaymentsRes,
    fetchData: getPayments,
    isLoading,
  } = useGetApiReq();

  const [allPayments, setAllPayments] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const getAllPayments = () => {
    getPayments(`/admin/get-all-payments?page=${page}`);
  };

  useEffect(() => {
    getAllPayments();
  }, [page]);

  useEffect(() => {
    if (getPaymentsRes?.status === 200 || getPaymentsRes?.status === 201) {
      setAllPayments(getPaymentsRes?.data?.payments || []);
      setPageCount(getPaymentsRes?.data?.docsLength || 1);
    }
  }, [getPaymentsRes]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <div className="flex justify-between gap-5">
          <H2>Payments</H2>
          <div className="flex gap-5">
            <Button asChild variant="abhicares">
              <Link to="/admin/payments/platform-financials">
                Platform Financials
              </Link>
            </Button>
            <Button asChild variant="abhicares">
              <Link to="/admin/payments/platform-financials-breakdown">
                Platform Financials Breakdown
              </Link>
            </Button>
          </div>
        </div>

        {/* Table container */}
        <div className="mt-6 table-container">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 border-b border-white/40">
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <PaymentRowSkeleton key={i} />
                ))}

              {/* Empty State */}
              {!isLoading && allPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No payments available
                  </TableCell>
                </TableRow>
              )}

              {allPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-mono text-sm">
                    {payment.razorpay_payment_id || "-"}
                  </TableCell>

                  <TableCell
                    className="cursor-pointer text-primary hover:underline"
                    onClick={() => navigate(`/admin/orders/${payment.orderId}`)}
                  >
                    {payment.orderId}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    ₹{payment.amount.toFixed(2)}
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
  );
};

export default Payments;

const PaymentRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[220px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[180px]" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-4 w-[80px] ml-auto" />
    </TableCell>
  </TableRow>
);
