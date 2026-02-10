import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api"; // ✅ ADD THIS

export default function Checkout() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToPay = () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // test key
      amount: total * 100, // paise
      currency: "INR",
      name: "NIN canteen",
      description: "Demo Payment",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",

      handler: async function (response) {
        try {
          // ✅ SAVE ORDER TO BACKEND
          const res = await api.post("/orders", {
            userName: "Student", // you can replace with logged in user name
            paymentId: response.razorpay_payment_id,
            items: cart.map((i) => ({
              _id: i._id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              category: i.category,
            })),
            totalAmount: total,
          });

          // ✅ Redirect to receipt with backend orderId
          navigate("/payment-receipt", {
            state: {
              cart,
              paymentId: response.razorpay_payment_id,
              orderId: res.data.id, // 🔥 important for QR scan at counter
            },
          });

          clearCart();
        } catch (err) {
          console.error("Order save failed:", err);
          alert("Payment success but order not saved. Check backend.");
        }
      },

      prefill: {
        name: "Student",
        email: "student@test.com",
        contact: "9999999999",
      },

      theme: { color: "#2563eb" },

      modal: {
        ondismiss: () => setPaying(false),
      },
    };

    const rzp = new window.Razorpay(options);
    setPaying(true);
    rzp.open();
  };

  if (!cart.length) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item._id}
              layout
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div className="flex gap-4">
                <img
                  src={`http://localhost:5000${item.image}`}
                  className="w-20 h-20 rounded object-cover"
                  alt={item.name}
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={item.quantity === 1}
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  className="px-3 py-1 border rounded"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 text-sm ml-3"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ₹{total}</h2>
        <button
          onClick={handleProceedToPay}
          disabled={paying}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60"
        >
          {paying ? "Opening Payment..." : "Proceed to Pay"}
        </button>
      </div>
    </motion.div>
  );
}
