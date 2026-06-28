import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, RefreshCw, Search } from "lucide-react";

import useGetApiReq from "../../hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import AvailableCitiesSkeleton from "../../components/city/AvailableCitiesSkeleton";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SingleCityRow from "../../components/city/City";
import { H2 } from "../../components/shared/typography";

const AvailableCities = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();

  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [searchVal, setSearchVal] = useState("");
  const [statusVal, setStatusVal] = useState("all");

  const fetchCities = useCallback(() => {
    fetchData(`/cities/getAllCities`);
  }, [fetchData]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      const data = res.data.data || [];
      setTimeout(() => {
        setCities(data);
      }, 0);
    }
  }, [res]);

  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchVal.toLowerCase());
    const matchesStatus =
      statusVal === "all"
        ? true
        : statusVal === "active"
        ? city.isActive
        : !city.isActive;
    return matchesSearch && matchesStatus;
  });

  const limitNumber = Number(limit);
  const calculatedPageCount = Math.ceil(filteredCities.length / limitNumber) || 1;
  const paginatedCities = filteredCities.slice((page - 1) * limitNumber, page * limitNumber);

  // Reset page if it exceeds bounds
  useEffect(() => {
    if (page > calculatedPageCount) {
      setPage(1);
    }
  }, [calculatedPageCount, page]);

  const handleReset = () => {
    setSearchVal("");
    setStatusVal("all");
    setPage(1);
  };

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <H2 className="text-2xl font-bold tracking-tight text-slate-900">Operational Cities</H2>
            <p className="text-xs text-slate-500 mt-1">Configure geo-fenced boundaries, base coordinate centers, and city status settings.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchCities} className="bg-white border-slate-200">
              <RefreshCw className="size-3.5" />
            </Button>
            <Button
              variant="abhicares"
              size="sm"
              onClick={() => navigate("/admin/available-cities/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <PlusIcon className="mr-1.5 size-4" />
              <span>Add City</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Input
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setPage(1);
                }}
                placeholder="Search city by name..."
                className="pr-10 bg-slate-50/50 border-slate-200 h-9"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-900 pointer-events-none"
              >
                <Search className="size-4" />
              </Button>
            </div>

            {/* Status Select */}
            <Select
              value={statusVal}
              onValueChange={(value) => {
                setStatusVal(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] bg-slate-50/50 border-slate-200 text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="bg-slate-50/50 border-slate-200"
            />

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-800 h-9">
              <RefreshCw className="mr-1 size-3.5" />
              <span>Reset Filters</span>
            </Button>
          </CardContent>
        </Card>

        {/* Cities Table Card */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200/60">
                    <TableHead className="font-semibold text-slate-700 h-11 pl-6">City Name</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Latitude Center</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Longitude Center</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Live Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11">Geofence (Polygon)</TableHead>
                    <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading && <AvailableCitiesSkeleton />}

                  {!isLoading && filteredCities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                        No operational cities found.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    paginatedCities.map((city) => (
                      <SingleCityRow
                        key={city._id}
                        city={city}
                        refetchCities={fetchCities}
                      />
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {calculatedPageCount}</span>
          <PaginationComp page={page} pageCount={calculatedPageCount} setPage={setPage} />
        </div>
      </div>
    </Wrapper>
  );
};

export default AvailableCities;
