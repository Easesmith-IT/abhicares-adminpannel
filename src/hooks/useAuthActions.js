import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { changeAdminStatus } from "../store/slices/userSlice";
import { axiosInstance } from "../utils/axiosInstance";
import { readCookie } from "../utils/readCookie";
import { removeSecureItem } from "../utils/secureStorage";
import useCrashReporter from "./useCrashReporter";

const useAuthActions = () => {
  const { reportCrash } = useCrashReporter();
  const dispatch = useDispatch();

  const clearAdminClientState = useCallback(() => {
    dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
    removeSecureItem("admin-status");
    removeSecureItem("perm");
  }, [dispatch]);

  const refreshAdminToken = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      console.log("[FRONTEND AUTH] Access token expired! Requesting new token from backend...");
      const res = await axiosInstance.post("/admin/refresh", {
        adminId: adminInfo?.id,
        role: "admin",
      });
      if (res?.status === 200 || res?.status === 201) {
        console.log("[FRONTEND AUTH] Token refresh successful! New access token cookie set by backend.");
        dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
        return true;
      }
    } catch (error) {
      console.error("Error fetching admin refresh token:", error);
      clearAdminClientState();
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
    return false;
  }, [clearAdminClientState, dispatch, reportCrash]);

  const handleAdminLogout = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      let logoutRes = null;

      if (adminInfo?.id) {
        logoutRes = await axiosInstance.post("/admin/logout-all", {
          adminId: adminInfo.id,
          role: "admin",
        });
      } else {
        logoutRes = await axiosInstance.get("/admin/logout-Admin");
      }

      if (logoutRes?.status === 200 || logoutRes?.status === 201) {
        clearAdminClientState();
        return true;
      }
    } catch (error) {
      try {
        const fallbackRes = await axiosInstance.get("/admin/logout-Admin");
        if (fallbackRes?.status === 200 || fallbackRes?.status === 201) {
          clearAdminClientState();
          return true;
        }
      } catch (fallbackError) {
        console.error("Error logging out admin:", fallbackError);
        reportCrash({
          error: fallbackError,
          screenName: "",
          severity: "HIGH",
          request: {
            url: adminInfo?.id ? "/admin/logout-all" : "/admin/logout-Admin",
            method: adminInfo?.id ? "POST" : "GET",
          },
          userType: "ADMIN",
          userId: adminInfo?.id,
        });
      }
    }
    return false;
  }, [clearAdminClientState, reportCrash]);

  const getAdminStatus = useCallback(async () => {
    const adminInfo = readCookie("adminInfo");
    try {
      const res = await axiosInstance.get("/admin/status");
      if (res?.status === 200 || res?.status === 201) {
        if (res?.data?.isAuthenticated) {
          dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
          return true;
        }

        if (res?.data?.shouldLogOut) {
          await handleAdminLogout();
          return false;
        }

        if (!res?.data?.isAuthenticated) {
          return await refreshAdminToken();
        }
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
      clearAdminClientState();
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
    return false;
  }, [clearAdminClientState, dispatch, refreshAdminToken, handleAdminLogout, reportCrash]);

  return { getAdminStatus, refreshAdminToken, handleAdminLogout };
};

export default useAuthActions;
