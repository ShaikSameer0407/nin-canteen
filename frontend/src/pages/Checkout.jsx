import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";

export default function Checkout() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const [openPayment, setOpenPayment] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= PROCEED (DEMO) ================= */
  const handleProceedToPay = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // ✅ DIRECTLY OPEN PAYMENT (NO AUTH, NO SESSION)
    setOpenPayment(true);
  };

  /* ================= EMPTY CART ================= */
  if (cart.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <>
      {/* ================= MAIN ================= */}
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
                    onClick={() =>
                      updateQty(item._id, item.quantity - 1)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item._id, item.quantity + 1)
                    }
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

        {/* ================= TOTAL ================= */}
        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-xl font-bold">Total: ₹{total}</h2>
          <button
            onClick={handleProceedToPay}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
          >
            Proceed to Pay
          </button>
        </div>
      </motion.div>

      {/* ================= PAYMENT MODAL ================= */}
      <AnimatePresence>
        {openPayment && (
          <PaymentModal
            total={total}
            cart={cart}
            clearCart={clearCart}
            onClose={() => setOpenPayment(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
