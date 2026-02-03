import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Wrapper from "../../components/wrappers/Wrapper";
import { H1 } from "../../components/shared/typography";
import CategoryCardSkeleton from "../../components/category/CategoryCardSkeleton";

const Services = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setCategories(res.data.data || []);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="w-full font-poppins">
        <div className="pb-6">
          <H1>Categories</H1>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No category found
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card
                key={category._id}
                onClick={() =>
                  navigate(`/admin/services/${category._id}`, {
                    state: { categoryName: category.name },
                  })
                }
                className="cursor-pointer gap-3 py-3 transition-all hover:border-main hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    {category.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      {category.totalServices} Services
                    </Badge>
                  <div className="flex justify-between">
                    <span>Commission</span>
                    <span className="font-medium text-black">
                      {category.commission}%
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span className="font-medium text-black">
                      {category.convenience}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Services;
