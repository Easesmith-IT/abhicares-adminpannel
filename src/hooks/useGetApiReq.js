import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { readCookie } from "../utils/readCookie";
import { changeAdminStatus, changeUserAuthStatus } from "../store/slices/userSlice";
import useCrashReporter from "./useCrashReporter";

const useGetApiReq = () => {
    const [res, setRes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { reportCrash } = useCrashReporter();
    const dispatch = useDispatch();
    const isApiCalled = useRef(false);

    // Read cookies
    const adminInfo = readCookie("adminInfo");

    const getAdminStatus = async () => {
        try {
            const res1 = await axiosInstance.get("/admin/status");
            if (res1?.status === 200 || res1?.status === 201) {
                // dispatch(changeAdminStatus({ isAdminAuthenticated: res1?.data?.isAuthenticated }));
                console.log("Admin status response:", res1);
                if (res1?.data?.shouldLogOut) {
                    await handleAdminLogout();
                } else if (!res1?.data?.isAuthenticated) {
                    await refreshAdminToken();
                }
            }
        } catch (error) {
            console.error("Error fetching admin status:", error);
            reportCrash({
              error,
              screenName: "",
              severity: "HIGH",
              request: {
                url: "/admin/status",
                method: "GET",
              },
              userType: "ADMIN",
              userId: adminInfo?.id,
            });
        }
    };

   
    const refreshAdminToken = async () => {
        try {
            const res1 = await axiosInstance.post("/admin/refresh", { adminId: adminInfo?.id, role: "admin" });
            if (res1?.status === 200 || res1?.status === 201) {
                dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
                console.log("refresh response:", res1);
            }
        } catch (error) {
            console.error("Error fetching admin refresh token:", error);
            reportCrash({
              error,
              screenName: "",
              severity: "HIGH",
              request: {
                url: "/admin/refresh",
                method: "POST",
              },
              userType: "ADMIN",
              userId: adminInfo?.id,
            });
        }
    };

    const handleAdminLogout = async () => {
        try {
            const logoutRes1 = await axiosInstance.post("/admin/logout-all", { adminId: adminInfo?.id, role: "admin" });
            if (logoutRes1?.status === 200 || logoutRes1?.status === 201) {
                console.log("Admin logout response:", logoutRes1);
                dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
            }
        } catch (error) {
            console.error("Error logging out admin:", error);
            reportCrash({
              error,
              screenName: "",
              severity: "HIGH",
              request: {
                url: "/admin/logout-all",
                method: "POST",
              },
              userType: "ADMIN",
              userId: adminInfo?.id,
            });
        }
    };

    const fetchData = async (url, config = {}) => {
         const {
           reportCrash: shouldReportCrash = true,
           screenName,
           severity = "HIGH",
           userType = "Admin",
         } = config;

        try {
            setIsLoading(true);
            const response = await axiosInstance.get(url, config);
            if (response.status === 200 || response.status === 201) {
                setRes(response);
            }
        } catch (error) {
            setError(error);
            console.log("error- get api hook", error);
            toast.error(error.response?.data?.message || "An error occurred.")
            if (shouldReportCrash) {
              reportCrash({
                error,
                screenName,
                severity,
                request: {
                  url,
                },
                userId: adminInfo.id,
                userType,
              });
            }
            if (error?.response?.status === 401) {
                if (adminInfo?.role === "admin") getAdminStatus();
            }
            // await dispatch(handleErrorModal({ isOpen: true, message: error.response?.data?.message || "An error occurred.", isLogoutBtn: true }));
        } finally {
            setIsLoading(false);
        }
    };

    return { res, isLoading, fetchData,error };


};

export default useGetApiReq;