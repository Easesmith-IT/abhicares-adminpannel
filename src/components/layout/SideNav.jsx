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

// Config-driven navigation layout
const navigationConfig = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Analytics", href: "/admin/partners/metrics" },
    ],
  },
  {
    title: "Operations",
    icon: ClipboardList,
    items: [
      { name: "Orders", href: "/admin/orders" },
      { name: "Bookings", href: "/admin/bookings" },
      { name: "Offered Bookings", href: "/admin/offered-bookings" },
      { name: "Job Requests", href: "/admin/bookings/rejected-request" },
    ],
  },
  {
    title: "Services",
    icon: Wrench,
    items: [
      { name: "Categories", href: "/admin/categories" },
      { name: "Services", href: "/admin/item-categories" },
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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.18 }}
      className="w-full relative"
    >
      <Link
        to={href}
        className={cn(
          "relative flex items-center justify-between w-full h-9 px-3 rounded-xl cursor-pointer select-none transition-colors duration-200 overflow-hidden",
          isActive
            ? "text-[#2563EB] font-semibold"
            : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/50"
        )}
        style={{ zIndex: 1 }}
      >
        {/* Animated active shared indicator & background */}
        {isActive && (
          <motion.div
            layoutId="active-bg"
            className="absolute inset-0 bg-[#EEF4FF] z-[-1] rounded-xl"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#2563EB] rounded-r-md z-[2]"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        <div className="flex items-center gap-2.5 truncate flex-1">
          {CustomIcon && (
            <CustomIcon
              className={cn(
                "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#0F172A]"
              )}
            />
          )}
          {!isCollapsed && (
            <span className="text-[13px] leading-none tracking-wide truncate">
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
            <Star className={cn("size-3.5", isFavorited && "fill-amber-500 text-amber-500")} />
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
        borderRadius: isVisualExpanded ? 18 : 14,
        padding: isVisualExpanded ? 8 : 0,
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E8EDF5] shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-3 mx-auto overflow-hidden"
    >
      {isVisualExpanded ? (
        <>
          <button
            onClick={onToggle}
            className="flex items-center justify-between w-full px-3 py-2 text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors select-none text-[13px] font-semibold"
          >
            <div className="flex items-center gap-2 truncate flex-1">
              <Icon className="size-4 text-[#64748B] shrink-0" />
              <AnimatePresence>
                {isVisualExpanded && (
                  <motion.div
                    variants={cardContentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="flex items-center justify-between flex-1 truncate pl-1"
                  >
                    <span className="truncate">{title}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChevronDown className="size-3.5 text-[#64748B]" />
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
                <div className="mt-1 space-y-0.5">
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
              "w-full h-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors rounded-[13px] cursor-pointer h-11 w-11",
              isGroupActive && "bg-[#EEF4FF] text-[#2563EB]"
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
    setIsCollapsed,
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
  const hoverTimeoutRef = useRef(null);

  const isVisualExpanded = !isCollapsed || isHovered;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // 500ms delay
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
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
      "/admin/offered-bookings": "bookings",
      "/admin/bookings/rejected-request": "bookings",
      "/admin/categories": "services",
      "/admin/item-categories": "services",
      "/admin/partners": "partners",
      "/admin/partners?status=IN-REVIEW": "partners",
      "/admin/customers": "customers",
      "/admin/offers": "offers",
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
    <div
      className="fixed top-0 bottom-0 left-0 z-50 flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: isVisualExpanded ? 320 : 92 }} // 20px Smart Hover Buffer Zone
    >
      <motion.div
        animate={{ width: isVisualExpanded ? 300 : 72 }}
        transition={{ duration: isVisualExpanded ? 0.28 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-full flex flex-col border-r border-[rgba(15,23,42,0.06)] overflow-hidden select-none w-full shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* 1. Header */}
        <div className={cn(
          "flex flex-col pt-4 pb-3 border-b border-[#E8EDF5] shrink-0",
          isVisualExpanded ? "px-4" : "px-2"
        )}>
          <div className="flex items-center justify-between">
            {isVisualExpanded ? (
              <div className="flex items-center justify-between w-full">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.2 }}
                  className="flex items-center cursor-pointer select-none"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <img
                    src={logo}
                    alt="AbhiCares Logo"
                    className="h-8 w-auto object-contain shrink-0"
                  />
                </motion.div>
                <button
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                    if (isCollapsed) {
                      setIsHovered(false);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0 ml-2"
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
              <img
                src={logo}
                alt="AbhiCares Logo"
                className="h-8 w-8 object-cover object-left cursor-pointer mx-auto transition-transform hover:scale-105"
                onClick={() => navigate("/admin/dashboard")}
              />
            )}
          </div>
        </div>

        {/* 2. Enterprise Search Navigation Bar */}
        <div className={cn(
          "py-2 shrink-0",
          isVisualExpanded ? "px-4" : "px-2"
        )}>
          <Tooltip content="Search (⌘K)" active={!isVisualExpanded}>
            <motion.button
              onClick={() => setIsCmdOpen(true)}
              animate={{ width: isVisualExpanded ? "100%" : 44 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center bg-white hover:bg-slate-50 text-[#64748B] border border-[#E8EDF5] shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-medium overflow-hidden mx-auto cursor-pointer h-11 rounded-[14px]",
                isVisualExpanded ? "px-3 justify-start gap-2.5 w-full" : "justify-center w-11"
              )}
            >
              <Search className="size-4.5 text-[#64748B] shrink-0" />
              {isVisualExpanded && (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    className="text-[13px] text-[#64748B] font-normal flex-1 text-left whitespace-nowrap"
                  >
                    Search...
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    className="text-[9px] text-[#64748B] font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-lg shrink-0"
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
            "flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 space-y-1",
            isVisualExpanded ? "px-4" : "px-2"
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
            <div className="h-px bg-slate-200/85 my-3 mx-2" />
          )}

          {/* Config Groups */}
          {resolvedNavigation.map((group) => (
            <motion.div key={group.title} variants={groupCardVariants}>
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
          ))}
        </motion.div>

        {/* 4. Footer (UserProfile & Context Menu) */}
        <div className={cn(
          "mt-auto border-t border-[#E8EDF5] shrink-0 relative bg-transparent",
          isVisualExpanded ? "p-4" : "p-2"
        )}>
          <div className="flex items-center justify-between">
            {isVisualExpanded ? (
              <div
                className="flex items-center gap-3 cursor-pointer w-full group select-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {/* Avatar */}
                <motion.div
                  variants={avatarVariants}
                  animate={isVisualExpanded ? "expanded" : "collapsed"}
                  className="size-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs shrink-0 border border-[#2563EB]/20 shadow-sm"
                >
                  AD
                </motion.div>
                <div className="flex flex-col truncate flex-1 pl-1">
                  <motion.span
                    custom={0}
                    initial="collapsed"
                    animate={isVisualExpanded ? "expanded" : "collapsed"}
                    variants={textFadeVariants}
                    className="text-[12px] font-semibold text-[#0F172A] truncate"
                  >
                    AbhiCares Admin
                  </motion.span>
                  <motion.span
                    custom={1}
                    initial="collapsed"
                    animate={isVisualExpanded ? "expanded" : "collapsed"}
                    variants={textFadeVariants}
                    className="text-[10px] text-[#64748B] truncate"
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
                  <ChevronDown className="size-3.5 text-[#64748B] group-hover:text-[#0F172A] transition-colors" />
                </motion.div>
              </div>
            ) : (
              <Tooltip content="Profile Options" active={true}>
                <div
                  className="size-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs shrink-0 cursor-pointer border border-[#2563EB]/20 shadow-sm mx-auto hover:scale-105 transition-transform duration-200"
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
                  "absolute bottom-16 left-4 right-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 py-1.5 overflow-hidden",
                  !isVisualExpanded && "left-[48px] bottom-4 w-48 right-auto"
                )}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[9px] uppercase font-bold text-[#64748B]">Current Scope</p>
                  <p className="text-xs text-[#0F172A] font-semibold truncate mt-0.5">
                    City: {selectedCity}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-[#0F172A] hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  <SettingsIcon className="size-3.5 text-[#64748B]" />
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
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-red-650 hover:bg-red-50 transition-colors font-semibold border-t border-slate-100 pt-2 mt-1 cursor-pointer"
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
    </div>
  );
};

export default SideNav;
