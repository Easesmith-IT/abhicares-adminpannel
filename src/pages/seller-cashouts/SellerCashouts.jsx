import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Eye, Search, RefreshCw, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const STATUS_BADGE_STYLE = {
  PENDING: "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200",
  APPROVED: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  REJECTED: "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
  Completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  cancelled: "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
};

const SellerCashouts = () => {
  const {
    res: getSellerCashoutsRes,
    fetchData: getSellerCashouts,
    isLoading,
  } = useGetApiReq();

  const navigate = useNavigate();

  const [allSellerCashouts, setAllSellerCashouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
    });
    setSearchQuery("");
  };

  const getAllSellerCashouts = useCallback(async () => {
    getSellerCashouts(
      `/admin/get-seller-cashout?cashoutId=${searchQuery}&page=${page}&startDate=${filters.startDate}&endDate=${filters.endDate}&status=${filters.status}`,
    );
  }, [getSellerCashouts, searchQuery, page, filters.startDate, filters.endDate, filters.status]);

  useEffect(() => {
    getAllSellerCashouts();
  }, [getAllSellerCashouts]);

  useEffect(() => {
    if (
      getSellerCashoutsRes?.status === 200 ||
      getSellerCashoutsRes?.status === 201
    ) {
      const data = getSellerCashoutsRes?.data?.data || [];
      const pageCountVal = getSellerCashoutsRes?.data?.pageCount || 1;
      const currentPage = getSellerCashoutsRes?.data?.currentPage || 1;
      setTimeout(() => {
        setAllSellerCashouts(data);
        setPageCount(pageCountVal);
        setPage(currentPage);
      }, 0);
    }
  }, [getSellerCashoutsRes]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getAllSellerCashouts();
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Partner Payouts</H2>
            <p className="text-xs text-slate-500 mt-1">Review cashout requests, approve settlements, and audit transaction records.</p>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cashout ID..."
                className="pr-10 bg-slate-50/50 border-slate-200"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={getAllSellerCashouts}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-900"
              >
                <Search className="size-4" />
              </Button>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value }))
                }
                className="w-[140px] bg-slate-50/50 border-slate-200 text-xs"
              />
              <span className="text-slate-400 text-xs">-</span>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value }))
                }
                className="w-[140px] bg-slate-50/50 border-slate-200 text-xs"
              />
            </div>

            {/* Status Select */}
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((p) => ({ ...p, status: value }))
              }
            >
              <SelectTrigger className="w-[150px] bg-slate-50/50 border-slate-200 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
              <RefreshCw className="mr-1 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        {/* Payouts Table Card */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">Cashout ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Request Date</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Payout Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Amount Requested</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Details</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6"><Skeleton className="h-4 w-[160px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[110px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                        <TableCell className="text-right pr-6"><Skeleton className="h-4 w-[70px] ml-auto" /></TableCell>
                        <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))}

                  {!isLoading && allSellerCashouts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                        No cashout requests match these filters.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    allSellerCashouts.map((cashout) => (
                      <TableRow key={cashout._id} className="hover:bg-slate-50/40">
                        <TableCell className="font-mono text-xs text-slate-500 pl-6">
                          {cashout.cashoutId}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {cashout.createdAt &&
                            format(new Date(cashout.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize shadow-none ${STATUS_BADGE_STYLE[cashout.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}
                          >
                            {cashout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-extrabold text-slate-950 text-right pr-6">
                          ₹{(cashout.value || 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right pr-6 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                            onClick={() =>
                              navigate(`/admin/seller-cashouts/${cashout._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

export default SellerCashouts;
