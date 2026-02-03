import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { readCookie } from "../utils/readCookie";
import { changeAdminStatus, changeUserAuthStatus } from "../store/slices/userSlice";

const usePatchApiReq = () => {
    const [res, setRes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const isApiCalled = useRef(false);

    // Read cookies
    const token = readCookie("userInfo");
    const adminInfo = readCookie("adminInfo");

    const getStatus = async () => {
        try {
            const statusRes = await axiosInstance.get("/shopping/status");
            if (statusRes?.status === 200 || statusRes?.status === 201) {
                // dispatch(changeUserAuthStatus({ isAuthenticated: statusRes?.data?.isAuthenticated }));
                console.log("User status response:", statusRes);
                if (statusRes?.data?.shouldLogOut) {
                    await handleLogout();
                } else if (!statusRes?.data?.isAuthenticated) {
                    await refreshToken();
                }
            }
        } catch (error) {
            console.error("Error fetching status:", error);
        }
    };

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
        }
    };

    const refreshToken = async () => {
        try {
            const res1 = await axiosInstance.post("/shopping/refresh", { phone: token?.phone, role: "user" });
            if (res1?.status === 200 || res1?.status === 201) {
                dispatch(changeUserAuthStatus({ isAuthenticated: true }));
                console.log("refresh response:", res1);
            }
        } catch (error) {
            console.error("Error fetching refresh token:", error);
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
        }
    };


    const handleLogout = async () => {
        try {
            const logoutRes = await axiosInstance.post("/shopping/logout-all", { phone: token?.phone, role: "user" });
            if (logoutRes?.status === 200 || logoutRes?.status === 201) {
                console.log("Logout response:", logoutRes);
                dispatch(changeUserAuthStatus({ isAuthenticated: false }));
            }
        } catch (error) {
            console.error("Error logging out:", error);
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
        }
    };

    const fetchData = async (url, sendData, config = {}) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.patch(url, sendData, config);
            console.log("res", response);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                setRes(response);
            }
        } catch (error) {
            console.log("patch api error =>", error);
            toast.error(error.response?.data?.message || "An error occurred.")
            if (error.response.status === 401) {
                if (token?.role === "user") getStatus();
                if (adminInfo?.role === "admin") getAdminStatus();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { res, isLoading, fetchData };


};

export default usePatchApiReq;