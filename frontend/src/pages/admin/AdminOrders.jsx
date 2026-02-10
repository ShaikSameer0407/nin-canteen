import { useEffect, useState } from "react";
import { api } from "../../api/api";
import OrdersTable from "../../pages/admin/OrdersTable";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔥 Live backend data (pure SQL / Sequelize)
      const res = await api.get("/orders");

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
      setError("Failed to load orders from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔄 Auto refresh every 10 seconds (optional)
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 animate-pulse">Loading orders...</p>
      )}

      {!loading && error && (
        <div className="bg-red-50 text-red-600 rounded-xl shadow p-6 text-center">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          🚫 No orders found
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <OrdersTable orders={orders} onRefresh={fetchOrders} />
      )}
    </div>
  );
}
