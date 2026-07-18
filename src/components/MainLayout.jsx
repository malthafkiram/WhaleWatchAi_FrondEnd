import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-bg text-white relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="pl-0 md:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="w-full">
          <Outlet />{" "}
        </div>
      </main>
    </div>
  );
}
