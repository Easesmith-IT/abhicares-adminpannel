import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  Layers,
  Globe,
  Users,
  Gift,
  CreditCard,
  LifeBuoy,
  HelpCircle,
  Settings,
  Star,
  Bell,
  Wallet,
  FileWarningIcon,
  Globe2Icon,
  PlusCircle,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useCustomSidebar } from "./sidebarContext";

// Define all navigation items with metadata for lookup
export const ALL_MENU_ITEMS = [
  // Overview
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Overview" },
  { to: "/admin/partners/metrics", label: "Analytics & Metrics", icon: Sparkles, category: "Overview" },
  
  // Operations
  { to: "/admin/bookings", label: "Bookings Management", icon: CalendarCheck, category: "Operations" },
  { to: "/admin/offered-bookings", label: "Offered Bookings", icon: ClipboardList, category: "Operations" },
  { to: "/admin/bookings/rejected-request", label: "Job Requests (Rejected Requests)", icon: FileWarningIcon, category: "Operations" },
  
  // Services
  { to: "/admin/categories", label: "Categories", icon: Layers, category: "Services" },
  { to: "/admin/item-categories", label: "Invoice Item Categories", icon: Layers, category: "Services" },
  { to: "/admin/available-cities", label: "Available Cities", icon: Globe, category: "Services" },
  
  // Professionals
  { to: "/admin/partners", label: "Service Partners", icon: Globe, category: "Professionals" },
  { to: "/admin/partners?status=IN-REVIEW", label: "Verification Queue", icon: Star, category: "Professionals" },
  { to: "/admin/reviews", label: "Customer Reviews", icon: Star, category: "Professionals" },
  
  // Customers
  { to: "/admin/customers", label: "Customers Directory", icon: Users, category: "Customers" },
  
  // Marketing
  { to: "/admin/offers", label: "Offers & Promo Codes", icon: Gift, category: "Marketing" },
  { to: "/admin/banners", label: "Marketing Banners", icon: ClipboardList, category: "Marketing" },
  { to: "/admin/homepage-trending", label: "Homepage Trending", icon: Sparkles, category: "Marketing" },
  { to: "/admin/notifications", label: "Push Notifications", icon: Bell, category: "Marketing" },
  
  // Finance
  { to: "/admin/payments", label: "Payments & Financials", icon: CreditCard, category: "Finance" },
  { to: "/admin/seller-cashouts", label: "Partner Payouts", icon: Wallet, category: "Finance" },
  { to: "/admin/cash-management", label: "Cash Management", icon: Wallet, category: "Finance" },
  
  // Support
  { to: "/admin/enquiries", label: "Customer Enquiries", icon: HelpCircle, category: "Support" },
  { to: "/admin/help-center", label: "Help Center Tickets", icon: LifeBuoy, category: "Support" },
  
  // Platform
  { to: "/admin/settings", label: "Platform Settings", icon: Settings, category: "Platform" },
  { to: "/admin/globals", label: "Global Configurations", icon: Globe2Icon, category: "Platform" },
  { to: "/admin/crash-report", label: "Crash Reports", icon: FileWarningIcon, category: "Platform" },
];

export const QUICK_ACTIONS = [
  { label: "Add Partner Profile", to: "/admin/partners/create", icon: PlusCircle, shortcut: "A P" },
  { label: "Create Marketing Offer", to: "/admin/offers/create", icon: PlusCircle, shortcut: "A O" },
  { label: "Banner Workspace", to: "/admin/banners", icon: PlusCircle, shortcut: "A B" },
  { label: "Add Service Category", to: "/admin/categories/add-category", icon: PlusCircle, shortcut: "A C" },
  { label: "Add Available City", to: "/admin/available-cities/add", icon: PlusCircle, shortcut: "A T" },
  { label: "Compose Notification Campaign", to: "/admin/notifications/create", icon: PlusCircle, shortcut: "A N" },
];

const CommandPalette = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { favorites, recents, addRecent } = useCustomSidebar();
  const permissions = JSON.parse(localStorage.getItem("perm") || "{}");

  // Filter items based on user role permissions
  const allowedMenuItems = ALL_MENU_ITEMS.filter((item) => {
    // Map UI paths to local permission keys
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
      "/admin/reviews": "reviews",
      "/admin/seller-cashouts": "sellerCashout",
      "/admin/cash-management": "payments",
      "/admin/globals": "settings",
      "/admin/crash-report": "dashboard",
      "/admin/homepage-trending": "services",
    };
    const key = permMap[item.to];
    if (!key) return true; // default visible
    return permissions[key] !== "none";
  });

  const handleSelect = (to) => {
    addRecent(to);
    navigate(to);
    setOpen(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="command-palette-glow bg-white border border-[#E2E8F0] text-slate-800 max-w-2xl"
    >
      <CommandInput
        placeholder="Type a command, search pages, or trigger quick actions..."
        className="text-slate-800 placeholder-slate-400 border-b border-slate-100 py-3 text-base h-12"
      />
      <CommandList className="max-h-[450px] scrollbar-hide py-2 px-1 text-slate-600">
        <CommandEmpty className="py-6 text-center text-slate-400 text-sm">
          No matches found. Try searching for "Bookings", "Partners", or "Payouts".
        </CommandEmpty>

        {/* Quick Actions Section */}
        <CommandGroup heading="Quick Actions" className="text-slate-400 font-semibold text-xs px-2 mb-2">
          {QUICK_ACTIONS.map((action, idx) => {
            return (
              <CommandItem
                key={`qa-${idx}`}
                onSelect={() => handleSelect(action.to)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-700 hover:bg-[#F1F5F9] data-[selected=true]:bg-[#F1F5F9] data-[selected=true]:text-slate-900 transition-colors"
              >
                <Zap className="size-4 text-amber-500 shrink-0" />
                <span className="text-sm">{action.label}</span>
                <span className="ml-auto text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                  {action.shortcut}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator className="bg-slate-100 my-2" />

        {/* Favorites section (if populated) */}
        {favorites.length > 0 && (
          <>
            <CommandGroup heading="Favorites" className="text-slate-400 font-semibold text-xs px-2 mb-2">
              {allowedMenuItems
                .filter((item) => favorites.includes(item.to))
                .map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={`fav-${idx}`}
                      onSelect={() => handleSelect(item.to)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-700 hover:bg-[#F1F5F9] data-[selected=true]:bg-[#F1F5F9] data-[selected=true]:text-slate-900 transition-colors"
                    >
                      <Icon className="size-4 text-blue-600 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                      <span className="ml-auto text-xs text-slate-450 font-light italic">
                        {item.category}
                      </span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
            <CommandSeparator className="bg-slate-100 my-2" />
          </>
        )}

        {/* Recents section (if populated) */}
        {recents.length > 0 && (
          <>
            <CommandGroup heading="Recently Visited" className="text-slate-400 font-semibold text-xs px-2 mb-2">
              {allowedMenuItems
                .filter((item) => recents.includes(item.to))
                .map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={`rec-${idx}`}
                      onSelect={() => handleSelect(item.to)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-700 hover:bg-[#F1F5F9] data-[selected=true]:bg-[#F1F5F9] data-[selected=true]:text-slate-900 transition-colors"
                    >
                      <Icon className="size-4 text-slate-400 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                      <span className="ml-auto text-xs text-slate-450 font-light italic">
                        {item.category}
                      </span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
            <CommandSeparator className="bg-slate-100 my-2" />
          </>
        )}

        {/* Main Navigation links */}
        <CommandGroup heading="All Navigation Pages" className="text-slate-400 font-semibold text-xs px-2">
          {allowedMenuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={`nav-${idx}`}
                onSelect={() => handleSelect(item.to)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-700 hover:bg-[#F1F5F9] data-[selected=true]:bg-[#F1F5F9] data-[selected=true]:text-slate-900 transition-colors"
              >
                <Icon className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm">{item.label}</span>
                <span className="ml-auto text-xs text-slate-450 font-light italic">
                  {item.category}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;

