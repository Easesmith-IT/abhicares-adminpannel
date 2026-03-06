import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import MapContainer from "../../components/booking/MapContainer";
import AssignedPartnerModal from "../../components/booking/AssignedPartnerModal";
import useGetApiReq from "../../hooks/useGetApiReq";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import BookingDetailsSkeleton from "../../components/booking/BookingDetailsSkeleton";

const statusVariantMap = {
  cancelled: "destructive",
  completed: "success",
  alloted: "secondary",
  "not-alloted": "warning",
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { res, fetchData: getBooking } = useGetApiReq();
  const { res: updateRes, fetchData: updateStatus } = usePatchApiReq();

  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("");
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [mapData, setMapData] = useState({ distance: "", time: "" });

  /* ================= Fetch ================= */

  console.log("booking-log", booking);
  

  useEffect(() => {
    getBooking(`/admin/get-booking-details/${id}`);
  }, [id]);

  useEffect(() => {
    if (res?.status === 200) {
      setBooking(res.data.bookingDetails);
      setStatus(res.data.bookingDetails.status);
    }
  }, [res]);

  /* ================= Status Update ================= */

  const handleStatusUpdate = () => {
    if (!status) return;
    updateStatus(`/admin/update-seller-order-status/${booking._id}`, {
      status,
    });
  };

  useEffect(() => {
    if (updateRes?.status === 200) {
      toast.success("Booking status updated");
      getBooking(`/admin/get-booking-details/${id}`);
    }
  }, [updateRes]);

  if (!booking) {
    return <BookingDetailsSkeleton />;
  }

  /* ================= UI ================= */

  return (
    <>
      <Wrapper>
        <BackLink href={-1}>
          <H2>Booking Details</H2>
        </BackLink>
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ================= LEFT ================= */}
          <div className="space-y-6 xl:col-span-2">
            {/* Booking Info */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Booking ID: {booking.bookingId}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(booking.createdAt),
                      "dd MMM yyyy • hh:mm aa",
                    )}
                  </p>

                  {booking.autoAssigned && (
                    <Badge className="mt-2" variant="success">
                      Auto Assigned
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium">Update Status</p>
                  <div className="flex gap-2">
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="abhicares" onClick={handleStatusUpdate}>Update</Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  {booking.paymentStatus}
                </p>
                <p>
                  <span className="font-medium">Refund Amount:</span> ₹
                  {booking.refundInfo?.amount}
                </p>
                <p>
                  <span className="font-medium">Refund Status:</span>{" "}
                  {booking.refundInfo?.status}
                </p>
                <p>
                  <span className="font-medium">Delivery Date:</span>{" "}
                  {format(new Date(booking.bookingDate), "dd-MM-yyyy")}
                </p>
              </CardContent>
            </Card>

            {/* Product */}
            <Card>
              <CardHeader>
                <CardTitle>Product</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-16 w-16 rounded object-cover"
                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${
                        booking.package
                          ? booking.package.imageUrl[0]
                          : booking.product.imageUrl[0]
                      }`}
                      alt="product"
                    />

                    <div>
                      <p className="font-medium">
                        {booking.package
                          ? booking.package.name
                          : booking.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.package ? "Package" : "Product"}
                      </p>
                    </div>
                  </div>

                  <p>Qty: {booking.quantity}</p>

                  <p className="font-medium">
                    ₹
                    {booking.quantity *
                      (booking.package
                        ? booking.package.offerPrice
                        : booking.product.offerPrice)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>₹{booking.orderValue}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{booking.itemTotalTax}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{booking.itemTotalDiscount}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{booking.itemTotalValue}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {booking.userId?.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {booking.userId?.phone}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {booking.userAddress.addressLine},{" "}
                  {booking.userAddress.landmark}, {booking.userAddress.pincode}
                </p>
              </CardContent>
            </Card>

            {/* Partner */}
            <Card>
              <CardHeader>
                <CardTitle>Partner</CardTitle>
              </CardHeader>

              <CardContent>
                {!booking.sellerId ? (
                  <Button variant="abhicares" onClick={() => setIsPartnerModalOpen(true)}>
                    Assign to Partner
                  </Button>
                ) : (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{booking.sellerId.name}</p>
                    <p>{booking.sellerId.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ================= MAP ================= */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Live Location</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4">
            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium">Distance:</span>{" "}
                {mapData.distance}
              </p>
              <p>
                <span className="font-medium">Time:</span> {mapData.time}
              </p>
            </div>

            <MapContainer
              sellerStatus={booking.currentLocation?.status}
              bookingStatus={booking.status}
              location={{
                user: booking.userAddress.location.coordinates,
                seller: booking.currentLocation.location,
              }}
            />
          </CardContent>
        </Card>
      </Wrapper>

      {isPartnerModalOpen && (
        <AssignedPartnerModal
          setIsModalOpen={setIsPartnerModalOpen}
          serviceId={
            booking.product
              ? booking.product.serviceId
              : booking.package.serviceId
          }
          bookingId={booking._id}
          getBooking={() => getBooking(`/admin/get-booking-details/${id}`)}
        />
      )}
    </>
  );
};

export default BookingDetails;
