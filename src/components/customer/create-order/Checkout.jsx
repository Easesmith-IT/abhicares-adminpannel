"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { clearCart, setItemSlot } from "../../../store/slices/cartSlice";
import {
  clearCreateOrderDraft,
  setAppliedCoupon,
  setCouponCode,
  setPricingSnapshot,
} from "../../../store/slices/createOrderDraftSlice";
import SelectSlotSheet from "./SelectSlotSheet";
import usePostApiReq from "../../../hooks/usePostApiReq";
import { Spinner } from "../../ui/spinner";
import {
  combineBusinessDateAndTime,
  formatDateOnly,
  formatSlotTime,
} from "@/utils/dateTime";

const amount = (value) => Number(value || 0);

const CheckoutAlert = ({ title, description, actionLabel, onAction, tone = "warning" }) => {
  const tones = {
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone] || tones.warning}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="space-y-2">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm">{description}</p>
          {actionLabel && onAction && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="bg-white"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const cartItems = useSelector((state) => state.cart.items);
  const draft = useSelector((state) => state.createOrderDraft);

  const [slotOpen, setSlotOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [checkoutAlert, setCheckoutAlert] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState("");

  const {
    res: calculateChargeRes,
    fetchData: calculateCharge,
    isLoading: calculateChargeLoading,
    error: calculateChargeError,
  } = usePostApiReq();
  const {
    res: createOrderRes,
    fetchData: createOrder,
    isLoading: createOrderLoading,
    error: createOrderError,
  } = usePostApiReq();

  const selectedAddress = draft.selectedAddress;

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + amount(item.offerPrice) * amount(item.quantity),
      0,
    );
  }, [cartItems]);

  const pricing = calculateChargeRes?.data || draft.pricingSnapshot || {};

  const calculateChargePreview = useCallback(() => {
    if (!draft.cityId || cartItems.length === 0) return;

    const modifiedItems = cartItems.map((item) => ({
      type: String(item?.type || "").toLowerCase(),
      serviceId: item?.serviceId,
      quantity: item?.quantity,
      prodId: item?._id,
    }));

    calculateCharge("/shopping/caluclate-charge", {
      items: modifiedItems,
      cityId: draft.cityId,
      offerCode: draft.couponCode,
      userId: params?.customerId,
      applyRewardPoints: true,
    });
  }, [calculateCharge, cartItems, draft.cityId, draft.couponCode, params?.customerId]);

  useEffect(() => {
    if (selectedAddress?._id && cartItems.length > 0) {
      calculateChargePreview();
    }
  }, [calculateChargePreview, cartItems.length, selectedAddress?._id]);

  useEffect(() => {
    if (calculateChargeRes?.status === 200 || calculateChargeRes?.status === 201) {
      dispatch(setAppliedCoupon(calculateChargeRes?.data?.offerApplied || null));
      dispatch(
        setPricingSnapshot({
          pricingSnapshot: calculateChargeRes?.data || null,
          pricingHash:
            calculateChargeRes?.data?.pricingHash ||
            calculateChargeRes?.data?.pricing?.pricingHash ||
            "",
        }),
      );
      setCheckoutAlert(null);
    }
  }, [calculateChargeRes, dispatch]);

  useEffect(() => {
    const reasonCode = calculateChargeError?.response?.data?.reasonCode;

    if (!reasonCode) return;

    if (reasonCode === "OFFER_NOT_APPLICABLE") {
      setCheckoutAlert({
        tone: "warning",
        title: "Offer is no longer valid",
        description:
          "The current coupon cannot be applied to this cart. Update the code or continue without it.",
      });
      return;
    }

    if (reasonCode === "OFFER_LIMIT_REACHED") {
      setCheckoutAlert({
        tone: "danger",
        title: "Offer usage limit reached",
        description:
          "This offer cannot be applied anymore. Remove it and refresh pricing before checkout.",
      });
    }
  }, [calculateChargeError]);

  useEffect(() => {
    if (createOrderRes?.status === 200 || createOrderRes?.status === 201) {
      const order = createOrderRes?.data?.data?.order;
      setCreatedOrderId(order?._id || "");
      dispatch(clearCart());
      dispatch(clearCreateOrderDraft());
      setCheckoutAlert(null);
      toast.success(`Order created: ${order?.orderId || order?._id}`);
    }
  }, [createOrderRes, dispatch]);

  useEffect(() => {
    const reasonCode = createOrderError?.response?.data?.reasonCode;

    if (!reasonCode) return;

    if (reasonCode === "PRICING_HASH_MISMATCH") {
      setCheckoutAlert({
        tone: "warning",
        title: "Pricing changed before submit",
        description:
          "Refresh pricing with the latest cart totals, then retry checkout.",
        actionLabel: "Refresh Pricing",
        onAction: calculateChargePreview,
      });
      return;
    }

    if (reasonCode === "OFFER_NOT_APPLICABLE") {
      setCheckoutAlert({
        tone: "warning",
        title: "Offer is not applicable anymore",
        description:
          "Remove the coupon or replace it, then refresh pricing before submitting.",
      });
      return;
    }

    if (reasonCode === "OFFER_LIMIT_REACHED") {
      setCheckoutAlert({
        tone: "danger",
        title: "Offer limit reached",
        description:
          "This offer has already exhausted its usage limit. Remove it and retry checkout.",
      });
    }
  }, [calculateChargePreview, createOrderError]);

  const handleCreateOrder = () => {
    if (!selectedAddress?._id) {
      toast.error("Select an address first");
      navigate(`/admin/customers/${params.customerId}/create-order`);
      return;
    }

    const missingSlot = cartItems.find((item) => !item.slot);
    if (missingSlot) {
      toast.error(`Select a slot for ${missingSlot.name}`);
      return;
    }

    if (!pricing?.items?.length) {
      toast.error("Refresh pricing before creating the order");
      return;
    }

    const payload = {
      userId: params?.customerId,
      userAddressId: selectedAddress?._id,
      offerCode: draft.couponCode,
      pricingHash: draft.pricingHash,
      cityId: draft.cityId,
      cart: {
        items: cartItems.map((item) => {
          const chargeItem = pricing.items.find(
            (pricingItem) => pricingItem.itemId === item._id,
          );

          return {
            type: String(item.type || "").toLowerCase(),
            quantity: item.quantity,
            prod: {
              ...item,
              _id: item._id,
              name: item.name,
            },
            ...(String(item.type || "").toLowerCase() === "package"
              ? {
                  package: {
                    ...item,
                    _id: item._id,
                    name: item.name,
                  },
                }
              : {}),
            serviceId: item.serviceId,
            bookDate: item.slot?.date,
            bookTime: combineBusinessDateAndTime(item.slot?.date, item.slot?.time),
            totalForItem: chargeItem?.charges?.totalForItem,
            itemDiscount: chargeItem?.charges?.discount,
            itemTotaltax: chargeItem?.charges?.itemTotalTax,
          };
        }),
        totalAmount: pricing?.totalPayable,
        totalCommission: pricing?.totalCommission,
        totalConvenience: pricing?.totalConvenience,
        totalDiscount: pricing?.totalDiscount,
        totalvalue: pricing?.totalAmount,
        serviceGst: pricing?.totalServiceGST,
        totalTax: pricing?.totalTax,
        totalTaxOnCommission: pricing?.totalTaxOnCommission,
        pricingHash: draft.pricingHash,
      },
    };

    createOrder("admin/create-cod-order-for-user", payload);
  };

  if (createdOrderId) {
    return <Navigate to={`/admin/orders/${createdOrderId}`} replace />;
  }

  if (!selectedAddress?._id) {
    return (
      <Navigate to={`/admin/customers/${params.customerId}/create-order`} replace />
    );
  }

  if (cartItems.length === 0) {
    return (
      <Navigate
        to={`/admin/customers/${params.customerId}/create-order/userAddresses/categories`}
        replace
      />
    );
  }

  return (
    <div className="space-y-6">
      {checkoutAlert && <CheckoutAlert {...checkoutAlert} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Selected Address</h3>
                  <p className="text-sm text-slate-600">
                    {selectedAddress.addressLine}, {selectedAddress.city}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/admin/customers/${params.customerId}/create-order`)
                  }
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <h3 className="font-medium">Service Slots</h3>
                <p className="text-sm text-slate-600">
                  Each item keeps its own scheduled slot inside the same mixed
                  cart.
                </p>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>

                    {item.slot ? (
                      <p className="text-xs text-muted-foreground">
                        {formatDateOnly(item.slot.date, "dd MMM yyyy")} -{" "}
                        {formatSlotTime(item.slot.time, "hh:mm aa")}
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

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-medium">COD only admin checkout</h3>
                  <p>
                    This flow creates COD orders only. Wallet usage is disabled
                    and pricing is revalidated against the backend at submit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={draft.couponCode}
                  onChange={(event) =>
                    dispatch(setCouponCode(event.target.value))
                  }
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />

                <Button variant="outline" onClick={calculateChargePreview}>
                  {calculateChargeLoading ? <Spinner /> : "Apply"}
                </Button>
              </div>

              <p className="text-xs text-slate-500">
                You can still go back and add more products or packages before
                confirming the order.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="space-y-4 p-5">
              <h3 className="font-medium">Summary</h3>

              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Rs {amount(item.offerPrice) * amount(item.quantity)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rs {amount(pricing.totalAmount || subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Total Convenience</span>
                <span>Rs {amount(pricing.totalConvenience)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Rs {amount(pricing.totalTax)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Offer Discount</span>
                <span>Rs {amount(pricing.offerDiscount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Reward Discount</span>
                <span>Rs {amount(pricing.referralDiscount || pricing.reward?.discountAmount)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {amount(pricing.totalPayable || subtotal)}</span>
              </div>

              <p className="text-xs text-slate-500">
                Pricing hash: {draft.pricingHash || "Pending refresh"}
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/admin/customers/${params.customerId}/create-order/userAddresses/categories`,
                    )
                  }
                >
                  Continue Adding Services
                </Button>

                <Button
                  disabled={createOrderLoading}
                  variant="abhicares"
                  className="w-full"
                  onClick={handleCreateOrder}
                >
                  {createOrderLoading ? <Spinner /> : "Confirm Order"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
