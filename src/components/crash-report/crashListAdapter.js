// crashListAdapter.ts
import { formatDistanceToNow, format } from "date-fns";
import { formatInstant } from "@/utils/dateTime";

export function adaptCrashForList(crash) {
  return {
    id: crash._id,
    severity: crash.severity,
    environment: crash.environment,
    errorName: crash.errorName,
    errorMessage: crash.errorMessage,
    stackTrace: crash.stackTrace,
    screenName: crash.screenName,
    userType: crash.userType,
    file: crash.stackTrace?.split(" ").pop() || "-",

    appName: crash.appName,
    source: crash.source,
    errorId: crash.errorId,
    request: crash.request,
    device: crash.device,
    platform: crash.device?.platform || "Unknown",
    version: crash.appVersion,

    user: crash?.userId ? `${crash?.userType}` : "Anonymous",

    timeAgo: formatDistanceToNow(new Date(crash.crashAt), { addSuffix: true }),
    timestamp: formatInstant(crash.crashAt, "dd MMM yyyy, hh:mm a"),

    status: crash.resolved ? "Resolved" : "Open",
  };
}

// dummyCrashReports.ts
export const dummyCrashReports = [
  {
    id: "64fa1c001",
    errorId: "ERR-UI-101",
    severity: "critical",
    environment: "production",
    errorName: "TypeError",
    errorMessage: "Cannot read properties of undefined",
    stackTrace: "at Dashboard.jsx:45",
    file: "Dashboard.jsx",
    screenName: "Dashboard",
    appName: "Admin Panel",
    source: "frontend",
    request: "GET /api/users",
    device: { platform: "Web" },
    platform: "Web",
    version: "1.2.0",
    userType: "Admin",
    user: "Admin",
    timeAgo: "5 minutes ago",
    timestamp: "05 Feb 2026, 09:55 AM",
    status: "Open",
  },
  {
    id: "64fa1c002",
    errorId: "ERR-API-404",
    severity: "medium",
    environment: "staging",
    errorName: "AxiosError",
    errorMessage: "Request failed with status code 404",
    stackTrace: "at api.js:88",
    file: "api.js",
    screenName: "Seller Cashouts",
    appName: "Admin Panel",
    source: "backend",
    request: "GET /admin/get-seller-cashout",
    device: { platform: "Web" },
    platform: "Web",
    version: "1.1.5",
    userType: "Seller",
    user: "Seller",
    timeAgo: "2 hours ago",
    timestamp: "05 Feb 2026, 07:40 AM",
    status: "Resolved",
  },
  {
    id: "64fa1c003",
    errorId: "ERR-MOBILE-500",
    severity: "high",
    environment: "production",
    errorName: "NullPointerException",
    errorMessage: "Object reference not set",
    stackTrace: "at HomeScreen.kt:122",
    file: "HomeScreen.kt",
    screenName: "Home",
    appName: "Customer App",
    source: "mobile",
    request: "POST /order/create",
    device: { platform: "Android" },
    platform: "Android",
    version: "3.4.1",
    userType: "User",
    user: "User",
    timeAgo: "1 day ago",
    timestamp: "04 Feb 2026, 10:18 PM",
    status: "Open",
  },
];

