import React, { useCallback, useEffect, useState } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useGetApiReq from "../../hooks/useGetApiReq";
import { PaginationComp } from "../../components/shared/PaginationComp";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import AppHomeBanner from "../../components/banner/AppHomeBanner";
import Announcement from "../../components/banner/announcement/Announcement";

const Banners = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [type, setType] = useState("");

  const handleReset = () => {
    setType("");
  };

  const getBanners = useCallback(() => {
    const query = new URLSearchParams({
      page,
      ...(type && { type }),
    }).toString();

    fetchData(`/banners/get-admin-banners?${query}`);
  }, [page, type, fetchData]);

  useEffect(() => {
    getBanners();
  }, [page, type]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setBanners(res.data.data || []);

      const total = res?.data?.total || 0;
      const limit = res?.data?.limit || 20;

      setPageCount(Math.ceil(total / limit));
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-5 justify-between items-center">
          <H2>Banners</H2>

          <div className="flex gap-3">
            <Select
              value={type}
              onValueChange={(val) => {
                setType(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME">Home</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="REFER">Refer</SelectItem>
              </SelectContent>
            </Select>
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />

            <Button asChild variant="abhicares">
              <Link to="/admin/banners/create">Create</Link>
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 h-40 animate-pulse bg-muted" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && banners.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No banners found
          </div>
        )}

        {/* Data */}
        {!isLoading && banners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <Card key={banner._id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{banner.type}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    ID: {banner._id}
                  </div>
                  <Button asChild>
                    <Link to={`/admin/banners/${banner._id}/update`}>Edit</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AppHomeBanner />
        <Announcement />
      </div>
    </Wrapper>
  );
};

export default Banners;
