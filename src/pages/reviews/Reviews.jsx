import { useEffect, useState } from "react";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
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
import {
  ReviewRow,
  ReviewRowSkeleton,
} from "../../components/review/ReviewRow";
import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import { H2 } from "../../components/shared/typography";
import TooltipIconButton from "../../components/shared/TooltipIconButton";

const Reviews = () => {
  const { res: getCategoriesRes, fetchData: getCategories } = useGetApiReq();

  const {
    res: getReviewsRes,
    fetchData: getReviews,
    isLoading,
  } = useGetApiReq();

  const {
    res: filterReviewsRes,
    fetchData: filterReviewsFun,
    isLoading: filterReviewsLoading,
  } = useGetApiReq();

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState({
    date: "",
    serviceType: "",
    type: "",
  });

  const handleReset = () => {
    setFilters({
      date: "",
      serviceType: "",
      type: "",
    });
  };

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

  const handlePageClick = (page) => setCurrentPage(page);

  const fetchReviews = async () => {
    getReviews(`/admin/get-all-reviews?page=${currentPage}&limit=${limit}`);
  };

  useEffect(() => {
    if (getReviewsRes?.status === 200 || getReviewsRes?.status === 201) {
      setReviews(getReviewsRes?.data?.data || []);
      setTotalPages(getReviewsRes?.data?.totalPages || 0);
    }
  }, [getReviewsRes]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterReviews = async () => {
    filterReviewsFun(
      `/admin/filter-review?date=${
        filters.date || ""
      }&serviceType=${filters.serviceType}&reviewType=${filters.type}&page=${currentPage}&limit=${limit}`,
    );
  };

  useEffect(() => {
    if (!filters.date && !filters.serviceType && !filters.type) {
      fetchReviews();
    } else {
      filterReviews();
    }
  }, [currentPage, limit, filters.date, filters.serviceType, filters.type]);

  useEffect(() => {
    if (filterReviewsRes?.status === 200 || filterReviewsRes?.status === 201) {
      setReviews(filterReviewsRes?.data?.data || []);
      setTotalPages(filterReviewsRes?.data?.totalPages || 0);
    }
  }, [filterReviewsRes]);

  const isPageLoading = isLoading || filterReviewsLoading;

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <H2>Reviews</H2>

          <div className="flex flex-wrap gap-3">
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-[180px]"
            />

            {/* Service filter (optional – kept commented like original) */}
            {/* <Select
              value={filters.serviceType}
              onValueChange={(value) =>
                handleFilterChange("serviceType", value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON-PRODUCT">ON PRODUCT</SelectItem>
                <SelectItem value="ON-BOOKING">ON BOOKING</SelectItem>
                <SelectItem value="ON-PACKAGE">ON PACKAGE</SelectItem>
              </SelectContent>
            </Select>
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setCurrentPage(1);
              }}
              label=""
            />
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
          </div>
        </div>

        {/* Content */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 border-b border-white/40">
                <TableHead>Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Review</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading */}
              {isPageLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <ReviewRowSkeleton key={i} />
                ))}

              {/* Empty */}
              {!isPageLoading && reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No reviews found
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}
              {!isPageLoading &&
                reviews.map((review) => (
                  <ReviewRow
                    key={review._id}
                    review={review}
                    fetchReviews={fetchReviews}
                  />
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 mb-5 flex items-center justify-end gap-3">
          <PaginationComp
            page={currentPage}
            pageCount={totalPages}
            setPage={setCurrentPage}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default Reviews;
