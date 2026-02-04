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
} from "lucide-react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= CATEGORY CONFIG ================= */
const categories = [
  { name: "All", icon: <Beef size={28} /> },
  { name: "Biryani", icon: <Soup size={28} /> },
  { name: "Cakes", icon: <Cake size={28} /> },
  { name: "Pizzas", icon: <Pizza size={28} /> },
  { name: "Burgers", icon: <Sandwich size={28} /> },
  { name: "Noodles", icon: <Beef size={28} /> },
  { name: "Ice-Cream", icon: <IceCream size={28} /> },
  { name: "Shakes", icon: <CupSoda size={28} /> },
  { name: "Tea", icon: <Coffee size={28} /> },
  { name: "Tiffins", icon: <UtensilsCrossed size={28} /> },
  { name: "Chocolates", icon: <Candy size={28} /> },
  { name: "Cool Drinks", icon: <CupSoda size={28} /> },
];

export default function UserDashboard() {
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const { addToCart } = useCart();
  const navigate = useNavigate();

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    api
      .get("/menu")
      .then((res) => {
        setMenu(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Menu fetch error:", err);
        setMenu([]);
      });
  }, []);

  /* ================= FILTER MENU ================= */
  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter(
          (item) =>
            item.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  /* ================= BUY NOW ================= */
  const buyNow = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <div className="px-4 md:px-8 py-6">
        <h2 className="text-xl font-bold mb-4">
          What’s on your mind?
        </h2>

        {/* ================= CATEGORY STRIP ================= */}
        <div className="flex gap-6 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center cursor-pointer min-w-[90px]
                ${
                  activeCategory === cat.name
                    ? "text-orange-500"
                    : "text-gray-600"
                }`}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-2
                ${
                  activeCategory === cat.name
                    ? "bg-orange-100"
                    : "bg-white"
                } shadow`}
              >
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* ================= THICK HORIZONTAL LINE ================= */}
        <hr className="border-t-4 border-gray-300 mb-8" />

        {/* ================= MENU GRID / EMPTY STATE ================= */}
        {filteredMenu.length === 0 ? (
          /* ========== ANIMATED EMPTY STATE ========== */
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mt-20 text-center px-4"
          >
            <motion.img
              src="https://clipart-library.com/img/1169900.gif"
              
              className="w-64 max-w-full mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />

            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Oops! No items here 🍽️
            </h3>

            <p className="text-gray-500 max-w-md">
              This category doesn’t have any items right now.
              Try another category or check back later!
            </p>
          </motion.div>
        ) : (
          /* ========== MENU ITEMS ========== */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMenu.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
              >
                <img
                  src={
                    item.image
                      ? `http://localhost:5000${item.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={item.name}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  ₹{item.price}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full sm:w-1/2 bg-orange-300 text-white py-2 rounded-lg hover:bg-orange-400 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => buyNow(item)}
                    className="w-full sm:w-1/2 bg-orange-300 text-white py-2 rounded-lg hover:bg-orange-400 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}