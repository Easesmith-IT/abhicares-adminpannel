import { useState, useCallback } from "react";
import { toast } from "sonner";
import { readCookie } from "../utils/readCookie";
import useCrashReporter from "./useCrashReporter";
import useAuthActions from "./useAuthActions";
import { axiosInstance } from "../utils/axiosInstance";

const useDeleteApiReq = () => {
  const [res, setRes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { reportCrash } = useCrashReporter();
  const { getAdminStatus } = useAuthActions();

  const fetchData = useCallback(async (url, config = {}) => {
    const {
      reportCrash: shouldReportCrash = true,
      screenName,
      severity = "HIGH",
      userType = "Admin",
      ...axiosConfig
    } = config;

    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(url, axiosConfig);
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message);
        setRes(response);
        console.log("delete api response", response);
      }
    } catch (error) {
      setError(error);
      toast.error(error?.response?.data?.message || "An error occurred.");
      const adminInfo = readCookie("adminInfo");
      if (shouldReportCrash) {
        reportCrash({
          error,
          screenName,
          severity,
          request: {
            url,
          },
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
  }, [reportCrash, getAdminStatus]);

  return { res, isLoading, fetchData, error };
};

export default useDeleteApiReq;
