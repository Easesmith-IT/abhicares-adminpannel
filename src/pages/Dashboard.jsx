import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  ShieldAlert,
  MapPin,
  Wrench,
  DollarSign,
  Calendar,
  Clock,
  RefreshCw,
  ChevronRight,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import Wrapper from "../components/wrappers/Wrapper";
import useGetApiReq from "../hooks/useGetApiReq";
import { useCustomSidebar } from "../components/layout/sidebarContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedCityId } = useCustomSidebar();

  // API Request hooks
  const { res: orderCountRes, fetchData: getOrderCounts, isLoading: isCountsLoading } = useGetApiReq();
  const { res: recentOrdersRes, fetchData: getRecentOrders, isLoading: isOrdersLoading } = useGetApiReq();
  const { res: citiesRes, fetchData: getCities } = useGetApiReq();
  const { res: partnersRes, fetchData: getPartners, isLoading: isPartnersLoading } = useGetApiReq();
  const { res: customersRes, fetchData: getCustomers, isLoading: isCustomersLoading } = useGetApiReq();
  const { res: financialRes, fetchData: getFinancials, isLoading: isFinancialLoading } = useGetApiReq();
  const { res: categoriesRes, fetchData: getCategories, isLoading: isCategoriesLoading } = useGetApiReq();
  const { res: servicesRes, fetchData: getServices, isLoading: isServicesLoading } = useGetApiReq();
  const { res: unverifiedPartnersRes, fetchData: getUnverifiedPartners, isLoading: isUnverifiedPartnersLoading } = useGetApiReq();
  const { res: pendingCashoutsRes, fetchData: getPendingCashouts, isLoading: isPendingCashoutsLoading } = useGetApiReq();

  // Local state variables
  const [orderCount, setOrderCount] = useState({ completed: 0, cancelled: 0, pending: 0, total: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const [totalPartners, setTotalPartners] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [financials, setFinancials] = useState({ netRevenue: 0, totalCommission: 0 });
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [unverifiedPartnersCount, setUnverifiedPartnersCount] = useState(0);
  const [pendingCashoutsCount, setPendingCashoutsCount] = useState(0);

  const fetchAllDashboardData = useCallback(() => {
    const cityQuery = selectedCityId ? `&cityId=${selectedCityId}` : "";
    getOrderCounts(`/admin/get-order-count-by-status?${cityQuery.slice(1)}`);
    getRecentOrders(`/admin/get-recent-orders?page=1&limit=8${cityQuery}`);
    getCities("/admin/get-availabe-city?limit=1");
    getPartners(`/sellers/get-all-seller?limit=1${cityQuery}`);
    getCustomers(`/users/get-all-user?limit=1${cityQuery}`);
    const today = new Date().toISOString().split("T")[0];
    getFinancials(`/admin/platform-financials?from=2020-01-01&to=${today}&limit=1${cityQuery}`);
    getCategories(`/categories/get-categories?limit=1${cityQuery}`);
    getServices("/admin/get-all-service");
    getUnverifiedPartners(`/sellers/get-all-seller?status=IN-REVIEW&limit=1${cityQuery}`);
    getPendingCashouts(`/admin/get-seller-cashout?status=PENDING&limit=1${cityQuery}`);
  }, [selectedCityId, getOrderCounts, getRecentOrders, getCities, getPartners, getCustomers, getFinancials, getCategories, getServices, getUnverifiedPartners, getPendingCashouts]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // Sync API responses to state
  useEffect(() => {
    if (orderCountRes?.status === 200) {
      let total = 0;
      const data = orderCountRes.data?.data || [];
      data.forEach((item) => (total += item.count));

      setTimeout(() => {
        setOrderCount({
          cancelled: data.find((i) => i.status === "Cancelled")?.count || 0,
          completed: data.find((i) => i.status === "Completed")?.count || 0,
          pending: data.find((i) => i.status === "Pending")?.count || 0,
          total,
        });
      }, 0);
    }
  }, [orderCountRes]);

  useEffect(() => {
    if (recentOrdersRes?.status === 200) {
      const orders = recentOrdersRes.data?.data || [];
      setTimeout(() => {
        setRecentOrders(orders);
      }, 0);
    }
  }, [recentOrdersRes]);

  useEffect(() => {
    if (citiesRes?.status === 200) {
      const count = citiesRes.data?.pagination?.total || citiesRes.data?.pagination?.totalDocs || citiesRes.data?.data?.length || 0;
      setTimeout(() => {
        setTotalCities(count);
      }, 0);
    }
  }, [citiesRes]);

  useEffect(() => {
    if (partnersRes?.status === 200) {
      const count = partnersRes.data?.pagination?.total || partnersRes.data?.pagination?.totalDocs || partnersRes.data?.data?.length || 0;
      setTimeout(() => {
        setTotalPartners(count);
      }, 0);
    }
  }, [partnersRes]);

  useEffect(() => {
    if (customersRes?.status === 200) {
      const count = customersRes.data?.pagination?.total || customersRes.data?.pagination?.totalDocs || customersRes.data?.data?.length || 0;
      setTimeout(() => {
        setTotalCustomers(count);
      }, 0);
    }
  }, [customersRes]);

  useEffect(() => {
    if (financialRes?.status === 200) {
      const pf = financialRes.data?.data || {};
      setTimeout(() => {
        setFinancials({
          netRevenue: pf.platformRevenue ?? pf.netRevenue ?? 0,
          totalCommission: pf.platformCommission ?? pf.totalCommission ?? 0,
        });
      }, 0);
    }
  }, [financialRes]);

  useEffect(() => {
    if (categoriesRes?.status === 200) {
      const count = categoriesRes.data?.pagination?.total || categoriesRes.data?.pagination?.totalDocs || categoriesRes.data?.data?.length || 0;
      setTimeout(() => {
        setTotalCategories(count);
      }, 0);
    }
  }, [categoriesRes]);

  useEffect(() => {
    if (servicesRes?.status === 200) {
      const count = servicesRes.data?.data?.length || 0;
      setTimeout(() => {
        setTotalServices(count);
      }, 0);
    }
  }, [servicesRes]);

  useEffect(() => {
    if (unverifiedPartnersRes?.status === 200) {
      const count = unverifiedPartnersRes.data?.pagination?.total ?? unverifiedPartnersRes.data?.data?.length ?? 0;
      setTimeout(() => {
        setUnverifiedPartnersCount(count);
      }, 0);
    }
  }, [unverifiedPartnersRes]);

  useEffect(() => {
    if (pendingCashoutsRes?.status === 200) {
      const count = pendingCashoutsRes.data?.totalRecords ?? pendingCashoutsRes.data?.data?.length ?? 0;
      setTimeout(() => {
        setPendingCashoutsCount(count);
      }, 0);
    }
  }, [pendingCashoutsRes]);

  // Operational alerts generator
  const operationalAlerts = useMemo(() => {
    const alerts = [];
    if (orderCount.pending > 0) {
      alerts.push({
        id: "pending-orders",
        title: "High Pending Bookings",
        description: `${orderCount.pending} orders are awaiting provider assignment.`,
        severity: orderCount.pending > 5 ? "high" : "medium",
        action: "Assign Now",
        link: "/admin/offered-bookings/unassigned",
      });
    }
    if (unverifiedPartnersCount > 0) {
      alerts.push({
        id: "unverified-partners",
        title: "Partner Verification Required",
        description: `${unverifiedPartnersCount} service providers submitted documents for review.`,
        severity: "medium",
        action: "Review Queue",
        link: "/admin/partners?status=IN-REVIEW",
      });
    }
    if (pendingCashoutsCount > 0) {
      alerts.push({
        id: "payout-requests",
        title: "Pending Cashout Requests",
        description: `${pendingCashoutsCount} cashout requests are pending approval.`,
        severity: "medium",
        action: "Approve Payouts",
        link: "/admin/seller-cashouts",
      });
    }
    return alerts;
  }, [orderCount.pending, unverifiedPartnersCount, pendingCashoutsCount]);

  const showSkeleton = isCountsLoading || isFinancialLoading || isCustomersLoading || isPartnersLoading || isCategoriesLoading || isServicesLoading || isUnverifiedPartnersLoading || isPendingCashoutsLoading;

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-transparent">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Operations Command Center</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time marketplace KPIs, bookings telemetry, and support overview.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllDashboardData}
              className="flex items-center gap-2 border-slate-200 bg-white"
            >
              <RefreshCw className="size-4" />
              <span>Refresh Metrics</span>
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => navigate("/admin/bookings")}
            >
              Manage Bookings
            </Button>
          </div>
        </div>

        {/* Dashboard KPIs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
        >
          {/* Revenue */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-blue-600" style={{ backgroundColor: "#EFF6FF" }}>
                    <DollarSign className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-28" /> : `₹${(financials.netRevenue ?? 0).toLocaleString("en-IN")}`}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bookings */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-emerald-600" style={{ backgroundColor: "#ECFDF5" }}>
                    <ShoppingBag className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-16" /> : orderCount.total}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Customers */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-indigo-600" style={{ backgroundColor: "#F5F3FF" }}>
                    <Users className="size-5" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 flex items-center gap-0.5 text-xs font-semibold">
                    <span>Active</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customers</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-20" /> : (totalCustomers ?? 0).toLocaleString("en-IN")}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Partners */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-purple-600" style={{ backgroundColor: "#FAF5FF" }}>
                    <Activity className="size-5" />
                  </div>
                  <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border border-purple-200 flex items-center gap-0.5 text-xs font-semibold">
                    <span>Verified</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Partners</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-16" /> : totalPartners}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Operational Cities */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-amber-600" style={{ backgroundColor: "#FFF7ED" }}>
                    <MapPin className="size-5" />
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 flex items-center gap-0.5 text-xs font-semibold">
                    <span>Live</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cities</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-12" /> : totalCities}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Services */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl text-rose-600" style={{ backgroundColor: "#FEF2F2" }}>
                    <Wrench className="size-5" />
                  </div>
                  <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-0.5 text-xs font-semibold">
                    <span>{totalCategories} Catalogues</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Services Catalog</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    {showSkeleton ? <Skeleton className="h-7 w-12" /> : `${totalServices} Items`}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Operational Alerts & Incident Bar */}
        {operationalAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operationalAlerts.map((alert) => (
              <Card key={alert.id} className="border-y border-r border-slate-200/50 border-l-4 border-l-[#FCD34D] shadow-md overflow-hidden rounded-xl" style={{ backgroundColor: "#FFF8EB" }}>
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{alert.description}</p>
                    <Link to={alert.link} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1.5">
                      <span>{alert.action}</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Operational Split: Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
          {/* Live Workspace Feed */}
          <Card className="shadow-sm rounded-2xl overflow-hidden section-container">
            <CardHeader className="flex flex-row justify-between items-center px-6 py-5 border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Live Workspace Feed</CardTitle>
                <CardDescription>Recent service orders registered across cities.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")} className="text-blue-600 hover:text-blue-700">
                <span>View Workspace</span>
                <ChevronRight className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isOrdersLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3.5 w-24" />
                      </div>
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <ShoppingBag className="size-8 mx-auto mb-2 text-slate-300" />
                  <p>No recent orders found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{order.orderId || `ORD-${order._id.slice(-6)}`}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 capitalize">{order.city?.cityName || order.city?.name || "Multi-City"}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {order.userId?.name || "Walk-in Customer"} • {order.items?.[0]?.product?.name || order.items?.[0]?.package?.name || "Service Item"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-sm font-bold text-slate-950">₹{order.itemTotalValue || 0}</span>
                        <Badge
                          className={
                            order.status === "Completed"
                              ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200"
                              : order.status === "Pending"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
