import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../api/api";

/* ----------------- Small UI Pieces ----------------- */
function StatCard({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 font-semibold">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ----------------- MAIN ----------------- */
export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    breakfast: 0,
    lunch: 0,
    snacks: 0,
  });
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  /* -------- API -------- */
  const fetchMenu = async () => {
    const res = await api.get("/menu");
    setMenu(Array.isArray(res.data) ? res.data : []);
  };

  const fetchStats = async () => {
    const res = await api.get("/orders/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data || {});
  };

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
  };

  useEffect(() => {
    fetchMenu();
    fetchStats();
    fetchOrders();
  }, []);

  /* -------- Today's Menu Group -------- */
  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const todaysMenu = menu.filter((i) => i.day === today);

  const breakfastMenu = todaysMenu.filter((i) => i.mealSlot === "breakfast");
  const lunchMenu = todaysMenu.filter((i) => i.mealSlot === "lunch");
  const snacksMenu = todaysMenu.filter((i) => i.mealSlot === "snacks");

  /* -------- Sales Chart -------- */
  const chartData = [
    { name: "Breakfast", revenue: stats.breakfast || 0 },
    { name: "Lunch", revenue: stats.lunch || 0 },
    { name: "Snacks & Beverages", revenue: stats.snacks || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
        <Menu size={20} />
        <h1 className="font-semibold">Admin Dashboard</h1>
      </div>

      <main className="p-4 md:p-6 space-y-8">
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Orders Today" value={stats.totalOrders} icon="📋" />
          <StatCard title="Total Revenue Today" value={`₹${stats.totalRevenue || 0}`} icon="💰" />
          <StatCard title="Breakfast Orders" value={stats.breakfast || 0} icon="☀️" />
          <StatCard title="Lunch Orders" value={stats.lunch || 0} icon="🍔" />
          <StatCard title="Snacks Orders" value={stats.snacks || 0} icon="☕" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TODAY MENU */}
          <Section title="Today's Menu">
            <div className="space-y-3">
              <MenuGroup title="Breakfast" items={breakfastMenu} />
              <MenuGroup title="Lunch" items={lunchMenu} />
              <MenuGroup title="Snacks & Beverages" items={snacksMenu} />
            </div>
          </Section>

          {/* RECENT ORDERS */}
          <Section title="Recent Orders">
            <ul className="divide-y">
              {orders.map((o) => (
                <li key={o.id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">#{o.id}</p>
                    <p className="text-xs text-gray-500">{o.user?.name || "User"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">₹{o.totalAmount}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === "collected"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* SALES OVERVIEW */}
        <Section title="Sales Overview">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </main>
    </div>
  );
}

/* -------- Helpers -------- */
function MenuGroup({ title, items }) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">No items</p>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {items.map((i) => (
            <li key={i.id}>
              {i.name} – ₹{i.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
