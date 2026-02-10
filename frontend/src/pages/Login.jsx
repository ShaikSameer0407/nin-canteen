import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { firebaseLogin, googleLogin, resetPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("user");
  const [adminRole, setAdminRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  /* ================= SHOW NOTIFICATION ================= */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* ================= LOGIN ================= */
  const login = async () => {
    if (!email || !password) {
      showNotification("Email and password required", "error");
      return;
    }

    if (mode === "admin" && !adminRole) {
      showNotification("Select admin role", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await firebaseLogin(email, password);

      // ✅ Direct login (no OTP)
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", mode);
      localStorage.setItem("adminRole", adminRole || "");
      localStorage.setItem("email", email);

      showNotification("Login successful!", "success");

      setTimeout(() => {
        navigate(mode === "admin" ? "/admin" : "/user");
      }, 1200);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async () => {
    if (!email) {
      showNotification("Enter your email first", "error");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      showNotification("Password reset link sent to your email 📩", "success");
    } catch (err) {
      showNotification(err.message || "Failed to send reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("authProvider", "google");

      showNotification("Google login successful!", "success");
      setTimeout(() => {
        navigate("/user");
      }, 1200);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* ================= ANIMATED NOTIFICATION ================= */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-4 right-4 z-50"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`px-6 py-4 rounded-lg shadow-2xl text-white font-semibold ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {notification.message}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl bg-blue-100 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* IMAGE */}
        <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
          <img
            src="https://nin.res.in/images/nintoday.jpg"
            alt="Institute"
            className="w-full h-full object-cover rounded-t-3xl md:rounded-none"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 bg-blue-50 flex flex-col justify-center px-10 py-12">
          {/* MODE TOGGLE */}
          <div className="flex gap-6 justify-center mb-8">
            {["user", "admin"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setMode(t);
                  setAdminRole("");
                }}
                className={`px-6 py-2 rounded-full font-semibold ${
                  mode === t ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
              >
                {t.toUpperCase()} LOGIN
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg"
            />

            {mode === "admin" && (
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
                className="w-full px-5 py-3 border rounded-lg"
              >
                <option value="">Select Admin Role</option>
                <option value="convener">Convener</option>
                <option value="co-convener">Co-Convener</option>
                <option value="co-secretary">Co-Secretary</option>
              </select>
            )}

            <div className="text-right text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-600 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Register here
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
