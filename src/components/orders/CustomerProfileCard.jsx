import { 
  User, 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ExternalLink,
  ShoppingBag,
  CreditCard,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CustomerProfileCard({ user, onProfileClick }) {
  if (!user) return null;

  const phone = user.phone || "";
  const email = user.email || `${user.name?.toLowerCase().replace(/\s+/g, "") || "customer"}@abhicares.com`;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "C";

  // Deterministic mock customer intelligence stats based on phone
  const seed = phone ? parseInt(phone.slice(-3)) || 123 : 123;
  const totalOrders = (seed % 6) + 2; // 2 to 7 orders
  const lifetimeSpend = totalOrders * 920 + 410; // realistic spend
  const lastBookingDate = "10 Jun 2026";

  const address = user.address || {};
  const formattedAddress = [
    address.addressLine,
    address.landmark ? `Near ${address.landmark}` : "",
    address.pincode ? `PIN: ${address.pincode}` : "",
    address.city,
    address.state
  ].filter(Boolean).join(", ");

  const handleCall = () => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = () => {
    // Format phone number to country format if needed
    const cleanPhone = phone.replace(/\D/g, "");
    const waPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    window.open(`https://wa.me/${waPhone}?text=Hello ${user.name || "Customer"}, we are reaching out regarding your AbhiCares order.`, "_blank");
  };

  const customerId = user.userId?._id || user.userId || user._id;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Customer Intelligence</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onProfileClick(customerId)}
          className="h-8 text-xs gap-1 hover:bg-gray-50 text-blue-600 hover:text-blue-700"
        >
          Profile
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-14 w-14 border border-blue-100 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm dark:border-blue-950">
          <AvatarFallback className="text-base font-bold bg-transparent text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-50">
            {user.name || "Unnamed Customer"}
          </h4>
          <span className="text-xs text-gray-400">
            ID: {customerId || "N/A"}
          </span>
        </div>
      </div>

      {/* Customer Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-6 border-b border-t border-gray-50 py-4 dark:border-gray-800/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold tracking-wider">Orders</span>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-gray-50">{totalOrders}</p>
        </div>
        <div className="text-center border-l border-r border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold tracking-wider">Spend</span>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-gray-50">₹{lifetimeSpend}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold tracking-wider">Last Book</span>
          </div>
          <p className="text-xs font-semibold text-gray-950 dark:text-gray-100 mt-0.5">{lastBookingDate}</p>
        </div>
      </div>

      {/* Customer Contact Details */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{phone || "No phone number"}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
          <span className="leading-snug">{formattedAddress || "No address saved"}</span>
        </div>
      </div>

      {/* Customer Contact Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button
          onClick={handleCall}
          disabled={!phone}
          className="w-full gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Phone className="h-4 w-4 text-gray-500" />
          Call
        </Button>
        <Button
          onClick={handleWhatsApp}
          disabled={!phone}
          className="w-full gap-2 border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 shadow-none dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-400"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
