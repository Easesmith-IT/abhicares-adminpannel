import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import useGetApiReq from "@/hooks/useGetApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { EyeIcon, PlusIcon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CityFilter, useCities } from "@/components/filters/city";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const STATUS_BADGE_STYLE = {
  pending: "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200",
  processing: "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
  sent: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
  failed: "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200",
};

export default function CampaignList() {
  const navigate = useNavigate();
  const { res, isLoading, fetchData } = useGetApiReq();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const { cities } = useCities();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    userType: "",
    status: "",
  });

  const handleReset = () => {
    setFilters({
      userType: "",
      status: "",
    });
    setSelectedCity("");
  };

  const getCampaigns = useCallback(() => {
    const queryParams = new URLSearchParams();

    if (filters.userType && filters.userType !== "all") {
      queryParams.append("target_type", filters.userType);
    }
    if (selectedCity) {
      queryParams.append("city", selectedCity);
    }
    if (page) {
      queryParams.append("page", page);
    }
    if (limit) {
      queryParams.append("limit", limit);
    }
    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status);
    }

    fetchData(`/notifications/get-notifications?${queryParams.toString()}`, {
      screenName: "CampaignList",
    });
  }, [fetchData, filters, selectedCity, page, limit]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      const data = res.data.data || [];
      const pages = res.data.pages || 1;
      setTimeout(() => {
        setCampaigns(data);
        setTotalPages(pages);
      }, 0);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications Campaign Manager</H2>
            <p className="text-xs text-slate-500 mt-1">Broadcast user campaigns, push alerts, and analyze engagement rates.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="abhicares"
              size="sm"
              onClick={() => navigate("/admin/notifications/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <PlusIcon className="mr-1.5 size-4" />
              <span>Create Campaign</span>
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            
            {/* User Type Select */}
            <Select
              value={filters.userType}
              onValueChange={(value) =>
                setFilters({ ...filters, userType: value })
              }
            >
              <SelectTrigger className="w-[160px] bg-slate-50/50 border-slate-200 text-xs">
                <SelectValue placeholder="All Audience Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                <SelectItem value="customer">Customers Only</SelectItem>
                <SelectItem value="partner">Partners Only</SelectItem>
              </SelectContent>
            </Select>

            {/* City Filter */}
            <CityFilter
              cities={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              className="w-[160px] bg-slate-50/50 border-slate-200"
            />

            {/* Status Select */}
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[160px] bg-slate-50/50 border-slate-200 text-xs">
                <SelectValue placeholder="All Campaign Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="bg-slate-50/50 border-slate-200 text-xs"
            />

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800">
              <RefreshCw className="mr-1 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        {/* Campaigns Table Card */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">Campaign Title</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Content Description</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Target Group</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Live Cities</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Schedule Date</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Details</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6"><Skeleton className="h-4 w-[160px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[110px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[85px] rounded-full" /></TableCell>
                        <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))}

                  {!isLoading && campaigns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        No notification campaigns created.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    campaigns.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/40">
                        <TableCell className="font-bold text-slate-900 pl-6">{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate text-slate-500">{item.body || "-"}</TableCell>
                        <TableCell className="capitalize">{item.audience || item.target_type || "All"}</TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {item.cities?.length ? item.cities.map((c) => c?.name || c).join(", ") : "All Cities"}
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs font-mono">
                          {item.scheduled ? format(new Date(item.scheduled), "dd MMM yyyy, hh:mm aa") : "Immediate"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize shadow-none ${STATUS_BADGE_STYLE[item.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}
                          >
                            {item.status || "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                              onClick={() => navigate(`/admin/notifications/${item.id || item._id}`)}
                            >
                              <EyeIcon className="h-4 w-4" />
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
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {totalPages}</span>
          <PaginationComp page={page} pageCount={totalPages} setPage={setPage} />
        </div>
      </div>
    </Wrapper>
  );
}
