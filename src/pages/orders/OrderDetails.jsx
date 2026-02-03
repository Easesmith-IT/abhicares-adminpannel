import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import { BackLink } from "../../components/shared/back-link";
import { H1, H2 } from "../../components/shared/typography";

const statusVariantMap = {
  cancelled: "destructive",
  completed: "success",
  alloted: "secondary",
  pending: "warning",
  OutOfDelivery: "default",
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: locationState } = useLocation();

  const [state, setState] = useState(locationState || {});
  const [status, setStatus] = useState(locationState?.status || "");

  const { res: changeOrderStatusRes, fetchData: changeOrderStatus } =
    usePostApiReq();

  const { res: getOrderRes, fetchData: getOrder } = useGetApiReq();

  /* ---------------- Fetch Order ---------------- */
  const getOrderDetails = () => {
    getOrder(`/admin/get-order-details?orderId=${id}`);
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  useEffect(() => {
    if (getOrderRes?.status === 200 || getOrderRes?.status === 201) {
      setState(getOrderRes.data.data);
      setStatus(getOrderRes.data.data.status);
    }
  }, [getOrderRes]);

  /* ---------------- Change Status ---------------- */
  const handleStatusChange = (value) => {
    setStatus(value);
    changeOrderStatus(`/admin/change-order-status/${state?._id}`, {
      status: value,
    });
  };

  useEffect(() => {
    if (
      changeOrderStatusRes?.status === 200 ||
      changeOrderStatusRes?.status === 201
    ) {
      toast.success("Order status changed successfully");
      getOrderDetails();
    }
  }, [changeOrderStatusRes]);

  return (
    <Wrapper>
      <BackLink href={-1} >
        <H2>Order Details</H2>
      </BackLink>
      <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="xl:col-span-2 space-y-4">
          {/* Order Info */}
          <Card>
            <CardHeader className="flex flex-row justify-between gap-4">
              <div>
                <CardTitle>Order ID: {state?.orderId}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {state?.createdAt &&
                    format(new Date(state.createdAt), "dd MMM yyyy • hh:mm aa")}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Update Status</p>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="OutOfDelivery">
                      Out Of Delivery
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {state?.paymentType}
              </p>
              <p>
                <span className="font-medium">Left Bookings:</span>{" "}
                {state?.No_of_left_bookings}
              </p>
              <p>
                <span className="font-medium">Refund Amount:</span> ₹
                {state?.refundInfo?.amount}
              </p>
              <p>
                <span className="font-medium">Refund Status:</span>{" "}
                {state?.refundInfo?.status}
              </p>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {state?.items?.map((item, i) => (
                <div
                  key={i}
                  onClick={() =>
                    navigate(
                      `/admin/bookings/${
                        item?.bookingId?._id || item?.bookingId
                      }`,
                    )
                  }
                  className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="h-14 w-14 rounded object-cover"
                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${
                        item.package
                          ? item.package.imageUrl[0]
                          : item.product.imageUrl[0]
                      }`}
                      alt="product"
                    />

                    <div>
                      <p className="font-medium">
                        {item.package ? item.package.name : item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.package ? "Package" : "Product"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-right">
                    <p>
                      {item?.bookingId?.bookingDate &&
                        format(
                          new Date(item.bookingId.bookingDate),
                          "dd-MM-yyyy",
                        )}
                    </p>
                    <p>
                      {item?.bookingId?.bookingTime &&
                        format(
                          new Date(item.bookingId.bookingTime),
                          "hh:mm aa",
                        )}
                    </p>
                  </div>

                  <Badge
                    variant={
                      statusVariantMap[item?.bookingId?.status] || "default"
                    }
                  >
                    {item?.bookingId?.status}
                  </Badge>

                  <p className="text-sm">Qty: {item.quantity}</p>

                  <p className="font-medium">
                    ₹
                    {item.quantity *
                      (item.package
                        ? item.package.offerPrice
                        : item.product.offerPrice)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>₹{state?.itemTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{state?.tax}</span>
              </div>

              {state?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({state?.couponId?.name})</span>
                  <span>- ₹{state?.discount}</span>
                </div>
              )}

              {state?.referalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Referral Discount</span>
                  <span>- ₹{state?.referalDiscount}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{state?.orderValue}</span>
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
                <span className="font-medium">Name:</span> {state?.user?.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {state?.user?.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {state?.user?.address?.addressLine},{" "}
                {state?.user?.address?.landmark},{" "}
                {state?.user?.address?.pincode}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default OrderDetails;
