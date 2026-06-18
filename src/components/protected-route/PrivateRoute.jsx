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
        "services": "services",
        "partners": "partners",
        "customers": "customers",
        "offers": "offers",
        "available-cities": "availableCities",
        "payments": "payments",
        "enquiries": "enquiry",
        "help-center": "helpCenter",
        "settings": "settings",
        "reviews": "reviews",
        "send-notifications": "notifications",
        "seller-cashouts": "sellerCashout",
    }

    const { pathname } = useLocation();
    const { isAdminAuthenticated } = useSelector((state) => state.user)
    const permissions = getSecureItem("perm", true) || {};
    const navigate = useNavigate();
    const value = pathname.split("/admin/").join("").split("/")[0];
    let foundValue = perm[value];

    useEffect(() => {
        if (!isAdminAuthenticated || !permissions || permissions[foundValue] === "none") {
            navigate("/");
        }
    }, [permissions, pathname, isAdminAuthenticated, value, navigate, foundValue]);

    // Only render the Outlet if the user has the required permissions
    if (pathname.includes("/admin/") && isAdminAuthenticated && value && permissions[foundValue] !== "none") {
        return <Outlet />;
    }

    return null;
};

export default PrivateRoute;
