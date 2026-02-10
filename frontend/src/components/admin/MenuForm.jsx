import { useState } from "react";
import { api } from "../../api/api";

export default function MenuForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    day: "Monday",
    mealSlot: "breakfast",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!form.name || !form.price || !form.category) {
        alert("Name, price and category are required");
        return;
      }

      if (image && !image.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price)); // 🔢 cast to number
      formData.append("category", form.category);
      formData.append("description", form.description || "");
      formData.append("day", form.day);
      formData.append("mealSlot", form.mealSlot);
      if (image) formData.append("image", image);

      await api.post("/menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        day: "Monday",
        mealSlot: "breakfast",
      });
      setImage(null);

      await onAdd?.(); // 🔁 ensure UI refresh after save
      alert("Menu item added ✅");
    } catch (err) {
      console.error("Add menu error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
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
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded col-span-2"
        />

        <select
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
          className="border p-2 rounded"
        >
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
            (d) => (
              <option key={d} value={d}>
                {d}
              </option>
            )
          )}
        </select>

        <select
          value={form.mealSlot}
          onChange={(e) => setForm({ ...form, mealSlot: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="snacks">Snacks</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Adding..." : "Add Menu"}
      </button>
    </div>
  );
}
