import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/authMiddleware.js";
import { Op, fn, col, literal } from "sequelize";

const router = express.Router();

/* ================= KPIs ================= */
router.get("/kpis", async (req, res) => {
  try {
    const orders = await Order.findAll();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    const breakfastOrders = orders.filter((o) =>
      (o.items || []).some((i) => i.category === "breakfast")
    ).length;

    const lunchOrders = orders.filter((o) =>
      (o.items || []).some((i) => i.category === "lunch")
    ).length;

    res.json({ totalOrders, totalRevenue, breakfastOrders, lunchOrders });
  } catch (err) {
    console.error("KPI error:", err);
    res.status(500).json({ message: "Failed to load KPIs" });
  }
});

/* ================= OVERVIEW ================= */
router.get("/overview", async (req, res) => {
  try {
    const orders = await Order.findAll();

    const map = {};

    orders.forEach((o) => {
      (o.items || []).forEach((i) => {
        const category = i.category || "other";
        const price = Number(i.price || 0);
        const qty = Number(i.quantity || 1);
        map[category] = (map[category] || 0) + price * qty;
      });
    });

    const result = Object.keys(map).map((k) => ({
      category: k,
      revenue: map[k],
    }));

    res.json(result);
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ message: "Failed to load overview" });
  }
});

/* ================= BREAKDOWN ================= */
router.get("/breakdown", async (req, res) => {
  try {
    const orders = await Order.findAll();

    const map = {};

    orders.forEach((o) => {
      const date = new Date(o.createdAt).toISOString().slice(0, 10);

      if (!map[date]) {
        map[date] = { date, breakfast: 0, lunch: 0, snacks: 0, revenue: 0 };
      }

      (o.items || []).forEach((i) => {
        const cat = i.category || "snacks";
        map[date][cat] += 1;
        map[date].revenue += Number(i.price || 0) * Number(i.quantity || 1);
      });
    });

    res.json(Object.values(map));
  } catch (err) {
    console.error("Breakdown error:", err);
    res.status(500).json({ message: "Failed to load breakdown" });
  }
});

export default router;
