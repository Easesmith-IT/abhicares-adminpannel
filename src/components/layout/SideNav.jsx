"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Image,
  ShoppingCart,
  CalendarCheck,
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
  WalletIcon,
  LayoutGridIcon,
  ClipboardList,
} from "lucide-react";
import logo from "../../assets/logo .png";
import { SidebarHeader } from "../ui/sidebar";
import { cn } from "../../lib/utils";


const SideNav = () => {
  const permissions = JSON.parse(localStorage.getItem("perm")) || {};
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === "/admin/dashboard" ? pathname === path : pathname.startsWith(path);

  const menuItem = (to, label, Icon, allowed = true) =>
    allowed && (
      <SidebarMenuItem key={to}>
        <SidebarMenuButton
          asChild
          isActive={isActive(to)}
          tooltip={label}
          className={cn("gap-x-4 h-11 px-4",isActive(to) && "bg-main! text-white!")}
        >
          <Link to={to}>
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <Sidebar collapsible="icon" className="glass!">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="cursor-pointer"
            >
              <img
                src={logo}
                alt="logo"
                className="h-[50px] w-[160px] object-contain"
              />
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent
        className="
    mt-4
    overflow-y-auto
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:'none']
    [scrollbar-width:'none']
  "
      >
        <SidebarMenu className="px-2">
          {menuItem(
            "/admin/dashboard",
            "Dashboard",
            LayoutDashboard,
            permissions.dashboard !== "none",
          )}
          {menuItem(
            "/admin/banners",
            "Banners",
            Image,
            permissions.banners !== "none",
          )}
          {menuItem(
            "/admin/orders",
            "Orders",
            ShoppingCart,
            permissions.orders !== "none",
          )}
          {menuItem(
            "/admin/bookings",
            "Bookings",
            CalendarCheck,
            permissions.bookings !== "none",
          )}
          {menuItem(
            "/admin/offered-bookings",
            "Offered Bookings",
            ClipboardList,
            permissions.bookings !== "none",
          )}
          {menuItem(
            "/admin/categories",
            "Categories",
            Layers,
            permissions.services !== "none",
          )}
          {menuItem(
            "/admin/partners",
            "Partners",
            Globe,
            permissions.partners !== "none",
          )}
          {menuItem(
            "/admin/customers",
            "Customers",
            Users,
            permissions.customers !== "none",
          )}
          {menuItem(
            "/admin/offers",
            "Offers",
            Gift,
            permissions.offers !== "none",
          )}
          {menuItem(
            "/admin/available-cities",
            "Available Cities",
            Globe,
            permissions.availableCities !== "none",
          )}
          {menuItem(
            "/admin/payments",
            "Payments",
            CreditCard,
            permissions.payments !== "none",
          )}
          {menuItem(
            "/admin/help-center",
            "Help Center",
            LifeBuoy,
            permissions.helpCenter !== "none",
          )}
          {menuItem(
            "/admin/enquiries",
            "Enquiries",
            HelpCircle,
            permissions.enquiry !== "none",
          )}
          {menuItem(
            "/admin/settings",
            "Settings",
            Settings,
            permissions.settings !== "none",
          )}
          {menuItem(
            "/admin/reviews",
            "Reviews",
            Star,
            permissions.reviews !== "none",
          )}
          {/* {menuItem(
            "/admin/send-notifications",
            "Send Notifications",
            Bell,
            permissions.notifications !== "none",
          )} */}
          {menuItem(
            "/admin/seller-cashouts",
            "Seller Cashouts",
            Wallet,
            permissions.sellerCashout !== "none",
          )}
          {menuItem("/admin/crash-report", "Crash Reports", FileWarningIcon)}
          {menuItem("/admin/globals", "Globals", Globe2Icon)}
          {menuItem("/admin/notifications", "Notifications", Bell)}
          {menuItem("/admin/cash-management", "Cash Management", WalletIcon)}
          {menuItem(
            "/admin/item-categories",
            "Item Categories",
            LayoutGridIcon,
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideNav;
