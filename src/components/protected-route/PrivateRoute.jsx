import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getSecureItem } from "../../utils/secureStorage";
import useAuthActions from "../../hooks/useAuthActions";

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
    const { getAdminStatus } = useAuthActions();
    const permissions = getSecureItem("perm", true) || {};
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const value = pathname.split("/admin/").join("").split("/")[0];
    const foundValue = perm[value];
    const hasPermission = Boolean(
      !pathname.includes("/admin/") ||
      (foundValue && permissions?.[foundValue] && permissions[foundValue] !== "none")
    );

    useEffect(() => {
        let isMounted = true;

        const verifySession = async () => {
            const isAuthenticated = await getAdminStatus();
            if (!isMounted) {
                return;
            }

            if (!isAuthenticated) {
                navigate("/", { replace: true });
                return;
            }

            setIsCheckingAuth(false);
        };

        void verifySession();

        return () => {
            isMounted = false;
        };
    }, [getAdminStatus, navigate, pathname]);

    useEffect(() => {
        if (!isCheckingAuth && (!isAdminAuthenticated || !permissions || !hasPermission)) {
            navigate("/", { replace: true });
        }
    }, [permissions, pathname, isAdminAuthenticated, navigate, hasPermission, isCheckingAuth]);


    // Only render the Outlet if the user has the required permissions
    if (isCheckingAuth) {
        return null;
    }

    if (pathname.includes("/admin/") && isAdminAuthenticated && value && hasPermission) {
        return <Outlet />;
    }

    return null;
};

export default PrivateRoute;
