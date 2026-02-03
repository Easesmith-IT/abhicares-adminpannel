import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  changeAdminStatus,
  changeUserAuthStatus,
} from "../store/slices/userSlice";
import { readCookie } from "../utils/readCookie"; // Adjust path
import useGetApiReq from "./useGetApiReq";
import usePostApiReq from "./hooks copy/usePostApiReq";

export const useAuthStatus = () => {
  const dispatch = useDispatch();
  const isApiCalled = useRef(false);

  // User API hooks
  const { res, fetchData } = useGetApiReq();
  const { res: refreshRes, fetchData: fetchRefreshData } = usePostApiReq();
  const { res: logoutRes, fetchData: fetchLogoutData } = usePostApiReq();

  // Admin API hooks
  const { res: res1, fetchData: fetchData1 } = useGetApiReq();
  const { res: refreshRes1, fetchData: fetchRefreshData1 } = usePostApiReq();
  const { res: logoutRes1, fetchData: fetchLogoutData1 } = usePostApiReq();

  // Read cookies
  const token = readCookie("userInfo");
  const adminInfo = readCookie("adminInfo");

  // Functions
  const getStatus = () => fetchData("/shopping/status");
  const refreshToken = () => fetchRefreshData("/shopping/refresh");
  const logout = () =>
    fetchLogoutData("/shopping/logout-all", {
      phone: token?.phone,
      role: "user",
    });

  const getAdminStatus = () => fetchData1("/admin/status");
  const refreshAdminToken = () => fetchRefreshData1("/admin/refresh");
  const logoutAdmin = () =>
    fetchLogoutData1("/admin/logout-all", {
      adminId: adminInfo?.id,
      role: "admin",
    });

  // User status effect
  useEffect(() => {
    if (!isApiCalled.current) {
      isApiCalled.current = true;
      if (token?.role === "user") getStatus();
      if (adminInfo?.role === "admin") getAdminStatus();
    }
  }, [token, adminInfo]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      dispatch(
        changeUserAuthStatus({ isAuthenticated: res?.data?.isAuthenticated }),
      );
      console.log("User status response:", res);
      res?.data?.shouldLogOut && logout();
      !res?.data?.isAuthenticated && !res?.data?.shouldLogOut && refreshToken();
    }
  }, [res]);

  useEffect(() => {
    if (refreshRes?.status === 200 || refreshRes?.status === 201) {
      console.log("User refresh response:", refreshRes);
      dispatch(changeUserAuthStatus({ isAuthenticated: true }));
    }
  }, [refreshRes]);

  useEffect(() => {
    if (logoutRes?.status === 200 || logoutRes?.status === 201) {
      console.log("User logout response:", logoutRes);
      dispatch(changeUserAuthStatus({ isAuthenticated: false }));
    }
  }, [logoutRes]);

  // Admin status effect
  // useEffect(() => {
  //     if (adminInfo?.role === "admin") getAdminStatus();
  // }, [adminInfo]);

  useEffect(() => {
    if (res1?.status === 200 || res1?.status === 201) {
      dispatch(
        changeAdminStatus({
          isAdminAuthenticated: res1?.data?.isAuthenticated,
        }),
      );
      console.log("Admin status response:", res1);
      res1?.data?.shouldLogOut && logoutAdmin();
      !res1?.data?.isAuthenticated &&
        !res1?.data?.shouldLogOut &&
        refreshAdminToken();
    }
  }, [res1]);

  useEffect(() => {
    if (refreshRes1?.status === 200 || refreshRes1?.status === 201) {
      console.log("Admin refresh response:", refreshRes1);
      dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
    }
  }, [refreshRes1]);

  useEffect(() => {
    if (logoutRes1?.status === 200 || logoutRes1?.status === 201) {
      console.log("Admin logout response:", logoutRes1);
      dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
    }
  }, [logoutRes1]);
};
