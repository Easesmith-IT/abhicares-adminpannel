import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "../../components/ui/label";

const CashoutRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-36" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-6 w-6 ml-auto" />
    </TableCell>
  </TableRow>
);

const SellerCashouts = () => {
  const {
    res: getSellerCashoutsRes,
    fetchData: getSellerCashouts,
    isLoading,
  } = useGetApiReq();

  const [allSellerCashouts, setAllSellerCashouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const navigate = useNavigate();

  const handlePageClick = (page) => setPage(page);

  const getAllSellerCashouts = async () => {
    getSellerCashouts(
      `/admin/get-seller-cashout?cashoutId=${searchQuery}&page=${page}&startDate=${filters.startDate}&endDate=${filters.endDate}&status=${filters.status}`,
    );
  };

  useEffect(() => {
    getAllSellerCashouts();
  }, [searchQuery, page, filters.startDate, filters.endDate, filters.status]);

  useEffect(() => {
    if (
      getSellerCashoutsRes?.status === 200 ||
      getSellerCashoutsRes?.status === 201
    ) {
      setAllSellerCashouts(getSellerCashoutsRes?.data?.data || []);
      setPageCount(getSellerCashoutsRes?.data?.pageCount || 1);
      setPage(getSellerCashoutsRes?.data?.currentPage || 1);
    }
  }, [getSellerCashoutsRes]);

  return (
    <Wrapper>
      <div className="m-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <H2>Seller Cashouts</H2>

          <div className="flex gap-3 items-end">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>

              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((p) => ({ ...p, status: value }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="search"
              placeholder="Search Cashout ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]!"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashout ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <CashoutRowSkeleton key={i} />
                ))}

              {!isLoading && allSellerCashouts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No Seller Cashouts found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                allSellerCashouts.map((cashout) => (
                  <TableRow key={cashout._id}>
                    <TableCell className="font-medium">
                      {cashout.cashoutId}
                    </TableCell>
                    <TableCell>₹{cashout.value}</TableCell>
                    <TableCell>
                      {cashout.createdAt &&
                        format(new Date(cashout.createdAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cashout.status === "Completed" ||
                          cashout.status === "completed"
                            ? "success"
                            : cashout.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {cashout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
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

export default SellerCashouts;
