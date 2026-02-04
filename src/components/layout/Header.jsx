import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo .png";
import LogoutModal from "../modals/LogoutModal";
import useGetApiReq from "../../hooks/useGetApiReq";
import { changeAdminStatus } from "../../store/slices/userSlice";
import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";

const Header = ({ onClick }) => {
  const { res, fetchData } = useGetApiReq();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    fetchData("/admin/logout-Admin");
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      dispatch(changeAdminStatus({ isAdminAuthenticated: false }));
      localStorage.removeItem("perm");
      localStorage.setItem("admin-status", false);
      navigate("/");
      setIsLogoutModalOpen(false);
    }
  }, [res]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-[70px] w-full items-center justify-between px-[30px] shadow-md bg-white">
        {/* Left section */}
        <div className="flex items-center gap-[60px]">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="cursor-pointer"
          >
            <img
              src={logo}
              alt="logo"
              className="h-[50px] w-[160px] object-contain"
            />
          </div>

          {/* Menu icon */}
          {/* <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
            alt="menu"
            className="h-[30px] cursor-pointer"
            onClick={onClick}
          /> */}
        </div>

        {/* Right section */}
        <Button
          variant="ghost"
          onClick={() => setIsLogoutModalOpen(true)}
          size="icon-lg"
        >
          <LogOutIcon className="size-6" />
        </Button>
      </header>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
