import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  const fetchMenu = async () => {
    const res = await api.get("/menu");
    setMenu(res.data);
  };

  const addItem = async () => {
    if (!form.name || !form.price || !form.category) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    await api.post("/menu", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setForm({ name: "", price: "", category: "", image: null });
    fetchMenu();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
            className="border p-2 rounded"
          />
          <button
            onClick={addItem}
            className="bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Item</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {menu.map((item) => (
                <motion.tr key={item._id}>
                  <td className="p-3">
                    <img
                      src={
                        item.image
                          ? `http://localhost:5000${item.image}`
                          : "https://via.placeholder.com/60"
                      }
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">₹{item.price}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
