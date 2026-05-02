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

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center mt-10">
              Cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3"
              >
                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch(decreaseQty(item._id))}
                      className="p-1 border rounded"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-sm">{item.quantity}</span>

                    <button
                      onClick={() => dispatch(increaseQty(item._id))}
                      className="p-1 border rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-sm">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* Footer */}
        <SheetFooter className="flex flex-col gap-3">
          <div className="flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Button
            disabled={cartItems.length === 0}
            variant="abhicares"
            onClick={() => {
              onOpenChange(false);
               navigate(
                 `/admin/customers/${params?.customerId}/create-order/checkout`,
               );
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
