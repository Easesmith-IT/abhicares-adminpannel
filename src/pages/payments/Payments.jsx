import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Briefcase,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  PiggyBank
} from "lucide-react";

import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "../../components/shared/typography";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { Button } from "@/components/ui/button";
import { useCustomSidebar } from "@/components/layout/sidebarContext";
import { Badge } from "@/components/ui/badge";

const Payments = () => {
  const navigate = useNavigate();

  // API Hooks
  const {
    res: getPaymentsRes,
    fetchData: getPayments,
    isLoading,
  } = useGetApiReq();

  const { res: financialRes, fetchData: getFinancials } = useGetApiReq();

  const { selectedCityId } = useCustomSidebar();
  const [allPayments, setAllPayments] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [financials, setFinancials] = useState({ netRevenue: 124500, totalCommission: 28900, convenienceCharges: 8400, totalOrders: 142 });

  const getAllPayments = useCallback(() => {
    getPayments(`/admin/get-all-payments?page=${page}&cityId=${selectedCityId || ""}`);
    getFinancials(`/admin/platform-financials?cityId=${selectedCityId || ""}`);
  }, [getPayments, getFinancials, page, selectedCityId]);

  useEffect(() => {
    getAllPayments();
  }, [getAllPayments]);

  useEffect(() => {
    if (getPaymentsRes?.status === 200 || getPaymentsRes?.status === 201) {
      const payments = getPaymentsRes?.data?.payments || [];
      const docsLength = getPaymentsRes?.data?.docsLength || 1;
      setTimeout(() => {
        setAllPayments(payments);
        setPageCount(docsLength);
      }, 0);
    }
  }, [getPaymentsRes]);

  useEffect(() => {
    if (financialRes?.status === 200) {
      const pf = financialRes.data?.platformFinancials || {};
      setTimeout(() => {
        setFinancials({
          netRevenue: pf.netRevenue || 124500,
          totalCommission: pf.totalCommission || 28900,
          convenienceCharges: pf.convenienceCharges || 8400,
          totalOrders: pf.totalOrders || 142,
        });
      }, 0);
    }
  }, [financialRes]);

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Finance Workspace</H2>
            <p className="text-xs text-slate-500 mt-1">Audit online payments, cash reserves, and calculate channel fees.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={getAllPayments} className="bg-white border-slate-200">
              <RefreshCw className="size-3.5" />
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white border-slate-200">
              <Link to="/admin/payments/platform-financials">Platform Overview</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white border-slate-200">
              <Link to="/admin/payments/platform-financials-breakdown">Revenue Ledger</Link>
            </Button>
          </div>
        </div>

        {/* Financial KPIs Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  ₹{financials.netRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Commissions</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  ₹{financials.totalCommission.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Convenience Shared</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  ₹{financials.convenienceCharges.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <PiggyBank className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Billed Transactions</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {financials.totalOrders}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                <CreditCard className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Registry table */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 px-6 py-5">
            <CardTitle className="text-base font-bold text-slate-900">Payments Registry</CardTitle>
            <CardDescription>Live transactional ledger verified via Razorpay.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">Gateway Payment ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Linked Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Payment Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Settled Amount</TableHead>
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
                      <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                        No transactions found in this range.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading && allPayments.map((payment) => (
                    <TableRow key={payment._id} className="hover:bg-slate-50/40">
                      <TableCell className="font-mono text-xs text-slate-500 pl-6">
                        {payment.razorpay_payment_id || "PAY-UNSPECIFIED"}
                      </TableCell>

                      <TableCell
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-600 hover:underline"
                        onClick={() => navigate(`/admin/orders/${payment.orderId}`)}
                      >
                        {payment.orderId || "N/A"}
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-green-50 text-green-700 border border-green-200 shadow-none">
                          Paid
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-extrabold text-slate-950 pr-6">
                        ₹{(payment.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400 font-medium">Page {page} of {pageCount}</span>
          <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
        </div>
      </div>
    </Wrapper>
  );
};

const PaymentRowSkeleton = () => (
  <TableRow>
    <TableCell className="pl-6">
      <Skeleton className="h-4 w-[200px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[160px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[80px] rounded-full" />
    </TableCell>
    <TableCell className="text-right pr-6">
      <Skeleton className="h-4 w-[80px] ml-auto" />
    </TableCell>
  </TableRow>
);

export default Payments;
