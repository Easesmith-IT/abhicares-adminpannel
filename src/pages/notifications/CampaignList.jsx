import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
import axios from "axios";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { EyeIcon, PencilIcon, PlusIcon, XCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MultiSelect from "../../components/shared/MultiSelect";
import { CityFilter, useCities } from "@/components/filters/city";
import { PaginationComp } from "../../components/shared/PaginationComp";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const DUMMY_CAMPAIGNS = [
  {
    id: "1",
    title: "Festive Offer Push",
    target_type: "customer",
    cities: ["Mumbai", "Delhi"],
    scheduled_at: "2026-03-25T10:00:00Z",
    status: "pending",
  },
  {
    id: "2",
    title: "Partner Onboarding Update",
    target_type: "partner",
    cities: ["Bangalore"],
    scheduled_at: null,
    status: "sent",
  },
  {
    id: "3",
    title: "Flash Sale Alert",
    target_type: "customer",
    cities: [],
    scheduled_at: "2026-03-20T18:30:00Z",
    status: "processing",
  },
  {
    id: "4",
    title: "System Maintenance Notice",
    target_type: "all",
    cities: ["Pune", "Hyderabad"],
    scheduled_at: "2026-03-22T02:00:00Z",
    status: "failed",
  },
  {
    id: "5",
    title: "New Feature Launch",
    target_type: "customer",
    cities: ["Nagpur"],
    scheduled_at: null,
    status: "pending",
  },
];

export default function CampaignList() {
  const navigate = useNavigate();

  const { res, isLoading, fetchData } = useGetApiReq();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const { cities } = useCities();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    userType: "",
    city: "",
    status: "",
  });

  const handleReset = () => {
    setFilters({
      userType: "",
      city: "",
      status: "",
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.userType && filters.userType !== "all") {
      queryParams.append("target_type", filters.userType);
    }

    if (selectedCity) {
      queryParams.append("city", selectedCity);
    }

    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status);
    }

    fetchData(`/notifications/get-notifications?${queryParams.toString()}`, {
      screenName: "CampaignList",
    });
  }, [filters, selectedCity]);

  /* 🔹 Sync response */
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);

      setCampaigns(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center">
          <H2>Campaigns</H2>

          <div className="flex flex-wrap gap-4 pt-4">
            {/* User Type */}
            <Select
              value={filters.userType}
              onValueChange={(value) =>
                setFilters({ ...filters, userType: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>

            {/* City */}
            {/* <Input
              placeholder="City"
              className="w-[180px]"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            /> */}

            <CityFilter
              cities={cities}
              value={selectedCity}
              onChange={setSelectedCity}
            />

            {/* Status */}
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />

            <Button
              variant="abhicares"
              onClick={() => navigate("/admin/notifications/create")}
            >
              <PlusIcon /> Create Campaign
            </Button>
          </div>
        </div>

        {/* 🔹 Table */}

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 border-b border-white/40">
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Cities</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && <CampaignListSkeleton rows={6} />}

              {!isLoading && campaigns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
              {campaigns.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.body}</TableCell>

                  <TableCell>{item.audience}</TableCell>

                  <TableCell>
                    <p className="w-40 whitespace-break-spaces">
                      {item.cities?.map((city) => city?.name)?.join(", ")}
                    </p>
                  </TableCell>

                  <TableCell>
                    {item.scheduled
                      ? new Date(item.scheduled).toLocaleString()
                      : "Immediate"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/admin/notifications/${item.id}`)
                        }
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>

                      {/* Edit (only if pending) */}
                      {/* {item.status === "pending" && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            navigate(`/admin/notifications/${item.id}/edit`)
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )} */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PaginationComp
          page={page}
          pageCount={totalPages}
          setPage={setPage}
          className="mt-8 mb-5"
        />
      </div>
    </Wrapper>
  );
}

/* 🔹 Status Badge */
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs capitalize font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export function CampaignListSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[180px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[180px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[140px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[160px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-md" />
          </TableCell>

         

          {/* <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell> */}
        </TableRow>
      ))}
    </>
  );
}
