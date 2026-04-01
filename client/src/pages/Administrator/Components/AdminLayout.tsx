import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const SIDEBAR_KEY = "adminSidebarCollapsed";

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(SIDEBAR_KEY) ?? "false");
    } catch {
      return false;
    }
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  const sidebarWidth = collapsed ? 72 : 272;

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      {/* Fixed Sidebar */}
      <div className="print:hidden">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main content shifts with sidebar */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex min-h-screen flex-col print:!ml-0"
      >
        {/* Sticky Header */}
        <div className="print:hidden">
          <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 print:p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;