import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  CreditCard,
  Calendar,
  MessageCircle,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatInstant } from "@/utils/dateTime";

export default function CustomerProfileCard({ user, onProfileClick, order }) {
  if (!user) return null;

  const customerId = user.userId?._id || user.userId || user._id;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CU";
  const phone = user.phone || "";
  const address = user.address || {};
  const formattedAddress = [
    address.addressLine,
    address.landmark || "",
    address.city || "",
    address.state || "",
    address.pincode ? `PIN: ${address.pincode}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const factualStats = [
    {
      label: "Bookings",
      value: Array.isArray(order?.items) ? order.items.length : 0,
      icon: ShoppingBag,
    },
    {
      label: "Order Value",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Number(order?.orderValue || 0)),
      icon: CreditCard,
    },
    {
      label: "Placed",
      value: order?.createdAt
        ? formatInstant(order.createdAt, "dd MMM yyyy")
        : "-",
      icon: Calendar,
    },
  ];

  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone}`, "_self");
    }
  };

  const handleWhatsApp = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, "");
    const waPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    window.open(
      `https://wa.me/${waPhone}?text=Hello ${user.name || "Customer"}, we are reaching out regarding your AbhiCares order.`,
      "_blank",
    );
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Customer Context
        </h3>
        {customerId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onProfileClick(customerId)}
            className="h-8 gap-1 text-xs text-blue-600 hover:bg-gray-50 hover:text-blue-700"
          >
            Profile
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-blue-100 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm dark:border-blue-950">
          <AvatarFallback className="bg-transparent text-base font-bold text-white">
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

      <div className="mb-6 grid grid-cols-3 gap-2.5 border-b border-t border-gray-50 py-4 dark:border-gray-800/50">
        {factualStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-400">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-gray-50 sm:text-sm">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{user.email || "No email available"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{phone || "No phone number"}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span className="leading-snug">
            {formattedAddress || "No address saved on this order"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          onClick={handleCall}
          disabled={!phone}
          className="w-full gap-2 border border-gray-200 bg-white text-gray-700 shadow-none hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Phone className="h-4 w-4 text-gray-500" />
          Call
        </Button>
        <Button
          onClick={handleWhatsApp}
          disabled={!phone}
          className="w-full gap-2 border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-400"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
