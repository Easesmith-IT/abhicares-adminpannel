import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  User,
  Calendar,
  MapPin,
  Wallet,
  Award,
  TrendingUp,
  Plus,
  Minus,
  ShieldAlert,
  DollarSign,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  Search,
  ArrowLeft,
  RefreshCw,
  Star,
  UserCheck,
  AlertTriangle,
  Map,
  Navigation,
  ClipboardList,
  Activity,
  ChevronDown,
  History,
  Info,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  Heart
} from "lucide-react";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "../../components/wrappers/Wrapper";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { formatDateOnly, formatInstant, formatSlotRange } from "@/utils/dateTime";
import {
  BOOKING_STATUS_FILTER_OPTIONS,
  getBookingStatusMeta,
  normalizeBookingStatus,
} from "@/utils/bookingStatus";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  // API hooks
  const { res: userRes, fetchData: getUser, isLoading: isUserLoading } = useGetApiReq();
  const { res: bookingsRes, fetchData: getBookings, isLoading: isBookingsLoading } = useGetApiReq();
  const { res: walletTransactionsRes, fetchData: getWalletTransactions, isLoading: isWalletTxLoading } = useGetApiReq();
  const { res: rewardsRes, fetchData: getRewards, isLoading: isRewardsLoading } = useGetApiReq();
  const { res: insightsRes, fetchData: getInsights, isLoading: isInsightsLoading } = useGetApiReq();
  const { res: addressesRes, fetchData: getAddresses, isLoading: isAddressesLoading } = useGetApiReq();

  // POST requests hooks
  const { fetchData: postCredit, isLoading: isCreditLoading } = usePostApiReq();
  const { fetchData: postDebit, isLoading: isDebitLoading } = usePostApiReq();
  const { fetchData: postAddRewards, isLoading: isAddRewardsLoading } = usePostApiReq();
  const { fetchData: postUpdateStatus, isLoading: isStatusLoading } = usePostApiReq();

  // States
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [rewardProfile, setRewardProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // Filters & Page controls
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [bookingLimit, setBookingLimit] = useState("10");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  // Timeline Page control
  const [timelinePage, setTimelinePage] = useState(1);

  // Transaction Filters
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("all");

  // Modals
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [debitModalOpen, setDebitModalOpen] = useState(false);
  const [addRewardsModalOpen, setAddRewardsModalOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);

  // Form states
  const [amountInput, setAmountInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [pointsInput, setPointsInput] = useState("");

  const fetchBookings = useCallback(() => {
    if (customerId && customerId !== "undefined") {
      getBookings(`/admin/get-customer-bookings/${customerId}?page=${bookingPage}&limit=${bookingLimit}`);
    }
  }, [customerId, getBookings, bookingPage, bookingLimit]);

  const fetchWalletTransactions = useCallback(() => {
    if (customerId && customerId !== "undefined") {
      getWalletTransactions(`/userWallet/transactions?userId=${customerId}&limit=50`);
    }
  }, [customerId, getWalletTransactions]);

  // Initial Fetching
  const fetchAllData = useCallback(() => {
    if (customerId && customerId !== "undefined") {
      getUser(`/users/get-all-user?search=${customerId}`);
      getInsights(`/admin/customer-insights/${customerId}`);
      getRewards(`/rewards/get-reward/${customerId}`);
      getAddresses(`/admin/get-all-addresses/${customerId}`);
      fetchBookings();
      fetchWalletTransactions();
    }
  }, [customerId, getUser, getInsights, getRewards, getAddresses, fetchBookings, fetchWalletTransactions]);

  useEffect(() => {
    if (customerId && customerId !== "undefined") {
      fetchAllData();
      setTimeout(() => {
        setTimelinePage(1);
      }, 0);
    }
  }, [customerId, fetchAllData]);

  useEffect(() => {
    if (customerId && customerId !== "undefined") {
      fetchBookings();
    }
  }, [customerId, bookingPage, fetchBookings]);

  // Handle API Responses
  useEffect(() => {
    if (userRes?.status === 200 || userRes?.status === 201) {
      const fetchedUser = userRes.data?.data?.[0];
      if (fetchedUser) {
        setTimeout(() => {
          setUser(fetchedUser);
        }, 0);
      }
    }
  }, [userRes]);

  useEffect(() => {
    if (bookingsRes?.status === 200 || bookingsRes?.status === 201) {
      const bookingsData = bookingsRes.data?.data || [];
      const totalPages = Number(bookingsRes.data?.pagination?.totalPages || 1);
      setTimeout(() => {
        setBookings(bookingsData);
        setBookingTotalPages(totalPages);
      }, 0);
    }
  }, [bookingsRes]);

  useEffect(() => {
    if (walletTransactionsRes?.status === 200 || walletTransactionsRes?.status === 201) {
      const txData = walletTransactionsRes.data?.data || [];
      setTimeout(() => {
        setWalletTransactions(txData);
      }, 0);
    }
  }, [walletTransactionsRes]);

  useEffect(() => {
    if (rewardsRes?.status === 200 || rewardsRes?.status === 201) {
      const rewardsData = rewardsRes.data?.data || null;
      setTimeout(() => {
        setRewardProfile(rewardsData);
      }, 0);
    }
  }, [rewardsRes]);

  useEffect(() => {
    if (insightsRes?.status === 200 || insightsRes?.status === 201) {
      const insightsData = insightsRes.data?.data || null;
      setTimeout(() => {
        setInsights(insightsData);
      }, 0);
    }
  }, [insightsRes]);

  useEffect(() => {
    if (addressesRes?.status === 200 || addressesRes?.status === 201) {
      const addressesData = addressesRes.data?.addresses || [];
      setTimeout(() => {
        setAddresses(addressesData);
      }, 0);
    }
  }, [addressesRes]);

  // Actions
  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) return;
    await postCredit("/userWallet/credit", {
      userId: customerId,
      amount: Number(amountInput),
      description: reasonInput || "Refund top-up"
    });
    setCreditModalOpen(false);
    setAmountInput("");
    setReasonInput("");
    // Refresh
    setTimeout(() => {
      fetchWalletTransactions();
      getUser(`/users/get-all-user?search=${customerId}`);
    }, 500);
  };

  const handleDebitSubmit = async (e) => {
    e.preventDefault();
    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) return;
    await postDebit("/userWallet/debit-admin", {
      userId: customerId,
      amount: Number(amountInput),
      description: reasonInput || "Admin adjustment debit"
    });
    setDebitModalOpen(false);
    setAmountInput("");
    setReasonInput("");
    // Refresh
    setTimeout(() => {
      fetchWalletTransactions();
      getUser(`/users/get-all-user?search=${customerId}`);
    }, 500);
  };

  const handleAddRewardsSubmit = async (e) => {
    e.preventDefault();
    if (!pointsInput || isNaN(pointsInput) || Number(pointsInput) <= 0) return;
    await postAddRewards("/rewards/add-bonus", {
      userId: customerId,
      points: Number(pointsInput),
      city: user?.city?._id || user?.city
    });
    setAddRewardsModalOpen(false);
    setPointsInput("");
    // Refresh
    setTimeout(() => {
      getRewards(`/rewards/get-reward/${customerId}`);
    }, 500);
  };

  const handleToggleStatus = async () => {
    const updatedStatus = !user?.status;
    await postUpdateStatus(`/admin/update-user/${customerId}`, {
      status: updatedStatus
    });
    setStatusConfirmOpen(false);
    // Refresh
    setTimeout(() => {
      getUser(`/users/get-all-user?search=${customerId}`);
    }, 500);
  };

  // CSV Exporter for Bookings
  const exportBookingsToCSV = () => {
    if (!bookings.length) return;
    const headers = ["Booking ID", "Service", "Scheduled Date", "Partner", "Amount", "Payment Method", "Payment Status", "Booking Status", "Created At"];
    const rows = bookings.map(b => [
      b.bookingId || "N/A",
      b.product?.name || b.package?.name || "Service Item",
      b.bookingDate ? formatDateOnly(b.bookingDate, "dd-MM-yyyy") : "N/A",
      b.sellerId?.name || b.assignedSellerId?.name || "Not Assigned",
      `₹${b.itemTotalValue || 0}`,
      b.paymentType || "N/A",
      b.paymentStatus || "pending",
      b.status || "N/A",
      formatInstant(b.createdAt, "dd-MM-yyyy HH:mm")
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_${customerId}_bookings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const serviceName = (b.product?.name || b.package?.name || "").toLowerCase();
      const bookingId = (b.bookingId || "").toLowerCase();
      const matchesSearch = serviceName.includes(bookingSearch.toLowerCase()) || bookingId.includes(bookingSearch.toLowerCase());
      const matchesStatus =
        bookingStatusFilter === "all" ||
        normalizeBookingStatus(b.status) === normalizeBookingStatus(bookingStatusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  const filteredWalletTxs = useMemo(() => {
    return walletTransactions.filter(tx => {
      const matchesSearch = (tx.reason || "").toLowerCase().includes(txSearch.toLowerCase()) || (tx.type || "").toLowerCase().includes(txSearch.toLowerCase());
      const matchesType = txTypeFilter === "all" || tx.transactionType === txTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [walletTransactions, txSearch, txTypeFilter]);

  // Combined Activity Log (timeline events)
  const timelineEvents = useMemo(() => {
    const events = [];

    // 1. Account Creation
    if (user?.createdAt) {
      events.push({
        id: "created",
        title: "Customer Profile Created",
        description: "Customer registered on Abhicares platform",
        date: new Date(user.createdAt),
        icon: <User className="size-4 text-blue-500" />,
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
      });
    }

    // 2. Addresses
    addresses.forEach((addr, idx) => {
      events.push({
        id: `addr-${idx}`,
        title: "Address Registered",
        description: `${addr.addressLine}, ${addr.city} (${addr.pincode})`,
        date: addr.createdAt ? new Date(addr.createdAt) : (user?.createdAt ? new Date(user.createdAt) : new Date(0)),
        icon: <MapPin className="size-4 text-emerald-500" />,
        color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
      });
    });

    // 3. Bookings
    bookings.forEach((b) => {
      events.push({
        id: `book-${b._id}`,
        title: `Booking Placed (${b.bookingId})`,
        description: `${b.product?.name || b.package?.name || "Service Item"} - ₹${b.itemTotalValue || 0}`,
        date: new Date(b.createdAt),
        icon: <ClipboardList className="size-4 text-amber-500" />,
        color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
        link: `/admin/bookings/${b._id}`
      });
    });

    // 4. Wallet Transactions
    walletTransactions.forEach((t) => {
      events.push({
        id: `wallet-${t._id}`,
        title: `Wallet ${t.transactionType === "credit" ? "Credited" : "Debited"}`,
        description: `₹${t.amount} - ${t.reason || t.type}`,
        date: new Date(t.date || t.createdAt),
        icon: <Wallet className="size-4 text-purple-500" />,
        color: t.transactionType === "credit" ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-600"
      });
    });

    // 5. Reward Events
    if (rewardProfile?.transactions) {
      rewardProfile.transactions.forEach((rt, idx) => {
        events.push({
          id: `rewards-${idx}`,
          title: `Reward Points ${rt.points > 0 ? "Earned" : "Redeemed"}`,
          description: `${Math.abs(rt.points)} pts - Type: ${rt.type}`,
          date: new Date(rt.createdAt),
          icon: <Award className="size-4 text-yellow-500" />,
          color: rt.points > 0 ? "bg-yellow-100 text-yellow-600" : "bg-neutral-100 text-neutral-600"
        });
      });
    }

    return events.sort((a, b) => b.date - a.date);
  }, [user, bookings, walletTransactions, rewardProfile, addresses]);

  const timelinePageSize = 10;
  const timelinePageCount = useMemo(() => {
    return Math.ceil(timelineEvents.length / timelinePageSize) || 1;
  }, [timelineEvents]);

  const paginatedTimelineEvents = useMemo(() => {
    const startIndex = (timelinePage - 1) * timelinePageSize;
    return timelineEvents.slice(startIndex, startIndex + timelinePageSize);
  }, [timelineEvents, timelinePage]);

  // Loading Skeleton
  const showSkeleton = isUserLoading || isInsightsLoading;

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#F8FAFC] min-h-screen text-slate-900">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <BackLink href={-1}>
            <span className="text-sm text-slate-500 hover:text-slate-800 transition">
              Back to Customers
            </span>
          </BackLink>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchAllData} className="flex items-center gap-2 border-slate-200">
              <RefreshCw className="size-3.5" />
              <span>Refresh Profile</span>
            </Button>
            <Button asChild size="sm" variant="abhicares" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Link to={`/admin/customers/${customerId}/create-order`}>Create Booking</Link>
            </Button>
            
            {/* Enterprise Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-200">
                  <span>More Actions</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Enterprise Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCreditModalOpen(true)} className="cursor-pointer">
                  <Plus className="size-4 mr-2 text-green-600" />
                  <span>Credit Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDebitModalOpen(true)} className="cursor-pointer">
                  <Minus className="size-4 mr-2 text-rose-600" />
                  <span>Debit Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAddRewardsModalOpen(true)} className="cursor-pointer">
                  <Award className="size-4 mr-2 text-yellow-500" />
                  <span>Add Bonus Points</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusConfirmOpen(true)} className="cursor-pointer">
                  <ShieldAlert className="size-4 mr-2 text-amber-500" />
                  <span>{user?.status ? "Suspend Customer" : "Activate Customer"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/admin/customers/${customerId}/create-order`)} className="cursor-pointer">
                  <ClipboardList className="size-4 mr-2 text-blue-600" />
                  <span>Create Booking</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Premium Profile Header */}
        <Card className="border border-slate-200 shadow-sm overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-6 sm:p-8">
            {showSkeleton ? (
              <div className="flex items-center gap-6">
                <Skeleton className="size-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Initials Avatar */}
                  <div className="size-16 sm:size-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner uppercase">
                    {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "U"}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{user?.name}</h1>
                      <Badge className={user?.status ? "bg-green-100 text-green-700 hover:bg-green-100 border border-green-200" : "bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200"}>
                        {user?.status ? "Active Customer" : "Suspended"}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-mono">ID: {user?._id}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-slate-400" />
                        Joined {user?.createdAt ? formatDateOnly(user.createdAt, "dd MMM yyyy") : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        {user?.city?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action buttons row */}
                <div className="flex flex-wrap gap-2.5 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <Button variant="outline" size="sm" onClick={() => setCreditModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Plus className="size-3.5 text-green-600" />
                    <span>Credit Wallet</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAddRewardsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Award className="size-3.5 text-yellow-500" />
                    <span>Add Points</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Total Bookings</span>
                <ClipboardList className="size-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{showSkeleton ? "..." : insights?.bookingCount || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">All bookings registered</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Lifetime Spend</span>
                <TrendingUp className="size-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">₹{showSkeleton ? "..." : insights?.lifetimeSpend?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">Gross completed amount</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Wallet Balance</span>
                <Wallet className="size-4 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">₹{showSkeleton ? "..." : user?.wallet?.balance || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">₹{user?.wallet?.pending || 0} hold pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Reward Points</span>
                <Award className="size-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{showSkeleton ? "..." : rewardProfile?.remainingPoints || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">{rewardProfile?.usedPoints || 0} redeemed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Cancelled Jobs</span>
                <AlertTriangle className="size-4 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{showSkeleton ? "..." : insights?.cancelledCount || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">cancellation rate: {insights?.bookingCount ? Math.round((insights.cancelledCount / insights.bookingCount) * 100) : 0}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:scale-[1.02] transition duration-200">
            <CardContent className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Referrals</span>
                <UserCheck className="size-4 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{showSkeleton ? "..." : insights?.referralCount || 0}</p>
                <p className="text-[10px] text-slate-500 font-medium">Users referred by customer</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Intelligence & Health Section */}
        <div className="grid grid-cols-1 gap-6">

          {/* Customer Operational Health Widget */}
          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="size-4 text-blue-500" />
                Customer Operational Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showSkeleton ? (
                <div className="flex items-center gap-6 py-4">
                  <Skeleton className="size-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  
                  {/* Left: Health Score circle and status */}
                  <div className="flex items-center gap-5">
                    <div className={`size-16 rounded-full border-[6px] flex items-center justify-center font-bold text-xl shrink-0 ${
                      (insights?.customerHealthScore || 0) >= 80 ? "border-green-500 text-green-600 bg-green-50" :
                      (insights?.customerHealthScore || 0) >= 50 ? "border-yellow-500 text-yellow-600 bg-yellow-50" :
                      "border-rose-500 text-rose-600 bg-rose-50"
                    }`}>
                      {insights?.customerHealthScore !== undefined ? `${insights.customerHealthScore}` : "60"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">
                        Health Status: {
                          (insights?.customerHealthScore || 0) >= 80 ? "Excellent Profile" :
                          (insights?.customerHealthScore || 0) >= 50 ? "Average Profile" :
                          "High Risk Profile"
                        }
                      </h3>
                      <p className="text-xs text-slate-400 pt-0.5 leading-normal">
                        Calculated based on booking completions, cancellations, wallet activity, and referrals.
                      </p>
                    </div>
                  </div>

                  {/* Right: Operational factors list */}
                  <div className="border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 text-xs sm:text-sm space-y-3 text-slate-600">
                    <div className="flex justify-between items-center">
                      <span>Booking Completion Rate</span>
                      <span className="font-bold text-slate-800">
                        {insights?.bookingCount ? Math.round((insights.completedCount / insights.bookingCount) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cancellation Frequency</span>
                      <span className="font-bold text-slate-800">
                        {insights?.bookingCount ? Math.round((insights.cancelledCount / insights.bookingCount) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Loyalty Referral Count</span>
                      <span className="font-bold text-slate-800">
                        {insights?.referralCount || 0} signups
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* Recommended Action box */}
              <div className="bg-[#FAF9F6] border border-amber-100 rounded-xl p-3 flex items-start gap-3 text-xs text-slate-700 mt-2">
                <Info className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900">Recommended Action:</span>
                  <p className="text-slate-600 leading-normal">
                    { (insights?.customerHealthScore || 0) < 50 ? 
                      "Highly prone to cancellations. Consider requesting prepaid bookings or contacting directly before scheduling partners." :
                      (insights?.lifetimeSpend || 0) > 20000 ? 
                      "VIP Customer. Prioritize assignations to 5-star rated service partners and offer exclusive loyalty points top-ups." :
                      "Regular account profile. Keep updated on promotional coupons and wallet refund bonuses."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab System */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-100 p-1 rounded-xl w-full flex overflow-x-auto justify-start md:justify-center border border-slate-200 gap-1 h-auto mb-6">
            <TabsTrigger value="overview" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Bookings History</TabsTrigger>
            <TabsTrigger value="addresses" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Addresses</TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Wallet Logs</TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Loyalty & Rewards</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg py-2 px-4 text-xs sm:text-sm font-medium transition cursor-pointer">Activity Timeline</TabsTrigger>
          </TabsList>

          {/* 1. Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Demographics */}
              <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <User className="size-4 text-slate-400" />
                    Customer Profile & Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-sm">
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Name</span>
                    <span className="col-span-2 text-slate-900 font-medium">{user?.name}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Phone</span>
                    <span className="col-span-2 text-slate-900 font-mono font-medium">{user?.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Email</span>
                    <span className="col-span-2 text-slate-900 font-mono font-medium">{user?.email || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Gender</span>
                    <span className="col-span-2 text-slate-900 capitalize font-medium">{user?.Gender || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Date of Birth</span>
                    <span className="col-span-2 text-slate-900 font-medium">{user?.dateOfBirth || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Account Status</span>
                    <span className="col-span-2">
                      <Badge className={user?.status ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}>
                        {user?.status ? "Active" : "Suspended"}
                      </Badge>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Referral Code</span>
                    <span className="col-span-2 text-slate-900 font-mono font-bold">{user?.referralCode}</span>
                  </div>
                  <div className="grid grid-cols-3 pb-1">
                    <span className="font-semibold text-slate-500">Referred By</span>
                    <span className="col-span-2 text-slate-900 font-medium">
                      {user?.referredBy ? (
                        <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => navigate(`/admin/customers/${user.referredBy._id}`)}>
                          {user.referredBy.name || "Referrer Customer"}
                        </span>
                      ) : "-"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Operational Summary */}
              <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <TrendingUp className="size-4 text-slate-400" />
                    Operational & Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-sm">
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Total Bookings</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{showSkeleton ? "..." : insights?.bookingCount || 0} bookings</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Completed Jobs</span>
                    <span className="col-span-2 text-slate-900 font-semibold text-green-600">{showSkeleton ? "..." : insights?.completedCount || 0} completed</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Cancelled Jobs</span>
                    <span className="col-span-2 text-slate-900 font-semibold text-rose-600">{showSkeleton ? "..." : insights?.cancelledCount || 0} cancelled</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Average Order Value</span>
                    <span className="col-span-2 text-slate-900 font-semibold">₹{showSkeleton ? "..." : Math.round(insights?.averageOrderValue || 0)}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Lifetime Revenue</span>
                    <span className="col-span-2 text-slate-900 font-bold text-green-700">₹{showSkeleton ? "..." : insights?.lifetimeSpend?.toLocaleString() || 0}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="font-semibold text-slate-500">Last Booking Date</span>
                    <span className="col-span-2 text-slate-900 font-medium">
                      {insights?.lastBookingDate ? formatInstant(insights.lastBookingDate, "dd MMM yyyy HH:mm") : "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 pb-1">
                    <span className="font-semibold text-slate-500">Last Active Date</span>
                    <span className="col-span-2 text-slate-900 font-medium">
                      {insights?.lastActiveDate ? formatInstant(insights.lastActiveDate, "dd MMM yyyy HH:mm") : "-"}
                    </span>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* 2. Bookings History Tab */}
          <TabsContent value="bookings">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Booking History</CardTitle>
                  <CardDescription>View, filter and search bookings submitted by this customer</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="text"
                      placeholder="Search service/ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="pl-9 h-9 w-full sm:w-56 text-xs border-slate-200 focus:ring-1 focus:ring-blue-500 rounded-lg"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {BOOKING_STATUS_FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <PageSizeSelect
                    value={bookingLimit}
                    onChange={(value) => {
                      setBookingLimit(value);
                      setBookingPage(1);
                    }}
                    label=""
                  />

                  <Button variant="outline" size="sm" onClick={exportBookingsToCSV} className="border-slate-200 flex items-center gap-1.5 text-slate-700 cursor-pointer">
                    <Download className="size-3.5" />
                    <span>CSV Export</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b">
                      <TableHead className="font-bold text-slate-700 pl-6">Booking ID</TableHead>
                      <TableHead className="font-bold text-slate-700">Service Items</TableHead>
                      <TableHead className="font-bold text-slate-700">Booking Slot</TableHead>
                      <TableHead className="font-bold text-slate-700">Assigned Partner</TableHead>
                      <TableHead className="font-bold text-slate-700">Amount</TableHead>
                      <TableHead className="font-bold text-slate-700">Payment Type/Status</TableHead>
                      <TableHead className="font-bold text-slate-700">Status</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isBookingsLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <Skeleton className="h-6 w-full max-w-lg mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-slate-400 py-16">
                          No matching bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((b) => (
                        <TableRow key={b._id} className="hover:bg-slate-50 transition border-b">
                          <TableCell className="font-mono text-xs font-semibold pl-6 text-slate-900">{b.bookingId}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            <span className="font-medium text-slate-800">{b.product?.name || b.package?.name || "Service Item"}</span>
                            {b.quantity > 1 && <span className="text-xs text-slate-400 ml-1 font-semibold">x{b.quantity}</span>}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs">
                              <span className="font-medium text-slate-700">{b.bookingDate ? formatDateOnly(b.bookingDate, "dd-MM-yyyy") : "-"}</span>
                              {b.slotStartAt && b.slotEndAt && (
                                <span className="text-slate-400 font-mono text-[10px]">
                                  {formatSlotRange(b.slotStartAt, b.slotEndAt)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {b.sellerId || b.assignedSellerId ? (
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded bg-slate-100 border flex items-center justify-center text-xs font-bold text-slate-600">
                                  {(b.sellerId?.name || b.assignedSellerId?.name)?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-xs text-slate-800 font-medium">{b.sellerId?.name || b.assignedSellerId?.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Not Assigned</span>
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">₹{b.itemTotalValue || 0}</TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start gap-1">
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 capitalize font-medium border-slate-200">
                                {b.paymentType || "N/A"}
                              </Badge>
                              <span className={`text-[10px] font-semibold ${
                                b.paymentStatus === "completed" ? "text-green-600" :
                                b.paymentStatus === "failed" ? "text-rose-600" :
                                "text-amber-600"
                              }`}>{b.paymentStatus}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const statusMeta = getBookingStatusMeta(b.status);
                              return (
                                <Badge className={statusMeta.badgeClassName}>
                                  {statusMeta.label}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => navigate(`/admin/bookings/${b._id}`, { state: b })}
                              className="border-slate-200 text-xs py-1 px-2.5 cursor-pointer"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                <div className="mt-6 mb-5 flex items-center justify-end gap-3">
                  <PaginationComp
                    page={bookingPage}
                    pageCount={bookingTotalPages}
                    setPage={setBookingPage}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Addresses Tab */}
          <TabsContent value="addresses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isAddressesLoading ? (
                <Skeleton className="h-44 w-full rounded-2xl md:col-span-2" />
              ) : addresses.length === 0 ? (
                <Card className="border border-slate-200 bg-white p-10 text-center text-slate-400 md:col-span-2">
                  No registered addresses found for this customer.
                </Card>
              ) : (
                addresses.map((address, index) => (
                  <Card key={index} className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-slate-400" />
                        <CardTitle className="text-sm font-bold text-slate-800">
                          {address.landmark ? `${address.landmark}` : `Address #${index + 1}`}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {address.defaultAddress && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200">Default</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3 text-xs sm:text-sm">
                      <p>
                        <span className="font-semibold text-slate-500 block text-xs">Address Line</span>
                        <span className="text-slate-800 font-medium">{address.addressLine}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-500 block text-xs">Landmark</span>
                        <span className="text-slate-800 font-medium">{address.landmark || "-"}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <span className="font-semibold text-slate-500 block text-xs">City</span>
                          <span className="text-slate-800 capitalize font-medium">{address.city}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-slate-500 block text-xs">Pincode</span>
                          <span className="text-slate-800 font-medium">{address.pincode}</span>
                        </p>
                      </div>

                      {address.location?.coordinates && (
                        <div className="pt-3 border-t flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400">Coordinates</span>
                            <span className="font-mono text-xs text-slate-600">
                              {address.location.coordinates[1]}, {address.location.coordinates[0]}
                            </span>
                          </div>
                          <Button asChild size="sm" variant="outline" className="border-slate-200 text-slate-700 cursor-pointer">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${address.location.coordinates[1]},${address.location.coordinates[0]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>Open In Google Maps</span>
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 4. Wallet Tab */}
          <TabsContent value="wallet">
            <div className="space-y-6">
              
              {/* Wallet Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">₹{user?.wallet?.balance || 0}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">₹{(user?.wallet?.balance || 0) - (user?.wallet?.pending || 0)}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hold Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-amber-600">₹{user?.wallet?.pending || 0}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lifetime Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-700">₹{user?.wallet?.totalCredits || 0}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions table */}
              <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">Wallet Transactions</CardTitle>
                    <CardDescription>Full audit log of customer wallet credits and debits</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Search Transaction */}
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        type="text"
                        placeholder="Search reason..."
                        value={txSearch}
                        onChange={(e) => setTxSearch(e.target.value)}
                        className="pl-9 h-9 w-full sm:w-48 text-xs border-slate-200 rounded-lg"
                      />
                    </div>
                    
                    {/* Filter Type */}
                    <select
                      value={txTypeFilter}
                      onChange={(e) => setTxTypeFilter(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="credit">Credit (+)</option>
                      <option value="debit">Debit (-)</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b">
                        <TableHead className="font-bold text-slate-700 pl-6">Date</TableHead>
                        <TableHead className="font-bold text-slate-700">Transaction Type</TableHead>
                        <TableHead className="font-bold text-slate-700">Category Type</TableHead>
                        <TableHead className="font-bold text-slate-700">Amount</TableHead>
                        <TableHead className="font-bold text-slate-700">Balance After</TableHead>
                        <TableHead className="font-bold text-slate-700">Reason</TableHead>
                        <TableHead className="font-bold text-slate-700 pr-6 text-right">Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isWalletTxLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <Skeleton className="h-6 w-full max-w-md mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : filteredWalletTxs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-400 py-14">
                            No wallet transactions logged.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredWalletTxs.map((tx) => (
                          <TableRow key={tx._id} className="hover:bg-slate-50 transition border-b">
                            <TableCell className="pl-6 text-xs text-slate-600 font-mono">
                              {tx.date ? formatInstant(tx.date, "dd-MM-yyyy HH:mm") : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge className={tx.transactionType === "credit" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}>
                                {tx.transactionType}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize text-slate-800 text-xs font-bold">
                              {tx.type?.replace("_", " ")}
                            </TableCell>
                            <TableCell className={`font-bold text-sm ${tx.transactionType === "credit" ? "text-green-600" : "text-rose-600"}`}>
                              {tx.transactionType === "credit" ? "+" : "-"}₹{tx.amount}
                            </TableCell>
                            <TableCell className="font-bold text-slate-800 font-mono text-xs">
                              ₹{tx.balanceAfter !== undefined ? tx.balanceAfter : "N/A"}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 max-w-[200px] truncate font-medium">
                              {tx.reason || "-"}
                            </TableCell>
                            <TableCell className="text-right pr-6 font-mono text-xs text-slate-400 font-medium">
                              {tx.orderId ? `Order: ${tx.orderId}` : tx.adminId ? `Admin Adj` : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* 5. Loyalty & Rewards Tab */}
          <TabsContent value="rewards">
            <div className="space-y-6">
              
              {/* Rewards Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{rewardProfile?.remainingPoints || 0}</p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Used Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-rose-500">{rewardProfile?.usedPoints || 0}</p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accumulated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">{rewardProfile?.totalPoints || 0}</p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Referral PointsOverride</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{user?.referralRewardPoints !== null ? user?.referralRewardPoints : "Global Config"}</p>
                  </CardContent>
                </Card>
              </div>

              {/* City reward configuration */}
              <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold text-slate-800">Loyalty Rules & Configurations</CardTitle>
                </CardHeader>
                <CardContent className="p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Earn Rate</span>
                    <span className="font-bold text-slate-800">{rewardProfile?.earnRate || 0} pts / ₹</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Conversion Rate</span>
                    <span className="font-bold text-slate-800">{rewardProfile?.conversionRate || 0} pts = ₹1</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Max Usage Limit per Cart</span>
                    <span className="font-bold text-slate-800">{rewardProfile?.maxUsagePercent || 0}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Minimum Cart Value</span>
                    <span className="font-bold text-slate-800">₹{rewardProfile?.minCartValue || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Max Points per Order</span>
                    <span className="font-bold text-slate-800">{rewardProfile?.maxPointsPerOrder || 0} pts</span>
                  </div>
                </CardContent>
              </Card>

              {/* Reward points logs */}
              <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-base font-bold text-slate-800">Reward Points Ledger</CardTitle>
                  <CardDescription>Historical ledger of points earned from referrals, bookings, promotions and redemptions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b">
                        <TableHead className="font-bold text-slate-700 pl-6">Date</TableHead>
                        <TableHead className="font-bold text-slate-700">Activity Type</TableHead>
                        <TableHead className="font-bold text-slate-700">Points Value</TableHead>
                        <TableHead className="font-bold text-slate-700 pr-6 text-right">Reference Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isRewardsLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10">
                            <Skeleton className="h-6 w-full max-w-sm mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : !rewardProfile?.transactions || rewardProfile.transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-400 py-14">
                            No reward point history recorded.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rewardProfile.transactions.map((t, idx) => (
                          <TableRow key={idx} className="hover:bg-slate-50 transition border-b">
                            <TableCell className="pl-6 text-xs text-slate-600 font-mono">
                              {t.createdAt ? formatInstant(t.createdAt, "dd-MM-yyyy HH:mm") : "-"}
                            </TableCell>
                            <TableCell className="capitalize text-xs font-bold text-slate-800">
                              {t.type} Points
                            </TableCell>
                            <TableCell className={`font-bold text-sm ${t.points > 0 ? "text-green-600" : "text-rose-600"}`}>
                              {t.points > 0 ? `+${t.points}` : `${t.points}`} pts
                            </TableCell>
                            <TableCell className="text-right pr-6 text-xs text-slate-600 font-bold">
                              {t.service?.name ? `Service: ${t.service.name}` :
                               t.referredUser?.name ? `Referred: ${t.referredUser.name}` :
                               t.type === "admin" ? "Admin Manual Adjustment" : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* 6. Activity Timeline Tab */}
          <TabsContent value="activity">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-base font-bold text-slate-800">Activity Timeline</CardTitle>
                <CardDescription>Chronological sequence of customer milestones, bookings, and payments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8 py-3">
                  {paginatedTimelineEvents.map((ev, idx) => (
                    <div key={ev.id || idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[38px] top-0.5 size-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${ev.color}`}>
                        {ev.icon}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                          <span className="text-slate-400 text-xs font-mono font-medium">{formatInstant(ev.date, "dd MMM yyyy HH:mm")}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">{ev.description}</p>
                        {ev.link && (
                          <Button asChild size="xs" variant="link" className="p-0 h-auto text-blue-600 text-xs hover:underline mt-1 cursor-pointer">
                            <Link to={ev.link}>View Details &rarr;</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {timelineEvents.length === 0 && (
                    <p className="text-center text-slate-400 text-sm">No activity recorded for this customer profile.</p>
                  )}
                </div>

                {timelineEvents.length > timelinePageSize && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                    <PaginationComp
                      page={timelinePage}
                      pageCount={timelinePageCount}
                      setPage={setTimelinePage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* ── MODALS & ADJUSTMENT DIALOGS ─────────────────────────────────── */}

        {/* 1. Credit Modal */}
        <Dialog open={creditModalOpen} onOpenChange={setCreditModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">Credit Wallet Balance</DialogTitle>
              <DialogDescription>Add funds manually to this customer's wallet.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreditSubmit} className="space-y-4 py-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="border-slate-200"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Reason / Description</label>
                <Textarea
                  placeholder="Compensation, refund bonus, top-up etc..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="border-slate-200 resize-none h-20"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCreditModalOpen(false)} disabled={isCreditLoading} className="border-slate-200 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" variant="abhicares" size="sm" disabled={isCreditLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer">
                  {isCreditLoading ? "Crediting..." : "Confirm Credit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Debit Modal */}
        <Dialog open={debitModalOpen} onOpenChange={setDebitModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">Debit Wallet Balance</DialogTitle>
              <DialogDescription>Deduct funds manually from this customer's wallet balance.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDebitSubmit} className="space-y-4 py-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g. 200"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="border-slate-200"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Reason / Description</label>
                <Textarea
                  placeholder="Incorrect credit rectification, platform fee deduction..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="border-slate-200 resize-none h-20"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setDebitModalOpen(false)} disabled={isDebitLoading} className="border-slate-200 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" variant="abhicares" size="sm" disabled={isDebitLoading} className="bg-rose-600 hover:bg-rose-700 text-white font-medium cursor-pointer">
                  {isDebitLoading ? "Debiting..." : "Confirm Debit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Add Rewards Points Modal */}
        <Dialog open={addRewardsModalOpen} onOpenChange={setAddRewardsModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">Add Reward Points</DialogTitle>
              <DialogDescription>Add loyalty bonus points manually to this customer's account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRewardsSubmit} className="space-y-4 py-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Reward Points</label>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  className="border-slate-200"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAddRewardsModalOpen(false)} disabled={isAddRewardsLoading} className="border-slate-200 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" variant="abhicares" size="sm" disabled={isAddRewardsLoading} className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold cursor-pointer">
                  {isAddRewardsLoading ? "Adding..." : "Add Points"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 4. Status Confirm Modal */}
        <Dialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">
                {user?.status ? "Suspend Customer Account?" : "Re-activate Customer Account?"}
              </DialogTitle>
              <DialogDescription>
                {user?.status ? 
                  "Are you sure you want to suspend this customer? The customer will no longer be able to log in or book services." :
                  "Are you sure you want to re-activate this customer account?"
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setStatusConfirmOpen(false)} disabled={isStatusLoading} className="border-slate-200 cursor-pointer">
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleToggleStatus} disabled={isStatusLoading} className={`font-medium cursor-pointer ${user?.status ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                {isStatusLoading ? "Updating..." : user?.status ? "Suspend" : "Activate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </Wrapper>
  );
};

export default CustomerDetails;
