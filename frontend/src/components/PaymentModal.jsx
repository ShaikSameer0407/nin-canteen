import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, ChefHat, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentModal({ total, cart, onClose, clearCart }) {
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [qrValue, setQrValue] = useState("");

  /* ================= GENERATE UPI QR (DEMO) ================= */
  useEffect(() => {
    const upi = `upi://pay?pa=yourupi@bank&pn=Canteen&am=${total}&cu=INR`;
    setQrValue(`${upi}&ts=${Date.now()}`);
  }, [total]);

  /* ================= CONFIRM PAYMENT (DEMO ONLY) ================= */
  const confirmPayment = (method) => {
    if (processing) return;

    setProcessing(true);

    // ⏳ Fake payment delay
    setTimeout(() => {
      console.log("Demo Payment Method:", method);
      console.log("Demo Cart:", cart);
      console.log("Demo Amount:", total);

      clearCart(); // clear cart

      // 👉 REDIRECT TO PAYMENT SUCCESS PAGE
      navigate("/payment-success");
    }, 4000); // Increased delay for animation
  };

  /* ================= ANIMATED PROCESSING UI (3D CHEF COOKING) ================= */
  if (processing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl text-center w-[90%] max-w-md relative overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {/* 3D Animated Chef Cooking */}
          <div className="relative z-10 mb-6">
            <motion.div
              className="flex justify-center items-center"
              animate={{ rotateY: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Chef Hat */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 text-orange-500"
              >
                <ChefHat size={50} />
              </motion.div>

              {/* Chef Body (Circle) */}
              <motion.div
                className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center relative"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {/* Utensils */}
                <motion.div
                  animate={{ rotate: [0, 45, -45, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-white"
                >
                  <Utensils size={30} />
                </motion.div>

                {/* Steam Effect */}
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-gray-300"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  💨
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Spinner */}
          <motion.div
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          <motion.h2
            className="text-xl font-bold mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Cooking Up Your Order
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Please wait while we prepare your delicious meal...
          </motion.p>

          {/* Bouncing Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ================= PAYMENT UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-[90%] max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Choose Payment Method
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <button
              disabled={processing}
              onClick={() => confirmPayment("Cash")}
              className="w-full flex gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Wallet className="text-green-500" />
              Cash
            </button>

            <button
              disabled={processing}
              onClick={() => confirmPayment("Card")}
              className="w-full flex gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <CreditCard className="text-blue-500" />
              Card
            </button>

            <button
              disabled={processing}
              onClick={() => confirmPayment("UPI")}
              className="w-full flex gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                alt="UPI"
                className="w-6"
              />
              UPI
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <QRCodeCanvas value={qrValue} size={150} />
            <p className="mt-2 font-semibold">₹{total}</p>
            <p className="text-xs text-gray-500">(Demo QR)</p>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={processing}
          className="mt-6 w-full text-gray-500 text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}