import { useEffect, useState } from "react";


import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "../../components/wrappers/Wrapper";
import SingleComisionComp from "../../components/settings/SingleComisionComp";
import { H2 } from "../../components/shared/typography";

const ManageComision = () => {
  const {
    res: getCategoriesRes,
    fetchData: getCategories,
    isLoading,
  } = useGetApiReq();

  const [allCategories, setAllCategories] = useState([]);

  const getAllCategories = async () => {
    getCategories("/admin/get-all-category");
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (getCategoriesRes?.status === 200 || getCategoriesRes?.status === 201) {
      setAllCategories(getCategoriesRes?.data?.data || []);
    }
  }, [getCategoriesRes]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <H2>Manage Commission</H2>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allCategories.length === 0 && (
          <p className="text-muted-foreground">No data found</p>
        )}

        {/* Data */}
        {!isLoading && allCategories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allCategories.map((category) => (
              <SingleComisionComp
                key={category._id}
                item={category}
                getAllCategories={getAllCategories}
              />
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ManageComision;
