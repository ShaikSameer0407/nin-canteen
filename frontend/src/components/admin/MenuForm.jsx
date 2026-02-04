import { useState } from "react";
import { api } from "../../api/api";

export default function MenuForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", price: "", category: "" });

  const submit = async () => {
    await api.post("/menu", form);
    setForm({ name: "", price: "", category: "" });
    onAdd();
  };

  return (
    <div className="flex gap-3 mb-6">
      {["name", "price", "category"].map((f) => (
        <input
          key={f}
          placeholder={f}
          value={form[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          className="border p-2"
        />
      ))}
      <button onClick={submit} className="bg-green-600 text-white px-4">
        Add
      </button>
    </div>
  );
}
