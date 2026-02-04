import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { firebaseLogin, googleLogin } from "../services/authService";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("user");
  const [adminRole, setAdminRole] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const otpRefs = useRef([]);
  const navigate = useNavigate();

  /* ================= SHOW NOTIFICATION ================= */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* ================= STEP 1: LOGIN ================= */
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

      // Store Firebase token temporarily
      localStorage.setItem("tempToken", res.token);
      localStorage.setItem("role", mode);
      localStorage.setItem("adminRole", adminRole || "");
      localStorage.setItem("email", email);

      // 🔐 SEND OTP TO EMAIL (BACKEND)
      await api.post("/otp/send-otp", { email });

      showNotification("OTP sent to your email!", "success");
      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2: VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (otp.join("").length !== 6) {
      showNotification("Enter valid OTP", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/otp/verify-otp", {
        email,
        otp: otp.join(""),
      });

      // Promote token
      localStorage.setItem("token", localStorage.getItem("tempToken"));
      localStorage.removeItem("tempToken");

      showNotification("Login successful!", "success");
      setTimeout(() => {
        const role = localStorage.getItem("role");
        navigate(role === "admin" ? "/admin" : "/user");
      }, 1500);
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid OTP", "error");
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
      }, 1500);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  /* ================= OTP INPUT ================= */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const otpComplete = otp.every((d) => d !== "");

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
        className="w-full max-w-6xl bg-blue-100 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* IMAGE (RESPONSIVE FIXED) */}
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
                  mode === t
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {t.toUpperCase()} LOGIN
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {step === 1 && (
              <motion.div
                key="login"
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

                <button
                  onClick={login}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                  {loading ? "Processing..." : "Login"}
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
            )}

            {/* OTP */}
            {step === 2 && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <h3 className="font-semibold">
                  Enter OTP sent to your email
                </h3>

                <div className="flex justify-center gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      maxLength="1"
                      value={d}
                      onChange={(e) =>
                        handleOtpChange(e.target.value, i)
                      }
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-12 h-12 text-center border rounded-lg text-xl"
                    />
                  ))}
                </div>

                <button
                  disabled={!otpComplete || loading}
                  onClick={verifyOtp}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    otpComplete
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
