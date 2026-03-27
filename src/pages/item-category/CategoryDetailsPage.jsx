import { useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BackLink } from "@/components/shared/back-link";
import { useParams } from "react-router-dom";
import useGetApiReq from "@/hooks/useGetApiReq";
import { H2 } from "../../components/shared/typography";
import { CategoryDetailsSkeleton } from "../../components/item-category/category-details-skeleton";
import Wrapper from "../../components/wrappers/Wrapper";

const CategoryDetailsPage = () => {
  const params = useParams();

  const { res, isLoading, fetchData } = useGetApiReq();

  // 🔥 Call API manually
  useEffect(() => {
    if (params.categoryId) {
      fetchData(`/items/category/${params.categoryId}`, {
        screenName: "CategoryDetails",
      });
    }
  }, [params.categoryId]);

  // ✅ Extract data safely
  const category = res?.data?.data?.category;

  // ✅ Memoized total value
  const totalValue = useMemo(() => {
    return category?.items?.reduce((acc, item) => acc + item.unitPrice, 0) || 0;
  }, [category]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href="/admin/item-categories">
          <H2>Category Details</H2>
        </BackLink>

        {isLoading ? (
          <CategoryDetailsSkeleton />
        ) : category ? (
          <div className="space-y-6">
            {/* Category Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{category.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p>
                  <strong>Type:</strong> {category.type}
                </p>
                <p>
                  <strong>Description:</strong> {category.description}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant={category.isActive ? "success" : "destructive"}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </p>

                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(category.createdAt).toLocaleString()}
                </p>

                <p>
                  <strong>Total Items:</strong> {category?.items?.length || 0}
                </p>

                <p>
                  <strong>Total Value:</strong> ₹ {totalValue}
                </p>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Unit Price (₹)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {category?.items?.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹ {item.unitPrice}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.isActive ? "success" : "destructive"}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>No category found</p>
        )}
      </div>
    </Wrapper>
  );
};

export default CategoryDetailsPage;
