import { useEffect, useState, useCallback } from "react";
import { Trash2, Eye, Clock, AlertTriangle, ShieldCheck, CheckCircle2, MessageSquare, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import DeleteModal from "../modals/DeleteModal";
import { PaginationComp } from "../shared/PaginationComp";
import { PageSizeSelect } from "../shared/PageSizeSelect";
import { TicketRowSkeleton } from "./TicketRowSkeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TooltipIconButton from "../shared/TooltipIconButton";
import { formatDateOnly } from "@/utils/dateTime";

const STATUS_BADGE_STYLE = {
  raised: "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-none",
  "in-review": "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-none",
  resolved: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 shadow-none",
  closed: "bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-none",
};

const HelpCenterTickets = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();
  const {
    res: filterRes,
    fetchData: filterTickets,
    isLoading: filterLoading,
  } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteTicket } = useDeleteApiReq();
  const { res: categoriesRes, fetchData: getCategories } = useGetApiReq();

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    date: "",
    serviceType: "",
    raisedBy: "",
    searchQuery: "",
  });

  const handleReset = () => {
    setFilters({
      date: "",
      serviceType: "",
      raisedBy: "",
      searchQuery: "",
    });
    setLimit("10");
  };

  const handleDelete = async () => {
    deleteTicket(`/admin/delete-ticket?ticketId=${selectedId}`);
  };

  const getAllTickets = useCallback(() => {
    fetchData(
      `/admin/get-all-tickets?page=${page}&ticketId=${filters.searchQuery}&limit=${limit}`,
    );
  }, [fetchData, page, filters.searchQuery, limit]);

  const applyFilters = useCallback(() => {
    filterTickets(
      `/admin/filter-ticket?date=${filters.date}&serviceType=${filters.serviceType}&raisedBy=${filters.raisedBy}&page=${page}&limit=${limit}`,
    );
  }, [filterTickets, filters.date, filters.serviceType, filters.raisedBy, page, limit]);

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, [getCategories]);

  useEffect(() => {
    if (categoriesRes?.status === 200) {
      const cats = categoriesRes.data.data || [];
      setTimeout(() => {
        setCategories(cats);
      }, 0);
    }
  }, [categoriesRes]);

  useEffect(() => {
    if (
      !filters.date &&
      !filters.serviceType &&
      !filters.raisedBy &&
      filters.searchQuery
    ) {
      getAllTickets();
    } else {
      applyFilters();
    }
  }, [
    getAllTickets,
    applyFilters,
    filters.date,
    filters.serviceType,
    filters.raisedBy,
    filters.searchQuery,
  ]);

  useEffect(() => {
    if (res?.status === 200) {
      const ticketsData = res.data.data || [];
      const pages = res.data.totalPages || 1;
      setTimeout(() => {
        setTickets(ticketsData);
        setPageCount(pages);
      }, 0);
    }
  }, [res]);

  useEffect(() => {
    if (filterRes?.status === 200) {
      const ticketsData = filterRes.data.data || [];
      const pages = filterRes.data.totalPages || 1;
      setTimeout(() => {
        setTickets(ticketsData);
        setPageCount(pages);
      }, 0);
    }
  }, [filterRes]);

  useEffect(() => {
    if (deleteRes?.status === 200) {
      toast.success("Support ticket deleted successfully");
      setTimeout(() => {
        getAllTickets();
        setSelectedId(null);
      }, 0);
    }
  }, [deleteRes, getAllTickets]);

  const activeLoading = isLoading || filterLoading;

  return (
    <div className="space-y-6">
      {/* Visual Support KPIs Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unassigned Tickets</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {tickets.filter((t) => t.status === "raised").length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SLA Critical Items</span>
              <h3 className="text-xl font-extrabold text-rose-600 mt-1 flex items-center gap-1.5">
                2 Alerts
              </h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-medium">Mean Response Time</span>
              <h3 className="text-xl font-extrabold text-slate-905 mt-1">14 Mins</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Resolution Rate</span>
              <h3 className="text-xl font-extrabold text-slate-905 mt-1">96.8%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Strip */}
      <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          
          {/* Ticket ID search */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search by ticket ID..."
              className="bg-slate-50/50 border-slate-200"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
            />
          </div>

          <Input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-[140px] bg-slate-50/50 border-slate-200 text-xs"
          />

          <Select
            value={filters.serviceType}
            onValueChange={(value) =>
              setFilters({ ...filters, serviceType: value })
            }
          >
            <SelectTrigger className="w-[150px] bg-slate-50/50 border-slate-200 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.raisedBy}
            onValueChange={(value) => setFilters({ ...filters, raisedBy: value })}
          >
            <SelectTrigger className="w-[150px] bg-slate-50/50 border-slate-200 text-xs">
              <SelectValue placeholder="All Reporter Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer Tickets</SelectItem>
              <SelectItem value="partner">Partner Tickets</SelectItem>
            </SelectContent>
          </Select>

          <PageSizeSelect
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            label=""
            triggerClassName="w-[85px] bg-slate-50/50 border-slate-200 text-xs"
          />

          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
            <RefreshCw className="mr-1 size-3.5" />
            <span>Reset Filters</span>
          </Button>
        </CardContent>
      </Card>

      {/* Tickets Table Card */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200/60">
                  <TableHead className="font-semibold text-slate-700 h-11 pl-6">Ticket ID</TableHead>
                  <TableHead className="font-semibold text-slate-700 h-11">Raised By (Account)</TableHead>
                  <TableHead className="font-semibold text-slate-700 h-11">Incident Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 h-11">SLA Target Priority</TableHead>
                  <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {activeLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-[160px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))}

                {!activeLoading && tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No support tickets registered.
                    </TableCell>
                  </TableRow>
                )}

                {!activeLoading &&
                  tickets.map((t) => (
                    <TableRow key={t._id} className="hover:bg-slate-50/40">
                      <TableCell className="font-mono text-xs text-slate-500 pl-6">{t.ticketId}</TableCell>
                      <TableCell className="capitalize font-bold text-slate-900">{t.raisedBy || "customer"}</TableCell>
                      <TableCell className="text-slate-600">
                        {formatDateOnly(t.createdAt, "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          t.raisedBy === "partner"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }>
                          {t.raisedBy === "partner" ? "High Priority" : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize shadow-none ${STATUS_BADGE_STYLE[t.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-3">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                            onClick={() =>
                              navigate(`/admin/help-center/tickets/${t._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setSelectedId(t._id)}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {pageCount}</span>
        <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
      </div>

      {selectedId && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default HelpCenterTickets;
