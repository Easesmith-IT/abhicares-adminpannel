import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Search,
  Star,
  ChevronRight,
  ChevronLeft,
  Globe,
  User,
  Settings as SettingsIcon,
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Users,
  UserCheck,
  Megaphone,
  CreditCard,
  HelpCircle,
  History,
} from "lucide-react";
import logo from "../../assets/logo .png";
import { cn } from "../../lib/utils";
import { useCustomSidebar } from "./sidebarContext";
import CommandPalette, { ALL_MENU_ITEMS } from "./CommandPalette";

const COLLAPSED_PANEL_WIDTH = 72;
const COLLAPSED_HIT_WIDTH = 88;
const EXPANDED_PANEL_WIDTH = 300;
const EXPANDED_HIT_WIDTH = 312;
const SIDEBAR_TRANSITION = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1],
};
const SIDEBAR_HOVER_OPEN_DELAY_MS = 40;
const SIDEBAR_HOVER_CLOSE_DELAY_MS = 160;

// Config-driven navigation layout
const navigationConfig = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", href: "/admin/dashboard" },
    ],
  },
  {
    title: "Operations",
    icon: ClipboardList,
    items: [
      { name: "Orders", href: "/admin/orders" },
      { name: "Bookings", href: "/admin/bookings" },
      { name: "Offered Bookings", href: "/admin/offered-bookings" },
      { name: "Auto Assign Analytics", href: "/admin/auto-assign-analytics" },
      { name: "Job Requests", href: "/admin/bookings/rejected-request" },
    ],
  },
  {
    title: "Services",
    icon: Wrench,
    items: [
      { name: "Categories", href: "/admin/categories" },
      { name: "Invoice Item Categories", href: "/admin/invoice-item-categories" },
      { name: "Cities", href: "/admin/available-cities" },
    ],
  },
  {
    title: "Professionals",
    icon: Users,
    items: [
      { name: "Service Partners", href: "/admin/partners" },
      { name: "Verification Queue", href: "/admin/partners?status=IN-REVIEW" },
      { name: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    title: "Customers",
    icon: UserCheck,
    items: [
      { name: "Customers", href: "/admin/customers" },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    items: [
      { name: "Offers", href: "/admin/offers" },
      { name: "Banners", href: "/admin/banners" },
      { name: "Homepage Trending", href: "/admin/homepage-trending" },
      { name: "Notifications", href: "/admin/notifications" },
      { name: "Rewards & Referrals", href: "/admin/rewards" },
    ],
  },
  {
    title: "Finance",
    icon: CreditCard,
    items: [
      { name: "Payments", href: "/admin/payments" },
      { name: "Partner Payouts", href: "/admin/seller-cashouts" },
      { name: "Cash Management", href: "/admin/cash-management" },
    ],
  },
  {
    title: "Support",
    icon: HelpCircle,
    items: [
      { name: "Enquiries", href: "/admin/enquiries" },
      { name: "Help Center", href: "/admin/help-center" },
    ],
  },
  {
    title: "Platform",
    icon: SettingsIcon,
    items: [
      { name: "Settings", href: "/admin/settings" },
      { name: "Globals", href: "/admin/globals" },
      { name: "Crash Reports", href: "/admin/crash-report" },
    ],
  },
];

// Tooltip component for collapsed state
const Tooltip = ({ content, children, active }) => {
  const [hovered, setHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (hovered && active) {
      timerRef.current = setTimeout(() => {
        setShouldShow(true);
      }, 100);
    } else {
      setShouldShow(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hovered, active]);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 5 }}
            animate={{ opacity: 1, scale: 1, x: 10 }}
            exit={{ opacity: 0, scale: 0.96, x: 5 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[100%] ml-2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Motion variants for accordion lists
const groupVariants = {
  closed: {
    height: 0,
    opacity: 0,
    y: -4,
    transition: {
      height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.15 },
      y: { duration: 0.15 },
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    y: 0,
    transition: {
      height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.25 },
      y: { duration: 0.25 },
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const childVariants = {
  closed: { opacity: 0, y: -4 },
  open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Navigation Item component
const NavigationItem = ({ name, href, icon: CustomIcon, isCollapsed, isActive, isFavorited, onToggleFavorite }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full relative px-1"
    >
      <Link
        to={href}
        className={cn(
          "relative group flex items-center justify-between w-full h-11 px-4 rounded-xl cursor-pointer select-none transition-all duration-200 overflow-hidden",
          isActive
            ? "text-white font-semibold bg-linear-to-r from-[#2563EB] to-[#3B82F6] shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
            : "text-sidebar-text-secondary hover:text-sidebar-text-hover hover:bg-sidebar-hover"
        )}
        style={{ zIndex: 1 }}
      >
        <div className="flex items-center gap-3 truncate flex-1">
          {CustomIcon && (
            <CustomIcon
              className={cn(
                "size-5 shrink-0 transition-colors duration-200",
                isActive ? "text-white" : "text-sidebar-icon group-hover:text-sidebar-icon-hover"
              )}
            />
          )}
          {!isCollapsed && (
            <span className="text-[14px] tracking-wide truncate">
              {name}
            </span>
          )}
        </div>

        {/* Favorite Star Button */}
        {!isCollapsed && onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(href);
            }}
            className={cn(
              "p-1 text-slate-300 hover:text-amber-500 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200 shrink-0",
              isFavorited && "opacity-100 text-amber-500"
            )}
          >
            <Star className={cn("size-4", isFavorited && "fill-amber-500 text-amber-500")} />
          </button>
        )}
      </Link>
    </motion.div>
  );
};

// Motion variants for cards and label reveals
const groupCardVariants = {
  collapsed: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  }
};

const cardContentVariants = {
  collapsed: { opacity: 0, x: -8 },
  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
};

// Independent navigation group card
const NavigationGroup = ({
  title,
  icon: Icon,
  items,
  isOpen,
  onToggle,
  isVisualExpanded,
  pathname,
  favorites,
  onToggleFavorite,
  isActivePath,
}) => {
  if (items.length === 0) return null;

  const isGroupActive = items.some((item) => isActivePath(item.href));

  return (
    <motion.div
      layout
      animate={{
        width: isVisualExpanded ? "100%" : 44,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto overflow-hidden w-full"
    >
      {isVisualExpanded ? (
        <>
          <button
            onClick={onToggle}
            className="flex items-center justify-between w-full px-2 py-1 text-[#6B7A92] hover:text-white rounded-lg transition-colors select-none text-[12px] font-bold tracking-[0.08em] uppercase"
          >
            <span className="truncate pl-1 text-left">{title}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown className="size-3.5 text-[#6B7A92]" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {isOpen && isVisualExpanded && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={groupVariants}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-1.5">
                  {items.map((item) => (
                    <motion.div key={item.href} variants={childVariants}>
                      <NavigationItem
                        name={item.name}
                        href={item.href}
                        icon={item.icon || ChevronRight}
                        isCollapsed={!isVisualExpanded}
                        isActive={isActivePath(item.href)}
                        isFavorited={favorites.includes(item.href)}
                        onToggleFavorite={onToggleFavorite}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Tooltip content={title} active={true}>
          <button
            onClick={onToggle}
            className={cn(
              "w-11 h-11 flex items-center justify-center text-sidebar-icon hover:text-sidebar-text-hover hover:bg-sidebar-hover transition-all duration-200 rounded-[10px] cursor-pointer mx-auto",
              isGroupActive && "bg-sidebar-active text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)]"
            )}
          >
            <Icon className="size-5 shrink-0" />
          </button>
        </Tooltip>
      )}
    </motion.div>
  );
};

// List stagger variants
const listVariants = {
  collapsed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  },
  expanded: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Sequentual text reveal variants for profile
const textFadeVariants = {
  collapsed: { opacity: 0, x: -10, display: "none" },
  expanded: (i) => ({
    opacity: 1,
    x: 0,
    display: "flex",
    transition: {
      delay: i * 0.08 + 0.1,
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

const avatarVariants = {
  collapsed: { scale: 0.95 },
  expanded: { scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
};

const SideNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    isCollapsed,
    toggleSidebar,
    selectedCity,
    setSelectedCity,
    favorites,
    toggleFavorite,
    recents,
    addRecent,
  } = useCustomSidebar();

  const permissions = JSON.parse(localStorage.getItem("perm") || "{}");

  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Hover states for Peek Navigation
  const [isHovered, setIsHovered] = useState(false);
  const hoverOpenTimeoutRef = useRef(null);
  const hoverCloseTimeoutRef = useRef(null);

  const isVisualExpanded = !isCollapsed || isHovered;

  const handleMouseEnter = () => {
    if (!isCollapsed) return;

    if (hoverCloseTimeoutRef.current) {
      clearTimeout(hoverCloseTimeoutRef.current);
      hoverCloseTimeoutRef.current = null;
    }

    if (hoverOpenTimeoutRef.current) return;

    hoverOpenTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      hoverOpenTimeoutRef.current = null;
    }, SIDEBAR_HOVER_OPEN_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (!isCollapsed) return;

    if (hoverOpenTimeoutRef.current) {
      clearTimeout(hoverOpenTimeoutRef.current);
      hoverOpenTimeoutRef.current = null;
    }

    if (hoverCloseTimeoutRef.current) {
      clearTimeout(hoverCloseTimeoutRef.current);
    }

    hoverCloseTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      hoverCloseTimeoutRef.current = null;
    }, SIDEBAR_HOVER_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (hoverOpenTimeoutRef.current) clearTimeout(hoverOpenTimeoutRef.current);
      if (hoverCloseTimeoutRef.current) clearTimeout(hoverCloseTimeoutRef.current);
    };
  }, []);

  // Accordion open/close state
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem("sidebar_sections");
    return saved
      ? JSON.parse(saved)
      : {
          Overview: true,
          Operations: true,
          Services: true,
          Professionals: false,
          Customers: false,
          Marketing: false,
          Finance: false,
          Support: false,
          Platform: false,
        };
  });

  const toggleSection = (sectionId) => {
    if (!isVisualExpanded) {
      handleMouseEnter();
      setExpandedSections((prev) => {
        const next = { ...prev, [sectionId]: true };
        localStorage.setItem("sidebar_sections", JSON.stringify(next));
        return next;
      });
      return;
    }

    setExpandedSections((prev) => {
      const next = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem("sidebar_sections", JSON.stringify(next));
      return next;
    });
  };

  // Shortcut key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActivePath = (path) => {
    if (path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path.split("?")[0]);
  };

  const isAllowed = (path) => {
    const permMap = {
      "/admin/dashboard": "dashboard",
      "/admin/banners": "banners",
      "/admin/orders": "orders",
      "/admin/bookings": "bookings",
      "/admin/auto-assign-analytics": "bookings",
      "/admin/offered-bookings": "bookings",
      "/admin/bookings/rejected-request": "bookings",
      "/admin/categories": "services",
      "/admin/invoice-item-categories": "services",
      "/admin/partners": "partners",
      "/admin/partners?status=IN-REVIEW": "partners",
      "/admin/customers": "customers",
      "/admin/offers": "offers",
      "/admin/notifications": "notifications",
      "/admin/available-cities": "availableCities",
      "/admin/payments": "payments",
      "/admin/help-center": "helpCenter",
      "/admin/enquiries": "enquiry",
      "/admin/settings": "settings",
      "/admin/rewards": "settings",
      "/admin/reviews": "reviews",
      "/admin/seller-cashouts": "sellerCashout",
      "/admin/cash-management": "payments",
      "/admin/globals": "settings",
      "/admin/crash-report": "dashboard",
      "/admin/homepage-trending": "services",
    };
    const key = permMap[path];
    if (!key) return false;
    return permissions[key] !== "none";
  };

  const getMenuItemDetails = (to) => {
    const matched = ALL_MENU_ITEMS.find((item) => item.to === to);
    if (matched) return matched;
    const label = to.replace("/admin/", "").replace("-", " ").replace(/\?.*$/, "");
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      icon: ChevronRight,
      to,
    };
  };

  const resolvedNavigation = navigationConfig.map((group) => {
    const allowedItems = group.items
      .filter((item) => isAllowed(item.href))
      .map((item) => {
        const details = getMenuItemDetails(item.href);
        return {
          name: item.name,
          href: item.href,
          icon: details.icon,
        };
      });

    return {
      ...group,
      items: allowedItems,
    };
  }).filter((group) => group.items.length > 0);

  const favoritesItems = ALL_MENU_ITEMS.filter(
    (item) => favorites.includes(item.to) && isAllowed(item.to)
  ).map((item) => ({
    name: item.label,
    href: item.to,
    icon: item.icon,
  }));

  const recentsItems = ALL_MENU_ITEMS.filter(
    (item) => recents.includes(item.to) && isAllowed(item.to)
  ).map((item) => ({
    name: item.label,
    href: item.to,
    icon: item.icon,
  }));

  return (
    <motion.div
      className="fixed top-0 bottom-0 left-0 z-50 flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: isVisualExpanded ? EXPANDED_HIT_WIDTH : COLLAPSED_HIT_WIDTH }}
      transition={SIDEBAR_TRANSITION}
    >
      <motion.div
        animate={{ width: isVisualExpanded ? EXPANDED_PANEL_WIDTH : COLLAPSED_PANEL_WIDTH }}
        transition={SIDEBAR_TRANSITION}
        className="h-full flex flex-col border-r border-sidebar-border overflow-hidden select-none w-full"
        style={{
          background: "var(--sidebar-bg, #F3F6FB)",
        }}
      >
        {/* 1. Header */}
        <div className={cn(
          "flex flex-col pt-5 pb-4 border-b border-sidebar-border shrink-0",
          isVisualExpanded ? "px-5" : "px-3"
        )}>
          <div className="flex items-center justify-between">
            {isVisualExpanded ? (
              <div className="flex items-center justify-between gap-3 w-full">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.2 }}
                  className="flex items-center gap-3.5 cursor-pointer select-none flex-1 bg-white/8 border border-[rgba(255,255,255,0.08)] backdrop-blur-[10px] rounded-[14px] py-[10px] px-[14px]"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] shrink-0 overflow-hidden">
                    <img
                      src={logo}
                      alt="AbhiCares Icon"
                      className="w-6 h-6 object-cover object-left shrink-0"
                    />
                  </div>
                  <span className="text-[#F8FAFC] font-bold text-[16px] tracking-wide">
                    AbhiCares
                  </span>
                </motion.div>
                <button
                  onClick={() => {
                    toggleSidebar();
                    if (isCollapsed) {
                      if (hoverOpenTimeoutRef.current) {
                        clearTimeout(hoverOpenTimeoutRef.current);
                        hoverOpenTimeoutRef.current = null;
                      }
                      if (hoverCloseTimeoutRef.current) {
                        clearTimeout(hoverCloseTimeoutRef.current);
                        hoverCloseTimeoutRef.current = null;
                      }
                      setIsHovered(false);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-sidebar-hover text-sidebar-text-secondary hover:text-sidebar-text-primary transition-colors cursor-pointer shrink-0"
                  title={isCollapsed ? "Pin Sidebar Open" : "Collapse Sidebar"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="size-4" />
                  ) : (
                    <ChevronLeft className="size-4" />
                  )}
                </button>
              </div>
            ) : (
              <div
                className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer mx-auto transition-transform hover:scale-105 overflow-hidden"
                onClick={() => navigate("/admin/dashboard")}
              >
                <img
                  src={logo}
                  alt="AbhiCares Logo"
                  className="w-6 h-6 object-cover object-left shrink-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. Enterprise Search Navigation Bar */}
        <div className={cn(
          "py-3 shrink-0",
          isVisualExpanded ? "px-5" : "px-3"
        )}>
          <Tooltip content="Search (⌘K)" active={!isVisualExpanded}>
            <motion.button
              onClick={() => setIsCmdOpen(true)}
              animate={{ width: isVisualExpanded ? "100%" : 44 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center bg-white/6 backdrop-blur-[12px] hover:bg-white/10 text-sidebar-text-secondary border border-[rgba(255,255,255,0.08)] font-medium overflow-hidden mx-auto cursor-pointer h-11 rounded-[14px]",
                isVisualExpanded ? "px-3 justify-start gap-2.5 w-full" : "justify-center w-11"
              )}
            >
              <Search className="size-4.5 text-sidebar-icon shrink-0" />
              {isVisualExpanded && (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    className="text-[13px] text-[#94A3B8] font-normal flex-1 text-left whitespace-nowrap"
                  >
                    Search...
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    className="text-[9px] text-[#94A3B8] font-mono bg-sidebar-hover border border-sidebar-border px-1.5 py-0.5 rounded-lg shrink-0"
                  >
                    ⌘K
                  </motion.span>
                </>
              )}
            </motion.button>
          </Tooltip>
        </div>

        {/* 3. Navigation Groups (Scrollable) */}
        <motion.div
          variants={listVariants}
          initial="collapsed"
          animate={isVisualExpanded ? "expanded" : "collapsed"}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden thin-scrollbar py-3 space-y-1.5",
            isVisualExpanded ? "px-5" : "px-3"
          )}
        >
          {/* Favorites Section */}
          {favoritesItems.length > 0 && (
            <motion.div variants={groupCardVariants}>
              <NavigationGroup
                title="Favorites"
                icon={Star}
                items={favoritesItems}
                isOpen={expandedSections["Favorites"]}
                onToggle={() => {
                  setExpandedSections((prev) => ({ ...prev, Favorites: !prev.Favorites }));
                }}
                isVisualExpanded={isVisualExpanded}
                pathname={pathname}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isActivePath={isActivePath}
              />
            </motion.div>
          )}

          {/* Recents Section */}
          {recentsItems.length > 0 && (
            <motion.div variants={groupCardVariants}>
              <NavigationGroup
                title="Recents"
                icon={History}
                items={recentsItems}
                isOpen={expandedSections["Recents"]}
                onToggle={() => {
                  setExpandedSections((prev) => ({ ...prev, Recents: !prev.Recents }));
                }}
                isVisualExpanded={isVisualExpanded}
                pathname={pathname}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isActivePath={isActivePath}
              />
            </motion.div>
          )}

          {/* Divider if Favorites/Recents are shown */}
          {(favoritesItems.length > 0 || recentsItems.length > 0) && isVisualExpanded && (
            <div className="h-px bg-sidebar-border my-6 mx-1" />
          )}

          {/* Config Groups */}
          {resolvedNavigation.map((group, index) => (
            <React.Fragment key={group.title}>
              <motion.div variants={groupCardVariants}>
                <NavigationGroup
                  title={group.title}
                  icon={group.icon}
                  items={group.items}
                  isOpen={expandedSections[group.title]}
                  onToggle={() => toggleSection(group.title)}
                  isVisualExpanded={isVisualExpanded}
                  pathname={pathname}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  isActivePath={isActivePath}
                />
              </motion.div>
              {index < resolvedNavigation.length - 1 && isVisualExpanded && (
                <div className="h-px bg-sidebar-border my-6 mx-1" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* 4. Footer (UserProfile & Context Menu) */}
        <div className={cn(
          "mt-auto border-t border-sidebar-border shrink-0 relative bg-transparent",
          isVisualExpanded ? "p-5" : "p-3"
        )}>
          <div className="flex items-center justify-between">
            {isVisualExpanded ? (
              <div
                className="flex items-center gap-3 cursor-pointer w-full group select-none bg-sidebar-profile-bg border border-[rgba(255,255,255,0.08)] p-2.5 rounded-[14px]"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {/* Avatar */}
                <motion.div
                  variants={avatarVariants}
                  animate={isVisualExpanded ? "expanded" : "collapsed"}
                  className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[11px] shrink-0 shadow-sm"
                >
                  AD
                </motion.div>
                <div className="flex flex-col truncate flex-1 pl-0.5">
                  <motion.span
                    custom={0}
                    initial="collapsed"
                    animate={isVisualExpanded ? "expanded" : "collapsed"}
                    variants={textFadeVariants}
                    className="text-[12px] font-bold text-sidebar-text-primary truncate"
                  >
                    AbhiCares Admin
                  </motion.span>
                  <motion.span
                    custom={1}
                    initial="collapsed"
                    animate={isVisualExpanded ? "expanded" : "collapsed"}
                    variants={textFadeVariants}
                    className="text-[10px] text-sidebar-text-secondary truncate"
                  >
                    admin@abhicares.com
                  </motion.span>
                </div>
                <motion.div
                  custom={2}
                  initial="collapsed"
                  animate={isVisualExpanded ? "expanded" : "collapsed"}
                  variants={textFadeVariants}
                  className="shrink-0"
                >
                  <ChevronDown className="size-3.5 text-sidebar-icon group-hover:text-sidebar-text-primary transition-colors" />
                </motion.div>
              </div>
            ) : (
              <Tooltip content="Profile Options" active={true}>
                <div
                  className="size-10 rounded-[14px] bg-sidebar-profile-bg border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-primary font-bold text-xs shrink-0 cursor-pointer mx-auto hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  AD
                </div>
              </Tooltip>
            )}
          </div>

          {/* Context Menu Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute bottom-[72px] left-5 right-5 bg-white border border-sidebar-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden",
                  !isVisualExpanded && "left-[80px] bottom-4 w-48 right-auto"
                )}
              >
                <div className="px-3 py-1.5 border-b border-sidebar-border mb-1">
                  <p className="text-[9px] uppercase font-bold text-sidebar-text-secondary">Current Scope</p>
                  <p className="text-xs text-sidebar-text-primary font-semibold truncate mt-0.5">
                    City: {selectedCity}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-sidebar-text-primary hover:bg-sidebar-hover transition-colors font-medium cursor-pointer"
                >
                  <SettingsIcon className="size-3.5 text-sidebar-icon" />
                  <span>Platform Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    const logoutBtn = document.querySelector(".header-logout-btn");
                    if (logoutBtn) {
                      logoutBtn.click();
                    } else {
                      localStorage.removeItem("perm");
                      localStorage.setItem("admin-status", false);
                      navigate("/");
                    }
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-red-650 hover:bg-red-50 transition-colors font-semibold border-t border-sidebar-border pt-2 mt-1 cursor-pointer"
                >
                  <LogOut className="size-3.5 text-red-500" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CommandPalette open={isCmdOpen} setOpen={setIsCmdOpen} />
      </motion.div>
    </motion.div>
  );
};

export default SideNav;
