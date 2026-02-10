import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ADMIN */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";

/* USER */
import UserDashboard from "./pages/UserDashboard";
import Checkout from "./pages/Checkout";

/* COUNTER */
import CounterPanel from "./pages/counter/CounterPanel";

/* PAYMENT */
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentReceipt from "./pages/PaymentReceipt";

/* ================= AUTH HELPER ================= */
const getAuth = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
});

/* ================= PROTECTED ROUTE ================= */
function Protected({ roleRequired, children }) {
  const { token, role } = getAuth();

  if (!token) return <Navigate to="/" replace />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<LoginRedirect />} />
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/register" element={<RegisterRedirect />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <Protected roleRequired="admin">
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* USER */}
      <Route
        path="/user"
        element={
          <Protected roleRequired="user">
            <UserDashboard />
          </Protected>
        }
      />

      {/* CHECKOUT */}
      <Route
        path="/checkout"
        element={
          <Protected roleRequired="user">
            <Checkout />
          </Protected>
        }
      />

      {/* PAYMENT FLOW */}
      <Route
        path="/payment-success"
        element={
          <Protected roleRequired="user">
            <PaymentSuccess />
          </Protected>
        }
      />

      <Route
        path="/payment-receipt"
        element={
          <Protected roleRequired="user">
            <PaymentReceipt />
          </Protected>
        }
      />

      {/* COUNTER PANEL */}
      <Route
        path="/counter"
        element={
          <Protected roleRequired="counter">
            <CounterPanel />
          </Protected>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ================= HELPERS ================= */

function LoginRedirect() {
  const { token, role } = getAuth();

  if (!token) return <Login />;

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "counter") return <Navigate to="/counter" replace />;
  return <Navigate to="/user" replace />;
}

function RegisterRedirect() {
  const { token, role } = getAuth();

  if (!token) return <Register />;

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "counter") return <Navigate to="/counter" replace />;
  return <Navigate to="/user" replace />;
}
