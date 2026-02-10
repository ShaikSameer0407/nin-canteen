import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../api/api";

const StatusBadge = ({ status }) => {
  const map = {
    completed: "bg-green-100 text-green-700",
    collected: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        map[String(status || "").toLowerCase()] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "unknown"}
    </span>
  );
};

function Kpi({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-4 flex items-center gap-3"
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

export default function OrdersTable({ orders = [], onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [filters, setFilters] = useState({ id: "", paymentId: "", date: "" });

  const updateStatus = async (rawId) => {
    const id = rawId || "";
    try {
      setUpdatingId(id);
      await api.put(`/orders/${id}/status`, { status: "collected" });
      onRefresh?.();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // -------- KPIs --------
  const kpis = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter(
      (o) => String(o.status).toLowerCase() === "pending"
    ).length;

    const todayStr = new Date().toDateString();
    const todays = orders.filter(
      (o) => o.createdAt && new Date(o.createdAt).toDateString() === todayStr
    );

    const todayOrders = todays.length;
    const todayRevenue = todays.reduce(
      (s, o) => s + Number(o.totalAmount || 0),
      0
    );

    return { totalOrders, pending, todayOrders, todayRevenue };
  }, [orders]);

  // -------- Filtered Rows --------
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const oid = String(o.id || o._id || "");
      const byId = filters.id ? oid.includes(filters.id) : true;

      const pay = String(o.paymentId || "");
      const byPay = filters.paymentId ? pay.includes(filters.paymentId) : true;

      const byDate = filters.date
        ? o.createdAt &&
          new Date(o.createdAt).toISOString().slice(0, 10) === filters.date
        : true;

      return byId && byPay && byDate;
    });
  }, [orders, filters]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi title="Total Orders" value={kpis.totalOrders} icon="📋" />
        <Kpi title="Pending Orders" value={kpis.pending} icon="⏳" />
        <Kpi title="Today's Orders" value={kpis.todayOrders} icon="📅" />
        <Kpi title="Today's Revenue" value={`₹${kpis.todayRevenue}`} icon="💰" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          placeholder="Order ID"
          className="border p-2 rounded"
          value={filters.id}
          onChange={(e) => setFilters((f) => ({ ...f, id: e.target.value }))}
        />
        <input
          placeholder="Payment ID"
          className="border p-2 rounded"
          value={filters.paymentId}
          onChange={(e) =>
            setFilters((f) => ({ ...f, paymentId: e.target.value }))
          }
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
        />
        <button
          onClick={() => setFilters({ id: "", paymentId: "", date: "" })}
          className="bg-gray-100 rounded px-4"
        >
          Reset
        </button>
        <button className="bg-blue-600 text-white rounded px-4">Search</button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const id = o.id || o._id;
              const status = String(o.status || "").toLowerCase();

              return (
                <tr key={id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">#{id}</td>
                  <td className="p-3">{o.user?.name || "User"}</td>
                  <td className="p-3 capitalize">
                    {o.items?.[0]?.category || "-"}
                  </td>
                  <td className="p-3 font-semibold">₹{o.totalAmount || 0}</td>
                  <td className="p-3">{o.paymentId || "--"}</td>
                  <td className="p-3 text-xs text-gray-500">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="p-3 text-right">
                    {status !== "collected" && status !== "completed" ? (
                      <button
                        disabled={updatingId === id}
                        onClick={() => updateStatus(id)}
                        className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                      >
                        {updatingId === id ? "Updating..." : "Mark Collected"}
                      </button>
                    ) : (
                      <span className="text-green-600 text-xs">✔ Done</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders available today.
          </div>
        )}
      </div>
    </div>
  );
}
