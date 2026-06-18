import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Eye, Pencil, PlusIcon, Trash2, Search, SlidersHorizontal, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

import AddSellerModal from "../../components/modals/AddSellerModal";
import DeleteModal from "../../components/modals/DeleteModal";
import UnapprovedSellerModal from "../../components/modals/UnapprovedSellerModal";
import PartnersTableSkeleton from "../../components/partner/PartnersTableSkeleton";
import Stats from "../../components/partner/Stats";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";
import { buildQuery } from "@/utils/buildQuery";
import CityFilter from "../../components/filters/city/CityFilter";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { useCustomSidebar } from "@/components/layout/sidebarContext";
import useDebounce from "../../hooks/useDebounce";

const STATUS_BADGE_VARIANT = {
  APPROVED: "success",
  "IN-REVIEW": "inprogress",
  HOLD: "secondary",
  REJECTED: "destructive",
};

const Partners = () => {
  const navigate = useNavigate();

  /* API hooks */
  const { res, fetchData, isLoading } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteSeller } = useDeleteApiReq();

  /* State */
  const { selectedCityId } = useCustomSidebar();
  const [sellers, setSellers] = useState([]);
  const [seller, setSeller] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(() => searchParams.get("status") || "");

  // Sync URL query changes to state
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    setTimeout(() => {
      if (urlStatus !== null) {
        setStatus(urlStatus);
      } else {
        setStatus("");
      }
    }, 0);
  }, [searchParams]);

  // Sync state changes back to URL query
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "";
    if (status !== urlStatus) {
      const nextParams = new URLSearchParams(searchParams);
      if (status) {
        nextParams.set("status", status);
      } else {
        nextParams.delete("status");
      }
      setSearchParams(nextParams);
    }
  }, [status, searchParams, setSearchParams]);

  const debouncedSearch = useDebounce(search, 300);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unapprovedOpen, setUnapprovedOpen] = useState(false);
  const [cityId, setCityId] = useState(selectedCityId || "");

  // Sync global city with local cityId
  useEffect(() => {
    setTimeout(() => {
      setCityId(selectedCityId || "");
    }, 0);
  }, [selectedCityId]);

  const handleCreate = () => {
    navigate("/admin/partners/create");
  };

  const handleReset = () => {
    setCityId("");
    setStatus("");
    setSearch("");
  };

  /* Fetch sellers */
  const fetchSellers = useCallback(() => {
    const query = buildQuery({
      page,
      limit: 10,
      search: debouncedSearch,
      status,
      cityId,
    });

    fetchData(`/sellers/get-all-seller?${query}`);
  }, [fetchData, page, debouncedSearch, status, cityId]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  useEffect(() => {
    setTimeout(() => {
      setPage(1);
    }, 0);
  }, [debouncedSearch, status]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      const sellersData = res.data.data || [];
      const pages = res.data.pagination?.totalPages || 1;
      setTimeout(() => {
        setSellers(sellersData);
        setTotalPages(pages);
      }, 0);
    }
  }, [res]);

  useEffect(() => {
    if (deleteRes?.status === 200) {
      setTimeout(() => {
        setDeleteOpen(false);
      }, 0);
      toast.success("Partner profile deleted successfully");
      fetchSellers();
    }
  }, [deleteRes, fetchSellers]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
          {/* Stats strip */}
          <Stats setAllSellers={setSellers} />

          {/* List Workspace Container */}
          <div className="space-y-4 mt-6">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <H2 className="text-2xl font-bold tracking-tight text-slate-900">Partner Directory</H2>
                <p className="text-xs text-slate-500 mt-1">Manage service providers, verify compliance details, and check credentials.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white border-slate-200" onClick={() => setUnapprovedOpen(true)}>
                  Pending Requests
                </Button>
                <Button asChild variant="outline" size="sm" className="bg-white border-slate-200">
                  <Link to={`/admin/partners/metrics`}>Performance Metrics</Link>
                </Button>
                <Button
                  variant="abhicares"
                  size="sm"
                  onClick={handleCreate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <PlusIcon className="mr-1.5 size-4" />
                  <span>Add Partner</span>
                </Button>
              </div>
            </div>

            {/* Filter Strip */}
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
              <CardContent className="p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, ID, phone..."
                    className="pl-10 bg-slate-50/50 border-slate-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px] bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_statuses">All Statuses</SelectItem>
                    <SelectItem value="IN-REVIEW">In Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="HOLD">Hold</SelectItem>
                  </SelectContent>
                </Select>

                <CityFilter value={cityId} onChange={setCityId} className="w-[160px] bg-slate-50/50 border-slate-200" />

                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
                  <RefreshCw className="mr-1 size-3.5" />
                  <span>Reset Filters</span>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Table Card */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200/60">
                        <TableHead className="font-semibold text-slate-700 h-11">Partner Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">Partner ID</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">Core Category</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">Phone Number</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">City</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">Coverage Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11">Compliance</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-11 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {isLoading ? (
                        <PartnersTableSkeleton />
                      ) : sellers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-12 text-slate-400 font-medium"
                          >
                            No matching partners found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sellers.map((s) => (
                          <TableRow key={s._id} className="hover:bg-slate-50/40">
                            <TableCell className="font-bold text-slate-900">{s.name}</TableCell>
                            <TableCell className="font-mono text-xs text-slate-500">{s.partnerId || "-"}</TableCell>
                            <TableCell>{s.categoryId?.name || "-"}</TableCell>
                            <TableCell className="font-mono text-xs">{s.phone}</TableCell>
                            <TableCell className="capitalize">{s?.city?.cityId?.name || s?.city?.cityName || "-"}</TableCell>
                            <TableCell>
                              <Badge className={
                                s.online
                                  ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200"
                              }>
                                {s.online ? "Online" : "Offline"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={STATUS_BADGE_VARIANT[s.status] || "default"}>
                                {s.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right flex items-center justify-end gap-1.5 py-3">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                                onClick={() => navigate(`/admin/partners/${s._id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                                onClick={() => {
                                  navigate(`/admin/partners/${s._id}/update`, {
                                    state: { seller: s },
                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                onClick={() => {
                                  setSeller(s._id);
                                  setDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400 font-medium">Page {page} of {totalPages}</span>
              <PaginationComp page={page} pageCount={totalPages} setPage={setPage} />
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Modals */}
      {unapprovedOpen && (
        <UnapprovedSellerModal
          isOpen={unapprovedOpen}
          onClose={() => setUnapprovedOpen(false)}
        />
      )}

      {deleteOpen && (
        <DeleteModal
          handleDelete={() => deleteSeller(`/admin/delete-seller/${seller}`)}
          setState={setDeleteOpen}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Partners;
