import axios from "axios";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo .png";
import { changeAdminStatus } from "../store/slices/userSlice";
import { Button } from "../components/ui/button";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userNameRef = useRef(null);
  const userPasswordRef = useRef(null);
  const { isAdminAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAdminAuthenticated, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    const userName = userNameRef.current.value;
    const userPassword = userPasswordRef.current.value;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_ADMIN_API_URL}/login-Admin`,
        {
          adminId: userName,
          password: userPassword,
        },
        { withCredentials: true },
      );

      localStorage.setItem("perm", JSON.stringify(response.data.perm));

      if (response?.data) {
        dispatch(changeAdminStatus({ isAdminAuthenticated: true }));
        localStorage.setItem("admin-status", true);

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
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleAdminLogin}
        className="w-full max-w-md rounded-xl bg-white p-10 shadow-lg"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img src={logo} alt="logo" className="h-auto w-[200px]" />
          </Link>
        </div>

        {/* Title */}
        <h3 className="my-6 text-center text-2xl font-semibold text-gray-800">
          Admin Login
        </h3>

        {/* Admin ID */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Admin ID
          </label>
          <input
            type="text"
            ref={userNameRef}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            ref={userPasswordRef}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        {/* Submit Button */}
        <Button variant="abhicares" type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
