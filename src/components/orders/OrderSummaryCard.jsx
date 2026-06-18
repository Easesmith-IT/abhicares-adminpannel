import { Separator } from "@/components/ui/separator";

export default function OrderSummaryCard({ order }) {
  if (!order) return null;

  const itemTotal = order.itemTotal || 0;
  const convenienceFee = order.totalConvenience || 0;
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const couponName = order.couponId?.name || "";
  const referralDiscount = order.referalDiscount || 0;
  const orderValue = order.orderValue || 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-5">Order Financial Summary</h3>

      <div className="space-y-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">₹{itemTotal}</span>
        </div>

        {/* Convenience Fee */}
        <div className="flex justify-between text-gray-500">
          <span>Convenience Fee</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">₹{convenienceFee}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-500">
          <span>Taxes & GST</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">₹{tax}</span>
        </div>

        {/* Coupon Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              Discount {couponName ? `(${couponName})` : ""}
            </span>
            <span className="font-semibold">- ₹{discount}</span>
          </div>
        )}

        {/* Referral Discount */}
        {referralDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Referral Discount</span>
            <span className="font-semibold">- ₹{referralDiscount}</span>
          </div>
        )}

        <Separator className="my-4" />

        {/* Grand Total */}
        <div className="flex items-center justify-between rounded-xl bg-gray-950 p-4 text-white dark:bg-white dark:text-gray-950">
          <div>
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Grand Total</span>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">All taxes & fees included</p>
          </div>
          <span className="text-2xl font-bold tracking-tight">₹{orderValue}</span>
        </div>
      </div>
    </div>
  );
}
