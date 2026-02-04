import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { firebaseRegister, googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [mode, setMode] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminRole: "",
  });
  const [notification, setNotification] = useState(null); // For animated notifications
  const navigate = useNavigate();

  /* ================= SHOW NOTIFICATION ================= */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3s
  };

  /* ================= EMAIL REGISTER ================= */
  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      showNotification("All fields required", "error");
      return;
    }

    if (mode === "admin" && !form.adminRole) {
      showNotification("Select admin role", "error");
      return;
    }

    try {
      const res = await firebaseRegister(
        form.name,
        form.email,
        form.password
      );

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", mode);
      localStorage.setItem("adminRole", form.adminRole || "");
      localStorage.setItem("authProvider", "email");

      showNotification("Registered successfully!", "success");
      setTimeout(() => {
        navigate(mode === "admin" ? "/admin" : "/user");
      }, 1500);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  /* ================= GOOGLE REGISTER ================= */
  const handleGoogleRegister = async () => {
    try {
      const res = await googleLogin();

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "user"); // Google users default to user
      localStorage.setItem("authProvider", "google");

      showNotification("Google registration successful!", "success");
      setTimeout(() => {
        navigate("/user");
      }, 1500);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* ================= ANIMATED 3D NOTIFICATION ================= */}
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
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {notification.message}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-blue-100 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* IMAGE SECTION (RESPONSIVE FIXED) */}
        <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
          <img
            src="https://nin.res.in/images/nintoday.jpg"
            alt="Institute"
            className="w-full h-full object-cover rounded-t-3xl md:rounded-none"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full md:w-1/2 bg-blue-50 flex flex-col justify-center px-6 md:px-12 py-10">
          {/* MODE TOGGLE */}
          <div className="flex gap-6 mb-8 justify-center">
            {["user", "admin"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setMode(t);
                  setForm({ ...form, adminRole: "" });
                }}
                className={`px-6 py-2 rounded-full font-semibold ${
                  mode === t
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {t.toUpperCase()} REGISTER
              </button>
            ))}
          </div>

          {/* FORM */}
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full px-5 py-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-5 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-5 py-3 border rounded-lg"
            />

            {/* ADMIN ROLE */}
            {mode === "admin" && (
              <motion.select
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                value={form.adminRole}
                onChange={(e) =>
                  setForm({
                    ...form,
                    adminRole: e.target.value,
                  })
                }
                className="w-full px-5 py-3 border rounded-lg"
              >
                <option value="">Select Admin Role</option>
                <option value="convener">Convener</option>
                <option value="co-convener">Co-Convener</option>
                <option value="co-secretary">Co-Secretary</option>
              </motion.select>
            )}

            {/* REGISTER BUTTON */}
            <button
              onClick={register}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Register
            </button>

            {/* OR */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* GOOGLE REGISTER */}
            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="font-medium">
                Continue with Google
              </span>
            </button>

            {/* LOGIN LINK */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
