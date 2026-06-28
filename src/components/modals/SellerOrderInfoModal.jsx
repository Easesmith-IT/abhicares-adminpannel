import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const SellerOrderInfoModal = ({
  setSellerOrderInfoModal,
  sellerOrder,
}) => {
  if (!sellerOrder) return null;
  

  const isPackage = Boolean(sellerOrder.package);

  const imageUrl = isPackage
    ? sellerOrder?.package?.imageUrl?.[0]
    : sellerOrder?.product?.imageUrl?.[0];

  const price = isPackage
    ? sellerOrder?.package?.offerPrice
    : sellerOrder?.product?.offerPrice;

  return (
    <Dialog open onOpenChange={() => setSellerOrderInfoModal(false)}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Seller Order Info</DialogTitle>
        </DialogHeader>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <b>Order ID:</b> {sellerOrder.orderId}
          </p>
          <p>
            <b>Status:</b>{" "}
            <Badge variant="secondary">{sellerOrder.status}</Badge>
          </p>
          <p>
            <b>Booking Date:</b>{" "}
            {format(new Date(sellerOrder.bookingDate), "dd-MM-yyyy")}
          </p>
          <p>
            <b>Booking Time:</b> {format(new Date(sellerOrder.bookingTime), "hh:mm aa")}
          </p>
          <p>
            <b>Order Total:</b> ₹{sellerOrder.orderValue}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Product / Package */}
        <div className="space-y-3">
          <h4 className="font-semibold">
            {isPackage ? "Package" : "Product"}
          </h4>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <img
              src={`${import.meta.env.VITE_APP_IMAGE_URL}/${imageUrl}`}
              alt="item"
              className="h-20 w-20 rounded-md object-cover border"
            />

            <div className="flex-1">
              <p className="font-medium">
                {isPackage ? sellerOrder?.package?.name : sellerOrder?.product?.name}
              </p>
              <p className="text-sm">
                {isPackage ? "Package" : "Product"}
              </p>
              <p className="text-sm text-muted-foreground">
                Qty: {sellerOrder.quantity}
              </p>
            </div>

            <p className="font-semibold">₹{price}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* User Info */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">User Info</h4>

          <p>
            <b>Name:</b> {sellerOrder?.userId?.name}
          </p>
          <p>
            <b>Phone:</b> {sellerOrder?.userId?.phone}
          </p>

          <div>
            <b>Address:</b>
            <p className="text-muted-foreground">
              {sellerOrder?.userAddress?.addressLine}
            </p>
          </div>

          <p>
            <b>Landmark:</b> {sellerOrder?.userAddress?.landmark}
          </p>
          <p>
            <b>Pincode:</b> {sellerOrder?.userAddress?.pincode}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerOrderInfoModal;
