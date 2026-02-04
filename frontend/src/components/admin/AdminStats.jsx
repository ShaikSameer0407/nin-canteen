export default function AdminStats({ stats }) {
  const cards = [
    { label: "Total Items", value: stats.totalItems },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Amount (₹)", value: stats.totalAmount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-lg shadow text-center"
        >
          <h3 className="text-gray-500">{c.label}</h3>
          <p className="text-2xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
