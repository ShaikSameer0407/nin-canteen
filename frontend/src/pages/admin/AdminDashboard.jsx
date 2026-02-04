import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { api } from "../../api/api";

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* FETCH MENU */
  const fetchMenu = async () => {
    const res = await api.get("/menu");
    setMenu(res.data);
  };

  /* FETCH STATS */
  const fetchStats = async () => {
    const res = await api.get("/orders/stats");
    setStats(res.data);
  };

  /* TOGGLE ITEM STATUS */
  const toggleStatus = async (id, value) => {
    await api.put(`/menu/${id}`, { isAvailable: value });
    fetchMenu();
  };

  /* DELETE ITEM */
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/menu/${id}`);
    fetchMenu();
  };

  useEffect(() => {
    fetchMenu();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      

      {/* MAIN */}
      <main className="flex-1 w-full">
        {/* MOBILE HEADER */}
        <div className="md:hidden bg-white shadow p-4 flex items-center gap-4">
          <Menu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
          <h1 className="font-bold text-lg">Admin Dashboard</h1>
        </div>

        <div className="p-4 md:p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Products" value={menu.length} />
            <StatCard title="Orders" value={stats.totalOrders} />
            <StatCard
              title="Revenue"
              value={`₹${stats.totalRevenue}`}
            />
            <StatCard title="Sales" value={stats.totalSales} />
          </div>

          {/* MENU TABLE */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto">
            <h2 className="font-bold text-lg mb-4">
              Menu Management
            </h2>

            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">Item</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {menu.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-3 font-medium">
                      {item.name}
                    </td>
                    <td>₹{item.price}</td>

                    {/* STATUS */}
                    <td>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={(e) =>
                            toggleStatus(
                              item._id,
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white absolute top-0.5 left-0.5 rounded-full peer-checked:translate-x-5 transition"></div>
                        </div>
                      </label>
                    </td>

                    {/* ACTION */}
                    <td className="text-center">
                      <button
                        onClick={() =>
                          deleteItem(item._id)
                        }
                        className="text-red-600 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {menu.length === 0 && (
              <p className="text-center text-gray-500 mt-6">
                No menu items added yet
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* NAV ITEM */
function NavItem({ children, active }) {
  return (
    <div
      className={`px-4 py-2 rounded cursor-pointer transition
        ${
          active
            ? "bg-orange-600"
            : "hover:bg-orange-600"
        }`}
    >
      {children}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}
