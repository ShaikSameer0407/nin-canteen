import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useEffect, useMemo } from "react";

export default function PaymentReceipt() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const cart = state?.cart || [];
  const paymentId =
    state?.paymentId || "TXN" + Math.floor(Math.random() * 99999999);

  const orderId = useMemo(
    () => "GCM" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    []
  );

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const now = new Date();

  // 🔐 If user opens receipt page directly without payment
  useEffect(() => {
    if (!state) {
      navigate("/user", { replace: true });
    }
  }, [state, navigate]);

  if (!cart.length) return null;

  // ✅ QR value for counter scan (backend expects ORDER-<paymentId>)
  const qrValue = `ORDER-${paymentId}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
      >
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-2xl">✔</span>
        </div>

        <h2 className="text-xl font-bold">Order Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-4">
          Show this receipt at the counter
        </p>

        {/* RECEIPT */}
        <div className="border rounded-xl p-4 text-left text-sm">
          <div className="text-center mb-3">
            <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
              🏛️
            </div>
            <p className="font-semibold">NIN Canteen</p>
            <p className="text-xs text-gray-500">Official Receipt</p>
          </div>

          <div className="flex justify-between text-xs mb-2">
            <p><b>Order ID:</b> {orderId}</p>
            <p><b>Date:</b> {now.toLocaleDateString("en-IN")}</p>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <p><b>Payment ID:</b> {paymentId}</p>
            <p><b>Time:</b> {now.toLocaleTimeString("en-IN")}</p>
          </div>

          <hr className="my-2" />

          {/* ✅ FIXED: unique key added */}
          {cart.map((item, idx) => (
            <div key={item._id || idx} className="flex justify-between text-xs">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between font-bold">
            <span>TOTAL PAID</span>
            <span className="text-blue-600">₹{total}</span>
          </div>

          <p className="text-xs text-center mt-2 text-gray-500">
            Payment Method: Razorpay (Demo)
          </p>

          {/* Barcode */}
          <div className="mt-3 flex flex-col items-center">
            <div className="w-full h-8 bg-[repeating-linear-gradient(90deg,#000,#000 2px,transparent 2px,transparent 4px)]" />
            <p className="text-[10px] mt-1">{orderId}</p>
          </div>

          {/* ✅ QR Code for Counter Panel */}
          <div className="mt-3 flex justify-center">
            <QRCode value={qrValue} size={96} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Print
          </button>

          <button
            onClick={() => navigate("/user")}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
