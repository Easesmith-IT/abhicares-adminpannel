import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Section } from "..";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, PlusIcon } from "lucide-react";
import AddCategoryIconModal from "../modals/AddCategoryIconModal";

export const CategoryInfo = () => {
  const params = useParams();

  const {
    fetchData: fetchCategory,
    res: categoryRes,
    isLoading,
  } = useGetApiReq();

  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [category, setCategory] = useState(null);

  const getCategoryDetails = ()=> {
    fetchCategory(`/categories/get-categories/${params.categoryId}`);
  }

  useEffect(() => {
    if (params?.categoryId) {
      getCategoryDetails()
    }
  }, [params?.categoryId]);

  useEffect(() => {
    if (categoryRes?.status === 200 || categoryRes?.status === 201) {
      setCategory(categoryRes?.data?.data || null);
    }
  }, [categoryRes]);

  /* ---------------- Skeleton State ---------------- */
  if (isLoading || !category) {
    return (
      <div className="space-y-4 mb-8">
        {/* Category Info Skeleton */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>

        {/* City Config Skeletons */}
        <Section title="City-wise Configuration">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>

                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  /* ---------------- Actual Data ---------------- */
  return (
    <div className="space-y-4 mb-8">
      <div className="space-y-2">
        <p>Category Info:</p>
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {category?.icon ? (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-16 w-16 rounded-md border p-0"
                        onClick={() => setIconModalOpen(true)}
                      >
                        <img
                          src={`${import.meta.env.VITE_APP_IMAGE_URL}/${category?.icon}`}
                          alt="icon"
                          className="h-full w-full rounded-md object-cover"
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => setIconModalOpen(true)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-16 w-16 border-dashed"
                      onClick={() => setIconModalOpen(true)}
                    >
                      <PlusIcon />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {category?.icon ? "Update icon" : "Upload icon"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Services: {category.totalServices}
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* City Configs */}
      <Section title="City-wise Configuration of Category">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.cityConfigs.length > 0 ? (
            category.cityConfigs.map((cfg) => (
              <Card key={cfg.cityId._id}>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold uppercase">
                      {cfg.cityId.name}
                    </h3>

                    <Badge variant={cfg.isActive ? "success" : "inprogress"}>
                      {cfg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <Label>Commission (%)</Label>
                    <p className="text-sm">{cfg.commission}%</p>
                  </div>

                  <div>
                    <Label>Convenience Fee</Label>
                    <p className="text-sm">₹{cfg.convenience}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No city configuration found
            </p>
          )}
        </div>
      </Section>

      {iconModalOpen && (
        <AddCategoryIconModal
          setIsModalOpen={setIconModalOpen}
          categoryId={params?.categoryId}
          getCategoryDetails={getCategoryDetails}
        />
      )}
    </div>
  );
};
