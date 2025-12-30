import { Outlet } from "react-router-dom";
import TopBar from "../components/Topbar";
import SideBar from "../components/Sidebar";
import { useState } from "react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onOpen={openSidebar}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        {/* Topbar */}
        <TopBar />

        {/* Zone de contenu */}
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
