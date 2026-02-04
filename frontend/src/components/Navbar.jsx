import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  User,
  HelpCircle,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useMediaQuery } from "@mui/material"; // Assuming MUI is available for responsive checks

export default function UserNavbar() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const isMobile = useMediaQuery("(max-width: 768px)"); // Mobile check

  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);

  const userRole = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* CART COUNT */
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  /* CLOSE PROFILE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative z-50">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <img
            src="https://www.nin.res.in/launch/assets/img/NIN%20logo%20latest1.png"
            alt="logo"
            className="h-8 cursor-pointer"
            onClick={() =>
              navigate(userRole === "admin" ? "/admin" : "/user")
            }
          />
        </div>

        {/* RIGHT */}
        {userRole === "admin" ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-6 text-sm font-medium">
            {/* SEARCH */}
            <NavItem
              icon={<Search size={18} />}
              label="Search"
              onClick={() => toggle(setShowSearch)}
            />

            {/* HELP */}
            <NavItem
              icon={<HelpCircle size={18} />}
              label="Help"
              onClick={() => toggle(setShowHelp)}
            />

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => toggle(setShowProfile)}
                className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
              >
                <User size={18} />
                <span className="hidden sm:block">My Account</span>
              </div>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} />
                    Canteen Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* CART */}
            <div
              className="relative cursor-pointer"
              onClick={() => toggle(setShowCart)}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ================= USER PANELS ================= */}
      {userRole !== "admin" && (
        <>
          {/* SEARCH */}
          {showSearch && (
            <Panel onClose={() => setShowSearch(false)}>
              <input
                placeholder="Search food items..."
                className="w-full border p-2 rounded focus:ring-orange-400"
              />
            </Panel>
          )}

          {/* HELP */}
          {showHelp && (
            <Modal onClose={() => setShowHelp(false)} title="Report an Issue">
              <input
                placeholder="Issue Title"
                className="border p-2 w-full rounded mb-3"
              />
              <textarea
                placeholder="Describe your issue"
                className="border p-2 w-full rounded mb-3"
                rows="4"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded w-full">
                Submit
              </button>
            </Modal>
          )}

          {/* CART - RESPONSIVE */}
          {showCart && (
            isMobile ? (
              // BOTTOM SHEET FOR MOBILE
              <div className="fixed bottom-0 left-0 w-full bg-white shadow-xl z-50 p-4 rounded-t-lg max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Your Cart</h2>
                  <X
                    className="cursor-pointer"
                    onClick={() => setShowCart(false)}
                  />
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    🛒 Cart is empty
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="border-b py-3 flex items-center gap-3"
                      >
                        <img
                          src={
                            item.image
                              ? `http://localhost:5000${item.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} | ₹{item.price * item.quantity}
                          </p>
                        </div>
                        <X
                          size={16}
                          className="cursor-pointer text-red-500"
                          onClick={() => removeFromCart(item._id)}
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setShowCart(false);
                        navigate("/checkout");
                      }}
                      className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Go to Checkout
                    </button>
                  </>
                )}
              </div>
            ) : (
              // SIDE DRAWER FOR DESKTOP
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Your Cart</h2>
                  <X
                    className="cursor-pointer"
                    onClick={() => setShowCart(false)}
                  />
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    🛒 Cart is empty
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="border-b py-2 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>₹{item.price * item.quantity}</span>
                          <X
                            size={16}
                            className="cursor-pointer text-red-500"
                            onClick={() => removeFromCart(item._id)}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setShowCart(false);
                        navigate("/checkout");
                      }}
                      className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Go to Checkout
                    </button>
                  </>
                )}
              </div>
            )
          )}
        </>
      )}
    </>
  );
}

/* ================= HELPERS ================= */

function toggle(setter) {
  setter((p) => !p);
}

function NavItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </div>
  );
}

function Panel({ children, onClose }) {
  return (
    <div className="absolute right-6 top-20 bg-white shadow-lg rounded-lg p-4 w-80 z-40">
      <X
        className="absolute top-3 right-3 cursor-pointer"
        onClick={onClose}
      />
      {children}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-[90%] p-6 relative">
        <h2 className="font-bold text-lg mb-4">{title}</h2>
        <X
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}