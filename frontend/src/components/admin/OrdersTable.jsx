import { motion, AnimatePresence } from "framer-motion";

export default function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3">Items</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {orders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b hover:bg-gray-50"
              >
                {/* ORDER ID */}
                <td className="p-3 text-xs text-gray-700">
                  {order._id}
                </td>

                {/* USER */}
                <td className="p-3">
                  <div className="font-medium">
                    {order.user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || ""}
                  </div>
                </td>

                {/* ITEMS */}
                <td className="p-3">
                  <ul className="list-disc list-inside text-xs">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* TOTAL */}
                <td className="p-3 font-semibold">
                  ₹{order.totalAmount}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-3 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No orders available
        </div>
      )}
    </div>
  );
}
