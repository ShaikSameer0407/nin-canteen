import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../../api/api";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444"];

export default function AdminReports() {
  const [loading, setLoading] = useState(true);

  const [kpis, setKpis] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [
        kpiRes,
        monthlyRes,
        dailyRes,
        paymentRes,
        categoryRes,
        itemsRes,
      ] = await Promise.all([
        api.get("/reports/kpis"),
        api.get("/reports/monthly-revenue"),
        api.get("/reports/daily-sales"),
        api.get("/reports/payment-modes"),
        api.get("/reports/category-sales"),
        api.get("/reports/top-items"),
      ]);

      setKpis(kpiRes.data);
      setMonthlyRevenue(monthlyRes.data);
      setDailySales(dailyRes.data);
      setPaymentModes(paymentRes.data);
      setCategorySales(categoryRes.data);
      setTopItems(itemsRes.data);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  return (
    <div className="space-y-10">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={`₹${kpis.totalRevenue}`} />
        <KpiCard title="Total Orders" value={kpis.totalOrders} />
        <KpiCard title="Net Profit" value={`₹${kpis.netProfit}`} />
        <KpiCard title="Top Item" value={kpis.topItem} />
      </div>

      {/* MONTHLY REVENUE */}
      <Section title="Monthly Revenue Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#f97316" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* DAILY SALES */}
      <Section title="Peak Order Hours">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailySales}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* PAYMENT MODES */}
      <Section title="Payment Mode Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentModes}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              label
            >
              {paymentModes.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Section>

      {/* CATEGORY SALES */}
      <Section title="Category-wise Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categorySales}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* TOP ITEMS */}
      <Section title="Top Selling Items">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topItems}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
}

/* COMPONENTS */

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
