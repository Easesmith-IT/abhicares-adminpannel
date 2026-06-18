import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../layout/Header";
import SideNav from "../layout/SideNav";
import { useCustomSidebar } from "@/components/layout/sidebarContext";

const WrapperContent = ({ children }) => {
  const { isCollapsed } = useCustomSidebar();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Redesigned Sidebar Nav */}
      <SideNav />

      {/* Main content area */}
      <div
        className={`flex flex-col flex-1 min-h-screen w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? "pl-[104px]" : "pl-[332px]"
        }`}
      >
        <Header />

        {/* Page content with slide-up and fade transition keyed by pathname to trigger on route change */}
        <main className="px-[30px] pt-[20px] pb-[30px] flex-1">
          <div key={location.pathname} className="animate-page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const Wrapper = ({ children }) => {
  return <WrapperContent>{children}</WrapperContent>;
};

export default Wrapper;
