"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CustomerAddresses from "../CustomerAddresses";

import { setItemSlot } from "../../../store/slices/cartSlice";
import { toast } from "sonner";
import SelectSlotSheet from "./SelectSlotSheet";
import usePostApiReq from "../../../hooks/usePostApiReq";
import { Spinner } from "../../ui/spinner";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();


  const [orderType, setOrderType] = useState("COD");

  // slot
  const [slotOpen, setSlotOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const {
    res: calculateChargeRes,
    fetchData: calculateCharge,
    isLoading: calculateChargeLoading,
  } = usePostApiReq();
  const {
    res: createOrderRes,
    fetchData: createOrder,
    isLoading: createOrderLoading,
  } = usePostApiReq();

  // calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.offerPrice * item.quantity,
      0,
    );
  }, [cartItems]);

  // const discount = useMemo(() => {
  //   if (!appliedCoupon) return 0;

  //   if (appliedCoupon.type === "FLAT") {
  //     return appliedCoupon.value;
  //   }

  //   if (appliedCoupon.type === "PERCENT") {
  //     return Math.round((subtotal * appliedCoupon.value) / 100);
  //   }

  //   return 0;
  // }, [appliedCoupon, subtotal]);

  const tax = Math.round(subtotal * 0.05);
  // const total = subtotal - discount + tax;

  if (cartItems.length === 0) {
    return (
      <Navigate to={`/admin/customers/${params.customerId}/create-order`} />
    );
  }

  const handleCreateOrder = () => {
    if (!state?.address?._id) {
      toast.error("Select address");
      return;
    }

    const missing = cartItems.find((i) => !i.slot);
    if (missing) {
      toast.error(`Select slot for ${missing.name}`);
      return;
    }

    const data = calculateChargeRes?.data;
    const items = data?.items || [];

    const combineDateTime = (date, time) => {
      const d = new Date(date);

      // parse "03:00 PM"
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":");

      hours = parseInt(hours, 10);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      d.setHours(hours, minutes, 0, 0);

      return d.toISOString(); // backend-safe
    };

    const payload = {
      userId: params?.customerId,
      userAddressId: state?.address?._id,
      offerCode: couponCode,
      cityId: state?.address?.cityBoundary,
      cart: {
        items: cartItems.map((i) => ({
          type: i.type.toLowerCase(),
          quantity: i.quantity,
          prod: {
            ...i,
            _id: i._id,
            name: i.name,
          },
          ...(i?.type?.toLowerCase() === "package"
            ? {
                package: {
                  ...i,
                  _id: i._id,
                  name: i.name,
                },
              }
            : {}),
          serviceId: i.serviceId,
          bookDate: i.slot?.date,
          bookTime: combineDateTime(i.slot?.date, i.slot?.time),
          totalForItem: items.find((item) => item.itemId === i._id)?.charges
            ?.totalForItem,
          itemDiscount: items.find((item) => item.itemId === i._id)?.charges
            ?.discount,
          itemTotaltax: items.find((item) => item.itemId === i._id)?.charges
            ?.itemTotalTax,
        })),

        totalAmount: data?.totalPayable,
        totalCommission: data?.totalCommission,
        totalConvenience: data?.totalConvenience,
        totalDiscount: data?.totalDiscount,
        totalvalue: data?.totalAmount,
        serviceGst: data?.totalServiceGST,
        totalTax: data?.totalTax,
        totalTaxOnCommission: data?.totalTaxOnCommission,
      },
    };

    createOrder("admin/create-cod-order-for-user", payload);

  };

  useEffect(() => {
    if (createOrderRes?.status === 200 || createOrderRes?.status === 201) {
      navigate(`/admin/orders/${createOrderRes?.data?.data?.order?._id}`);
    }
  }, [createOrderRes]);

  const caluclateCharge = async () => {
    const modifiedItems = cartItems?.map((item) => ({
      type: item?.type.toLowerCase(),
      serviceId: item?.serviceId,
      quantity: item?.quantity,
      prodId: item?.type === "Package" ? item?._id : item?._id,
    }));

    calculateCharge("/shopping/caluclate-charge", {
      items: modifiedItems,
      cityId: state?.address?.cityBoundary,
      offerCode: couponCode,
    });
  };

  useEffect(() => {
    state?.address?.cityBoundary && caluclateCharge();
  }, [state]);

  useEffect(() => {
    if (
      calculateChargeRes?.status === 200 ||
      calculateChargeRes?.status === 201
    ) {
      setAppliedCoupon(calculateChargeRes?.data?.offerApplied);
    }
  }, [calculateChargeRes]);

  const {
    totalConvenience = 0,
    totalPayable = 0,
    totalTax = 0,
    totalAmount = 0,
    offerDiscount = 0,
  } = calculateChargeRes?.data || {};

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          {/* <Card>
            <CardContent className="p-5">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <CustomerAddresses
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            </CardContent>
          </Card> */}

          {/* 🔥 SLOT PER ITEM */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-medium">Service Slots</h3>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>

                    {item.slot ? (
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.slot.date).toDateString()} •{" "}
                        {item.slot.time}
                      </p>
                    ) : (
                      <p className="text-xs text-red-500">No slot selected</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveItem(item);
                      setSlotOpen(true);
                    }}
                  >
                    {item.slot ? "Change" : "Select"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Type */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-medium">Order Type</h3>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setOrderType("COD")}
                  className={`border p-4 rounded-lg cursor-pointer ${
                    orderType === "COD" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  COD
                </div>

                {/* <div
                  onClick={() => setOrderType("ONLINE")}
                  className={`border p-4 rounded-lg cursor-pointer ${
                    orderType === "ONLINE" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  ONLINE
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    if (!couponCode) {
                      toast.error("Enter coupon code");
                      return;
                    }

                    caluclateCharge();
                  }}
                >
                  {calculateChargeLoading ? <Spinner /> : "Apply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-medium">Summary</h3>

              {cartItems.map((i) => (
                <div key={i._id} className="flex justify-between text-sm">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>₹{i.offerPrice * i.quantity}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Total Convenience</span>
                <span>₹{totalConvenience}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{totalTax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Offer Discount</span>
                <span>₹{offerDiscount}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalPayable}</span>
              </div>

              <Button
                disabled={createOrderLoading}
                variant="abhicares"
                className="w-full"
                onClick={handleCreateOrder}
              >
                {createOrderLoading ? <Spinner /> : "Confirm Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SLOT SHEET */}
      <SelectSlotSheet
        open={slotOpen}
        initialSlot={activeItem?.slot}
        onOpenChange={setSlotOpen}
        onSelect={(slot) => {
          dispatch(
            setItemSlot({
              itemId: activeItem._id,
              slot,
            }),
          );
        }}
      />
    </div>
  );
};

export default Checkout;
