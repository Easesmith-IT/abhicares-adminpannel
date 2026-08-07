import { isValid } from "date-fns";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  FileText,
  Map,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Send,
  Star,
  CreditCard,
  Download,
  AlertCircle,
  Phone,
  ArrowRight,
  Lock,
  Plus
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";
import Wrapper from "../../components/wrappers/Wrapper";
import MapContainer from "../../components/booking/MapContainer";
import AssignedPartnerModal from "../../components/booking/AssignedPartnerModal";
import useGetApiReq from "../../hooks/useGetApiReq";
import { BackLink } from "../../components/shared/back-link";
import BookingDetailsSkeleton from "../../components/booking/BookingDetailsSkeleton";
import RefundStatusModal from "../../components/booking/RefundStatusModal";
import AutoAsignedCard from "../../components/booking/AutoAsignedCard";
import InvoiceDialog from "../orders/InvoiceDialog";
import { formatDateOnly, formatInstant, formatSlotTime, isBookingOverdue } from "@/utils/dateTime";
import {
  BOOKING_STATUS_ACTION_OPTIONS,
  getBookingStatusMeta,
  toBookingStatusActionValue,
} from "@/utils/bookingStatus";

const formatAmount = (value) => {
  const num = Number(value || 0);
  return Number(num.toFixed(2));
};

const BookingDetails = () => {
  const { id } = useParams();

  // API Hooks
  const { res, fetchData: getBooking } = useGetApiReq();
  const {
    res: invoiceRes,
    fetchData: getInvoice,
    isLoading: isInvoiceLoading,
  } = useGetApiReq();
  const { res: updateRes, fetchData: updateStatus, isLoading: isUpdateLoading } = usePatchApiReq();
  const { res: addNoteRes, fetchData: addNote, isLoading: isAddNoteLoading } = usePostApiReq();

  // Local State
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("");
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [bookingPayment, setBookingPayment] = useState(null);
  const [lifetimeBookings, setLifetimeBookings] = useState(0);
  const [partnerWallet, setPartnerWallet] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  
  // Note formulation
  const [noteText, setNoteText] = useState("");

  const bookingStatusMeta = useMemo(
    () => getBookingStatusMeta(booking?.status),
    [booking?.status],
  );

  const getBookingDetails = useCallback(() => {
    getBooking(`/admin/get-booking-details/${id}`);
  }, [getBooking, id]);

  useEffect(() => {
    if (id) getBookingDetails();
  }, [id, getBookingDetails]);

  useEffect(() => {
    if (res?.status === 200) {
      const data = res.data;
      setBooking(data.bookingDetails);
      setStatus(toBookingStatusActionValue(data.bookingDetails?.status || ""));
      setLedger(data.paymentLedger);
      setBookingPayment(data.bookingPayment);
      setLifetimeBookings(data.lifetimeBookings || 0);
      setPartnerWallet(data.partnerWallet);
      setServiceName(data.serviceName || "");
      setCategoryName(data.categoryName || "");
    }
  }, [res]);

  useEffect(() => {
    if (invoiceRes?.status === 200 || invoiceRes?.status === 201) {
      const url = invoiceRes?.data?.pdfUrl;
      if (!url) {
        toast.error("No invoice PDF was returned");
        return;
      }

      setPdfUrl(url);
      setIsInvoiceOpen(true);
    }
  }, [invoiceRes]);

  const handleStatusUpdate = () => {
    if (!status) return;
    updateStatus(`/admin/update-seller-order-status/${booking._id}`, {
      status,
    });
  };

  useEffect(() => {
    if (updateRes?.status === 200) {
      toast.success("Booking status updated successfully");
      getBookingDetails();
    }
  }, [updateRes, getBookingDetails]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(`/admin/add-booking-note/${booking._id}`, {
      text: noteText,
    });
  };

  const handleViewInvoice = () => {
    const orderId =
      typeof booking?.orderId === "object" ? booking?.orderId?._id : booking?.orderId;

    if (!orderId) {
      toast.error("No linked order invoice is available for this booking");
      return;
    }

    getInvoice(`/invoice/download/${orderId}`);
  };

  useEffect(() => {
    if (addNoteRes?.status === 200) {
      toast.success("Internal note added successfully");
      setNoteText("");
      getBookingDetails();
    }
  }, [addNoteRes, getBookingDetails]);

  // Operational Status Bar Index logic
  const activeStageIndex = useMemo(() => {
    if (!booking) return 0;
    const currentLocStatus = booking.currentLocation?.status;
    const bStatus = booking.status;

    if (bStatus === "cancelled" || currentLocStatus === "cancelled") {
      return 5; // Cancelled
    }
    if (bStatus === "completed" || currentLocStatus === "completed") {
      return 5; // Completed
    }
    if (bStatus === "in-progress" || currentLocStatus === "started") {
      return 4; // In Progress
    }
    if (currentLocStatus === "reached") {
      return 3; // Arrived
    }
    if (currentLocStatus === "out-of-delivery") {
      return 2; // En Route
    }
    if (booking.sellerId || booking.assignedSellerId) {
      return 1; // Provider Assigned
    }
    return 0; // Booking Placed
  }, [booking]);

  const isCancelled = booking?.status === "cancelled";

  // Dynamic Timeline builder
  const timelineEvents = useMemo(() => {
    const events = [];
    if (!booking) return events;

    // 1. Booking Created
    events.push({
      id: "created",
      title: "Booking Placed",
      description: `Registered on ${booking.orderId?.orderPlatform || "App"} platform. Created by: ${booking.userId?.name || "Customer"}`,
      date: new Date(booking.createdAt),
      icon: <ClipboardList className="size-4 text-blue-500" />,
      color: "bg-blue-50 text-blue-600",
      actor: "Customer"
    });

    // 2. Provider Allotted
    if (booking.assignedSellerId || booking.sellerId) {
      events.push({
        id: "assigned",
        title: "Provider Allotted",
        description: `Partner ${booking.sellerId?.name || "assigned provider"} confirmed for job.`,
        date: booking.autoAssignFirstOfferedAt ? new Date(booking.autoAssignFirstOfferedAt) : new Date(booking.createdAt),
        icon: <User className="size-4 text-purple-500" />,
        color: "bg-purple-50 text-purple-600",
        actor: "System"
      });
    }

    // 3. Provider Accepted
    if (booking.status !== "not-alloted" && booking.status !== "assigned-pending") {
      events.push({
        id: "accepted",
        title: "Provider Accepted",
        description: "Provider accepted booking dispatch offer.",
        date: new Date(booking.updatedAt),
        icon: <ShieldCheck className="size-4 text-emerald-500" />,
        color: "bg-emerald-50 text-emerald-600",
        actor: "Provider"
      });
    }

    // 4. En Route
    if (["out-of-delivery", "reached", "started", "ended", "completed"].includes(booking.currentLocation?.status)) {
      events.push({
        id: "en-route",
        title: "Provider En Route",
        description: "Provider is navigating to service site.",
        date: new Date(booking.updatedAt),
        icon: <Truck className="size-4 text-amber-500" />,
        color: "bg-amber-50 text-amber-600",
        actor: "Provider"
      });
    }

    // 5. Arrived
    if (["reached", "started", "ended", "completed"].includes(booking.currentLocation?.status)) {
      events.push({
        id: "arrived",
        title: "Provider Arrived",
        description: "Provider registered arrival at dispatch coordinates.",
        date: new Date(booking.updatedAt),
        icon: <MapPin className="size-4 text-cyan-500" />,
        color: "bg-cyan-50 text-cyan-600",
        actor: "Provider"
      });
    }

    // 6. In Progress
    if (["started", "ended", "completed"].includes(booking.currentLocation?.status) || booking.status === "in-progress") {
      events.push({
        id: "started",
        title: "Service Execution Started",
        description: "Provider started service delivery work.",
        date: new Date(booking.updatedAt),
        icon: <Activity className="size-4 text-indigo-500" />,
        color: "bg-indigo-50 text-indigo-600",
        actor: "Provider"
      });
    }

    // 7. Completed or Cancelled
    if (booking.status === "completed") {
      events.push({
        id: "completed",
        title: "Service Completed",
        description: "Provider successfully closed booking ticket.",
        date: new Date(booking.updatedAt),
        icon: <CheckCircle2 className="size-4 text-green-500" />,
        color: "bg-green-50 text-green-600",
        actor: "Provider"
      });
    } else if (booking.status === "cancelled") {
      events.push({
        id: "cancelled",
        title: "Booking Cancelled",
        description: `Cancelled with reason: ${booking.cancellationReason || "Customer cancel request."}`,
        date: booking.cancelledAt ? new Date(booking.cancelledAt) : new Date(booking.updatedAt),
        icon: <XCircle className="size-4 text-red-500" />,
        color: "bg-rose-50 text-rose-600",
        actor: "Admin/Customer"
      });
    }

    // 8. Refunds
    if (booking.refundInfo && booking.refundInfo.status !== "not-applicable") {
      events.push({
        id: "refund-requested",
        title: `Refund status: ${booking.refundInfo.status.toUpperCase()}`,
        description: `Refund of ₹${formatAmount(booking.refundInfo.amount)} requested for reason: ${booking.refundInfo.reason || "N/A"}`,
        date: booking.refundInfo.processedAt ? new Date(booking.refundInfo.processedAt) : new Date(booking.updatedAt),
        icon: <DollarSign className="size-4 text-orange-500" />,
        color: "bg-orange-50 text-orange-600",
        actor: "System"
      });
    }

    // 9. Notes audit
    if (booking.notes && booking.notes.length > 0) {
      booking.notes.forEach((note, index) => {
        events.push({
          id: `note-${index}`,
          title: "Internal Note Added",
          description: `"${note.text}"`,
          date: new Date(note.createdAt),
          icon: <MessageSquare className="size-4 text-slate-500" />,
          color: "bg-slate-100 text-slate-600",
          actor: note.createdBy
        });
      });
    }

    // Sort chronologically
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [booking]);

  // Operational Alerts Stack
  const operationalAlerts = useMemo(() => {
    const alerts = [];
    if (!booking) return alerts;

    const overdue = isBookingOverdue(booking);
    
    if (overdue) {
      alerts.push({
        type: "danger",
        text: "Provider execution is late. Schedule window has expired."
      });
    }

    if (booking.status === "on-hold" || booking.status === "no-show") {
      alerts.push({
        type: "warning",
        text: `Customer unreachable/no show state triggered: ${booking.status.toUpperCase()}`
      });
    }

    if (booking.paymentType === "cash" && !booking.cashCollected) {
      alerts.push({
        type: "info",
        text: "Cash collection settlement is pending for this job."
      });
    }

    if (booking.refundInfo?.status === "pending") {
      alerts.push({
        type: "warning",
        text: "Refund request is awaiting financial operations approval."
      });
    }

    if (booking.sellerId && booking.sellerId.status !== "APPROVED") {
      alerts.push({
        type: "danger",
        text: `Provider verification status is: ${booking.sellerId.status}. Review KYC.`
      });
    }

    return alerts;
  }, [booking]);

  // Check GPS live data
  const hasGpsData = useMemo(() => {
    if (!booking?.currentLocation?.location) return false;
    const [lng, lat] = booking.currentLocation.location;
    return lng !== 0 || lat !== 0;
  }, [booking]);

  if (!booking) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <>
      <Wrapper>
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
          
          {/* Back link & actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <BackLink href={-1}>
              <span className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5">
                <ArrowLeft className="size-4" />
                Back to Bookings
              </span>
            </BackLink>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={getBookingDetails} className="flex items-center gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                <RefreshCw className="size-3.5" />
                <span>Refresh Workspace</span>
              </Button>
              
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <Select
                  value={status}
                  onValueChange={setStatus}
                  disabled={booking.status === "cancelled"}
                >
                  <SelectTrigger className="w-[160px] border-0 h-8 shadow-none text-xs font-bold capitalize">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_STATUS_ACTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleStatusUpdate}
                  disabled={booking.status === "cancelled" || isUpdateLoading}
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 rounded-lg"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Header Panel */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      Booking: #{booking.bookingId}
                    </h1>
                    {booking.orderId && (
                      <Link 
                        to={`/admin/orders/${typeof booking.orderId === "object" ? booking.orderId?._id : booking.orderId}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-850 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 py-1 px-2.5 rounded-xl transition shadow-sm"
                      >
                        View Order
                      </Link>
                    )}
                    <Badge
                      className={`${bookingStatusMeta.badgeClassName} text-xs font-bold`}
                    >
                      {bookingStatusMeta.label}
                    </Badge>
                    <Badge variant="outline" className="text-slate-500 border-slate-200 font-mono text-[10px]">
                      City: {booking.userAddress?.city || "Mumbai"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 font-medium mt-2">
                    <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Scheduled: {booking.bookingDate ? formatDateOnly(booking.bookingDate, "dd MMM yyyy") : "N/A"}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> Slot: {booking.bookingTime ? formatSlotTime(booking.bookingTime, "hh:mm a") : "N/A"}</span>
                    <span className="flex items-center gap-1"><User className="size-3.5" /> Created: {booking.createdAt ? formatDateOnly(booking.createdAt, "dd MMM yyyy") : "N/A"}</span>
                    <span className="flex items-center gap-1">Source: <span className="font-semibold text-slate-700 capitalize">{booking.orderId?.orderPlatform || "Mobile App"}</span></span>
                    <span className="flex items-center gap-1">Created By: <span className="font-semibold text-slate-700">Customer</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                  {booking.status === "cancelled" && (
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 bg-white font-bold shadow-sm">
                      <span>Refund Status</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPartnerModalOpen(true)}
                    disabled={booking.status === "cancelled"}
                    className="flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 bg-white font-bold shadow-sm hover:bg-slate-50"
                  >
                    <span>{booking.assignedSellerId || booking.sellerId ? "Reassign Provider" : "Assign Provider"}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Status Bar */}
          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Operations Tracker</span>
              <span className="text-xs font-semibold text-slate-400">Current Flow Stage: <span className="text-blue-600 font-bold capitalize">{booking.currentLocation?.status || "Placed"}</span></span>
            </div>
            <CardContent className="p-6 sm:p-8">
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2">
                
                {/* Horizontal progress bar line */}
                <div className="absolute hidden md:block top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                <div 
                  className="absolute hidden md:block top-1/2 left-4 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                  style={{ width: `${(activeStageIndex / 5) * 100}%` }}
                />

                {[
                  { label: "Booking Placed", statusKey: "booking-placed", desc: "Order Registered" },
                  { label: "Provider Assigned", statusKey: "provider-assigned", desc: "Partner Allocated" },
                  { label: "En Route", statusKey: "en-route", desc: "Provider Navigating" },
                  { label: "Arrived", statusKey: "arrived", desc: "Provider At Site" },
                  { label: "In Progress", statusKey: "in-progress", desc: "Execution Active" },
                  { label: isCancelled ? "Cancelled" : "Completed", statusKey: isCancelled ? "cancelled" : "completed", desc: isCancelled ? "Booking Void" : "Service Sealed" }
                ].map((stage, idx) => {
                  const isCompleted = idx < activeStageIndex;
                  const isActive = idx === activeStageIndex;
                  const isStageCancelled = isCancelled && idx === 5;
                  
                  let circleBg = "bg-white border-slate-200 text-slate-400";
                  if (isCompleted) circleBg = "bg-blue-600 border-blue-600 text-white";
                  if (isActive) {
                    circleBg = isStageCancelled 
                      ? "bg-rose-600 border-rose-600 text-white ring-4 ring-rose-100" 
                      : "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse";
                  }
                  if (idx === 5 && booking.status === "completed") {
                    circleBg = "bg-green-600 border-green-600 text-white";
                  }

                  return (
                    <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto text-left md:text-center">
                      <div className={`size-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${circleBg}`}>
                        {idx === 5 && booking.status === "completed" ? (
                          <CheckCircle2 className="size-5" />
                        ) : isStageCancelled ? (
                          <XCircle className="size-5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black transition-colors ${isActive ? "text-blue-600" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                          {stage.label}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-400 hidden md:block mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}

              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Booking Value", value: `₹${formatAmount(booking.orderValue)}`, color: "text-slate-900" },
              { label: "Partner Earnings", value: `₹${formatAmount(bookingPayment?.allocatedEarning ?? booking.partnerEarnings ?? booking.sellerEarnings ?? (booking.itemTotalValue - (booking.commissionAmount || 0)))}`, color: "text-emerald-600" },
              { label: "Platform Revenue", value: `₹${formatAmount((bookingPayment?.allocatedCommission != null && bookingPayment?.allocatedConvenience != null) ? (bookingPayment.allocatedCommission + bookingPayment.allocatedConvenience) : (booking.platformRevenue || ((booking.commissionAmount || 0) + (booking.convenienceAmount || 0))))}`, color: "text-blue-600" },
              { label: "Payment Status", value: booking.paymentStatus.toUpperCase(), badge: true, variant: booking.paymentStatus === "completed" ? "success" : "warning" },
              { label: "Refund Status", value: booking.refundInfo?.status ? booking.refundInfo.status.toUpperCase() : "N/A", badge: true, variant: booking.refundInfo?.status === "processed" ? "success" : booking.refundInfo?.status === "pending" ? "warning" : "secondary" },
              { label: "Duration", value: `${booking.slotDurationMinutes || 60} Mins`, color: "text-slate-900" }
            ].map((stat, i) => (
              <Card key={i} className="border border-slate-200 bg-white rounded-xl shadow-sm">
                <CardContent className="p-4 flex flex-col justify-between h-full min-h-[84px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{stat.label}</span>
                  {stat.badge ? (
                    <Badge className="w-fit mt-1.5 text-[9px] font-bold" variant={stat.variant}>
                      {stat.value}
                    </Badge>
                  ) : (
                    <span className={`text-lg font-black mt-1.5 block ${stat.color}`}>{stat.value}</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Content Area (Tabs) */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-xl w-full sm:w-auto flex justify-start space-x-1 shadow-sm overflow-x-auto">
                  <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-xs font-bold">Logistics & Maps</TabsTrigger>
                  <TabsTrigger value="service" className="rounded-lg px-4 py-2 text-xs font-bold">Ordered Services</TabsTrigger>
                  <TabsTrigger value="financials" className="rounded-lg px-4 py-2 text-xs font-bold">Ledger & Settlement</TabsTrigger>
                  <TabsTrigger value="timeline" className="rounded-lg px-4 py-2 text-xs font-bold">Activity Audit</TabsTrigger>
                  <TabsTrigger value="notes" className="rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1.5">
                    <span>Internal Notes</span>
                    {booking.notes?.length > 0 && (
                      <span className="bg-blue-600 text-white size-4 rounded-full flex items-center justify-center text-[9px]">
                        {booking.notes.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Logistics & Maps Tab */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Service Location & Mapping</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Service Address</span>
                          <span className="font-bold text-slate-800">{booking.userAddress?.addressLine || "-"}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Landmark & Pincode</span>
                          <span className="font-bold text-slate-800">
                            {booking.userAddress?.landmark ? `${booking.userAddress.landmark} | ` : ""}
                            {booking.userAddress?.pincode || "-"}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Dispatch Coordinates</span>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-bold text-slate-800 font-mono">
                              {booking.userAddress?.location?.coordinates
                                ? `${booking.userAddress.location.coordinates[1].toFixed(5)}, ${booking.userAddress.location.coordinates[0].toFixed(5)}`
                                : "N/A"}
                            </span>
                            {booking.userAddress?.location?.coordinates && (
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${booking.userAddress.location.coordinates[1]},${booking.userAddress.location.coordinates[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-blue-600 hover:underline"
                              >
                                Open in Maps
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dispatch Telemetry */}
                      {hasGpsData && (
                        <div className="space-y-3">
                          <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                            <Truck className="size-4 text-blue-500" />
                            <span>Live Dispatch Telemetry</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-100 p-4 rounded-xl">
                            <div>
                              <span className="text-slate-400 font-bold block">Live Telemetry Distance</span>
                              <span className="font-bold text-slate-800 mt-1 block">4.2 km</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Estimated Transit Duration</span>
                              <span className="font-bold text-slate-800 mt-1 block">12 mins away</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Map Preview */}
                      <div className="space-y-3">
                        <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                          <Map className="size-4 text-slate-500" />
                          <span>Spatial Routing Preview</span>
                        </h4>
                        
                        {booking.userAddress?.location?.coordinates ? (
                          <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                            <MapContainer
                              sellerStatus={booking.currentLocation?.status}
                              bookingStatus={booking.status}
                              location={{
                                user: booking.userAddress?.location?.coordinates || [28.6139, 77.2090],
                                seller: booking.currentLocation?.location || [28.6139, 77.2090],
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-[280px] w-full rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                            <MapPin className="size-8 stroke-[1.5] mb-2 text-slate-300" />
                            <span className="text-xs font-semibold">Location Not Available</span>
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </Card>

                  {/* Auto Assignment Details */}
                  {(booking.assignmentType === "auto" || booking.autoAssigned === true || booking.autoAssignRetryCount > 0) && (
                    <AutoAsignedCard booking={booking} className="mt-6" />
                  )}
                </TabsContent>

                {/* Ordered Services Tab */}
                <TabsContent value="service" className="mt-6 space-y-6">
                  <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-slate-100 px-6 py-5">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Service Line Items</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <img
                            className="size-16 rounded-xl object-cover border border-slate-100 bg-white shrink-0 shadow-sm"
                            src={`${import.meta.env.VITE_APP_IMAGE_URL}/${
                              booking.package
                                ? booking?.package?.imageUrl?.[0]
                                : booking?.product?.imageUrl?.[0]
                            }`}
                            alt="product thumbnail"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop";
                            }}
                          />
                          <div>
                            <p className="font-black text-slate-900 text-sm">
                              {booking.package ? booking.package.name : booking.product?.name || "Service Item"}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                              {booking.package ? "Package Bundle" : "Product Item"}
                            </span>
                            <div className="flex gap-4 mt-2 text-[11px] font-semibold text-slate-500">
                              {categoryName && <span>Category: <span className="text-slate-800">{categoryName}</span></span>}
                              {serviceName && <span>Subcategory: <span className="text-slate-800">{serviceName}</span></span>}
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <p className="text-xs text-slate-500 font-bold">Qty: {booking.quantity}</p>
                          <p className="font-black text-slate-900 text-base">
                            ₹
                            {formatAmount(booking.quantity *
                              (booking.package
                                ? booking.package.offerPrice
                                : (booking.product?.offerPrice || 0)))}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="border border-slate-100 p-5 rounded-2xl bg-white space-y-3.5 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-2">Operational Timing</h4>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Booking Date</span>
                            <span className="font-bold text-slate-800">{booking.bookingDate ? formatDateOnly(booking.bookingDate, "dd MMMM yyyy") : "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Scheduled Slot</span>
                            <span className="font-bold text-slate-800">
                              {booking.bookingTime ? formatSlotTime(booking.bookingTime, "hh:mm a") : "-"} 
                              {booking.slotDurationMinutes ? ` (${booking.slotDurationMinutes} Mins)` : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Expected Duration</span>
                            <span className="font-bold text-slate-800">1 Hour</span>
                          </div>
                        </div>

                        <div className="border border-slate-100 p-5 rounded-2xl bg-white space-y-3.5 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-2">System Timestamps</h4>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Created Date</span>
                            <span className="font-bold text-slate-800">{booking.createdAt ? formatInstant(booking.createdAt, "dd MMM yyyy, hh:mm a") : "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Last Updated</span>
                            <span className="font-bold text-slate-800">{booking.updatedAt ? formatInstant(booking.updatedAt, "dd MMM yyyy, hh:mm a") : "-"}</span>
                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Ledger & Settlement Tab */}
                <TabsContent value="financials" className="mt-6 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Bill</span>
                      <span className="text-lg font-black text-slate-800">₹{formatAmount(ledger?.totalBillAmount ?? booking.orderValue)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Paid</span>
                      <span className="text-lg font-black text-green-600">₹{formatAmount(ledger?.totalPaid ?? 0)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Refunded</span>
                      <span className="text-lg font-black text-slate-800">₹{formatAmount(ledger?.totalRefunded ?? 0)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Remaining</span>
                      <span className="text-lg font-black text-blue-600">₹{formatAmount(ledger?.remainingBalance ?? 0)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                      <CardHeader className="border-b border-slate-100 px-6 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <DollarSign className="size-4 text-slate-400" />
                          <span>Billing Ledger Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4 text-xs text-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Transaction Method</span>
                          <span className="font-bold text-slate-900 uppercase font-mono">{booking.paymentType || ledger?.lastMethod || "COD"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Gateway Ref / Trans ID</span>
                          <span className="font-bold text-slate-900 font-mono">{booking.onlinePaymentId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Payment Status</span>
                          <Badge className="text-[10px] font-bold" variant={booking.paymentStatus === "completed" ? "success" : "warning"}>
                            {booking.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Platform Settled State</span>
                          <Badge className="text-[10px] font-bold" variant={ledger?.settled ? "success" : "secondary"}>
                            {ledger?.settled ? "Settled" : "Unsettled"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Paid Timestamp</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {ledger?.lastPaidAt ? formatInstant(ledger.lastPaidAt, "dd MMM yyyy, hh:mm a") : "N/A"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
                      <CardHeader className="border-b border-slate-100 px-6 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <TrendingUp className="size-4 text-slate-400" />
                          <span>Platform Settlement Summary</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4 text-xs text-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Partner Earnings</span>
                          <span className="font-black text-slate-900">₹{formatAmount(bookingPayment?.allocatedEarning ?? booking.partnerEarnings ?? booking.sellerEarnings ?? (booking.itemTotalValue - (booking.commissionAmount || 0)))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Commission Invoiced</span>
                          <span className="font-black text-slate-900">₹{formatAmount(booking.commissionAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Convenience Fee</span>
                          <span className="font-black text-slate-900">₹{formatAmount(booking.convenienceAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Tax / GST Details</span>
                          <span className="font-bold text-slate-900 font-mono">
                            ₹{formatAmount((booking.commissionGst || 0) + (booking.convenienceGst || 0) + (booking.itemTotalTax || 0))}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-bold">Net Platform Earning</span>
                          <span className="font-black text-blue-600 text-sm">₹{formatAmount(bookingPayment?.allocatedEarning || ((booking.commissionAmount || 0) + (booking.convenienceAmount || 0)))}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {booking.orderId?.couponInfo?.applied && (
                    <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                      <CardHeader className="border-b border-slate-100 px-6 py-4">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Coupon & Offer Campaign</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Coupon Code</span>
                          <Badge className="font-mono text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100">
                            {booking.orderId.couponInfo.code}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Coupon Discount</span>
                          <span className="font-black text-green-600 block mt-1">₹{formatAmount(booking.orderId.couponInfo.discountAmount || booking.itemTotalDiscount)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Campaign Name</span>
                          <span className="font-bold text-slate-800 block mt-1">{booking.orderId.offerSettlement?.code || "Default Campaign"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Offer Source</span>
                          <span className="font-bold text-slate-800 block mt-1 capitalize">{booking.orderId?.orderPlatform || "App Promo"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                </TabsContent>

                {/* Activity Audit Tab */}
                <TabsContent value="timeline" className="mt-6">
                  <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-slate-100 px-6 py-5">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">System Activity Audit Trail</CardTitle>
                      <CardDescription>Chronological logging of booking status cycles and administrative interactions.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {timelineEvents.map((event, eventIdx) => (
                            <li key={event.id}>
                              <div className="relative pb-8">
                                {eventIdx !== timelineEvents.length - 1 ? (
                                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className={`size-8 rounded-lg flex items-center justify-center border border-slate-200/50 shadow-sm ${event.color}`}>
                                      {event.icon}
                                    </span>
                                  </div>
                                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-black text-slate-900">{event.title}</p>
                                        <Badge variant="outline" className="text-[8px] font-bold uppercase py-0 px-1.5 border-slate-200 text-slate-500">
                                          {event.actor}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-slate-400 font-mono">
                                      <time dateTime={event.date.toISOString()}>
                                        {formatInstant(event.date, "dd MMM, hh:mm a")}
                                      </time>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Internal Notes Tab */}
                <TabsContent value="notes" className="mt-6 space-y-6">
                  
                  <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-slate-100 px-6 py-5">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Internal Operations Notes Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      
                      {booking.notes && booking.notes.length > 0 ? (
                        <div className="space-y-4">
                          {booking.notes.map((note, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                              <div className="flex justify-between items-center text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <div className="size-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[9px] uppercase">
                                    {note.createdBy.charAt(0)}
                                  </div>
                                  <span className="font-black text-slate-700">{note.createdBy}</span>
                                </div>
                                <span className="font-mono">{formatInstant(note.createdAt, "dd MMM yyyy, hh:mm a")}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {note.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50/20">
                          <MessageSquare className="size-8 stroke-[1.5] mx-auto mb-2 text-slate-300" />
                          <p className="text-xs font-bold">No internal operations notes added</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Use the compiler below to capture operations adjustments.</p>
                        </div>
                      )}

                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader className="px-6 py-5 border-b border-slate-100">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Write Operations Note</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <Textarea
                        placeholder="Type operational notes here (e.g. VIP customer priority, partner traffic delays, refund manual overrides...)"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="min-h-[100px] text-xs font-semibold rounded-xl border-slate-200 focus:border-blue-500"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddNote} 
                          disabled={!noteText.trim() || isAddNoteLoading} 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 px-4 h-9 shadow-sm"
                        >
                          <Send className="size-3.5" />
                          <span>Submit Audit Note</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>
              </Tabs>
            </div>

            {/* Right column (Context Rail) */}
            <div className="space-y-6">
              
              {/* Operational Alerts */}
              {operationalAlerts.length > 0 && (
                <div className="space-y-3">
                  {operationalAlerts.map((alert, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border text-xs font-bold flex items-start gap-2.5 shadow-sm transition-all duration-300 ${
                        alert.type === "danger" 
                          ? "bg-rose-50 border-rose-100 text-rose-800"
                          : alert.type === "warning"
                          ? "bg-amber-50 border-amber-100 text-amber-800"
                          : "bg-blue-50 border-blue-100 text-blue-800"
                      }`}
                    >
                      <AlertCircle className={`size-4 shrink-0 mt-0.5 ${
                        alert.type === "danger" ? "text-rose-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"
                      }`} />
                      <span>{alert.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customer Details */}
              <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer context</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5 text-xs text-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-inner uppercase">
                      {booking.userId?.name ? booking.userId.name.substring(0, 2) : "C"}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{booking.userId?.name || "-"}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {booking.userId?._id || "-"}</span>
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Contact Phone</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{booking.userId?.phone || "-"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Email Address</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{booking.userId?.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Registered City</span>
                      <span className="font-bold text-slate-800 mt-0.5 block capitalize">{booking.userAddress?.city || "Mumbai"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-bold text-[9px] uppercase block">Lifetime Bookings</span>
                      <span className="text-base font-black text-slate-900 mt-0.5 block flex items-center gap-1">
                        <span>{lifetimeBookings}</span>
                        <Star className="size-3 text-amber-500 fill-amber-500" />
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold text-[9px] uppercase block">Wallet Balance</span>
                      <span className="text-base font-black text-slate-900 mt-0.5 block">₹{formatAmount(booking.userId?.wallet?.balance ?? 0)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2 w-full">
                    {booking.userId?._id && (
                      <Link 
                        to={`/admin/customers/${booking.userId._id}`}
                        className="flex-1 text-center font-bold text-[10px] border border-slate-200 py-2 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                      >
                        View Customer
                      </Link>
                    )}
                    {booking.userId?.phone && (
                      <>
                        <a 
                          href={`tel:${booking.userId.phone}`}
                          className="size-8 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                        >
                          <Phone className="size-3.5" />
                        </a>
                        <a 
                          href={`https://wa.me/91${booking.userId.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-8 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                        >
                          <MessageSquare className="size-3.5" />
                        </a>
                      </>
                    )}
                  </div>

                </CardContent>
              </Card>

              {/* Provider Details */}
              <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Provider context</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {booking.sellerId ? (
                    <div className="space-y-5 text-xs text-slate-700">
                      
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-inner uppercase">
                          {booking.sellerId.name ? booking.sellerId.name.substring(0, 2) : "P"}
                        </div>
                        <div>
                          <Link 
                            to={`/admin/partners/${booking.sellerId._id}`} 
                            className="font-black text-blue-600 hover:underline text-sm block"
                          >
                            {booking.sellerId.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {booking.sellerId.partnerId || booking.sellerId._id}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Verification Status</span>
                            <span className="font-bold text-slate-800 mt-0.5 block">{booking.sellerId.status}</span>
                          </div>
                          <Badge className="text-[9px] font-bold" variant={booking.sellerId.status === "APPROVED" ? "success" : "warning"}>
                            {booking.sellerId.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Contact Phone</span>
                          <span className="font-bold text-slate-800 font-mono mt-0.5 block">{booking.sellerId.phone || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Email Address</span>
                          <span className="font-bold text-slate-800 font-mono mt-0.5 block">{booking.sellerId.email || "N/A"}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold text-[9px] uppercase block">Cash in hand</span>
                          <span className="text-base font-black text-slate-900 mt-0.5 block">
                            ₹{formatAmount(partnerWallet?.cashInHand ?? 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold text-[9px] uppercase block">Pending Cashout</span>
                          <span className="text-base font-black text-slate-900 mt-0.5 block">
                            ₹{formatAmount(partnerWallet?.pendingCashouts ?? 0)}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2 w-full">
                        <Link 
                          to={`/admin/partners/${booking.sellerId._id}`}
                          className="flex-1 text-center font-bold text-[10px] border border-slate-200 py-2 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                        >
                          View Partner
                        </Link>
                        {booking.sellerId.phone && (
                          <>
                            <a 
                              href={`tel:${booking.sellerId.phone}`}
                              className="size-8 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                            >
                              <Phone className="size-3.5" />
                            </a>
                            <a 
                              href={`https://wa.me/91${booking.sellerId.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="size-8 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition"
                            >
                              <MessageSquare className="size-3.5" />
                            </a>
                          </>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <AlertTriangle className="size-7 text-amber-500 mx-auto" />
                      <p className="text-xs text-slate-500 font-bold">No service provider assigned to this booking yet.</p>
                      <Button
                        size="sm"
                        onClick={() => setIsPartnerModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl"
                      >
                        Allot Partner Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Invoice Summary */}
              <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Subtotal</span>
                    <span className="font-bold text-slate-800">₹{formatAmount(booking.itemTotalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Estimated GST</span>
                    <span className="font-bold text-slate-800">₹{formatAmount(booking.itemTotalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Convenience Fee</span>
                    <span className="font-bold text-slate-800">₹{formatAmount(booking.convenienceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="font-bold uppercase tracking-wider text-[9px]">Coupon Discount</span>
                    <span className="font-black">- ₹{formatAmount(booking.itemTotalDiscount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-slate-950 font-black text-sm">
                    <span>Invoice Total</span>
                    <span>₹{formatAmount(booking.orderValue)}</span>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewInvoice}
                    className="w-full border-slate-200 text-slate-700 bg-white font-bold text-xs flex items-center justify-center gap-1.5 h-9 rounded-xl shadow-sm hover:bg-slate-50"
                  >
                    <Download className="size-3.5" />
                    <span>{isInvoiceLoading ? "Loading Invoice..." : "Download Invoice PDF"}</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Refund Summary */}
              {booking.refundInfo && booking.refundInfo.status !== "not-applicable" && (
                <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                  <CardHeader className="border-b border-slate-100 px-6 py-5">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Refund Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-xs text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                      <Badge className="text-[9px] font-bold" variant={booking.refundInfo.status === "processed" ? "success" : "warning"}>
                        {booking.refundInfo.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Amount</span>
                      <span className="font-black text-slate-800">₹{formatAmount(booking.refundInfo.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Reason</span>
                      <span className="font-bold text-slate-800">{booking.refundInfo.reason || "-"}</span>
                    </div>
                    {booking.refundInfo.processedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Processed Date</span>
                        <span className="font-bold text-slate-800 font-mono">{formatDateOnly(booking.refundInfo.processedAt, "dd MMM yyyy")}</span>
                      </div>
                    )}
                    {booking.refundInfo.refundId && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Reference ID</span>
                        <span className="font-bold text-slate-800 font-mono">{booking.refundInfo.refundId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            </div>

          </div>
        </div>
      </Wrapper>

      {/* Modals */}
      {isModalOpen && (
        <RefundStatusModal
          bookingId={booking._id}
          open={isModalOpen}
          setOpen={setIsModalOpen}
          getBookingDetails={getBookingDetails}
        />
      )}

      {isPartnerModalOpen && (
        <AssignedPartnerModal
          setIsModalOpen={setIsPartnerModalOpen}
          serviceId={
            booking.product
              ? booking.product.serviceId
              : booking.package?.serviceId
          }
          bookingId={booking._id}
          getBooking={getBookingDetails}
          assignedSellerId={booking?.assignedSellerId}
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
};

export default BookingDetails;
