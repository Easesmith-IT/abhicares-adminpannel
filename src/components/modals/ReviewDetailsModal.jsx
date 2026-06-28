import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { format } from "date-fns";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const ReviewDetailsModal = ({ setIsModalOpen, review }) => {

  const {
    res: getReviewDetailsRes,
    fetchData: getReviewDetails,
    isLoading,
  } = useGetApiReq();

  const [reviewDetails, setReviewDetails] = useState(null);
  const navigate = useNavigate();

  const getReviews = async () => {
    getReviewDetails(`/admin/review-detail?reviewId=${review._id}`);
  };

  

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    if (
      getReviewDetailsRes?.status === 200 ||
      getReviewDetailsRes?.status === 201
    ) {
      setReviewDetails(getReviewDetailsRes?.data?.data);
    }
  }, [getReviewDetailsRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!isLoading && reviewDetails && (
            <div className="space-y-6">
              {/* Rating + Meta */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  {review?.createdAt &&
                    format(new Date(review.createdAt), "dd-MM-yyyy")}
                </p>

                <Badge variant="secondary">{reviewDetails.reviewType}</Badge>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-medium">Review</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {review.content}
                </p>
              </div>

              <Separator />

              {/* Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* User */}
                <div className="space-y-2">
                  <h5 className="font-semibold">User Details</h5>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {reviewDetails?.userId?.name || "NA"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {reviewDetails?.userId?.phone || "NA"}
                  </p>
                </div>

                {/* Service */}
                {(reviewDetails?.productId || reviewDetails?.packageId) && (
                  <div className="space-y-2">
                    <h5 className="font-semibold">Service Details</h5>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {reviewDetails?.productId
                        ? reviewDetails.productId.name
                        : reviewDetails?.packageId?.name}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {reviewDetails?.productId ? "Product" : "Package"}
                    </p>

                    <div className="text-sm text-muted-foreground">
                      {reviewDetails?.productId
                        ? parse(reviewDetails.productId.description)
                        : reviewDetails?.packageId?.description &&
                          parse(reviewDetails.packageId.description)}
                    </div>

                    <div className="flex gap-3 font-medium">
                      <span className="line-through text-muted-foreground">
                        ₹
                        {reviewDetails?.bookingId?.product
                          ? reviewDetails?.bookingId?.product.price
                          : reviewDetails?.bookingId?.package?.price}
                      </span>
                      <span>
                        ₹
                        {reviewDetails?.productId
                          ? reviewDetails.bookingId?.product.offerPrice
                          : reviewDetails?.bookingId?.package?.offerPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* Partner */}
                {reviewDetails?.bookingId?.sellerId && (
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center justify-between">
                      Partner Details
                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(
                            `/admin/partners/${reviewDetails.bookingId.sellerId._id}`,
                            {
                              state: reviewDetails.bookingId.sellerId,
                            },
                          )
                        }
                      >
                        View
                      </Button>
                    </h5>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {reviewDetails.bookingId.sellerId.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {reviewDetails.bookingId.sellerId.phone}
                    </p>
                  </div>
                )}

                {/* Booking */}
                {reviewDetails?.bookingId && (
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center justify-between">
                      Booking Details
                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(
                            `/admin/bookings/${reviewDetails.bookingId._id}`,
                            { state: reviewDetails.bookingId },
                          )
                        }
                      >
                        View
                      </Button>
                    </h5>
                    <p>
                      <span className="font-medium">Order Value:</span>{" "}
                      {reviewDetails.bookingId.itemTotalValue}
                    </p>
                    <p>
                      <span className="font-medium">Booking Date:</span>{" "}
                      {reviewDetails.bookingId.bookingDate &&
                        format(
                          new Date(reviewDetails.bookingId.bookingDate),
                          "dd-MM-yyyy",
                        )}
                    </p>
                    <p>
                      <span className="font-medium">Booking Time:</span>{" "}
                      {format(
                        new Date(reviewDetails.bookingId.bookingTime),
                        "hh:mm aa",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailsModal;
