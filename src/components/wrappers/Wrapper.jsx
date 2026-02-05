import Header from "../layout/Header";
import SideNav from "../layout/SideNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Wrapper = ({ children }) => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SideNav />

      {/* Main content area */}
      <SidebarInset className="min-h-screen bg-gradient-to-br from-main/30 via-white/20 to-main/50">
        <Header />

        <main className="px-[30px] pt-[40px] pb-[30px]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Wrapper;
