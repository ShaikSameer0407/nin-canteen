import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Menu", path: "/admin/menu", icon: <Utensils size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={18} /> },
  ];

  /* LOGOUT HANDLER */
  const handleLogout = () => {
    localStorage.clear();       // remove token & role
    setOpen(false);             // close sidebar (mobile)
    navigate("/", { replace: true }); // go to login
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex items-center justify-between bg-orange-500 text-white px-4 py-3">
        <h2 className="font-bold text-lg">Admin Panel</h2>
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:static top-0 left-0 z-50
        h-full md:h-screen w-64 bg-orange-500 text-white
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col`}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between p-5 border-b border-orange-400">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* ================= NAV ================= */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded transition
                ${
                  isActive
                    ? "bg-orange-600 font-semibold"
                    : "hover:bg-orange-600"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="p-4 border-t border-orange-400">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded
              bg-red-500 hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
