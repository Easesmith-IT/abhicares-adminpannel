import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import InvoiceDialog from "./InvoiceDialog";
import AssignedPartnerModal from "../../components/booking/AssignedPartnerModal";
import OrderHeader from "../../components/orders/OrderHeader";
import OrderTimeline from "../../components/orders/OrderTimeline";
import CustomerProfileCard from "../../components/orders/CustomerProfileCard";
import AssignedPartnerCard from "../../components/orders/AssignedPartnerCard";
import PaymentLedgerCard from "../../components/orders/PaymentLedgerCard";
import OrderSummaryCard from "../../components/orders/OrderSummaryCard";
import ServiceItemCard from "../../components/orders/ServiceItemCard";
import RefundInfoCard from "../../components/orders/RefundInfoCard";
import OrderNotesCard from "../../components/orders/OrderNotesCard";
import { formatDateOnly, formatSlotTime, isBookingOverdue } from "@/utils/dateTime";

const amountFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: locationState } = useLocation();

  const [state, setState] = useState(locationState || {});
  const [status, setStatus] = useState(locationState?.status || "");
  const [ledger, setLedger] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { res: invoiceRes, fetchData: getInvoice, isLoading: isInvoiceLoading } =
    useGetApiReq();
  const { res: changeOrderStatusRes, fetchData: changeOrderStatus } =
    usePostApiReq();
  const { res: getOrderRes, fetchData: getOrder } = useGetApiReq();

  const getOrderDetails = useCallback(() => {
    getOrder(`/admin/get-order-details?orderId=${id}`);
  }, [getOrder, id]);

  useEffect(() => {
    getOrderDetails();
  }, [getOrderDetails]);

  useEffect(() => {
    if (getOrderRes?.status === 200 || getOrderRes?.status === 201) {
      setTimeout(() => {
        setState(getOrderRes.data.data);
        setStatus(getOrderRes.data.data.status);
        setLedger(getOrderRes.data.paymentLedger);
      }, 0);
    }
  }, [getOrderRes]);

  useEffect(() => {
    if (invoiceRes?.status === 200 || invoiceRes?.status === 201) {
      const url = invoiceRes?.data?.pdfUrl;
      if (!url) {
        toast.error("No PDF URL received");
        return;
      }
      setPdfUrl(url);
      setIsInvoiceOpen(true);
    }
  }, [invoiceRes]);

  const handleViewInvoice = () => {
    if (!state?._id) return;
    getInvoice(`/invoice/download/${state._id}`);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    changeOrderStatus(`/admin/change-order-status/${state?._id}`, {
      status: value,
    });
  };

  useEffect(() => {
    if (changeOrderStatusRes?.status === 200 || changeOrderStatusRes?.status === 201) {
      toast.success("Order status updated successfully");
      getOrderDetails();
    }
  }, [changeOrderStatusRes, getOrderDetails]);

  const handleOpenAssignPartner = (booking) => {
    setSelectedBooking(booking);
    setIsPartnerModalOpen(true);
  };

  const handleOpenAssignPartnerFromHeader = () => {
    const firstAssignable = state?.items?.find((item) => {
      const booking = item?.bookingId || {};
      return booking.status !== "cancelled" && booking.status !== "completed";
    });

    if (firstAssignable?.bookingId) {
      setSelectedBooking(firstAssignable.bookingId);
      setIsPartnerModalOpen(true);
      return;
    }

    toast.error("No assignable booking found in this order");
  };

  const handleContactCustomer = () => {
    const phone = state?.user?.phone;
    if (!phone) {
      toast.error("Customer phone number is not available");
      return;
    }
    window.open(`tel:${phone}`, "_self");
  };

  const handleRefundAction = () => {
    const firstBookingId = state?.items?.[0]?.bookingId?._id;
    if (!firstBookingId) {
      toast.error("No linked booking found for refund review");
      return;
    }
    navigate(`/admin/bookings/${firstBookingId}`);
  };

  const isPaymentPending =
    ledger &&
    !["paid", "settled", "completed"].includes(
      String(ledger.paymentStatus || "").toLowerCase(),
    );

  const isPartnerUnassigned = state?.items?.some((item) => {
    const booking = item?.bookingId || {};
    return (
      booking.status !== "cancelled" &&
      booking.status !== "completed" &&
      !booking.sellerId &&
      !booking.assignedSellerId
    );
  });

  const hasOverdueBooking = state?.items?.some((item) =>
    isBookingOverdue(item?.bookingId || {}),
  );

  const isRefundFailed =
    String(state?.refundInfo?.status || "").toLowerCase() === "failed";

  return (
    <>
      <Wrapper>
        <OrderHeader
          order={state}
          status={status}
          onStatusChange={handleStatusChange}
          onViewInvoice={handleViewInvoice}
          isInvoiceLoading={isInvoiceLoading}
          onAssignPartnerClick={handleOpenAssignPartnerFromHeader}
          onRefundClick={handleRefundAction}
          onContactClick={handleContactCustomer}
        />

        <AnimatePresence>
          <div className="mt-4 space-y-3">
            {isRefundFailed && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <h5 className="font-semibold">Refund Failed</h5>
                  <p className="mt-0.5 text-xs leading-normal text-rose-700/90">
                    The latest refund attempt failed. Review the booking refund
                    and payment ledger details before retrying.
                  </p>
                </div>
              </motion.div>
            )}

            {isPartnerUnassigned && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h5 className="font-semibold">Matching Professional Required</h5>
                  <p className="mt-0.5 text-xs leading-normal text-amber-700/90">
                    One or more bookings in this order still need partner allocation.
                  </p>
                </div>
              </motion.div>
            )}

            {hasOverdueBooking && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <h5 className="font-semibold">Overdue Service Ticket</h5>
                  <p className="mt-0.5 text-xs leading-normal text-rose-700/90">
                    At least one scheduled booking time has passed without completion.
                  </p>
                </div>
              </motion.div>
            )}

            {isPaymentPending && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800"
              >
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h5 className="font-semibold">Payment Pending</h5>
                  <p className="mt-0.5 text-xs leading-normal text-amber-700/90">
                    Outstanding dues: {amountFormatter.format(ledger?.remainingBalance || 0)}.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Value
            </span>
            <p className="mt-1 text-2xl font-bold text-gray-950">
              {amountFormatter.format(Number(state?.orderValue || 0))}
            </p>
            <span className="mt-1 block text-[10px] text-gray-400">
              Taxes and fees included
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Payment Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  !isPaymentPending ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <p className="text-2xl font-bold capitalize text-gray-950">
                {ledger?.paymentStatus || "COD"}
              </p>
            </div>
            <span className="mt-1 block text-[10px] text-gray-400">
              Method: {ledger?.lastMethod || state?.paymentType || "COD"}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Allocated Professional
            </span>
            <p className="mt-1.5 truncate text-lg font-bold text-gray-950">
              {state?.items?.[0]?.bookingId?.sellerId?.name ||
                state?.items?.[0]?.bookingId?.assignedSellerId?.name ||
                "Unassigned"}
            </p>
            <span className="mt-1 block text-[10px] text-gray-400">
              {isPartnerUnassigned ? "Needs allocation" : "Partner assigned"}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              First Booking Slot
            </span>
            <p className="mt-1.5 truncate text-lg font-bold text-gray-950">
              {state?.items?.[0]?.bookingId?.bookingDate
                ? formatDateOnly(state.items[0].bookingId.bookingDate, "dd MMM")
                : "N/A"}
            </p>
            <span className="mt-1 block text-[10px] text-gray-400">
              {state?.items?.[0]?.bookingId?.bookingTime
                ? formatSlotTime(state.items[0].bookingId.bookingTime, "hh:mm aa")
                : "N/A"}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12"
        >
          <div className="space-y-6 xl:col-span-8">
            <OrderTimeline order={state} ledger={ledger} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Booked Services ({state?.items?.length || 0})
                </h3>
              </div>
              <div className="space-y-4">
                {state?.items?.map((item, idx) => (
                  <ServiceItemCard
                    key={idx}
                    item={item}
                    onAssignClick={handleOpenAssignPartner}
                    onViewDetails={(bookingId) =>
                      navigate(`/admin/bookings/${bookingId}`)
                    }
                  />
                ))}
              </div>
            </div>

            <OrderNotesCard
              orderId={state?._id}
              initialSystemComment={state?.adminComment}
              orderNotes={state?.orderNotes}
              onNoteAdded={getOrderDetails}
            />
          </div>

          <div className="space-y-6 xl:col-span-4">
            <CustomerProfileCard
              user={state?.user}
              order={state}
              onProfileClick={(userId) => navigate(`/admin/customers/${userId}`)}
            />

            <AssignedPartnerCard
              items={state?.items}
              onAssignClick={handleOpenAssignPartner}
              onPartnerDetailsClick={(partnerId) =>
                navigate(`/admin/partners/${partnerId}`)
              }
            />

            <PaymentLedgerCard
              ledger={ledger}
              paymentType={state?.paymentType}
            />

            <OrderSummaryCard order={state} />

            <RefundInfoCard order={state} />
          </div>
        </motion.div>
      </Wrapper>

      {isPartnerModalOpen && selectedBooking && (
        <AssignedPartnerModal
          setIsModalOpen={setIsPartnerModalOpen}
          serviceId={
            selectedBooking.product?.serviceId ||
            selectedBooking.package?.serviceId ||
            ""
          }
          bookingId={selectedBooking._id}
          getBooking={getOrderDetails}
          assignedSellerId={
            selectedBooking.assignedSellerId ||
            selectedBooking.sellerId?._id ||
            ""
          }
        />
      )}

      {isInvoiceOpen && (
        <InvoiceDialog
          open={isInvoiceOpen}
          setOpen={setIsInvoiceOpen}
          pdfUrl={pdfUrl}
        />
      )}
    </>
  );
}
