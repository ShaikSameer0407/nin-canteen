import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../../api/api";
import { motion } from "framer-motion";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    breakfastOrders: 0,
    lunchOrders: 0,
  });
  const [overview, setOverview] = useState([]); // breakfast/lunch/snacks revenue
  const [rows, setRows] = useState([]); // breakdown table
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [kpiRes, overviewRes, breakdownRes] = await Promise.all([
        api.get("/reports/kpis", { params: { from, to } }),
        api.get("/reports/overview", { params: { from, to } }),
        api.get("/reports/breakdown", { params: { from, to } }),
      ]);

      setKpis({
        totalOrders: kpiRes.data?.totalOrders || 0,
        totalRevenue: kpiRes.data?.totalRevenue || 0,
        breakfastOrders: kpiRes.data?.breakfastOrders || 0,
        lunchOrders: kpiRes.data?.lunchOrders || 0,
      });

      setOverview(overviewRes.data || []);
      setRows(breakdownRes.data || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
      alert("Failed to load reports. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p className="text-gray-500">Loading reports...</p>;

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Orders" value={kpis.totalOrders} />
        <KpiCard title="Total Revenue" value={`₹${kpis.totalRevenue}`} />
        <KpiCard title="Total Breakfast Orders" value={kpis.breakfastOrders} />
        <KpiCard title="Total Lunch Orders" value={kpis.lunchOrders} />
      </div>

      {/* DATE FILTER */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Select Date Range:</span>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <span className="text-sm">to</span>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="ml-auto flex gap-3">
          <button
            onClick={fetchReports}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Generate Report
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* SALES OVERVIEW */}
      <Section title="Sales Overview">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={overview}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* SALES BREAKDOWN TABLE */}
      <Section title="Sales Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Breakfast Orders</th>
                <th className="p-3 text-left">Lunch Orders</th>
                <th className="p-3 text-left">Snacks Orders</th>
                <th className="p-3 text-left">Total Revenue</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.breakfast || 0}</td>
                  <td className="p-3">{r.lunch || 0}</td>
                  <td className="p-3">{r.snacks || 0}</td>
                  <td className="p-3 font-semibold">₹{r.revenue || 0}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No sales data found for selected range.
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

/* ---------- UI Components ---------- */

function KpiCard({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-5"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4 text-lg">{title}</h2>
      {children}
    </div>
  );
}
