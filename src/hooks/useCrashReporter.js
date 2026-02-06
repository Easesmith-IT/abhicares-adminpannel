import { axiosInstance } from "../utils/axiosInstance";

const getOSInfo = () => {
  const ua = navigator.userAgent;

  if (/Windows NT/.test(ua)) return { os: "Windows" };
  if (/Mac OS X/.test(ua)) return { os: "macOS" };
  if (/Android/.test(ua)) return { os: "Android" };
  if (/iPhone|iPad|iPod/.test(ua)) return { os: "iOS" };
  if (/Linux/.test(ua)) return { os: "Linux" };

  return { os: "Unknown" };
};

const useCrashReporter = () => {
  const osInfo = getOSInfo();

  const reportCrash = async ({
    error,
    screenName,
    severity = "HIGH",
    request = {},
    device = {},
    userId,
    userType,
  }) => {
    
    try {
      await axiosInstance.post(
        "/crash-report/create",
        {
          appName: "Admin Panel",
          appVersion: "1.0.0",
          environment: import.meta.env.MODE,

          errorName: error.response?.data?.name || "UNKNOWN_ERROR",
          errorMessage: error.response?.data?.message || "Something went wrong",
          stackTrace: error?.stack || error.error,

          severity,
          screenName,

          request,
          device: {
            platform: "web",
            browser: navigator.userAgent,
            os: osInfo.os,
            ...device,
          },

          userId,
          userType,
        },
        { withCredentials: true },
      );
    } catch (e) {
      // NEVER toast, NEVER recurse
      console.error("Crash reporting failed:", e);
    }
  };

  return { reportCrash };
};

export default useCrashReporter;
