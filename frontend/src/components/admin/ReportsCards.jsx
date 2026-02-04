export default function ReportsCards({ reports }) {
  const cards = [
    {
      title: "Total Orders",
      value: reports.totalOrders,
      color: "bg-blue-500",
    },
    {
      title: "Total Revenue",
      value: `₹${reports.totalRevenue}`,
      color: "bg-green-500",
    },
    {
      title: "Total Products",
      value: reports.totalProducts,
      color: "bg-orange-500",
    },
    {
      title: "Total Users",
      value: reports.totalUsers,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
        >
          <div>
            <p className="text-sm text-gray-500">{c.title}</p>
            <h3 className="text-2xl font-bold mt-2">{c.value}</h3>
          </div>
          <div
            className={`w-12 h-12 rounded-full ${c.color} opacity-20`}
          />
        </div>
      ))}
    </div>
  );
}
