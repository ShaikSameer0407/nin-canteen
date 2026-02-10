import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { api } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";

export default function CounterPanel() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    servedToday: 0,
    revenueToday: 0,
  });
  const [order, setOrder] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [serveQty, setServeQty] = useState({});
  const [toast, setToast] = useState(null);
  const [servingLoading, setServingLoading] = useState({});

  const scannerRef = useRef(null);
  const beepRef = useRef(null);

  const fetchPending = async () => {
    const res = await api.get("/orders/counter/pending");
    setPendingOrders(res.data || []);
    setStats((s) => ({ ...s, pending: res.data?.length || 0 }));
  };

  const fetchDelivered = async () => {
    const res = await api.get("/orders");
    setDeliveredOrders((res.data || []).filter((o) => o.status === "completed"));
  };

  const fetchStats = async () => {
    const res = await api.get("/orders/counter/stats");
    setStats(res.data || stats);
  };

  useEffect(() => {
    fetchPending();
    fetchDelivered();
    fetchStats();
    beepRef.current = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
    );
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const imgSrc = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start({ facingMode: "environment" }, { fps: 10, qrbox: 220 }, async (text) => {
        try {
          const paymentId = text.replace("ORDER-", "").trim();
          const res = await api.get(`/orders/counter/scan/${paymentId}`);
          setOrder(res.data);
          setServeQty({});
          setShowPopup(true);
          beepRef.current?.play();
        } catch (err) {
          if (err.response?.status === 409) {
            setOrder(err.response.data.order);
            setShowPopup(true);
            showToast("Order already delivered", "info");
          } else {
            showToast("Scan failed / Order not found", "error");
          }
        } finally {
          setScanning(false);
          try {
            await scanner.stop();
            await scanner.clear();
          } catch {}
          fetchPending();
          fetchDelivered();
          fetchStats();
        }
      })
      .catch(() => showToast("Camera permission denied", "error"));
  }, [scanning]);

  const serveItemQty = async (idx) => {
    const qty = Number(serveQty[idx] || 0);
    if (!qty) return;

    setServingLoading((p) => ({ ...p, [idx]: true }));

    try {
      await api.put(`/orders/counter/${order.id}/item/${idx}/serve`, { qty });
      const res = await api.get(`/orders/counter/scan/${order.paymentId}`);
      setOrder(res.data);
      setServeQty({});
      showToast("Item served successfully", "success");

      if (res.data.status === "completed") {
        setShowPopup(false);
        showToast("Order fully completed!", "success");
      }

      fetchPending();
      fetchDelivered();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || "Serve failed", "error");
    } finally {
      setServingLoading((p) => ({ ...p, [idx]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white shadow-xl flex gap-2 ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : toast.type === "error" ? (
              <AlertTriangle size={18} />
            ) : (
              <Loader size={18} className="animate-spin" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl font-bold mb-6">Counter Panel</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Pending Orders" value={stats.pending} color="orange" />
        <Card title="Served Today" value={stats.servedToday} color="green" />
        <Card title="Revenue Today" value={`₹${stats.revenueToday}`} color="blue" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">🕒 Pending Orders</h3>
          {pendingOrders.length === 0 && (
            <p className="text-sm text-gray-400">No pending orders</p>
          )}
          {pendingOrders.map((o, i) => (
            <div key={o.id} className="border-b py-2 text-sm">
              {i + 1}. #{o.id} — ₹{o.totalAmount}
            </div>
          ))}
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">✅ Delivered Orders</h3>
          {deliveredOrders.length === 0 && (
            <p className="text-sm text-gray-400">No delivered orders today</p>
          )}
          {deliveredOrders.map((o, i) => (
            <div key={o.id} className="border-b py-2 text-sm">
              {i + 1}. #{o.id} —{" "}
              {(o.items || []).map((it) => it.name).join(", ")}
            </div>
          ))}
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-3">📷 Scan QR</h3>

          {!scanning && (
            <button
              onClick={() => setScanning(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start Scan
            </button>
          )}

          {scanning && (
            <div className="w-full flex justify-center">
              <div id="qr-reader" className="w-64" />
            </div>
          )}
        </div>
      </div>

      {/* POPUP */}
      {showPopup && order && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md">
            <h2 className="font-bold mb-3">Order #{order.id}</h2>

            {order.items.map((item, idx) => {
              const remaining = item.quantity - (item.servedQty || 0);
              return (
                <div
                  key={idx}
                  className="border rounded p-2 mb-2 flex gap-2 items-center"
                >
                  <img
                    src={imgSrc(item.image)}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.servedQty || 0}/{item.quantity} served
                    </p>
                  </div>

                  {remaining > 0 ? (
                    <>
                      <input
                        type="number"
                        min="1"
                        max={remaining}
                        value={serveQty[idx] || ""}
                        onChange={(e) =>
                          setServeQty((s) => ({
                            ...s,
                            [idx]: e.target.value,
                          }))
                        }
                        className="w-14 border rounded px-1"
                      />
                      <button
                        onClick={() => serveItemQty(idx)}
                        disabled={servingLoading[idx]}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        {servingLoading[idx] ? "..." : "Serve"}
                      </button>
                    </>
                  ) : (
                    <span className="text-green-600 text-xs">✔ Done</span>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 text-gray-500 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value, color }) {
  const map = {
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full ${map[color]}`} />
    </div>
  );
}
