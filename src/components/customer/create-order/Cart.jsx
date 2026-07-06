"use client";

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../../../store/slices/cartSlice";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartSheet({ open, onOpenChange = () => {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const cartItems = useSelector((state) => state.cart.items);
  const draft = useSelector((state) => state.createOrderDraft);

  const total = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.offerPrice || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cartItems]);

  const groupedItems = useMemo(() => {
    return Object.values(
      cartItems.reduce((acc, item) => {
        const key = `${item.categoryName || "Other"}__${item.serviceName || "Other"}`;

        if (!acc[key]) {
          acc[key] = {
            key,
            categoryName: item.categoryName || "Other",
            serviceName: item.serviceName || "Other",
            items: [],
          };
        }

        acc[key].items.push(item);
        return acc;
      }, {}),
    );
  }, [cartItems]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-[400px] flex-col sm:w-[450px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="border-b px-4 py-3 text-xs text-slate-600">
          {draft.selectedAddress ? (
            <>
              Draft address:{" "}
              <span className="font-semibold text-slate-900">
                {draft.selectedAddress.addressLine}
              </span>
              {" - "}
              {draft.cityName || draft.selectedAddress.city}
            </>
          ) : (
            "Select an address first to continue building the draft."
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Cart is empty
            </p>
          ) : (
            groupedItems.map((group) => (
              <div key={group.key} className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-500">
                    {group.categoryName}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {group.serviceName}
                  </p>
                </div>

                {group.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {item.type}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold">Rs {item.offerPrice}</p>
                        <p className="text-sm font-semibold text-muted-foreground line-through">
                          Rs {item.price}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => dispatch(decreaseQty(item._id))}
                          className="rounded border p-1"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-sm">{item.quantity}</span>

                        <button
                          onClick={() => dispatch(increaseQty(item._id))}
                          className="rounded border p-1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold">
                        Rs {Number(item.offerPrice || 0) * Number(item.quantity || 0)}
                      </p>

                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <Separator />

        <SheetFooter className="flex flex-col gap-3">
          <div className="flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate(
                draft.selectedAddress
                  ? `/admin/customers/${params?.customerId}/create-order/userAddresses/categories`
                  : `/admin/customers/${params?.customerId}/create-order`,
              );
            }}
            className="w-full"
          >
            Continue Adding Services
          </Button>

          <Button
            disabled={cartItems.length === 0}
            variant="abhicares"
            onClick={() => {
              onOpenChange(false);
              navigate(`/admin/customers/${params?.customerId}/create-order/checkout`);
            }}
            className="w-full"
          >
            Proceed to Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
