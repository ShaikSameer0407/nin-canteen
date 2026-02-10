import { useEffect, useState } from "react";
import {
  Pizza,
  IceCream,
  CupSoda,
  Beef,
  Sandwich,
  Soup,
  Cake,
  Coffee,
  UtensilsCrossed,
  Candy,
  Plus,
  CalendarDays,
} from "lucide-react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

/* ================= CATEGORY CONFIG ================= */
const categories = [
  { name: "All", icon: <Beef size={28} /> },
  { name: "Rice", icon: <Soup size={28} /> },
  { name: "Tiffins", icon: <UtensilsCrossed size={28} /> },
  { name: "Tea/Coffee", icon: <Coffee size={28} /> },
  { name: "Phulka/Egg/Chicken", icon: <Beef size={28} /> },
];

/* ================= TIME SLOTS CONFIG ================= */
const timeSlots = [
  { key: "breakfast", label: "Breakfast", color: "bg-orange-500" },
  { key: "lunch", label: "Lunch", color: "bg-green-600" },
  { key: "snacks", label: "Evening Snacks & Tea", color: "bg-purple-600" },
];

export default function UserDashboard() {
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [now] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenu(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Menu fetch error:", err.response?.data || err.message);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  /* ================= DATE HELPERS ================= */
  const today = now.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const isHoliday = today === "Saturday" || today === "Sunday";

  /* ================= FILTER BY TODAY ================= */
  const todayMenu = menu.filter(
    (item) => item.day?.toLowerCase() === today.toLowerCase()
  );

  /* ================= CATEGORY FILTER ================= */
  const categoryFiltered =
    activeCategory === "All"
      ? todayMenu
      : todayMenu.filter(
          (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  const hasAnyItems = categoryFiltered.length > 0;

  /* ================= GROUP BY MEAL SLOT ================= */
  const groupedMenu = {
    breakfast: categoryFiltered.filter((i) => i.mealSlot === "breakfast"),
    lunch: categoryFiltered.filter((i) => i.mealSlot === "lunch"),
    snacks: categoryFiltered.filter((i) => i.mealSlot === "snacks"),
  };

  /* ================= TIME-BASED PRIORITIZATION ================= */
  const currentHour = now.getHours();
  let prioritizedSlots = [...timeSlots];
  if (currentHour < 12) {
    // Morning: Breakfast first
    prioritizedSlots = [timeSlots[0], timeSlots[1], timeSlots[2]];
  } else if (currentHour < 17) {
    // Afternoon: Lunch first
    prioritizedSlots = [timeSlots[1], timeSlots[0], timeSlots[2]];
  } else {
    // Evening: Snacks first
    prioritizedSlots = [timeSlots[2], timeSlots[0], timeSlots[1]];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 md:px-8 py-6">

        {/* ================= LIVE DATE HEADER ================= */}
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="text-blue-600" />
          <div>
            <h2 className="text-xl font-bold">
              {today}, {dateStr}
            </h2>
          </div>
        </div>

        {/* ================= CATEGORY STRIP ================= */}
        <div className="flex gap-6 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center cursor-pointer min-w-[90px]
                ${activeCategory === cat.name ? "text-orange-500" : "text-gray-600"}`}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-2
                ${activeCategory === cat.name ? "bg-orange-100" : "bg-white"} shadow`}
              >
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-center">{cat.name}</span>
            </div>
          ))}
        </div>

        <hr className="border-t-4 border-gray-300 mb-8" />

        {/* ================= STATES ================= */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading menu...</div>
        ) : isHoliday ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <img
              src="https://clipart-library.com/img/1169900.gif"
              alt="Holiday"
              className="w-56 mb-6"
            />
            <h3 className="text-2xl font-bold text-gray-700">🎉 Today is a Holiday</h3>
            <p className="text-gray-500 mt-2">The canteen is closed on weekends.</p>
          </motion.div>
        ) : !hasAnyItems ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.img
              src="https://clipart-library.com/img/1169900.gif"
              alt="No items"
              className="w-64 mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
            <h3 className="text-2xl font-bold text-gray-700">
              No items available today 🍽️
            </h3>
          </motion.div>
        ) : (
          prioritizedSlots.map((slot, idx) =>
            groupedMenu[slot.key].length === 0 ? null : (
              <motion.div
                key={slot.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="mb-12"
              >
                {/* ===== Animated Meal Header ===== */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.6 }}
                  className={`inline-block px-5 py-2 rounded-full text-white font-bold text-sm tracking-wide ${slot.color} shadow-md`}
                >
                  {slot.label.toUpperCase()}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  {groupedMenu[slot.key].map((item) => (
                    <motion.div
                      key={item.id || item._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.image
                              ? `http://localhost:5000${item.image}`
                              : "https://via.placeholder.com/60"
                          }
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold">₹{item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-blue-900 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-800 transition"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )
        )}
      </div>
    </div>
  );
}