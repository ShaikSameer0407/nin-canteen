import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  BarChart3,
  Boxes,
  Settings,
  Menu,
  X,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Menu", path: "/admin/menu", icon: <Utensils size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={20} /> },
    { name: "Inventory", path: "/admin/inventory", icon: <Boxes size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 z-30 md:hidden flex items-center justify-between bg-white px-4 py-3 border-b">
          <h2 className="font-bold text-lg text-gray-800">Canteen Admin</h2>
          <button onClick={() => setOpen(true)} className="p-2 rounded hover:bg-gray-100">
            <Menu size={22} />
          </button>
        </div>
      )}

      {/* OVERLAY */}
      <AnimatePresence>
        {!isDesktop && open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence>
        {(isDesktop || open) && (
          <motion.aside
            className="relative z-50 h-full md:h-screen bg-white border-r shadow-sm flex flex-col"
            initial={{ x: isDesktop ? 0 : -300 }}
            animate={{
              x: 0,
              width: collapsed && isDesktop ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b">
              {(!collapsed || !isDesktop) && (
                <h2 className="text-lg font-bold text-gray-800">Canteen</h2>
              )}
              <div className="flex items-center gap-2">
                {isDesktop && (
                  <button
                    className="hidden md:inline-flex p-2 rounded hover:bg-gray-100"
                    onClick={() => setCollapsed((c) => !c)}
                  >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>
                )}
                {!isDesktop && (
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* NAV */}
            <nav className="p-3 space-y-1 flex-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {(!collapsed || !isDesktop) && <span>{item.name}</span>}

                  {collapsed && isDesktop && (
                    <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-md
                      bg-gray-900 text-white text-xs opacity-0 translate-x-1
                      group-hover:opacity-100 group-hover:translate-x-0 transition">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* HELP */}
            {(!isDesktop || !collapsed) && (
              <div className="p-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4">
                  <HelpCircle size={28} className="mb-2" />
                  <h4 className="font-semibold">Help Centre</h4>
                  <p className="text-xs text-white/80 mt-1">
                    Having trouble? Contact us for more info.
                  </p>
                  <button className="mt-3 text-xs bg-white text-blue-600 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-50 transition">
                    Go to help centre
                  </button>
                </div>
              </div>
            )}

            {/* LOGOUT */}
            <div className="p-3 border-t">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-semibold
                ${collapsed && isDesktop ? "justify-center" : ""}`}
              >
                <LogOut size={18} />
                {(!collapsed || !isDesktop) && <span>Logout</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
