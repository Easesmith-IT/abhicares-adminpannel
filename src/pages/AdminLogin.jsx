"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { changeAdminStatus } from "../store/slices/userSlice";
import logo from "../assets/logo .png";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Spinner } from "../components/ui/spinner";
import useAuthActions from "../hooks/useAuthActions";
import useCrashReporter from "../hooks/useCrashReporter";
import { getSecureItem, setSecureItem } from "../utils/secureStorage";
import { readCookie } from "../utils/readCookie";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reportCrash } = useCrashReporter();
  const { getAdminStatus } = useAuthActions();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const { isAdminAuthenticated } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async () => {
      const hasClientAuthHint = Boolean(
        isAdminAuthenticated ||
        getSecureItem("admin-status", true) ||
        getSecureItem("perm", true) ||
        readCookie("adminInfo")
      );

      if (!hasClientAuthHint) {
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      const isAuthenticated = await getAdminStatus();
      if (!isMounted) {
        return;
      }

      if (isAuthenticated) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      setIsCheckingSession(false);
    };

    void verifyExistingSession();

    return () => {
      isMounted = false;
    };
  }, [getAdminStatus, isAdminAuthenticated, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_ADMIN_API_URL}/login-Admin`,
        { adminId, password },
        { withCredentials: true },
      );

      setSecureItem("perm", response.data.perm, true);
      setSecureItem("admin-status", true, true);

      dispatch(changeAdminStatus({ isAdminAuthenticated: true }));

      const routes = [
        "dashboard",
        "banners",
        "orders",
        "bookings",
        "services",
        "partners",
        "customers",
        "offers",
        "availableCities",
        "payments",
        "enquiry",
        "helpCenter",
        "settings",
      ];

      const firstAllowed = routes.find(
        (item) => response.data.perm[item] !== "none",
      );

      toast.success("Logged in successfully");
      navigate(`/admin/${firstAllowed}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      reportCrash({
        error: err,
        screenName: "Login",
        severity: "HIGH",
        request: {
          url: "/admin/login-Admin",
        },
        userId: null,
        userType: "Admin",
      });

    } finally {
      setLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-main to-para-3 p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-main to-para-3 p-4">
      <Card className="w-full max-w-lg rounded-xl shadow-2xl bg-white">
        <CardHeader className="text-center space-y-2">
          <img
            src={logo}
            alt="AbhiCares"
            className="mx-auto h-14 object-contain"
          />

          <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>

          <CardDescription>Access your dashboard securely</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Admin ID */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Admin ID
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  type="text"
                  placeholder="Enter admin ID"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="abhicares"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
