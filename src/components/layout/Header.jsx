import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  MapPin,
  Plus,
  User,
  ChevronDown,
  Loader2,
  X,
  Clock,
  ArrowRight,
  Settings,
  LogOut,
  Users,
  Check,
  Calendar,
  Layers,
  Sparkles,
  Gift,
  CreditCard,
  Building2,
  Tag,
  Bell,
  CheckCheck,
  Terminal,
  ShieldAlert,
  BadgeInfo
} from "lucide-react";

import LogoutModal from "../modals/LogoutModal";
import useAuthActions from "../../hooks/useAuthActions";
import { Button } from "../ui/button";
import { useCustomSidebar } from "./sidebarContext";
import { readCookie } from "../../utils/readCookie";
import { axiosInstance } from "../../utils/axiosInstance";

const getInitials = (name) => {
  if (!name) return "AM";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleAdminLogout } = useAuthActions();

  // Sidebar context
  const { selectedCity, selectedCityId, setSelectedCity } = useCustomSidebar();

  // Modal and Dropdown states
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [searchCache, setSearchCache] = useState({});

  // Refs for click outside detection
  const createRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const cityRef = useRef(null);

  // Admin details
  const adminInfo = readCookie("adminInfo") || { name: "Super Admin", role: "admin" };
  const displayName = adminInfo.name === "name"
    ? (adminInfo.role === "super-admin" || adminInfo.role === "admin" ? "Super Admin" : "Sub Admin")
    : (adminInfo.name || "Super Admin");

  // Debounced search timer
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch cities for Selector & search filters on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-availabe-city?limit=100");
        if (response.data?.success) {
          setAllCities(response.data.data || []);
        }
      } catch (err) {
        console.error("Error loading cities in header:", err);
      }
    };
    loadCities();

    // Load recent searches from localStorage
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Keyboard shortcut listener: Ctrl+K / Cmd+K / Slash key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && !document.activeElement.isContentEditable) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createRef.current && !createRef.current.contains(event.target)) {
        setIsCreateOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global search implementation
  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const trimmedQuery = query.trim();

    // Check cache first
    const cacheKey = `${trimmedQuery}_${selectedCityId || "all"}`;
    if (searchCache[cacheKey]) {
      setSearchResults(searchCache[cacheKey]);
      return;
    }

    // Cancel active search request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsSearchLoading(true);

    try {
      const results = {
        bookings: [],
        customers: [],
        partners: [],
        categories: [],
        services: [],
        cities: [],
        offers: [],
        payments: [],
        orders: []
      };

      const promises = [];

      // 1. Bookings search (by ID)
      promises.push(
        axiosInstance
          .get(`/admin/search-filter-bookings?bookingId=${encodeURIComponent(trimmedQuery)}&cityId=${selectedCityId}&limit=5`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            results.bookings = res.data?.data || [];
          })
          .catch(() => {})
      );

      // 2. Customers search
      promises.push(
        axiosInstance
          .get(`/users/get-all-user?search=${encodeURIComponent(trimmedQuery)}&cityId=${selectedCityId}&limit=5`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            results.customers = res.data?.data || [];
          })
          .catch(() => {})
      );

      // 3. Partners search
      promises.push(
        axiosInstance
          .get(`/sellers/get-all-seller?search=${encodeURIComponent(trimmedQuery)}&cityId=${selectedCityId}&limit=5`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            results.partners = res.data?.data || [];
          })
          .catch(() => {})
      );

      // 4. Categories search
      promises.push(
        axiosInstance
          .get(`/categories/get-categories?search=${encodeURIComponent(trimmedQuery)}&cityId=${selectedCityId}&limit=5`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            results.categories = res.data?.data || [];
          })
          .catch(() => {})
      );

      // 5. Services search
      promises.push(
        axiosInstance
          .get(`/admin/search-service?search=${encodeURIComponent(trimmedQuery)}&limit=5`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            results.services = res.data?.data || [];
          })
          .catch(() => {})
      );

      // 6. Specific Order lookup (if query is order ID format or numeric)
      promises.push(
        axiosInstance
          .get(`/admin/get-order-by-id?orderId=${encodeURIComponent(trimmedQuery)}`, {
            signal: abortControllerRef.current.signal
          })
          .then((res) => {
            if (res.data?.data) {
              results.orders = [res.data.data];
            }
          })
          .catch(() => {})
      );

      // Wait for parallel requests to complete
      await Promise.all(promises);

      // 7. Client-side filter for Cities (already fetched)
      results.cities = allCities
        .filter((c) => c.name?.toLowerCase().includes(trimmedQuery.toLowerCase()))
        .slice(0, 5);

      // 8. Offers client-side lookup or fetch
      try {
        const offersRes = await axiosInstance.get(`/offers/get-all-offers?cityId=${selectedCityId}`, {
          signal: abortControllerRef.current.signal
        });
        if (offersRes.data?.data) {
          results.offers = offersRes.data.data
            .filter((o) =>
              o.couponCode?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
              o.title?.toLowerCase().includes(trimmedQuery.toLowerCase())
            )
            .slice(0, 5);
        }
      } catch (e) {}

      // 9. Payments client-side lookup
      try {
        const paymentsRes = await axiosInstance.get("/admin/get-all-payments?limit=80", {
          signal: abortControllerRef.current.signal
        });
        if (paymentsRes.data?.payments) {
          results.payments = paymentsRes.data.payments
            .filter((p) =>
              getPaymentReference(p).toLowerCase().includes(trimmedQuery.toLowerCase()) ||
              p.orderId?.toLowerCase().includes(trimmedQuery.toLowerCase())
            )
            .slice(0, 5);
        }
      } catch (e) {}

      // Check if any results were found
      const hasResults = Object.values(results).some((arr) => arr.length > 0);
      const finalResult = hasResults ? results : null;

      // Cache result
      setSearchCache((prev) => ({
        ...prev,
        [cacheKey]: finalResult
      }));

      setSearchResults(finalResult);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Global search error:", err);
      }
    } finally {
      setIsSearchLoading(false);
    }
  }, [selectedCityId, allCities, searchCache]);

  // Debounce input updates
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(val);
      }, 300);
    } else {
      setSearchResults(null);
    }
  };

  // Add click tracking to Recent Searches
  const handleResultClick = (item, type, path) => {
    // Add to recent searches in localStorage
    const newRecentItem = {
      id: item._id || item.bookingId || item.orderId || Math.random().toString(),
      label: getResultLabel(item, type),
      type,
      path
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.label !== newRecentItem.label);
      const updated = [newRecentItem, ...filtered].slice(0, 10);
      localStorage.setItem("recent_searches", JSON.stringify(updated));
      return updated;
    });

    setIsSearchFocused(false);
    navigate(path);
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  const getPaymentReference = (payment) => {
    const latestTransactionWithPaymentId = [...(payment?.transactions || [])]
      .reverse()
      .find((transaction) => transaction?.razorpayPaymentId);

    return (
      payment?.razorpayPaymentId ||
      payment?.razorpay_payment_id ||
      latestTransactionWithPaymentId?.razorpayPaymentId ||
      payment?.paymentId ||
      payment?._id ||
      ""
    );
  };

  const getResultLabel = (item, type) => {
    switch (type) {
      case "booking":
        return `Booking #${item.bookingId}`;
      case "order":
        return `Order #${item.orderId}`;
      case "customer":
        return item.name;
      case "partner":
        return item.name;
      case "service":
        return item.name;
      case "category":
        return item.name;
      case "city":
        return item.name;
      case "offer":
        return item.couponCode || item.title;
      case "payment":
        return `Payment: ${getPaymentReference(item)}`;
      default:
        return item.name || "Search Result";
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const didLogout = await handleAdminLogout();
    if (didLogout) {
      setIsUserMenuOpen(false);
      setIsLogoutModalOpen(false);
      navigate("/");
    }
  };

  // Quick Create links list
  const quickCreateOptions = [
    { label: "Create Booking", path: "/admin/customers" },
    { label: "Create Customer", path: "/admin/customers" },
    { label: "Create Partner", path: "/admin/partners/create" },
    { label: "Create Offer", path: "/admin/offers/create" },
    { label: "Create Banner", path: "/admin/banners" }
  ];

  // Breadcrumbs parsing
  const pathnames = pathname.split("/").filter((x) => x);
  const getBreadcrumbLabel = (path) => {
    const labels = {
      admin: "Workspace",
      dashboard: "Dashboard",
      bookings: "Bookings Management",
      orders: "Orders Directory",
      categories: "Categories",
      partners: "Service Partners",
      customers: "Customers Directory",
      offers: "Offers & Coupon Codes",
      banners: "Marketing Banners",
      "homepage-trending": "Homepage Trending",
      notifications: "Notifications Campaign",
      payments: "Payments & Financials",
      enquiries: "Customer Enquiries",
      "help-center": "Support Center",
      settings: "Platform Settings",
      globals: "Global Configurations",
      "crash-report": "System Crash Reports",
      "cash-management": "Cash Management",
      "invoice-item-categories": "Invoice Item Categories",
      "seller-cashouts": "Partner Payouts",
      "auto-assign-analytics": "Auto Assign Analytics",
      metrics: "Reports & Analytics",
      create: "Register Partner",
      add: "Add New Details",
      update: "Update Settings",
      info: "Overview Details"
    };

    if (/^[0-9a-fA-F]{24}$/.test(path) || !isNaN(path)) {
      return "Overview Details";
    }

    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  return (
    <>
      <div className="sticky top-0 z-40 px-6 pb-3 pt-5">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, rgba(214,226,245,0.985) 0%, rgba(214,226,245,0.965) 62%, rgba(214,226,245,0.88) 82%, rgba(214,226,245,0) 100%)",
            backdropFilter: "blur(24px) saturate(155%)",
            WebkitBackdropFilter: "blur(24px) saturate(155%)",
          }}
        />

        <header
          className="relative isolate select-none transition-all duration-300"
          style={{
            height: "76px",
            padding: "0 24px",
            background: "rgba(248, 250, 252, 0.96)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            border: "1px solid rgba(226, 232, 240, 0.95)",
            borderRadius: "28px",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)"
          }}
        >
          {/* Background overlay with rounded corners to match the header border radius */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.98) 72%, rgba(241,245,249,1) 100%)",
                backdropFilter: "blur(34px) saturate(180%)",
                WebkitBackdropFilter: "blur(34px) saturate(180%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-slate-100/90" />
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-between gap-4">
          
          {/* 1. Global Search Input */}
          <motion.div
            ref={searchRef}
            className="relative flex items-center"
            animate={{
              width: isSearchFocused ? 520 : 420,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ height: "48px" }}
          >
            <Search className="absolute left-4 size-[18px] text-[#64748B] pointer-events-none top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search customers, partners, bookings, services..."
              className="h-full w-full rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-20 text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all duration-200 outline-none hover:bg-slate-50 focus:border-[#2563EB] focus:bg-white"
              style={{
                boxShadow: isSearchFocused
                  ? "0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1)"
                  : "none"
              }}
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults(null);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-4 p-0.5 hover:bg-slate-100 rounded-md transition-colors text-[#64748B] hover:text-[#0F172A] top-1/2 -translate-y-1/2"
              >
                <X className="size-4" />
              </button>
            ) : (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[10px] font-medium text-[#94A3B8] bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded-md font-mono">
                Ctrl + K
              </span>
            )}

            {/* Search Dropdown Panel */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-[56px] left-0 w-full max-h-[400px] overflow-y-auto rounded-[16px] border border-[#E2E8F0] bg-white shadow-2xl z-50 py-2 scrollbar-thin"
                >
                  {/* Loader State */}
                  {isSearchLoading && (
                    <div className="flex items-center justify-center py-12 gap-3 text-sm text-[#64748B]">
                      <Loader2 className="size-5 animate-spin text-[#2563EB]" />
                      Searching operations database...
                    </div>
                  )}

                  {/* Empty State */}
                  {!isSearchLoading && searchQuery.trim().length >= 2 && !searchResults && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <span className="text-sm text-[#0F172A] font-semibold mb-1">No results found</span>
                      <span className="text-xs text-[#64748B]">No matching items in active scope. Try adjusting search query.</span>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {!isSearchLoading && searchQuery.trim().length < 2 && (
                    <div>
                      {recentSearches.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between px-4 py-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                            <span>Recent Searches</span>
                            <button
                              onClick={clearRecentSearches}
                              className="hover:text-[#2563EB] lowercase font-normal transition-colors cursor-pointer"
                            >
                              clear history
                            </button>
                          </div>
                          <div className="divide-y divide-slate-50">
                            {recentSearches.map((recent) => (
                              <div
                                key={recent.id}
                                onClick={() => {
                                  setIsSearchFocused(false);
                                  navigate(recent.path);
                                }}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-[#0F172A] transition-colors"
                              >
                                <Clock className="size-4 text-[#64748B]" />
                                <span className="flex-1 font-medium">{recent.label}</span>
                                <span className="text-[9px] text-[#64748B] uppercase font-bold bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                                  {recent.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                          <Search className="size-8 text-[#E2E8F0] mb-2" />
                          <span className="text-sm text-[#0F172A] font-semibold mb-1">Search bookings, records, partners...</span>
                          <span className="text-xs text-[#64748B] max-w-[280px]">Type at least 2 characters to instantly search booking IDs, orders, categories, or customers.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grouped Results Display */}
                  {!isSearchLoading && searchResults && (
                    <div className="divide-y divide-[#F1F5F9]">
                      {/* BOOKINGS */}
                      {searchResults.bookings.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Bookings</div>
                          {searchResults.bookings.map((b) => (
                            <div
                              key={b._id}
                              onClick={() => handleResultClick(b, "booking", `/admin/bookings/${b._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Calendar className="size-4 text-[#2563EB]" />
                                <span className="font-semibold text-[#0F172A]">Booking #{b.bookingId}</span>
                                <span className="text-xs text-[#64748B]">({b.userId?.name || "No customer"})</span>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-blue-50 text-blue-700 border border-blue-100">
                                {b.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ORDERS */}
                      {searchResults.orders.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Orders</div>
                          {searchResults.orders.map((o) => (
                            <div
                              key={o._id}
                              onClick={() => handleResultClick(o, "order", `/admin/orders/${o._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <CreditCard className="size-4 text-emerald-600" />
                                <span className="font-semibold text-[#0F172A]">Order #{o.orderId}</span>
                                <span className="text-xs text-[#64748B]">₹{o.orderValue}</span>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {o.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CUSTOMERS */}
                      {searchResults.customers.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Customers</div>
                          {searchResults.customers.map((c) => (
                            <div
                              key={c._id}
                              onClick={() => handleResultClick(c, "customer", `/admin/customers/${c._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Users className="size-4 text-purple-600" />
                                <span className="font-semibold text-[#0F172A]">{c.name}</span>
                                <span className="text-xs text-[#64748B]">{c.phone || c.email}</span>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-[#64748B]">
                                {c.city?.name || "Global"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* PARTNERS */}
                      {searchResults.partners.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Service Partners</div>
                          {searchResults.partners.map((p) => (
                            <div
                              key={p._id}
                              onClick={() => handleResultClick(p, "partner", `/admin/partners/${p._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Building2 className="size-4 text-orange-600" />
                                <span className="font-semibold text-[#0F172A]">{p.name}</span>
                                <span className="text-xs text-[#64748B]">({p.partnerId || p.phone})</span>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-100">
                                {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SERVICES */}
                      {searchResults.services.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Services</div>
                          {searchResults.services.map((s) => (
                            <div
                              key={s._id}
                              onClick={() =>
                                handleResultClick(
                                  s,
                                  "service",
                                  `/admin/categories/${s.categoryId?._id || s.categoryId || "all"}/product/${s._id}`
                                )
                              }
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Sparkles className="size-4 text-amber-500" />
                                <span className="font-semibold text-[#0F172A]">{s.name}</span>
                              </div>
                              <ArrowRight className="size-4 text-[#64748B]" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CATEGORIES */}
                      {searchResults.categories.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Categories</div>
                          {searchResults.categories.map((cat) => (
                            <div
                              key={cat._id}
                              onClick={() => handleResultClick(cat, "category", `/admin/categories/${cat._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Layers className="size-4 text-sky-600" />
                                <span className="font-semibold text-[#0F172A]">{cat.name}</span>
                              </div>
                              <ArrowRight className="size-4 text-[#64748B]" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CITIES */}
                      {searchResults.cities.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Cities</div>
                          {searchResults.cities.map((city) => (
                            <div
                              key={city._id}
                              onClick={() => {
                                setSelectedCity(city);
                                setIsSearchFocused(false);
                                navigate("/admin/available-cities");
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <MapPin className="size-4 text-rose-500" />
                              <span className="font-semibold text-[#0F172A] capitalize">{city.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* OFFERS */}
                      {searchResults.offers.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Offers</div>
                          {searchResults.offers.map((offer) => (
                            <div
                              key={offer._id}
                              onClick={() => handleResultClick(offer, "offer", `/admin/offers/${offer._id}`)}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Gift className="size-4 text-indigo-500" />
                                <span className="font-semibold text-[#0F172A] font-mono">{offer.couponCode}</span>
                                <span className="text-xs text-[#64748B]">({offer.title})</span>
                              </div>
                              <span className="text-xs text-indigo-600 font-semibold font-mono">
                                {offer.discountValue}% Off
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* PAYMENTS */}
                      {searchResults.payments.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-4 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Payments</div>
                          {searchResults.payments.map((p) => (
                            <div
                              key={p._id}
                              onClick={() => handleResultClick(p, "payment", "/admin/payments")}
                              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Tag className="size-4 text-[#64748B]" />
                                <span className="font-semibold text-[#0F172A] font-mono text-xs">{getPaymentReference(p)}</span>
                                <span className="text-xs text-[#64748B]">(Order #{p.orderId})</span>
                              </div>
                              <span className="text-xs font-semibold text-slate-800">
                                ₹{p.amount?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Group: City Selector, Create Button & Profile Dropdown */}
          <div className="flex items-center gap-3">
            
            {/* City Selector */}
            <motion.div
              ref={cityRef}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center justify-between gap-2 h-12 px-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-50 text-xs font-bold text-[#0F172A] shadow-sm transition-all cursor-pointer"
                style={{ minWidth: "130px" }}
              >
                <div className="flex items-center gap-2 truncate">
                  <Globe className="size-4 text-[#2563EB] shrink-0" />
                  <span className="truncate font-semibold text-[#0f172a]">{selectedCity}</span>
                </div>
                <ChevronDown className="size-3.5 text-[#64748B] shrink-0 ml-0.5" />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-44 rounded-[14px] border border-[#E2E8F0] bg-white shadow-xl z-50 overflow-hidden py-1"
                  >
                    {/* All Cities Option */}
                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setIsCityDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer ${
                        selectedCity === "All Cities" ? "bg-[#2563EB]/10 text-[#2563EB] font-bold" : ""
                      }`}
                    >
                      <span>All Cities</span>
                      {selectedCity === "All Cities" && (
                        <span className="size-1.5 bg-[#2563EB] rounded-full" />
                      )}
                    </button>

                    {/* Cities from database */}
                    {allCities.map((city) => (
                      <button
                        key={city._id}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer ${
                          selectedCity === city.name ? "bg-[#2563EB]/10 text-[#2563EB] font-bold" : ""
                        }`}
                      >
                        <span>{city.name}</span>
                        {selectedCity === city.name && (
                          <span className="size-1.5 bg-[#2563EB] rounded-full" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 2. Create Button */}
            <motion.div
              ref={createRef}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className="flex items-center gap-1.5 h-12 px-5 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
              >
                <Plus className="size-4.5" />
                <span>Create</span>
                <ChevronDown className="size-3 text-white/80 ml-0.5" />
              </button>

              <AnimatePresence>
                {isCreateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 rounded-[14px] border border-[#E2E8F0] bg-white shadow-xl z-50 overflow-hidden py-1"
                  >
                    {quickCreateOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsCreateOpen(false);
                          navigate(opt.path);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 3. User Profile Pill Card */}
            <motion.div
              ref={userMenuRef}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 h-12 px-3 pr-4 rounded-[16px] border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#2563EB] border border-[#2563EB]/10 shrink-0">
                  {getInitials(displayName)}
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[12px] font-bold text-[#0F172A] leading-none mb-0.5">{displayName}</span>
                  <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-wider leading-none">
                    {adminInfo.role === "super-admin" ? "SUPER ADMIN" : adminInfo.role || "ADMIN"}
                  </span>
                </div>
                <ChevronDown className="size-3.5 text-[#64748B] ml-1 transition-transform duration-200" style={{ transform: isUserMenuOpen ? "rotate(180deg)" : "rotate(0)" }} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 rounded-[14px] border border-[#E2E8F0] bg-white shadow-xl z-50 overflow-hidden py-1 divide-y divide-[#F1F5F9]"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/admin/settings");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        <User className="size-3.5 text-[#64748B]" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/admin/settings");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        <Users className="size-3.5 text-[#64748B]" />
                        <span>Sub Admins</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/admin/settings");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        <Settings className="size-3.5 text-[#64748B]" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="header-logout-btn flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                      >
                        <LogOut className="size-3.5 text-[#EF4444]" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
          </div>
        </header>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
