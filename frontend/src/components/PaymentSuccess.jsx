import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // simulate payment verification
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    // auto redirect after success
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm"
          >
            {/* Spinner */}
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />

            <h2 className="mt-6 text-xl font-semibold">
              Processing Payment
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              Please wait while we confirm your payment…
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm"
          >
            {/* Success Check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
            >
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <h2 className="mt-6 text-xl font-bold text-green-600">
              Payment Successful!
            </h2>

            <p className="mt-2 text-gray-500 text-sm">
              Thank you for your purchase.  
              Redirecting to home…
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            >
              Go to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
