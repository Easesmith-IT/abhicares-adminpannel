import {
  ExternalLink,
  Info,
  MapPin,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AssignedPartnerCard({
  items,
  onAssignClick,
  onPartnerDetailsClick,
}) {
  let partner = null;
  let bookingRef = null;

  if (Array.isArray(items)) {
    for (const item of items) {
      if (item?.bookingId?.sellerId || item?.bookingId?.assignedSellerId) {
        partner = item.bookingId.sellerId || item.bookingId.assignedSellerId;
        bookingRef = item.bookingId;
        break;
      }
    }
  }

  if (!partner) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/20 p-6 shadow-sm dark:border-amber-950/30 dark:bg-amber-950/5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              Professional Unassigned
            </h4>
            <p className="text-xs leading-normal text-amber-700/80 dark:text-amber-500/80">
              This order has one or more services without an allocated partner.
            </p>
            <Button
              onClick={() => onAssignClick(items?.[0]?.bookingId)}
              className="mt-3 h-8 gap-1.5 rounded-lg bg-amber-600 text-xs text-white shadow-none hover:bg-amber-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Allocate Partner
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = partner.name
    ? partner.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PR";

  const handleCall = () => {
    if (partner.phone) {
      window.open(`tel:${partner.phone}`, "_self");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Assigned Professional
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPartnerDetailsClick(partner._id)}
          className="h-8 gap-1 text-xs text-blue-600 hover:bg-gray-50 hover:text-blue-700"
        >
          Details
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-gray-100 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm dark:border-gray-900">
          <AvatarFallback className="bg-transparent text-base font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-gray-900 dark:text-gray-50">
              {partner.name || "Unnamed Partner"}
            </h4>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </div>
          <span className="block text-xs text-gray-400">
            ID: {partner.partnerId || partner._id || "N/A"}
          </span>
          <span className="block text-xs text-gray-500">
            Status: {partner.status || "Unknown"}
          </span>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-50 pt-3 dark:border-gray-800/50">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{partner.phone || "No phone number"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span>
            {typeof partner.city === "object" && partner.city !== null
              ? partner.city.cityName || partner.city.name || "No city assigned"
              : partner.city || "No city assigned"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          onClick={handleCall}
          className="w-full gap-2 border border-gray-200 bg-white text-gray-700 shadow-none hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Phone className="h-4 w-4 text-gray-500" />
          Call Partner
        </Button>
        <Button
          onClick={() => onAssignClick(bookingRef)}
          className="w-full gap-2 border border-gray-200 bg-white text-gray-700 shadow-none hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <UserPlus className="h-4 w-4 text-gray-500" />
          Reassign
        </Button>
      </div>
    </div>
  );
}
