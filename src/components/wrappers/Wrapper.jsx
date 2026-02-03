import { useState } from "react";
import Header from "../layout/Header";
import SideNav from "../layout/SideNav";

const Wrapper = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="font-poppins bg-[#F6F7F8]">
      {/* Header */}
      <Header onClick={toggleMenuHandler} />

      {/* Main Container */}
      <div className="relative flex w-full">
        {/* Sidebar */}
        <div
          className={`
            sticky top-[70px] h-[calc(100vh-70px)]
            overflow-y-auto overflow-x-hidden scrollbar-hide
            transition-all duration-500 ease-in-out
            bg-white shadow-md
            ${showMenu ? "w-[80px]" : "w-[290px]"}
            hidden md:block
          `}
        >
          <SideNav />
        </div>

        {/* Main Content */}
        <main
          className="
            w-full overflow-y-scroll overflow-x-hidden
            px-[30px] pt-[40px] pb-[30px] bg-[#F6F7F8]"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Wrapper;
