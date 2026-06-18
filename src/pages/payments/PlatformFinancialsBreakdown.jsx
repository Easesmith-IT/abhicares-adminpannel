import React, { useEffect, useState } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CityFilter from "../../components/filters/city/CityFilter";
import useCities from "../../components/filters/city/useCities";
import {
  CategoryFilter,
  useCategories,
} from "../../components/filters/category";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { useCustomSidebar } from "@/components/layout/sidebarContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PlatformFinancialsBreakdown = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [filters, setFilters] = useState({
    from: "",
    to: "",
  });

  //   console.log("filters",filters);

  const { selectedCityId } = useCustomSidebar();
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(selectedCityId || "");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { cities } = useCities();
  //   console.log("categories", categories);

  useEffect(() => {
    setSelectedCity(selectedCityId || "");
  }, [selectedCityId]);

  const handleReset = () => {
    setSelectedCity(selectedCityId || "");
    setSelectedCategory("");
  };

  const handleFetch = () => {
    if (!filters.from || !filters.to) return;

    fetchData(
      `/admin/platform-financials/breakdown?from=${filters.from}&to=${filters.to}&cityId=${selectedCity || ""}&categoryId=${selectedCategory || ""}`,
    );
  };

  useEffect(() => {
    (selectedCity || selectedCategory) &&
      handleFetch(selectedCity, selectedCategory);
  }, [selectedCity, selectedCategory]);

  useEffect(() => {
    if (res?.status === 200) {
      console.log("platform-financials-res", res);

      setData(res?.data?.data);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <BackLink href={-1}>
          <H2>Platform Financials Breakdown</H2>
        </BackLink>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-5 items-center mt-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                From Date
              </label>
              <Input
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, from: e.target.value }))
                }
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                To Date
              </label>
              <Input
                type="date"
                value={filters.to}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, to: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFetch}>Apply</Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                City
              </label>
              <CityFilter
                cities={cities}
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <CategoryFilter
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div className="flex items-end">
              <TooltipIconButton
                tooltip="Reset Filters"
                onClick={handleReset}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 table-container">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200">
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Online</TableHead>
                <TableHead>Cash</TableHead>
                <TableHead>Refunded</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Convenience</TableHead>
                <TableHead>Earning</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && (!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    No breakdown data found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                data?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.dateKey}</TableCell>
                    <TableCell>₹{row.totalReceived}</TableCell>
                    <TableCell>₹{row.onlineReceived}</TableCell>
                    <TableCell>₹{row.cashReceived}</TableCell>
                    <TableCell>₹{row.totalRefunded}</TableCell>
                    <TableCell>₹{row.platformRevenue}</TableCell>
                    <TableCell>₹{row.platformCommission}</TableCell>
                    <TableCell>₹{row.platformConvenience}</TableCell>
                    <TableCell className="font-medium">
                      ₹{row.platformEarning}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {!isLoading && data && data.rows === 0 && (
          <p className="text-center mt-10 text-muted-foreground">
            No financial data found for selected range
          </p>
        )}
      </div>
    </Wrapper>
  );
};

export default PlatformFinancialsBreakdown;

/* Reusable Card */
const StatCard = ({ title, value }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">₹{value || 0}</p>
      </CardContent>
    </Card>
  );
};
