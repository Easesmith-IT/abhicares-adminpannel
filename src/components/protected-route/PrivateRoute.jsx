import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getSecureItem } from "../../utils/secureStorage";

const PrivateRoute = () => {
    const perm = {
        "dashboard": "dashboard",
        "banners": "banners",
        "orders": "orders",
        "bookings": "bookings",
        "auto-assign-analytics": "bookings",
        "offered-bookings": "bookings",
        "services": "services",
        "categories": "services",
        "invoice-item-categories": "services",
        "homepage-trending": "services",
        "partners": "partners",
        "customers": "customers",
        "offers": "offers",
        "available-cities": "availableCities",
        "payments": "payments",
        "cash-management": "payments",
        "enquiries": "enquiry",
        "help-center": "helpCenter",
        "settings": "settings",
        "globals": "settings",
        "rewards": "settings",
        "reviews": "reviews",
        "notifications": "notifications",
        "send-notifications": "notifications",
        "seller-cashouts": "sellerCashout",
        "crash-report": "dashboard",
    }

    const { pathname } = useLocation();
    const { isAdminAuthenticated } = useSelector((state) => state.user)
    const permissions = getSecureItem("perm", true) || {};
    const navigate = useNavigate();
    const value = pathname.split("/admin/").join("").split("/")[0];
    const foundValue = perm[value];
    const hasPermission = Boolean(
      !pathname.includes("/admin/") ||
      (foundValue && permissions?.[foundValue] && permissions[foundValue] !== "none")
    );

    useEffect(() => {
        if (!isAdminAuthenticated || !permissions || !hasPermission) {
            navigate("/");
        }
    }, [permissions, pathname, isAdminAuthenticated, navigate, hasPermission]);


    // Only render the Outlet if the user has the required permissions
    if (pathname.includes("/admin/") && isAdminAuthenticated && value && hasPermission) {
        return <Outlet />;
    }

    return null;
};

export default PrivateRoute;
