import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  /* ================= CLEAR CART IF CHECKOUT REFRESH ================= */
  useEffect(() => {
    const checkoutRefresh = sessionStorage.getItem("checkout_refresh");

    if (checkoutRefresh === "true") {
      setCart([]);
      sessionStorage.removeItem("checkout_refresh");
    }
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      return exists
        ? prev.map((i) =>
            i._id === item._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  /* ================= REMOVE ================= */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  /* ================= CLEAR CART ================= */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
