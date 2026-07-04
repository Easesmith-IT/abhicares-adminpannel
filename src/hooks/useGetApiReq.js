import { useState, useCallback } from "react";
import { toast } from "sonner";
import { readCookie } from "../utils/readCookie";
import useCrashReporter from "./useCrashReporter";
import useAuthActions from "./useAuthActions";
import { axiosInstance } from "../utils/axiosInstance";
import { usePageLoading } from "@/components/loading/PageLoadingProvider";

const useGetApiReq = () => {
    const [res, setRes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { reportCrash } = useCrashReporter();
    const { getAdminStatus } = useAuthActions();
    const { beginRequest } = usePageLoading();

    const fetchData = useCallback(async (url, config = {}) => {
         const {
           reportCrash: shouldReportCrash = true,
           screenName,
           severity = "HIGH",
           userType = "Admin",
           loadingUi = "global",
           ...axiosConfig
         } = config;

        const finishTrackedRequest = beginRequest({ loadingUi });

        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get(url, axiosConfig);
            if (response.status === 200 || response.status === 201) {
                setRes(response);
            }
        } catch (error) {
            setError(error);
            setRes(null);
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
                console.warn("[FRONTEND AUTH] API request got 401 Unauthorized! Checking auth status...");
                if (adminInfo?.role === "admin") {
                    await getAdminStatus();
                }
            }
        } finally {
            setIsLoading(false);
            finishTrackedRequest();
        }
    }, [beginRequest, reportCrash, getAdminStatus]);

    return { res, isLoading, fetchData, error };
};

export default useGetApiReq;
