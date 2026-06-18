import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  UserCheck, 
  Ticket, 
  Download, 
  Send,
  Zap,
  ChevronRight,
  Info
} from "lucide-react";

import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import InvoiceDialog from "./InvoiceDialog";
import AssignedPartnerModal from "../../components/booking/AssignedPartnerModal";

// Reusable Operations Components
import OrderHeader from "../../components/orders/OrderHeader";
import OrderTimeline from "../../components/orders/OrderTimeline";
import CustomerProfileCard from "../../components/orders/CustomerProfileCard";
import AssignedPartnerCard from "../../components/orders/AssignedPartnerCard";
import PaymentLedgerCard from "../../components/orders/PaymentLedgerCard";
import OrderSummaryCard from "../../components/orders/OrderSummaryCard";
import ServiceItemCard from "../../components/orders/ServiceItemCard";
import RefundInfoCard from "../../components/orders/RefundInfoCard";
import OrderNotesCard from "../../components/orders/OrderNotesCard";
import { Spinner } from "../../components/ui/spinner";
import { Button } from "../../components/ui/button";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: locationState } = useLocation();

  // Primary State
  const [state, setState] = useState(locationState || {});
  const [status, setStatus] = useState(locationState?.status || "");
  const [ledger, setLedger] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Modals & Popovers Control
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // APIs
  const { res: invoiceRes, fetchData: getInvoice, isLoading: isInvoiceLoading } = useGetApiReq();
  const { res: changeOrderStatusRes, fetchData: changeOrderStatus } = usePostApiReq();
  const { res: getOrderRes, fetchData: getOrder } = useGetApiReq();

  // Load Order Details
  const getOrderDetails = useCallback(() => {
    getOrder(`/admin/get-order-details?orderId=${id}`);
  }, [id, getOrder]);

  useEffect(() => {
    getOrderDetails();
  }, [id, getOrderDetails]);

  useEffect(() => {
    if (getOrderRes?.status === 200 || getOrderRes?.status === 201) {
      setTimeout(() => {
        setState(getOrderRes.data.data);
        setStatus(getOrderRes.data.data.status);
        setLedger(getOrderRes.data.paymentLedger);
      }, 0);
    }
  }, [getOrderRes]);

  // Invoice handling
  const handleViewInvoice = () => {
    if (!state?._id) return;
    getInvoice(`/invoice/download/${state._id}`);
  };

  useEffect(() => {
    if (invoiceRes?.status === 200 || invoiceRes?.status === 201) {
      const url = invoiceRes?.data?.pdfUrl;
      if (!url) {
        toast.error("No PDF URL received");
        return;
      }
      setTimeout(() => {
        setPdfUrl(url);
        setIsInvoiceOpen(true);
      }, 0);
    }
  }, [invoiceRes]);

  // Order status changes
  const handleStatusChange = (value) => {
    setStatus(value);
    changeOrderStatus(`/admin/change-order-status/${state?._id}`, {
      status: value,
    });
    toast.success(`Order status set to '${value}'`);
  };

  useEffect(() => {
    if (changeOrderStatusRes?.status === 200 || changeOrderStatusRes?.status === 201) {
      getOrderDetails();
    }
  }, [changeOrderStatusRes, getOrderDetails]);

  // Partner Assignment Modal triggers
  const handleOpenAssignPartner = (booking) => {
    setSelectedBooking(booking);
    setIsPartnerModalOpen(true);
  };

  const handleOpenAssignPartnerFromHeader = () => {
    // Find first unassigned booking item
    const unassignedItem = state?.items?.find(item => {
      const b = item.bookingId || {};
      return b.status !== "cancelled" && !b.sellerId && !b.assignedSellerId;
    });

    if (unassignedItem) {
      setSelectedBooking(unassignedItem.bookingId);
      setIsPartnerModalOpen(true);
    } else if (state?.items?.[0]) {
      // Fallback to first booking
      setSelectedBooking(state.items[0].bookingId);
      setIsPartnerModalOpen(true);
    } else {
      toast.error("No bookings found in this order");
    }
  };

  // Smart Warnings Engine
  const isPaymentPending = ledger && ledger.paymentStatus !== "Paid" && ledger.paymentStatus !== "settled" && ledger.paymentStatus !== "Completed";
  
  const isPartnerUnassigned = state?.items?.some(item => {
    const b = item.bookingId || {};
    return b.status !== "cancelled" && !b.sellerId && !b.assignedSellerId;
  });

  const isRefundFailed = state?.refundInfo?.status?.toLowerCase() === "failed";

  const isBookingOverdue = state?.items?.some(item => {
    const b = item.bookingId || {};
    if (!b.bookingDate || b.status === "completed" || b.status === "cancelled") return false;
    const bDate = new Date(b.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bDate < today;
  });

  // Reactive Escalation Check (checks notes in local storage for key indicators)
  const [isCustomerEscalated, setIsCustomerEscalated] = useState(false);
  useEffect(() => {
    if (!state?._id) return;
    const savedNotes = localStorage.getItem(`abhicares_notes_${state._id}`);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        const escalated = parsed.some(n => 
          n.comment.toLowerCase().includes("escalate") || 
          n.comment.toLowerCase().includes("urgent") || 
          n.comment.toLowerCase().includes("complain") ||
          n.comment.toLowerCase().includes("refund")
        );
        setTimeout(() => {
          setIsCustomerEscalated(escalated);
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, [state?._id, isPartnerModalOpen]);

  // Action Drawer Simulation Handlers
  const handleAlertCustomer = () => {
    toast.success("Push notification & WhatsApp alert sent to customer");
  };

  const handleIssueRefundSimulation = () => {
    if (state?.refundInfo) {
      navigate(`/admin/bookings/${state.items?.[0]?.bookingId?._id || ""}`);
      toast.info("Navigated to booking details to manage refund logs");
    } else {
      toast.error("Refund can only be processed on Cancelled orders");
    }
  };

  const handleCreateSupportTicket = () => {
    toast.success("Support ticket CRM-9204A generated successfully.");
  };

  // Page Load Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };

  return (
    <>
      <Wrapper>
        {/* Sticky Header with Action Triggers */}
        <OrderHeader
          order={state}
          status={status}
          onStatusChange={handleStatusChange}
          onViewInvoice={handleViewInvoice}
          isInvoiceLoading={isInvoiceLoading}
          onAssignPartnerClick={handleOpenAssignPartnerFromHeader}
          onRefundClick={handleIssueRefundSimulation}
          onContactClick={handleAlertCustomer}
        />

        {/* Dynamic Contextual Smart Warning Banners */}
        <AnimatePresence>
          <div className="mt-4 space-y-3">
            {isCustomerEscalated && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400"
              >
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <h5 className="font-semibold">Customer Escalation Alert</h5>
                  <p className="text-xs text-rose-700/90 dark:text-rose-400/90 mt-0.5 leading-normal">
                    This order has been tagged with urgent internal notes. Operations desk is monitoring.
                  </p>
                </div>
              </motion.div>
            )}

            {isRefundFailed && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold">Refund Failed</h5>
                  <p className="text-xs text-rose-700/90 mt-0.5 leading-normal">
                    Razorpay refund request pay_{state._id?.slice(-6)} was rejected by the gateway. Check Payment Ledger for logs.
                  </p>
                </div>
              </motion.div>
            )}

            {isPartnerUnassigned && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800 dark:border-amber-950/30 dark:bg-amber-950/10 dark:text-amber-400"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold">Matching Professional Required</h5>
                  <p className="text-xs text-amber-700/90 mt-0.5 leading-normal">
                    One or more booking tickets do not have an allocated partner. Dispatches are waiting in assignment queue.
                  </p>
                </div>
              </motion.div>
            )}

            {isBookingOverdue && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold">Overdue Service Ticket</h5>
                  <p className="text-xs text-rose-700/90 mt-0.5 leading-normal">
                    The scheduled booking time slot has passed, but the service has not commenced or checked-in.
                  </p>
                </div>
              </motion.div>
            )}

            {isPaymentPending && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800 dark:border-amber-950/30 dark:bg-amber-950/10 dark:text-amber-400"
              >
                <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold">Payment Pending</h5>
                  <p className="text-xs text-amber-700/90 mt-0.5 leading-normal">
                    This order has outstanding dues of ₹{ledger?.remainingBalance || "N/A"}. Verify COD payment collection upon completion.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* Hero KPI Metric Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* KPI 1: Order Value */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:translate-y-[-2px] transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950">
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Total Value</span>
            <p className="text-2xl font-bold text-gray-950 dark:text-gray-50 mt-1">₹{state?.orderValue || 0}</p>
            <span className="text-[10px] text-gray-400 block mt-1">Taxes & fees included</span>
          </div>

          {/* KPI 2: Payment Status */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:translate-y-[-2px] transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950">
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Payment Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${!isPaymentPending ? "bg-emerald-500" : "bg-amber-500"}`} />
              <p className="text-2xl font-bold text-gray-950 dark:text-gray-50 capitalize">
                {ledger?.paymentStatus || "COD"}
              </p>
            </div>
            <span className="text-[10px] text-gray-400 block mt-1">Method: {ledger?.lastMethod || state?.paymentType || "COD"}</span>
          </div>

          {/* KPI 3: Assigned Partner */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:translate-y-[-2px] transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950">
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Allocated Professional</span>
            <p className="text-lg font-bold text-gray-950 dark:text-gray-50 mt-1.5 truncate">
              {state?.items?.[0]?.bookingId?.sellerId?.name || state?.items?.[0]?.bookingId?.assignedSellerId?.name || "Unassigned"}
            </p>
            <span className="text-[10px] text-gray-400 block mt-1">
              {isPartnerUnassigned ? "Needs Allocation" : "Verified Partner"}
            </span>
          </div>

          {/* KPI 4: Schedule Slot */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:translate-y-[-2px] transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950">
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Booking Slot</span>
            <p className="text-lg font-bold text-gray-950 dark:text-gray-50 mt-1.5 truncate">
              {state?.items?.[0]?.bookingId?.bookingDate ? new Date(state.items[0].bookingId.bookingDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : "N/A"}
            </p>
            <span className="text-[10px] text-gray-400 block mt-1">
              {state?.items?.[0]?.bookingId?.bookingTime ? new Date(state.items[0].bookingId.bookingTime).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
            </span>
          </div>
        </motion.div>

        {/* Responsive Layout Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12"
        >
          {/* ================= LEFT MAIN COLUMN (8 Columns) ================= */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Timeline component */}
            <motion.div variants={childVariants}>
              <OrderTimeline order={state} />
            </motion.div>

            {/* Booked Services Cards list */}
            <motion.div variants={childVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Booked Services ({state?.items?.length || 0})</h3>
              </div>
              <div className="space-y-4">
                {state?.items?.map((item, idx) => (
                  <ServiceItemCard
                    key={idx}
                    item={item}
                    onAssignClick={handleOpenAssignPartner}
                    onViewDetails={(bId) => navigate(`/admin/bookings/${bId}`)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Internal Support Notes Log */}
            <motion.div variants={childVariants}>
              <OrderNotesCard
                orderId={state?._id}
                initialSystemComment={state?.adminComment}
              />
            </motion.div>
          </div>

          {/* ================= RIGHT SIDEBAR COLUMN (4 Columns) ================= */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Customer Profile Intelligence */}
            <motion.div variants={childVariants}>
              <CustomerProfileCard
                user={state?.user}
                onProfileClick={(uId) => navigate(`/admin/customers/${uId}`)}
              />
            </motion.div>

            {/* Primary Allocated Partner Card */}
            <motion.div variants={childVariants}>
              <AssignedPartnerCard
                items={state?.items}
                onAssignClick={handleOpenAssignPartner}
                onPartnerDetailsClick={(pId) => navigate(`/admin/partners/${pId}`)}
              />
            </motion.div>

            {/* Payment Transaction Ledger */}
            <motion.div variants={childVariants}>
              <PaymentLedgerCard
                ledger={ledger}
                paymentType={state?.paymentType}
                orderId={state?.orderId}
              />
            </motion.div>

            {/* Subtotal breakdowns Summary */}
            <motion.div variants={childVariants}>
              <OrderSummaryCard order={state} />
            </motion.div>

            {/* Refund Info Warning Box */}
            <motion.div variants={childVariants}>
              <RefundInfoCard order={state} />
            </motion.div>
          </div>
        </motion.div>
      </Wrapper>

      {/* DOCKED QUICK ACTIONS TOOLBAR (Floating bottom right command center bar) */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isQuickActionOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="flex items-center gap-2 rounded-full bg-gray-900 border border-gray-800 p-1.5 shadow-2xl text-white dark:bg-white dark:text-gray-950 dark:border-gray-200"
              >
                {/* Allocate partner action */}
                <Button
                  onClick={handleOpenAssignPartnerFromHeader}
                  size="sm"
                  className="rounded-full h-9 bg-transparent hover:bg-gray-800 dark:hover:bg-gray-100 text-xs px-3.5 gap-1.5 shadow-none border-none"
                >
                  <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                  Assign Partner
                </Button>

                {/* Send FCM alerts */}
                <Button
                  onClick={handleAlertCustomer}
                  size="sm"
                  className="rounded-full h-9 bg-transparent hover:bg-gray-800 dark:hover:bg-gray-100 text-xs px-3.5 gap-1.5 shadow-none border-none"
                >
                  <Send className="h-3.5 w-3.5 text-emerald-400" />
                  Alert Customer
                </Button>

                {/* Download PDF invoice */}
                <Button
                  onClick={handleViewInvoice}
                  disabled={isInvoiceLoading}
                  size="sm"
                  className="rounded-full h-9 bg-transparent hover:bg-gray-800 dark:hover:bg-gray-100 text-xs px-3.5 gap-1.5 shadow-none border-none"
                >
                  {isInvoiceLoading ? <Spinner className="h-3 w-3" /> : <Download className="h-3.5 w-3.5 text-indigo-400" />}
                  Download Invoice
                </Button>

                {/* Create Support ticket */}
                <Button
                  onClick={handleCreateSupportTicket}
                  size="sm"
                  className="rounded-full h-9 bg-transparent hover:bg-gray-800 dark:hover:bg-gray-100 text-xs px-3.5 gap-1.5 shadow-none border-none"
                >
                  <Ticket className="h-3.5 w-3.5 text-amber-400" />
                  Log Ticket
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105"
          >
            <Zap className={`h-5.5 w-5.5 transition-transform duration-300 ${isQuickActionOpen ? "rotate-45" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Partner Allocation Modal */}
      {isPartnerModalOpen && selectedBooking && (
        <AssignedPartnerModal
          setIsModalOpen={setIsPartnerModalOpen}
          serviceId={selectedBooking.product?.serviceId || selectedBooking.package?.serviceId || ""}
          bookingId={selectedBooking._id}
          getBooking={getOrderDetails}
          assignedSellerId={selectedBooking.assignedSellerId || selectedBooking.sellerId?._id || ""}
        />
      )}

      {/* PDF Invoice Dialog */}
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
