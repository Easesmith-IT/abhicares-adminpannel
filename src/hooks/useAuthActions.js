import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { changeAdminStatus } from "../store/slices/userSlice";
import { axiosInstance } from "../utils/axiosInstance";
import { readCookie } from "../utils/readCookie";
import useCrashReporter from "./useCrashReporter";

const useAuthActions = () => {
  const { reportCrash } = useCrashReporter();
  const dispatch = useDispatch();

  const refreshAdminToken = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      const res = await axiosInstance.post("/admin/refresh", {
        adminId: adminInfo?.id,
        role: "admin",
      });
      if (res?.status === 200 || res?.status === 201) {
        dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
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
  }, [dispatch, reportCrash]);

  const handleAdminLogout = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      const logoutRes = await axiosInstance.post("/admin/logout-all", {
        adminId: adminInfo?.id,
        role: "admin",
      });
      if (logoutRes?.status === 200 || logoutRes?.status === 201) {
        dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
        // Clean up storage values
        sessionStorage.removeItem("admin-status");
        sessionStorage.removeItem("perm");
        localStorage.removeItem("admin-status");
        localStorage.removeItem("perm");
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
  }, [dispatch, reportCrash]);

  const getAdminStatus = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      const res = await axiosInstance.get("/admin/status");
      if (res?.status === 200 || res?.status === 201) {
        if (res?.data?.shouldLogOut) {
          await handleAdminLogout();
        } else if (!res?.data?.isAuthenticated) {
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
  }, [refreshAdminToken, handleAdminLogout, reportCrash]);

  return { getAdminStatus, refreshAdminToken, handleAdminLogout };
};

export default useAuthActions;
