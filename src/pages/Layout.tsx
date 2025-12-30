import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/Topbar";
import SideBar from "../components/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar fixe */}
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar fixe */}
        <TopBar onMenuClick={toggleSidebar} />

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto p-6 sm:p-8 lg:p-12">
          {/* Centrer le contenu et limiter la largeur */}
          <div className="max-w-15xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
