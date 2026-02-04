import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet /> {/* 🔥 REQUIRED */}
      </main>
    </div>
  );
}
