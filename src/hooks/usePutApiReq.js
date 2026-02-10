import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { axiosInstance } from "../utils/axiosInstance";
import { readCookie } from "../utils/readCookie";
import { changeAdminStatus } from "../store/slices/userSlice";
import useCrashReporter from "./useCrashReporter";

const usePutApiReq = () => {
  const [res, setRes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { reportCrash } = useCrashReporter();
  const dispatch = useDispatch();

  // Read cookies
  const adminInfo = readCookie("adminInfo");

  /* ---------- Admin status helpers ---------- */

  const getAdminStatus = async () => {
    try {
      const res1 = await axiosInstance.get("/admin/status");
      if (res1?.status === 200 || res1?.status === 201) {
        if (res1?.data?.shouldLogOut) {
          await handleAdminLogout();
        } else if (!res1?.data?.isAuthenticated) {
          await refreshAdminToken();
        }
      }
    } catch (error) {
      reportCrash({
        error,
        severity: "HIGH",
        request: { url: "/admin/status", method: "GET" },
        userType: "ADMIN",
        userId: adminInfo?.id,
      });
    }
  };

  const refreshAdminToken = async () => {
    try {
      const res1 = await axiosInstance.put("/admin/refresh", {
        adminId: adminInfo?.id,
        role: "admin",
      });
      if (res1?.status === 200 || res1?.status === 201) {
        dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
      }
    } catch (error) {
      reportCrash({
        error,
        severity: "HIGH",
        request: { url: "/admin/refresh", method: "PUT" },
        userType: "ADMIN",
        userId: adminInfo?.id,
      });
    }
  };

  const handleAdminLogout = async () => {
    try {
      const res1 = await axiosInstance.put("/admin/logout-all", {
        adminId: adminInfo?.id,
        role: "admin",
      });
      if (res1?.status === 200 || res1?.status === 201) {
        dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
      }
    } catch (error) {
      reportCrash({
        error,
        severity: "HIGH",
        request: { url: "/admin/logout-all", method: "PUT" },
        userType: "ADMIN",
        userId: adminInfo?.id,
      });
    }
  };

  /* ---------- PUT Request ---------- */

  const fetchData = async (url, sendData, config = {}) => {
    const {
      reportCrash: shouldReportCrash = true,
      screenName,
      severity = "HIGH",
      userType = "Admin",
    } = config;

    try {
      setIsLoading(true);
      const response = await axiosInstance.put(url, sendData, {
        ...config,
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setRes(response);
      }
    } catch (error) {
      setError(error);
      toast.error(error.response?.data?.message || "An error occurred.");

      if (shouldReportCrash) {
        reportCrash({
          error,
          screenName,
          severity,
          request: { url, method: "PUT" },
          userId: adminInfo?.id,
          userType,
        });
      }

      if (error?.response?.status === 401) {
        if (adminInfo?.role === "admin") {
          await getAdminStatus();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { res, isLoading, fetchData, error };
};

export default usePutApiReq;
