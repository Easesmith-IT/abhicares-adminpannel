"use client";

import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CustomerAddresses from "../CustomerAddresses";

import { setItemSlot } from "../../../store/slices/cartSlice";
import { toast } from "sonner";
import SelectSlotSheet from "./SelectSlotSheet";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const params = useParams();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderType, setOrderType] = useState("COD");

  // slot
  const [slotOpen, setSlotOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <Navigate to={`/admin/customers/${params.customerId}/create-order`} />
    );
  }

  const createOrder = () => {
    if (!selectedAddressId) {
      toast.error("Select address");
      return;
    }

    const missing = cartItems.find((i) => !i.slot);
    if (missing) {
      toast.error(`Select slot for ${missing.name}`);
      return;
    }

    const payload = {
      items: cartItems.map((i) => ({
        productId: i._id,
        quantity: i.quantity,
        slot: i.slot,
      })),
      orderType,
      addressId: selectedAddressId,
      subtotal,
      tax,
      total,
    };

    console.log(payload);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <CustomerAddresses
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            </CardContent>
          </Card>

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

                <div
                  onClick={() => setOrderType("ONLINE")}
                  className={`border p-4 rounded-lg cursor-pointer ${
                    orderType === "ONLINE" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  ONLINE
                </div>
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
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <Button className="w-full" onClick={createOrder}>
                Confirm Order
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
