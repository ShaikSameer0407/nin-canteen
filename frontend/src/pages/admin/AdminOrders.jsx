import { useEffect, useState } from "react";
import { api } from "../../api/api";
import OrdersTable from "../../components/admin/OrdersTable";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
