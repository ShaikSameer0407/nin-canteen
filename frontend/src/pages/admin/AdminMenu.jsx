import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const mealSlots = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Snacks", value: "snacks" },
];

const badgeColors = (category = "") => {
  const c = category.toLowerCase();
  if (c.includes("tea")) return "bg-green-100 text-green-700";
  if (c.includes("coffee")) return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-700";
};

const getToday = () => {
  const today = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  if (today === 0 || today === 6) return "Monday";
  return days[today - 1];
};

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getToday());
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const todayDay = getToday();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    day: getToday(),
    mealSlot: "breakfast",
    image: null,
  });

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Fetch menu failed:", e);
      alert("Failed to load menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addOrUpdate = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Name, price, category are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price));
    formData.append("category", form.category);
    formData.append("description", form.description || "");
    formData.append("day", form.day);
    formData.append("mealSlot", form.mealSlot);
    if (form.image) formData.append("image", form.image);

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/menu", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      setEditingId(null);
      setForm({ name: "", price: "", category: "", description: "", day: selectedDay, mealSlot: "breakfast", image: null });
      await fetchMenu();
    } catch (err) {
      console.error("Save menu failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save menu");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setSelectedDay(item.day); // Jump to the item's day
    setForm({
      name: item.name || "",
      price: item.price || "",
      category: item.category || "",
      description: item.description || "",
      day: item.day || selectedDay,
      mealSlot: item.mealSlot || "breakfast",
      image: null,
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`/menu/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchMenu();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item");
    }
  };

  const dayFilteredMenu = menu.filter((i) => i.day === selectedDay);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">NIN Canteen Menu Management</h1>

      {/* DAY FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => {
              setSelectedDay(d);
              setForm((f) => ({ ...f, day: d }));
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold relative ${
              selectedDay === d ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            } ${d === todayDay ? "ring-2 ring-red-400" : ""}`} // Highlight today with a ring
          >
            {d}
            {d === todayDay && (
              <span className="ml-2 inline-block bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Today
              </span>
            )}
          </button>
        ))}
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-8 gap-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Category (tea / coffee)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded md:col-span-2"
        />
        <select
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
          className="border p-2 rounded"
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={form.mealSlot}
          onChange={(e) => setForm({ ...form, mealSlot: e.target.value })}
          className="border p-2 rounded"
        >
          {mealSlots.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
          className="border p-2 rounded"
        />
        <button
          onClick={addOrUpdate}
          disabled={loading}
          className={`${editingId ? "bg-blue-600" : "bg-green-600"} text-white rounded`}
        >
          {editingId ? "Update" : loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Day</th>
              <th className="p-3 text-left">Meal</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {dayFilteredMenu.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="p-3">
                    <img
                      src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/60"}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColors(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">{item.day}</td>
                  <td className="p-3 capitalize">{item.mealSlot}</td>
                  <td className="p-3 font-semibold">₹{item.price}</td>
                  <td className="p-3 text-right space-x-3">
                    <button onClick={() => startEdit(item)} className="text-blue-600 text-xs hover:underline">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="text-red-600 text-xs hover:underline">
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {dayFilteredMenu.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow p-4 flex gap-3"
            >
              <img
                src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/60"}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${badgeColors(item.category)}`}>
                  {item.category}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {item.day} • {item.mealSlot}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-semibold">₹{item.price}</span>
                  <div className="space-x-3">
                    <button onClick={() => startEdit(item)} className="text-blue-600 text-xs">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="text-red-600 text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {dayFilteredMenu.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No items for {selectedDay}</div>
      )}
    </div>
  );
}