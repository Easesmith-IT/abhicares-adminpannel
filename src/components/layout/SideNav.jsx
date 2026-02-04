import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

const SideNav = () => {
  const permissions = JSON.parse(localStorage.getItem("perm")) || {};
  const { pathname } = useLocation();

  const isActive = (path) => pathname.includes(path);

  const baseItem =
    "flex h-[60px] w-full items-center gap-5 px-3 transition-all";
  const hoverItem = "hover:bg-[#A5D3FD] hover:text-white";
  const activeItem = "border-l-[5px] border-[#A5D3FD] bg-[#A5D3FD] text-white";

  const iconClass = "h-6 w-6";

  return (
    <aside className="min-h-[91vh] w-full px-2 py-6 shadow-md glass-header">
      <div className="flex flex-col items-center gap-6">
        {permissions.dashboard !== "none" && (
          <Link
            to="/admin/dashboard"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/dashboard") && activeItem
            }`}
          >
            <LayoutDashboard className={iconClass} />
            <span className="text-[1.3rem] font-medium">Dashboard</span>
          </Link>
        )}

        {permissions.banners !== "none" && (
          <Link
            to="/admin/banners"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/banners") && activeItem
            }`}
          >
            <Image className={iconClass} />
            <span className="text-[1.3rem] font-medium">Banners</span>
          </Link>
        )}

        {permissions.orders !== "none" && (
          <Link
            to="/admin/orders"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/orders") && activeItem
            }`}
          >
            <ShoppingCart className={iconClass} />
            <span className="text-[1.3rem] font-medium">Orders</span>
          </Link>
        )}

        {permissions.bookings !== "none" && (
          <Link
            to="/admin/bookings"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/bookings") && activeItem
            }`}
          >
            <CalendarCheck className={iconClass} />
            <span className="text-[1.3rem] font-medium">Bookings</span>
          </Link>
        )}

        {permissions.services !== "none" && (
          <Link
            to="/admin/services"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/services") && activeItem
            }`}
          >
            <Layers className={iconClass} />
            <span className="text-[1.3rem] font-medium">Categories</span>
          </Link>
        )}

        {permissions.partners !== "none" && (
          <Link
            to="/admin/partners"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/partners") && activeItem
            }`}
          >
            <Globe className={iconClass} />
            <span className="text-[1.3rem] font-medium">Partners</span>
          </Link>
        )}

        {permissions.customers !== "none" && (
          <Link
            to="/admin/customers"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/customers") && activeItem
            }`}
          >
            <Users className={iconClass} />
            <span className="text-[1.3rem] font-medium">Customers</span>
          </Link>
        )}

        {permissions.offers !== "none" && (
          <Link
            to="/admin/offers"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/offers") && activeItem
            }`}
          >
            <Gift className={iconClass} />
            <span className="text-[1.3rem] font-medium">Offers</span>
          </Link>
        )}

        {permissions.availableCities !== "none" && (
          <Link
            to="/admin/available-cities"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/available-cities") && activeItem
            }`}
          >
            <Globe className={iconClass} />
            <span className="text-[1.3rem] font-medium">Available Cities</span>
          </Link>
        )}

        {permissions.payments !== "none" && (
          <Link
            to="/admin/payments"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/payments") && activeItem
            }`}
          >
            <CreditCard className={iconClass} />
            <span className="text-[1.3rem] font-medium">Payments</span>
          </Link>
        )}

        {permissions.helpCenter !== "none" && (
          <Link
            to="/admin/help-center"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/help-center") && activeItem
            }`}
          >
            <LifeBuoy className={iconClass} />
            <span className="text-[1.3rem] font-medium">Help Center</span>
          </Link>
        )}

        {permissions.enquiry !== "none" && (
          <Link
            to="/admin/enquiries"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/enquiries") && activeItem
            }`}
          >
            <HelpCircle className={iconClass} />
            <span className="text-[1.3rem] font-medium">Enquiries</span>
          </Link>
        )}

        {permissions.settings !== "none" && (
          <Link
            to="/admin/settings"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/settings") && activeItem
            }`}
          >
            <Settings className={iconClass} />
            <span className="text-[1.3rem] font-medium">Settings</span>
          </Link>
        )}

        {permissions.reviews !== "none" && (
          <Link
            to="/admin/reviews"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/reviews") && activeItem
            }`}
          >
            <Star className={iconClass} />
            <span className="text-[1.3rem] font-medium">Reviews</span>
          </Link>
        )}

        {permissions.notifications !== "none" && (
          <Link
            to="/admin/send-notifications"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/send-notifications") && activeItem
            }`}
          >
            <Bell className={iconClass} />
            <span className="text-[1.3rem] font-medium">
              Send Notifications
            </span>
          </Link>
        )}

        {permissions.sellerCashout !== "none" && (
          <Link
            to="/admin/seller-cashouts"
            className={`${baseItem} ${hoverItem} ${
              isActive("/admin/seller-cashouts") && activeItem
            }`}
          >
            <Wallet className={iconClass} />
            <span className="text-[1.3rem] font-medium">Seller Cashouts</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default SideNav;
